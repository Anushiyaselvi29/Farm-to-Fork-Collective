const fs = require('fs');
const path = require('path');

const files = [
    'pages/cart.html',
    'pages/community-kitchen.html',
    'pages/farmer-marketplace.html',
    'pages/farmer-store.html',
    'pages/group-buying.html',
    'pages/product-details.html',
    'pages/products.html',
    'pages/seed-to-plate.html',
    'pages/wishlist.html'
];

files.forEach(f => {
    const filePath = path.join(__dirname, '..', f);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove lang-switch-wrap container
    if (content.includes('lang-switch-wrap')) {
        content = content.replace(/<div class=["']lang-switch-wrap["'][\s\S]*?<\/div>/g, '');
        changed = true;
    }

    // 2. Remove nav-lang-pill container
    if (content.includes('nav-lang-pill')) {
        content = content.replace(/<div class=["']nav-lang-pill["'][\s\S]*?<\/div>/g, '');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Cleaned legacy 2-lang switchers from:', f);
    } else {
        console.log('No legacy 2-lang switchers found in:', f);
    }
});
