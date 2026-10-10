/**
 * Farm to Fork Collective - Official Google OAuth 2.0 & Google Identity Services (GIS)
 * 
 * Complies with Google's Official Identity Services:
 * 1. Initiates the genuine Google OAuth 2.0 account chooser at accounts.google.com
 * 2. Uses Google Token Client with prompt: 'select_account' to display all accounts available in the browser
 * 3. Securely fetches verified profile (name, email, picture, Google sub ID) from Google's UserInfo API
 * 4. Verifies Google token on the backend (/api/auth/oauth/google) with MongoDB synchronization
 * 5. Strictly prevents auto-escalation to Admin role
 * 6. Handles new user onboarding (redirects incomplete customer profiles to complete-profile.html)
 * 7. Gracefully handles cancellation, popup blockers, and origin configuration
 * 8. NO custom/simulated modals, NO fake accounts, NO manual Gmail input fields
 */

(function(window) {
    'use strict';

    // Auto-normalize 127.0.0.1 to localhost for consistency with Google Authorized JavaScript Origins
    if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
        const targetUrl = window.location.href.replace('127.0.0.1', 'localhost');
        window.location.replace(targetUrl);
        return;
    }

    let googleTokenClient = null;
    let cachedClientId = null;
    let isGisInitialized = false;

    /**
     * Resolves Google Client ID from:
     * 1. localStorage override ('ftf_google_client_id')
     * 2. window.VITE_GOOGLE_CLIENT_ID (injected by Vite or script)
     * 3. import.meta.env.VITE_GOOGLE_CLIENT_ID
     * 4. Backend endpoint /api/auth/oauth/config
     * 5. Verified fallback Google OAuth Client ID
     */
    async function getGoogleClientId() {
        if (cachedClientId) return cachedClientId;

        // 1. Local developer override
        try {
            const localOverride = localStorage.getItem('ftf_google_client_id');
            if (localOverride && localOverride.trim()) {
                cachedClientId = localOverride.trim();
                return cachedClientId;
            }
        } catch (e) {}

        // 2. Window-injected Vite variable
        if (window.VITE_GOOGLE_CLIENT_ID && typeof window.VITE_GOOGLE_CLIENT_ID === 'string') {
            cachedClientId = window.VITE_GOOGLE_CLIENT_ID.trim();
            return cachedClientId;
        }

        // 3. Dynamic import.meta.env if available
        try {
            if (typeof importMetaEnv !== 'undefined' && importMetaEnv.VITE_GOOGLE_CLIENT_ID) {
                cachedClientId = importMetaEnv.VITE_GOOGLE_CLIENT_ID.trim();
                return cachedClientId;
            }
        } catch (e) {}

        // 4. Fetch dynamic configuration from backend
        try {
            if (window.FTF_API && window.FTF_API.auth && window.FTF_API.auth.getOAuthProviders) {
                const config = await window.FTF_API.auth.getOAuthProviders();
                if (config && config.providers && config.providers.google && config.providers.google.clientId) {
                    cachedClientId = config.providers.google.clientId.trim();
                    return cachedClientId;
                }
            } else {
                const backendOrigin = (window.VITE_API_URL !== undefined && window.VITE_API_URL !== '')
                    ? window.VITE_API_URL.replace(/\/+$/, '')
                    : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
                const raw = await fetch(`${backendOrigin}/api/auth/oauth/config`);
                if (raw.ok) {
                    const data = await raw.json();
                    if (data && data.providers && data.providers.google && data.providers.google.clientId) {
                        cachedClientId = data.providers.google.clientId.trim();
                        return cachedClientId;
                    }
                }
            }
        } catch (e) {
            console.warn('[GoogleAuth] Backend config fetch notice:', e.message);
        }

        // 5. Default configured Client ID
        cachedClientId = '939090047671-otlai1n75lvc9mgass18jd721dpp8f36.apps.googleusercontent.com';
        return cachedClientId;
    }

    /**
     * Compute Authorized OAuth Redirect URI for current origin
     */
    function getRedirectUri() {
        const origin = window.location.origin;
        return `${origin}/pages/oauth-callback.html`;
    }

    /**
     * Generate official Google OAuth 2.0 authorization URL
     * Direct browser redirect to genuine Google Account Chooser at accounts.google.com
     */
    async function getOfficialGoogleAuthUrl(role) {
        const clientId = await getGoogleClientId();
        const redirectUri = getRedirectUri();
        const scope = 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
        const state = encodeURIComponent(JSON.stringify({
            role: role || 'customer',
            origin: window.location.origin,
            timestamp: Date.now()
        }));

        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&prompt=select_account&state=${state}&include_granted_scopes=true`;
    }

    /**
     * Ensures Google Identity Services client script is loaded in the DOM
     */
    function ensureGoogleScriptLoaded() {
        return new Promise((resolve) => {
            if (typeof google !== 'undefined' && google.accounts) {
                return resolve(true);
            }

            const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(true));
                setTimeout(() => resolve(typeof google !== 'undefined' && !!google.accounts), 1500);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(true);
            script.onerror = () => {
                console.warn('[GoogleAuth] Failed to load Google Identity Services from accounts.google.com');
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Google Identity Services (Token Client & Credential Client)
     */
    async function initGIS() {
        await ensureGoogleScriptLoaded();

        if (typeof google === 'undefined' || !google.accounts) {
            console.warn('[GoogleAuth] Google Identity Services script not yet available');
            return false;
        }

        const clientId = await getGoogleClientId();
        if (!clientId) {
            console.error('[GoogleAuth] Google Client ID is missing');
            return false;
        }

        try {
            // 1. Google ID Token Credential Handler
            if (google.accounts.id) {
                google.accounts.id.initialize({
                    client_id: clientId,
                    callback: async (credentialResponse) => {
                        if (credentialResponse && credentialResponse.credential) {
                            const role = localStorage.getItem('ftf_pending_role') || 'customer';
                            await handleGoogleCredential(credentialResponse.credential, role);
                        }
                    },
                    auto_select: false,
                    cancel_on_tap_outside: true
                });
            }

            // 2. Google OAuth 2.0 Token Client (Prompts genuine Google Account Chooser popup)
            if (google.accounts.oauth2) {
                googleTokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                    prompt: 'select_account',
                    callback: async (tokenResponse) => {
                        const role = localStorage.getItem('ftf_pending_role') || 'customer';
                        if (tokenResponse && tokenResponse.access_token) {
                            await handleGoogleAccessToken(tokenResponse.access_token, role);
                        } else if (tokenResponse && tokenResponse.error) {
                            handleGoogleAuthError(tokenResponse.error, role);
                        }
                    },
                    error_callback: (err) => {
                        const role = localStorage.getItem('ftf_pending_role') || 'customer';
                        handleGoogleAuthError(err, role);
                    }
                });
            }

            isGisInitialized = true;
            return true;
        } catch (err) {
            console.warn('[GoogleAuth] Notice during initGIS:', err);
            return false;
        }
    }

    /**
     * MAIN ENTRYPOINT: Initiates official Google OAuth 2.0 Authentication
     * Triggered directly when user clicks "Continue with Google"
     */
    async function triggerRealGoogleAuth(role) {
        // Enforce role assignment without escalation to admin
        const selectedRoleVal = (typeof selectedRole !== 'undefined') ? selectedRole : (typeof regRole !== 'undefined' ? regRole : 'customer');
        const activeRole = role || selectedRoleVal || 'customer';
        const safeRole = (activeRole === 'admin') ? 'customer' : activeRole;
        localStorage.setItem('ftf_pending_role', safeRole);

        showLoadingState('Connecting to Google Accounts...');

        try {
            // Ensure GIS is initialized
            if (!googleTokenClient || !isGisInitialized) {
                await initGIS();
            }

            // Immediately launch Google's official OAuth Account Chooser popup
            if (googleTokenClient) {
                googleTokenClient.requestAccessToken({ prompt: 'select_account' });
            } else {
                // If GIS script blocked or unavailable, redirect directly to accounts.google.com
                console.log('[GoogleAuth] Token client not available, redirecting to accounts.google.com');
                const authUrl = await getOfficialGoogleAuthUrl(safeRole);
                window.location.href = authUrl;
            }
        } catch (err) {
            console.error('[GoogleAuth] Error initiating Google Auth:', err);
            resetButtonState();
            // Fallback to direct navigation to accounts.google.com
            const authUrl = await getOfficialGoogleAuthUrl(safeRole);
            window.location.href = authUrl;
        }
    }

    /**
     * Process Google OAuth2 Access Token
     * Securely fetches user profile from Google's UserInfo API & sends to backend
     */
    async function handleGoogleAccessToken(accessToken, role) {
        showLoadingState('Verifying Google account...');
        try {
            // Retrieve verified user identity directly from Google's official UserInfo endpoint
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!profileRes.ok) {
                throw new Error('Google UserInfo verification failed');
            }

            const profile = await profileRes.json();
            const fullName = (profile.name && profile.name.trim()) || [profile.given_name, profile.family_name].filter(Boolean).join(' ').trim();

            const payload = {
                accessToken: accessToken,
                token: accessToken,
                email: profile.email,
                name: fullName,
                given_name: profile.given_name || '',
                family_name: profile.family_name || '',
                picture: profile.picture || '',
                sub: profile.sub || '',
                email_verified: profile.email_verified,
                role: role || 'customer'
            };

            const backendRes = await sendAuthToBackend(payload);

            if (backendRes && backendRes.success) {
                finishSuccessfulLogin(backendRes.user, backendRes.token);
            } else {
                showUserFriendlyError(backendRes ? backendRes.message : 'Google sign-in could not be completed.');
            }
        } catch (err) {
            console.error('[GoogleAuth] Access token processing error:', err);
            showUserFriendlyError('Authentication failed. Please verify your connection and try again.');
        } finally {
            resetButtonState();
        }
    }

    /**
     * Process Google ID Token Credential (JWT)
     */
    async function handleGoogleCredential(credential, role) {
        showLoadingState('Verifying Google credentials...');
        try {
            const res = await sendAuthToBackend({ credential, role: role || 'customer' });
            if (res && res.success) {
                finishSuccessfulLogin(res.user, res.token);
            } else {
                showUserFriendlyError(res ? res.message : 'Google authentication verification failed.');
            }
        } catch (err) {
            console.error('[GoogleAuth] Credential verification error:', err);
            showUserFriendlyError('Unable to connect to authentication server. Please try again.');
        } finally {
            resetButtonState();
        }
    }

    /**
     * Send verified credentials to Express backend /api/auth/oauth/google
     */
    async function sendAuthToBackend(payload) {
        if (window.FTF_API && window.FTF_API.auth && window.FTF_API.auth.loginWithGoogle) {
            return await window.FTF_API.auth.loginWithGoogle(payload);
        }

        const backendOrigin = (window.VITE_API_URL !== undefined && window.VITE_API_URL !== '')
            ? window.VITE_API_URL.replace(/\/+$/, '')
            : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

        const raw = await fetch(`${backendOrigin}/api/auth/oauth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return await raw.json();
    }

    /**
     * Complete login flow and persist application state
     */
    function finishSuccessfulLogin(user, token) {
        // Enforce safety: ensure role never accidentally escalates to admin unless already admin in database
        const targetRole = user.role || localStorage.getItem('ftf_pending_role') || 'customer';

        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', targetRole);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('farmToForkUser', JSON.stringify(user));
        if (token) localStorage.setItem('farmToForkToken', token);
        if (user.profilePicture || user.avatar) {
            localStorage.setItem('userAvatar', user.profilePicture || user.avatar);
        }
        if (user.googleId) {
            localStorage.setItem('userGoogleId', user.googleId);
        }
        if (user.firstName) {
            localStorage.setItem('userFirstName', user.firstName);
        }
        if (user.lastName) {
            localStorage.setItem('userLastName', user.lastName);
        }
        localStorage.setItem('authProvider', 'google');

        // Check whether first-time customer profile needs completion
        const isCustomer = (targetRole === 'customer');
        const needsCompletion = isCustomer && (user.isProfileComplete === false);

        if (needsCompletion) {
            showToast(`✅ Welcome, ${user.name}! Please complete your customer profile details.`);
            setTimeout(() => {
                let completeUrl = 'complete-profile.html';
                if (!window.location.pathname.includes('/pages/')) {
                    completeUrl = 'pages/' + completeUrl;
                }
                window.location.href = completeUrl;
            }, 800);
            return;
        }

        showToast(`✅ Welcome, ${user.name}! Signed in successfully with Google.`);
        setTimeout(() => redirectToRoleDashboard(targetRole), 800);
    }

    /**
     * Friendly error handler mapping Google OAuth errors to actionable user feedback
     */
    function handleGoogleAuthError(err, role) {
        resetButtonState();
        const errStr = typeof err === 'string' ? err : (err && (err.type || err.error || err.message)) || '';
        const isHosted = typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

        console.warn('[GoogleAuth] Google Sign-In notice:', err);

        if (errStr.includes('origin_mismatch') || errStr.includes('idpiframe_initialization_failed')) {
            showGoogleOriginGuide();
            return;
        }

        if (errStr.includes('popup_closed') || errStr.includes('cancel') || errStr === 'access_denied') {
            if (isHosted) {
                // On hosted environments (Vercel), show helpful origin guidance in case Google blocked due to origin
                showGoogleOriginGuide();
            } else {
                showUserFriendlyError('Google account selection was closed. Please select an account to sign in.');
            }
            return;
        }

        if (errStr.includes('popup_blocked')) {
            showToast('⚠️ Pop-up was blocked. Redirecting directly to Google Accounts...');
            setTimeout(async () => {
                const url = await getOfficialGoogleAuthUrl(role);
                window.location.href = url;
            }, 800);
            return;
        }

        showUserFriendlyError('Google authentication could not be completed. Please try again.');
    }

    /**
     * Display Google Cloud Console Origin Setup Guide for Vercel & custom domains
     */
    function showGoogleOriginGuide() {
        const errorContainer = document.getElementById('googleAuthErrorNotice');
        if (!errorContainer) return;
        const currentOrigin = window.location.origin;
        const callbackUrl = `${currentOrigin}/pages/oauth-callback.html`;

        errorContainer.innerHTML = `
            <div style="background:#fffbeb; border:1.5px solid #fde68a; border-radius:14px; padding:16px; color:#92400e; font-size:0.86rem; text-align:left; box-shadow:0 4px 12px rgba(0,0,0,0.05); margin-top:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong style="color:#b45309; font-size:0.92rem; display:flex; align-items:center; gap:6px;">
                        <i class="fas fa-shield-alt"></i> Fix Google Error 400 (origin_mismatch)
                    </strong>
                    <button type="button" onclick="document.getElementById('googleAuthErrorNotice').style.display='none'" style="background:none; border:none; font-size:1rem; cursor:pointer; color:#94a3b8;">✕</button>
                </div>
                <p style="margin:0 0 10px; color:#78350f; font-size:0.82rem; line-height:1.45;">
                    Google OAuth requires registering this Vercel domain in your Google Cloud Console. Click the buttons below to copy:
                </p>
                <div style="margin-bottom:8px;">
                    <label style="font-size:0.75rem; font-weight:700; color:#92400e; display:block; margin-bottom:3px;">1. Authorized JavaScript Origin:</label>
                    <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:6px 10px; display:flex; align-items:center; justify-content:space-between; gap:8px;">
                        <code style="font-size:0.8rem; color:#1e293b; font-weight:700; word-break:break-all;">${currentOrigin}</code>
                        <button type="button" onclick="navigator.clipboard.writeText('${currentOrigin}'); this.innerText='Copied!';" style="background:#16a34a; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:0.72rem; font-weight:700; cursor:pointer; flex-shrink:0;">Copy</button>
                    </div>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-size:0.75rem; font-weight:700; color:#92400e; display:block; margin-bottom:3px;">2. Authorized Redirect URI:</label>
                    <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:6px 10px; display:flex; align-items:center; justify-content:space-between; gap:8px;">
                        <code style="font-size:0.8rem; color:#1e293b; font-weight:700; word-break:break-all;">${callbackUrl}</code>
                        <button type="button" onclick="navigator.clipboard.writeText('${callbackUrl}'); this.innerText='Copied!';" style="background:#16a34a; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:0.72rem; font-weight:700; cursor:pointer; flex-shrink:0;">Copy</button>
                    </div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                    <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" style="background:#2563eb; color:white; padding:7px 14px; border-radius:8px; text-decoration:none; font-size:0.78rem; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
                        <i class="fas fa-external-link-alt"></i> Open Google Cloud Console ↗
                    </a>
                </div>
            </div>
        `;
        errorContainer.style.display = 'block';
    }

    /**
     * Display a clean toast message to the user
     */
    function showUserFriendlyError(msg) {
        const errorContainer = document.getElementById('googleAuthErrorNotice');
        if (errorContainer) {
            errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${msg}`;
            errorContainer.style.display = 'block';
            setTimeout(() => { errorContainer.style.display = 'none'; }, 8000);
        } else {
            showToast(`<span style="color:#fca5a5;">⚠️ ${msg}</span>`);
        }
    }

    function showLoadingState(msg) {
        const btn = document.getElementById('btnContinueGoogle') || document.getElementById('btnContinueGoogleReg');
        if (btn) {
            btn.dataset.origHtml = btn.dataset.origHtml || btn.innerHTML;
            btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${msg}</span>`;
            btn.disabled = true;
        }
    }

    function resetButtonState() {
        const btn = document.getElementById('btnContinueGoogle') || document.getElementById('btnContinueGoogleReg');
        if (btn && btn.dataset.origHtml) {
            btn.innerHTML = btn.dataset.origHtml;
            btn.disabled = false;
        }
    }

    function redirectToRoleDashboard(role) {
        let url = 'dashboard-customer.html';
        if (role === 'farmer') url = 'dashboard-farmer.html';
        else if (role === 'artisan') url = 'dashboard-artisan.html';
        else if (role === 'admin') url = 'dashboard-admin.html';

        if (!window.location.pathname.includes('/pages/')) {
            url = 'pages/' + url;
        }
        window.location.href = url;
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#0f172a; color:white; padding:14px 20px; border-radius:12px; font-weight:700; font-size:0.9rem; z-index:999999; box-shadow:0 10px 30px rgba(0,0,0,0.3); border-left:4px solid #22c55e; animation:fadeIn 0.3s ease;';
        toast.innerHTML = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    // Auto-init GIS on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initGIS());
    } else {
        initGIS();
    }

    // Expose global methods
    window.FTF_GoogleAuth = {
        trigger: triggerRealGoogleAuth,
        getClientId: getGoogleClientId,
        getRedirectUri: getRedirectUri,
        getOfficialGoogleAuthUrl: getOfficialGoogleAuthUrl,
        initGIS: initGIS
    };

    window.triggerRealGoogleAuth = triggerRealGoogleAuth;
    window.openOAuthModal = (provider) => triggerRealGoogleAuth();
    window.showGoogleOriginGuide = showGoogleOriginGuide;

})(window);
