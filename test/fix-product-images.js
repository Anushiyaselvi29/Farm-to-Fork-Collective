const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updatedCount = 0;

db.products.forEach(p => {
  if (p.id === 39) {
    console.log(`Updating ID 39 (${p.name}): ${p.image} -> /assets/images/products/organic-broccoli.jpg`);
    p.image = '/assets/images/products/organic-broccoli.jpg';
    updatedCount++;
  }
  if (p.id === 38) {
    console.log(`Updating ID 38 (${p.name}): ${p.image} -> /assets/images/products/organic-guavas.jpg`);
    p.image = '/assets/images/products/organic-guavas.jpg';
    updatedCount++;
  }
  if (p.id === 36) {
    console.log(`Updating ID 36 (${p.name}): ${p.image} -> /assets/images/products/organic-dragon-fruit.jpg`);
    p.image = '/assets/images/products/organic-dragon-fruit.jpg';
    updatedCount++;
  }
  if (p.id === 35) {
    console.log(`Updating ID 35 (${p.name}): ${p.image} -> /assets/images/products/organic-bananas.jpg`);
    p.image = '/assets/images/products/organic-bananas.jpg';
    updatedCount++;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} products in database.json`);
