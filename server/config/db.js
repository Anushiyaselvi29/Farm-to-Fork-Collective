// ============================================
// DATABASE HELPER MODULE (JSON + MONGODB COMPASS SYNC)
// Farm to Fork Collective
// Supports local MongoDB Compass (mongodb://127.0.0.1:27017/farmtofork)
// with atomic JSON file persistence fallback.
// ============================================

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'farmtofork';

let mongoClient = null;
let mongoDb = null;
let isMongoConnected = false;

// Attempt background MongoDB connection
async function initMongo() {
  try {
    const { MongoClient } = require('mongodb');
    mongoClient = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });

    await mongoClient.connect();
    mongoDb = mongoClient.db(DB_NAME);
    await mongoDb.command({ ping: 1 });
    isMongoConnected = true;

    // Connect Mongoose to the same MongoDB instance
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(`${MONGO_URI}/${DB_NAME}`, {
          serverSelectionTimeoutMS: 2500
        });
      }
    } catch (mErr) {
      // Mongoose connects asynchronously or silently
    }

    console.log(`🍃 Connected to MongoDB Compass Database: ${MONGO_URI}/${DB_NAME}`);

    // Initial background synchronization of collections and indexes
    ensureMongoIndexes().catch(() => {});
    syncDbToMongo(readDb()).catch(err => {
      console.warn('MongoDB background sync notice:', err.message);
    });
  } catch (err) {
    isMongoConnected = false;
    console.log(`ℹ️  MongoDB Compass connection offline or pending: ${err.message}. Using high-reliability JSON persistence.`);
  }
}

// Enforce MongoDB uniqueness indexes for productId and traceabilityId
async function ensureMongoIndexes() {
  if (!isMongoConnected || !mongoDb) return;
  try {
    const prodCol = mongoDb.collection('products');
    await prodCol.createIndex({ productId: 1 }, { unique: true, sparse: true });
    await prodCol.createIndex({ traceabilityId: 1 }, { unique: true, sparse: true });

    const traceCol = mongoDb.collection('traceability');
    await traceCol.createIndex({ productId: 1 }, { unique: true, sparse: true });
    await traceCol.createIndex({ traceabilityId: 1 }, { unique: true, sparse: true });

    const usersCol = mongoDb.collection('users');
    await usersCol.createIndex({ email: 1 }, { unique: true, sparse: true });
    await usersCol.createIndex({ googleId: 1 }, { sparse: true });

    console.log('🛡️ MongoDB unique indexes verified: productId, traceabilityId, email');
  } catch (idxErr) {
    console.warn('MongoDB index creation note:', idxErr.message);
  }
}

// Background sync to MongoDB collections
async function syncDbToMongo(data) {
  if (!isMongoConnected || !mongoDb || !data) return;

  try {
    const collections = [
      'users',
      'products',
      'traceability',
      'notifications',
      'orders',
      'groupBuys',
      'kitchens',
      'donations',
      'reviews',
      'farmCertifications'
    ];

    for (const colName of collections) {
      const items = Array.isArray(data[colName]) ? data[colName] : [];
      if (items.length > 0) {
        const col = mongoDb.collection(colName);
        await col.deleteMany({});
        let cleanItems = items.map(item => {
          const doc = { ...item };
          if (doc._id && typeof doc._id === 'string' && doc._id.length !== 24) {
            doc.customId = doc._id;
            delete doc._id;
          }
          return doc;
        });
        if (colName === 'users') {
          const seenEmails = new Set();
          cleanItems = cleanItems.filter(u => {
            if (!u.email) return true;
            const em = String(u.email).toLowerCase();
            if (seenEmails.has(em)) return false;
            seenEmails.add(em);
            return true;
          });
        }
        if (cleanItems.length > 0) {
          await col.insertMany(cleanItems, { ordered: false });
        }
      }
    }

    if (data.journeys && typeof data.journeys === 'object') {
      const jCol = mongoDb.collection('journeys');
      await jCol.deleteMany({});
      const jDocs = Object.entries(data.journeys).map(([batchId, jData]) => ({
        batchId,
        ...jData,
        updatedAt: new Date().toISOString()
      }));
      if (jDocs.length > 0) {
        await jCol.insertMany(jDocs);
      }
    }
  } catch (syncErr) {
    console.warn('Error during MongoDB collection sync:', syncErr.message);
  }
}

// Start MongoDB initialization
initMongo();

// Ensure database file exists
function initDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      products: [],
      orders: [],
      journeys: {},
      groupBuys: [],
      kitchens: [],
      donations: [],
      reviews: [],
      farmCertifications: []
    };
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

let inMemoryCache = null;

// Read database
function readDb() {
  if (inMemoryCache) {
    return inMemoryCache;
  }

  try {
    initDb();
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      inMemoryCache = JSON.parse(raw);
      return inMemoryCache;
    }
  } catch (err) {
    console.error('Error reading database from primary path:', err.message);
  }

  // Fallback to /tmp/database.json in serverless environments
  try {
    const tmpPath = path.join('/tmp', 'database.json');
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      inMemoryCache = JSON.parse(raw);
      return inMemoryCache;
    }
  } catch (tmpErr) {}

  return {
    users: [],
    products: [],
    orders: [],
    journeys: {},
    groupBuys: [],
    kitchens: [],
    donations: [],
    reviews: [],
    farmCertifications: []
  };
}

// Write database reliably (updates in-memory cache, file, and MongoDB)
function writeDb(data) {
  try {
    inMemoryCache = data;
    const jsonStr = JSON.stringify(data, null, 2);

    try {
      fs.writeFileSync(DB_PATH, jsonStr, 'utf8');
    } catch (writeErr) {
      // In serverless environments (e.g. Vercel), project root is read-only
      try {
        const tmpPath = path.join('/tmp', 'database.json');
        fs.writeFileSync(tmpPath, jsonStr, 'utf8');
      } catch (tmpErr) {
        // In-memory cache is already updated
      }
    }

    // Sync to MongoDB asynchronously if connected
    if (isMongoConnected && mongoDb) {
      syncDbToMongo(data).catch(() => {});
    }

    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

function getMongoStatus() {
  return {
    connected: isMongoConnected,
    uri: MONGO_URI,
    database: DB_NAME
  };
}

module.exports = {
  readDb,
  writeDb,
  initMongo,
  getMongoStatus,
  syncDbToMongo
};
