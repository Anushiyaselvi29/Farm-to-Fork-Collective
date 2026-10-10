// ============================================
// NOTIFICATION ROUTES & CONTROLLER
// Farm to Fork Collective
// ============================================

const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { readDb, writeDb } = require('../config/db');
const jwt = require('../utils/jwt');

// Helper to extract user
function getAuthUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token);
    if (decoded && decoded.sub) {
      const db = readDb();
      return db.users.find(u => u.id === decoded.sub) || null;
    }
  } catch (e) {}
  return null;
}

// GET /api/notifications/channels
router.get('/channels', (req, res) => {
  res.json({
    success: true,
    channels: notificationService.getChannelsStatus()
  });
});

// GET /api/notifications
router.get('/', (req, res) => {
  try {
    const user = getAuthUser(req);
    const db = readDb();
    const allNotifications = db.notifications || [];

    let filtered = allNotifications;
    if (user) {
      filtered = allNotifications.filter(n => !n.userId || n.userId === user.id);
    }

    res.json({
      success: true,
      notifications: filtered.slice(0, 30)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
});

// POST /api/notifications/test
// Tests sending to a specific channel respecting user preferences
router.post('/test', async (req, res) => {
  try {
    const { channel, phone, email, name, role } = req.body;
    let user = getAuthUser(req);
    const db = readDb();

    if (!user && email) {
      user = (db.users || []).find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
    }

    if (!user) {
      user = {
        name: name || 'Valued User',
        email: email || 'user@example.com',
        phone: phone || '+91 98765 43210',
        role: role || 'customer',
        notificationPreferences: req.body.notificationPreferences || { sms: true, whatsapp: true, email: true }
      };
    } else {
      if (phone) user.phone = phone;
      if (email) user.email = email;
      if (req.body.notificationPreferences) {
        user.notificationPreferences = req.body.notificationPreferences;
      }
    }

    const result = await notificationService.testChannel(user, channel);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/notifications/preferences
router.put('/preferences', (req, res) => {
  try {
    const { notificationPreferences, notifications } = req.body;
    const user = getAuthUser(req);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required to update preferences.' });
    }

    const db = readDb();
    const userIdx = db.users.findIndex(u => u.id === user.id);
    if (userIdx === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let notifPrefs = { sms: true, email: true, whatsapp: true };
    if (notificationPreferences && typeof notificationPreferences === 'object') {
      notifPrefs = {
        sms: notificationPreferences.sms !== false,
        whatsapp: notificationPreferences.whatsapp !== false,
        email: notificationPreferences.email !== false
      };
    } else if (Array.isArray(notifications)) {
      notifPrefs = {
        sms: notifications.includes('sms'),
        whatsapp: notifications.includes('whatsapp'),
        email: notifications.includes('email') || notifications.includes('gmail')
      };
    }

    db.users[userIdx].notificationPreferences = notifPrefs;
    db.users[userIdx].updatedAt = new Date().toISOString();
    writeDb(db);

    res.json({
      success: true,
      message: 'Notification preferences updated successfully in database.',
      notificationPreferences: notifPrefs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update preferences.' });
  }
});

module.exports = router;
