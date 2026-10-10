// ============================================
// REAL EMAIL & GMAIL NOTIFICATION SERVICE (NODEMAILER)
// Farm to Fork Collective
// Official Admin: anushiyaselvi06@gmail.com
// Full support for User Confirmations, Admin Alerts,
// Google Sign-In Security Alerts, Orders, Products, Donations & Reset
// ============================================

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
  console.warn('[EmailService] Notice: nodemailer module not installed.');
}

const PLACEHOLDER_PASSWORDS = [
  'app_password_placeholder',
  'gmail_16_digit_app_password',
  'your_email_password_or_app_token',
  'your-gmail-app-password',
  'your_gmail_password',
  'password',
  'change_me',
  'xxxx yyyy zzzz wwww'
];

const PLACEHOLDER_EMAILS = [
  'your_email@gmail.com',
  'your-real-gmail@gmail.com',
  'user@example.com'
];

class EmailService {
  constructor() {
    this.transporter = null;
    this.activeConfigKey = null;
    this.adminEmail = (process.env.ADMIN_EMAIL || 'anushiyaselvi06@gmail.com').trim().toLowerCase();
    this.dispatchLogs = []; // In-memory audit trail of dispatched emails (max 100)
  }

  // Official Admin Email getter
  getAdminEmail() {
    return (process.env.ADMIN_EMAIL || this.adminEmail || 'anushiyaselvi06@gmail.com').trim().toLowerCase();
  }

  // Validate email address format strictly (RFC 5322 compliance)
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const clean = email.trim();
    if (clean.length > 254 || clean.length < 5) return false;
    // Standard RFC-compliant email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(clean);
  }

  // Determine whether given string is a dummy placeholder or empty
  isPlaceholderValue(val, isEmail = false) {
    if (!val || typeof val !== 'string') return true;
    const clean = val.trim().toLowerCase();
    if (clean === '') return true;
    if (isEmail) {
      return PLACEHOLDER_EMAILS.includes(clean);
    }
    return PLACEHOLDER_PASSWORDS.includes(clean);
  }

  // Build and cache Nodemailer transporter based on current process.env
  getTransporter() {
    if (!nodemailer) return null;

    const gmailUser = (process.env.GMAIL_USER || process.env.ADMIN_EMAIL || 'anushiyaselvi06@gmail.com').trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '');
    const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = (process.env.SMTP_USER || gmailUser).trim();
    const smtpPass = (process.env.SMTP_PASS || gmailPass).trim().replace(/\s+/g, '');

    // Check if Gmail App Password configuration is valid
    const hasValidGmail = gmailUser && gmailPass && 
      !this.isPlaceholderValue(gmailUser, true) && 
      !this.isPlaceholderValue(gmailPass);

    // Check if Custom SMTP configuration is valid
    const hasValidSmtp = smtpHost && smtpUser && smtpPass && 
      !this.isPlaceholderValue(smtpUser, true) && 
      !this.isPlaceholderValue(smtpPass);

    const configKey = `${hasValidGmail ? 'gmail:' + gmailUser : ''}|${hasValidSmtp ? 'smtp:' + smtpHost + ':' + smtpPort + ':' + smtpUser : ''}`;

    if (this.transporter && this.activeConfigKey === configKey) {
      return this.transporter;
    }

    this.transporter = null;
    this.activeConfigKey = configKey;

    if (hasValidGmail) {
      try {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        return this.transporter;
      } catch (err) {
        console.warn('[EmailService] Failed to create Gmail transporter:', err.message);
      }
    } else if (hasValidSmtp) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        return this.transporter;
      } catch (err) {
        console.warn('[EmailService] Failed to create SMTP transporter:', err.message);
      }
    }

    return null;
  }

  // Returns true if real Gmail or SMTP credentials are configured in environment
  isConfigured() {
    return Boolean(this.getTransporter());
  }

  // Test the live connection to SMTP/Gmail server
  async verifyConnection() {
    const transporter = this.getTransporter();
    if (!transporter) {
      return {
        configured: false,
        verified: false,
        adminEmail: this.getAdminEmail(),
        message: 'Gmail SMTP service is not configured. Please add a valid 16-character Google App Password in server/.env.'
      };
    }
    try {
      await transporter.verify();
      return {
        configured: true,
        verified: true,
        adminEmail: this.getAdminEmail(),
        message: 'Gmail SMTP connection verified successfully.'
      };
    } catch (err) {
      console.warn('[EmailService] SMTP verification failed:', err.message);
      return {
        configured: true,
        verified: false,
        adminEmail: this.getAdminEmail(),
        error: err.code || 'VERIFICATION_ERROR',
        message: this.formatErrorMessage(err)
      };
    }
  }

  // Convert raw SMTP errors to clean, actionable user-friendly messages
  formatErrorMessage(err) {
    if (!err) return 'Unknown email delivery error.';
    const msg = err.message || '';
    if (err.code === 'EAUTH' || msg.includes('Invalid login') || msg.includes('BadCredentials')) {
      return 'Gmail SMTP authentication failed. Please verify your Google account email and 16-character Google App Password (with 2-Step Verification enabled) in server/.env.';
    }
    if (err.code === 'ESOCKETTIMEDOUT' || err.code === 'ETIMEDOUT') {
      return 'SMTP connection timed out. Please check your network connection and port settings (587 or 465).';
    }
    if (err.code === 'ECONNREFUSED') {
      return 'SMTP connection refused by server. Please check SMTP_HOST and SMTP_PORT.';
    }
    return msg;
  }

  // Log dispatch record into in-memory audit ring
  logDispatch(record) {
    const target = (record && (record.to || record.recipient)) || '';
    this.dispatchLogs.unshift({
      id: 'eml-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ...record,
      recipient: target,
      to: target
    });
    if (this.dispatchLogs.length > 100) {
      this.dispatchLogs.pop();
    }
  }

  // Retrieve recent dispatch audit records
  getDispatchLogs() {
    return this.dispatchLogs;
  }

  // Format current timestamp in standard Indian/IST or UTC format
  formatTimestamp(date = new Date()) {
    try {
      return new Date(date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }) + ' IST';
    } catch (e) {
      return new Date(date).toUTCString();
    }
  }

  // ----------------------------------------------------
  // REUSABLE BRANDED HTML EMAIL LAYOUT GENERATOR
  // Farm to Fork Collective Design System
  // ----------------------------------------------------
  renderEmailLayout({
    title,
    subtitle = 'Pure Organic Food • Seed to Plate Traceability',
    badgeText,
    badgeColor = '#16a34a', // green
    badgeBg = '#dcfce7',
    greeting,
    introText,
    detailsRows = [], // array of { label, value, isHighlight?: boolean }
    actionBtn = null, // { text, url }
    alertBox = null,  // { type: 'warning'|'info'|'success', title, text }
    footerNotice = null,
    recipientEmail
  }) {
    const formattedDate = this.formatTimestamp();

    const detailsTableHtml = detailsRows.length > 0 ? `
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${detailsRows.map(row => `
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 10px 8px; color: #64748b; font-weight: 600; width: 38%; vertical-align: top;">${row.label}</td>
              <td style="padding: 10px 8px; color: ${row.isHighlight ? '#15803d' : '#0f172a'}; font-weight: ${row.isHighlight ? '700' : '500'}; line-height: 1.5;">${row.value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    ` : '';

    const actionBtnHtml = actionBtn ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${actionBtn.url}" style="display: inline-block; background: linear-gradient(135deg, #15803d 0%, #16a34a 100%); color: #ffffff !important; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.35);">${actionBtn.text}</a>
      </div>
    ` : '';

    let alertBoxHtml = '';
    if (alertBox) {
      const isWarn = alertBox.type === 'warning';
      const isSuccess = alertBox.type === 'success';
      const bg = isWarn ? '#fef2f2' : (isSuccess ? '#f0fdf4' : '#eff6ff');
      const border = isWarn ? '#ef4444' : (isSuccess ? '#22c55e' : '#3b82f6');
      const textCol = isWarn ? '#991b1b' : (isSuccess ? '#166534' : '#1e40af');

      alertBoxHtml = `
        <div style="background-color: ${bg}; border-left: 4px solid ${border}; border-radius: 8px; padding: 14px 18px; margin: 24px 0; color: ${textCol}; font-size: 13.5px; line-height: 1.5;">
          ${alertBox.title ? `<strong style="display: block; margin-bottom: 4px;">${alertBox.title}</strong>` : ''}
          ${alertBox.text}
        </div>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #1e293b; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
    .email-header { background: linear-gradient(135deg, #14532d 0%, #15803d 60%, #16a34a 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .email-header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .email-header p { margin: 6px 0 0; font-size: 13px; opacity: 0.92; letter-spacing: 0.2px; }
    .email-body { padding: 32px 28px; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12.5px; font-weight: 700; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.5px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .intro { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 24px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5; }
    @media only screen and (max-width: 480px) {
      .email-body { padding: 24px 18px; }
      .email-header h1 { font-size: 21px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h1>🌱 Farm to Fork Collective</h1>
      <p>${subtitle}</p>
    </div>
    <div class="email-body">
      ${badgeText ? `
        <div>
          <span class="badge" style="background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor}33;">
            ${badgeText}
          </span>
        </div>
      ` : ''}

      ${greeting ? `<div class="greeting">${greeting}</div>` : ''}
      ${introText ? `<div class="intro">${introText}</div>` : ''}

      ${detailsTableHtml}

      ${actionBtnHtml}

      ${alertBoxHtml}

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8;">
        <span>📅 Timestamp: <strong>${formattedDate}</strong></span>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0; font-weight: 600; color: #64748b;">Farm to Fork Collective • Empowering Sustainable Agriculture</p>
      <p style="margin: 4px 0 0;">Official Admin: <a href="mailto:${this.getAdminEmail()}" style="color: #16a34a; text-decoration: none;">${this.getAdminEmail()}</a></p>
      ${recipientEmail ? `<p style="margin: 6px 0 0; font-size: 11px;">This notification was delivered to <strong>${recipientEmail}</strong>.</p>` : ''}
      ${footerNotice ? `<p style="margin: 6px 0 0; font-size: 11px;">${footerNotice}</p>` : ''}
    </div>
  </div>
</body>
</html>
    `;
  }

  // ----------------------------------------------------
  // BASE SEND EMAIL DISPATCHER
  // ----------------------------------------------------
  async sendEmail({ to, subject, html, text, from, isSystemAdminAlert = false }) {
    if (!this.isValidEmail(to)) {
      const errRes = {
        success: false,
        channel: 'email',
        status: 'invalid_recipient',
        recipient: to,
        message: `Invalid recipient email address format: "${to}".`
      };
      this.logDispatch({ to, subject, status: 'invalid_recipient', error: errRes.message });
      return errRes;
    }

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      const errRes = {
        success: false,
        channel: 'email',
        status: 'invalid_subject',
        recipient: to,
        message: 'A non-empty email subject line is required.'
      };
      this.logDispatch({ to, subject, status: 'invalid_subject', error: errRes.message });
      return errRes;
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      const notConfiguredMsg = 'Gmail SMTP credentials are not configured in server/.env. Please configure GMAIL_USER & GMAIL_APP_PASSWORD with a valid 16-character Google App Password.';
      console.warn(`[EmailService] SMTP not configured. Skipped dispatch to ${to} (${subject}).`);
      const errRes = {
        success: false,
        channel: 'email',
        status: 'not_configured',
        recipient: to,
        message: notConfiguredMsg
      };
      this.logDispatch({ to, subject, status: 'not_configured', error: notConfiguredMsg });
      return errRes;
    }

    try {
      const defaultFrom = process.env.EMAIL_FROM || `"${process.env.VITE_APP_TITLE || 'Farm to Fork Collective'}" <${this.getAdminEmail()}>`;
      const sender = from || defaultFrom;

      const info = await transporter.sendMail({
        from: sender,
        to: to.trim().toLowerCase(),
        subject,
        text: text || '',
        html: html || `<p>${text || subject}</p>`
      });

      console.log(`[EmailService:SUCCESS] Sent email to ${to} | Subject: "${subject}" | MessageId: ${info.messageId}`);
      
      const successRes = {
        success: true,
        channel: 'email',
        status: 'sent',
        recipient: to,
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      };

      this.logDispatch({ to, subject, status: 'sent', messageId: info.messageId });
      return successRes;
    } catch (err) {
      const formatted = this.formatErrorMessage(err);
      console.warn(`[EmailService:ERROR] Failed to send email to ${to}: ${err.message}`);
      
      const failRes = {
        success: false,
        channel: 'email',
        status: 'error',
        recipient: to,
        errorCode: err.code || 'SEND_ERROR',
        message: formatted
      };

      this.logDispatch({ to, subject, status: 'failed', errorCode: err.code, error: formatted });
      return failRes;
    }
  }

  // ----------------------------------------------------
  // 1. USER REGISTRATION / WELCOME EMAIL
  // ----------------------------------------------------
  async sendWelcomeEmail({ to, name, role = 'customer', phone = '' }) {
    const greeting = name ? `Welcome to the Collective, ${name}!` : 'Welcome to Farm to Fork Collective!';
    const subject = 'Welcome to Farm to Fork Collective 🌱 - Pure Organic Food';
    const roleCapitalized = (role || 'customer').charAt(0).toUpperCase() + (role || 'customer').slice(1);

    const detailsRows = [
      { label: 'Registered Name', value: name || 'Valued Member' },
      { label: 'Registered Email', value: to },
      { label: 'Member Role', value: roleCapitalized, isHighlight: true },
      ...(phone ? [{ label: 'Contact Phone', value: phone }] : []),
      { label: 'Traceability Access', value: 'Seed-to-Plate QR Enabled' }
    ];

    const actionUrl = role === 'farmer' ? 'http://localhost:5173/pages/dashboard-farmer.html' :
      (role === 'artisan' ? 'http://localhost:5173/pages/dashboard-artisan.html' : 'http://localhost:5173/pages/login.html');

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: '🎉 Welcome to Farm to Fork',
      badgeColor: '#16a34a',
      badgeBg: '#dcfce7',
      greeting,
      introText: `Thank you for registering with <strong>Farm to Fork Collective</strong> as an official <strong>${roleCapitalized}</strong>. Our mission connects you directly with 100% verified, pesticide-free organic harvests and sustainable artisan produce with seed-to-plate traceability.`,
      detailsRows,
      actionBtn: {
        text: 'Access Your Marketplace Dashboard',
        url: actionUrl
      },
      alertBox: {
        type: 'info',
        title: '🌟 Getting Started',
        text: role === 'farmer' 
          ? 'As a registered Farmer, you can add new organic harvests, track farm soil events, and generate tamper-proof QR codes.'
          : (role === 'artisan'
            ? 'As an Artisan, you can list your handcrafted items, preserve heritage food traditions, and reach conscious consumers.'
            : 'You can now browse 34+ certified organic vegetables, join group buying pools, and trace every crop from farm to table.')
      },
      recipientEmail: to
    });

    const plainText = `${greeting}

Thank you for registering with Farm to Fork Collective as a ${roleCapitalized}.

Account Details:
- Name: ${name || 'Valued Member'}
- Email: ${to}
- Role: ${roleCapitalized}
${phone ? '- Phone: ' + phone : ''}

Sign in to your account: ${actionUrl}

Best regards,
Farm to Fork Collective Team
Seed-to-Plate Transparency`;

    const userResult = await this.sendEmail({
      to,
      subject,
      text: plainText,
      html: htmlContent
    });

    // Also dispatch activity notification to Admin
    this.sendAdminNewUserAlert({
      name,
      email: to,
      role: roleCapitalized,
      phone
    }).catch(e => console.warn('[EmailService:AdminAlert] Registration notice failed:', e.message));

    return userResult;
  }

  // ----------------------------------------------------
  // 2. GOOGLE SIGN-IN SECURITY NOTIFICATION
  // ----------------------------------------------------
  async sendGoogleLoginNotification({ to, name, googleId, timestamp = new Date() }) {
    const greeting = name ? `Hello ${name},` : 'Hello,';
    const subject = 'Security Alert: New Sign-In via Google - Farm to Fork Collective';

    const detailsRows = [
      { label: 'Google Account', value: to },
      { label: 'Account Name', value: name || 'Verified User' },
      { label: 'Sign-In Method', value: 'Google OAuth 2.0 (GIS Verified)', isHighlight: true },
      { label: 'Security Status', value: 'Verified & Encrypted' },
      { label: 'Time of Login', value: this.formatTimestamp(timestamp) }
    ];

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: '🛡️ Google Sign-In Detected',
      badgeColor: '#2563eb',
      badgeBg: '#eff6ff',
      greeting,
      introText: `We detected a successful sign-in to your Farm to Fork Collective account using your verified Google credentials.`,
      detailsRows,
      actionBtn: {
        text: 'View Your Account Profile',
        url: 'http://localhost:5173/pages/profile.html'
      },
      alertBox: {
        type: 'info',
        title: '🔒 Was this you?',
        text: 'If this was you, you can safely disregard this email. If you did not sign in or suspect unauthorized access, please update your account credentials immediately or contact support at anushiyaselvi06@gmail.com.'
      },
      recipientEmail: to
    });

    const plainText = `${greeting}

A new sign-in was detected for your Farm to Fork Collective account via Google OAuth.

Sign-In Details:
- Email: ${to}
- Name: ${name || 'User'}
- Time: ${this.formatTimestamp(timestamp)}

If you did not initiate this sign-in, please contact support immediately at anushiyaselvi06@gmail.com.

Best regards,
Farm to Fork Collective Security`;

    const userResult = await this.sendEmail({
      to,
      subject,
      text: plainText,
      html: htmlContent
    });

    // Notify Admin of Google sign-in activity
    this.sendAdminActivityNotification({
      type: 'google_login',
      title: 'Google Sign-In Activity',
      details: [
        { label: 'User Name', value: name || 'Google User' },
        { label: 'Gmail Address', value: to },
        { label: 'Provider', value: 'Google OAuth 2.0' },
        { label: 'Time', value: this.formatTimestamp(timestamp) }
      ]
    }).catch(e => console.warn('[EmailService:AdminAlert] Google login notice failed:', e.message));

    return userResult;
  }

  // ----------------------------------------------------
  // 3. ORDER CONFIRMATION EMAIL (USER + ADMIN)
  // ----------------------------------------------------
  async sendOrderConfirmation({ order, customer }) {
    if (!order) return { success: false, message: 'Order object is required.' };

    const to = (order.customerEmail || (customer && customer.email) || '').trim().toLowerCase();
    const customerName = order.customerName || (customer && customer.name) || 'Valued Customer';
    const orderId = order.id || '#FTF-ORDER';
    const total = order.total || 0;
    const subject = `Order Confirmed: ${orderId} (₹${total}) - Farm to Fork Collective 🌱`;

    // Construct itemized details
    const items = order.items || [];
    const itemsSummary = items.map(item => 
      `${item.name} x ${item.quantity} ${item.unit || 'kg'} (₹${(item.price * item.quantity).toFixed(0)})`
    ).join(', ');

    const detailsRows = [
      { label: 'Order ID', value: orderId, isHighlight: true },
      { label: 'Total Amount', value: `₹${total}`, isHighlight: true },
      { label: 'Items Ordered', value: itemsSummary || 'Fresh Organic Produce' },
      { label: 'Delivery Slot', value: order.slot || 'Morning (7:00 AM - 10:00 AM)' },
      { label: 'Delivery Address', value: order.address || 'Standard Registered Address' },
      { label: 'Payment Method', value: order.paymentMode || 'Instant UPI / Direct Pay' },
      { label: 'Order Status', value: order.status || 'Confirmed & Processing' }
    ];

    if (order.discount && order.discount > 0) {
      detailsRows.splice(2, 0, { label: 'Discount Applied', value: `-₹${order.discount}` });
    }

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: '✅ Order Confirmed',
      badgeColor: '#16a34a',
      badgeBg: '#dcfce7',
      greeting: `Thank you for your order, ${customerName}!`,
      introText: `Your organic harvest order <strong>${orderId}</strong> has been received by our farmer network and is now being packed with cold-chain freshness.`,
      detailsRows,
      actionBtn: {
        text: 'Track Order & Seed-to-Plate Traceability',
        url: 'http://localhost:5173/pages/dashboard-customer.html'
      },
      alertBox: {
        type: 'success',
        title: '🌱 Seed-to-Plate Promise',
        text: 'Every item in your order is 100% certified organic and harvested fresh without synthetic pesticides. You can inspect the crop timeline by scanning the QR code on your delivery box!'
      },
      recipientEmail: to
    });

    const plainText = `Thank you for your order, ${customerName}!

Your order ${orderId} has been confirmed.

Order Summary:
- Order ID: ${orderId}
- Total: ₹${total}
- Items: ${itemsSummary}
- Delivery Slot: ${order.slot || 'Morning'}
- Address: ${order.address || 'Standard Address'}
- Payment: ${order.paymentMode || 'UPI'}

Track your order: http://localhost:5173/pages/dashboard-customer.html

Best regards,
Farm to Fork Collective`;

    const userResult = await this.sendEmail({
      to,
      subject,
      text: plainText,
      html: htmlContent
    });

    // Also dispatch activity notification to Admin
    this.sendAdminNewOrderAlert({ order, customer }).catch(e => {
      console.warn('[EmailService:AdminAlert] New order notice failed:', e.message);
    });

    return userResult;
  }

  // ----------------------------------------------------
  // 4. PRODUCT SUBMISSION CONFIRMATION (SELLER + ADMIN)
  // ----------------------------------------------------
  async sendProductSubmissionConfirmation({ product, seller }) {
    if (!product) return { success: false, message: 'Product object is required.' };

    const to = (seller && seller.email ? seller.email : '').trim().toLowerCase();
    const sellerName = (seller && seller.name) || product.seller || 'Producer';
    const productName = product.name || 'Organic Produce';
    const productId = product.productId || 'FTF-P-NEW';
    const traceabilityId = product.traceabilityId || 'FTF-TR-NEW';
    const subject = `Product Listing Published: ${productName} (${productId}) 🌱`;

    const detailsRows = [
      { label: 'Product Name', value: productName, isHighlight: true },
      { label: 'Product ID', value: productId },
      { label: 'Traceability ID', value: traceabilityId, isHighlight: true },
      { label: 'Category', value: product.category || 'vegetables' },
      { label: 'Price', value: `₹${product.price} / ${product.unit || 'kg'}` },
      { label: 'Initial Stock', value: `${product.stock || 50} ${product.unit || 'kg'}` },
      { label: 'Origin / Farm', value: product.origin || 'Tamil Nadu' }
    ];

    const traceUrl = product.publicTraceUrl || `http://localhost:5173/traceability/${traceabilityId}`;

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: '🌱 Product Live on Marketplace',
      badgeColor: '#16a34a',
      badgeBg: '#dcfce7',
      greeting: `Congratulations ${sellerName}!`,
      introText: `Your new product listing for <strong>${productName}</strong> is now live on the Farm to Fork marketplace with full Seed-to-Plate QR traceability.`,
      detailsRows,
      actionBtn: {
        text: 'View Public Traceability Certificate',
        url: traceUrl
      },
      alertBox: {
        type: 'info',
        title: '📱 Traceability QR Code Active',
        text: 'A unique immutable QR Code has been generated for this harvest batch. Customers can scan it to view soil preparation, organic certifications, and farm origin.'
      },
      recipientEmail: to
    });

    const plainText = `Congratulations ${sellerName}!

Your product "${productName}" is now active on Farm to Fork Collective.

Product Details:
- Product Name: ${productName}
- Product ID: ${productId}
- Traceability ID: ${traceabilityId}
- Price: ₹${product.price}/${product.unit}
- Origin: ${product.origin}

View Traceability: ${traceUrl}

Best regards,
Farm to Fork Collective`;

    let userResult = { success: false, message: 'No seller email provided' };
    if (this.isValidEmail(to)) {
      userResult = await this.sendEmail({
        to,
        subject,
        text: plainText,
        html: htmlContent
      });
    }

    // Always dispatch admin activity notification
    this.sendAdminNewProductAlert({ product, seller }).catch(e => {
      console.warn('[EmailService:AdminAlert] New product alert failed:', e.message);
    });

    return userResult;
  }

  // ----------------------------------------------------
  // 5. DONATION CONFIRMATION (DONOR + ADMIN)
  // ----------------------------------------------------
  async sendDonationConfirmation({ donation, donor }) {
    if (!donation) return { success: false, message: 'Donation object is required.' };

    const to = (donation.donorEmail || (donor && donor.email) || '').trim().toLowerCase();
    const donorName = donation.donorName || (donor && donor.name) || 'Kind Supporter';
    const donationId = donation.id || '#DON-FTF';
    const subject = `Thank You for Your Surplus Food Donation! 🤝 - Farm to Fork Collective`;

    const detailsRows = [
      { label: 'Donation ID', value: donationId, isHighlight: true },
      { label: 'Donor Name', value: donorName },
      { label: 'Surplus Produce', value: donation.produce || 'Organic Produce' },
      { label: 'Assigned Partner NGO', value: donation.ngo || 'Community Kitchen Partner', isHighlight: true },
      { label: 'Pickup Status', value: donation.status || 'Assigned for Pickup' },
      { label: 'Initiated On', value: donation.date || this.formatTimestamp() }
    ];

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: '🤝 Zero Waste Collective',
      badgeColor: '#ea580c', // orange
      badgeBg: '#ffedd5',
      greeting: `Thank you, ${donorName}!`,
      introText: `Your surplus food donation request <strong>${donationId}</strong> has been logged in our Zero-Waste distribution network. Our partner NGO has been alerted for pickup to feed families in need.`,
      detailsRows,
      actionBtn: {
        text: 'View Community Kitchens & Impact',
        url: 'http://localhost:5173/pages/community-kitchen.html'
      },
      alertBox: {
        type: 'success',
        title: '🌱 Making a Difference',
        text: 'By routing surplus harvest to community kitchens, you help eliminate agricultural food waste and ensure vulnerable community members receive nutritious, pesticide-free meals.'
      },
      recipientEmail: to
    });

    const plainText = `Thank you, ${donorName}!

Your surplus food donation (${donationId}) has been received and routed to ${donation.ngo}.

Donation Details:
- ID: ${donationId}
- Produce: ${donation.produce}
- Partner NGO: ${donation.ngo}
- Status: ${donation.status}

Best regards,
Farm to Fork Zero-Waste Initiative`;

    let userResult = { success: false, message: 'No donor email provided' };
    if (this.isValidEmail(to)) {
      userResult = await this.sendEmail({
        to,
        subject,
        text: plainText,
        html: htmlContent
      });
    }

    // Always dispatch admin activity notification
    this.sendAdminNewDonationAlert({ donation, donor }).catch(e => {
      console.warn('[EmailService:AdminAlert] New donation alert failed:', e.message);
    });

    return userResult;
  }

  // ----------------------------------------------------
  // 6. CONTACT / FEEDBACK FORM CONFIRMATION (USER + ADMIN)
  // ----------------------------------------------------
  async sendContactConfirmation({ to, name, subject: formSubject, message, phone }) {
    if (!this.isValidEmail(to)) {
      return { success: false, message: 'Valid user email address is required.' };
    }

    const senderName = name || 'Valued Member';
    const emailSubject = `We Received Your Message: "${formSubject || 'Support Inquiry'}" - Farm to Fork Collective`;

    const detailsRows = [
      { label: 'Your Name', value: senderName },
      { label: 'Your Email', value: to },
      ...(phone ? [{ label: 'Contact Phone', value: phone }] : []),
      { label: 'Inquiry Subject', value: formSubject || 'General Support', isHighlight: true },
      { label: 'Message Received', value: message || 'N/A' },
      { label: 'Expected Response', value: 'Within 24 business hours' }
    ];

    const htmlContent = this.renderEmailLayout({
      title: emailSubject,
      badgeText: '📩 Message Received',
      badgeColor: '#16a34a',
      badgeBg: '#dcfce7',
      greeting: `Hello ${senderName},`,
      introText: `Thank you for contacting Farm to Fork Collective. We have received your inquiry and our support team is reviewing it.`,
      detailsRows,
      alertBox: {
        type: 'info',
        title: '🌿 We are here to help',
        text: 'Our team responds to all member inquiries promptly. If your matter is urgent regarding an active delivery, you can also reach our admin desk directly at anushiyaselvi06@gmail.com.'
      },
      recipientEmail: to
    });

    const plainText = `Hello ${senderName},

We have received your message regarding "${formSubject || 'Inquiry'}".

Details:
- Subject: ${formSubject || 'Support'}
- Message: ${message}

Our team will respond to you within 24 hours.

Best regards,
Farm to Fork Collective Support Team`;

    const userResult = await this.sendEmail({
      to,
      subject: emailSubject,
      text: plainText,
      html: htmlContent
    });

    // Notify Admin with the full message
    this.sendAdminContactMessageAlert({
      name: senderName,
      email: to,
      phone,
      subject: formSubject,
      message
    }).catch(e => console.warn('[EmailService:AdminAlert] Contact message alert failed:', e.message));

    return userResult;
  }

  // ----------------------------------------------------
  // 7. PASSWORD RESET OTP & SECURE LINK
  // ----------------------------------------------------
  async sendPasswordResetOtp({ to, name, otp, resetLink, expiresInMinutes = 10 }) {
    const greeting = name ? `Hello ${name},` : 'Hello,';
    const subject = 'Farm to Fork Collective - Password Reset OTP & Verification';

    const detailsRows = [
      { label: 'Account Email', value: to },
      { label: 'OTP Code', value: `<span style="font-size: 26px; font-weight: 800; letter-spacing: 6px; color: #15803d; font-family: monospace;">${otp}</span>`, isHighlight: true },
      { label: 'Validity Window', value: `${expiresInMinutes} minutes from dispatch` },
      { label: 'Usage Limit', value: 'Single-use only (invalidated on verification)' }
    ];

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: '🔐 Password Reset Request',
      badgeColor: '#dc2626', // red
      badgeBg: '#fee2e2',
      greeting,
      introText: `A password reset was requested for your Farm to Fork Collective account. Enter the one-time 6-digit verification code below or click the direct button to choose a new password.`,
      detailsRows,
      actionBtn: {
        text: 'Reset Your Password Now',
        url: resetLink
      },
      alertBox: {
        type: 'warning',
        title: '⚠️ Security Notice',
        text: 'Never share this OTP with anyone. Farm to Fork staff will NEVER ask for your password or OTP code. If you did not request this password reset, you can safely ignore this email; your account remains secure.'
      },
      recipientEmail: to
    });

    const plainText = `${greeting}

A password reset was requested for your Farm to Fork Collective account.

Your Password Reset OTP is:
${otp}

This OTP is valid for ${expiresInMinutes} minutes.

Reset your password directly:
${resetLink}

Do not share this code with anyone. If you did not request this, ignore this email.

Best regards,
Farm to Fork Collective Security`;

    return await this.sendEmail({
      to,
      subject,
      text: plainText,
      html: htmlContent
    });
  }

  // ----------------------------------------------------
  // 8. PASSWORD CHANGED CONFIRMATION (USER + ADMIN)
  // ----------------------------------------------------
  async sendPasswordChangedConfirmation({ to, name }) {
    const greeting = name ? `Hello ${name},` : 'Hello,';
    const subject = 'Security Alert: Your Password Was Successfully Changed - Farm to Fork';

    const detailsRows = [
      { label: 'Account Email', value: to },
      { label: 'Security Event', value: 'Password Updated', isHighlight: true },
      { label: 'Change Timestamp', value: this.formatTimestamp() },
      { label: 'Protection Method', value: 'NIST scrypt salted hash' }
    ];

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: '✅ Password Changed',
      badgeColor: '#16a34a',
      badgeBg: '#dcfce7',
      greeting,
      introText: `Your Farm to Fork Collective account password was successfully updated. You can now sign in using your new credentials.`,
      detailsRows,
      actionBtn: {
        text: 'Sign In to Marketplace',
        url: 'http://localhost:5173/pages/login.html'
      },
      alertBox: {
        type: 'warning',
        title: '⚠️ Did not authorize this change?',
        text: `If you did not perform this password change, your account may be compromised. Please contact support immediately at <a href="mailto:${this.getAdminEmail()}" style="color: #991b1b; font-weight: bold;">${this.getAdminEmail()}</a>.`
      },
      recipientEmail: to
    });

    const plainText = `${greeting}

Your Farm to Fork Collective password was successfully changed on ${this.formatTimestamp()}.

If you made this change, no further action is needed.

If you DID NOT make this change, please contact support immediately at ${this.getAdminEmail()}.

Best regards,
Farm to Fork Collective Security`;

    const userResult = await this.sendEmail({
      to,
      subject,
      text: plainText,
      html: htmlContent
    });

    // Alert Admin of security change
    this.sendAdminSecurityAlert({
      user: { email: to, name },
      action: 'User Password Changed'
    }).catch(e => console.warn('[EmailService:AdminAlert] Security notice failed:', e.message));

    return userResult;
  }

  // ====================================================
  // ADMIN NOTIFICATION DISPATCHERS (TO anushiyaselvi06@gmail.com)
  // ====================================================

  // Generic reusable admin notification
  async sendAdminActivityNotification({ type, title, details = [] }) {
    const adminTo = this.getAdminEmail();
    const subject = `[Admin Alert] ${title}`;

    const htmlContent = this.renderEmailLayout({
      title: subject,
      badgeText: `🛡️ Admin Alert: ${type.toUpperCase()}`,
      badgeColor: '#0284c7', // cyan
      badgeBg: '#e0f2fe',
      greeting: 'Farm to Fork Collective Administration Desk,',
      introText: `An important system activity has been recorded on the platform and requires administrative awareness.`,
      detailsRows: details,
      actionBtn: {
        text: 'Open Admin Dashboard',
        url: 'http://localhost:5173/pages/dashboard-admin.html'
      },
      recipientEmail: adminTo
    });

    const plainText = `[ADMIN NOTIFICATION: ${title}]

Activity Details:
${details.map(d => `- ${d.label}: ${d.value}`).join('\n')}

View Admin Dashboard: http://localhost:5173/pages/dashboard-admin.html`;

    return await this.sendEmail({
      to: adminTo,
      subject,
      text: plainText,
      html: htmlContent,
      isSystemAdminAlert: true
    });
  }

  // Admin Alert: New User Registered
  async sendAdminNewUserAlert(user) {
    const adminTo = this.getAdminEmail();
    const userName = (user && user.name) || 'New User';
    const userRole = (user && user.role) || 'customer';
    const subject = `[Admin Alert] New User Registration: ${userName} (${userRole})`;

    const detailsRows = [
      { label: 'User Full Name', value: userName, isHighlight: true },
      { label: 'Email Address', value: (user && user.email) || 'N/A' },
      { label: 'Role Registered', value: userRole.toUpperCase(), isHighlight: true },
      { label: 'Contact Phone', value: (user && user.phone) || 'Not provided' },
      ...(user && user.farmName ? [{ label: 'Farm / Workshop', value: user.farmName }] : []),
      ...(user && user.farmLocation ? [{ label: 'Location', value: user.farmLocation }] : []),
      { label: 'Registration Time', value: this.formatTimestamp() }
    ];

    return await this.sendAdminActivityNotification({
      type: 'registration',
      title: `New User Registration: ${userName}`,
      details: detailsRows
    });
  }

  // Admin Alert: New Order Placed
  async sendAdminNewOrderAlert({ order, customer }) {
    const adminTo = this.getAdminEmail();
    const orderId = (order && order.id) || '#FTF-ORDER';
    const total = (order && order.total) || 0;
    const customerName = (order && order.customerName) || (customer && customer.name) || 'Customer';
    const customerEmail = (order && order.customerEmail) || (customer && customer.email) || 'N/A';
    const subject = `[Admin Alert] New Order Received: ${orderId} (₹${total})`;

    const items = (order && order.items) || [];
    const itemsSummary = items.map(item => 
      `${item.name} x ${item.quantity} ${item.unit || 'kg'} (₹${(item.price * item.quantity).toFixed(0)})`
    ).join(' | ');

    const detailsRows = [
      { label: 'Order ID', value: orderId, isHighlight: true },
      { label: 'Gross Merchandise Value', value: `₹${total}`, isHighlight: true },
      { label: 'Customer Name', value: customerName },
      { label: 'Customer Email', value: customerEmail },
      { label: 'Customer Phone', value: (order && order.customerPhone) || (customer && customer.phone) || 'N/A' },
      { label: 'Delivery Address', value: (order && order.address) || 'N/A' },
      { label: 'Delivery Slot', value: (order && order.slot) || 'Morning' },
      { label: 'Payment Mode', value: (order && order.paymentMode) || 'UPI Instant' },
      { label: 'Itemized Breakdown', value: itemsSummary || 'Fresh Organic Produce' }
    ];

    return await this.sendAdminActivityNotification({
      type: 'order',
      title: `New Order Received: ${orderId} (₹${total})`,
      details: detailsRows
    });
  }

  // Admin Alert: New Product Published
  async sendAdminNewProductAlert({ product, seller }) {
    const adminTo = this.getAdminEmail();
    const productName = (product && product.name) || 'Organic Produce';
    const sellerName = (seller && seller.name) || (product && product.seller) || 'Farmer/Artisan';
    const subject = `[Admin Alert] New Product Submitted: "${productName}" by ${sellerName}`;

    const detailsRows = [
      { label: 'Product Name', value: productName, isHighlight: true },
      { label: 'Product ID', value: (product && product.productId) || 'N/A' },
      { label: 'Traceability ID', value: (product && product.traceabilityId) || 'N/A', isHighlight: true },
      { label: 'Category', value: (product && product.category) || 'vegetables' },
      { label: 'Price Listing', value: `₹${product && product.price} / ${product && product.unit}` },
      { label: 'Seller Name', value: sellerName },
      { label: 'Seller Role', value: (seller && seller.role) || (product && product.sellerRole) || 'producer' },
      { label: 'Farm / Origin', value: (product && product.origin) || 'Tamil Nadu' },
      { label: 'Timestamp', value: this.formatTimestamp() }
    ];

    return await this.sendAdminActivityNotification({
      type: 'product',
      title: `New Product Published: "${productName}"`,
      details: detailsRows
    });
  }

  // Admin Alert: Surplus Food Donation
  async sendAdminNewDonationAlert({ donation, donor }) {
    const adminTo = this.getAdminEmail();
    const donorName = (donation && donation.donorName) || (donor && donor.name) || 'Community Member';
    const produce = (donation && donation.produce) || 'Organic Harvest';
    const subject = `[Admin Alert] Surplus Food Donation: "${produce}" by ${donorName}`;

    const detailsRows = [
      { label: 'Donation ID', value: (donation && donation.id) || 'N/A', isHighlight: true },
      { label: 'Donor Name', value: donorName },
      { label: 'Donor Email', value: (donation && donation.donorEmail) || (donor && donor.email) || 'N/A' },
      { label: 'Produce Description', value: produce, isHighlight: true },
      { label: 'Designated NGO', value: (donation && donation.ngo) || 'Community Kitchen Partner' },
      { label: 'Current Status', value: (donation && donation.status) || 'Assigned for Pickup' },
      { label: 'Timestamp', value: this.formatTimestamp() }
    ];

    return await this.sendAdminActivityNotification({
      type: 'donation',
      title: `Surplus Donation: "${produce}"`,
      details: detailsRows
    });
  }

  // Admin Alert: Contact / Support Inquiry
  async sendAdminContactMessageAlert({ name, email, phone, subject: msgSubject, message }) {
    const adminTo = this.getAdminEmail();
    const senderName = name || 'Anonymous Visitor';
    const inquirySubject = msgSubject || 'General Support';
    const emailSubject = `[Admin Alert] New Contact Inquiry: "${inquirySubject}" from ${senderName}`;

    const detailsRows = [
      { label: 'Sender Name', value: senderName, isHighlight: true },
      { label: 'Sender Email', value: email || 'N/A' },
      { label: 'Sender Phone', value: phone || 'Not provided' },
      { label: 'Subject / Topic', value: inquirySubject, isHighlight: true },
      { label: 'Full Message', value: message || 'N/A' },
      { label: 'Received At', value: this.formatTimestamp() }
    ];

    return await this.sendAdminActivityNotification({
      type: 'contact_message',
      title: `Contact Inquiry from ${senderName}`,
      details: detailsRows
    });
  }

  // Admin Alert: Security Event
  async sendAdminSecurityAlert({ user, action = 'Security Event' }) {
    const adminTo = this.getAdminEmail();
    const userEmail = (user && user.email) || 'user@example.com';
    const userName = (user && user.name) || 'User';

    const detailsRows = [
      { label: 'Security Action', value: action, isHighlight: true },
      { label: 'Target User', value: userName },
      { label: 'User Email', value: userEmail },
      { label: 'Timestamp', value: this.formatTimestamp() }
    ];

    return await this.sendAdminActivityNotification({
      type: 'security_alert',
      title: `${action}: ${userEmail}`,
      details: detailsRows
    });
  }
}

module.exports = new EmailService();
