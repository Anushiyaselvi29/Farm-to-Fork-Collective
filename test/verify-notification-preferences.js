// ============================================
// VERIFICATION SCRIPT: MULTI-CHANNEL NOTIFICATION PREFERENCES
// Tests Registration + Personal Dashboard Profile Management
// Channels: SMS, Gmail/Email, WhatsApp
// ============================================

const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert');
const { fork } = require('child_process');

console.log('🧪 Verifying Multi-Channel Notification Preferences & Profile Management...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`✅ [PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${description}`);
    console.error(`   Error: ${err.message}\n`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------
// 1. Static HTML & UI File Assertions
// ---------------------------------------------------------------------
const registerHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'register.html'), 'utf8');
const dashboardCustomerHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'dashboard-customer.html'), 'utf8');
const profileHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'profile.html'), 'utf8');
const farmerDashboardHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'dashboard-farmer.html'), 'utf8');
const artisanDashboardHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'dashboard-artisan.html'), 'utf8');
const apiJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'api.js'), 'utf8');
const notificationsJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'notifications.js'), 'utf8');
const authRoutesJs = fs.readFileSync(path.join(__dirname, '..', 'server', 'routes', 'auth.js'), 'utf8');
const serverJs = fs.readFileSync(path.join(__dirname, '..', 'server', 'server.js'), 'utf8');

runTest('register.html has SMS, Gmail/Email, and WhatsApp notification preference checkboxes', () => {
  assert(registerHtml.includes('id="notifySMS"'), 'register.html must contain notifySMS checkbox');
  assert(registerHtml.includes('id="notifyEmail"'), 'register.html must contain notifyEmail checkbox');
  assert(registerHtml.includes('id="notifyWhatsApp"'), 'register.html must contain notifyWhatsApp checkbox');
  assert(registerHtml.includes('regNotifPrefSection'), 'register.html must contain regNotifPrefSection container');
});

runTest('register.html extracts notification preferences in handleRegister and saves to localStorage', () => {
  assert(registerHtml.includes("document.getElementById('notifySMS')"), 'handleRegister checks notifySMS');
  assert(registerHtml.includes("document.getElementById('notifyEmail')"), 'handleRegister checks notifyEmail');
  assert(registerHtml.includes("document.getElementById('notifyWhatsApp')"), 'handleRegister checks notifyWhatsApp');
  assert(registerHtml.includes('notificationPreferences'), 'handleRegister sends notificationPreferences payload');
  assert(registerHtml.includes('userNotificationPreferences'), 'handleRegister persists userNotificationPreferences locally');
});

runTest('dashboard-customer.html has Personal Dashboard Profile & Notification Channel Management', () => {
  assert(dashboardCustomerHtml.includes('id="profileSection"'), 'dashboard-customer.html has profileSection');
  assert(dashboardCustomerHtml.includes('id="prefSMS"'), 'dashboard-customer.html has prefSMS toggle');
  assert(dashboardCustomerHtml.includes('id="prefEmail"'), 'dashboard-customer.html has prefEmail toggle');
  assert(dashboardCustomerHtml.includes('id="prefWhatsApp"'), 'dashboard-customer.html has prefWhatsApp toggle');
  assert(dashboardCustomerHtml.includes('id="btnSaveProfile"'), 'dashboard-customer.html has btnSaveProfile');
  assert(dashboardCustomerHtml.includes('saveProfileAndNotifications'), 'dashboard-customer.html implements saveProfileAndNotifications');
  assert(dashboardCustomerHtml.includes('testNotificationChannel'), 'dashboard-customer.html implements testNotificationChannel');
});

runTest('dashboard-customer.html provides SMS, Gmail, and WhatsApp test simulator buttons', () => {
  assert(dashboardCustomerHtml.includes("testNotificationChannel('sms')"), 'SMS test button present');
  assert(dashboardCustomerHtml.includes("testNotificationChannel('email')"), 'Gmail/Email test button present');
  assert(dashboardCustomerHtml.includes("testNotificationChannel('whatsapp')"), 'WhatsApp test button present');
});

runTest('Standalone profile.html exists and supports multi-role profile & notification preferences', () => {
  assert(profileHtml.includes('id="prefSMS"'), 'profile.html has prefSMS toggle');
  assert(profileHtml.includes('id="prefEmail"'), 'profile.html has prefEmail toggle');
  assert(profileHtml.includes('id="prefWhatsApp"'), 'profile.html has prefWhatsApp toggle');
  assert(profileHtml.includes('id="btnSaveProfile"'), 'profile.html has btnSaveProfile');
  assert(profileHtml.includes('saveProfile()') || profileHtml.includes('function saveProfile'), 'profile.html has saveProfile logic');
  assert(profileHtml.includes('loadProfile()') || profileHtml.includes('function loadProfile'), 'profile.html has loadProfile logic');
});

runTest('Farmer and Artisan dashboards link to Profile & Notification management', () => {
  assert(farmerDashboardHtml.includes('profile.html'), 'dashboard-farmer.html links to profile.html');
  assert(artisanDashboardHtml.includes('profile.html'), 'dashboard-artisan.html links to profile.html');
});

runTest('js/api.js provides FTF_API.auth getProfile and updateProfile methods', () => {
  assert(apiJs.includes('getProfile('), 'FTF_API.auth defines getProfile');
  assert(apiJs.includes('updateProfile('), 'FTF_API.auth defines updateProfile');
  assert(apiJs.includes('userNotificationPreferences'), 'FTF_API caches notification preferences');
});

runTest('js/notifications.js exports showWhatsAppToast and showEmailToast handlers', () => {
  assert(notificationsJs.includes('function showWhatsAppToast'), 'notifications.js implements showWhatsAppToast');
  assert(notificationsJs.includes('function showEmailToast'), 'notifications.js implements showEmailToast');
  assert(notificationsJs.includes('window.showWhatsAppToast = showWhatsAppToast;'), 'showWhatsAppToast is exported to window');
  assert(notificationsJs.includes('window.showEmailToast = showEmailToast;'), 'showEmailToast is exported to window');
});

runTest('Backend auth route supports registration with notificationPreferences and profile CRUD', () => {
  assert(authRoutesJs.includes('notificationPreferences'), 'auth.js register handles notificationPreferences');
  assert(authRoutesJs.includes('/profile'), 'auth.js defines /profile route');
  assert(authRoutesJs.includes("router.put('/profile'") || authRoutesJs.includes('router.put(\'/profile\''), 'auth.js handles PUT /profile');
  assert(authRoutesJs.includes("router.get('/profile'") || authRoutesJs.includes('router.get(\'/profile\''), 'auth.js handles GET /profile');
});

runTest('Fallback server.js handles /api/auth/profile GET, PUT, PATCH, and POST methods', () => {
  assert(serverJs.includes('/api/auth/profile'), 'server.js contains /api/auth/profile endpoint handler');
  assert(serverJs.includes('sms:') && serverJs.includes('whatsapp:'), 'server.js parses multi-channel notification preferences');
});

// ---------------------------------------------------------------------
// 2. Functional Server & Live API Test
// ---------------------------------------------------------------------
const BASE_URL = 'http://localhost:5000';

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL + '/api/health', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServerRunning() {
  const isUp = await checkServer();
  if (isUp) return null;
  const proc = fork(path.join(__dirname, '..', 'server', 'server.js'), [], {
    stdio: 'ignore'
  });
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    const ready = await checkServer();
    if (ready) return proc;
  }
  return proc;
}

function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(endpoint, BASE_URL);
    const bodyStr = data ? JSON.stringify(data) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (bodyStr) headers['Content-Length'] = Buffer.byteLength(bodyStr);

    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method,
      headers
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = raw ? JSON.parse(raw) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: json, raw });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function runLiveApiTests() {
  let serverProc = null;
  try {
    serverProc = await ensureServerRunning();

    console.log('\n--- 🚀 Running Live End-to-End API Integration Checks ---');

    // Test A: Register new customer with specific notification preferences: SMS + WhatsApp, Email OFF
    const testTimestamp = Date.now();
    const testUserEmail = `notif_user_${testTimestamp}@example.com`;
    const regPayload = {
      name: 'Selvi Anushiya',
      email: testUserEmail,
      password: 'SecurePassword123!',
      role: 'customer',
      phone: '+91 98401 23456',
      address: '12 Anna Salai, Chennai, Tamil Nadu',
      notificationPreferences: {
        sms: true,
        email: false,
        whatsapp: true
      },
      notifications: ['sms', 'whatsapp']
    };

    totalTests++;
    const regRes = await apiRequest('/api/auth/register', 'POST', regPayload);
    if (regRes.status === 201 && regRes.data.success && regRes.data.token) {
      const userPrefs = regRes.data.user.notificationPreferences;
      if (userPrefs && userPrefs.sms === true && userPrefs.email === false && userPrefs.whatsapp === true) {
        console.log('✅ [PASS] Registration saves multi-channel notification preferences (SMS: true, Email: false, WhatsApp: true)');
        passedTests++;
      } else {
        console.error('❌ [FAIL] Registration did not return expected notificationPreferences:', userPrefs);
        process.exitCode = 1;
      }
    } else {
      console.error('❌ [FAIL] Registration failed:', regRes.data || regRes.raw);
      process.exitCode = 1;
    }

    const token = regRes.data ? regRes.data.token : null;

    // Test B: GET /api/auth/profile retrieves user profile and notification channels
    totalTests++;
    const getProfileRes = await apiRequest('/api/auth/profile', 'GET', null, token);
    if (getProfileRes.status === 200 && getProfileRes.data.success) {
      const fetchedPrefs = getProfileRes.data.user.notificationPreferences;
      if (fetchedPrefs && fetchedPrefs.sms === true && fetchedPrefs.email === false && fetchedPrefs.whatsapp === true) {
        console.log('✅ [PASS] GET /api/auth/profile successfully returns user notification preferences');
        passedTests++;
      } else {
        console.error('❌ [FAIL] GET /api/auth/profile returned incorrect preferences:', fetchedPrefs);
        process.exitCode = 1;
      }
    } else {
      console.error('❌ [FAIL] GET /api/auth/profile failed:', getProfileRes.data || getProfileRes.raw);
      process.exitCode = 1;
    }

    // Test C: PUT /api/auth/profile updates notification preferences and profile info
    totalTests++;
    const updatePayload = {
      name: 'Selvi Anushiya Updated',
      phone: '+91 99999 88888',
      address: 'Coimbatore, Tamil Nadu',
      notificationPreferences: {
        sms: false,
        email: true,
        whatsapp: true
      }
    };
    const putProfileRes = await apiRequest('/api/auth/profile', 'PUT', updatePayload, token);
    if (putProfileRes.status === 200 && putProfileRes.data.success) {
      const updatedPrefs = putProfileRes.data.user.notificationPreferences;
      if (updatedPrefs && updatedPrefs.sms === false && updatedPrefs.email === true && updatedPrefs.whatsapp === true) {
        console.log('✅ [PASS] PUT /api/auth/profile updates notification preferences (SMS: false, Email: true, WhatsApp: true)');
        passedTests++;
      } else {
        console.error('❌ [FAIL] PUT /api/auth/profile updated with incorrect preferences:', updatedPrefs);
        process.exitCode = 1;
      }
    } else {
      console.error('❌ [FAIL] PUT /api/auth/profile request failed:', putProfileRes.data || putProfileRes.raw);
      process.exitCode = 1;
    }

    // Test D: Verify persistence by reading profile again
    totalTests++;
    const verifyGetRes = await apiRequest('/api/auth/profile', 'GET', null, token);
    if (verifyGetRes.status === 200 && verifyGetRes.data.success) {
      const persistedPrefs = verifyGetRes.data.user.notificationPreferences;
      if (persistedPrefs && persistedPrefs.sms === false && persistedPrefs.email === true && persistedPrefs.whatsapp === true && verifyGetRes.data.user.name === 'Selvi Anushiya Updated') {
        console.log('✅ [PASS] Persistence verified: GET /api/auth/profile confirms updated personal dashboard preferences');
        passedTests++;
      } else {
        console.error('❌ [FAIL] Persisted preferences mismatch:', verifyGetRes.data.user);
        process.exitCode = 1;
      }
    } else {
      console.error('❌ [FAIL] Verification GET failed:', verifyGetRes.data || verifyGetRes.raw);
      process.exitCode = 1;
    }

  } catch (apiErr) {
    console.error('❌ [FAIL] Live API Test error:', apiErr.message);
    process.exitCode = 1;
  } finally {
    if (serverProc) {
      serverProc.kill();
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Checks: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`);
  console.log(`========================================\n`);

  if (passedTests === totalTests) {
    console.log('🎉 ALL NOTIFICATION PREFERENCES & PROFILE TESTS PASSED 100%!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runLiveApiTests();
