require('dotenv').config({ path: 'server/.env' });
const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER || process.env.GMAIL_USER || 'anushiyaselvi60@gmail.com';
const pass = (process.env.EMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

console.log('Testing with user:', user);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Transporter verify with rejectUnauthorized:false failed:', err);
  } else {
    console.log('✅ Transporter verify succeeded with rejectUnauthorized:false!');
  }
});
