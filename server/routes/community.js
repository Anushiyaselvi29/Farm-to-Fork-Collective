// ============================================
// COMMUNITY & GROUP BUYING ROUTES
// Farm to Fork Collective
// ============================================

const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../config/db');
const jwt = require('../utils/jwt');
const emailService = require('../services/emailService');

// GET /api/community/group-buys
router.get('/group-buys', (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      groupBuys: db.groupBuys || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch group buy pools.' });
  }
});

// POST /api/community/group-buys/:id/join
router.post('/group-buys/:id/join', (req, res) => {
  try {
    const id = req.params.id;
    const { quantity, userName } = req.body;
    const qty = parseInt(quantity, 10) || 1;

    const db = readDb();
    const deal = (db.groupBuys || []).find(g => g.id === id);

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Group buying pool not found.' });
    }

    deal.currentQty += qty;
    deal.participants += 1;
    writeDb(db);

    res.json({
      success: true,
      message: `Joined group buy for ${deal.productName} (+${qty} ${deal.unit})!`,
      deal
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to join group buy pool.' });
  }
});

// GET /api/community/kitchens
router.get('/kitchens', (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      kitchens: db.kitchens || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch kitchens.' });
  }
});

// POST /api/community/kitchens
router.post('/kitchens', (req, res) => {
  try {
    const { name, area, address, dailyMeals, specialty, todayMenu, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Kitchen name is required.' });
    }

    const newKitchen = {
      id: 'kit-' + Date.now(),
      name: name.trim(),
      area: area || 'Chennai',
      address: address || '',
      mealsDaily: parseInt(dailyMeals, 10) || 50,
      dailyMeals: parseInt(dailyMeals, 10) || 50,
      members: 1,
      icon: icon || '🍲',
      specialty: specialty || 'Fresh Organic Home-Style Meals',
      todayMenu: todayMenu || 'Community Fresh Feast',
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    const db = readDb();
    if (!db.kitchens) db.kitchens = [];
    db.kitchens.unshift(newKitchen);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Community kitchen created successfully!',
      kitchen: newKitchen
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save community kitchen.' });
  }
});

// GET /api/community/donations
router.get('/donations', (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      donations: db.donations || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
});

// POST /api/community/donations
router.post('/donations', async (req, res) => {
  try {
    const { donorName, produce, ngo, donorEmail: inputEmail, donorPhone: inputPhone } = req.body;

    if (!produce || !ngo) {
      return res.status(400).json({ success: false, message: 'Produce and NGO selection are required.' });
    }

    const db = readDb();

    // Extract authenticated user if available
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let authUser = null;
    if (authHeader) {
      try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        const decoded = jwt.verify(token);
        if (decoded && decoded.sub) {
          authUser = (db.users || []).find(u => u.id === decoded.sub);
        }
      } catch (e) {}
    }

    const donorEmail = (inputEmail || (authUser && authUser.email) || '').trim().toLowerCase();
    const donorPhone = (inputPhone || (authUser && authUser.phone) || '').trim();

    const newDonation = {
      id: 'don-' + Date.now(),
      donorName: donorName || (authUser && authUser.name) || 'Kind Community Member',
      donorEmail: donorEmail || null,
      donorPhone: donorPhone || null,
      produce: produce.trim(),
      ngo: ngo.trim(),
      status: 'Assigned for Pickup',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    if (!db.donations) db.donations = [];
    db.donations.unshift(newDonation);
    writeDb(db);

    // Send confirmation email to donor (if email provided) and activity notification to admin
    try {
      emailService.sendDonationConfirmation({
        donation: newDonation,
        donor: {
          name: newDonation.donorName,
          email: donorEmail,
          phone: donorPhone
        }
      }).catch(err => {
        console.warn('[Community:Donations] Email notice:', err.message);
      });
    } catch (e) {
      console.warn('[Community:Donations] Notification dispatch error:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Donation request submitted! The partner NGO has been notified.',
      donation: newDonation
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record donation.' });
  }
});

// POST /api/community/contact (or /api/contact)
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Your email address and message are required.'
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!emailService.isValidEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. name@gmail.com).'
      });
    }

    const newContactMessage = {
      id: 'msg-' + Date.now(),
      name: (name && String(name).trim()) || 'Visitor',
      email: cleanEmail,
      phone: (phone && String(phone).trim()) || '',
      subject: (subject && String(subject).trim()) || 'Support Inquiry',
      message: String(message).trim(),
      status: 'Received',
      createdAt: new Date().toISOString()
    };

    const db = readDb();
    if (!db.contactMessages) db.contactMessages = [];
    db.contactMessages.unshift(newContactMessage);
    writeDb(db);

    // Dispatch confirmation email to sender and full inquiry notification to admin
    try {
      emailService.sendContactConfirmation({
        to: newContactMessage.email,
        name: newContactMessage.name,
        subject: newContactMessage.subject,
        message: newContactMessage.message,
        phone: newContactMessage.phone
      }).catch(err => {
        console.warn('[Community:Contact] Email notice:', err.message);
      });
    } catch (e) {
      console.warn('[Community:Contact] Email dispatch error:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent to our team and a confirmation email has been dispatched to your inbox.',
      contactMessage: newContactMessage
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit contact message.' });
  }
});

// GET /api/community/contact (Admin listing)
router.get('/contact', (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      messages: db.contactMessages || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve messages.' });
  }
});

// GET /api/community/reviews
router.get('/reviews', (req, res) => {
  try {
    const { productId } = req.query;
    const db = readDb();
    let reviews = db.reviews || [];
    if (productId) {
      reviews = reviews.filter(r => String(r.productId) === String(productId));
    }
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
});

// POST /api/community/reviews
router.post('/reviews', (req, res) => {
  try {
    const { productId, userName, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product, rating, and review comment are required.' });
    }

    const newReview = {
      id: 'rev-' + Date.now(),
      productId: parseInt(productId, 10),
      userName: userName || 'Customer',
      rating: parseInt(rating, 10),
      comment: comment.trim(),
      replies: [],
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    const db = readDb();
    if (!db.reviews) db.reviews = [];
    db.reviews.unshift(newReview);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: newReview
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save review.' });
  }
});

// POST /api/community/reviews/:id/reply (Farmer / Artisan / Admin replies to customer feedback)
router.post('/reviews/:id/reply', (req, res) => {
  try {
    const { id } = req.params;
    const { author, role, replyText } = req.body;

    if (!replyText || !replyText.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text is required.' });
    }

    const db = readDb();
    if (!db.reviews) db.reviews = [];
    const review = db.reviews.find(r => r.id === id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (!review.replies) review.replies = [];
    const newReply = {
      id: 'rep-' + Date.now(),
      author: author || 'Verified Farmer',
      role: role || 'farmer',
      replyText: replyText.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };
    review.replies.push(newReply);
    writeDb(db);

    res.json({
      success: true,
      message: 'Farmer reply added successfully!',
      review,
      reply: newReply
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add reply to review.' });
  }
});

module.exports = router;
