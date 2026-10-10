const fs = require('fs');
const path = require('path');

const targetFiles = [
    'index.html',
    'pages/login.html',
    'pages/register.html',
    'pages/product-details.html',
    'pages/dashboard-admin.html',
    'pages/dashboard-farmer.html',
    'pages/farmer-store.html',
    'pages/api-docs.html',
    'pages/wishlist.html'
];

targetFiles.forEach(relPath => {
    const filePath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace button backgrounds
    content = content.replace(/linear-gradient\(135deg,\s*#16a34a,\s*#15803d\)/g, 'linear-gradient(135deg, var(--primary), var(--primary-dark))');
    content = content.replace(/linear-gradient\(135deg,\s*#22c55e,\s*#16a34a\)/g, 'linear-gradient(135deg, var(--primary-light), var(--primary))');
    content = content.replace(/background:\s*#16a34a;/g, 'background: var(--primary);');

    // In inline style attributes for borders, text, and labels (avoiding fa-leaf)
    content = content.replace(/border-color:\s*#16a34a/g, 'border-color: var(--primary)');
    content = content.replace(/color:\s*#16a34a/g, 'color: var(--primary)');
    content = content.replace(/color:#16a34a/g, 'color:var(--primary)');
    content = content.replace(/border:\s*2\.5px solid #16a34a/g, 'border: 2.5px solid var(--primary)');

    // Ensure organic leaf symbol remains foliage green
    content = content.replace(/class=["']brand-leaf-badge["'][^>]*>/g, (m) => m);
    content = content.replace(/class=["']brand-side-leaf["'][^>]*>/g, (m) => m);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Cleaned theme colors in:', relPath);
});
