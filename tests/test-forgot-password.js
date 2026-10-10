const http = require('http');
const path = require('path');
const { fork } = require('child_process');

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
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

function post(pathUrl, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: pathUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  const serverProc = await ensureServerRunning();
  console.log('\n=============================================================');
  console.log('🔑 FORGOT PASSWORD & OTP AUTHENTICATION TEST SUITE');
  console.log('=============================================================\n');

  try {
    console.log('--- 1. Testing Unregistered Email ---');
    const r1 = await post('/api/auth/forgot-password', { email: 'fakeuser999@gmail.com' });
    console.log('Result 1 (Status:', r1.status, '):', r1.data.message);

    console.log('\n--- 2. Testing Registered Email (priya@example.com) ---');
    const r2 = await post('/api/auth/forgot-password', { email: 'priya@example.com' });
    console.log('Result 2 (Status:', r2.status, '):', r2.data.message);
    console.log('Generated OTP:', r2.data.otp);
    console.log('Reset Link:', r2.data.resetLink);

    console.log('\n--- 3. Testing Verify OTP with wrong code ---');
    const r3_wrong = await post('/api/auth/verify-otp', { email: 'priya@example.com', otp: '000000' });
    console.log('Wrong OTP Result (Status:', r3_wrong.status, '):', r3_wrong.data.message);

    console.log('\n--- 4. Testing Verify OTP with correct code ---');
    const r3 = await post('/api/auth/verify-otp', { email: 'priya@example.com', otp: r2.data.otp });
    console.log('Correct OTP Result (Status:', r3.status, '):', r3.data.message);
    console.log('Reset Token:', r3.data.resetToken);

    console.log('\n--- 5. Testing Reset Password to "customer123" ---');
    const r4 = await post('/api/auth/reset-password', {
      email: 'priya@example.com',
      otp: r2.data.otp,
      token: r3.data.resetToken,
      newPassword: 'customer123'
    });
    console.log('Reset Password Result (Status:', r4.status, '):', r4.data.message);

    console.log('\n--- 6. Testing Login with new password ---');
    const r5 = await post('/api/auth/login', {
      email: 'priya@example.com',
      password: 'customer123',
      role: 'customer'
    });
    console.log('Login Result (Status:', r5.status, '):', r5.data.message, '| User:', r5.data.user && r5.data.user.name);

    if (r1.status === 404 && r2.status === 200 && r3_wrong.status === 400 && r3.status === 200 && r4.status === 200 && r5.status === 200) {
      console.log('\n🌟 ALL 6 FORGOT PASSWORD & OTP TESTS PASSED PERFECTLY! 🌟\n');
    } else {
      console.error('\n❌ SOME CHECKS FAILED!');
      if (serverProc) serverProc.kill();
      process.exit(1);
    }
  } catch (err) {
    console.error('Test error:', err);
    if (serverProc) serverProc.kill();
    process.exit(1);
  }

  if (serverProc) {
    serverProc.kill();
  }
  process.exit(0);
})();
