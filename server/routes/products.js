// ============================================
// PRODUCT ROUTES & CONTROLLER
// Farm to Fork Collective
// ============================================

const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../config/db');
const emailService = require('../services/emailService');

// GET /api/products
router.get('/', (req, res) => {
  try {
    const { category, q, sort, seller, page, limit } = req.query;
    const db = readDb();
    let results = [...db.products];

    // Filter by Category
    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Search Query
    if (q) {
      const keyword = q.toLowerCase().trim();
      results = results.filter(p => 
        p.name.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword) ||
        (p.seller && p.seller.toLowerCase().includes(keyword)) ||
        (p.origin && p.origin.toLowerCase().includes(keyword)) ||
        (p.description && p.description.toLowerCase().includes(keyword))
      );
    }

    // Filter by Seller
    if (seller) {
      results = results.filter(p => p.seller && p.seller.toLowerCase().includes(seller.toLowerCase()));
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price-low':
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'freshness':
          results.sort((a, b) => (b.freshnessScore || 0) - (a.freshnessScore || 0));
          break;
        case 'name':
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    const totalCount = results.length;

    // Pagination
    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 12;
      const start = (pageNum - 1) * limitNum;
      results = results.slice(start, start + limitNum);

      return res.json({
        success: true,
        total: totalCount,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        products: results
      });
    }

    res.json({
      success: true,
      total: totalCount,
      products: results
    });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

const productService = require('../services/productService');
const jwt = require('../utils/jwt');

// Helper to extract authenticated user
function getAuthUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader) {
    try {
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
      const decoded = jwt.verify(token);
      if (decoded && decoded.sub) {
        const db = readDb();
        const found = db.users.find(u => u.id === decoded.sub);
        if (found) return found;
      }
    } catch (e) {}
  }

  // Fallback for role specified in body/session
  const reqRole = req.body.role || req.body.sellerRole || (req.body.category === 'handmade' ? 'artisan' : 'farmer');
  return {
    id: 'usr-producer-' + Date.now(),
    name: req.body.seller || (reqRole === 'artisan' ? 'Kavitha Natarajan' : 'Sundaram Perumal'),
    role: reqRole,
    farmName: req.body.seller || 'Green Valley Farm',
    farmLocation: req.body.origin || 'Tamil Nadu'
  };
}

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const rawId = String(req.params.id).trim();
    const db = readDb();
    
    // Support lookup by numeric id, productId, or traceabilityId
    const product = db.products.find(p => 
      String(p.id) === rawId ||
      (p.productId && p.productId.toUpperCase() === rawId.toUpperCase()) ||
      (p.traceabilityId && p.traceabilityId.toUpperCase() === rawId.toUpperCase()) ||
      (p.batchCode && p.batchCode.toUpperCase() === rawId.toUpperCase())
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Attach reviews for this product
    const reviews = db.reviews ? db.reviews.filter(r => r.productId === product.id) : [];

    res.json({
      success: true,
      product: {
        ...product,
        reviews
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving product.' });
  }
});

// POST /api/products (Farmer / Artisan add product with centralized Traceability & QR Code)
router.post('/', async (req, res) => {
  try {
    const user = getAuthUser(req);

    // Security Check: Customer accounts cannot create farmer/artisan listings
    if (user.role === 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Customer accounts are not authorized to create product listings. Only Farmers and Artisans can add products.'
      });
    }

    const { product, traceability } = await productService.createProduct(req.body, user);

    // Dispatch product submission email confirmation to seller & activity notification to admin
    try {
      // Ensure user has valid email or lookup in db
      const db = readDb();
      const fullSeller = (db.users || []).find(u => u.id === user.id || u.name === user.name) || user;
      if (req.body.sellerEmail) fullSeller.email = req.body.sellerEmail;

      emailService.sendProductSubmissionConfirmation({
        product,
        seller: fullSeller
      }).catch(err => {
        console.warn('[Products] Email confirmation notice:', err.message);
      });
    } catch (e) {
      console.warn('[Products] Notification error:', e.message);
    }

    res.status(201).json({
      success: true,
      message: `Product "${product.name}" added successfully with unique Product ID and verified Traceability QR Code!`,
      product: product,
      productId: product.productId,
      traceabilityId: product.traceabilityId,
      qrCode: product.qrCode,
      publicTraceUrl: product.publicTraceUrl,
      traceability: traceability
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(err.message && err.message.includes('Unauthorized') ? 403 : 400).json({
      success: false,
      message: err.message || 'Failed to create product listing.'
    });
  }
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = readDb();
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.products[index] = {
      ...db.products[index],
      ...req.body,
      id // Ensure id is immutable
    };

    writeDb(db);

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: db.products[index]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const db = readDb();
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== id);

    if (db.products.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    writeDb(db);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

module.exports = router;
