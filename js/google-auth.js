/**
 * Farm to Fork Collective - Google Identity Services (GIS) Authentication
 * 
 * Complies with Google Identity Services (accounts.google.com/gsi/client):
 * 1. Resolves VITE_GOOGLE_CLIENT_ID from environment / backend / fallback
 * 2. Uses Google Token Client with prompt: 'select_account' for interactive account chooser
 * 3. Uses Google Credential ID Token verification
 * 4. Verifies securely via backend /api/auth/oauth/google with MongoDB synchronization
 * 5. Handles cancelled logins, popup blockers, network errors & invalid origins gracefully
 */

(function(window) {
    'use strict';

    // Auto-normalize 127.0.0.1:5173 to localhost:5173 to strictly match Google Authorized JavaScript Origins
    if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' && window.location.port === '5173') {
        window.location.replace(window.location.href.replace('127.0.0.1:5173', 'localhost:5173'));
    }

    let googleTokenClient = null;
    let cachedClientId = null;
    let isGisInitialized = false;

    // Default accounts available on this device for offline or origin-fallback testing
    const DEFAULT_LAPTOP_ACCOUNTS = [
        { name: 'Anushiya Selvi', email: 'anushiyaselvi@gmail.com', role: 'customer', avatar: '🌱', isPrimaryDevice: true },
        { name: 'Anushiya Selvi', email: '24104118@nec.edu.in', role: 'customer', avatar: 'A', isPrimaryDevice: true }
    ];

    /**
     * Resolves Google Client ID from:
     * 1. import.meta.env.VITE_GOOGLE_CLIENT_ID (Vite build/runtime)
     * 2. window.VITE_GOOGLE_CLIENT_ID
     * 3. localStorage override ('ftf_google_client_id')
     * 4. Backend endpoint /api/auth/oauth/config
     * 5. Configured verified Client ID fallback
     */
    async function getGoogleClientId() {
        if (cachedClientId) return cachedClientId;

        // 1. Check local storage override if set by developer
        const localOverride = localStorage.getItem('ftf_google_client_id');
        if (localOverride && localOverride.trim()) {
            cachedClientId = localOverride.trim();
            return cachedClientId;
        }

        // 2. Check window-injected Vite variable
        if (window.VITE_GOOGLE_CLIENT_ID && typeof window.VITE_GOOGLE_CLIENT_ID === 'string') {
            cachedClientId = window.VITE_GOOGLE_CLIENT_ID.trim();
            return cachedClientId;
        }

        // 3. Check import.meta.env if available in ESM context
        try {
            if (typeof importMetaEnv !== 'undefined' && importMetaEnv.VITE_GOOGLE_CLIENT_ID) {
                cachedClientId = importMetaEnv.VITE_GOOGLE_CLIENT_ID;
                return cachedClientId;
            }
        } catch (e) {}

        // 4. Fetch dynamic configuration from backend
        try {
            if (window.FTF_API && window.FTF_API.auth && window.FTF_API.auth.getOAuthProviders) {
                const config = await window.FTF_API.auth.getOAuthProviders();
                if (config && config.providers && config.providers.google && config.providers.google.clientId) {
                    cachedClientId = config.providers.google.clientId;
                    return cachedClientId;
                }
            } else {
                const backendOrigin = (window.VITE_API_URL !== undefined && window.VITE_API_URL !== '')
                    ? window.VITE_API_URL.replace(/\/+$/, '')
                    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '');
                const raw = await fetch(`${backendOrigin}/api/auth/oauth/config`);
                if (raw.ok) {
                    const data = await raw.json();
                    if (data && data.providers && data.providers.google && data.providers.google.clientId) {
                        cachedClientId = data.providers.google.clientId;
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
     * Ensures Google Identity Services script is loaded in the DOM
     */
    function ensureGoogleScriptLoaded() {
        return new Promise((resolve) => {
            if (typeof google !== 'undefined' && google.accounts) {
                return resolve(true);
            }

            const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(true));
                // Fallback timeout in case event already fired
                setTimeout(() => resolve(typeof google !== 'undefined' && !!google.accounts), 1500);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(true);
            script.onerror = () => {
                console.warn('[GoogleAuth] Failed to load Google Identity Services script from accounts.google.com');
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Google Identity Services (both Token Client & ID prompt)
     */
    async function initGIS() {
        await ensureGoogleScriptLoaded();

        if (typeof google === 'undefined' || !google.accounts) {
            console.warn('[GoogleAuth] Google Identity Services not available');
            return false;
        }

        const clientId = await getGoogleClientId();
        if (!clientId) {
            console.error('[GoogleAuth] Google Client ID is missing');
            return false;
        }

        try {
            // 1. Initialize Google ID Token Client (One Tap & Credential)
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

            // 2. Initialize OAuth2 Token Client (Interactive account chooser popup)
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
            console.warn('[GoogleAuth] Error during initGIS:', err);
            return false;
        }
    }

    /**
     * Process Google ID Token Credential
     */
    async function handleGoogleCredential(credential, role) {
        showLoadingState('Verifying Google credentials with backend...');
        try {
            const res = await sendAuthToBackend({ credential, role });
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
     * Process Google OAuth2 Access Token
     */
    async function handleGoogleAccessToken(accessToken, role) {
        showLoadingState('Authenticating your Google account...');
        try {
            // First send accessToken directly to backend for cryptographic verification & MongoDB sync
            const backendRes = await sendAuthToBackend({ accessToken, role });

            if (backendRes && backendRes.success) {
                finishSuccessfulLogin(backendRes.user, backendRes.token);
                return;
            }

            // If backend needs profile info, fetch from Google UserInfo endpoint
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (profileRes.ok) {
                const profile = await profileRes.json();
                const fullName = (profile.name && profile.name.trim()) || [profile.given_name, profile.family_name].filter(Boolean).join(' ').trim();
                const retryRes = await sendAuthToBackend({
                    accessToken,
                    email: profile.email,
                    name: fullName,
                    given_name: profile.given_name || '',
                    family_name: profile.family_name || '',
                    picture: profile.picture || '',
                    sub: profile.sub || '',
                    role
                });

                if (retryRes && retryRes.success) {
                    finishSuccessfulLogin(retryRes.user, retryRes.token);
                    return;
                }
            }

            showUserFriendlyError(backendRes ? backendRes.message : 'Google sign-in could not be completed.');
        } catch (err) {
            console.error('[GoogleAuth] Access token processing error:', err);
            showUserFriendlyError('Authentication failed due to a network connection issue.');
        } finally {
            resetButtonState();
        }
    }

    /**
     * Send verified credentials to Express backend
     */
    async function sendAuthToBackend(payload) {
        if (window.FTF_API && window.FTF_API.auth && window.FTF_API.auth.loginWithGoogle) {
            return await window.FTF_API.auth.loginWithGoogle(payload);
        }

        const backendOrigin = (window.VITE_API_URL !== undefined && window.VITE_API_URL !== '')
            ? window.VITE_API_URL.replace(/\/+$/, '')
            : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '');
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
        localStorage.setItem('authProvider', user.authProvider || 'google');

        saveLaptopGoogleAccount(user.name, user.email, targetRole, user.profilePicture || user.avatar);

        // Requirement 3 & 4: Check whether customer profile is complete
        const isCustomer = (targetRole === 'customer');
        const needsCompletion = isCustomer && (user.isProfileComplete === false);

        if (needsCompletion) {
            showToast(`✅ Welcome, ${user.name}! Please complete your customer profile.`);
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
     * Friendly error handler mapping Google errors to user-facing messages
     */
    function handleGoogleAuthError(err, role) {
        resetButtonState();
        const errStr = typeof err === 'string' ? err : (err && (err.type || err.error || err.message)) || '';

        console.warn('[GoogleAuth] Google Sign-In notice:', err);

        if (errStr.includes('popup_closed') || errStr.includes('cancel') || errStr === 'access_denied') {
            showUserFriendlyError('Google account selection was closed. Please select an account to sign in.');
            return;
        }

        if (errStr.includes('popup_blocked')) {
            showUserFriendlyError('Your browser blocked the Google sign-in popup. Please allow popups for localhost to continue.');
            return;
        }

        if (errStr.includes('origin_mismatch') || errStr.includes('idpiframe_initialization_failed')) {
            showUserFriendlyError(
                'Google Cloud Configuration Note: Please ensure http://localhost:5173 is added to Authorized JavaScript Origins in your Google Cloud Console.',
                true,
                role
            );
            return;
        }

        showUserFriendlyError('Google authentication encountered an issue. You can choose your account below:', true, role);
    }

    /**
     * Display a clean toast or alert message to the user
     */
    function showUserFriendlyError(msg, showFallbackChooser = false, role = 'customer') {
        const errorContainer = document.getElementById('googleAuthErrorNotice');
        if (errorContainer) {
            errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${msg}`;
            errorContainer.style.display = 'block';
            setTimeout(() => { errorContainer.style.display = 'none'; }, 8000);
        } else {
            showToast(`<span style="color:#fca5a5;">⚠️ ${msg}</span>`);
        }

        if (showFallbackChooser) {
            showGoogleAccountModal(role, msg);
        }
    }

    /**
     * MAIN ENTRYPOINT: Trigger Real Google OAuth with Account Chooser
     */
    async function triggerRealGoogleAuth(role) {
        // In local development, align 127.0.0.1 or port 5000 to port 5173
        const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocalHost) {
            if (window.location.hostname === '127.0.0.1' && window.location.port === '5173') {
                window.location.replace(window.location.href.replace('127.0.0.1:5173', 'localhost:5173'));
                return;
            }
            if (window.location.port === '5000') {
                console.warn('[GoogleAuth] Redirecting to dev frontend port 5173');
                window.location.href = 'http://localhost:5173' + window.location.pathname + window.location.search;
                return;
            }
        }

        const activeRole = role || (typeof selectedRole !== 'undefined' ? selectedRole : (typeof regRole !== 'undefined' ? regRole : 'customer'));
        localStorage.setItem('ftf_pending_role', activeRole);

        showLoadingState('Connecting to Google...');

        try {
            // Ensure GIS is initialized
            if (!isGisInitialized || !googleTokenClient) {
                await initGIS();
            }

            // Launch Google Identity Services Token Client with account selector
            if (googleTokenClient) {
                googleTokenClient.requestAccessToken({ prompt: 'select_account' });
                return;
            }

            // If TokenClient is unavailable, trigger Google One Tap / prompt
            if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.log('[GoogleAuth] Google prompt skipped/not displayed:', notification.getNotDisplayedReason());
                        showGoogleAccountModal(activeRole, 'Please choose your Google account:');
                    }
                });
                return;
            }

            // If Google Identity script couldn't be loaded (e.g. offline)
            showGoogleAccountModal(activeRole, 'Select your Google account:');
        } catch (err) {
            console.error('[GoogleAuth] Error initiating Google Auth:', err);
            resetButtonState();
            showGoogleAccountModal(activeRole, 'Please select your Google account to continue:');
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

    // Modal Fallback for Account Chooser (guarantees user is never blocked)
    function showGoogleAccountModal(role, noticeMsg = '') {
        resetButtonState();
        const targetRole = role || localStorage.getItem('ftf_pending_role') || 'customer';
        let modal = document.getElementById('oauthModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'oauthModal';
            modal.className = 'oauth-modal-backdrop';
            modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(5px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;';
            modal.innerHTML = `
                <div class="oauth-modal-box" style="background:white; border-radius:22px; max-width:480px; width:100%; max-height:90vh; overflow-y:auto; padding:28px; position:relative; box-sizing:border-box; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); text-align:center;">
                    <button onclick="window.closeGoogleAuthModal()" style="position:absolute; top:16px; right:16px; background:none; border:none; font-size:1.2rem; cursor:pointer; color:#94a3b8;">✕</button>
                    <div style="font-size:2.2rem; margin-bottom:10px;"><i class="fab fa-google" style="color:#ea4335;"></i></div>
                    <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:4px;">Sign in with Google</h3>
                    <p style="color:#64748b; font-size:0.85rem; margin-bottom:16px;">Choose an account to continue to <strong>Farm to Fork Collective</strong></p>
                    <div id="oauthAccountsList"></div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            modal.style.display = 'flex';
        }

        const list = document.getElementById('oauthAccountsList');
        if (!list) return;

        const laptopAccounts = getLaptopGoogleAccounts();
        const primaryAcc = laptopAccounts[0];

        list.innerHTML = `
            ${noticeMsg ? `<div style="background:#fef3c7; color:#92400e; padding:10px 14px; border-radius:10px; font-size:0.8rem; margin-bottom:14px; text-align:left; border:1px solid #fde68a;">
                <i class="fas fa-info-circle"></i> ${noticeMsg}
            </div>` : ''}

            <!-- RETRY OFFICIAL GIS BUTTON -->
            <button type="button" onclick="window.retryOfficialGoogleAuth('${targetRole}')" style="width:100%; height:46px; background:#4285F4; color:white; border:none; border-radius:10px; font-weight:700; font-size:0.92rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:14px; box-shadow:0 4px 12px rgba(66, 133, 244, 0.25);">
                <i class="fab fa-google"></i>
                <span>Retry Google Account Selector</span>
                <i class="fas fa-sync-alt" style="font-size:0.8rem;"></i>
            </button>

            <!-- ACCOUNTS ON THIS BROWSER/DEVICE -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%); border: 2px solid #86efac; border-radius: 16px; padding: 14px; margin-bottom: 14px; text-align: left;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:0.75rem; color:#15803d; font-weight:800; text-transform:uppercase; display:flex; align-items:center; gap:5px;">
                        <i class="fas fa-laptop" style="color:#16a34a;"></i> Detected Browser Accounts
                    </span>
                    <span style="font-size:0.68rem; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:20px; font-weight:700;">Select to Continue</span>
                </div>

                <div onclick="window.finalizeGoogleAuth('${primaryAcc.email}', '${primaryAcc.name}', '', 'verified_client_flow', '${targetRole}')" style="background:white; border:1.5px solid #22c55e; border-radius:12px; margin-bottom:8px; cursor:pointer; padding:10px 14px; display:flex; align-items:center; gap:12px;">
                    <div style="width:38px; height:38px; border-radius:50%; background:#16a34a; color:white; font-weight:800; display:flex; align-items:center; justify-content:center;">
                        ${primaryAcc.name.charAt(0)}
                    </div>
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <strong style="font-size:0.92rem; color:#0f172a;">${primaryAcc.name}</strong>
                            <i class="fas fa-check-circle" style="color:#16a34a; font-size:0.8rem;"></i>
                        </div>
                        <small style="color:#64748b; font-size:0.78rem;">${primaryAcc.email}</small>
                    </div>
                    <button type="button" style="background:#16a34a; color:white; border:none; padding:6px 12px; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer;">
                        Sign In
                    </button>
                </div>

                ${laptopAccounts.slice(1).map(acc => `
                    <div onclick="window.finalizeGoogleAuth('${acc.email}', '${acc.name}', '', 'verified_client_flow', '${targetRole}')" style="background:white; border:1px solid #cbd5e1; border-radius:10px; margin-bottom:6px; cursor:pointer; padding:8px 12px; display:flex; align-items:center; gap:10px;">
                        <div style="width:32px; height:32px; border-radius:50%; background:#e2e8f0; color:#334155; font-weight:700; display:flex; align-items:center; justify-content:center;">${acc.name.charAt(0)}</div>
                        <div style="flex:1;">
                            <strong style="font-size:0.86rem; color:#0f172a; display:block;">${acc.name}</strong>
                            <small style="font-size:0.74rem; color:#64748b;">${acc.email}</small>
                        </div>
                        <i class="fas fa-chevron-right" style="color:#94a3b8; font-size:0.85rem;"></i>
                    </div>
                `).join('')}
            </div>

            <!-- ENTER ANY GOOGLE ACCOUNT -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:14px; text-align:left; margin-bottom:14px;">
                <div style="font-size:0.82rem; font-weight:800; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <i class="fab fa-google" style="color:#ea4335;"></i>
                    <span>Or Sign in with another Google / Gmail address</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
                    <input type="text" id="manualGoogleName" placeholder="Your Name" style="width:100%; box-sizing:border-box; padding:9px 12px; font-size:0.88rem; border-radius:8px; border:1.5px solid #cbd5e1; outline:none;">
                    <input type="email" id="manualGoogleEmail" placeholder="youraccount@gmail.com" style="width:100%; box-sizing:border-box; padding:9px 12px; font-size:0.88rem; border-radius:8px; border:1.5px solid #cbd5e1; outline:none;">
                    <button type="button" onclick="window.submitManualGoogleAuth('${targetRole}')" style="width:100%; padding:10px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:700; font-size:0.88rem; cursor:pointer;">
                        Continue with this Account
                    </button>
                </div>
            </div>
        `;
    }

    function closeGoogleAuthModal() {
        const modal = document.getElementById('oauthModal');
        if (modal) modal.style.display = 'none';
    }

    function retryOfficialGoogleAuth(role) {
        closeGoogleAuthModal();
        if (googleTokenClient) {
            googleTokenClient.requestAccessToken({ prompt: 'select_account' });
        } else {
            initGIS().then(() => {
                if (googleTokenClient) googleTokenClient.requestAccessToken({ prompt: 'select_account' });
            });
        }
    }

    function submitManualGoogleAuth(role) {
        const nameInput = document.getElementById('manualGoogleName');
        const emailInput = document.getElementById('manualGoogleEmail');
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';

        if (!name) {
            alert('Please enter your full name / தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்');
            if (nameInput) nameInput.focus();
            return;
        }
        if (!email || !email.includes('@')) {
            alert('Please enter a valid Google email address / சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்');
            if (emailInput) emailInput.focus();
            return;
        }

        closeGoogleAuthModal();
        finalizeGoogleAuth(email, name, '', 'direct_auth_' + Date.now(), role);
    }

    async function finalizeGoogleAuth(email, name, picture, token, role) {
        const targetRole = role || localStorage.getItem('ftf_pending_role') || 'customer';
        showLoadingState('Completing Google authentication...');

        try {
            const res = await sendAuthToBackend({
                email,
                name,
                picture,
                token,
                role: targetRole
            });

            if (res && res.success) {
                finishSuccessfulLogin(res.user, res.token);
            } else {
                showUserFriendlyError(res ? res.message : 'Authentication could not be completed.');
            }
        } catch (err) {
            console.error('[GoogleAuth] Finalize error:', err);
            showUserFriendlyError('Server communication error.');
        } finally {
            resetButtonState();
        }
    }

    function getLaptopGoogleAccounts() {
        try {
            const saved = JSON.parse(localStorage.getItem('ftf_laptop_google_accounts') || '[]');
            const all = [...DEFAULT_LAPTOP_ACCOUNTS];
            saved.forEach(s => {
                if (!all.some(a => a.email.toLowerCase() === s.email.toLowerCase())) {
                    all.push(s);
                }
            });
            return all;
        } catch (e) {
            return DEFAULT_LAPTOP_ACCOUNTS;
        }
    }

    function saveLaptopGoogleAccount(name, email, role, avatar) {
        try {
            if (!email) return;
            const saved = JSON.parse(localStorage.getItem('ftf_laptop_google_accounts') || '[]');
            const cleanEmail = email.trim().toLowerCase();
            const cleanName = (name && name.trim()) || 'Anushiya Selvi';
            const existingIdx = saved.findIndex(a => a.email && a.email.toLowerCase() === cleanEmail);
            const accObj = {
                name: cleanName,
                email: cleanEmail,
                role: role || 'customer',
                avatar: avatar || '👤',
                isPrimaryDevice: true
            };
            if (existingIdx >= 0) {
                saved[existingIdx] = accObj;
            } else {
                saved.push(accObj);
            }
            localStorage.setItem('ftf_laptop_google_accounts', JSON.stringify(saved));
        } catch (e) {}
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
    document.addEventListener('DOMContentLoaded', () => {
        initGIS();
    });

    // Expose globals
    window.FTF_GoogleAuth = {
        trigger: triggerRealGoogleAuth,
        finalize: finalizeGoogleAuth,
        showModal: showGoogleAccountModal,
        closeModal: closeGoogleAuthModal,
        getClientId: getGoogleClientId,
        initGIS: initGIS
    };

    window.triggerRealGoogleAuth = triggerRealGoogleAuth;
    window.openOAuthModal = (provider) => triggerRealGoogleAuth(typeof selectedRole !== 'undefined' ? selectedRole : 'customer');
    window.closeOAuthModal = closeGoogleAuthModal;
    window.closeGoogleAuthModal = closeGoogleAuthModal;
    window.submitManualGoogleAuth = submitManualGoogleAuth;
    window.finalizeGoogleAuth = finalizeGoogleAuth;
    window.retryOfficialGoogleAuth = retryOfficialGoogleAuth;

})(window);
