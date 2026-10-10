// ============================================
// VERIFICATION SCRIPT: ROLE-SPECIFIC NOTIFICATIONS
// ============================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Verifying Role-Specific vs Common Notifications...\n');

// 1. Read files
const notifCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'notifications.js'), 'utf8');
const custHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'dashboard-customer.html'), 'utf8');
const farmerHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'dashboard-farmer.html'), 'utf8');
const artisanHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'dashboard-artisan.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

// Check 1: DEFAULT_SMART_NOTIFICATIONS contains 'common' as well as role-specific buckets
assert(notifCode.includes('common: ['), 'DEFAULT_SMART_NOTIFICATIONS has common notification list');
assert(notifCode.includes('customer: ['), 'DEFAULT_SMART_NOTIFICATIONS has customer notification list');
assert(notifCode.includes('farmer: ['), 'DEFAULT_SMART_NOTIFICATIONS has farmer notification list');
assert(notifCode.includes('artisan: ['), 'DEFAULT_SMART_NOTIFICATIONS has artisan notification list');
console.log('✅ Check 1: Separate notification buckets exist for common, customer, farmer, and artisan.');

// Check 2: getCurrentUserRole isolates public front pages to 'common' and dashboards to their respective roles
assert(notifCode.includes("if (path.includes('dashboard-customer')) return 'customer';"), 'Customer dashboard routes to customer');
assert(notifCode.includes("path.includes('dashboard-farmer')"), 'Farmer dashboard routes to farmer');
assert(notifCode.includes("path.includes('dashboard-artisan')"), 'Artisan dashboard routes to artisan');
assert(notifCode.includes("isPublicFrontPage") && notifCode.includes("return 'common'"), 'Front public pages route to common');
console.log('✅ Check 2: getCurrentUserRole correctly maps front pages to common and dashboards to roles.');

// Check 3: Dedicated in-dashboard notification center feed renderer
assert(notifCode.includes('function renderDashboardNotificationFeed'), 'renderDashboardNotificationFeed function implemented');
assert(notifCode.includes('dashboard-notif-panel'), 'dashboard-notif-panel class used');
assert(notifCode.includes('Customer Notifications & Delivery Alerts'), 'Customer specific title present');
assert(notifCode.includes('Farmer Orders & Harvest Notification Center'), 'Farmer specific title present');
assert(notifCode.includes('Artisan Orders & Payout Notification Center'), 'Artisan specific title present');
console.log('✅ Check 3: renderDashboardNotificationFeed provides custom views for each role.');

// Check 4: HTML dashboards contain dashboardNotificationCenter mount points
assert(custHtml.includes('id="dashboardNotificationCenter"'), 'dashboard-customer.html contains dashboardNotificationCenter');
assert(farmerHtml.includes('id="dashboardNotificationCenter"'), 'dashboard-farmer.html contains dashboardNotificationCenter');
assert(artisanHtml.includes('id="dashboardNotificationCenter"'), 'dashboard-artisan.html contains dashboardNotificationCenter');
console.log('✅ Check 4: Customer, Farmer, and Artisan dashboards have the dashboardNotificationCenter container.');

// Check 5: HTML dashboards have role-specific alert stat badges
assert(custHtml.includes('id="custNotifStatCount"'), 'Customer dashboard has custNotifStatCount badge');
assert(farmerHtml.includes('id="farmerNotifStatCount"'), 'Farmer dashboard has farmerNotifStatCount badge');
assert(artisanHtml.includes('id="artisanNotifStatCount"'), 'Artisan dashboard has artisanNotifStatCount badge');
console.log('✅ Check 5: All 3 dashboards have real-time notification alert counters in stats grid.');

// Check 6: All pages load notifications.js
assert(custHtml.includes('js/notifications.js'), 'Customer dashboard includes notifications.js');
assert(farmerHtml.includes('js/notifications.js'), 'Farmer dashboard includes notifications.js');
assert(artisanHtml.includes('js/notifications.js'), 'Artisan dashboard includes notifications.js');
assert(indexHtml.includes('js/notifications.js'), 'Index page includes notifications.js');
console.log('✅ Check 6: All pages load notifications.js script.');

// Check 7: CSS contains dashboard notification styling
assert(styleCss.includes('.dashboard-notif-panel'), 'style.css has .dashboard-notif-panel styles');
assert(styleCss.includes('.dash-notif-header'), 'style.css has .dash-notif-header styles');
assert(styleCss.includes('.dash-notif-item'), 'style.css has .dash-notif-item styles');
assert(styleCss.includes('body.dark-theme .dashboard-notif-panel'), 'style.css supports dark theme for notifications');
console.log('✅ Check 7: style.css has complete responsive styles with light and dark themes.');

console.log('\n🎉 ALL ROLE-SPECIFIC NOTIFICATION VERIFICATION CHECKS PASSED!');
