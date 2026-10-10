# 🌱 Farm to Fork Collective - Full Stack Platform

> A sustainable, transparent community marketplace connecting local organic farmers, artisans, and conscious customers with end-to-end seed-to-plate QR traceability.

---

## 🌟 Key Features

### 1. Multi-Role User Architecture
- **Customer**: Browse 34+ certified organic vegetables, fruits, handmade goods, and frozen packs; save to cart; apply promo coupons (`ORGANIC20`, `FIRST50`, `FREESHIP`); schedule delivery slots; track orders; submit product reviews; donate surplus food to partner NGOs.
- **Farmer**: Dedicated dashboard to publish harvested crops, set stock levels, track orders, and upload stage-by-stage seed-to-plate journey milestones with geo-stamps and lab test audits.
- **Artisan**: Showcase small-batch handmade goods (honey, cold-pressed oils, stone-ground peanut butter, A2 desi ghee, handcrafted soaps).
- **Master Administrator**: Secure admin console (`admin` / `admin123`) to monitor platform Gross Merchandise Value (GMV), oversee user verification queues, inspect organic certification audits, and audit QR batch codes.

### 2. Seed-to-Plate 7-Stage Traceability
- QR code batch scanner verifying each stage of the produce lifecycle:
  1. Seed Selection & Heirloom Genetic Purity
  2. Sowing & Bed Preparation
  3. Organic Tending & Bio-fertilizer application
  4. Harvesting
  5. Residue Screening & Lab Quality Audit
  6. Eco-Packaging & Batch Barcoding
  7. Cold-Chain Dispatch & Delivery

### 3. Community Kitchens & Wholesale Group Buying
- **Community Kitchens**: Neighborhood kitchen network offering wholesome community meals and volunteer opportunities.
- **Group Buying**: Tier-based wholesale buying pools allowing neighbors to combine orders and unlock 30%-40% discounts directly from source farms.

### 4. Multi-Channel Notification Preferences & Dashboard Profile Management
- **Registration Channel Selection**: During signup, users select how they prefer to receive order updates, flash deals, and verification OTPs:
  - 📱 **SMS Alerts** (Direct to mobile number)
  - 📧 **Gmail / Email** (Invoices & weekly harvest catalogs)
  - 💬 **WhatsApp** (Order tracking updates & Seed-to-Plate QR certificates)
- **Personal Dashboard Management**: Users can adjust notification preferences at any time via:
  - The in-dashboard **Profile & Notification Preferences** card on `dashboard-customer.html`.
  - The standalone dedicated **Profile Settings Page** (`pages/profile.html`) accessible by all user roles (Customer, Farmer, Artisan).
- **Interactive Simulator**: Test triggers allow users to simulate real-time push dispatches for SMS, Gmail, and WhatsApp with live styled toasts.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 14.x or higher)

### Installation & Launch

1. Open a terminal / command prompt in this directory:
   ```bash
   cd "MWT EL"
   ```

2. (Optional but recommended) Install Express dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   *Note: If you run `node server/server.js` without running `npm install` first, the server will automatically activate its built-in zero-dependency Node.js HTTP fallback so the entire app works out of the box!*

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Default Credentials

| Role | Username / Email | Password | Dashboard Link |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | [Admin Dashboard](http://localhost:5173/pages/dashboard-admin.html) |
| **Organic Farmer** | `farmer@farmtofork.com` | `farmer123` | [Farmer Dashboard](http://localhost:5173/pages/dashboard-farmer.html) |
| **Artisan Producer** | `artisan@farmtofork.com` | `artisan123` | [Artisan Dashboard](http://localhost:5173/pages/dashboard-artisan.html) |
| **Customer** | `priya@example.com` | `customer123` | [Customer Dashboard](http://localhost:5173/pages/dashboard-customer.html) |

---

## 📡 REST API Documentation

All API endpoints return standard JSON responses and are accessible under `/api`:

### Authentication & Profile (`/api/auth`)
- `POST /api/auth/register` - Register Customer, Farmer, or Artisan with multi-channel notification preferences (`sms`, `email`, `whatsapp`).
- `POST /api/auth/login` - Authenticate with email/username and password (returns RFC 7519 JWT).
- `POST /api/auth/admin-login` - Secure login for platform administrator.
- `POST /api/auth/oauth/google` - Google OAuth 2.0 single sign-on with JIT user provisioning.
- `POST /api/auth/oauth/github` - GitHub OAuth 2.0 sign-in.
- `POST /api/auth/forgot-password` - Request a 6-digit numeric OTP & secure reset link sent to registered email.
- `POST /api/auth/verify-otp` - Verify the 6-digit OTP code and receive single-use reset authorization token.
- `POST /api/auth/reset-password` - Update account password across JSON database and MongoDB store.
- `GET /api/auth/profile` - Retrieve current user profile and multi-channel notification preferences via Bearer JWT or email query.
- `PUT /api/auth/profile` - Update personal details (name, phone, address, farm/artisan metadata) and toggle SMS, Gmail, and WhatsApp notification channels.
- `GET /api/auth/me` - Retrieve current session profile with Bearer JWT token.

### Products (`/api/products`)
- `GET /api/products` - List products with optional query filters (`category`, `q`, `sort`, `page`, `limit`).
- `GET /api/products/:id` - Fetch product profile, nutrition, certifications, and reviews.
- `POST /api/products` - Publish a new crop or handmade product (Farmer / Artisan).
- `PUT /api/products/:id` - Update product details, pricing, or stock.
- `DELETE /api/products/:id` - Delete product listing.

### Orders (`/api/orders`)
- `GET /api/orders` - List all orders (filtered by customerId or status).
- `GET /api/orders/:id` - Track specific order by ID (e.g., `#FTF-2024-001`).
- `POST /api/orders` - Submit new order with coupon code discount calculation.
- `PATCH /api/orders/:id/status` - Update order lifecycle status (`Processing`, `Shipped`, `Delivered`).

### Seed-to-Plate Traceability (`/api/journey`)
- `GET /api/journey` - List all traceable batches.
- `GET /api/journey/:batchCode` - Retrieve 7-stage timeline for a batch (e.g., `FTF-POT-2024-001`).
- `POST /api/journey/stage` - Farmer uploads milestone timestamp, location, photo, and notes.
- `POST /api/journey/generate-qr` - Issue new batch trace barcode.

### Administration (`/api/admin`)
- `GET /api/admin/stats` - Platform volume, GMV, total registered users, and active kitchens.
- `GET /api/admin/users` - User list with role filters (`customer`, `farmer`, `artisan`, `admin`).
- `GET /api/admin/certifications` - Pending farm organic certifications.
- `POST /api/admin/certifications/:id/approve` - Approve submitted farm certification.

### Community (`/api/community`)
- `GET /api/community/group-buys` - Active wholesale buying pools.
- `POST /api/community/group-buys/:id/join` - Commit quantity to a group buy pool.
- `GET /api/community/kitchens` - Community dining locations and volunteer slots.
- `POST /api/community/donations` - Submit surplus food donation request to partner NGOs.
- `POST /api/community/reviews` - Submit product rating and feedback.

---

## 📂 Project Structure

```
MWT EL/
├── index.html                   # Main homepage with features & products
├── package.json                 # Node.js configuration and scripts
├── server/
│   ├── server.js                # Master server entrypoint (Express + Node HTTP fallback)
│   ├── config/
│   │   └── db.js                # Database read/write persistence helper
│   ├── data/
│   │   └── database.json        # Database with 34 products, users, journeys, orders
│   └── routes/
│       ├── auth.js              # Authentication endpoints
│       ├── products.js          # Products catalog & management
│       ├── orders.js            # Orders & checkout processing
│       ├── journey.js           # 7-stage seed-to-plate QR trace
│       ├── admin.js             # Platform analytics & approvals
│       └── community.js         # Group buying, kitchens & donations
├── js/
│   ├── api.js                   # Universal frontend-to-backend API client
│   ├── script.js                # Main catalog, search & UI logic
│   ├── cart.js                  # Shopping cart & coupon engine
│   └── animation.js             # Visual interactions & smooth motion
├── css/
│   ├── style.css                # Primary styles & design system
│   └── respnsive.css            # Responsive layout adjustments
├── pages/
│   ├── login.html               # Multi-role sign-in
│   ├── register.html            # User registration with multi-channel notification preferences (SMS, Gmail, WhatsApp)
│   ├── profile.html             # Standalone personal profile & notification channels management
│   ├── admin-login.html         # Master admin access portal
│   ├── products.html            # Shop catalog with live filters & search
│   ├── product-details.html     # Deep dive into nutrition, farm & eco-scores
│   ├── cart.html                # Cart management & coupon discounts
│   ├── checkout.html            # Slot booking, payment selection & order placement
│   ├── reset-password.html      # Standalone direct password reset with token & OTP url auto-fill
│   ├── dashboard-customer.html  # Order history, wishlist, tracking, donations & profile notification controls
│   ├── dashboard-farmer.html    # Crop management, inventory & harvest listings
│   ├── dashboard-artisan.html   # Handmade goods creation & order management
│   ├── dashboard-admin.html     # Platform GMV, KYC audit & farm certifications
│   ├── farmer-upload-journey.html # 7-stage milestone upload with QR creation
│   ├── seed-to-plate.html       # QR scan simulator & batch trace viewer
│   ├── group-buying.html        # Neighborhood wholesale group deals
│   └── community-kitchen.html   # Community kitchens & volunteer programs
├── test/
│   ├── verify-mandatory-features.js # Master automated audit suite (46 checks)
│   ├── verify-notification-preferences.js # Multi-channel registration & dashboard profile verifier
│   ├── test-api.js              # REST API verification script
│   └── verify-role-notifications.js # Smart notification & SMS alert verifier
└── tests/
    └── test-forgot-password.js  # Dedicated 6-step OTP & password reset test runner
```

---

## 📄 License
MIT License - Farm to Fork Collective.
