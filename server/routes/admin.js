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

// POST /api/admin/test-email
router.post('/test-email', async (req, res) => {
  try {
    const targetEmail = (req.body && req.body.to) ? String(req.body.to).trim() : emailService.getAdminEmail();
    const result = await emailService.sendAdminActivityNotification({
      type: 'test_dispatch',
      title: 'Admin Email Verification Diagnostic',
      details: [
        { label: 'Target Address', value: targetEmail, isHighlight: true },
        { label: 'Official Admin Email', value: emailService.getAdminEmail() },
        { label: 'Sender Profile', value: process.env.EMAIL_FROM || 'Farm to Fork Collective' },
        { label: 'SMTP Host', value: process.env.SMTP_HOST || 'smtp.gmail.com' },
        { label: 'Service', value: 'Google Gmail SMTP (Nodemailer)' }
      ]
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
