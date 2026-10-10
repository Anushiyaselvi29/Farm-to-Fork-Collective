const assert = require('assert');

async function verifyLiveVercel() {
  console.log('\n============================================================');
  console.log('🌐 VERIFYING PRODUCTION VERCEL DEPLOYMENT');
  console.log('URL: https://farm-to-fork-collective.vercel.app');
  console.log('============================================================\n');

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

  const ts = Date.now();

  // 1. Check login page
  const loginRes = await fetch(`https://farm-to-fork-collective.vercel.app/pages/login.html?v=${ts}`);
  const loginHtml = await loginRes.text();
  check(loginRes.status === 200, 'Live login.html returns 200 OK');
  check(!loginHtml.includes('Need help with Google Error 400 on Vercel'), 'Troubleshooting guide link completely removed from live login.html');
  check(!loginHtml.includes('Fix Google Error 400'), 'No "Fix Google Error 400" text in live login.html');
  check(loginHtml.includes('id="btnContinueGoogle"'), 'Normal "Continue with Google" button is present in live login.html');

  // 2. Check register page
  const regRes = await fetch(`https://farm-to-fork-collective.vercel.app/pages/register.html?v=${ts}`);
  const regHtml = await regRes.text();
  check(regRes.status === 200, 'Live register.html returns 200 OK');
  check(!regHtml.includes('Need help with Google Error 400 on Vercel'), 'Troubleshooting guide link completely removed from live register.html');
  check(regHtml.includes('id="btnContinueGoogleReg"'), 'Normal "Continue with Google" button is present in live register.html');

  // 3. Check js/google-auth.js
  const authJsRes = await fetch(`https://farm-to-fork-collective.vercel.app/js/google-auth.js?v=${ts}`);
  const authJs = await authJsRes.text();
  check(authJsRes.status === 200, 'Live js/google-auth.js returns 200 OK');
  check(!authJs.includes('showGoogleOriginGuide'), 'No showGoogleOriginGuide in live js/google-auth.js');
  check(!authJs.includes('Fix Google Error 400'), 'No troubleshooting guide HTML template in live js/google-auth.js');
  check(authJs.includes('939090047671-otlai1n75lvc9mgass18jd721dpp8f36.apps.googleusercontent.com'), 'Configured with correct Google OAuth Client ID');
  check(authJs.includes("prompt: 'select_account'"), 'Requests prompt: select_account for genuine Google account chooser');
  check(authJs.includes('https://accounts.google.com/o/oauth2/v2/auth'), 'Directs to official accounts.google.com endpoint');

  // 4. Check product assets
  const guavaImgRes = await fetch(`https://farm-to-fork-collective.vercel.app/assets/images/products/organic-guavas.jpg?v=${ts}`);
  check(guavaImgRes.status === 200 && guavaImgRes.headers.get('content-type')?.includes('image'), 'Fresh Coimbatore Guavas image (organic-guavas.jpg) live & accessible');

  const dragonImgRes = await fetch(`https://farm-to-fork-collective.vercel.app/assets/images/products/organic-dragon-fruit.jpg?v=${ts}`);
  check(dragonImgRes.status === 200 && dragonImgRes.headers.get('content-type')?.includes('image'), 'Organic Dindigul Dragon Fruit image (organic-dragon-fruit.jpg) live & accessible');

  const bananasImgRes = await fetch(`https://farm-to-fork-collective.vercel.app/assets/images/products/organic-bananas.jpg?v=${ts}`);
  check(bananasImgRes.status === 200, 'Organic Cavendish Bananas image (organic-bananas.jpg) live & accessible');

  const broccoliImgRes = await fetch(`https://farm-to-fork-collective.vercel.app/assets/images/products/organic-broccoli.jpg?v=${ts}`);
  check(broccoliImgRes.status === 200, 'Organic Brocolli image (organic-broccoli.jpg) live & accessible');

  // 5. Check live products API
  const prodApiRes = await fetch(`https://farm-to-fork-collective.vercel.app/api/products?v=${ts}`);
  if (prodApiRes.ok) {
    const prodData = await prodApiRes.json();
    const list = prodData.products || prodData;
    const guava = list.find(p => p.id === 38);
    const dragon = list.find(p => p.id === 36);
    const banana = list.find(p => p.id === 35);
    const broccoli = list.find(p => p.id === 39);
    check(guava && guava.image === '/assets/images/products/organic-guavas.jpg', 'API returns correct image for Fresh Coimbatore Guavas');
    check(dragon && dragon.image === '/assets/images/products/organic-dragon-fruit.jpg', 'API returns correct image for Organic Dindigul Dragon Fruit');
    check(banana && banana.image === '/assets/images/products/organic-bananas.jpg', 'API returns correct image for Organic Cavendish Bananas');
    check(broccoli && broccoli.image === '/assets/images/products/organic-broccoli.jpg', 'API returns correct image for Organic Brocolli');
  } else {
    console.log('  ℹ️ Serverless /api/products returned status:', prodApiRes.status);
  }

  console.log('\n============================================================');
  console.log(`📊 LIVE PRODUCTION AUDIT: ${passed} / ${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('============================================================\n');

  if (passed === total) process.exit(0);
  else process.exit(1);
}

verifyLiveVercel().catch(err => {
  console.error('Audit failure:', err);
  process.exit(1);
});
