// ============================================
// CLIENT-SIDE BACKEND API ADAPTER
// Farm to Fork Collective
// ============================================

(function(window) {
  'use strict';

  // Base URL configuration - Targeting Express backend on localhost or relative /api on Vercel
  const configuredApi = (typeof window !== 'undefined' && typeof window.VITE_API_URL === 'string')
    ? window.VITE_API_URL
    : (typeof importMetaEnv !== 'undefined' ? importMetaEnv.VITE_API_URL : null);

  let BACKEND_BASE = '';
  if (configuredApi !== null && configuredApi !== undefined) {
    BACKEND_BASE = configuredApi;
  } else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    BACKEND_BASE = 'http://localhost:5000';
  } else {
    BACKEND_BASE = '';
  }

  const API_BASE = BACKEND_BASE ? `${BACKEND_BASE.replace(/\/+$/, '')}/api` : '/api';

  // Helper for HTTP requests with error catching
  async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = localStorage.getItem('farmToForkToken');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn(`[FTF_API] Network call to ${endpoint} failed or backend offline:`, err.message);
      return null;
    }
  }

  const FTF_API = {
    baseUrl: API_BASE,

    // AUTH
    auth: {
      async register(formData) {
        const res = await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        if (res && res.success) {
          localStorage.setItem('userName', res.user.name);
          localStorage.setItem('userEmail', res.user.email);
          localStorage.setItem('userRole', res.user.role);
          localStorage.setItem('isLoggedIn', 'true');
          if (res.token) localStorage.setItem('farmToForkToken', res.token);
          localStorage.setItem('farmToForkUser', JSON.stringify(res.user));
          if (res.user.notificationPreferences) {
            localStorage.setItem('userNotificationPreferences', JSON.stringify(res.user.notificationPreferences));
          }
        }
        return res;
      },

      async login(email, password, role) {
        const res = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password, role })
        });
        if (res && res.success) {
          localStorage.setItem('userName', res.user.name);
          localStorage.setItem('userEmail', res.user.email);
          localStorage.setItem('userRole', res.user.role);
          localStorage.setItem('isLoggedIn', 'true');
          if (res.token) localStorage.setItem('farmToForkToken', res.token);
          localStorage.setItem('farmToForkUser', JSON.stringify(res.user));
          if (res.user.notificationPreferences) {
            localStorage.setItem('userNotificationPreferences', JSON.stringify(res.user.notificationPreferences));
          }
        }
        return res;
      },

      async adminLogin(username, password) {
        const res = await request('/auth/admin-login', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
        if (res && res.success) {
          localStorage.setItem('userName', res.user.name || 'Admin');
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('isLoggedIn', 'true');
          if (res.token) localStorage.setItem('farmToForkToken', res.token);
          localStorage.setItem('farmToForkUser', JSON.stringify(res.user));
        }
        return res;
      },

      async loginWithGoogle(oauthData) {
        const res = await request('/auth/oauth/google', {
          method: 'POST',
          body: JSON.stringify(oauthData)
        });
        if (res && res.success) {
          localStorage.setItem('userName', res.user.name);
          localStorage.setItem('userEmail', res.user.email);
          localStorage.setItem('userRole', res.user.role);
          localStorage.setItem('isLoggedIn', 'true');
          if (res.token) localStorage.setItem('farmToForkToken', res.token);
          localStorage.setItem('farmToForkUser', JSON.stringify(res.user));
        }
        return res;
      },

      async loginWithGithub(oauthData) {
        const res = await request('/auth/oauth/github', {
          method: 'POST',
          body: JSON.stringify(oauthData)
        });
        if (res && res.success) {
          localStorage.setItem('userName', res.user.name);
          localStorage.setItem('userEmail', res.user.email);
          localStorage.setItem('userRole', res.user.role);
          localStorage.setItem('isLoggedIn', 'true');
          if (res.token) localStorage.setItem('farmToForkToken', res.token);
          localStorage.setItem('farmToForkUser', JSON.stringify(res.user));
        }
        return res;
      },

      async getOAuthProviders() {
        return await request('/auth/oauth/config');
      },

      async getMe() {
        return await request('/auth/me');
      },

      async forgotPassword(email) {
        return await request('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
      },

      async verifyOtp(email, otp) {
        return await request('/auth/verify-otp', {
          method: 'POST',
          body: JSON.stringify({ email, otp })
        });
      },

      async resetPassword(payload) {
        return await request('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      },

      async getProfile(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = query ? `/auth/profile?${query}` : '/auth/profile';
        return await request(endpoint);
      },

      async completeProfile(profileData) {
        const res = await request('/auth/complete-profile', {
          method: 'POST',
          body: JSON.stringify(profileData)
        });
        if (res && res.success && res.user) {
          if (res.user.name) localStorage.setItem('userName', res.user.name);
          if (res.user.email) localStorage.setItem('userEmail', res.user.email);
          if (res.user.role) localStorage.setItem('userRole', res.user.role);
          localStorage.setItem('farmToForkUser', JSON.stringify(res.user));
          if (res.user.notificationPreferences) {
            localStorage.setItem('userNotificationPreferences', JSON.stringify(res.user.notificationPreferences));
          }
        }
        return res;
      },

      async updateProfile(profileData) {
        const res = await request('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(profileData)
        });
        if (res && res.success && res.user) {
          if (res.user.name) localStorage.setItem('userName', res.user.name);
          if (res.user.email) localStorage.setItem('userEmail', res.user.email);
          if (res.user.role) localStorage.setItem('userRole', res.user.role);
          localStorage.setItem('farmToForkUser', JSON.stringify(res.user));
          if (res.user.notificationPreferences) {
            localStorage.setItem('userNotificationPreferences', JSON.stringify(res.user.notificationPreferences));
          }
        }
        return res;
      },

      logout() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('farmToForkToken');
        localStorage.removeItem('farmToForkUser');
        localStorage.removeItem('userNotificationPreferences');
      }
    },

    // PRODUCTS
    products: {
      async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = query ? `/products?${query}` : '/products';
        return await request(endpoint);
      },

      async getById(id) {
        return await request(`/products/${id}`);
      },

      async create(productData) {
        return await request('/products', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
      },

      async update(id, updateData) {
        return await request(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
      },

      async delete(id) {
        return await request(`/products/${id}`, {
          method: 'DELETE'
        });
      }
    },

    // ORDERS
    orders: {
      async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        const endpoint = query ? `/orders?${query}` : '/orders';
        return await request(endpoint);
      },

      async getById(id) {
        return await request(`/orders/${id}`);
      },

      async create(orderData) {
        return await request('/orders', {
          method: 'POST',
          body: JSON.stringify(orderData)
        });
      },

      async updateStatus(id, status) {
        return await request(`/orders/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        });
      }
    },

    // TRACEABILITY (QR Code Verification & Public Journey)
    traceability: {
      async getTrace(traceabilityId) {
        return await request(`/traceability/${encodeURIComponent(traceabilityId)}`);
      },
      async addEvent(traceabilityId, eventData) {
        return await request(`/traceability/${encodeURIComponent(traceabilityId)}/events`, {
          method: 'POST',
          body: JSON.stringify(eventData)
        });
      }
    },

    // NOTIFICATIONS (Multi-Channel SMS, WhatsApp, Email)
    notifications: {
      async getChannelsStatus() {
        return await request('/notifications/channels');
      },
      async getRecent() {
        return await request('/notifications');
      },
      async testChannel(payload) {
        return await request('/notifications/test', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      },
      async updatePreferences(preferences) {
        return await request('/notifications/preferences', {
          method: 'PUT',
          body: JSON.stringify({ notificationPreferences: preferences })
        });
      }
    },

    // SEED-TO-PLATE JOURNEY
    journey: {
      async getAll() {
        return await request('/journey');
      },

      async getTrace(batchCode) {
        return await request(`/journey/${batchCode}`);
      },

      async uploadStage(stageData) {
        return await request('/journey/stage', {
          method: 'POST',
          body: JSON.stringify(stageData)
        });
      },

      async generateQr(data) {
        return await request('/journey/generate-qr', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
    },

    // ADMIN
    admin: {
      async getStats() {
        return await request('/admin/stats');
      },

      async getUsers(role = '') {
        const query = role ? `?role=${role}` : '';
        return await request(`/admin/users${query}`);
      },

      async getCertifications() {
        return await request('/admin/certifications');
      },

      async approveCert(id) {
        return await request(`/admin/certifications/${id}/approve`, {
          method: 'POST'
        });
      }
    },

    // COMMUNITY
    community: {
      async getGroupBuys() {
        return await request('/community/group-buys');
      },

      async joinGroupBuy(id, quantity, userName) {
        return await request(`/community/group-buys/${id}/join`, {
          method: 'POST',
          body: JSON.stringify({ quantity, userName })
        });
      },

      async getKitchens() {
        return await request('/community/kitchens');
      },

      async createKitchen(kitchenData) {
        return await request('/community/kitchens', {
          method: 'POST',
          body: JSON.stringify(kitchenData)
        });
      },

      async donate(data) {
        return await request('/community/donations', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      },

      async submitReview(data) {
        return await request('/community/reviews', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      },

      async submitContact(data) {
        return await request('/community/contact', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
    },

    // CONTACT
    contact: {
      async sendMessage(data) {
        return await request('/community/contact', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
    },

    // ADMIN EMAIL DIAGNOSTICS
    admin: {
      async getEmailStatus() {
        return await request('/admin/email-status');
      },
      async testEmail(to) {
        return await request('/admin/test-email', {
          method: 'POST',
          body: JSON.stringify({ to })
        });
      }
    }
  };

  // Expose globally
  window.FTF_API = FTF_API;
})(window);
