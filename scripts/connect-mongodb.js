// ========================================================
// MONGODB COMPASS DATABASE CONNECTION & SYNC SCRIPT
// Farm to Fork Collective
// Connects to local MongoDB server (127.0.0.1:27017)
// Creates/syncs the "farmtofork" database with all collections
// ========================================================

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {}

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'farmtofork';
const JSON_DB_PATH = path.join(__dirname, '..', 'server', 'data', 'database.json');

async function connectAndSyncMongoDB() {
  console.log('\n=============================================================');
  console.log('🍃 CONNECTING TO MONGODB COMPASS DATABASE...');
  console.log(`📡 Target URI: ${MONGO_URI}`);
  console.log(`🗄️  Database:   ${DB_NAME}`);
  console.log('=============================================================\n');

  let client;
  try {
    client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });

    await client.connect();
    console.log('✅ Successfully connected to MongoDB Server!');

    const db = client.db(DB_NAME);
    await db.command({ ping: 1 });
    console.log('⚡ Ping verified. Database server is healthy and responsive.\n');

    // Read local data
    let localData = {};
    if (fs.existsSync(JSON_DB_PATH)) {
      try {
        localData = JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf8'));
      } catch (err) {
        console.warn('⚠️ Could not parse database.json, initializing default schema.');
      }
    }

    const collections = [
      'users',
      'products',
      'orders',
      'groupBuys',
      'kitchens',
      'donations',
      'reviews',
      'farmCertifications'
    ];

    console.log('📦 Synchronizing Collections to MongoDB Compass:');
    console.log('-------------------------------------------------------------');

    const summary = {};

    for (const colName of collections) {
      const items = Array.isArray(localData[colName]) ? localData[colName] : [];
      const col = db.collection(colName);

      if (items.length > 0) {
        // Clear and bulk insert to ensure clean synchronization
        await col.deleteMany({});
        // Remove MongoDB _id if present in raw items to let Mongo generate clean ObjectIds or keep string id
        const cleanItems = items.map(item => {
          const doc = { ...item };
          if (doc._id && typeof doc._id === 'string' && doc._id.length !== 24) {
            doc.customId = doc._id;
            delete doc._id;
          }
          return doc;
        });
        await col.insertMany(cleanItems);
      }

      const count = await col.countDocuments();
      summary[colName] = count;
      console.log(`  📁 Collection: [ ${colName.padEnd(18)} ] -> ${count} documents synced`);
    }

    // Handle journeys (dictionary object)
    const journeyCol = db.collection('journeys');
    await journeyCol.deleteMany({});
    if (localData.journeys && typeof localData.journeys === 'object') {
      const journeyDocs = Object.entries(localData.journeys).map(([batchId, journeyData]) => ({
        batchId,
        ...journeyData,
        updatedAt: new Date().toISOString()
      }));
      if (journeyDocs.length > 0) {
        await journeyCol.insertMany(journeyDocs);
      }
      const jCount = await journeyCol.countDocuments();
      summary['journeys'] = jCount;
      console.log(`  📁 Collection: [ ${'journeys'.padEnd(18)} ] -> ${jCount} batch traceability records synced`);
    }

    console.log('-------------------------------------------------------------');
    console.log('\n🎉 ALL COLLECTIONS SUCCESSFULLY CONNECTED & SYNCED TO MONGODB!');
    console.log('\n📋 HOW TO VIEW IN MONGODB COMPASS:');
    console.log('  1. Open the "MongoDB Compass" application on your computer.');
    console.log('  2. In the "New Connection" screen, enter the Connection String:');
    console.log(`     👉 ${MONGO_URI}`);
    console.log('  3. Click "Connect".');
    console.log(`  4. You will see the database named "${DB_NAME}".`);
    console.log('  5. Click on "${DB_NAME}" to inspect your collections (users, products, orders, etc.).\n');

    return { success: true, summary };
  } catch (err) {
    console.error('\n❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('  - Ensure MongoDB Server service is running.');
    console.log('  - You can start it via Windows PowerShell: Start-Service MongoDB');
    console.log('  - Or start mongod manually: mongod --dbpath "C:\\data\\db"\n');
    return { success: false, error: err.message };
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run standalone if invoked directly
if (require.main === module) {
  connectAndSyncMongoDB()
    .then(res => {
      process.exit(res.success ? 0 : 1);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { connectAndSyncMongoDB };
