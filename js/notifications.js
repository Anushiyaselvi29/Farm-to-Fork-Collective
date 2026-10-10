// ============================================
// SMART ROLE-BASED NOTIFICATION & SMS ENGINE
// Farm to Fork Collective
// Role-based notification system for Customers, Farmers, and Artisans
// Includes SMS phone alerts, wishlist monitoring, category filters, and live push toasts
// ============================================

const REGISTERED_PHONES = {
    customer: '+91 93425 21414', // Default registered phone (Anushiya Selvi / Priya)
    farmer: '+91 98401 23456',   // Farmer Sundaram Perumal (Dindigul)
    artisan: '+91 98402 34567',  // Artisan Kavitha Natarajan (Handcrafted Soaps & Honey)
    admin: '+91 98400 11223',
    common: '+91 1800 425 1800'  // Collective Platform Helpline & Broadcast Gateway
};

const DEFAULT_SMART_NOTIFICATIONS = {
    // ----------------------------------------------------
    // COMMON / PLATFORM-WIDE NOTIFICATIONS (Public & Home)
    // ----------------------------------------------------
    common: [
        {
            id: 'notif-com-1',
            type: 'offers',
            category: 'offers',
            title: '🌾 Welcome to Farm to Fork Collective!',
            message: 'Direct from 40+ certified organic Tamil Nadu farmers. 100% pesticide-free guarantee with transparent 7-stage seed-to-plate QR traceability.',
            time: '10 mins ago',
            read: false,
            actionUrl: 'products.html',
            actionText: 'Browse Organic Store',
            smsText: '[FTF-COMMUNITY] Welcome to Farm to Fork Collective! Discover 34+ certified organic farm produce with end-to-end QR traceability.'
        },
        {
            id: 'notif-com-2',
            type: 'offers',
            category: 'offers',
            title: '🎉 Harvest Special: 20% OFF Coupon',
            message: 'Use promo code "ORGANIC20" during checkout to unlock flat 20% savings on farm-fresh organic vegetables, greens & native fruits!',
            time: '1 hour ago',
            read: false,
            actionUrl: 'products.html',
            actionText: 'Use Coupon ORGANIC20',
            smsText: '[FTF-PROMO] Harvest Special! Get flat 20% OFF on all organic produce with coupon ORGANIC20. Shop now: https://farmtofork.in'
        },
        {
            id: 'notif-com-3',
            type: 'orders',
            category: 'orders',
            title: '🚚 Express Cold-Chain Logistics Active',
            message: 'Same-day cold-chain electric van dispatches active across Tamil Nadu zones. Temperature monitored at 4°C for farm-fresh crispness.',
            time: '3 hours ago',
            read: false,
            actionUrl: 'seed-to-plate.html',
            actionText: 'Track Cold-Chain',
            smsText: '[FTF-LOGISTICS] 4°C temperature-controlled electric vehicles ensure farm freshness from harvest to your doorstep.'
        },
        {
            id: 'notif-com-4',
            type: 'reviews',
            category: 'reviews',
            title: '🌱 Eco Milestone: 1,030 km Food Miles Saved!',
            message: 'Together our community prevented 176 kg of carbon emissions this month by eliminating wholesale broker transit loops.',
            time: '5 hours ago',
            read: true,
            actionUrl: 'community-kitchen.html',
            actionText: 'View Impact Report',
            smsText: '[FTF-IMPACT] Eco Milestone: 1,030 km food miles saved, 176 kg CO2 prevented by direct farm-to-consumer delivery!'
        },
        {
            id: 'notif-com-5',
            type: 'offers',
            category: 'offers',
            title: '🤝 Neighborhood Wholesale Group Buying Open',
            message: 'Pool bulk produce orders with neighbors in your apartment or street to unlock up to 35% tier discounts directly from source farms.',
            time: 'Yesterday',
            read: true,
            actionUrl: 'group-buying.html',
            actionText: 'Join Group Buying Pool',
            smsText: '[FTF-COMMUNITY] Group Buying Active: Team up with neighbors to unlock 35% wholesale farm discounts.'
        }
    ],

    // ----------------------------------------------------
    // CUSTOMER NOTIFICATIONS
    // ----------------------------------------------------
    customer: [
        {
            id: 'notif-c-1',
            type: 'offers',
            category: 'offers',
            title: '🏷️ Wishlist Price Drop: Organic Tomatoes',
            message: 'Good news! Organic Tomatoes from Sundaram Farm dropped from ₹80 to ₹60/kg (25% OFF). Limited stock available today!',
            time: '12 mins ago',
            read: false,
            actionUrl: 'product-details.html?id=1',
            actionText: 'Shop at ₹60/kg',
            smsText: '[FTF-ALERTS] Price Drop Alert! Organic Tomatoes on your wishlist is now ₹60/kg (was ₹80). Order now: https://farmtofork.in/p/1'
        },
        {
            id: 'notif-c-2',
            type: 'stock',
            category: 'stock',
            title: '🔔 Back in Stock: Organic Strawberries',
            message: 'Your wishlist item "Organic Strawberries" from Mahabaleshwar is back in stock! 30 freshly harvested boxes just listed.',
            time: '45 mins ago',
            read: false,
            actionUrl: 'products.html?category=fruits',
            actionText: 'View Fresh Harvest',
            smsText: '[FTF-ALERTS] Restock Alert: Organic Strawberries from your wishlist is back in stock! 30 boxes freshly listed. Order before sold out.'
        },
        {
            id: 'notif-c-3',
            type: 'orders',
            category: 'orders',
            title: '🚚 Order #FTF-2024-001 Dispatched Under Cold-Chain',
            message: 'Your morning organic basket has been packed and handed over to 4°C temperature-controlled electric van. Expected delivery: Today by 5:30 PM.',
            time: '2 hours ago',
            read: false,
            actionUrl: 'seed-to-plate.html?batch=FTF-TOM-2024-001',
            actionText: 'Live GPS Trace',
            smsText: '[FTF-ALERTS] Order #FTF-2024-001 is out for delivery! Electric van dispatched from Dindigul under 4°C cold-chain. OTP: 4892.'
        },
        {
            id: 'notif-c-4',
            type: 'offers',
            category: 'offers',
            title: '🎉 Harvest Festival Discount: 20% OFF',
            message: 'Apply promo code "ORGANIC20" during checkout to unlock 20% flat discount on all farm-fresh vegetables and fruits!',
            time: '5 hours ago',
            read: true,
            actionUrl: 'products.html',
            actionText: 'Use Code ORGANIC20',
            smsText: '[FTF-ALERTS] Harvest Festival Celebration! Get 20% OFF on all organic produce with coupon ORGANIC20. Shop: https://farmtofork.in'
        },
        {
            id: 'notif-c-5',
            type: 'orders',
            category: 'orders',
            title: '✅ Order #FTF-2024-001 Delivered Successfully',
            message: 'Your organic delivery was handed over fresh. How was the quality? Leave a quick review to support Farmer Sundaram directly.',
            time: 'Yesterday',
            read: true,
            actionUrl: 'dashboard-customer.html#orders',
            actionText: 'Rate Produce',
            smsText: '[FTF-ALERTS] Order #FTF-2024-001 delivered! Thank you for supporting native smallholder farmers. Rate your produce on app.'
        }
    ],

    // ----------------------------------------------------
    // FARMER NOTIFICATIONS
    // ----------------------------------------------------
    farmer: [
        {
            id: 'notif-f-1',
            type: 'orders',
            category: 'orders',
            title: '📦 New Order Received #FTF-2024-092',
            message: 'Priya Sharma (Chennai) placed an order for 5kg Organic Tomatoes & 2 bunches Organic Spinach. Morning dispatch scheduled.',
            time: '8 mins ago',
            read: false,
            actionUrl: 'dashboard-farmer.html#ordersModal',
            actionText: 'View Order Details',
            smsText: '[FTF-KISSAN] Vanakkam Sundaram! New Order #FTF-2024-092 received: 5kg Tomatoes + 2 bunches Spinach from Priya Sharma. Prep morning batch.'
        },
        {
            id: 'notif-f-2',
            type: 'payments',
            category: 'payments',
            title: '💳 Payment Received: ₹380.00 Credited',
            message: 'Customer payment for Order #FTF-2024-092 has been settled via UPI Instant Pay directly into your linked Canara Bank account.',
            time: '9 mins ago',
            read: false,
            actionUrl: 'dashboard-farmer.html',
            actionText: 'View Statement',
            smsText: '[FTF-PAY] ₹380.00 credited to your Canara Bank A/c ending 4821 for Order #FTF-2024-092. Zero platform deduction.'
        },
        {
            id: 'notif-f-3',
            type: 'stock',
            category: 'stock',
            title: '⚠️ Low Stock Alert: Organic Spinach (< 10 left)',
            message: 'Only 8 bunches remaining in your listed inventory. 14 customers currently have this in their active carts. Update stock now.',
            time: '25 mins ago',
            read: false,
            actionUrl: 'dashboard-farmer.html#farmerProductList',
            actionText: 'Restock Crop',
            smsText: '[FTF-STOCK] Alert: Your listed stock for Organic Spinach is critically low (8 bunches left). Update harvest quantity to avoid order loss.'
        },
        {
            id: 'notif-f-4',
            type: 'reviews',
            category: 'reviews',
            title: '❤️ Customer Followed Your Farm',
            message: 'Ananya Krishnan added "Green Valley Organic Farm" to her favorite farms list. She will receive alerts whenever you list fresh harvests.',
            time: '1 hour ago',
            read: true,
            actionUrl: 'dashboard-farmer.html',
            actionText: 'View Followers',
            smsText: '[FTF-KISSAN] Great news! A new customer (Ananya K.) has followed your farm profile. Total farm followers: 142.'
        },
        {
            id: 'notif-f-5',
            type: 'reviews',
            category: 'reviews',
            title: '⭐ New 5-Star Review on Organic Tomatoes',
            message: '"Freshest heirloom tomatoes in Chennai! The aroma is just like the village gardens from my childhood." — Priya S.',
            time: '3 hours ago',
            read: true,
            actionUrl: 'dashboard-farmer.html',
            actionText: 'Send Thank You Note',
            smsText: '[FTF-REVIEW] Customer Priya S. gave you a 5-Star rating on Organic Tomatoes: "Freshest heirloom tomatoes in Chennai!"'
        },
        {
            id: 'notif-f-6',
            type: 'stock',
            category: 'stock',
            title: '🔴 Out of Stock: Organic Country Brinjal',
            message: 'Batch #BAT-BRN-04 is completely sold out. Add tomorrow morning\'s planned harvest quantity to reactivate customer purchases.',
            time: 'Yesterday',
            read: true,
            actionUrl: 'dashboard-farmer.html#farmerProductList',
            actionText: 'Add New Harvest',
            smsText: '[FTF-STOCK] Notice: Organic Country Brinjal is now Out of Stock. Log next picking schedule on farmer dashboard.'
        }
    ],

    // ----------------------------------------------------
    // ARTISAN NOTIFICATIONS
    // ----------------------------------------------------
    artisan: [
        {
            id: 'notif-a-1',
            type: 'orders',
            category: 'orders',
            title: '📦 New Artisan Order #FTF-ART-031',
            message: 'Customer Karthik S. ordered 2 jars of Raw Forest Honey (500g) and 3 Herbal Neem Soaps. Scheduled for eco-packaging.',
            time: '15 mins ago',
            read: false,
            actionUrl: 'dashboard-artisan.html',
            actionText: 'Process Order',
            smsText: '[FTF-ARTISAN] New Order #FTF-ART-031: 2x Wild Honey (500g) + 3x Neem Soaps from Karthik S. Prepare eco bubble packaging.'
        },
        {
            id: 'notif-a-2',
            type: 'payments',
            category: 'payments',
            title: '💳 Payment Confirmed: ₹790.00 Received',
            message: 'Payment for Order #FTF-ART-031 successfully credited via Razorpay Instant Settlement to Nature\'s Touch Artisans.',
            time: '16 mins ago',
            read: false,
            actionUrl: 'dashboard-artisan.html',
            actionText: 'View Receipt',
            smsText: '[FTF-PAY] Payment confirmation: ₹790.00 received for Order #FTF-ART-031. Net payout deposited to linked account.'
        },
        {
            id: 'notif-a-3',
            type: 'stock',
            category: 'stock',
            title: '⚠️ Low Inventory: Raw Forest Honey (4 jars left)',
            message: 'Your wild honey stock is below the reserve threshold. Restock small-batch supply to maintain your verified artisan badge.',
            time: '40 mins ago',
            read: false,
            actionUrl: 'dashboard-artisan.html',
            actionText: 'Update Batch Stock',
            smsText: '[FTF-STOCK] Alert: Raw Forest Honey inventory is running low (4 jars left). Update available batch count on dashboard.'
        },
        {
            id: 'notif-a-4',
            type: 'reviews',
            category: 'reviews',
            title: '⭐ 5-Star Rating Received: Handmade Neem Soap',
            message: '"Completely cleared up my skin allergies. Pure cold-pressed oils make such a huge difference!" — Selvi M.',
            time: '2 hours ago',
            read: true,
            actionUrl: 'dashboard-artisan.html',
            actionText: 'View Feedback',
            smsText: '[FTF-REVIEW] Customer Selvi M. posted 5-Star review on Handmade Neem Soap: "Pure cold-pressed oils make a huge difference!"'
        }
    ],

    // ----------------------------------------------------
    // ADMIN NOTIFICATIONS
    // ----------------------------------------------------
    admin: [
        {
            id: 'notif-adm-1',
            type: 'reviews',
            category: 'reviews',
            title: '📋 Farm Organic Certification Renewal Submitted',
            message: 'Farmer Sundaram Perumal submitted PGS-India certification renewal for Green Valley Organics, Dindigul.',
            time: '30 mins ago',
            read: false,
            actionUrl: 'dashboard-admin.html',
            actionText: 'Inspect & Approve',
            smsText: '[FTF-ADMIN] Audit queue: Farmer Sundaram submitted PGS-India certification renewal for Green Valley Organics.'
        },
        {
            id: 'notif-adm-2',
            type: 'orders',
            category: 'orders',
            title: '📈 Platform Milestone: 1,500 kg Direct Delivered',
            message: 'Monthly food miles reduction crossed 1,030 km, preventing 176 kg of carbon emissions.',
            time: '4 hours ago',
            read: true,
            actionUrl: 'dashboard-admin.html',
            actionText: 'View GMV Metrics',
            smsText: '[FTF-ADMIN] Platform milestone: Monthly GMV crossed ₹50,000 with 1,030 km food miles saved.'
        }
    ]
};

// ============================================
// STATE ACCESS & STORAGE HELPERS
// ============================================

function resolveActionUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#') || url.startsWith('javascript:')) return url;
    const isInsidePages = (window.location.pathname || '').includes('/pages/');
    if (isInsidePages) {
        if (url.startsWith('pages/')) return url.substring(6);
        return url;
    } else {
        if (!url.startsWith('pages/') && !url.startsWith('index.html')) {
            return 'pages/' + url;
        }
        return url;
    }
}

function getCurrentUserRole() {
    const path = (window.location.pathname || '').toLowerCase();

    // 1. Strict page-level dashboard binding:
    if (path.includes('dashboard-customer')) return 'customer';
    if (path.includes('dashboard-farmer') || path.includes('farmer-upload')) return 'farmer';
    if (path.includes('dashboard-artisan')) return 'artisan';
    if (path.includes('dashboard-admin')) return 'admin';

    // 2. On front / home / public common pages:
    // User requirement: "front la notofication common anathu irukanum ana antha antha dashboard la tha customer ku oda notification likewise artisian and farmer"
    // Public store, catalog, home, and informational pages show 'common' announcements!
    const isPublicFrontPage = path.endsWith('index.html') || path === '' || path === '/' || path.endsWith('/') || 
        path.includes('farmer-marketplace') || path.includes('community-kitchen') || 
        path.includes('seed-to-plate') || path.includes('products.html') || path.includes('product-details') ||
        path.includes('cart.html') || path.includes('checkout.html') || path.includes('group-buying') ||
        path.includes('wishlist.html') || path.includes('login.html') || path.includes('register.html') || path.includes('api-docs');

    if (isPublicFrontPage) {
        return 'common';
    }

    // 3. Fallback to logged-in user profile
    try {
        const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.role) return user.role.toLowerCase();
        }
    } catch(e) {}

    const explicitRole = localStorage.getItem('userRole');
    if (explicitRole) return explicitRole.toLowerCase();

    return 'common';
}

function getUserRegisteredPhone(role) {
    try {
        const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.phone) return user.phone;
        }
    } catch(e) {}

    return REGISTERED_PHONES[role] || REGISTERED_PHONES.customer;
}

function getStoredNotifications() {
    try {
        const stored = localStorage.getItem('ftf_smart_notifications');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (!parsed.common || !Array.isArray(parsed.common) || parsed.common.length === 0) {
                parsed.common = DEFAULT_SMART_NOTIFICATIONS.common;
                localStorage.setItem('ftf_smart_notifications', JSON.stringify(parsed));
            }
            return parsed;
        }
    } catch (e) {
        console.warn('Error reading notifications from localStorage:', e);
    }
    return DEFAULT_SMART_NOTIFICATIONS;
}

function saveStoredNotifications(notifs) {
    try {
        localStorage.setItem('ftf_smart_notifications', JSON.stringify(notifs));
    } catch (e) {
        console.warn('Error saving notifications:', e);
    }
}

function getStoredSmsLog() {
    try {
        const log = localStorage.getItem('ftf_sms_log');
        if (log) return JSON.parse(log);
    } catch (e) {}
    return [];
}

function saveSmsLog(log) {
    try {
        localStorage.setItem('ftf_sms_log', JSON.stringify(log));
    } catch (e) {}
}

function getNotificationsForRole(role, categoryFilter = 'all') {
    const all = getStoredNotifications();
    const list = all[role] || all.customer || [];
    if (!categoryFilter || categoryFilter === 'all') return list;
    return list.filter(n => (n.category || n.type) === categoryFilter);
}

function getUnreadCount(role) {
    const all = getStoredNotifications();
    const list = all[role] || [];
    return list.filter(n => !n.read).length;
}

// ============================================
// CORE NOTIFICATION CRUD & DISPATCH
// ============================================

function addNotification(role, notif, sendSms = true) {
    const all = getStoredNotifications();
    if (!all[role]) all[role] = [];

    const phone = getUserRegisteredPhone(role);
    const newNotif = {
        id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        read: false,
        time: 'Just now',
        timestamp: new Date().toISOString(),
        category: notif.category || notif.type || 'orders',
        phone: phone,
        ...notif
    };

    all[role].unshift(newNotif);
    saveStoredNotifications(all);

    // Also record and simulate SMS alert to registered phone
    if (sendSms) {
        const smsMessage = notif.smsText || `[FTF-ALERTS] ${notif.title}: ${notif.message}`;
        recordSmsLog(role, phone, smsMessage, notif.title);
        showSmsToast(role, phone, smsMessage, notif.title);
    }

    updateNotificationUI();
}

function recordSmsLog(role, phone, message, title) {
    const log = getStoredSmsLog();
    log.unshift({
        id: 'sms-' + Date.now(),
        role: role,
        phone: phone,
        title: title || 'Alert',
        message: message,
        time: 'Just now',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
    // Keep max 50 SMS logs
    if (log.length > 50) log.pop();
    saveSmsLog(log);
}

function markSingleNotificationRead(id) {
    const all = getStoredNotifications();
    for (const role in all) {
        const item = all[role].find(n => n.id === id);
        if (item) {
            item.read = true;
            break;
        }
    }
    saveStoredNotifications(all);
    updateNotificationUI();
}

function markAllNotificationsRead(role) {
    const all = getStoredNotifications();
    if (all[role]) {
        all[role].forEach(n => n.read = true);
        saveStoredNotifications(all);
        updateNotificationUI();
    }
}

function deleteNotification(id, event) {
    if (event) event.stopPropagation();
    const all = getStoredNotifications();
    for (const role in all) {
        all[role] = all[role].filter(n => n.id !== id);
    }
    saveStoredNotifications(all);
    updateNotificationUI();
}

function clearAllNotifications(role) {
    const all = getStoredNotifications();
    all[role] = [];
    saveStoredNotifications(all);
    updateNotificationUI();
}

// ============================================
// MOBILE-STYLE SMS PUSH TOAST POP-UP
// ============================================

function showSmsToast(role, phone, message, title) {
    let container = document.getElementById('ftfSmsToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'ftfSmsToastContainer';
        container.className = 'ftf-sms-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'ftf-sms-toast';
    toast.innerHTML = `
        <div class="sms-toast-header">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="sms-phone-icon"><i class="fas fa-sms"></i></span>
                <div>
                    <strong style="font-size: 0.85rem; color: #0f172a;">SMS Sent to Registered Mobile</strong>
                    <div style="font-size: 0.72rem; color: #475569;"><i class="fas fa-mobile-alt"></i> ${phone} • <strong>${role.toUpperCase()}</strong></div>
                </div>
            </div>
            <button class="sms-toast-close" onclick="this.closest('.ftf-sms-toast').remove()">&times;</button>
        </div>
        <div class="sms-toast-body">
            <strong style="color: #166534; font-size: 0.82rem; display: block; margin-bottom: 2px;">${title}</strong>
            <p style="margin: 0; font-size: 0.82rem; line-height: 1.45; color: #334155;">${message}</p>
        </div>
        <div class="sms-toast-footer">
            <span><i class="fas fa-satellite-dish" style="color: #16a34a;"></i> Live Carrier Dispatch • Farm to Fork SMS Gateway</span>
            <span style="font-size: 0.7rem; color: #64748b;">Now</span>
        </div>
    `;

    container.appendChild(toast);

    // Audio chime cue
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
    } catch(e) {}

    // Auto remove after 7 seconds
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-15px)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 7000);
}

// ============================================
// WHATSAPP PUSH TOAST POP-UP
// ============================================

function showWhatsAppToast(role, phone, message, title) {
    let container = document.getElementById('ftfSmsToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'ftfSmsToastContainer';
        container.className = 'ftf-sms-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'ftf-sms-toast ftf-wa-toast';
    toast.style.borderLeft = '4px solid #25D366';
    toast.innerHTML = `
        <div class="sms-toast-header" style="background: linear-gradient(135deg, #075E54 0%, #128C7E 100%); color: white; padding: 10px 14px; border-radius: 12px 12px 0 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.4rem; color: #25D366; background: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;"><i class="fab fa-whatsapp"></i></span>
                <div>
                    <strong style="font-size: 0.85rem; color: white;">WhatsApp Alert Delivered</strong>
                    <div style="font-size: 0.72rem; color: rgba(255,255,255,0.85);"><i class="fas fa-phone-alt"></i> ${phone} • <strong>${role ? role.toUpperCase() : 'USER'}</strong></div>
                </div>
            </div>
            <button class="sms-toast-close" onclick="this.closest('.ftf-sms-toast').remove()" style="color: white; opacity: 0.8;">&times;</button>
        </div>
        <div class="sms-toast-body" style="padding: 12px 14px; background: #f0fdf4;">
            <strong style="color: #075E54; font-size: 0.85rem; display: block; margin-bottom: 3px;">${title || 'Farm to Fork Alert'}</strong>
            <p style="margin: 0; font-size: 0.82rem; line-height: 1.45; color: #1e293b;">${message}</p>
        </div>
        <div class="sms-toast-footer" style="padding: 8px 14px; font-size: 0.72rem; display: flex; justify-content: space-between; background: #e7f8ee; border-radius: 0 0 12px 12px; color: #047857;">
            <span><i class="fab fa-whatsapp" style="color: #25D366;"></i> WhatsApp Business API • Encrypted Alert</span>
            <span>Just now</span>
        </div>
    `;

    container.appendChild(toast);

    // Audio chime
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}

    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-15px)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 7000);
}

// ============================================
// GMAIL / EMAIL NOTIFICATION TOAST POP-UP
// ============================================

function showEmailToast(role, email, message, title) {
    let container = document.getElementById('ftfSmsToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'ftfSmsToastContainer';
        container.className = 'ftf-sms-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'ftf-sms-toast ftf-email-toast';
    toast.style.borderLeft = '4px solid #EA4335';
    toast.innerHTML = `
        <div class="sms-toast-header" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 10px 14px; border-radius: 12px 12px 0 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.15rem; color: #EA4335; background: white; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;"><i class="fab fa-google"></i></span>
                <div>
                    <strong style="font-size: 0.85rem; color: white;">Gmail / Email Notification</strong>
                    <div style="font-size: 0.72rem; color: rgba(255,255,255,0.75);"><i class="fas fa-envelope"></i> ${email}</div>
                </div>
            </div>
            <button class="sms-toast-close" onclick="this.closest('.ftf-sms-toast').remove()" style="color: white; opacity: 0.8;">&times;</button>
        </div>
        <div class="sms-toast-body" style="padding: 12px 14px; background: #fff5f5;">
            <strong style="color: #b91c1c; font-size: 0.85rem; display: block; margin-bottom: 3px;">${title || 'Farm to Fork Notification'}</strong>
            <p style="margin: 0; font-size: 0.82rem; line-height: 1.45; color: #1e293b;">${message}</p>
        </div>
        <div class="sms-toast-footer" style="padding: 8px 14px; font-size: 0.72rem; display: flex; justify-content: space-between; background: #fee2e2; border-radius: 0 0 12px 12px; color: #991b1b;">
            <span><i class="fas fa-inbox" style="color: #EA4335;"></i> Gmail Inbox • Invoice & Produce Dispatch</span>
            <span>Just now</span>
        </div>
    `;

    container.appendChild(toast);

    // Audio chime
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}

    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-15px)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 7000);
}

// ============================================
// UI RENDERING & NAVBAR BELL INJECTION
// ============================================

let activeNotifCategory = 'all';
let activeDrawerTab = 'notifications'; // 'notifications' or 'sms'

function injectNotificationBell() {
    const navActions = document.querySelector('.navbar .nav-actions');
    if (!navActions || document.getElementById('notifBellBtn')) return;

    const bellWrapper = document.createElement('div');
    bellWrapper.className = 'notif-bell-wrapper';
    bellWrapper.id = 'notifBellWrapper';

    const role = getCurrentUserRole();
    const unread = getUnreadCount(role);

    let roleBadgeText = '📢 Community';
    let roleBadgeStyle = 'background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd;';
    if (role === 'farmer') {
        roleBadgeText = '👨‍🌾 Farmer';
        roleBadgeStyle = 'background: #fef3c7; color: #b45309; border: 1px solid #fde68a;';
    } else if (role === 'artisan') {
        roleBadgeText = '🧺 Artisan';
        roleBadgeStyle = 'background: #f3e8ff; color: #7e22ce; border: 1px solid #e9d5ff;';
    } else if (role === 'customer') {
        roleBadgeText = '👩 Customer';
        roleBadgeStyle = 'background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;';
    } else if (role === 'admin') {
        roleBadgeText = '👑 Admin';
        roleBadgeStyle = 'background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;';
    }

    bellWrapper.innerHTML = `
        <button id="notifBellBtn" class="notif-bell-btn" onclick="toggleNotificationDrawer(event)" title="Notifications & Stock Alerts" aria-label="Notifications">
            <svg class="notif-bell-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; pointer-events:none;">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="notif-badge ${unread > 0 ? 'active' : ''}" id="notifBadgeCount">${unread}</span>
        </button>
        <div class="notif-drawer" id="notifDrawer" style="display: none;">
            <!-- Header with Clean Locked Role Badge & Phone (NO DROPDOWN) -->
            <div class="notif-header">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-bell" style="color: var(--primary);"></i>
                        <strong>Notification Center</strong>
                    </div>
                    <div class="notif-user-phone-badge" id="notifPhoneBadge">
                        <i class="fas fa-mobile-alt"></i> ${getUserRegisteredPhone(role)}
                    </div>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <!-- Pure role badge (NO dropdown select) -->
                    <span style="font-size: 0.74rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; ${roleBadgeStyle}">
                        ${roleBadgeText}
                    </span>
                    <button class="notif-mark-all-btn" onclick="markAllNotificationsRead(getCurrentUserRole())" title="Mark all as read">
                        <i class="fas fa-check-double"></i> Read all
                    </button>
                </div>
            </div>

            <!-- Role Scope Banner -->
            ${role === 'common' ? `
                <div style="background: rgba(22, 163, 74, 0.08); padding: 7px 12px; font-size: 0.74rem; color: #166534; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(22, 163, 74, 0.15);">
                    <span><i class="fas fa-bullhorn" style="color: var(--primary);"></i> <strong>Public Community Feed:</strong> General Announcements</span>
                    <a href="${resolveActionUrl('login.html')}" style="color: var(--primary); font-weight: 700; text-decoration: none;">Dashboard Login →</a>
                </div>
            ` : `
                <div style="background: rgba(59, 130, 246, 0.08); padding: 7px 12px; font-size: 0.74rem; color: #1e40af; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(59, 130, 246, 0.15);">
                    <span><i class="fas fa-shield-alt" style="color: #2563eb;"></i> <strong>${role.toUpperCase()} Private Feed:</strong> Connected to Dashboard</span>
                    <span style="font-size: 0.7rem; color: #64748b;">Live Synced</span>
                </div>
            `}

            <!-- Tabs: In-App Alerts vs SMS Messages -->
            <div class="notif-view-tabs">
                <button class="notif-tab-btn active" id="tabInAppBtn" onclick="switchDrawerTab('notifications')">
                    <i class="fas fa-bell"></i> In-App Alerts (<span id="inAppCount">${unread}</span>)
                </button>
                <button class="notif-tab-btn" id="tabSmsBtn" onclick="switchDrawerTab('sms')">
                    <i class="fas fa-sms"></i> 📱 SMS Inbox
                </button>
            </div>

            <!-- Category Pills Bar (For In-App Alerts) -->
            <div class="notif-category-bar" id="notifCategoryBar">
                <button class="notif-cat-pill active" onclick="filterNotifCategory('all')">All</button>
                <button class="notif-cat-pill" onclick="filterNotifCategory('orders')">📦 Orders</button>
                <button class="notif-cat-pill" onclick="filterNotifCategory('offers')">🏷️ Offers</button>
                <button class="notif-cat-pill" onclick="filterNotifCategory('stock')">⚠️ Stock</button>
                <button class="notif-cat-pill" onclick="filterNotifCategory('payments')">💳 Payments</button>
                <button class="notif-cat-pill" onclick="filterNotifCategory('reviews')">⭐ Reviews</button>
            </div>

            <!-- List Containers -->
            <div class="notif-list" id="notifListContainer">
                <!-- Notifications injected dynamically -->
            </div>
            <div class="notif-list" id="smsListContainer" style="display: none;">
                <!-- SMS history injected dynamically -->
            </div>

            <!-- Footer Toolbar with Test Simulator -->
            <div class="notif-footer">
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="notif-sim-btn" onclick="openSimulatorModal()" title="Simulate a real-time notification & SMS">
                        ⚡ Simulate Event
                    </button>
                    <span style="font-size: 0.72rem; color: var(--text-light);">Role-Based & Phone Synced</span>
                </div>
                <a href="#" onclick="clearAllNotifications(getCurrentUserRole()); return false;" style="font-size: 0.75rem; color: #ef4444; text-decoration: none; font-weight: 600;">
                    Clear all
                </a>
            </div>
        </div>
    `;

    // Insert before cart or profile button
    const cartBtn = navActions.querySelector('.cart-btn');
    if (cartBtn) {
        navActions.insertBefore(bellWrapper, cartBtn);
    } else {
        navActions.appendChild(bellWrapper);
    }

    renderNotificationList();

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        const drawer = document.getElementById('notifDrawer');
        const btn = document.getElementById('notifBellBtn');
        if (drawer && drawer.style.display === 'block' && !drawer.contains(e.target) && !btn.contains(e.target)) {
            drawer.style.display = 'none';
        }
    });
}

function toggleNotificationDrawer(event) {
    if (event) event.stopPropagation();
    const drawer = document.getElementById('notifDrawer');
    if (!drawer) return;

    const isShown = drawer.style.display === 'block';
    drawer.style.display = isShown ? 'none' : 'block';
    if (!isShown) {
        renderNotificationList();
        renderSmsList();
    }
}

function switchNotificationRole(newRole) {
    sessionStorage.setItem('ftf_active_notif_view', newRole);
    localStorage.setItem('userRole', newRole);
    const phoneBadge = document.getElementById('notifPhoneBadge');
    if (phoneBadge) {
        phoneBadge.innerHTML = `<i class="fas fa-mobile-alt"></i> ${getUserRegisteredPhone(newRole)}`;
    }
    updateNotificationUI();
}

function switchDrawerTab(tab) {
    activeDrawerTab = tab;
    const tabInApp = document.getElementById('tabInAppBtn');
    const tabSms = document.getElementById('tabSmsBtn');
    const notifContainer = document.getElementById('notifListContainer');
    const smsContainer = document.getElementById('smsListContainer');
    const catBar = document.getElementById('notifCategoryBar');

    if (tab === 'notifications') {
        tabInApp.classList.add('active');
        tabSms.classList.remove('active');
        notifContainer.style.display = 'block';
        smsContainer.style.display = 'none';
        catBar.style.display = 'flex';
        renderNotificationList();
    } else {
        tabInApp.classList.remove('active');
        tabSms.classList.add('active');
        notifContainer.style.display = 'none';
        smsContainer.style.display = 'block';
        catBar.style.display = 'none';
        renderSmsList();
    }
}

function filterNotifCategory(cat) {
    activeNotifCategory = cat;
    document.querySelectorAll('.notif-cat-pill').forEach(pill => {
        pill.classList.toggle('active', pill.textContent.toLowerCase().includes(cat) || (cat === 'all' && pill.textContent === 'All'));
    });
    renderNotificationList();
}

function renderNotificationList() {
    const container = document.getElementById('notifListContainer');
    if (!container) return;

    const role = getCurrentUserRole();
    const list = getNotificationsForRole(role, activeNotifCategory);

    if (list.length === 0) {
        container.innerHTML = `
            <div style="padding: 36px 16px; text-align: center; color: var(--text-light); font-size: 0.88rem;">
                <i class="fas fa-check-circle" style="font-size: 2.2rem; color: #16a34a; margin-bottom: 8px; display: block;"></i>
                <strong>All caught up!</strong>
                <p style="margin: 4px 0 0; font-size: 0.8rem;">No notifications in this category for ${role.toUpperCase()}.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(n => {
        let iconClass = 'fas fa-info-circle';
        let iconBg = '#e0f2fe';
        let iconColor = '#0284c7';

        const cat = (n.category || n.type || '').toLowerCase();
        if (cat === 'stock') {
            iconClass = 'fas fa-exclamation-triangle';
            iconBg = '#fef3c7';
            iconColor = '#d97706';
        } else if (cat === 'orders') {
            iconClass = 'fas fa-box';
            iconBg = '#dcfce7';
            iconColor = '#16a34a';
        } else if (cat === 'offers') {
            iconClass = 'fas fa-tag';
            iconBg = '#fee2e2';
            iconColor = '#dc2626';
        } else if (cat === 'payments') {
            iconClass = 'fas fa-credit-card';
            iconBg = '#ecfdf5';
            iconColor = '#059669';
        } else if (cat === 'reviews') {
            iconClass = 'fas fa-star';
            iconBg = '#fef9c3';
            iconColor = '#ca8a04';
        }

        const actionHref = resolveActionUrl(n.actionUrl);

        return `
            <div class="notif-item ${!n.read ? 'unread' : ''}" onclick="markSingleNotificationRead('${n.id}')">
                <div class="notif-icon-circle" style="background: ${iconBg}; color: ${iconColor};">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notif-content">
                    <div class="notif-title-row">
                        <strong class="notif-title">${n.title}</strong>
                        <small class="notif-time">${n.time || 'Just now'}</small>
                    </div>
                    <p class="notif-desc">${n.message}</p>
                    
                    ${n.smsText ? `
                        <div class="notif-sms-meta">
                            <i class="fas fa-sms" style="color: var(--primary);"></i> SMS sent to <strong>${getUserRegisteredPhone(role)}</strong>
                        </div>
                    ` : ''}

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                        ${actionHref && n.actionText ? `
                            <a href="${actionHref}" class="notif-action-btn" onclick="event.stopPropagation();">${n.actionText} →</a>
                        ` : '<span></span>'}
                        <button class="notif-del-btn" onclick="deleteNotification('${n.id}', event)" title="Delete Notification">&times;</button>
                    </div>
                </div>
                ${!n.read ? '<span class="notif-unread-dot" title="Unread"></span>' : ''}
            </div>
        `;
    }).join('');
}

function renderSmsList() {
    const container = document.getElementById('smsListContainer');
    if (!container) return;

    const role = getCurrentUserRole();
    const phone = getUserRegisteredPhone(role);
    const allSms = getStoredSmsLog().filter(s => s.role === role || s.phone === phone);

    if (allSms.length === 0) {
        container.innerHTML = `
            <div style="padding: 36px 16px; text-align: center; color: var(--text-light); font-size: 0.88rem;">
                <i class="fas fa-comment-slash" style="font-size: 2.2rem; color: #94a3b8; margin-bottom: 8px; display: block;"></i>
                <strong>No SMS messages yet</strong>
                <p style="margin: 4px 0 0; font-size: 0.8rem;">SMS alerts sent to ${phone} will appear here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = allSms.map(s => `
        <div class="sms-log-item">
            <div class="sms-log-header">
                <div>
                    <span class="sms-sender-badge">FTF-ALERTS</span>
                    <strong style="font-size: 0.82rem; margin-left: 6px; color: var(--text);">${s.title}</strong>
                </div>
                <small style="color: var(--text-light); font-size: 0.72rem;">${s.timestamp || s.time}</small>
            </div>
            <div class="sms-log-body">${s.message}</div>
            <div class="sms-log-footer">
                <i class="fas fa-check-circle" style="color: #16a34a;"></i> Delivered to ${s.phone}
            </div>
        </div>
    `).join('');
}

// ============================================
// DEDICATED IN-DASHBOARD NOTIFICATION FEED RENDERER
// ============================================

let dashboardNotifCategory = 'all';

function filterDashboardNotifCategory(cat) {
    dashboardNotifCategory = cat;
    document.querySelectorAll('.dash-notif-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.cat === cat);
    });
    renderDashboardNotificationFeed();
}

function renderDashboardNotificationFeed(forcedRole, containerId) {
    const targetId = containerId || 'dashboardNotificationCenter';
    const container = document.getElementById(targetId) || 
                      document.getElementById('customerNotificationCenter') || 
                      document.getElementById('farmerNotificationCenter') || 
                      document.getElementById('artisanNotificationCenter');
    if (!container) return;

    // Detect role
    let role = forcedRole;
    if (!role) {
        const path = (window.location.pathname || '').toLowerCase();
        if (path.includes('dashboard-customer')) role = 'customer';
        else if (path.includes('dashboard-farmer') || path.includes('farmer-upload')) role = 'farmer';
        else if (path.includes('dashboard-artisan')) role = 'artisan';
        else if (path.includes('dashboard-admin')) role = 'admin';
        else role = getCurrentUserRole();
    }

    const unread = getUnreadCount(role);
    const allNotifs = getStoredNotifications();
    let list = (allNotifs[role] || []).slice();

    if (dashboardNotifCategory && dashboardNotifCategory !== 'all') {
        list = list.filter(n => (n.category || n.type) === dashboardNotifCategory);
    }

    // Role-specific titles & icons
    let meta = {
        title: 'Customer Notifications & Delivery Alerts',
        subtitle: 'Personal order dispatches, cold-chain temperature tracking, wishlist price drops & restock alerts',
        icon: 'fas fa-bell',
        color: '#16a34a',
        phone: getUserRegisteredPhone('customer'),
        simKey: 'cust_order_shipped'
    };

    if (role === 'farmer') {
        meta = {
            title: 'Farmer Orders & Harvest Notification Center',
            subtitle: 'Direct customer crop orders, zero-fee UPI payouts, crop low-stock warnings & 5-star customer reviews',
            icon: 'fas fa-tractor',
            color: '#e65100',
            phone: getUserRegisteredPhone('farmer'),
            simKey: 'farmer_new_order'
        };
    } else if (role === 'artisan') {
        meta = {
            title: 'Artisan Orders & Payout Notification Center',
            subtitle: 'Handmade craft purchase orders, instant Razorpay settlements, small-batch thresholds & craft ratings',
            icon: 'fas fa-palette',
            color: '#9c27b0',
            phone: getUserRegisteredPhone('artisan'),
            simKey: 'artisan_new_order'
        };
    } else if (role === 'admin') {
        meta = {
            title: 'Platform Admin Alerts & Audit Stream',
            subtitle: 'Gross Merchandise Value (GMV), PGS-India farm inspections, KYC requests & system health',
            icon: 'fas fa-crown',
            color: '#2563eb',
            phone: getUserRegisteredPhone('admin'),
            simKey: 'cust_order_shipped'
        };
    } else if (role === 'common') {
        meta = {
            title: 'Collective Announcements & Community Updates',
            subtitle: 'Platform-wide seasonal discounts, food miles milestones & neighborhood group buying pools',
            icon: 'fas fa-bullhorn',
            color: '#16a34a',
            phone: '+91 1800 425 1800',
            simKey: 'cust_price_drop'
        };
    }

    // Update any external stat count badges on the dashboard
    const statBadge = document.getElementById('custNotifStatCount') || 
                      document.getElementById('farmerNotifStatCount') || 
                      document.getElementById('artisanNotifStatCount');
    if (statBadge) statBadge.textContent = unread;

    // Build categories pills
    const categories = [
        { id: 'all', label: 'All Alerts' },
        { id: 'orders', label: '📦 Orders' },
        { id: 'offers', label: '🏷️ Offers' },
        { id: 'stock', label: '⚠️ Stock' },
        { id: 'payments', label: '💳 Payments' },
        { id: 'reviews', label: '⭐ Reviews' }
    ];

    const catButtonsHtml = categories.map(c => `
        <button class="dash-notif-pill ${dashboardNotifCategory === c.id ? 'active' : ''}" data-cat="${c.id}" onclick="filterDashboardNotifCategory('${c.id}')">
            ${c.label}
        </button>
    `).join('');

    let itemsHtml = '';
    if (list.length === 0) {
        itemsHtml = `
            <div class="dash-notif-empty">
                <div style="font-size: 2.8rem; margin-bottom: 8px;">🎉</div>
                <h4 style="margin: 0; color: var(--text);">All caught up!</h4>
                <p style="margin: 4px 0 0; color: var(--text-light); font-size: 0.85rem;">
                    No notifications right now for <strong>${role.toUpperCase()}</strong> in this category.
                </p>
            </div>
        `;
    } else {
        itemsHtml = list.map(n => {
            let iconClass = 'fas fa-info-circle';
            let iconBg = '#e0f2fe';
            let iconColor = '#0284c7';

            const cat = (n.category || n.type || '').toLowerCase();
            if (cat === 'stock') {
                iconClass = 'fas fa-exclamation-triangle';
                iconBg = '#fef3c7';
                iconColor = '#d97706';
            } else if (cat === 'orders') {
                iconClass = 'fas fa-box';
                iconBg = '#dcfce7';
                iconColor = '#16a34a';
            } else if (cat === 'offers') {
                iconClass = 'fas fa-tag';
                iconBg = '#fee2e2';
                iconColor = '#dc2626';
            } else if (cat === 'payments') {
                iconClass = 'fas fa-credit-card';
                iconBg = '#ecfdf5';
                iconColor = '#059669';
            } else if (cat === 'reviews') {
                iconClass = 'fas fa-star';
                iconBg = '#fef9c3';
                iconColor = '#ca8a04';
            }

            const actionHref = resolveActionUrl(n.actionUrl);

            return `
                <div class="dash-notif-item ${!n.read ? 'unread' : ''}" onclick="markSingleNotificationRead('${n.id}')">
                    <div class="dash-notif-icon" style="background: ${iconBg}; color: ${iconColor};">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="dash-notif-body">
                        <div class="dash-notif-top">
                            <strong class="dash-notif-title">${n.title}</strong>
                            <span class="dash-notif-time">${n.time || 'Just now'}</span>
                        </div>
                        <p class="dash-notif-text">${n.message}</p>
                        
                        <div class="dash-notif-bottom">
                            ${n.smsText ? `
                                <span class="dash-notif-sms-badge">
                                    <i class="fas fa-sms"></i> SMS sent to ${getUserRegisteredPhone(role)}
                                </span>
                            ` : '<span></span>'}

                            <div style="display: flex; align-items: center; gap: 8px;">
                                ${actionHref && n.actionText ? `
                                    <a href="${actionHref}" class="dash-notif-link" onclick="event.stopPropagation();">
                                        ${n.actionText} →
                                    </a>
                                ` : ''}
                                <button class="dash-notif-delete-btn" onclick="deleteNotification('${n.id}', event)" title="Delete">&times;</button>
                            </div>
                        </div>
                    </div>
                    ${!n.read ? '<span class="dash-notif-unread-dot" title="Unread"></span>' : ''}
                </div>
            `;
        }).join('');
    }

    container.innerHTML = `
        <div class="dashboard-notif-panel">
            <div class="dash-notif-header">
                <div>
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <h3 style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 1.15rem;">
                            <i class="${meta.icon}" style="color: ${meta.color};"></i> ${meta.title}
                        </h3>
                        <span class="dash-notif-count-badge ${unread > 0 ? 'active' : ''}">
                            ${unread} ${unread === 1 ? 'New Alert' : 'New Alerts'}
                        </span>
                    </div>
                    <p style="margin: 4px 0 0; font-size: 0.84rem; color: var(--text-light);">
                        ${meta.subtitle} • <strong style="color: var(--text);"><i class="fas fa-mobile-alt"></i> ${meta.phone}</strong>
                    </p>
                </div>
                <div class="dash-notif-header-actions">
                    <button class="dash-notif-btn" onclick="markAllNotificationsRead('${role}')" title="Mark all notifications as read">
                        <i class="fas fa-check-double"></i> Mark All Read
                    </button>
                    <button class="dash-notif-btn highlight" onclick="triggerSimEvent('${meta.simKey}')" title="Simulate a real-time event & SMS">
                        <i class="fas fa-bolt"></i> Test Alert
                    </button>
                    <button class="dash-notif-btn text-danger" onclick="clearAllNotifications('${role}')" title="Clear all notifications">
                        <i class="fas fa-trash-alt"></i> Clear
                    </button>
                </div>
            </div>

            <!-- Categories Filter Bar -->
            <div class="dash-notif-cats">
                ${catButtonsHtml}
            </div>

            <!-- Notification Items List -->
            <div class="dash-notif-list">
                ${itemsHtml}
            </div>
        </div>
    `;
}

function updateNotificationUI() {
    const role = getCurrentUserRole();
    const unread = getUnreadCount(role);

    const badge = document.getElementById('notifBadgeCount');
    if (badge) {
        badge.textContent = unread;
        badge.classList.toggle('active', unread > 0);
    }
    const inAppCount = document.getElementById('inAppCount');
    if (inAppCount) inAppCount.textContent = unread;

    renderNotificationList();
    renderSmsList();
    renderDashboardNotificationFeed();
}

// ============================================
// WISHLIST & AUTOMATED STOCK ALERTS ENGINE
// ============================================

function checkWishlistAlerts() {
    try {
        const wishlistIds = JSON.parse(localStorage.getItem('farmToForkWishlist') || '[]');
        if (!wishlistIds || wishlistIds.length === 0) return;

        // Compare wishlist products against catalog
        let catalog = (typeof products !== 'undefined') ? products : [];
        if (catalog.length === 0 && window.shopProducts) catalog = window.shopProducts;

        wishlistIds.forEach(id => {
            const prod = catalog.find(p => p.id === parseInt(id, 10));
            if (!prod) return;

            // 1. Price drop check
            if (prod.originalPrice && prod.price && prod.price < prod.originalPrice) {
                const dropKey = `alert_price_drop_${prod.id}_${prod.price}`;
                if (!sessionStorage.getItem(dropKey)) {
                    sessionStorage.setItem(dropKey, 'true');
                    addNotification('customer', {
                        category: 'offers',
                        title: `🏷️ Wishlist Price Drop: ${prod.name}`,
                        message: `${prod.name} on your wishlist is now ₹${prod.price}/${prod.unit} (was ₹${prod.originalPrice}). Save ₹${prod.originalPrice - prod.price}!`,
                        actionUrl: `product-details.html?id=${prod.id}`,
                        actionText: 'Shop at ₹' + prod.price,
                        smsText: `[FTF-ALERTS] Price Drop Alert! ${prod.name} on your wishlist dropped to ₹${prod.price}/${prod.unit}. Save ₹${prod.originalPrice - prod.price}. Order now!`
                    });
                }
            }

            // 2. Stock Alert check
            if (prod.stock !== undefined && prod.stock <= 10 && prod.stock > 0) {
                const stockKey = `alert_low_stock_${prod.id}`;
                if (!sessionStorage.getItem(stockKey)) {
                    sessionStorage.setItem(stockKey, 'true');
                    addNotification('customer', {
                        category: 'stock',
                        title: `⚠️ Almost Sold Out: ${prod.name}`,
                        message: `Only ${prod.stock} ${prod.unit} left for ${prod.name} on your wishlist. Secure your fresh farm harvest before it's gone!`,
                        actionUrl: `product-details.html?id=${prod.id}`,
                        actionText: 'Buy Now',
                        smsText: `[FTF-ALERTS] Stock Alert: Only ${prod.stock} ${prod.unit} remaining for ${prod.name} on your wishlist. Harvest is almost sold out!`
                    });
                }
            }
        });
    } catch(e) {
        console.warn('Wishlist monitoring error:', e);
    }
}

// ============================================
// SIMULATION MODAL FOR DEMOS & PROJECT DEFENSE
// ============================================

function openSimulatorModal() {
    let modal = document.getElementById('ftfSimulatorModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'ftfSimulatorModal';
    modal.className = 'notif-sim-modal-backdrop';
    modal.innerHTML = `
        <div class="notif-sim-modal-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #16a34a; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">⚡</span>
                    <strong style="font-size: 1.15rem; color: var(--text);">Live Notification & SMS Simulator</strong>
                </div>
                <button onclick="document.getElementById('ftfSimulatorModal').remove()" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-light);">&times;</button>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 16px;">
                Trigger instant role-based alerts. Tests in-app notification center, unread counters, category filtering, and real-time SMS phone delivery!
            </p>

            <div class="sim-actions-grid">
                <!-- Customer Alerts -->
                <div class="sim-group">
                    <span class="sim-group-title">👩 Customer Events</span>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('cust_price_drop')">
                        🏷️ Wishlist Price Drop (Tomatoes ₹60)
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('cust_restock')">
                        🔔 Wishlist Back in Stock (Strawberries)
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('cust_order_shipped')">
                        🚚 Order Shipped (Cold-Chain 4°C)
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('cust_order_delivered')">
                        ✅ Order Delivered to Doorstep
                    </button>
                </div>

                <!-- Farmer Alerts -->
                <div class="sim-group">
                    <span class="sim-group-title">👨‍🌾 Farmer Events</span>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('farmer_new_order')">
                        📦 Customer Placed Order (5kg Tomatoes)
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('farmer_payment')">
                        💳 Payment Received (₹380 via UPI)
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('farmer_low_stock')">
                        ⚠️ Low Stock Warning (Spinach < 10)
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('farmer_review')">
                        ⭐ New 5-Star Customer Review
                    </button>
                </div>

                <!-- Artisan Alerts -->
                <div class="sim-group">
                    <span class="sim-group-title">🧺 Artisan Events</span>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('artisan_new_order')">
                        📦 New Order for Wild Forest Honey
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('artisan_payment')">
                        💳 Payment Confirmed (₹790 Credited)
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('artisan_review')">
                        ⭐ 5-Star Review on Herbal Neem Soap
                    </button>
                    <button class="sim-trigger-btn" onclick="triggerSimEvent('artisan_low_inv')">
                        ⚠️ Inventory Low (Raw Honey: 4 jars)
                    </button>
                </div>
            </div>

            <div style="margin-top: 18px; text-align: right;">
                <button class="btn-primary" style="padding: 8px 18px; font-size: 0.88rem;" onclick="document.getElementById('ftfSimulatorModal').remove()">
                    Done Testing
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function triggerSimEvent(action) {
    const role = getCurrentUserRole();

    switch(action) {
        // Customer
        case 'cust_price_drop':
            addNotification('customer', {
                category: 'offers',
                title: '🏷️ Price Drop Alert: Organic Tomatoes',
                message: 'Organic Tomatoes on your wishlist is now on sale for ₹54/kg from Sri Amman Bio-Farms (Pollachi). Save 20% today!',
                actionUrl: 'product-details.html?id=1',
                actionText: 'View Deal',
                smsText: '[FTF-ALERTS] Special Deal: Organic Tomatoes on your wishlist dropped to ₹54/kg! Order fresh before noon.'
            });
            break;

        case 'cust_restock':
            addNotification('customer', {
                category: 'stock',
                title: '🔔 Back in Stock: Organic Strawberries',
                message: '30 boxes of fresh organic strawberries have just been harvested and added back to inventory!',
                actionUrl: 'products.html?category=fruits',
                actionText: 'Order Now',
                smsText: '[FTF-ALERTS] Restock: Organic Strawberries is back in stock. 30 fresh boxes ready for harvest delivery.'
            });
            break;

        case 'cust_order_shipped':
            addNotification('customer', {
                category: 'orders',
                title: '🚚 Your Organic Order is Out for Delivery',
                message: 'Order #FTF-2024-889 has been picked up by our electric cold-chain vehicle. Driver ETA: 45 minutes.',
                actionUrl: 'seed-to-plate.html',
                actionText: 'Live GPS Track',
                smsText: '[FTF-ALERTS] Order #FTF-2024-889 is out for delivery! Temperature logged at 4.2°C. Driver arriving in 45 mins.'
            });
            break;

        case 'cust_order_delivered':
            addNotification('customer', {
                category: 'orders',
                title: '✅ Order Delivered to Doorstep',
                message: 'Your morning produce was handed over fresh. Enjoy pure organic living! Leave a review to support Farmer Sundaram.',
                actionUrl: 'dashboard-customer.html#orders',
                actionText: 'Rate Produce',
                smsText: '[FTF-ALERTS] Delivery confirmed for Order #FTF-2024-889. Thank you for choosing organic direct trade!'
            });
            break;

        // Farmer
        case 'farmer_new_order':
            addNotification('farmer', {
                category: 'orders',
                title: '📦 New Order Received #FTF-' + Math.floor(100000 + Math.random() * 900000),
                message: 'Anushiya Selvi (NEC) placed an order for 3kg Organic Tomatoes and 1kg Carrots. Scheduled for morning dispatch.',
                actionUrl: 'dashboard-farmer.html#ordersModal',
                actionText: 'Inspect Order',
                smsText: '[FTF-KISSAN] Vanakkam Sundaram! New Order received from Anushiya Selvi for 3kg Tomatoes + 1kg Carrots. Prep batch for transit.'
            });
            break;

        case 'farmer_payment':
            addNotification('farmer', {
                category: 'payments',
                title: '💳 Payment Received: ₹380.00 Credited',
                message: 'Customer payment for Order #FTF-2024-092 settled via UPI Instant Pay directly to Canara Bank A/c ending 4821.',
                actionUrl: 'dashboard-farmer.html',
                actionText: 'View Balance',
                smsText: '[FTF-PAY] ₹380.00 credited to your Canara Bank A/c for Order #FTF-2024-092 via UPI Instant Pay. Zero brokerage.'
            });
            break;

        case 'farmer_low_stock':
            addNotification('farmer', {
                category: 'stock',
                title: '⚠️ Low Stock Warning: Organic Spinach',
                message: 'Only 6 bunches remaining in your listed inventory. 8 customers currently viewing this harvest!',
                actionUrl: 'dashboard-farmer.html#farmerProductList',
                actionText: 'Update Stock',
                smsText: '[FTF-STOCK] Alert: Organic Spinach stock is critically low (6 bunches left). Restock now to avoid missed orders.'
            });
            break;

        case 'farmer_review':
            addNotification('farmer', {
                category: 'reviews',
                title: '⭐ New 5-Star Customer Review',
                message: '"Best native tomatoes in Dindigul! Grown with pure Panchagavya, tastes incredible." — Ananya K.',
                actionUrl: 'dashboard-farmer.html',
                actionText: 'Read Review',
                smsText: '[FTF-REVIEW] Customer Ananya K. gave your farm 5 Stars: "Best native tomatoes in Dindigul! Pure Panchagavya."'
            });
            break;

        // Artisan
        case 'artisan_new_order':
            addNotification('artisan', {
                category: 'orders',
                title: '📦 New Artisan Order #FTF-ART-771',
                message: 'Customer Priya S. ordered 2x Wild Forest Honey and 2x Handmade Neem Soaps.',
                actionUrl: 'dashboard-artisan.html',
                actionText: 'View Order',
                smsText: '[FTF-ARTISAN] New Order #FTF-ART-771: 2x Wild Forest Honey + 2x Neem Soaps from Priya S. Package for courier dispatch.'
            });
            break;

        case 'artisan_payment':
            addNotification('artisan', {
                category: 'payments',
                title: '💳 Payment Received: ₹840.00 Confirmed',
                message: 'Payout for Order #FTF-ART-771 processed and credited to Nature\'s Touch Artisans.',
                actionUrl: 'dashboard-artisan.html',
                actionText: 'View Statement',
                smsText: '[FTF-PAY] Payment Confirmed: ₹840.00 deposited for Order #FTF-ART-771. Thank you for small-batch craftsmanship.'
            });
            break;

        case 'artisan_review':
            addNotification('artisan', {
                category: 'reviews',
                title: '⭐ 5-Star Review on Raw Forest Honey',
                message: '"Completely raw and unprocessed. You can taste the wild forest blooms!" — Kavitha M.',
                actionUrl: 'dashboard-artisan.html',
                actionText: 'View Feedback',
                smsText: '[FTF-REVIEW] 5-Star Review on Raw Forest Honey: "Completely raw and unprocessed. Wild forest quality!"'
            });
            break;

        case 'artisan_low_inv':
            addNotification('artisan', {
                category: 'stock',
                title: '⚠️ Low Stock: Handmade Neem Soap (5 bars left)',
                message: 'Inventory is running low on your handcrafted batch. Craft new inventory to meet demand.',
                actionUrl: 'dashboard-artisan.html',
                actionText: 'Restock Batch',
                smsText: '[FTF-STOCK] Alert: Handmade Neem Soap is low on stock (5 bars left). Update small-batch inventory.'
            });
            break;
    }

    if (typeof showNotification === 'function') {
        showNotification('⚡ Simulated event triggered! Notification & SMS dispatched.', 'fas fa-bolt');
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    injectNotificationBell();
    renderDashboardNotificationFeed();
    checkWishlistAlerts();
});

// Export globally
if (typeof window !== 'undefined') {
    window.FTF_NOTIFICATIONS = {
        addNotification,
        markAllNotificationsRead,
        markSingleNotificationRead,
        deleteNotification,
        clearAllNotifications,
        getNotificationsForRole,
        getUnreadCount,
        getCurrentUserRole,
        getUserRegisteredPhone,
        checkWishlistAlerts,
        showSmsToast,
        showWhatsAppToast,
        showEmailToast,
        openSimulatorModal,
        triggerSimEvent,
        renderDashboardNotificationFeed,
        filterDashboardNotifCategory
    };
    window.showSmsToast = showSmsToast;
    window.showWhatsAppToast = showWhatsAppToast;
    window.showEmailToast = showEmailToast;
    window.toggleNotificationDrawer = toggleNotificationDrawer;
    window.switchNotificationRole = switchNotificationRole;
    window.switchDrawerTab = switchDrawerTab;
    window.filterNotifCategory = filterNotifCategory;
    window.markAllNotificationsRead = markAllNotificationsRead;
    window.markSingleNotificationRead = markSingleNotificationRead;
    window.deleteNotification = deleteNotification;
    window.clearAllNotifications = clearAllNotifications;
    window.openSimulatorModal = openSimulatorModal;
    window.triggerSimEvent = triggerSimEvent;
    window.renderDashboardNotificationFeed = renderDashboardNotificationFeed;
    window.filterDashboardNotifCategory = filterDashboardNotifCategory;
}
