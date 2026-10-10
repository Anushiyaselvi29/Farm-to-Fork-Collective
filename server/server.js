// ============================================
// MAIN SERVER ENTRYPOINT
// Farm to Fork Collective
// ============================================

const path = require('path');
const fs = require('fs');

// Automatically load .env configuration (supporting root .env and server/.env)
try {
  const dotenv = require('dotenv');
  const rootEnvPath = path.join(__dirname, '..', '.env');
  const serverEnvPath = path.join(__dirname, '.env');
  if (fs.existsSync(rootEnvPath)) dotenv.config({ path: rootEnvPath });
  if (fs.existsSync(serverEnvPath)) dotenv.config({ path: serverEnvPath, override: true });
} catch (e) {
  // Graceful fallback if dotenv is not loaded
}

const PORT = process.env.PORT || 5000;
const ROOT_DIR = path.join(__dirname, '..');

// Check if express is installed
let expressAvailable = false;
try {
  require.resolve('express');
  expressAvailable = true;
} catch (e) {
  expressAvailable = false;
}

// ----------------------------------------------------
// 1. EXPRESS SERVER IMPLEMENTATION
// ----------------------------------------------------
function createExpressApp() {
  const express = require('express');
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

  let cors;
  try {
    cors = require('cors');
  } catch (e) {
    cors = () => (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      if (req.method === 'OPTIONS') return res.sendStatus(200);
      next();
    };
  }

  const app = express();

  // Middleware - CORS: Allow any origin or configured frontend
  const corsOptions = {
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes (Mounted with /api prefix)
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/traceability', require('./routes/traceability'));
  app.use('/api/notifications', require('./routes/notifications'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/journey', require('./routes/journey'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/community', require('./routes/community'));
  app.all('/api/contact*', (req, res, next) => {
    req.url = '/contact';
    require('./routes/community')(req, res, next);
  });

  // Direct subroutes (Supports serverless rewrites without /api prefix)
  app.use('/auth', require('./routes/auth'));
  app.use('/products', require('./routes/products'));
  app.use('/traceability', require('./routes/traceability'));
  app.use('/notifications', require('./routes/notifications'));
  app.use('/orders', require('./routes/orders'));
  app.use('/journey', require('./routes/journey'));
  app.use('/admin', require('./routes/admin'));
  app.use('/community', require('./routes/community'));

  // Health & Database status checks
  const healthHandler = (req, res) => {
    const { getMongoStatus } = require('./config/db');
    res.json({
      status: 'online',
      platform: 'Farm to Fork Collective API',
      mongo: getMongoStatus ? getMongoStatus() : { connected: false },
      timestamp: new Date().toISOString()
    });
  };
  app.get('/api/health', healthHandler);
  app.get('/health', healthHandler);

  app.get('/api/mongo-status', (req, res) => {
    const { getMongoStatus } = require('./config/db');
    res.json(getMongoStatus ? getMongoStatus() : { connected: false });
  });

  // Serve static files from root directory
  app.use(express.static(ROOT_DIR));

  // Page aliases
  app.get('/traceability/:id', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'pages', 'traceability.html'));
  });

  app.get('/complete-profile', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'pages', 'complete-profile.html'));
  });

  app.get('/google-login-popup.html', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'pages', 'google-login-popup.html'));
  });

  app.get('/reset-password.html', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'pages', 'reset-password.html'));
  });

  app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'pages', 'reset-password.html'));
  });

  // Fallback to index.html for root navigation
  app.get('/', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'index.html'));
  });

  return app;
}

let appInstance = null;
if (expressAvailable) {
  appInstance = createExpressApp();
  if (require.main === module) {
    const server = appInstance.listen(PORT, () => {
      const actualPort = server.address().port;
      console.log(`\n========================================`);
      console.log(` FARM TO FORK COLLECTIVE`);
      console.log(` BACKEND`);
      console.log(`========================================`);
      console.log(` URL: http://localhost:${actualPort}`);
      console.log(` FRONTEND: http://localhost:5173`);
      console.log(` DATABASE: mongodb://127.0.0.1:27017`);
      console.log(`========================================\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
        console.log(`👉 Please close the other terminal or run: taskkill /F /IM node.exe\n`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
      }
    });
  }
} else {
  if (require.main === module) {
    console.log('⚠️  Notice: "express" package not installed yet. Launching built-in zero-dependency Node.js HTTP server fallback...');
    startBuiltinServer();
  }
}

// ----------------------------------------------------
// 2. BUILT-IN ZERO-DEPENDENCY HTTP SERVER FALLBACK
// ----------------------------------------------------
function startBuiltinServer() {
  const http = require('http');
  const url = require('url');
  const { readDb, writeDb } = require('./config/db');
  const jwt = require('./utils/jwt');

  const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  };

  const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Helper to send JSON
    const sendJson = (statusCode, data) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // Helper to parse JSON body
    const parseBody = (callback) => {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          callback(parsed);
        } catch (e) {
          callback({});
        }
      });
    };

    // --- API ENDPOINTS ---
    if (pathname.startsWith('/api/')) {
      const db = readDb();

      // Health
      if (pathname === '/api/health') {
        return sendJson(200, { status: 'online', mode: 'builtin-node', timestamp: new Date().toISOString() });
      }

      // Products: GET /api/products
      if (pathname === '/api/products' && req.method === 'GET') {
        const { category, q, sort } = parsedUrl.query;
        let prods = [...db.products];
        if (category && category !== 'all') prods = prods.filter(p => p.category.toLowerCase() === category.toLowerCase());
        if (q) {
          const kw = q.toLowerCase();
          prods = prods.filter(p => p.name.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw));
        }
        if (sort === 'price-low') prods.sort((a,b) => a.price - b.price);
        if (sort === 'price-high') prods.sort((a,b) => b.price - a.price);
        if (sort === 'rating') prods.sort((a,b) => b.rating - a.rating);
        return sendJson(200, { success: true, total: prods.length, products: prods });
      }

      // Single Product: GET /api/products/:id
      if (pathname.startsWith('/api/products/') && req.method === 'GET') {
        const id = parseInt(pathname.split('/')[3], 10);
        const prod = db.products.find(p => p.id === id);
        if (prod) return sendJson(200, { success: true, product: prod });
        return sendJson(404, { success: false, message: 'Product not found' });
      }

      // Create Product: POST /api/products
      if (pathname === '/api/products' && req.method === 'POST') {
        return parseBody(data => {
          const newId = Math.max(...db.products.map(p => p.id), 0) + 1;
          const newProd = {
            id: newId,
            name: data.name || 'Organic Produce',
            category: data.category || 'vegetables',
            price: parseFloat(data.price) || 50,
            originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : 70,
            unit: data.unit || 'kg',
            image: data.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
            freshness: 'Fresh',
            freshnessScore: 90,
            rating: 5.0,
            reviewsCount: 1,
            seller: data.seller || 'Farm Direct',
            origin: data.origin || 'Tamil Nadu',
            harvestDate: 'Fresh Harvest',
            shelfLife: '5-7 days',
            badge: data.badge || '🌿 Organic',
            type: data.category === 'handmade' ? 'handmade' : 'fresh',
            ecoScore: 95,
            description: data.description || 'Certified fresh organic product.',
            nutrition: { calories: 'Natural' },
            certifications: ['India Organic']
          };
          db.products.unshift(newProd);
          writeDb(db);
          return sendJson(201, { success: true, product: newProd });
        });
      }

      // Update Product: PUT /api/products/:id
      if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
        const id = parseInt(pathname.split('/')[3], 10);
        return parseBody(data => {
          const idx = db.products.findIndex(p => p.id === id);
          if (idx === -1) return sendJson(404, { success: false, message: 'Product not found' });
          db.products[idx] = { ...db.products[idx], ...data, id };
          writeDb(db);
          return sendJson(200, { success: true, product: db.products[idx] });
        });
      }

      // Delete Product: DELETE /api/products/:id
      if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
        const id = parseInt(pathname.split('/')[3], 10);
        const prevLen = db.products.length;
        db.products = db.products.filter(p => p.id !== id);
        if (db.products.length === prevLen) return sendJson(404, { success: false, message: 'Product not found' });
        writeDb(db);
        return sendJson(200, { success: true, message: 'Product deleted' });
      }

      // Auth: POST /api/auth/login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        return parseBody(data => {
          const user = db.users.find(u => (u.email === data.email || u.username === data.email) && u.password === data.password);
          if (user) {
            const safe = { ...user };
            delete safe.password;
            const token = jwt.sign({ sub: safe.id, email: safe.email, role: safe.role, name: safe.name });
            return sendJson(200, { success: true, user: safe, token, tokenType: 'Bearer', expiresIn: 86400 });
          }
          return sendJson(401, { success: false, message: 'Invalid email or password.' });
        });
      }

      // Auth: POST /api/auth/register
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        return parseBody(data => {
          if (!data.name || !data.email || !data.password) {
            return sendJson(400, { success: false, message: 'Missing required fields.' });
          }
          let notifPrefs = { sms: true, email: true, whatsapp: true };
          if (data.notificationPreferences && typeof data.notificationPreferences === 'object') {
            notifPrefs = {
              sms: data.notificationPreferences.sms !== false,
              email: data.notificationPreferences.email !== false && data.notificationPreferences.gmail !== false,
              whatsapp: data.notificationPreferences.whatsapp !== false
            };
          } else if (Array.isArray(data.notifications)) {
            notifPrefs = {
              sms: data.notifications.includes('sms'),
              email: data.notifications.includes('email') || data.notifications.includes('gmail'),
              whatsapp: data.notifications.includes('whatsapp')
            };
          }
          const newUser = {
            id: 'usr-' + Date.now(),
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            password: data.password,
            role: data.role || 'customer',
            farmName: data.farmName,
            farmLocation: data.farmLocation,
            notificationPreferences: notifPrefs,
            createdAt: new Date().toISOString()
          };
          db.users.push(newUser);
          writeDb(db);
          const safe = { ...newUser };
          delete safe.password;
          const token = jwt.sign({ sub: safe.id, email: safe.email, role: safe.role, name: safe.name });
          return sendJson(201, { success: true, user: safe, token, tokenType: 'Bearer', expiresIn: 86400 });
        });
      }

      // Auth: GET / PUT / POST /api/auth/profile
      if (pathname === '/api/auth/profile') {
        if (req.method === 'GET') {
          const authHeader = req.headers['authorization'] || req.headers['Authorization'];
          let sub = null;
          if (authHeader) {
            try {
              const token = authHeader.replace('Bearer ', '');
              const decoded = jwt.verify(token);
              if (decoded) sub = decoded.sub;
            } catch (e) {}
          }
          const user = db.users.find(u => (sub && u.id === sub));
          if (user) {
            const safe = { ...user };
            delete safe.password;
            if (!safe.notificationPreferences) safe.notificationPreferences = { sms: true, email: true, whatsapp: true };
            return sendJson(200, { success: true, user: safe });
          }
          return sendJson(404, { success: false, message: 'User not found' });
        }

        if (req.method === 'PUT' || req.method === 'PATCH' || req.method === 'POST') {
          return parseBody(data => {
            const authHeader = req.headers['authorization'] || req.headers['Authorization'];
            let sub = null;
            if (authHeader) {
              try {
                const token = authHeader.replace('Bearer ', '');
                const decoded = jwt.verify(token);
                if (decoded) sub = decoded.sub;
              } catch (e) {}
            }
            const idx = db.users.findIndex(u => (sub && u.id === sub) || (data.id && u.id === data.id) || (data.email && u.email && u.email.toLowerCase() === data.email.toLowerCase()));
            if (idx === -1) return sendJson(404, { success: false, message: 'User not found to update' });
            
            const user = db.users[idx];
            if (data.name) user.name = data.name.trim();
            if (data.phone !== undefined) user.phone = String(data.phone).trim();
            if (data.address !== undefined) user.address = String(data.address).trim();
            if (data.farmName !== undefined && user.role === 'farmer') user.farmName = data.farmName;
            if (data.farmLocation !== undefined && user.role === 'farmer') user.farmLocation = data.farmLocation;

            if (data.notificationPreferences && typeof data.notificationPreferences === 'object') {
              user.notificationPreferences = {
                sms: data.notificationPreferences.sms !== false,
                email: data.notificationPreferences.email !== false && data.notificationPreferences.gmail !== false,
                whatsapp: data.notificationPreferences.whatsapp !== false
              };
            } else if (Array.isArray(data.notifications)) {
              user.notificationPreferences = {
                sms: data.notifications.includes('sms'),
                email: data.notifications.includes('email') || data.notifications.includes('gmail'),
                whatsapp: data.notifications.includes('whatsapp')
              };
            }

            user.updatedAt = new Date().toISOString();
            writeDb(db);
            const safe = { ...user };
            delete safe.password;
            return sendJson(200, { success: true, message: 'Profile updated successfully!', user: safe });
          });
        }
      }

      // Auth: POST /api/auth/admin-login
      // Auth: POST /api/auth/admin-login
      if (pathname === '/api/auth/admin-login' && req.method === 'POST') {
        return parseBody(data => {
          if (data.username === 'admin' && data.password === 'admin123') {
            const adminUser = db.users.find(u => u.role === 'admin') || { id: 'usr-admin-1', name: 'Platform Administrator', email: 'admin@farmtofork.com', role: 'admin' };
            const safeAdmin = { ...adminUser };
            delete safeAdmin.password;
            const token = jwt.sign({ sub: safeAdmin.id, email: safeAdmin.email, role: 'admin', name: safeAdmin.name, isAdmin: true });
            return sendJson(200, { success: true, user: safeAdmin, token, tokenType: 'Bearer', expiresIn: 86400 });
          }
          return sendJson(401, { success: false, message: 'Invalid admin credentials' });
        });
      }

      // Auth: POST /api/auth/forgot-password
      if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
        return parseBody(data => {
          const email = (data.email || '').trim().toLowerCase();
          if (!email) return sendJson(400, { success: false, message: 'Please enter your registered email address.' });
          const user = db.users.find(u => u.email && u.email.toLowerCase() === email);
          if (!user) {
            return sendJson(404, { success: false, message: 'No account registered with this email address.' });
          }
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const resetToken = 'tk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
          if (!global.__builtinResets) global.__builtinResets = new Map();
          global.__builtinResets.set(email, { otp, token: resetToken, expiresAt: Date.now() + 15 * 60 * 1000, userId: user.id });
          const resetLink = `http://localhost:${PORT}/pages/reset-password.html?email=${encodeURIComponent(email)}&token=${resetToken}&otp=${otp}`;
          return sendJson(200, {
            success: true,
            message: `OTP and change password link generated for ${email}!`,
            email,
            otp,
            resetLink,
            expiresInSeconds: 900
          });
        });
      }

      // Auth: POST /api/auth/verify-otp
      if (pathname === '/api/auth/verify-otp' && req.method === 'POST') {
        return parseBody(data => {
          const email = (data.email || '').trim().toLowerCase();
          const otp = (data.otp || '').trim();
          if (!global.__builtinResets) global.__builtinResets = new Map();
          const record = global.__builtinResets.get(email);
          if (!record || Date.now() > record.expiresAt) {
            return sendJson(400, { success: false, message: 'No active OTP request found or OTP expired.' });
          }
          if (record.otp !== otp) {
            return sendJson(400, { success: false, message: 'Invalid 6-digit OTP. Please check the code.' });
          }
          return sendJson(200, {
            success: true,
            message: 'OTP verified successfully!',
            resetToken: record.token
          });
        });
      }

      // Auth: POST /api/auth/reset-password
      if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
        return parseBody(data => {
          const email = (data.email || '').trim().toLowerCase();
          const newPassword = data.newPassword;
          if (!email || !newPassword || newPassword.length < 4) {
            return sendJson(400, { success: false, message: 'Valid email and new password required.' });
          }
          if (!global.__builtinResets) global.__builtinResets = new Map();
          const record = global.__builtinResets.get(email);
          const isAuth = record && (record.otp === (data.otp || '').trim() || record.token === (data.token || '').trim());
          if (!isAuth) {
            return sendJson(400, { success: false, message: 'Invalid or expired reset token/OTP.' });
          }
          const userIdx = db.users.findIndex(u => u.email && u.email.toLowerCase() === email);
          if (userIdx === -1) return sendJson(404, { success: false, message: 'User not found.' });
          db.users[userIdx].password = newPassword;
          writeDb(db);
          global.__builtinResets.delete(email);
          return sendJson(200, { success: true, message: 'Password successfully updated!' });
        });
      }

      // Orders: GET /api/orders
      if (pathname === '/api/orders' && req.method === 'GET') {
        return sendJson(200, { success: true, count: (db.orders || []).length, orders: db.orders || [] });
      }

      // Orders: POST /api/orders
      if (pathname === '/api/orders' && req.method === 'POST') {
        return parseBody(data => {
          const orderId = '#FTF-' + Math.floor(100000 + Math.random() * 900000);
          const newOrder = {
            id: orderId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            items: data.items || [],
            subtotal: data.subtotal || 0,
            deliveryFee: data.deliveryFee || 0,
            discount: data.discount || 0,
            total: data.total || 0,
            slot: data.slot || 'Morning Slot',
            paymentMode: data.paymentMode || 'UPI',
            status: 'Processing',
            address: data.address || ''
          };
          if (!db.orders) db.orders = [];
          db.orders.unshift(newOrder);
          writeDb(db);
          return sendJson(201, { success: true, order: newOrder });
        });
      }

      // Journey: GET /api/journey/:batchCode
      if (pathname.startsWith('/api/journey/')) {
        const batch = pathname.split('/')[3].toUpperCase();
        const journey = (db.journeys || {})[batch];
        if (journey) return sendJson(200, { success: true, batchCode: batch, journey });
        return sendJson(404, { success: false, message: 'Batch not found.' });
      }

      // Admin Stats: GET /api/admin/stats
      if (pathname === '/api/admin/stats' && req.method === 'GET') {
        return sendJson(200, {
          success: true,
          stats: {
            totalUsers: (db.users || []).length,
            farmersCount: (db.users || []).filter(u => u.role === 'farmer').length,
            communityKitchens: (db.kitchens || []).length,
            totalGmv: (db.orders || []).reduce((s, o) => s + (o.total || 0), 0)
          }
        });
      }

      // Community: GET /api/community/group-buys
      if (pathname === '/api/community/group-buys' && req.method === 'GET') {
        return sendJson(200, { success: true, groupBuys: db.groupBuys || [] });
      }

      // Community: GET /api/community/kitchens
      if (pathname === '/api/community/kitchens' && req.method === 'GET') {
        return sendJson(200, { success: true, kitchens: db.kitchens || [] });
      }

      // Community: POST /api/community/donations
      if ((pathname === '/api/community/donations' || pathname === '/api/donations') && req.method === 'POST') {
        return parseBody(data => {
          const newDonation = {
            id: 'don-' + Date.now(),
            donorName: data.donorName || 'Kind Community Member',
            donorEmail: data.donorEmail || null,
            produce: (data.produce || '').trim(),
            ngo: (data.ngo || '').trim(),
            status: 'Assigned for Pickup',
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            createdAt: new Date().toISOString()
          };
          if (!db.donations) db.donations = [];
          db.donations.unshift(newDonation);
          writeDb(db);
          try {
            const emailService = require('./services/emailService');
            emailService.sendDonationConfirmation({ donation: newDonation, donor: { name: newDonation.donorName, email: newDonation.donorEmail } });
          } catch (e) {}
          return sendJson(201, { success: true, message: 'Donation request submitted! The partner NGO has been notified.', donation: newDonation });
        });
      }

      // Contact: POST /api/contact or /api/community/contact
      if ((pathname === '/api/contact' || pathname === '/api/community/contact') && req.method === 'POST') {
        return parseBody(data => {
          const emailService = require('./services/emailService');
          if (!data.email || !emailService.isValidEmail(data.email)) {
            return sendJson(400, { success: false, message: 'Please provide a valid email address.' });
          }
          const msg = {
            id: 'msg-' + Date.now(),
            name: data.name || 'Visitor',
            email: data.email.trim().toLowerCase(),
            phone: data.phone || '',
            subject: data.subject || 'Support Inquiry',
            message: data.message || '',
            status: 'Received',
            createdAt: new Date().toISOString()
          };
          if (!db.contactMessages) db.contactMessages = [];
          db.contactMessages.unshift(msg);
          writeDb(db);
          try {
            emailService.sendContactConfirmation({ to: msg.email, name: msg.name, subject: msg.subject, message: msg.message, phone: msg.phone });
          } catch (e) {}
          return sendJson(201, { success: true, message: 'Your message has been sent successfully! A confirmation has been sent to your email.', contactMessage: msg });
        });
      }

      return sendJson(404, { success: false, message: 'Endpoint not found.' });
    }

    // --- STATIC FILE SERVING ---
    if (pathname === '/google-login-popup.html') pathname = '/pages/google-login-popup.html';
    if (pathname === '/reset-password.html') pathname = '/pages/reset-password.html';
    let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);

    // Normalize path to prevent traversal attacks
    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.listen(PORT, () => {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
    console.log(`\n========================================`);
    console.log(` FARM TO FORK COLLECTIVE`);
    console.log(` BACKEND`);
    console.log(`========================================`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` FRONTEND: http://localhost:5173`);
    console.log(` DATABASE: mongodb://127.0.0.1:27017`);
    console.log(`========================================\n`);
  });
}

module.exports = appInstance;

