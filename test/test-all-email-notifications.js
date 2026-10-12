const assert = require('assert');

async function testAllEmailNotifications() {
  console.log('\n============================================================');
  console.log('📧 AUDITING & TESTING ALL EMAIL NOTIFICATIONS (LIVE API)');
  console.log('============================================================\n');

  const adminEmail = 'anushiyaselvi60@gmail.com';
  let passed = 0;
  let total = 0;

  function check(cond, desc) {
    total++;
    if (cond) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.log(`  ❌ [FAIL] ${desc}`);
    }
  }

  // 1. Check Email Status Endpoint
  console.log('\n--- 1. Testing /api/admin/email-status ---');
  try {
    const statusRes = await fetch('http://localhost:5000/api/admin/email-status');
    const statusData = await statusRes.json();
    console.log('Email status:', JSON.stringify({
      isConfigured: statusData.isConfigured,
      adminEmail: statusData.adminEmail,
      connection: statusData.connection?.message
    }, null, 2));
    check(statusData.success === true, 'GET /api/admin/email-status returns success: true');
    check(statusData.isConfigured === true, 'Service is configured with valid Gmail credentials');
    check(statusData.adminEmail === adminEmail, `Admin sender email correctly resolved as ${adminEmail}`);
    check(statusData.connection?.verified === true, 'Live SMTP transporter connection verified with Google');
  } catch (e) {
    console.error('Status check error:', e.message);
    check(false, 'Email status endpoint reached');
  }

  // 2. Test Welcome Email on Registration
  console.log('\n--- 2. Testing Welcome Email Notification ---');
  try {
    const welcomeRes = await fetch('http://localhost:5000/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        type: 'welcome',
        name: 'Anushiya Selvi',
        role: 'customer'
      })
    });
    const welcomeData = await welcomeRes.json();
    console.log('Welcome email result:', welcomeData.success, welcomeData.result?.messageId || welcomeData.result?.message);
    check(welcomeData.success === true, 'Welcome email dispatched successfully to ' + adminEmail);
    check(Boolean(welcomeData.result?.messageId), 'Received valid Google MessageId for Welcome email');
  } catch (e) {
    console.error('Welcome email error:', e.message);
    check(false, 'Welcome email test passed');
  }

  // 3. Test Order Confirmation Email
  console.log('\n--- 3. Testing Order Confirmation Email ---');
  try {
    const orderRes = await fetch('http://localhost:5000/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        type: 'order',
        name: 'Anushiya Selvi'
      })
    });
    const orderData = await orderRes.json();
    console.log('Order email result:', orderData.success, orderData.result?.messageId || orderData.result?.message);
    check(orderData.success === true, 'Order confirmation email dispatched successfully to ' + adminEmail);
    check(Boolean(orderData.result?.messageId), 'Received valid Google MessageId for Order Confirmation');
  } catch (e) {
    console.error('Order email error:', e.message);
    check(false, 'Order email test passed');
  }

  // 4. Test Order Status Update Email
  console.log('\n--- 4. Testing Order Status Update Email ---');
  try {
    const statusRes = await fetch('http://localhost:5000/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        type: 'status',
        name: 'Anushiya Selvi',
        status: 'Out for Delivery (Cold-Chain Express)'
      })
    });
    const statusData = await statusRes.json();
    console.log('Status email result:', statusData.success, statusData.result?.messageId || statusData.result?.message);
    check(statusData.success === true, 'Order status update email dispatched successfully to ' + adminEmail);
    check(Boolean(statusData.result?.messageId), 'Received valid Google MessageId for Order Status Update');
  } catch (e) {
    console.error('Status email error:', e.message);
    check(false, 'Status email test passed');
  }

  // 5. Test Special Offer Email & Publishing Route
  console.log('\n--- 5. Testing Special Offer Email & Publishing Route ---');
  try {
    const offerRes = await fetch('http://localhost:5000/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        type: 'offer',
        name: 'Anushiya Selvi'
      })
    });
    const offerData = await offerRes.json();
    console.log('Offer email result:', offerData.success, offerData.result?.messageId || offerData.result?.message);
    check(offerData.success === true, 'Special offer email dispatched successfully to ' + adminEmail);
    check(Boolean(offerData.result?.messageId), 'Received valid Google MessageId for Special Offer');

    // Also test POST /api/admin/offers duplicate prevention
    const publishRes = await fetch('http://localhost:5000/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Festival Harvest 2026',
        code: 'FESTIVAL20',
        discountPercent: 20,
        description: '20% discount on all organic harvest boxes across Tamil Nadu.',
        eligibleRole: 'customer'
      })
    });
    const publishData = await publishRes.json();
    check(publishData.success === true, 'POST /api/admin/offers successfully created offer with deduplication tracking');
    check(Array.isArray(publishData.offer?.sentRecipients), 'Offer initializes sentRecipients array to prevent repeated emails');
  } catch (e) {
    console.error('Offer email error:', e.message);
    check(false, 'Offer email test passed');
  }

  // 6. Test Password Sign-In Login Notification Email
  console.log('\n--- 6. Testing Account Sign-In Notification Email ---');
  try {
    const loginRes = await fetch('http://localhost:5000/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        type: 'login',
        name: 'Anushiya Selvi'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login alert result:', loginData.success, loginData.result?.messageId || loginData.result?.message);
    check(loginData.success === true, 'Sign-in notification email dispatched successfully to ' + adminEmail);
    check(Boolean(loginData.result?.messageId), 'Received valid Google MessageId for Sign-In Notification');
  } catch (e) {
    console.error('Login alert error:', e.message);
    check(false, 'Login alert test passed');
  }

  // 7. Test Google Sign-In Notification Email
  console.log('\n--- 7. Testing Google Sign-In Notification Email ---');
  try {
    const gLoginRes = await fetch('http://localhost:5000/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        type: 'google_login',
        name: 'Anushiya Selvi'
      })
    });
    const gLoginData = await gLoginRes.json();
    console.log('Google login alert result:', gLoginData.success, gLoginData.result?.messageId || gLoginData.result?.message);
    check(gLoginData.success === true, 'Google Sign-In notification email dispatched successfully to ' + adminEmail);
    check(Boolean(gLoginData.result?.messageId), 'Received valid Google MessageId for Google Sign-In Alert');
  } catch (e) {
    console.error('Google login alert error:', e.message);
    check(false, 'Google login alert test passed');
  }

  // 8. Test Password Reset OTP Email
  console.log('\n--- 8. Testing Password Reset OTP Email ---');
  try {
    const resetRes = await fetch('http://localhost:5000/api/admin/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: adminEmail,
        type: 'reset',
        name: 'Anushiya Selvi'
      })
    });
    const resetData = await resetRes.json();
    console.log('Password reset result:', resetData.success, resetData.result?.messageId || resetData.result?.message);
    check(resetData.success === true, 'Password reset OTP email dispatched successfully to ' + adminEmail);
    check(Boolean(resetData.result?.messageId), 'Received valid Google MessageId for Password Reset OTP');
  } catch (e) {
    console.error('Password reset error:', e.message);
    check(false, 'Password reset test passed');
  }

  console.log('\n============================================================');
  console.log(`📊 EMAIL SYSTEM AUDIT: ${passed} / ${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('============================================================\n');

  if (passed === total) process.exit(0);
  else process.exit(1);
}

testAllEmailNotifications().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
