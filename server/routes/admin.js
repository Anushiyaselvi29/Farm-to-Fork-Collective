// ============================================
// ADMIN MANAGEMENT & AUDIT ROUTES
// Farm to Fork Collective
// ============================================

const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../config/db');

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  try {
    const db = readDb();
    const users = db.users || [];
    const orders = db.orders || [];
    const products = db.products || [];
    const kitchens = db.kitchens || [];

    const totalVolume = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const farmersCount = users.filter(u => u.role === 'farmer').length;
    const artisansCount = users.filter(u => u.role === 'artisan').length;
    const customersCount = users.filter(u => u.role === 'customer').length;

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        farmersCount,
        artisansCount,
        customersCount,
        totalProducts: products.length,
        communityKitchens: kitchens.length,
        totalOrders: orders.length,
        totalGmv: totalVolume,
        systemStatus: 'Operational (100%)'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to aggregate statistics.' });
  }
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  try {
    const { role } = req.query;
    const db = readDb();
    let users = (db.users || []).map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });

    if (role && role !== 'all') {
      users = users.filter(u => u.role.toLowerCase() === role.toLowerCase());
    }

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
  }
});

// GET /api/admin/certifications
router.get('/certifications', (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      certifications: db.farmCertifications || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve certifications.' });
  }
});

// POST /api/admin/certifications/:id/approve
router.post('/certifications/:id/approve', (req, res) => {
  try {
    const id = req.params.id;
    const db = readDb();
    const cert = (db.farmCertifications || []).find(c => c.id === id);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certification application not found.' });
    }

    cert.status = 'Approved';
    cert.approvedAt = new Date().toISOString();
    writeDb(db);

    res.json({
      success: true,
      message: `Farm certification for ${cert.farmName} approved!`,
      certification: cert
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to approve certification.' });
  }
});

const emailService = require('../services/emailService');

// Middleware to verify Admin authorization (or allow in development mode)
function requireAdminOrDev(req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Admin Bearer token must be provided.' });
  }
  try {
    const jwt = require('../utils/jwt');
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden. Administrator privileges required.' });
    }
    req.adminUser = payload;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid or expired administrative token.' });
  }
}

// ----------------------------------------------------
// SPECIAL OFFERS MANAGEMENT
// ----------------------------------------------------

// GET /api/admin/offers
router.get('/offers', (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      count: (db.offers || []).length,
      offers: db.offers || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve offers.' });
  }
});

// POST /api/admin/offers (Create or Publish Special Offer & Send Emails)
router.post('/offers', requireAdminOrDev, async (req, res) => {
  try {
    const { title, code, discountPercent, description, expiresAt, eligibleRole } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required for special offers.' });
    }

    const cleanCode = (code || 'ORGANIC' + (discountPercent || '10')).trim().toUpperCase();
    const discountVal = parseInt(discountPercent, 10) || 10;
    const targetRole = (eligibleRole || 'customer').trim().toLowerCase();

    const db = readDb();
    if (!db.offers) db.offers = [];

    // Check if offer already exists by code
    let offer = db.offers.find(o => o.code === cleanCode);
    const isNewOffer = !offer;

    if (!offer) {
      offer = {
        id: 'ofr-' + Date.now(),
        title: title.trim(),
        code: cleanCode,
        discountPercent: discountVal,
        description: description.trim(),
        expiresAt: expiresAt || new Date(Date.now() + 7 * 86400000).toISOString(),
        eligibleRole: targetRole,
        sentRecipients: [], // Tracks email addresses that have already received this offer
        createdAt: new Date().toISOString()
      };
      db.offers.unshift(offer);
    } else {
      // Update existing offer details
      offer.title = title.trim();
      offer.discountPercent = discountVal;
      offer.description = description.trim();
      if (expiresAt) offer.expiresAt = expiresAt;
      if (!Array.isArray(offer.sentRecipients)) offer.sentRecipients = [];
    }

    // Identify eligible registered users who have NOT already received this offer
    const users = db.users || [];
    const eligibleUsers = users.filter(u => {
      if (!u.email || !emailService.isValidEmail(u.email)) return false;
      const roleMatches = targetRole === 'all' || u.role.toLowerCase() === targetRole;
      const notYetSent = !offer.sentRecipients.includes(u.email.toLowerCase());
      const emailEnabled = u.notificationPreferences?.email !== false;
      return roleMatches && notYetSent && emailEnabled;
    });

    const dispatched = [];
    const failed = [];

    for (const u of eligibleUsers) {
      const emailResult = await emailService.sendSpecialOfferEmail({
        to: u.email,
        name: u.name,
        offer
      });

      if (emailResult.success) {
        offer.sentRecipients.push(u.email.toLowerCase());
        dispatched.push(u.email);
      } else {
        failed.push({ email: u.email, error: emailResult.message });
      }
    }

    writeDb(db);

    res.status(isNewOffer ? 201 : 200).json({
      success: true,
      message: `Special offer "${offer.title}" processed. Dispatched to ${dispatched.length} user(s).`,
      offer,
      stats: {
        totalEligible: eligibleUsers.length,
        dispatchedCount: dispatched.length,
        alreadySentCount: (offer.sentRecipients.length - dispatched.length),
        dispatchedEmails: dispatched,
        failed
      }
    });
  } catch (err) {
    console.error('Publish offer error:', err);
    res.status(500).json({ success: false, message: 'Failed to publish special offer.' });
  }
});

// ----------------------------------------------------
// EMAIL STATUS & DIAGNOSTICS
// ----------------------------------------------------

// GET /api/admin/email-status
router.get('/email-status', async (req, res) => {
  try {
    const conn = await emailService.verifyConnection();
    res.json({
      success: true,
      adminEmail: emailService.getAdminEmail(),
      isConfigured: emailService.isConfigured(),
      connection: conn,
      recentDispatches: emailService.getDispatchLogs().slice(0, 25)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to query email service status.' });
  }
});

// POST /api/admin/test-email (Secure diagnostic endpoint supporting all notification types)
router.post('/test-email', requireAdminOrDev, async (req, res) => {
  try {
    const targetEmail = (req.body && req.body.to) ? String(req.body.to).trim().toLowerCase() : emailService.getAdminEmail();
    const testType = (req.body && req.body.type) ? String(req.body.type).toLowerCase() : 'diagnostic';

    if (!emailService.isValidEmail(targetEmail)) {
      return res.status(400).json({ success: false, message: `Invalid recipient email address format: "${targetEmail}".` });
    }

    let result = null;

    if (testType === 'welcome') {
      result = await emailService.sendWelcomeEmail({
        to: targetEmail,
        name: req.body.name || 'Test User',
        role: req.body.role || 'customer'
      });
    } else if (testType === 'login') {
      result = await emailService.sendLoginNotification({
        to: targetEmail,
        name: req.body.name || 'Test User',
        timestamp: new Date()
      });
    } else if (testType === 'google_login') {
      result = await emailService.sendGoogleLoginNotification({
        to: targetEmail,
        name: req.body.name || 'Google Test User',
        googleId: 'test-google-id-123456',
        timestamp: new Date()
      });
    } else if (testType === 'order') {
      const mockOrder = {
        id: '#FTF-TEST-' + Math.floor(1000 + Math.random() * 9000),
        total: 350,
        customerName: req.body.name || 'Test Customer',
        customerEmail: targetEmail,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [
          { name: 'Organic Tomatoes', quantity: 2, unit: 'kg', price: 60 },
          { name: 'Fresh Coimbatore Guavas', quantity: 1, unit: 'kg', price: 55 },
          { name: 'Organic Cavendish Bananas', quantity: 2, unit: 'kg', price: 45 },
          { name: 'Auroville Wild Raw Honey', quantity: 1, unit: 'jar', price: 85 }
        ],
        slot: 'Morning (7:00 AM - 10:00 AM)',
        address: '42, Farm Road, Chennai, Tamil Nadu',
        paymentMode: 'UPI Instant Pay',
        status: 'Confirmed & Processing'
      };
      result = await emailService.sendOrderConfirmation({ order: mockOrder });
    } else if (testType === 'status') {
      const mockOrder = {
        id: '#FTF-TEST-' + Math.floor(1000 + Math.random() * 9000),
        total: 450,
        customerName: req.body.name || 'Test Customer',
        customerEmail: targetEmail,
        items: [{ name: 'Organic Dindigul Dragon Fruit', quantity: 2, unit: 'kg' }],
        address: '42, Farm Road, Chennai'
      };
      result = await emailService.sendOrderStatusUpdate({
        order: mockOrder,
        status: req.body.status || 'Shipped'
      });
    } else if (testType === 'offer') {
      const mockOffer = {
        title: 'Monsoon Harvest Festival',
        code: 'MONSOON25',
        discountPercent: 25,
        description: '25% OFF on all fresh organic fruit & vegetable baskets direct from Tamil Nadu farms.',
        expiresAt: new Date(Date.now() + 5 * 86400000).toISOString()
      };
      result = await emailService.sendSpecialOfferEmail({
        to: targetEmail,
        name: req.body.name || 'Test Customer',
        offer: mockOffer
      });
    } else if (testType === 'reset') {
      result = await emailService.sendPasswordResetOtp({
        to: targetEmail,
        name: req.body.name || 'Test User',
        otp: '849201',
        resetLink: `http://localhost:5173/pages/reset-password.html?token=test_token&email=${encodeURIComponent(targetEmail)}`,
        expiresInMinutes: 10
      });
    } else {
      // Default: Diagnostic Admin Activity Notification
      result = await emailService.sendEmail({
        to: targetEmail,
        subject: 'Diagnostic Email Test - Farm to Fork Collective 🌱',
        text: `Diagnostic test email sent from Farm to Fork Collective to ${targetEmail} at ${new Date().toISOString()}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #16a34a; margin-top: 0;">🌱 Farm to Fork Collective</h2>
            <h3>Email Notification Service Diagnostic Test</h3>
            <p style="color: #334155; line-height: 1.6;">This email confirms that the Gmail SMTP service is successfully connected and delivering notifications.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Recipient:</td><td style="padding: 8px 0; font-weight: bold;">${targetEmail}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Sender:</td><td style="padding: 8px 0;">${emailService.getAdminEmail()}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Service:</td><td style="padding: 8px 0;">Gmail SMTP (Nodemailer)</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Timestamp:</td><td style="padding: 8px 0;">${emailService.formatTimestamp()}</td></tr>
            </table>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Farm to Fork Collective Administration Desk</p>
          </div>
        `
      });
    }

    res.json({
      success: result.success,
      type: testType,
      recipient: targetEmail,
      result
    });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
