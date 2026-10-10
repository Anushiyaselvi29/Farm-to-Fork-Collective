/**
 * Test: Verify Home Page Wishlist and Cart Visibility Gated by Authentication
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Verifying Home Page Wishlist & Cart Auth-Gating...');

const indexPath = path.join(__dirname, '..', 'index.html');
const cssPath = path.join(__dirname, '..', 'css', 'style.css');
const scriptPath = path.join(__dirname, '..', 'js', 'script.js');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const styleCss = fs.readFileSync(cssPath, 'utf8');
const scriptJs = fs.readFileSync(scriptPath, 'utf8');

// Check 1: HTML Markup on Home Page
assert(indexHtml.includes('<body class="is-home">'), 'Check 1 FAIL: index.html must have <body class="is-home">');
assert(indexHtml.includes('id="navWishlistLink"') && indexHtml.includes('home-auth-only'), 'Check 1 FAIL: #navWishlistLink must have home-auth-only class');
assert(indexHtml.includes('id="navCartBtn"') && indexHtml.includes('home-auth-only'), 'Check 1 FAIL: #navCartBtn must have home-auth-only class');
assert(indexHtml.includes('user-logged-out') && indexHtml.includes('user-logged-in'), 'Check 1 FAIL: index.html should have pre-render auth detector');
console.log('✅ Check 1: Home page HTML markup contains is-home, home-auth-only, and pre-render detector.');

// Check 2: CSS Styles for Hiding / Showing
assert(styleCss.includes('body.is-home:not(.user-logged-in) #navWishlistLink') || styleCss.includes('body.is-home.user-logged-out #navWishlistLink'), 'Check 2 FAIL: CSS must have rules hiding navWishlistLink when logged out');
assert(styleCss.includes('body.is-home:not(.user-logged-in) #navCartBtn') || styleCss.includes('body.is-home.user-logged-out #navCartBtn'), 'Check 2 FAIL: CSS must have rules hiding navCartBtn when logged out');
assert(styleCss.includes('body.is-home.user-logged-in #navWishlistLink'), 'Check 2 FAIL: CSS must have rules showing navWishlistLink when logged in');
assert(styleCss.includes('body.is-home.user-logged-in #navCartBtn'), 'Check 2 FAIL: CSS must have rules showing navCartBtn when logged in');
console.log('✅ Check 2: style.css contains zero-flicker CSS rules hiding wishlist/cart for logged-out and showing for logged-in.');

// Check 3: JavaScript syncNavbarUser handles isHomePage & Auth Toggling
assert(scriptJs.includes('const isHomePage ='), 'Check 3 FAIL: syncNavbarUser must identify home page');
assert(scriptJs.includes("wishlistLinks.forEach(el => el.style.setProperty('display', 'none'"), 'Check 3 FAIL: syncNavbarUser must hide wishlist when logged out on home page');
assert(scriptJs.includes("cartBtns.forEach(el => el.style.setProperty('display', 'none'"), 'Check 3 FAIL: syncNavbarUser must hide cart when logged out on home page');
assert(scriptJs.includes("wishlistLinks.forEach(el => el.style.setProperty('display', 'inline-flex'"), 'Check 3 FAIL: syncNavbarUser must show wishlist when logged in');
assert(scriptJs.includes("cartBtns.forEach(el => el.style.setProperty('display', 'inline-flex'"), 'Check 3 FAIL: syncNavbarUser must show cart when logged in');
console.log('✅ Check 3: syncNavbarUser dynamically toggles wishlist and cart links based on authentication.');

console.log('\n🎉 ALL HOME PAGE WISHLIST & CART AUTH-GATING CHECKS PASSED!\n');
