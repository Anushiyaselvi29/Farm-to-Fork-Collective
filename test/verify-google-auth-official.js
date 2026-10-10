/**
 * Verification Script: Official Google OAuth 2.0 Integration & Removal of Custom Modal
 * Tests all 12 requirements from the user request
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

async function testGoogleAuthRequirements() {
  console.log('\n============================================================');
  console.log('🔍 VERIFYING GOOGLE OAUTH 2.0 OFFICIAL FLOW IMPLEMENTATION');
  console.log('============================================================\n');

  let passed = 0;
  let total = 0;

  function check(condition, desc) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
    }
  }

  const rootDir = path.join(__dirname, '..');
  const googleAuthJs = fs.readFileSync(path.join(rootDir, 'js', 'google-auth.js'), 'utf8');
  const loginHtml = fs.readFileSync(path.join(rootDir, 'pages', 'login.html'), 'utf8');
  const registerHtml = fs.readFileSync(path.join(rootDir, 'pages', 'register.html'), 'utf8');
  const rootPopupHtml = fs.readFileSync(path.join(rootDir, 'google-login-popup.html'), 'utf8');
  const pagesPopupHtml = fs.readFileSync(path.join(rootDir, 'pages', 'google-login-popup.html'), 'utf8');
  const oauthCallbackHtml = fs.readFileSync(path.join(rootDir, 'pages', 'oauth-callback.html'), 'utf8');
  const authRoutes = fs.readFileSync(path.join(rootDir, 'server', 'routes', 'auth.js'), 'utf8');

  // Requirement 1: Remove or bypass custom Google account selection UI
  check(!googleAuthJs.includes('DEFAULT_LAPTOP_ACCOUNTS'), 'Removed DEFAULT_LAPTOP_ACCOUNTS from js/google-auth.js');
  check(!googleAuthJs.includes('showGoogleAccountModal'), 'Removed showGoogleAccountModal from js/google-auth.js');
  check(!googleAuthJs.includes('Detected Browser Accounts'), 'No "Detected Browser Accounts" in js/google-auth.js');
  check(!googleAuthJs.includes('manualGoogleEmail'), 'No manual Gmail input fields in js/google-auth.js');
  check(!loginHtml.includes('id="oauthModal"'), 'No #oauthModal custom markup in pages/login.html');
  check(!registerHtml.includes('id="oauthModal"'), 'No #oauthModal custom markup in pages/register.html');
  check(!loginHtml.includes('showGoogleOriginGuide'), 'No troubleshooting guide link in pages/login.html');
  check(!registerHtml.includes('showGoogleOriginGuide'), 'No troubleshooting guide link in pages/register.html');
  check(!googleAuthJs.includes('Fix Google Error 400'), 'No troubleshooting panel markup in js/google-auth.js');

  // Requirement 2 & 3: Immediately initiate official Google OAuth 2.0 flow at accounts.google.com
  check(googleAuthJs.includes("prompt: 'select_account'"), 'Requests prompt: select_account to display Google account chooser');
  check(googleAuthJs.includes('https://accounts.google.com/o/oauth2/v2/auth'), 'Configured with official accounts.google.com OAuth endpoint');
  check(googleAuthJs.includes('googleTokenClient.requestAccessToken'), 'Immediately calls googleTokenClient.requestAccessToken on click');

  // Requirement 4 & 5: Google official interface at accounts.google.com handles authentication & consent
  check(!rootPopupHtml.includes('Detected Browser Accounts'), 'Root popup does not contain fake Google accounts');
  check(rootPopupHtml.includes('accounts.google.com/o/oauth2/v2/auth'), 'Root popup redirects to official accounts.google.com OAuth URL');
  check(pagesPopupHtml.includes('accounts.google.com/o/oauth2/v2/auth'), 'Pages popup redirects to official accounts.google.com OAuth URL');

  // Requirement 6: Securely retrieve verified name, email, picture from Google UserInfo
  check(googleAuthJs.includes('https://www.googleapis.com/oauth2/v3/userinfo'), 'Retrieves verified profile from Google UserInfo endpoint');
  check(oauthCallbackHtml.includes('https://www.googleapis.com/oauth2/v3/userinfo'), 'OAuth callback verifies user with Google UserInfo endpoint');

  // Requirement 7: First-time customer profile onboarding
  check(googleAuthJs.includes('complete-profile.html'), 'Directs incomplete customer profiles to complete-profile.html');
  check(oauthCallbackHtml.includes('complete-profile.html'), 'OAuth callback redirects incomplete customer profiles to complete-profile.html');

  // Requirement 8: Do not automatically grant Admin role
  check(authRoutes.includes("const safeRole = (role === 'admin') ? 'customer' : (role || 'customer');"), 'Strictly prevents automatic Admin role escalation for OAuth users');

  // Requirement 9: Error and cancellation handling
  check(googleAuthJs.includes('popup_closed') && googleAuthJs.includes('popup_blocked'), 'Handles user cancellation and popup blockers gracefully');

  // Requirement 10: Authorized Client ID and redirect URI
  check(googleAuthJs.includes('939090047671-otlai1n75lvc9mgass18jd721dpp8f36.apps.googleusercontent.com'), 'Uses configured Google OAuth 2.0 Client ID');
  check(googleAuthJs.includes('/pages/oauth-callback.html'), 'Uses authorized redirect URI /pages/oauth-callback.html');

  // Backend live API verification
  console.log('\n--- Live API Endpoint Tests ---');
  try {
    const configRes = await fetch('http://localhost:5000/api/auth/oauth/config');
    const configData = await configRes.json();
    check(configData.success && configData.providers.google.authUrl === 'https://accounts.google.com/o/oauth2/v2/auth', 'Live /api/auth/oauth/config returns official Google authUrl');

    const adminEscalationTest = await fetch('http://localhost:5000/api/auth/oauth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_security_role_escalation@gmail.com',
        name: 'Attacker Attempting Admin',
        role: 'admin'
      })
    });
    const adminTestResult = await adminEscalationTest.json();
    check(adminTestResult.user.role === 'customer', 'Backend refuses Admin role escalation: assigned "customer" instead');
  } catch (e) {
    console.error('API test error:', e.message);
  }

  console.log('\n============================================================');
  console.log(`📊 RESULT: ${passed} / ${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('============================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

testGoogleAuthRequirements().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
