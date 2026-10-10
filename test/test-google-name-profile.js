const assert = require('assert');
const http = require('http');
const path = require('path');
const { fork } = require('child_process');

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

async function ensureServerRunning() {
  const isUp = await checkServer();
  if (isUp) return null;
  const proc = fork(path.join(__dirname, '..', 'server', 'server.js'), [], { stdio: 'ignore' });
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    if (await checkServer()) return proc;
  }
  return proc;
}

async function runTest() {
  const serverProc = await ensureServerRunning();
  console.log('Testing Google OAuth customer login and profile verification...');

  // 1. Test POST /api/auth/oauth/google with verified Google account: Anushiya Selvi
  const googleProfile = {
    email: 'anushiyaselvi@gmail.com',
    name: 'Anushiya Selvi',
    given_name: 'Anushiya',
    family_name: 'Selvi',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    sub: '109823472910283748291',
    role: 'customer'
  };

  const res = await fetch('http://localhost:5000/api/auth/oauth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleProfile)
  });

  const data = await res.json();
  console.log('Response status:', res.status);
  console.log('Response user:', data.user);

  assert.strictEqual(res.status, 200, 'Expected 200 OK');
  assert.strictEqual(data.success, true, 'Expected success: true');
  assert.ok(data.token, 'Expected JWT token');

  // Verify critical name requirement
  assert.strictEqual(data.user.name, 'Anushiya Selvi', 'User full name must be exactly "Anushiya Selvi"');
  assert.notStrictEqual(data.user.name, 'anushiyaselvi', 'Must not be derived from email prefix');
  assert.notStrictEqual(data.user.name, 'Anushiya', 'Must not be just given_name');
  assert.notStrictEqual(data.user.name, 'Customer', 'Must not be default placeholder');

  // Verify profile fields
  assert.strictEqual(data.user.email, 'anushiyaselvi@gmail.com', 'Email must match');
  assert.strictEqual(data.user.firstName, 'Anushiya', 'Given name must match');
  assert.strictEqual(data.user.lastName, 'Selvi', 'Family name must match');
  assert.strictEqual(data.user.googleId, '109823472910283748291', 'Google ID must match');
  assert.strictEqual(data.user.authProvider, 'google', 'Auth provider must be google');
  assert.ok(data.user.profilePicture, 'Profile picture must exist');

  // 2. Test Deduplication: Login again with the same Google account
  const res2 = await fetch('http://localhost:5000/api/auth/oauth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleProfile)
  });
  const data2 = await res2.json();
  assert.strictEqual(data2.user.id, data.user.id, 'User ID must be identical (no duplicate MongoDB account)');

  // 3. Test Profile GET endpoint with user's JWT token
  const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
    headers: { 'Authorization': `Bearer ${data.token}` }
  });
  const profileData = await profileRes.json();
  console.log('Fetched profile:', profileData.user);
  assert.strictEqual(profileData.user.name, 'Anushiya Selvi', 'Profile API returns exact full name');
  assert.strictEqual(profileData.user.firstName, 'Anushiya');
  assert.strictEqual(profileData.user.lastName, 'Selvi');
  assert.strictEqual(profileData.user.googleId, '109823472910283748291');
  assert.strictEqual(profileData.user.authProvider, 'google');

  // 4. Test updating profile preserves Google ID and authProvider
  const updateRes = await fetch('http://localhost:5000/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`
    },
    body: JSON.stringify({
      phone: '+91 98765 99999',
      address: 'Coimbatore, Tamil Nadu'
    })
  });
  const updateData = await updateRes.json();
  assert.strictEqual(updateData.user.name, 'Anushiya Selvi', 'Name preserved after update');
  assert.strictEqual(updateData.user.googleId, '109823472910283748291', 'Google ID preserved');
  assert.strictEqual(updateData.user.phone, '+91 98765 99999', 'Phone updated');

  console.log('✅ ALL GOOGLE IDENTITY AND PROFILE TESTS PASSED PERFECTLY!');
  process.exit(0);
}

runTest().catch(e => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
