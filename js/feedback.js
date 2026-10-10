// ============================================
// CUSTOMER FEEDBACK & FARMER/ARTISAN REPLY ENGINE
// Farm to Fork Collective
// Threaded reviews, verified farmer replies, bilingual support
// ============================================

(function(window) {
    'use strict';

    function getApiBase() {
        if (window.FTF_API && window.FTF_API.baseUrl) return window.FTF_API.baseUrl;
        if (typeof window.VITE_API_URL === 'string' && window.VITE_API_URL !== '') {
            return `${window.VITE_API_URL.replace(/\/+$/, '')}/api`;
        }
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:5000/api';
        }
        return '/api';
    }

    const FTF_Feedback = {
        async getReviews(productId) {
            try {
                const base = getApiBase();
                const url = productId 
                    ? `${base}/community/reviews?productId=${productId}`
                    : `${base}/community/reviews`;
                const res = await fetch(url);
                const data = await res.json();
                return (data && data.success && Array.isArray(data.reviews)) ? data.reviews : [];
            } catch (e) {
                console.warn('[FTF_Feedback] Offline or API unreachable, checking local database:', e);
                return [];
            }
        },

        async submitReview(productId, rating, comment, userName) {
            try {
                const user = JSON.parse(localStorage.getItem('farmToForkUser') || '{}');
                const author = userName || user.name || localStorage.getItem('userName') || 'Conscious Consumer';
                const base = getApiBase();
                const res = await fetch(`${base}/community/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: parseInt(productId, 10),
                        userName: author,
                        rating: parseInt(rating, 10) || 5,
                        comment: comment.trim()
                    })
                });
                return await res.json();
            } catch (e) {
                console.error('[FTF_Feedback] Error submitting review:', e);
                return { success: false, message: e.message };
            }
        },

        async submitReply(reviewId, replyText, author, role) {
            try {
                const user = JSON.parse(localStorage.getItem('farmToForkUser') || '{}');
                const replyAuthor = author || user.name || localStorage.getItem('userName') || 'Verified Farmer';
                const replyRole = role || user.role || localStorage.getItem('userRole') || 'farmer';
                const base = getApiBase();

                const res = await fetch(`${base}/community/reviews/${reviewId}/reply`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        author: replyAuthor,
                        role: replyRole,
                        replyText: replyText.trim()
                    })
                });
                return await res.json();
            } catch (e) {
                console.error('[FTF_Feedback] Error submitting farmer reply:', e);
                return { success: false, message: e.message };
            }
        },

        // Render reviews list with threaded replies
        async renderProductReviews(productId, containerId = 'productReviewsList') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
            const userRole = localStorage.getItem('userRole') || 'customer';
            const canReply = userRole === 'farmer' || userRole === 'artisan' || userRole === 'admin';

            const reviews = await this.getReviews(productId);

            if (reviews.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 28px; color: var(--text-light); background: rgba(0,0,0,0.02); border-radius: 14px; border: 1px dashed var(--border, #cbd5e1);">
                        <i class="fas fa-comment-dots" style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4;"></i>
                        <p style="margin: 0; font-size: 0.95rem;">
                            ${isTa ? 'இந்த விளைபொருளுக்கு இன்னும் கருத்துக்கள் இல்லை. உங்கள் முதல் அனுபவத்தைப் பகிருங்கள்!' : 'No customer reviews yet. Be the first to share your farm-fresh experience!'}
                        </p>
                    </div>
                `;
                return;
            }

            container.innerHTML = reviews.map(r => {
                const stars = '★'.repeat(r.rating) + '☆'.repeat(Math.max(0, 5 - r.rating));
                const replies = r.replies || [];

                const repliesHtml = replies.map(rep => `
                    <div class="farmer-reply-box" style="margin-top: 12px; margin-left: 20px; background: rgba(45, 106, 79, 0.08); border-left: 3px solid var(--primary, #2D6A4F); padding: 12px 16px; border-radius: 0 12px 12px 0;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="font-size: 1.1rem;">${rep.role === 'artisan' ? '🧺' : '👨‍🌾'}</span>
                            <strong style="font-size: 0.85rem; color: var(--primary-dark, #1B4332);">${rep.author}</strong>
                            <span style="font-size: 0.7rem; background: var(--primary, #2D6A4F); color: white; padding: 2px 8px; border-radius: 12px; font-weight: 700; text-transform: uppercase;">
                                ${isTa ? (rep.role === 'artisan' ? 'கைவினைஞர் பதில்' : 'விவசாயி பதில்') : (rep.role === 'artisan' ? 'Artisan Reply' : 'Farmer Reply')}
                            </span>
                            <span style="font-size: 0.72rem; color: var(--text-light); margin-left: auto;">${rep.date || 'Recent'}</span>
                        </div>
                        <p style="margin: 0; font-size: 0.88rem; color: var(--text); line-height: 1.5;">${rep.replyText}</p>
                    </div>
                `).join('');

                const replyFormHtml = canReply ? `
                    <div style="margin-top: 10px; margin-left: 20px;">
                        <button onclick="document.getElementById('reply-form-${r.id}').style.display='block'; this.style.display='none';" class="btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; border-radius: 8px; border: 1px solid var(--primary);">
                            <i class="fas fa-reply"></i> ${isTa ? 'வாடிக்கையாளருக்கு பதில் அளிக்கவும்' : 'Reply to Customer'}
                        </button>
                        <div id="reply-form-${r.id}" style="display: none; margin-top: 8px;">
                            <textarea id="reply-input-${r.id}" rows="2" placeholder="${isTa ? 'விவசாயி / கைவினைஞர் பதிலை இங்கே உள்ளிடவும்...' : 'Write official farmer/artisan reply...'}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-family: inherit; font-size: 0.88rem; box-sizing: border-box;"></textarea>
                            <div style="display: flex; gap: 8px; margin-top: 6px;">
                                <button onclick="FTF_Feedback.handleReplySubmit('${r.id}', ${productId})" class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem; border-radius: 8px;">
                                    ${isTa ? 'பதில் அனுப்புக' : 'Post Reply'}
                                </button>
                                <button onclick="document.getElementById('reply-form-${r.id}').style.display='none'; this.parentElement.previousElementSibling.previousElementSibling.style.display='inline-block';" class="btn-secondary" style="padding: 6px 14px; font-size: 0.8rem; border-radius: 8px;">
                                    ${isTa ? 'ரத்து' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                ` : '';

                return `
                    <div class="review-item-card" style="background: var(--card-bg, #ffffff); border: 1px solid var(--border, rgba(0,0,0,0.07)); border-radius: 14px; padding: 16px; margin-bottom: 16px; box-shadow: var(--shadow);">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background: #e8f5e9; color: #166534; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                                    ${(r.userName || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <strong style="font-size: 0.95rem; color: var(--text);">${r.userName || 'Customer'}</strong>
                                    <span style="display: inline-block; font-size: 0.7rem; background: #dcfce7; color: #15803d; padding: 1px 6px; border-radius: 4px; margin-left: 6px; font-weight: 600;">
                                        <i class="fas fa-check-circle"></i> ${isTa ? 'சரிபார்க்கப்பட்ட வாங்குபவர்' : 'Verified Buyer'}
                                    </span>
                                </div>
                            </div>
                            <span style="font-size: 0.78rem; color: var(--text-light);">${r.date || 'Recent'}</span>
                        </div>
                        <div style="color: #f59e0b; font-size: 0.95rem; margin-bottom: 6px;">${stars}</div>
                        <p style="color: var(--text); font-size: 0.92rem; line-height: 1.5; margin-bottom: 4px;">${r.comment}</p>
                        ${repliesHtml}
                        ${replyFormHtml}
                    </div>
                `;
            }).join('');
        },

        async handleReplySubmit(reviewId, productId) {
            const input = document.getElementById(`reply-input-${reviewId}`);
            if (!input || !input.value.trim()) return;

            const res = await this.submitReply(reviewId, input.value.trim());
            if (res && res.success) {
                if (typeof window.showNotification === 'function') {
                    const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
                    window.showNotification(isTa ? 'விவசாயி பதில் பதிவு செய்யப்பட்டது! ✅' : 'Farmer reply posted successfully! ✅');
                }
                this.renderProductReviews(productId);
            }
        }
    };

    window.FTF_Feedback = FTF_Feedback;

})(window);
