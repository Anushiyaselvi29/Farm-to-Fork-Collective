const bypassToken = '7TyDdMBH5BFeJgP18CcyEzQraQFM5bUv';
const baseUrl = 'https://farm-to-fork-collective.vercel.app';

async function testProductionEmail() {
  console.log('\n============================================================');
  console.log('🌐 TESTING LIVE PRODUCTION EMAIL SYSTEM (VERCEL)');
  console.log('============================================================\n');

  // 1. Check status
  console.log('--- 1. Testing /api/admin/email-status on Vercel ---');
  const statusRes = await fetch(`${baseUrl}/api/admin/email-status`, {
    headers: { 'x-vercel-protection-bypass': bypassToken }
  });
  const statusData = await statusRes.json();
  console.log('Production Status:', JSON.stringify(statusData, null, 2));

  // 2. Admin Login to get token
  console.log('\n--- 2. Logging in as Admin on Vercel ---');
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vercel-protection-bypass': bypassToken
    },
    body: JSON.stringify({
      email: 'admin@farmtofork.com',
      password: 'admin123'
    })
  });
  const loginData = await loginRes.json();
  console.log('Admin Login Result:', loginData.success, loginData.message || '');
  const adminToken = loginData.token;

  if (!adminToken) {
    console.error('Could not acquire admin token:', loginData);
    return;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
    'x-vercel-protection-bypass': bypassToken
  };

  // 3. Send live Welcome Email
  console.log('\n--- 3. Testing Welcome Email Notification via Vercel ---');
  const welcomeRes = await fetch(`${baseUrl}/api/admin/test-email`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      to: 'anushiyaselvi60@gmail.com',
      type: 'welcome',
      name: 'Anushiya Selvi',
      role: 'customer'
    })
  });
  const welcomeData = await welcomeRes.json();
  console.log('Production Welcome Email Result:', JSON.stringify(welcomeData, null, 2));

  // 4. Send Order Confirmation Email
  console.log('\n--- 4. Testing Order Confirmation Email Notification via Vercel ---');
  const orderRes = await fetch(`${baseUrl}/api/admin/test-email`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      to: 'anushiyaselvi60@gmail.com',
      type: 'order',
      name: 'Anushiya Selvi'
    })
  });
  const orderData = await orderRes.json();
  console.log('Production Order Confirmation Email Result:', JSON.stringify(orderData, null, 2));

  // 5. Send Order Status Update Email (Delivered)
  console.log('\n--- 5. Testing Order Status Update Email Notification via Vercel ---');
  const statusUpdateRes = await fetch(`${baseUrl}/api/admin/test-email`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      to: 'anushiyaselvi60@gmail.com',
      type: 'status',
      name: 'Anushiya Selvi',
      status: 'Delivered'
    })
  });
  const statusUpdateData = await statusUpdateRes.json();
  console.log('Production Status Update Email Result:', JSON.stringify(statusUpdateData, null, 2));

  // 6. Send Special Offer Email
  console.log('\n--- 6. Testing Special Offer Email Notification via Vercel ---');
  const offerRes = await fetch(`${baseUrl}/api/admin/test-email`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      to: 'anushiyaselvi60@gmail.com',
      type: 'offer',
      name: 'Anushiya Selvi'
    })
  });
  const offerData = await offerRes.json();
  console.log('Production Special Offer Email Result:', JSON.stringify(offerData, null, 2));
}

testProductionEmail().catch(console.error);
