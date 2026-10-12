require('dotenv').config({ path: 'server/.env' });
const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER || process.env.GMAIL_USER || 'anushiyaselvi60@gmail.com';
const pass = (process.env.EMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass },
  tls: { rejectUnauthorized: false }
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: `"Farm to Fork Collective" <${user}>`,
      to: user,
      subject: 'Test Email Notification from Farm to Fork Collective',
      text: 'This is a test email to verify Gmail SMTP delivery.',
      html: '<b>This is a test email to verify Gmail SMTP delivery.</b>'
    });
    console.log('✅ SendMail succeeded! MessageId:', info.messageId);
  } catch (err) {
    console.error('❌ SendMail failed:', err);
  }
}

run();
