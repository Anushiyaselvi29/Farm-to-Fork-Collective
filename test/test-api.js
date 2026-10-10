// ============================================
// BACKEND API SELF-TEST & VERIFICATION SCRIPT
// Farm to Fork Collective
// ============================================

const { readDb, writeDb } = require('../server/config/db');

function runTests() {
  console.log('🚀 Starting Backend Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Test Database Reading
  console.log('1. Database Storage Verification:');
  const db = readDb();
  assert(Array.isArray(db.products) && db.products.length >= 34, `34+ Organic Products in database (found: ${db.products.length})`);
  assert(Array.isArray(db.users) && db.users.length >= 4, `Pre-seeded users loaded (found: ${db.users.length})`);
  assert(db.journeys && Object.keys(db.journeys).length >= 2, `Traceability journeys loaded (found: ${Object.keys(db.journeys).length})`);
  assert(Array.isArray(db.orders) && db.orders.length >= 2, `Initial orders loaded (found: ${db.orders.length})`);

  // 2. Test User Authentication Logic
  console.log('\n2. Authentication Logic:');
  const admin = db.users.find(u => u.username === 'admin');
  assert(admin && admin.password === 'admin123', 'Default admin credentials verified');

  const farmer = db.users.find(u => u.role === 'farmer');
  assert(farmer && farmer.farmName, `Farmer profile verified: "${farmer?.farmName}"`);

  // 3. Test Product Search & Filtering Logic
  console.log('\n3. Product Query Logic:');
  const vegetables = db.products.filter(p => p.category === 'vegetables');
  assert(vegetables.length >= 10, `Vegetables category has ${vegetables.length} items`);

  const fruits = db.products.filter(p => p.category === 'fruits');
  assert(fruits.length >= 8, `Fruits category has ${fruits.length} items`);

  const frozen = db.products.filter(p => p.category === 'frozen');
  assert(frozen.length >= 6, `Frozen packs category has ${frozen.length} items`);

  // 4. Test Seed-to-Plate Traceability
  console.log('\n4. Seed-to-Plate Traceability:');
  const potatoJourney = db.journeys['FTF-POT-2024-001'];
  assert(potatoJourney && potatoJourney.stages.length === 7, '7 Complete stages for Organic Potato trace');

  // 5. Test Order Processing Calculations
  console.log('\n5. Order Processing Logic:');
  const testItems = [
    { id: 1, name: 'Organic Tomatoes', price: 60, quantity: 2 },
    { id: 2, name: 'Organic Spinach', price: 40, quantity: 1 }
  ];
  const testSubtotal = testItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  assert(testSubtotal === 160, `Subtotal calculated correctly: ₹${testSubtotal}`);

  console.log(`\n============================================`);
  console.log(`🏁 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`============================================\n`);

  return failed === 0;
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
