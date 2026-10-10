# 🌱 Farm to Fork Collective - Full-Stack Sustainable Agriculture & Organic Marketplace

> **A Next-Generation Sustainable Food Supply Chain Platform** connecting local organic farmers, artisanal producers, and conscious consumers with verifiable **7-Stage Seed-to-Plate Blockchain Traceability**, hyper-local food-miles carbon calculation, and dynamic community group buying.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [11 Mandatory Features & Project Defense Summary](#-11-mandatory-features--project-defense-summary)
3. [Verified User Credentials (At Least 6 Roles)](#-verified-user-credentials)
4. [Quick Start & Setup Guide](#-quick-start--setup-guide)
5. [Automated Verification & Self-Test Suite](#-automated-verification--self-test-suite)
6. [Interactive API Explorer & Documentation](#-interactive-api-explorer--documentation)
7. [Directory Structure](#-directory-structure)
8. [License](#-license)

---

## 🌟 Project Overview

**Farm to Fork Collective** eliminates intermediary broker inflation by directly bridging smallholder organic farmers from Tamil Nadu's prime agro-ecological zones (Dindigul, Pollachi, Ooty, Chettinad, Salem, Thanjavur) with retail and community consumers. The platform guarantees transparency through:
- **Seed-to-Plate Traceability**: Verifiable cryptographic timeline from heirloom seed selection to cold-chain doorstep delivery.
- **Fair Farmer Compensation**: Zero middlemen fees, direct farm-gate pricing transparency.
- **Eco-Audit**: Hyper-local food miles and CO₂ emission abatement algorithms.
- **Inclusivity**: Native bilingual engine offering **100% pure Tamil (தமிழ்)** and English interfaces.

---

## 🛡️ 11 Mandatory Features & Project Defense Summary

| # | Mandatory Feature | Implementation Detail | Location |
|---|---|---|---|
| **1** | **OAuth 2.0 Authentication** | Google & GitHub OAuth integration with Just-In-Time (JIT) provisioning and JWT issuance. | `server/routes/auth.js`, `pages/login.html` |
| **2** | **RFC 7519 Signed JWT** | Cryptographically signed tokens (HMAC-SHA256) verifying `header.payload.signature` for protected endpoints. | `server/utils/jwt.js`, `server/routes/auth.js` |
| **3** | **At Least 5 Verified Accounts** | Pre-seeded with 6 role-based accounts (Admin, Farmer, Artisan, Retail Customer, Community Customer, Researcher). | `server/data/database.json` |
| **4** | **Admin Dashboard & Live Metrics** | Secure administrative portal monitoring platform GMV, KYC verifications, farm certification approvals, and audit logs. | `pages/dashboard-admin.html`, `server/routes/admin.js` |
| **5** | **API Access & Interactive Explorer** | Full REST API with dedicated interactive test explorer page to execute live requests and inspect responses. | `pages/api-docs.html`, `/api/*` routes |
| **6** | **AI Assistant / Chatbot** | Bilingual Tamil/English NLP chatbot responding to batch trace inquiries, farm origin queries, and nutritional data. | `js/chatbot.js` |
| **7** | **Recently Accessed Engine** | Client-side tracking caching recently viewed organic items and rendering an interactive responsive slider. | `js/recently-accessed.js`, `index.html`, `pages/products.html` |
| **8** | **100% Pure Tamil Localization** | Comprehensive bilingual translation engine covering all catalog labels, descriptions, and dashboard metrics with zero mixed English artifacts. | `js/i18n.js` |
| **9** | **Authentic Geographic Data** | 34 authentic Tamil Nadu agro-products with verified FSSAI Jaivik Bharat & India Organic certification IDs. No placeholder data. | `server/data/database.json` |
| **10** | **Non-CRUD: 7-Stage Blockchain Traceability** | Cryptographic hash-chained milestone logging with geo-stamps, temperature logs, and pesticide residue lab audits. | `server/routes/journey.js`, `pages/seed-to-plate.html` |
| **11** | **Non-CRUD: Food Miles & Group Pooling Algorithms** | Dynamic calculation of logistical emissions saved ($CO_2$) and neighborhood wholesale discount pooling tiers (up to 50% off). | `server/routes/community.js`, `pages/group-buying.html` |
| **12** | **Smart Role Notifications & Phone SMS Alerts** | Role-segregated event triggers (wishlist price drops, restocks, orders) with real-time push toasts and formatted phone SMS alerts. | `js/notifications.js`, all dashboards |
| **13** | **Multi-Farmer Crop Marketplace & Compare** | Enables multiple local farmers to list identical crops with side-by-side modal comparing price, farm location, distance, rating, and organic badge. | `pages/farmer-marketplace.html`, `js/farmer-marketplace.js` |
| **14** | **Forgot Password, 6-Digit OTP & Password Reset** | Complete self-service recovery lifecycle: numeric OTP generation (15 min expiry), SMTP dispatch, single-use token authorization, and standalone reset page. | `pages/reset-password.html`, `pages/login.html`, `server/routes/auth.js` |

---

## 🔑 Verified User Credentials

| Role | Name / Badge | Username / Email | Password | Access Portal |
| :--- | :--- | :--- | :--- | :--- |
| **👑 Platform Administrator** | Admin Console | `admin@farmtofork.com` *(or `admin`)* | `admin123` | [Admin Portal](http://localhost:5173/pages/dashboard-admin.html) |
| **👨‍🌾 Organic Farmer** | Sundaram Perumal (Dindigul) | `farmer@farmtofork.com` | `farmer123` | [Farmer Dashboard](http://localhost:5173/pages/dashboard-farmer.html) |
| **🧺 Artisan Producer** | Kavitha Natarajan (Handcrafted Soaps & Honey) | `artisan@farmtofork.com` | `artisan123` | [Artisan Dashboard](http://localhost:5173/pages/dashboard-artisan.html) |
| **👩 Retail Customer** | Priya Sharma (Chennai) | `priya@example.com` | `customer123` | [Customer Dashboard](http://localhost:5173/pages/dashboard-customer.html) |
| **👨 Community Customer** | Ananya Krishnan | `customer@farmtofork.com` | `customer123` | [Customer Dashboard](http://localhost:5173/pages/dashboard-customer.html) |
| **🎓 Student / Researcher** | Anushiya Selvi.M (NEC) | `24104118@nec.edu.in` | `1234` | [Customer Porta## 🚀 Quick Start & Setup Guide

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **NPM** (bundled with Node.js)
- **Git**

### 2. Local Installation
```bash
git clone https://github.com/Anushiyaselvi29/Farm-to-Fork-Collective.git
cd Farm-to-Fork-Collective
npm install
```

### 3. Local Development
```bash
# Start frontend with Vite (Port 5173):
npm run dev

# Start backend with Express (Port 5000):
npm run dev:backend

# Or run both concurrently:
npm run dev:all
```

---

## ☁️ Deployment Guide (GitHub & Vercel)

### Architecture
- **Frontend**: Vite Multi-Page Application deployed statically to Vercel Global Edge Network (`dist/`).
- **Backend**: Express REST API running seamlessly as a Vercel Serverless Function via `api/index.js` and `vercel.json` rewrites.
- **Database**: MongoDB Compass locally, with seamless MongoDB Atlas URI connection in production + resilient in-memory JSON fallback.

### Deploying to Vercel
1. **Push to GitHub**:
   Ensure all changes are committed and pushed to `main` branch:
   ```bash
   git add .
   git commit -m "Deploy: Farm-to-Fork Collective on Vercel"
   git push -u origin main
   ```
2. **Import into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click **Add New...** > **Project**.
   - Import `Anushiyaselvi29/Farm-to-Fork-Collective`.
   - Framework Preset: **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. **Environment Variables**:
   Add the following variables in **Project Settings > Environment Variables**:
   | Variable | Description | Example / Default |
   | :--- | :--- | :--- |
   | `NODE_ENV` | Production environment flag | `production` |
   | `JWT_SECRET` | Secret key for RFC 7519 JWT signing | `farm_to_fork_jwt_secure_key_2026_super_secret` |
   | `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/farmtofork` |
   | `VITE_GOOGLE_CLIENT_ID` | Google OAuth Web Client ID | `939090047671-otlai1n75lvc9mgass18jd721dpp8f36.apps.googleusercontent.com` |
   | `GMAIL_USER` | Gmail address for OTP notifications | `your_email@gmail.com` |
   | `GMAIL_APP_PASSWORD` | Google 16-character App Password | `xxxx xxxx xxxx xxxx` |

4. **Deploy**:
   Click **Deploy**. Vercel automatically builds the Vite frontend and provisions `/api/*` serverless function routes.

---

## 🔐 Google OAuth 2.0 Official Integration

The platform uses genuine **Google Identity Services (GIS)** with OAuth 2.0 authorization at `accounts.google.com`:
- **Interactive Account Chooser**: When clicking **Continue with Google**, the application immediately triggers Google's official account chooser (`prompt: 'select_account'`) displaying all accounts available in the user's browser.
- **Cryptographic Backend Verification**: Tokens are validated cryptographically against Google's `oauth2.googleapis.com/tokeninfo` and `www.googleapis.com/oauth2/v3/userinfo` APIs.
- **Role Security**: Newly registered Google accounts are provisioned as `customer` (never auto-promoted to `admin`). Incomplete customer profiles are seamlessly guided to `pages/complete-profile.html`.

### Google Cloud Console Configuration:
- **Client ID**: `939090047671-otlai1n75lvc9mgass18jd721dpp8f36.apps.googleusercontent.com`
- **Authorized JavaScript origins**:
  - `http://localhost:5173` (Vite dev server)
  - `http://localhost:5000` (Node.js fullstack server)
  - `https://farm-to-fork-collective.vercel.app` (Vercel production deployment)
- **Authorized redirect URIs**:
  - `http://localhost:5173/pages/oauth-callback.html`
  - `http://localhost:5000/pages/oauth-callback.html`
  - `https://farm-to-fork-collective.vercel.app/pages/oauth-callback.html`

---

## 🧪 Automated Verification & Self-Test Suite

The repository includes a comprehensive automated audit script testing all features:
```bash
npm test
```

### Test Scope:
- **Feature 1**: OAuth 2.0 configuration, Google JIT provisioning, GitHub verification.
- **Feature 2**: RFC 7519 JWT structure (`header.payload.signature`), HMAC-SHA256 signature, Bearer authorization header validation.
- **Feature 3**: Successful login and token receipt for all 6 test users.
- **Feature 4**: Admin login and live database metrics calculation (GMV, farmer counts).
- **Feature 5**: API `/api/health` status and OpenAPI interactive documentation file check.
- **Feature 6**: Chatbot NLP engine and bilingual query responses.
- **Feature 7**: Recently accessed local storage engine & UI bindings.
- **Feature 8**: Pure Tamil dictionary completeness.
- **Feature 9**: Geographic origin verification across 34 products.
- **Features 10 & 11**: 7-stage blockchain journey integrity, lab purity audits, food miles CO₂ savings, and group buying discount calculation.
- **Feature 12**: Smart role notifications & phone SMS text alerts.
- **Feature 13**: Multi-farmer marketplace catalog & side-by-side comparison modal.
- **Feature 14**: Forgot password, 6-digit numeric OTP generation, verification gate, and password update lifecycle.

```bash
# Run isolated OTP & Password Reset self-test:
npm run test:forgot-password
```

---

## 📡 Interactive API Explorer & Documentation

Access the interactive API console at `/pages/api-docs.html` on your deployment or locally at `http://localhost:5000/pages/api-docs.html`.

### Key Endpoints:
- `GET /api/health` - Server status, MongoDB sync, and uptime.
- `POST /api/auth/login` - Authenticate user & issue signed JWT.
- `POST /api/auth/register` - Register customer, farmer, or artisan.
- `POST /api/auth/oauth/google` - Google OAuth 2.0 token endpoint.
- `POST /api/auth/oauth/github` - GitHub OAuth endpoint.
- `POST /api/auth/forgot-password` - Generate 6-digit OTP & direct reset link.
- `POST /api/auth/verify-otp` - Verify 6-digit OTP code & get reset token.
- `POST /api/auth/reset-password` - Reset account password.
- `GET /api/products` - Filterable catalog (search, category, sorting).
- `GET /api/orders` - Order history & status.
- `GET /api/journey/:batchCode` - 7-Stage seed-to-plate traceability timeline.
- `GET /api/admin/stats` - Platform GMV & user counts.
- `GET /api/community/group-buys` - Wholesale pool status.

---

## 📂 Directory Structure

```
Farm-to-Fork-Collective/
├── api/
│   └── index.js                 # Vercel Serverless Function entrypoint
├── index.html                   # Homepage featuring hero, seasonal harvest, & quick trace
├── vercel.json                  # Vercel deployment rewrites & routing rules
├── vite.config.mjs              # Multi-page Vite configuration with static asset copy plugin
├── package.json                 # Node dependencies and npm scripts
├── README.md                    # Project documentation & deployment guide
├── PROJECT_DOCUMENTATION.md     # Extended technical specifications
├── server/
│   ├── server.js                # Express REST API application
│   ├── config/
│   │   └── db.js                # MongoDB Compass/Atlas & resilient JSON persistence engine
│   ├── data/
│   │   └── database.json        # 34 products, 12 users, batches, orders
│   ├── routes/
│   │   ├── auth.js              # JWT, OAuth 2.0, OTP & password reset routes
│   │   ├── products.js          # Product catalog and inventory
│   │   ├── orders.js            # Checkout, slot booking & coupons
│   │   ├── journey.js           # 7-stage cryptographic QR batch trace
│   │   ├── admin.js             # Platform GMV analytics & approvals
│   │   └── community.js         # Group pooling, kitchens & donations
│   └── utils/
│       └── jwt.js               # RFC 7519 compliant HMAC-SHA256 JWT utility
├── js/
│   ├── api.js                   # Client HTTP API wrapper (auto-routes local / relative)
│   ├── script.js                # Main catalog, filter & interaction logic
│   ├── cart.js                  # Shopping cart & coupon discount calculation
│   ├── animation.js             # Smooth transitions & micro-interactions
│   ├── chatbot.js               # Bilingual Tamil/English NLP chatbot
│   ├── i18n.js                  # 100% pure Tamil localization engine
│   ├── notifications.js         # Role-based notification & phone SMS alerts
│   ├── farmer-marketplace.js    # Multi-farmer crop listing & compare engine
│   ├── recently-accessed.js     # Recently viewed products tracker
│   └── feedback.js              # Review and ratings handler
├── css/
│   ├── style.css                # Master design system & tokens
│   └── respnsive.css            # Mobile and tablet responsiveness
├── assets/
│   └── images/products/         # 34 authentic local organic product images
├── pages/
│   ├── login.html               # Multi-role authentication & OTP modal
│   ├── register.html            # Role-specific onboarding
│   ├── reset-password.html      # Standalone direct password reset portal
│   ├── admin-login.html         # Admin access portal
│   ├── products.html            # Live filterable catalog
│   ├── product-details.html     # Deep nutritional, farm & eco-scores
│   ├── cart.html                # Cart management & promo codes
│   ├── checkout.html            # Delivery scheduling & payment
│   ├── wishlist.html            # Saved products wishlist
│   ├── farmer-marketplace.html  # Multi-farmer marketplace comparison
│   ├── dashboard-customer.html  # Order tracking & NGO donations
│   ├── dashboard-farmer.html    # Harvest listings & stock management
│   ├── dashboard-artisan.html   # Handmade goods creation
│   ├── dashboard-admin.html     # Platform GMV & KYC audit
│   ├── farmer-upload-journey.html # 7-Stage milestone batch upload
│   ├── seed-to-plate.html       # QR scan simulator & batch trace viewer
│   ├── group-buying.html        # Neighborhood wholesale group deals
│   ├── community-kitchen.html   # Community kitchens & volunteer programs
│   └── api-docs.html            # Interactive OpenAPI documentation explorer
├── test/
│   ├── test-api.js              # Unit tests for database & logic
│   ├── verify-role-notifications.js # Notification & SMS alert verifier
│   └── verify-mandatory-features.js # Complete 14-feature audit suite (46 checks)
└── tests/
    └── test-forgot-password.js  # Dedicated 6-step OTP & password reset test runner
```

---

## 📜 License
MIT License © 2026 Farm to Fork Collective.
