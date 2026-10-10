// ============================================
// RECENTLY ACCESSED ENGINE
// Farm to Fork Collective
// Tracks viewed products & traced batches in localStorage
// ============================================

(function(window) {
    'use strict';

    const STORAGE_KEY_PRODUCTS = 'ftf_recent_products';
    const STORAGE_KEY_BATCHES = 'ftf_recent_batches';
    const MAX_ITEMS = 6;

    const FTF_Recent = {
        // ----------------------------------------
        // 1. TRACK A VIEWED PRODUCT
        // ----------------------------------------
        trackProduct(product) {
            if (!product || !product.id) return;
            try {
                let list = this.getRecentProducts();
                // Remove if already exists (to move to top)
                list = list.filter(p => p.id !== product.id);
                // Insert at front
                list.unshift({
                    id: product.id,
                    name: product.name,
                    nameTamil: product.productNameTamil || product.nameTamil || '',
                    category: product.category,
                    price: product.price,
                    unit: product.unit || 'kg',
                    image: product.image,
                    badge: product.badge || '🌿 Organic',
                    freshness: product.freshness || 'Fresh',
                    viewedAt: new Date().toISOString()
                });
                if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
                localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
                this.refreshUI();
            } catch (e) {
                console.warn('[FTF_Recent] Failed to save recent product:', e);
            }
        },

        // ----------------------------------------
        // 2. TRACK A TRACED BATCH
        // ----------------------------------------
        trackBatch(batch) {
            if (!batch || !batch.batchCode) return;
            try {
                let list = this.getRecentBatches();
                list = list.filter(b => b.batchCode !== batch.batchCode);
                list.unshift({
                    batchCode: batch.batchCode,
                    productName: batch.productName || 'Organic Produce',
                    farmerName: batch.farmerName || 'Verified Farm',
                    farmLocation: batch.farmLocation || 'Tamil Nadu',
                    timestamp: new Date().toISOString()
                });
                if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
                localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(list));
                this.refreshUI();
            } catch (e) {
                console.warn('[FTF_Recent] Failed to save recent batch:', e);
            }
        },

        // ----------------------------------------
        // 3. RETRIEVE RECENT ITEMS
        // ----------------------------------------
        getRecentProducts() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },

        getRecentBatches() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_BATCHES);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },

        clearHistory() {
            localStorage.removeItem(STORAGE_KEY_PRODUCTS);
            localStorage.removeItem(STORAGE_KEY_BATCHES);
            this.refreshUI();
        },

        // ----------------------------------------
        // 4. RENDER RECENTLY VIEWED CONTAINER
        // ----------------------------------------
        render(containerId = 'recentlyAccessedContainer') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
            const products = this.getRecentProducts();
            const batches = this.getRecentBatches();

            if (products.length === 0 && batches.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 28px 16px; color: var(--text-light); background: rgba(0,0,0,0.02); border-radius: 16px; border: 1.5px dashed rgba(0,0,0,0.08);">
                        <i class="fas fa-history" style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;"></i>
                        <p style="font-size: 0.95rem; margin: 0;">
                            ${isTa ? 'நீங்கள் சமீபத்தில் எந்த பொருட்களையும் பார்க்கவில்லை. விளைபொருட்களை உலாவ தொடங்குங்கள்!' : 'No recently viewed items yet. Start exploring our organic farm catalog!'}
                        </p>
                    </div>
                `;
                return;
            }

            const isPages = window.location.pathname.includes('/pages/');
            const basePath = isPages ? '' : 'pages/';

            let html = `
                <div class="recently-accessed-wrapper" style="margin: 25px 0 35px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                        <h3 style="font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: var(--text); margin: 0;">
                            <span style="display: inline-flex; width: 32px; height: 32px; border-radius: 50%; background: #e8f5e9; color: var(--primary); align-items: center; justify-content: center; font-size: 0.95rem;">
                                <i class="fas fa-history"></i>
                            </span>
                            ${isTa ? 'சமீபத்தில் நீங்கள் பார்த்தவை' : 'Recently Accessed by You'}
                        </h3>
                        <button onclick="window.FTF_Recent.clearHistory()" style="background: none; border: none; color: #ef4444; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px;">
                            <i class="fas fa-trash-alt"></i> ${isTa ? 'வரலாற்றை அழி' : 'Clear History'}
                        </button>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
            `;

            // Render Products
            products.forEach(p => {
                const displayName = isTa && p.nameTamil ? p.nameTamil : p.name;
                const clean = (p.image || '').replace(/^\/+/, '');
                const imgSrc = typeof window.getProductImagePath === 'function' ? window.getProductImagePath(p.image) : (isPages ? '../' + clean : clean);
                const detailUrl = `${basePath}product-details.html?id=${p.id}`;

                html += `
                    <div class="recent-card" onclick="window.location.href='${detailUrl}'" style="background: var(--white, #fff); border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; gap: 12px; align-items: center;">
                        <img src="${imgSrc}" alt="${p.name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; flex-shrink: 0;" onerror="this.src='https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'">
                        <div style="overflow: hidden; flex: 1;">
                            <div style="font-size: 0.7rem; color: var(--primary, #15803d); font-weight: 700; text-transform: uppercase;">${p.category}</div>
                            <h4 style="font-size: 0.9rem; font-weight: 700; margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text, #1e293b);">${displayName}</h4>
                            <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-dark, #166534);">₹${p.price} <span style="font-size: 0.75rem; font-weight: 500; color: #64748b;">/${p.unit}</span></div>
                        </div>
                    </div>
                `;
            });

            // Render Batches if any
            batches.forEach(b => {
                const traceUrl = `${basePath}seed-to-plate.html?batch=${b.batchCode}`;
                html += `
                    <div class="recent-card" onclick="window.location.href='${traceUrl}'" style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border-radius: 12px; padding: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #86efac; cursor: pointer; transition: transform 0.2s; display: flex; gap: 12px; align-items: center;">
                        <div style="width: 60px; height: 60px; border-radius: 8px; background: #22c55e; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
                            <i class="fas fa-qrcode"></i>
                        </div>
                        <div style="overflow: hidden; flex: 1;">
                            <div style="font-size: 0.7rem; color: #15803d; font-weight: 700; text-transform: uppercase;">${isTa ? 'சரிபார்க்கப்பட்ட தொகுதி' : 'Verified Batch'}</div>
                            <h4 style="font-size: 0.85rem; font-weight: 800; margin: 2px 0; color: #0f172a; font-family: monospace;">${b.batchCode}</h4>
                            <div style="font-size: 0.75rem; color: #475569;">${b.farmerName} • ${b.farmLocation}</div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;

            container.innerHTML = html;
        },

        refreshUI() {
            this.render('recentlyAccessedContainer');
            this.render('recentlyAccessedShopContainer');
            this.render('recentlyAccessedCustContainer');
        },

        // ----------------------------------------
        // 5. AUTO-HOOK CLICKS ON PRODUCTS AND BATCHES
        // ----------------------------------------
        init() {
            const urlParams = new URLSearchParams(window.location.search);
            const prodId = urlParams.get('id');
            const batchCode = urlParams.get('batch');

            if (prodId && window.products) {
                const found = window.products.find(p => p.id == prodId);
                if (found) this.trackProduct(found);
            }

            if (batchCode) {
                this.trackBatch({
                    batchCode: batchCode,
                    productName: 'Traced Product',
                    farmerName: 'Verified Organic Farmer',
                    farmLocation: 'Tamil Nadu'
                });
            }

            // Hook global click delegation for product cards
            document.addEventListener('click', (e) => {
                const card = e.target.closest('[data-product-id]');
                if (card && window.products) {
                    const pid = parseInt(card.dataset.productId, 10);
                    const prod = window.products.find(p => p.id === pid);
                    if (prod) this.trackProduct(prod);
                }
            });

            this.refreshUI();
        }
    };

    window.FTF_Recent = FTF_Recent;

    document.addEventListener('DOMContentLoaded', function() {
        FTF_Recent.init();
    });

})(window);
