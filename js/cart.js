// ============================================
// CART MANAGEMENT & COUPON ENGINE
// Farm to Fork Collective
// ============================================

// Cart state declaration
var cart = window.cart || [];
window.cart = cart;
var appliedCoupon = null;

// Valid coupon codes
const validCoupons = {
    'ORGANIC20': { type: 'percent', value: 20, desc: '20% OFF on all organic items' },
    'FIRST50': { type: 'flat', value: 50, desc: '₹50 Flat Discount for new members' },
    'FREESHIP': { type: 'free_delivery', value: 0, desc: 'Free Express Delivery' }
};

// Load cart from localStorage
function loadCart() {
    try {
        const saved = localStorage.getItem('farmToForkCart');
        cart = saved ? JSON.parse(saved) : [];
    } catch (e) {
        cart = [];
    }
    window.cart = cart;
    
    // Load saved coupon
    try {
        const savedCoupon = localStorage.getItem('farmToForkCoupon');
        appliedCoupon = savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch (e) {
        appliedCoupon = null;
    }

    updateCartUI();
    return cart;
}

// Save cart to localStorage
function saveCart() {
    window.cart = cart;
    localStorage.setItem('farmToForkCart', JSON.stringify(cart));
    if (appliedCoupon) {
        localStorage.setItem('farmToForkCoupon', JSON.stringify(appliedCoupon));
    } else {
        localStorage.removeItem('farmToForkCoupon');
    }
}

// Get subtotal
function getCartSubtotal() {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    return cart.reduce((sum, item) => {
        const p = parseFloat(item.price || 0) || 0;
        const q = parseInt(item.quantity || 1, 10) || 1;
        return sum + (p * q);
    }, 0);
}

// Calculate discounts and delivery fee
function calculateCartTotals() {
    const subtotal = Math.round(getCartSubtotal());
    let deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 50;
    let discount = 0;

    if (appliedCoupon && subtotal > 0) {
        if (appliedCoupon.type === 'percent') {
            discount = Math.round((subtotal * appliedCoupon.value) / 100);
        } else if (appliedCoupon.type === 'flat') {
            discount = Math.min(appliedCoupon.value, subtotal);
        } else if (appliedCoupon.type === 'free_delivery') {
            deliveryFee = 0;
            discount = 0;
        }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);
    return { subtotal, deliveryFee, discount, total };
}

// Apply Coupon Code
function applyCouponCode(code) {
    if (!code) {
        const input = document.getElementById('couponInput');
        code = input ? input.value.trim().toUpperCase() : '';
    } else {
        code = code.trim().toUpperCase();
    }

    if (!code) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter a valid coupon code', 'fas fa-exclamation-circle');
        } else {
            alert('Please enter a valid coupon code');
        }
        return;
    }

    if (validCoupons[code]) {
        appliedCoupon = { code: code, ...validCoupons[code] };
        saveCart();
        updateCartUI();
        const msg = `Coupon <strong>${code}</strong> applied! 🎉 (${appliedCoupon.desc})`;
        if (typeof showNotification === 'function') {
            showNotification(msg, 'fas fa-tag');
        } else {
            alert(`Coupon ${code} applied!`);
        }
    } else {
        const msg = 'Invalid coupon code. Try ORGANIC20, FIRST50, or FREESHIP!';
        if (typeof showNotification === 'function') {
            showNotification(msg, 'fas fa-times-circle');
        } else {
            alert(msg);
        }
    }
}

// Remove Coupon
function removeCoupon() {
    appliedCoupon = null;
    saveCart();
    updateCartUI();
    if (typeof showNotification === 'function') {
        showNotification('Coupon removed', 'fas fa-info-circle');
    }
}

// Update cart UI
function updateCartUI() {
    const container = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('cartDelivery');
    const discountEl = document.getElementById('cartDiscount');
    const totalEl = document.getElementById('cartTotal');
    const countEl = document.getElementById('cartCount') || document.getElementById('summaryItemCount');
    const couponStatusEl = document.getElementById('couponStatus');

    const { subtotal, deliveryFee, discount, total } = calculateCartTotals();

    // Render cart items if list container exists (e.g. cart.html)
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow);">
                    <i class="fas fa-shopping-basket" style="font-size: 4rem; color: var(--primary); opacity: 0.3; margin-bottom: 16px;"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Your cart is empty</h3>
                    <p style="color: var(--text-light); margin-bottom: 24px;">Discover fresh farm produce, organic fruits, and artisan delights!</p>
                    <a href="products.html" class="btn-primary"><i class="fas fa-arrow-left"></i> Browse Shop</a>
                </div>
            `;
        } else {
            const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
            const isPages = window.location.pathname.includes('/pages/');
            const storeUrlBase = isPages ? 'farmer-store.html?farmer=' : 'pages/farmer-store.html?farmer=';

            container.innerHTML = cart.map((item, index) => {
                const farmerName = item.farmerName || item.seller || 'Verified Farmer';
                const farmName = item.farmName || item.seller || '';
                const farmLoc = item.farmLocation || '';
                const distText = item.distanceKm ? ` (${item.distanceKm} km)` : '';
                const storeLink = item.farmerId ? `<a href="${storeUrlBase}${item.farmerId}" class="cart-farmer-store-link" title="${isTa ? 'விவசாயி அங்காடி' : 'View Farmer Store'}"><i class="fas fa-store"></i> ${isTa ? 'அங்காடி' : 'Store'}</a>` : '';
                const itemTotal = (parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10)) || 0;

                return `
                <div class="cart-item" style="display: flex; gap: 20px; padding: 18px; background: var(--white); border-radius: 14px; margin-bottom: 14px; align-items: center; box-shadow: var(--shadow); transition: transform 0.2s;">
                    <img src="${typeof getProductImagePath === 'function' ? getProductImagePath(item.image) : (item.image || '/assets/images/products/organic-tomatoes.jpg')}" alt="${item.name}" style="width: 84px; height: 84px; border-radius: 10px; object-fit: cover;" onerror="this.src='${item.backupImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}'" />
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 4px; font-size: 1.1rem;">${item.name}</h4>
                        <div class="cart-item-farmer-pill">
                            <i class="fas fa-tractor" style="color: var(--primary);"></i> 
                            <span><strong>${isTa ? 'விவசாயி:' : 'Farmer:'}</strong> ${farmerName} ${farmName ? '• ' + farmName : ''} ${farmLoc ? '<span style="color:var(--text-light); font-size:0.75rem;">(' + farmLoc + distText + ')</span>' : ''}</span>
                            ${storeLink}
                        </div>
                        <p style="color: var(--text-light); font-size: 0.85rem; margin-bottom: 6px;">₹${item.price} / ${item.unit || 'kg'}</p>
                        ${item.category === 'frozen' ? '<span style="font-size: 0.7rem; background: #2196F3; color: white; padding: 2px 8px; border-radius: 10px; display: inline-block;">❄️ Frozen</span>' : ''}
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                            <button onclick="updateQuantity(${index}, -1)" style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 8px; background: var(--bg); cursor: pointer; font-weight: bold; font-size: 1rem;">−</button>
                            <span style="font-weight: 700; min-width: 30px; text-align: center;">${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)" style="width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 8px; background: var(--bg); cursor: pointer; font-weight: bold; font-size: 1rem;">+</button>
                        </div>
                    </div>
                    <div style="text-align: right; min-width: 90px;">
                        <div style="font-weight: 800; font-size: 1.2rem; color: var(--primary); margin-bottom: 12px;">₹${itemTotal}</div>
                        <button onclick="removeItem(${index})" style="background: none; border: none; color: #E53935; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 4px; margin-left: auto;">
                            <i class="fas fa-trash-alt"></i> ${isTa ? 'நீக்கு' : 'Remove'}
                        </button>
                    </div>
                </div>
                `;
            }).join('');
        }
    }

    // Always update financial summary numbers on ANY page (cart.html, checkout.html, etc.)
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (deliveryEl) {
        deliveryEl.innerHTML = deliveryFee === 0 ? '<span style="color: var(--primary); font-weight: 700;">FREE</span>' : `₹${deliveryFee}`;
    }
    if (discountEl) discountEl.textContent = discount > 0 ? `-₹${discount}` : '₹0';
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (countEl) countEl.textContent = cart.reduce((sum, i) => sum + (parseInt(i.quantity, 10) || 1), 0);

    const summaryItemCountEl = document.getElementById('summaryItemCount');
    if (summaryItemCountEl) summaryItemCountEl.textContent = cart.reduce((sum, i) => sum + (parseInt(i.quantity, 10) || 1), 0);

    if (couponStatusEl) {
        if (appliedCoupon) {
            couponStatusEl.innerHTML = `
                <div style="background: #E8F5E9; color: var(--primary-dark); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span><i class="fas fa-tag"></i> <strong>${appliedCoupon.code}</strong> (${appliedCoupon.desc})</span>
                    <button onclick="removeCoupon()" style="background: none; border: none; color: #E53935; cursor: pointer; font-weight: bold;">✕</button>
                </div>
            `;
        } else {
            couponStatusEl.innerHTML = '';
        }
    }

    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
    saveCart();
}

// Update quantity
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    }
}

// Remove item
function removeItem(index) {
    if (cart[index]) {
        const name = cart[index].name;
        cart.splice(index, 1);
        updateCartUI();
        showNotification(`${name} removed from cart`, 'fas fa-trash-alt');
    }
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        appliedCoupon = null;
        updateCartUI();
        showNotification('Cart cleared successfully', 'fas fa-check');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    try {
        const s = localStorage.getItem('farmToForkCart');
        if (s) { cart = JSON.parse(s); window.cart = cart; }
    } catch(e){}

    if (!Array.isArray(cart) || cart.length === 0) {
        if (typeof showNotification === 'function') {
            showNotification('Your cart is empty! Add products first.', 'fas fa-shopping-cart');
        } else {
            alert('Your cart is empty! Add products first.');
        }
        return;
    }
    const isPages = window.location.pathname.includes('/pages/');
    window.location.href = isPages ? 'checkout.html' : 'pages/checkout.html';
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});