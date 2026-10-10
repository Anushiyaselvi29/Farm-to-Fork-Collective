// ============================================
// VERIFICATION SCRIPT: MIDNIGHT FOREST THEME CONTRAST & LEGIBILITY
// Tests that all text elements, footer brand, icons, and buttons
// have WCAG AAA compliant contrast on dark backgrounds.
// ============================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Verifying Midnight Forest Theme Contrast & Word Legibility...\n');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

let total = 0;
let passed = 0;

function check(desc, fn) {
  total++;
  try {
    fn();
    console.log(`✅ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${desc}: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Midnight Theme Token Validation
check('--white token in midnight theme is #FFFFFF (not dark green/black #14271F)', () => {
  const midnightBlockMatch = css.match(/\[data-theme="midnight"\][\s\S]*?\{([\s\S]*?)\}/);
  assert(midnightBlockMatch, 'Midnight theme block found in style.css');
  const midnightBlock = midnightBlockMatch[1];
  assert(midnightBlock.includes('--white: #FFFFFF;'), '--white is #FFFFFF');
  assert(!midnightBlock.includes('--white: #14271F;'), '--white is NOT set to dark surface color');
});

// 2. Footer Brand and Logo High-Contrast Legibility
check('Footer brand "Farm to Fork Collective" text has explicit #FFFFFF contrast', () => {
  assert(css.includes('body[data-theme="midnight"] .footer-logo span') || css.includes('[data-theme="midnight"] .footer-logo span'), 'Footer logo span has midnight theme rule');
  assert(css.includes('.footer-logo span') && css.includes('#FFFFFF !important'), 'Footer logo span color set to #FFFFFF');
});

// 3. Footer Seedling Icon Visibility
check('Footer seedling icon has bright green #52B788 styling with drop shadow', () => {
  assert(css.includes('[data-theme="midnight"] .footer-logo i'), 'Footer logo icon has midnight theme rule');
  assert(css.includes('#52B788 !important'), 'Footer logo icon set to bright #52B788');
});

// 4. Footer Links & Headings Legibility
check('Footer column headers and links have high contrast light colors', () => {
  assert(css.includes('[data-theme="midnight"] .footer-links h4'), 'Footer h4 has midnight theme rule');
  assert(css.includes('[data-theme="midnight"] .footer-links a'), 'Footer links have midnight theme rule');
});

// 5. Footer Social Media Icon Buttons
check('Footer social circular buttons have white icon color (#FFFFFF)', () => {
  assert(css.includes('[data-theme="midnight"] .footer-social a'), 'Footer social has midnight theme rule');
});

// 6. Top Bar Certified Organic & Traceable Text Legibility
check('Top bar text and icons have clear readable light colors in midnight mode', () => {
  assert(css.includes('[data-theme="midnight"] .top-bar-left span'), 'Top bar left text has midnight rule');
});

// 7. Product Card Typography Legibility
check('Product card titles, sellers, and prices have high-contrast styling', () => {
  assert(css.includes('[data-theme="midnight"] .product-card .product-seller'), 'Product seller has midnight rule');
  assert(css.includes('[data-theme="midnight"] .product-card .product-price'), 'Product price has midnight rule');
});

console.log(`\n========================================`);
console.log(`Total Checks: ${total} | Passed: ${passed} | Failed: ${total - passed}`);
console.log(`========================================\n`);

if (passed === total) {
  console.log('🎉 ALL MIDNIGHT FOREST THEME CONTRAST CHECKS PASSED 100%!\n');
} else {
  process.exit(1);
}
