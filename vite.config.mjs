import { defineConfig, loadEnv } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom plugin to copy raw scripts and assets to dist directory upon build
function copyStaticFilesPlugin() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      // Copy js directory to dist/js
      const jsSrc = resolve(__dirname, 'js');
      const jsDest = resolve(distDir, 'js');
      if (fs.existsSync(jsSrc)) {
        fs.cpSync(jsSrc, jsDest, { recursive: true, force: true });
      }

      // Copy assets directory to dist/assets
      const assetsSrc = resolve(__dirname, 'assets');
      const assetsDest = resolve(distDir, 'assets');
      if (fs.existsSync(assetsSrc)) {
        fs.cpSync(assetsSrc, assetsDest, { recursive: true, force: true });
      }

      // Copy popup HTML to dist root
      const popupSrc = resolve(__dirname, 'google-login-popup.html');
      const popupDest = resolve(distDir, 'google-login-popup.html');
      if (fs.existsSync(popupSrc)) {
        fs.copyFileSync(popupSrc, popupDest);
      }
    }
  };
}

// Custom plugin to display the exact required terminal startup banner and route rewrites
function startupBannerPlugin() {
  return {
    name: 'startup-banner',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/traceability/') || req.url === '/traceability')) {
          req.url = '/pages/traceability.html';
        } else if (req.url && (req.url === '/complete-profile' || req.url.startsWith('/complete-profile?') || req.url.startsWith('/pages/complete-profile'))) {
          req.url = '/pages/complete-profile.html';
        } else if (req.url && (req.url === '/reset-password' || req.url.startsWith('/reset-password?'))) {
          req.url = '/pages/reset-password.html';
        }
        next();
      });

      server.httpServer?.once('listening', () => {
        const address = server.httpServer?.address();
        const actualPort = typeof address === 'object' && address ? address.port : 5173;
        setTimeout(() => {
          console.log('\n========================================');
          console.log(' FARM TO FORK COLLECTIVE');
          console.log(' FRONTEND');
          console.log('========================================');
          console.log(` URL: http://localhost:${actualPort}`);
          console.log(' API: http://localhost:5000');
          console.log('========================================\n');
        }, 100);
      });
    }
  };
}

// Injects VITE_ environment variables into HTML pages so client scripts have immediate access
function htmlEnvPlugin(env, mode) {
  return {
    name: 'html-env-transform',
    transformIndexHtml(html) {
      const isProd = mode === 'production';
      const apiUrl = env.VITE_API_URL !== undefined ? env.VITE_API_URL : (isProd ? '' : 'http://localhost:5000');
      const googleClientId = env.VITE_GOOGLE_CLIENT_ID || '939090047671-otlai1n75lvc9mgass18jd721dpp8f36.apps.googleusercontent.com';
      const scriptTag = `
    <script>
      window.VITE_API_URL = ${JSON.stringify(apiUrl)};
      window.VITE_GOOGLE_CLIENT_ID = ${JSON.stringify(googleClientId)};
    </script>`;
      return html.replace(/<head>/i, `<head>${scriptTag}`);
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: './',
    clearScreen: false,
    server: {
      port: 5173,
      strictPort: true,
      host: 'localhost',
      open: false,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [
      startupBannerPlugin(),
      htmlEnvPlugin(env, mode),
      copyStaticFilesPlugin()
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          login: resolve(__dirname, 'pages/login.html'),
          register: resolve(__dirname, 'pages/register.html'),
          completeProfile: resolve(__dirname, 'pages/complete-profile.html'),
          traceability: resolve(__dirname, 'pages/traceability.html'),
          products: resolve(__dirname, 'pages/products.html'),
          productDetails: resolve(__dirname, 'pages/product-details.html'),
          cart: resolve(__dirname, 'pages/cart.html'),
          checkout: resolve(__dirname, 'pages/checkout.html'),
          wishlist: resolve(__dirname, 'pages/wishlist.html'),
          communityKitchen: resolve(__dirname, 'pages/community-kitchen.html'),
          groupBuying: resolve(__dirname, 'pages/group-buying.html'),
          seedToPlate: resolve(__dirname, 'pages/seed-to-plate.html'),
          farmerMarketplace: resolve(__dirname, 'pages/farmer-marketplace.html'),
          farmerStore: resolve(__dirname, 'pages/farmer-store.html'),
          farmerUploadJourney: resolve(__dirname, 'pages/farmer-upload-journey.html'),
          dashboardCustomer: resolve(__dirname, 'pages/dashboard-customer.html'),
          dashboardFarmer: resolve(__dirname, 'pages/dashboard-farmer.html'),
          dashboardArtisan: resolve(__dirname, 'pages/dashboard-artisan.html'),
          dashboardAdmin: resolve(__dirname, 'pages/dashboard-admin.html'),
          adminLogin: resolve(__dirname, 'pages/admin-login.html'),
          apiDocs: resolve(__dirname, 'pages/api-docs.html'),
          oauthCallback: resolve(__dirname, 'pages/oauth-callback.html'),
          googleLoginPopup: resolve(__dirname, 'pages/google-login-popup.html'),
          resetPassword: resolve(__dirname, 'pages/reset-password.html')
        }
      }
    }
  };
});
