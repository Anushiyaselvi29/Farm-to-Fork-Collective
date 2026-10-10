const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'server', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('Total products in database.json:', db.products.length);

const issues = [];

db.products.forEach(p => {
  let imgRel = p.image || '';
  if (imgRel.startsWith('/')) imgRel = imgRel.slice(1);
  const imgFullPath = path.join(rootDir, imgRel);
  const exists = fs.existsSync(imgFullPath);

  console.log(`[${String(p.id).padStart(2)}] ${p.name.padEnd(35)} -> ${p.image} (Exists: ${exists})`);

  if (!exists) {
    issues.push({ id: p.id, name: p.name, reason: 'File does not exist on disk', image: p.image });
  }

  // Check if image looks like a placeholder or mismatched (e.g. tomatoes used for guavas or banans)
  const lowerName = p.name.toLowerCase();
  const lowerImg = p.image.toLowerCase();
  if (!lowerName.includes('tomato') && lowerImg.includes('tomato')) {
    issues.push({ id: p.id, name: p.name, reason: 'Wrongly uses tomato image!', image: p.image });
  }
});

console.log('\n--- DETECTED PRODUCT IMAGE ISSUES ---');
console.log(JSON.stringify(issues, null, 2));
