import React, { useEffect, useState, useRef } from 'react';

/**
 * GoogleSignInButton Component for Farm to Fork Collective (Vite + React)
 * 
 * Features:
 * - Uses import.meta.env.VITE_GOOGLE_CLIENT_ID
 * - Integrates official Google Identity Services (GIS)
 * - Account chooser with prompt: 'select_account'
 * - Secure backend verification via /api/auth/oauth/google
 * - Comprehensive user-friendly error handling
 */
export default function GoogleSignInButton({ 
  role = 'customer', 
  onSuccess, 
  onError,
  className = '',
  buttonText = 'Sign in with Google'
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const tokenClientRef = useRef(null);

  // Read Google Client ID strictly from frontend environment variable
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '939090047671-otlai1n75lvc9mgass18jd721dpp8f36.apps.googleusercontent.com';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // 1. Ensure Google Identity Services script is available
    if (!window.google || !window.google.accounts) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGIS;
      document.head.appendChild(script);
    } else {
      initializeGIS();
    }

    function initializeGIS() {
      if (!window.google?.accounts?.oauth2) return;

      try {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              await verifyAndLogin(tokenResponse.access_token);
            } else if (tokenResponse?.error) {
              handleError(tokenResponse.error);
            }
          },
          error_callback: (err) => {
            handleError(err);
          }
        });
      } catch (err) {
        console.warn('[GoogleSignInButton] Failed to initialize Google Token Client:', err);
      }
    }
  }, [clientId]);

  const verifyAndLogin = async (accessToken) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiUrl}/api/auth/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, role })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Persist session locally
        localStorage.setItem('farmToForkUser', JSON.stringify(data.user));
        localStorage.setItem('farmToForkToken', data.token);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userRole', data.user.role || role);
        localStorage.setItem('isLoggedIn', 'true');

        if (onSuccess) {
          onSuccess(data);
        } else {
          // Check if customer profile is incomplete
          if (data.user.role === 'customer' && data.user.isProfileComplete === false) {
            window.location.href = '/pages/complete-profile.html';
          } else {
            const target = data.user.role === 'farmer' ? '/pages/dashboard-farmer.html' :
                           data.user.role === 'artisan' ? '/pages/dashboard-artisan.html' :
                           data.user.role === 'admin' ? '/pages/dashboard-admin.html' :
                           '/pages/dashboard-customer.html';
            window.location.href = target;
          }
        }
      } else {
        const msg = data.message || 'Google authentication failed on server.';
        setErrorMessage(msg);
        if (onError) onError(msg);
      }
    } catch (err) {
      const msg = 'Unable to connect to authentication server. Please check your network connection.';
      setErrorMessage(msg);
      if (onError) onError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    setIsLoading(false);
    const errText = typeof error === 'string' ? error : (error?.type || error?.error || 'authentication_error');

    let friendlyMsg = 'An error occurred during Google Sign-In.';
    if (errText.includes('popup_closed') || errText.includes('cancel')) {
      friendlyMsg = 'Google sign-in was cancelled. Please choose an account to proceed.';
    } else if (errText.includes('popup_blocked')) {
      friendlyMsg = 'Your browser blocked the popup. Please allow popups for localhost.';
    } else if (errText.includes('origin_mismatch')) {
      friendlyMsg = 'Google Cloud origin mismatch: Please add http://localhost:5173 to Authorized JavaScript origins in Google Cloud Console.';
    }

    setErrorMessage(friendlyMsg);
    if (onError) onError(friendlyMsg);
  };

  const handleSignInClick = () => {
    setErrorMessage(null);

    // Enforce Google Authorized JavaScript origin during local development
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalHost) {
      if (window.location.hostname === '127.0.0.1' && window.location.port === '5173') {
        window.location.replace(window.location.href.replace('127.0.0.1:5173', 'localhost:5173'));
        return;
      }
      if (window.location.port === '5000') {
        console.warn('[GoogleSignInButton] Redirecting to dev frontend port 5173');
        window.location.href = 'http://localhost:5173' + window.location.pathname + window.location.search;
        return;
      }
    }

    if (!clientId) {
      setErrorMessage('Google Client ID is not configured in .env (VITE_GOOGLE_CLIENT_ID).');
      return;
    }

    if (tokenClientRef.current) {
      setIsLoading(true);
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } else if (window.FTF_GoogleAuth?.trigger) {
      window.FTF_GoogleAuth.trigger(role);
    } else {
      setErrorMessage('Google Identity Services is still loading. Please try again in a moment.');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <button
        type="button"
        id="btnGoogleSignInReact"
        onClick={handleSignInClick}
        disabled={isLoading}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          height: '46px',
          padding: '0 20px',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          border: '1.5px solid #cbd5e1',
          borderRadius: '12px',
          fontSize: '0.94rem',
          fontWeight: 700,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box'
        }}
      >
        {isLoading ? (
          <>
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
            </svg>
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div style={{
          marginTop: '10px',
          padding: '10px 14px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '0.84rem',
          lineHeight: '1.4'
        }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
