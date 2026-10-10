// ============================================
// BILINGUAL AI FARM & NUTRITION ASSISTANT CHATBOT
// Farm to Fork Collective
// Supports English & தமிழ் Natural Language Queries
// Seed-to-Plate Traceability & Nutrition Recommendation
// ============================================

(function(window) {
    'use strict';

    const BOT_AVATAR = '🌱';
    const USER_AVATAR = '👤';

    // Knowledge base for instant intelligent organic advice
    const KNOWLEDGE_BASE = {
        trace: {
            keywordsEn: ['trace', 'batch', 'seed to plate', 'journey', 'born to delivery', 'farm origin', 'where from'],
            keywordsTa: ['பயணம்', 'விதையிலிருந்து', 'எங்கே', 'தோட்டம்', 'தொகுதி', 'கண்காணி', 'அறுவடை'],
            responseEn: '🔍 You can trace any product batch directly using our Blockchain-verified Seed to Plate ledger! For example, batch <strong>FTF-TOM-2024-001</strong> was harvested at Green Valley Farm, Dindigul, and transported in a 4.2°C cold-chain vehicle.',
            responseTa: '🔍 நமது பிளாக்செயின் சான்றளிக்கப்பட்ட "விதையிலிருந்து தட்டு வரை" முறையில் எந்தவொரு உணவுத் தொகுதியையும் கண்காணிக்கலாம்! உதாரணத்திற்கு <strong>FTF-TOM-2024-001</strong> தொகுதி திண்டுக்கல் பசுமைப் பண்ணையில் இயற்கை முறையில் அறுவடை செய்யப்பட்டு 4.2°C குளிர்சங்கிலி வாகனத்தில் கொண்டுவரப்பட்டது.',
            batchLink: 'pages/seed-to-plate.html?batch=FTF-TOM-2024-001'
        },
        nutrition: {
            keywordsEn: ['iron', 'vitamin', 'nutrition', 'healthy', 'weight loss', 'immunity', 'calcium', 'protein'],
            keywordsTa: ['ஊட்டச்சத்து', 'இரும்புச்சத்து', 'வைட்டமின்', 'உடல் நலம்', 'நோய் எதிர்ப்பு', 'புரதம்'],
            responseEn: '🥗 <strong>Organic Nutrition Recommendations:</strong><br>• <strong>Iron:</strong> Organic Spinach (பசலைக் கீரை) & Traditional Brown Rice<br>• <strong>Vitamin C:</strong> Vine-ripened Organic Tomatoes & Fresh Oranges<br>• <strong>Immunity:</strong> Pure Jawadhu Hills Forest Honey & Erode Organic Turmeric.',
            responseTa: '🥗 <strong>இயற்கை ஊட்டச்சத்து பரிந்துரைகள்:</strong><br>• <strong>இரும்புச்சத்து:</strong> இயற்கை பசலைக் கீரை & பாரம்பரிய கைக்குத்தல் அரிசி<br>• <strong>வைட்டமின் சி:</strong> இயற்கை தக்காளி & புதிய ஆரஞ்சு பழங்கள்<br>• <strong>நோய் எதிர்ப்பு சக்தி:</strong> ஜவ்வாது மலை காட்டுத் தேன் & ஈரோடு இயற்கை மஞ்சள்.'
        },
        groupBuying: {
            keywordsEn: ['group buying', 'discount', 'bulk', 'cheap', 'save money', 'neighbors', 'offer'],
            keywordsTa: ['குழு கொள்முதல்', 'தள்ளுபடி', 'மலிவு', 'சேமிப்பு', 'மொத்தமாக', 'அக்கம் பக்கம்'],
            responseEn: '🛒 <strong>Group Buying Pooling:</strong> When neighbors in your pin code aggregate orders together, delivery costs drop to zero and farm prices drop by up to <strong>35% to 50%</strong> direct from the farmers!',
            responseTa: '🛒 <strong>குழு கொள்முதல் திட்டம்:</strong> உங்கள் பகுதியில் உள்ள குடும்பங்கள் ஒன்றிணைந்து மொத்தமாக ஆர்டர் செய்யும்போது போக்குவரத்து செலவு பூஜ்ஜியமாகி, விவசாயிகளிடமிருந்து நேரடியாக <strong>35% முதல் 50%</strong> வரை விலை தள்ளுபடி கிடைக்கும்!'
        },
        kitchen: {
            keywordsEn: ['community kitchen', 'cook', 'meals', 'zero waste', 'surplus'],
            keywordsTa: ['சமுதாய சமையலறை', 'சமையல்', 'உணவு', 'கழிவு இல்லா', 'பகிர்வு'],
            responseEn: '🍲 <strong>Community Kitchens:</strong> Local neighborhood kitchens that cook fresh, wholesome meals using Grade-B organic surplus produce, eliminating food waste while delivering meals at 40% lower cost.',
            responseTa: '🍲 <strong>சமுதாய சமையலறை:</strong> இயற்கை விவசாயிகளிடம் இருந்து பெறப்படும் கூடுதல் காய்கறிகளை வீணாக்காமல் சுவையான சத்தான உணவுகளாக சமைத்து பகிர்ந்தளிக்கும்Zero-Waste திட்டம்.'
        }
    };

    class FarmToForkChatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.initUI();
            this.bindEvents();
        }

        getLang() {
            return localStorage.getItem('ftf_lang') || 'en';
        }

        initUI() {
            if (document.getElementById('ftfChatbotWrapper')) return;

            const isTa = this.getLang() === 'ta';

            const wrapper = document.createElement('div');
            wrapper.id = 'ftfChatbotWrapper';
            wrapper.innerHTML = `
                <!-- Floating Chat Trigger Button -->
                <button id="ftfChatTrigger" class="ftf-chat-trigger" title="${isTa ? 'உழவர் AI உதவியாளருடன் உரையாடவும்' : 'Chat with Farm AI Assistant'}">
                    <span class="chat-icon-bubble">🌱</span>
                    <span class="chat-badge-pulse"></span>
                    <span class="chat-trigger-label">${isTa ? 'உழவர் AI' : 'Farm AI'}</span>
                </button>

                <!-- Chat Window Box -->
                <div id="ftfChatWindow" class="ftf-chat-window" style="display: none;">
                    <div class="ftf-chat-header">
                        <div class="ftf-chat-header-info">
                            <span class="ftf-bot-avatar">🌱</span>
                            <div>
                                <h4 class="ftf-chat-title">${isTa ? 'உழவர் & ஊட்டச்சத்து AI' : 'Farm & Nutrition AI'}</h4>
                                <span class="ftf-chat-status">
                                    <span class="status-dot"></span> ${isTa ? 'நேரலை உதவியாளர்' : 'Online Assistant'}
                                </span>
                            </div>
                        </div>
                        <div class="ftf-chat-header-actions">
                            <button id="ftfChatCloseBtn" class="chat-header-btn" title="Close">✕</button>
                        </div>
                    </div>

                    <!-- Quick Chips -->
                    <div class="ftf-chat-chips">
                        <button class="chat-chip" data-q="trace">${isTa ? '🌿 தக்காளி பயணம்' : '🌿 Trace Tomatoes'}</button>
                        <button class="chat-chip" data-q="nutrition">${isTa ? '🥗 ஊட்டச்சத்து' : '🥗 Nutrition'}</button>
                        <button class="chat-chip" data-q="group">${isTa ? '🛒 குழு கொள்முதல்' : '🛒 Group Buying'}</button>
                        <button class="chat-chip" data-q="farmers">${isTa ? '🌾 விவசாயிகள்' : '🌾 Farmers'}</button>
                    </div>

                    <!-- Message Body -->
                    <div id="ftfChatMessages" class="ftf-chat-messages"></div>

                    <!-- Input Bar -->
                    <form id="ftfChatForm" class="ftf-chat-input-bar">
                        <input type="text" id="ftfChatInput" placeholder="${isTa ? 'எ.கா: தக்காளி பயணம் எங்கே? அல்லது FTF-TOM...' : 'Ask about nutrition, traceability, or batch code...'}" autocomplete="off" />
                        <button type="submit" id="ftfChatSendBtn" title="Send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            `;

            document.body.appendChild(wrapper);
            this.injectStyles();

            // Initial welcome greeting
            const welcomeText = isTa 
                ? 'வணக்கம்! 🙏 நான் உங்கள் இயற்கை பண்ணை மற்றும் ஊட்டச்சத்து AI உதவியாளர். உணவு கண்காணிப்பு, தக்காளி தொகுதி விவரங்கள், ஊட்டச்சத்து அல்லது குழு கொள்முதல் பற்றி என்னிடம் கேளுங்கள்!'
                : 'Hello! 👋 I am your Farm to Fork Organic & Nutrition AI. Ask me about batch traceability (e.g. FTF-TOM-2024-001), nutrient recommendations, or farmer direct pricing!';
            
            this.addBotMessage(welcomeText);
        }

        injectStyles() {
            if (document.getElementById('ftfChatbotStyles')) return;
            const style = document.createElement('style');
            style.id = 'ftfChatbotStyles';
            style.textContent = `
                .ftf-chat-trigger {
                    position: fixed;
                    bottom: 24px;
                    left: 24px;
                    z-index: 99999;
                    background: var(--btn-primary-bg, linear-gradient(135deg, var(--primary, #15803d), var(--primary-dark, #166534)));
                    color: var(--btn-primary-text, white) !important;
                    border: none;
                    border-radius: 50px;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
                    cursor: pointer;
                    font-weight: 700;
                    font-family: inherit;
                    font-size: 0.95rem;
                    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease, background 0.3s ease;
                }
                .ftf-chat-trigger:hover {
                    transform: translateY(-4px) scale(1.03);
                    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
                    background: var(--btn-primary-hover, linear-gradient(135deg, var(--primary-light, #22c55e), var(--primary, #16a34a)));
                }
                .chat-icon-bubble {
                    font-size: 1.3rem;
                }
                .chat-badge-pulse {
                    position: absolute;
                    top: 4px;
                    right: 6px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: var(--accent, #4ade80);
                    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
                    animation: pulseRing 1.8s infinite;
                }
                @keyframes pulseRing {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
                }
                .ftf-chat-window {
                    position: fixed;
                    bottom: 90px;
                    left: 24px;
                    width: 380px;
                    max-width: calc(100vw - 48px);
                    height: 520px;
                    max-height: calc(100vh - 120px);
                    background: var(--card-bg, #ffffff);
                    color: var(--text, #1B2E24);
                    border-radius: 20px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
                    animation: chatWindowPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes chatWindowPop {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .ftf-chat-header {
                    background: var(--btn-primary-bg, linear-gradient(135deg, var(--primary, #15803d), var(--primary-dark, #14532d)));
                    color: var(--btn-primary-text, white);
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background 0.3s ease;
                }
                .ftf-chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .ftf-bot-avatar {
                    font-size: 1.6rem;
                    background: rgba(255, 255, 255, 0.2);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ftf-chat-title {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 800;
                    color: inherit;
                }
                .ftf-chat-status {
                    font-size: 0.75rem;
                    opacity: 0.9;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--accent, #4ade80);
                    display: inline-block;
                }
                .chat-header-btn {
                    background: rgba(255, 255, 255, 0.18);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }
                .chat-header-btn:hover {
                    background: rgba(255, 255, 255, 0.35);
                }
                .ftf-chat-chips {
                    display: flex;
                    gap: 6px;
                    padding: 8px 12px;
                    background: var(--bg-secondary, #f8fafc);
                    border-bottom: 1px solid var(--border-light, #e2e8f0);
                    overflow-x: auto;
                    white-space: nowrap;
                }
                .chat-chip {
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border, #cbd5e1);
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text, #334155);
                    cursor: pointer;
                    flex-shrink: 0;
                    transition: all 0.2s;
                }
                .chat-chip:hover {
                    background: var(--bg-tertiary, #dcfce7);
                    border-color: var(--primary, #86efac);
                    color: var(--primary, #166534);
                }
                .ftf-chat-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: var(--bg, #fdfbf7);
                }
                .chat-msg {
                    max-width: 85%;
                    padding: 10px 14px;
                    border-radius: 14px;
                    font-size: 0.88rem;
                    line-height: 1.45;
                    word-break: break-word;
                }
                .chat-msg.bot {
                    align-self: flex-start;
                    background: var(--card-bg, #ffffff);
                    color: var(--text, #1e293b);
                    border-bottom-left-radius: 2px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid var(--border-light, #f1f5f9);
                }
                .chat-msg.user {
                    align-self: flex-end;
                    background: var(--btn-primary-bg, linear-gradient(135deg, var(--primary, #15803d), var(--primary-dark, #166534)));
                    color: var(--btn-primary-text, white) !important;
                    border-bottom-right-radius: 2px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .ftf-chat-input-bar {
                    display: flex;
                    padding: 10px 12px;
                    background: var(--card-bg, white);
                    border-top: 1px solid var(--border-light, #e2e8f0);
                    gap: 8px;
                }
                .ftf-chat-input-bar input {
                    flex: 1;
                    background: var(--input-bg, white);
                    color: var(--input-text, var(--text, #1B2E24));
                    border: 1.5px solid var(--input-border, var(--border, #e2e8f0));
                    border-radius: 24px;
                    padding: 8px 16px;
                    font-size: 0.88rem;
                    outline: none;
                    font-family: inherit;
                    transition: border-color 0.2s;
                }
                .ftf-chat-input-bar input:focus {
                    border-color: var(--border-focus, var(--primary, #15803d));
                }
                .ftf-chat-input-bar button {
                    background: var(--primary, #15803d);
                    color: var(--btn-primary-text, white);
                    border: none;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.15s ease;
                }
                .ftf-chat-input-bar button:hover {
                    background: var(--primary-dark, #166534);
                    transform: scale(1.05);
                }

                /* --- Explicit Theme Tuning for Farm AI --- */
                /* Emerald Green */
                body[data-theme="emerald"] .ftf-chat-trigger,
                body[data-theme="emerald"] .ftf-chat-header {
                    background: linear-gradient(135deg, #16a34a, #15803d) !important;
                    color: #ffffff !important;
                    box-shadow: 0 10px 25px rgba(22, 163, 74, 0.4) !important;
                }
                body[data-theme="emerald"] .chat-badge-pulse {
                    background: #4ade80 !important;
                }

                /* Midnight Dark */
                body[data-theme="midnight"] .ftf-chat-trigger,
                body.dark-theme .ftf-chat-trigger,
                body[data-theme="midnight"] .ftf-chat-header,
                body.dark-theme .ftf-chat-header {
                    background: linear-gradient(135deg, #22c55e, #16a34a) !important;
                    color: #081C15 !important;
                    box-shadow: 0 10px 25px rgba(34, 197, 94, 0.45) !important;
                }
                body[data-theme="midnight"] .chat-badge-pulse,
                body.dark-theme .chat-badge-pulse {
                    background: #86efac !important;
                }
                body[data-theme="midnight"] .ftf-chat-window,
                body.dark-theme .ftf-chat-window {
                    background: #14271F !important;
                    color: #F1FBF5 !important;
                    border-color: rgba(116, 198, 157, 0.25) !important;
                }
                body[data-theme="midnight"] .ftf-chat-messages,
                body.dark-theme .ftf-chat-messages {
                    background: #0B1712 !important;
                }
                body[data-theme="midnight"] .chat-msg.bot,
                body.dark-theme .chat-msg.bot {
                    background: #172F24 !important;
                    color: #F1FBF5 !important;
                    border-color: rgba(116, 198, 157, 0.18) !important;
                }
                body[data-theme="midnight"] .chat-msg.user,
                body.dark-theme .chat-msg.user {
                    background: linear-gradient(135deg, #22c55e, #16a34a) !important;
                    color: #081C15 !important;
                }
                body[data-theme="midnight"] .chat-chip,
                body.dark-theme .chat-chip {
                    background: #172F24 !important;
                    color: #A5CBB8 !important;
                    border-color: rgba(116, 198, 157, 0.25) !important;
                }
                body[data-theme="midnight"] .ftf-chat-input-bar,
                body.dark-theme .ftf-chat-input-bar {
                    background: #14271F !important;
                    border-color: rgba(116, 198, 157, 0.2) !important;
                }
                body[data-theme="midnight"] .ftf-chat-input-bar input,
                body.dark-theme .ftf-chat-input-bar input {
                    background: #11231B !important;
                    color: #F1FBF5 !important;
                    border-color: rgba(116, 198, 157, 0.3) !important;
                }
                body[data-theme="midnight"] #ftfChatSendBtn,
                body.dark-theme #ftfChatSendBtn {
                    background: #22c55e !important;
                    color: #081C15 !important;
                }

                /* Golden Harvest */
                body[data-theme="harvest"] .ftf-chat-trigger,
                body[data-theme="harvest"] .ftf-chat-header {
                    background: linear-gradient(135deg, #D97706, #B45309) !important;
                    color: #ffffff !important;
                    box-shadow: 0 10px 25px rgba(217, 119, 6, 0.45) !important;
                }
                body[data-theme="harvest"] .chat-badge-pulse {
                    background: #FBBF24 !important;
                }
                body[data-theme="harvest"] .chat-msg.user {
                    background: linear-gradient(135deg, #D97706, #B45309) !important;
                    color: #ffffff !important;
                }
                body[data-theme="harvest"] #ftfChatSendBtn {
                    background: #B45309 !important;
                    color: #ffffff !important;
                }
                body[data-theme="harvest"] .chat-chip:hover {
                    background: #FEF3C7 !important;
                    color: #B45309 !important;
                    border-color: #D97706 !important;
                }

                /* Nordic Ocean */
                body[data-theme="oceanic"] .ftf-chat-trigger,
                body[data-theme="oceanic"] .ftf-chat-header {
                    background: linear-gradient(135deg, #0284C7, #0369A1) !important;
                    color: #ffffff !important;
                    box-shadow: 0 10px 25px rgba(2, 132, 199, 0.45) !important;
                }
                body[data-theme="oceanic"] .chat-badge-pulse {
                    background: #38BDF8 !important;
                }
                body[data-theme="oceanic"] .chat-msg.user {
                    background: linear-gradient(135deg, #0284C7, #0369A1) !important;
                    color: #ffffff !important;
                }
                body[data-theme="oceanic"] #ftfChatSendBtn {
                    background: #0284C7 !important;
                    color: #ffffff !important;
                }
                body[data-theme="oceanic"] .chat-chip:hover {
                    background: #E0F2FE !important;
                    color: #0369A1 !important;
                    border-color: #0284C7 !important;
                }

                /* Royal Vineyard */
                body[data-theme="vineyard"] .ftf-chat-trigger,
                body[data-theme="vineyard"] .ftf-chat-header {
                    background: linear-gradient(135deg, #9333EA, #7E22CE) !important;
                    color: #ffffff !important;
                    box-shadow: 0 10px 25px rgba(126, 34, 206, 0.45) !important;
                }
                body[data-theme="vineyard"] .chat-badge-pulse {
                    background: #C084FC !important;
                }
                body[data-theme="vineyard"] .chat-msg.user {
                    background: linear-gradient(135deg, #9333EA, #7E22CE) !important;
                    color: #ffffff !important;
                }
                body[data-theme="vineyard"] #ftfChatSendBtn {
                    background: #7E22CE !important;
                    color: #ffffff !important;
                }
                body[data-theme="vineyard"] .chat-chip:hover {
                    background: #F3E8FF !important;
                    color: #7E22CE !important;
                    border-color: #9333EA !important;
                }

                /* Rustic Espresso */
                body[data-theme="espresso"] .ftf-chat-trigger,
                body[data-theme="espresso"] .ftf-chat-header {
                    background: linear-gradient(135deg, #92400E, #78350F) !important;
                    color: #ffffff !important;
                    box-shadow: 0 10px 25px rgba(120, 53, 15, 0.45) !important;
                }
                body[data-theme="espresso"] .chat-badge-pulse {
                    background: #FBBF24 !important;
                }
                body[data-theme="espresso"] .chat-msg.user {
                    background: linear-gradient(135deg, #92400E, #78350F) !important;
                    color: #ffffff !important;
                }
                body[data-theme="espresso"] #ftfChatSendBtn {
                    background: #78350F !important;
                    color: #ffffff !important;
                }
                body[data-theme="espresso"] .chat-chip:hover {
                    background: #FEF3C7 !important;
                    color: #78350F !important;
                    border-color: #92400E !important;
                }
            `;
            document.head.appendChild(style);
        }

        bindEvents() {
            const trigger = document.getElementById('ftfChatTrigger');
            const windowEl = document.getElementById('ftfChatWindow');
            const closeBtn = document.getElementById('ftfChatCloseBtn');
            const form = document.getElementById('ftfChatForm');
            const input = document.getElementById('ftfChatInput');

            if (trigger) {
                trigger.onclick = () => {
                    this.isOpen = !this.isOpen;
                    windowEl.style.display = this.isOpen ? 'flex' : 'none';
                    if (this.isOpen) {
                        input.focus();
                        this.scrollToBottom();
                    }
                };
            }

            if (closeBtn) {
                closeBtn.onclick = () => {
                    this.isOpen = false;
                    windowEl.style.display = 'none';
                };
            }

            // Sync with global theme changes
            const handleTheme = () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('ftf_theme') || 'emerald';
                if (trigger) trigger.setAttribute('data-active-theme', currentTheme);
            };
            window.addEventListener('themeChanged', handleTheme);
            window.addEventListener('ftf:themeChanged', handleTheme);
            handleTheme();

            // Sync with global language changes
            const handleLang = (e) => {
                const lang = (e && e.detail && e.detail.lang) || this.getLang();
                const isTa = lang === 'ta';
                const label = trigger ? trigger.querySelector('.chat-trigger-label') : null;
                if (label) label.textContent = isTa ? 'உழவர் AI' : 'Farm AI';
                if (trigger) trigger.title = isTa ? 'உழவர் AI உதவியாளருடன் உரையாடவும்' : 'Chat with Farm AI Assistant';
            };
            window.addEventListener('languageChanged', handleLang);
            window.addEventListener('ftf:languageChanged', handleLang);

            if (form) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    const text = input.value.trim();
                    if (!text) return;
                    this.addUserMessage(text);
                    input.value = '';
                    this.processQuery(text);
                };
            }

            // Bind chip clicks
            document.querySelectorAll('.chat-chip').forEach(chip => {
                chip.onclick = () => {
                    const qType = chip.dataset.q;
                    const isTa = this.getLang() === 'ta';
                    let prompt = '';
                    if (qType === 'trace') prompt = isTa ? 'தக்காளி தொகுதி FTF-TOM-2024-001 பயணம் சொல்லுங்கள்' : 'Trace batch FTF-TOM-2024-001';
                    else if (qType === 'nutrition') prompt = isTa ? 'இரும்புச்சத்து நிறைந்த இயற்கை உணவு எது?' : 'What organic foods are high in iron and vitamins?';
                    else if (qType === 'group') prompt = isTa ? 'குழு கொள்முதல் எப்படி செயல்படுகிறது?' : 'How does group buying save 35%?';
                    else if (qType === 'farmers') prompt = isTa ? 'நமது இயற்கை விவசாயிகள் யார்?' : 'Who are our verified organic farmers in Tamil Nadu?';

                    this.addUserMessage(prompt);
                    this.processQuery(prompt);
                };
            });
        }

        addUserMessage(text) {
            this.messages.push({ sender: 'user', text });
            const box = document.getElementById('ftfChatMessages');
            if (box) {
                const div = document.createElement('div');
                div.className = 'chat-msg user';
                div.textContent = text;
                box.appendChild(div);
                this.scrollToBottom();
            }
        }

        addBotMessage(html) {
            this.messages.push({ sender: 'bot', text: html });
            const box = document.getElementById('ftfChatMessages');
            if (box) {
                const div = document.createElement('div');
                div.className = 'chat-msg bot';
                div.innerHTML = html;
                box.appendChild(div);
                this.scrollToBottom();
            }
        }

        scrollToBottom() {
            const box = document.getElementById('ftfChatMessages');
            if (box) {
                box.scrollTop = box.scrollHeight;
            }
        }

        async processQuery(rawQuery) {
            const isTa = this.getLang() === 'ta';
            const q = rawQuery.toLowerCase();

            // Simulate typing delay
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-msg bot';
            typingDiv.innerHTML = '<em>' + (isTa ? 'ஆராய்கிறது...' : 'Analyzing farm data...') + '</em>';
            const box = document.getElementById('ftfChatMessages');
            box.appendChild(typingDiv);
            this.scrollToBottom();

            await new Promise(r => setTimeout(r, 450));
            typingDiv.remove();

            // 1. Direct Batch Code Trace: FTF-TOM or FTF-CURRY or "FTF-"
            if (q.includes('ftf-') || q.includes('batch') || q.includes('தொகுதி') || q.includes('trace') || q.includes('பயணம்') || q.includes('tomato') || q.includes('தக்காளி')) {
                const isPages = window.location.pathname.includes('/pages/');
                const traceUrl = isPages ? 'seed-to-plate.html?batch=FTF-TOM-2024-001' : 'pages/seed-to-plate.html?batch=FTF-TOM-2024-001';

                const botText = isTa ? `
                    🌱 <strong>தொகுதி அறிக்கை: FTF-TOM-2024-001</strong><br>
                    • <strong>விவசாயி:</strong> சுந்தரம் பெருமாள் (பசுமைப் பண்ணை, திண்டுக்கல்)<br>
                    • <strong>மண் தரம்:</strong> pH 6.8 (இயற்கை மண்புழு உரம்)<br>
                    • <strong>பரிசோதனை:</strong> பூச்சிக்கொல்லி இல்லாத சான்றிதழ் (FSSAI Jaivik Bharat)<br>
                    • <strong>குளிர்சங்கிலி:</strong> 4.2°C, 88% ஈரப்பதம்<br>
                    <a href="${traceUrl}" style="display:inline-block; margin-top:8px; padding:6px 12px; background:#15803d; color:white; border-radius:6px; text-decoration:none; font-weight:700; font-size:0.8rem;">
                        விதையிலிருந்து தட்டு வரை வரைபடம் காண்க →
                    </a>
                ` : `
                    🌱 <strong>Verified Ledger: FTF-TOM-2024-001</strong><br>
                    • <strong>Farmer:</strong> Sundaram Perumal (Green Valley, Dindigul)<br>
                    • <strong>Soil Health:</strong> pH 6.8 (Zero Synthetic Chemicals)<br>
                    • <strong>Purity Test:</strong> FSSAI Jaivik Bharat Certified 100% Organic<br>
                    • <strong>Cold Chain:</strong> Monitored at 4.2°C, 88% humidity<br>
                    <a href="${traceUrl}" style="display:inline-block; margin-top:8px; padding:6px 12px; background:#15803d; color:white; border-radius:6px; text-decoration:none; font-weight:700; font-size:0.8rem;">
                        View 7-Stage Interactive Map →
                    </a>
                `;
                this.addBotMessage(botText);
                return;
            }

            // 2. Nutrition
            if (q.includes('iron') || q.includes('vitamin') || q.includes('nutri') || q.includes('கீரை') || q.includes('இரும்பு') || q.includes('ஊட்டச்சத்து') || q.includes('healthy')) {
                const msg = isTa ? KNOWLEDGE_BASE.nutrition.responseTa : KNOWLEDGE_BASE.nutrition.responseEn;
                this.addBotMessage(msg);
                return;
            }

            // 3. Group Buying
            if (q.includes('group') || q.includes('bulk') || q.includes('cheap') || q.includes('குழு') || q.includes('தள்ளுபடி') || q.includes('சேமிப்பு')) {
                const isPages = window.location.pathname.includes('/pages/');
                const groupUrl = isPages ? 'group-buying.html' : 'pages/group-buying.html';
                const msg = (isTa ? KNOWLEDGE_BASE.groupBuying.responseTa : KNOWLEDGE_BASE.groupBuying.responseEn) + 
                    `<br><a href="${groupUrl}" style="display:inline-block; margin-top:8px; padding:6px 12px; background:#15803d; color:white; border-radius:6px; text-decoration:none; font-weight:700; font-size:0.8rem;">${isTa ? 'குழு கொள்முதல் பக்கத்திற்கு செல்க →' : 'Explore Group Deals →'}</a>`;
                this.addBotMessage(msg);
                return;
            }

            // 4. Farmers
            if (q.includes('farmer') || q.includes('விவசாயி') || q.includes('தோட்டம்') || q.includes('விவசாய')) {
                const msg = isTa ? `
                    🌾 <strong>நமது அங்கீகரிக்கப்பட்ட இயற்கை விவசாயிகள்:</strong><br>
                    1. <strong>சுந்தரம் பெருமாள்</strong> - திண்டுக்கல் (இயற்கை தக்காளி, கீரை வகைகள்)<br>
                    2. <strong>மருதமுத்து</strong> - பொள்ளாச்சி (இயற்கை இளநீர், நாட்டு தேங்காய்)<br>
                    3. <strong>செல்வராஜ்</strong> - நீலகிரி (மலை கேரட், ப்ரோக்கோலி)<br>
                    4. <strong>கவிதா நடராஜன்</strong> - கைவினை மூலிகை சோப் தயாரிப்பாளர்.
                ` : `
                    🌾 <strong>Our Verified Organic Farmers & Artisans:</strong><br>
                    1. <strong>Sundaram Perumal</strong> - Dindigul (Organic Tomatoes & Greens)<br>
                    2. <strong>Marudhamuthu</strong> - Pollachi (Tender Coconut & Pure Cold-Pressed Oils)<br>
                    3. <strong>Selvaraj</strong> - Nilgiris (High-Altitude Mountain Carrots & Broccoli)<br>
                    4. <strong>Kavitha Natarajan</strong> - Natural Artisan Soaps & Handmade Products.
                `;
                this.addBotMessage(msg);
                return;
            }

            // Default Fallback
            const fallback = isTa ? `
                மன்னிக்கவும், நான் புரிந்து கொள்ள முயற்சிக்கிறேன். பின்வரும் தலைப்புகளில் எதைப்பற்றி அறிய விரும்புகிறீர்கள்?<br>
                • <strong>"தக்காளி பயணம்"</strong> - விதை முதல் உங்கள் வீடு வரை உணவு கண்காணிப்பு<br>
                • <strong>"ஊட்டச்சத்து"</strong> - இயற்கை உணவுகளின் நன்மைகள்<br>
                • <strong>"குழு கொள்முதல்"</strong> - 35% தள்ளுபடி பெறுவது எப்படி
            ` : `
                I'm here to assist with everything organic! You can ask me about:<br>
                • <strong>"Trace FTF-TOM-2024-001"</strong> - Verify cold chain and soil testing<br>
                • <strong>"Iron rich foods"</strong> - Organic nutritional advice<br>
                • <strong>"Group buying"</strong> - Learn how neighborhood pooling saves 35%
            `;
            this.addBotMessage(fallback);
        }
    }

    // Auto initialize on DOM ready
    window.FTF_Chatbot = FarmToForkChatbot;
    document.addEventListener('DOMContentLoaded', () => {
        window.ftfBot = new FarmToForkChatbot();
    });

})(window);
