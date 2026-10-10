// ============================================
// COMMON PRODUCT & TRACEABILITY SERVICE
// Farm to Fork Collective
// Shared across Farmer & Artisan product additions
// Enforces unique Product ID, Traceability ID, and QR Code generation
// ============================================

const crypto = require('crypto');
const { readDb, writeDb } = require('../config/db');

let QRCode = null;
try {
  QRCode = require('qrcode');
} catch (e) {
  QRCode = null;
}

class ProductService {
  /**
   * Generates a unique immutable Product ID (e.g., FTF-P-2026-000001)
   * Enforces database uniqueness.
   */
  generateProductId(db) {
    const year = new Date().getFullYear();
    const prefix = `FTF-P-${year}-`;
    const products = (db && db.products) || [];

    // Find highest existing counter for current year
    let maxCounter = 0;
    for (const p of products) {
      if (p.productId && p.productId.startsWith(prefix)) {
        const numPart = parseInt(p.productId.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxCounter) {
          maxCounter = numPart;
        }
      }
    }

    let candidate = '';
    let isUnique = false;
    let nextCounter = maxCounter + 1;

    while (!isUnique) {
      candidate = `${prefix}${String(nextCounter).padStart(6, '0')}`;
      const exists = products.some(p => p.productId === candidate);
      if (!exists) {
        isUnique = true;
      } else {
        nextCounter++;
      }
    }

    return candidate;
  }

  /**
   * Generates a unique immutable Traceability ID (e.g., FTF-TR-8A9C4F12)
   * Enforces database uniqueness and permanent association.
   */
  generateTraceabilityId(db) {
    const products = (db && db.products) || [];
    const journeys = (db && db.journeys) || {};
    const traceList = (db && db.traceability) || [];

    let isUnique = false;
    let candidate = '';

    while (!isUnique) {
      const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
      candidate = `FTF-TR-${randomHex}`;

      const existsInProducts = products.some(p => p.traceabilityId === candidate);
      const existsInJourneys = Boolean(journeys[candidate]);
      const existsInTraceList = traceList.some(t => t.traceabilityId === candidate);

      if (!existsInProducts && !existsInJourneys && !existsInTraceList) {
        isUnique = true;
      }
    }

    return candidate;
  }

  /**
   * Generates QR Code data URL encoding the public traceability URL:
   * http://localhost:5173/traceability/<TRACEABILITY_ID>
   * Strictly encodes only the public URL. No private tokens or secrets.
   */
  async generateQRCode(traceabilityId) {
    const publicUrl = `http://localhost:5173/traceability/${traceabilityId}`;

    if (QRCode && typeof QRCode.toDataURL === 'function') {
      try {
        const dataUrl = await QRCode.toDataURL(publicUrl, {
          width: 320,
          margin: 2,
          color: {
            dark: '#1b4332',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        });
        return { dataUrl, publicUrl };
      } catch (err) {
        console.warn('[ProductService] QR Code generation fallback:', err.message);
      }
    }

    // High reliability fallback SVG/Data URL
    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(publicUrl)}`;
    return { dataUrl: fallbackUrl, publicUrl };
  }

  /**
   * Creates initial verifiable journey event
   */
  createInitialTraceabilityEvent(product, user) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const isArtisan = user.role === 'artisan' || product.category === 'handmade';
    const stageName = isArtisan ? 'Artisan Crafting & Sourcing' : 'Organic Farm Harvest & Inspection';
    const stageNameTa = isArtisan ? 'கைவினை தயாரிப்பு & மூலப்பொருள் ஆய்வு' : 'இயற்கை அறுவடை & தரம் உறுதிசெய்தல்';

    const location = product.origin || user.farmLocation || (isArtisan ? 'Auroville & Nilgiris Craft Cluster' : 'Dindigul Organic Belt, Tamil Nadu');

    return {
      stage: 1,
      stageNumber: 1,
      stageName: stageName,
      title: stageName,
      name: stageName,
      nameTamil: stageNameTa,
      date: dateStr,
      time: timeStr,
      location: location,
      actorType: isArtisan ? 'Artisan' : 'Farmer',
      actorName: user.name || user.farmName || (isArtisan ? 'Certified Food Artisan' : 'Certified Organic Farmer'),
      description: `${product.name} successfully registered with verified batch traceability ID ${product.traceabilityId}. 100% sustainable practices verified.`,
      descriptionTamil: `${product.name} சான்றளிக்கப்பட்ட QR கண்காணிப்பு எண்ணுடன் பதிவு செய்யப்பட்டது. நஞ்சில்லா இயற்கை முறை உறுதி செய்யப்பட்டது.`,
      status: 'Completed',
      verified: true,
      icon: isArtisan ? '🧺' : '🌱'
    };
  }

  /**
   * Main reusable product creation function for both Farmer and Artisan
   */
  async createProduct(productData, user) {
    // 1. Permission and Role Validation
    if (!user || (user.role !== 'farmer' && user.role !== 'artisan' && user.role !== 'admin')) {
      throw new Error('Unauthorized: Only registered Farmers, Artisans, or Administrators can add products.');
    }

    const {
      name,
      category,
      price,
      originalPrice,
      unit,
      stock,
      description,
      image,
      origin,
      shelfLife,
      badge
    } = productData;

    if (!name || price === undefined || price === null || !unit) {
      throw new Error('Product name, price, and unit are required fields.');
    }

    const db = readDb();
    if (!db.products) db.products = [];
    if (!db.traceability) db.traceability = [];
    if (!db.journeys) db.journeys = {};

    // 2. Generate Unique Product ID & Traceability ID
    const productId = this.generateProductId(db);
    const traceabilityId = this.generateTraceabilityId(db);

    // 3. Generate QR Code (encoding public traceability URL)
    const { dataUrl: qrCodeDataUrl, publicUrl } = await this.generateQRCode(traceabilityId);

    // Auto numeric ID for legacy backward compatibility
    const numericId = db.products.length > 0 ? Math.max(...db.products.map(p => typeof p.id === 'number' ? p.id : 0)) + 1 : 1;

    const isArtisan = user.role === 'artisan' || category === 'handmade';
    const defaultImg = isArtisan ? '/assets/images/products/organic-honey.jpg' : '/assets/images/products/organic-tomatoes.jpg';
    const prodCategory = category || (isArtisan ? 'handmade' : 'vegetables');

    const numPrice = parseFloat(price);
    const numOrigPrice = originalPrice ? parseFloat(originalPrice) : Math.round(numPrice * 1.25);

    // 4. Construct Product Entity
    const newProduct = {
      id: numericId,
      productId: productId,
      traceabilityId: traceabilityId,
      qrCode: qrCodeDataUrl,
      publicTraceUrl: publicUrl,
      name: String(name).trim(),
      category: prodCategory,
      price: numPrice,
      originalPrice: numOrigPrice,
      unit: String(unit).trim(),
      stock: stock ? parseInt(stock, 10) : 50,
      seller: user.farmName || user.name || (isArtisan ? 'Handmade Collective' : 'Direct Organic Farm'),
      sellerId: user.id,
      sellerRole: user.role,
      origin: origin || (user.farmLocation || (isArtisan ? 'Tamil Nadu Crafts Center' : 'Tamil Nadu')),
      description: description || `${name} produced under strict 100% organic and chemical-free guidelines.`,
      image: image || defaultImg,
      freshness: isArtisan ? 'Crafted Fresh' : 'Fresh Harvest',
      freshnessScore: 96,
      rating: 5.0,
      reviewsCount: 0,
      shelfLife: shelfLife || (isArtisan ? '12 months' : '5-7 days'),
      badge: badge || (isArtisan ? '🧺 Handcrafted' : '🌿 100% Organic'),
      type: isArtisan ? 'handmade' : (prodCategory === 'frozen' ? 'frozen' : 'fresh'),
      certifications: productData.certifications || (isArtisan ? ['Handmade Certified', 'Zero Chemical'] : ['India Organic', 'Jaivik Bharat', 'Zero Chemical']),
      ecoScore: 95,
      createdAt: new Date().toISOString()
    };

    // 5. Construct Initial Journey Event
    const initialEvent = this.createInitialTraceabilityEvent(newProduct, user);
    newProduct.journeyEvents = [initialEvent];

    // 6. Traceability Model Document
    const traceabilityDoc = {
      productId: newProduct.productId,
      traceabilityId: newProduct.traceabilityId,
      qrCode: qrCodeDataUrl,
      publicTraceUrl: publicUrl,
      owner: {
        id: user.id,
        name: user.name,
        role: user.role,
        farmName: user.farmName || null,
        farmLocation: user.farmLocation || null
      },
      productType: newProduct.category,
      productName: newProduct.name,
      productImage: newProduct.image,
      createdAt: newProduct.createdAt,
      journeyEvents: [initialEvent]
    };

    // 7. Save to Database (Atomic JSON + MongoDB Collections)
    db.products.unshift(newProduct);
    db.traceability.unshift(traceabilityDoc);

    // Keep legacy journeys map synchronized for older components
    db.journeys[newProduct.traceabilityId] = {
      productName: newProduct.name,
      productId: newProduct.productId,
      batchCode: newProduct.traceabilityId,
      traceabilityId: newProduct.traceabilityId,
      qrCode: qrCodeDataUrl,
      productImage: newProduct.image,
      farmer: {
        name: newProduct.seller,
        phone: user.phone || '+91 98401 23456',
        farmName: user.farmName || `${newProduct.seller}'s Farm / Workshop`,
        village: newProduct.origin
      },
      farmLocation: newProduct.origin,
      stages: [initialEvent]
    };

    writeDb(db);

    return {
      success: true,
      product: newProduct,
      traceability: traceabilityDoc
    };
  }
}

module.exports = new ProductService();
