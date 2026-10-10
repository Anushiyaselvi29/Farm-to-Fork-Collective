// ============================================
// ORDER ROUTES & CONTROLLER
// Farm to Fork Collective
// ============================================

const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../config/db');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');

// Valid coupons engine
const VALID_COUPONS = {
  'ORGANIC10': { type: 'percent', value: 10, desc: '10% OFF on all organic items' },
  'ORGANIC20': { type: 'percent', value: 20, desc: '20% OFF on all organic items' },
  'FIRST50': { type: 'flat', value: 50, desc: '₹50 Flat Discount for new members' },
  'FREESHIP': { type: 'free_delivery', value: 0, desc: 'Free Express Delivery' }
};

// GET /api/orders
router.get('/', (req, res) => {
  try {
    const { customerId, status } = req.query;
    const db = readDb();
    let results = [...(db.orders || [])];

    if (customerId) {
      results = results.filter(o => o.customerId === customerId || o.customerEmail === customerId);
    }
    if (status) {
      results = results.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    res.json({
      success: true,
      count: results.length,
      orders: results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const db = readDb();
    const order = (db.orders || []).find(o => o.id === id || o.id === '#' + id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving order.' });
  }
});

// POST /api/orders (Place new order)
router.post('/', (req, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone, address, slot, paymentMode, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    // Calculate subtotal from items
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity, 10)), 0);
    let deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 50;
    let discount = 0;

    if (couponCode && VALID_COUPONS[couponCode.toUpperCase()]) {
      const coupon = VALID_COUPONS[couponCode.toUpperCase()];
      if (coupon.type === 'percent') {
        discount = Math.round((subtotal * coupon.value) / 100);
      } else if (coupon.type === 'flat') {
        discount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === 'free_delivery') {
        deliveryFee = 0;
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);
    const orderId = '#FTF-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderId,
      customerId: req.body.customerId || 'guest',
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@farmtofork.com',
      customerPhone: customerPhone || '',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
        unit: item.unit || 'kg',
        image: item.image || ''
      })),
      subtotal,
      deliveryFee,
      discount,
      total,
      slot: slot || 'Morning (7:00 AM - 10:00 AM)',
      paymentMode: paymentMode || 'UPI Instant Pay',
      status: 'Processing',
      address: address || 'Standard Delivery Address',
      createdAt: new Date().toISOString()
    };

    const db = readDb();
    if (!db.orders) db.orders = [];
    db.orders.unshift(newOrder);
    writeDb(db);

    // Dispatch real email confirmation & activity notification to admin
    try {
      const customer = (db.users || []).find(u => 
        u.id === newOrder.customerId || 
        (u.email && u.email.toLowerCase() === (newOrder.customerEmail || '').toLowerCase())
      ) || {
        name: newOrder.customerName,
        email: newOrder.customerEmail,
        phone: newOrder.customerPhone,
        notificationPreferences: { email: true, sms: true, whatsapp: true }
      };

      // 1. Direct branded order confirmation email to user & admin alert
      emailService.sendOrderConfirmation({
        order: newOrder,
        customer
      }).catch(err => {
        console.warn('[Orders] Email confirmation dispatch notice:', err.message);
      });

      // 2. Multi-channel user notification (SMS, WhatsApp, In-App)
      notificationService.notifyUser(customer, {
        title: `Order Confirmed: ${newOrder.id}`,
        message: `Your order for ₹${newOrder.total} (${newOrder.items.length} items) has been received and scheduled for ${newOrder.slot}.`,
        actionUrl: `/pages/dashboard-customer.html`,
        type: 'order'
      }).catch(notifErr => {
        console.warn('[Orders] Multi-channel notification notice:', notifErr.message);
      });
    } catch (e) {
      console.warn('[Orders] Notification trigger error:', e.message);
    }

    res.status(201).json({
      success: true,
      message: `Order ${newOrder.id} placed successfully!`,
      order: newOrder
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: 'Failed to process order.' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const db = readDb();
    const order = (db.orders || []).find(o => o.id === id || o.id === '#' + id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    writeDb(db);

    // Notify customer about order status change
    try {
      const customer = (db.users || []).find(u => 
        u.id === order.customerId || 
        (u.email && u.email.toLowerCase() === (order.customerEmail || '').toLowerCase())
      ) || {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        notificationPreferences: { email: true, sms: true, whatsapp: true }
      };

      notificationService.notifyUser(customer, {
        title: `Order Update: ${order.id}`,
        message: `Your order status has been updated to "${status}".`,
        actionUrl: `/pages/dashboard-customer.html`,
        type: 'order'
      }).catch(notifErr => {
        console.warn('[Orders] Status notification dispatch notice:', notifErr.message);
      });
    } catch (e) {}

    res.json({
      success: true,
      message: `Order ${order.id} status updated to ${status}.`,
      order
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

module.exports = router;
