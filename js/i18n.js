// ========================================================
// GLOBAL INTERNATIONALIZATION (i18n) & THEME ENGINE
// Farm to Fork Collective
// Supports 8 Languages & 6 Cohesive Themes Across All Pages
// Fully Synchronized via Shared Global State & LocalStorage
// ========================================================

(function(window) {
    'use strict';

    // ----------------------------------------------------
    // IMMEDIATE EARLY EXECUTION (Zero-Flicker Initialization)
    // ----------------------------------------------------
    const storedTheme = localStorage.getItem('ftf_theme') || localStorage.getItem('farmToForkTheme') || 'emerald';
    const activeTheme = (storedTheme === 'dark') ? 'midnight' : (storedTheme === 'light' ? 'emerald' : storedTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (activeTheme === 'midnight') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }

    const storedLang = localStorage.getItem('ftf_lang') || 'en';
    document.documentElement.setAttribute('lang', storedLang);

    // ----------------------------------------------------
    // SUPPORTED LANGUAGES METADATA
    // ----------------------------------------------------
    const LANGUAGES = [
        { code: 'en', flag: '🇬🇧', label: 'English', native: 'English' },
        { code: 'ta', flag: '🇮🇳', label: 'Tamil', native: 'தமிழ்' },
        { code: 'hi', flag: '🇮🇳', label: 'Hindi', native: 'हिन्दी' },
        { code: 'te', flag: '🇮🇳', label: 'Telugu', native: 'తెలుగు' },
        { code: 'ml', flag: '🇮🇳', label: 'Malayalam', native: 'മലയാളം' },
        { code: 'kn', flag: '🇮🇳', label: 'Kannada', native: 'ಕನ್ನಡ' },
        { code: 'es', flag: '🇪🇸', label: 'Spanish', native: 'Español' },
        { code: 'fr', flag: '🇫🇷', label: 'French', native: 'Français' }
    ];

    // ----------------------------------------------------
    // SUPPORTED THEMES METADATA
    // ----------------------------------------------------
    const THEMES = [
        { id: 'emerald', icon: '🌿', name: 'Organic Emerald', desc: 'Fresh garden green & warm harvest cream', color: '#2D6A4F' },
        { id: 'midnight', icon: '🌙', name: 'Midnight Forest', desc: 'Deep charcoal moss & glowing neon emerald', color: '#0B1712', border: '#52B788' },
        { id: 'harvest', icon: '🌾', name: 'Golden Harvest', desc: 'Warm terracotta, honey amber & toasted wheat', color: '#D97706' },
        { id: 'oceanic', icon: '🌊', name: 'Nordic Ocean', desc: 'Crisp glacier white, marine blue & cyan', color: '#0284C7' },
        { id: 'vineyard', icon: '🍇', name: 'Royal Vineyard', desc: 'Velvet lavender, plum & amethyst purple', color: '#7E22CE' },
        { id: 'espresso', icon: '☕', name: 'Rustic Espresso', desc: 'Cozy pecan sand, rich cocoa & dark walnut', color: '#78350F' }
    ];

    // ----------------------------------------------------
    // COMPREHENSIVE MULTI-LINGUAL DICTIONARIES
    // ----------------------------------------------------
    const I18N = {
        // 1. TAMIL (ta) - 100% PURE WITH VERIFIED MANDATORY STRINGS
        ta: {
            "dashboard.title": "வாடிக்கையாளர் கட்டுப்பாட்டு அறை",
            "profile.completeProfile": "உங்கள் சுயவிவரத்தை முடிக்கவும்",
            "product.addProduct": "விளைபொருளைச் சேர்",
            "traceability.journey": "விளைபொருள் பயணம் & விதையிலிருந்து தட்டு வரை வெளிப்படைத்தன்மை",
            brandName: "ஃபார்ம் டு ஃபோர்க்",
            brandSub: "கூட்டமைப்பு",
            navHome: "முகப்பு",
            navShop: "விளைபொருட்கள்",
            navKitchen: "சமுதாய சமையலறை",
            navGroup: "குழு கொள்முதல்",
            navSeed: "விதையிலிருந்து தட்டு வரை",
            navLogin: "உள்நுழைக",
            navSignup: "பதிவு செய்க",
            navLogout: "வெளியேறு",
            navApiDocs: "API ஆவணங்கள்",
            navDashboard: "கட்டுப்பாட்டு அறை",
            navWishlist: "விருப்பப்பட்டியல்",
            wishlistHeading: "என் விருப்பப்பட்டியல்",
            wishlistSub: "நீங்கள் விரும்பிய இயற்கை விளைபொருட்கள் மற்றும் உணவுப் பொருட்கள்",
            topOrganic: "100% சான்றளிக்கப்பட்ட இயற்கை உணவு",
            topDelivery: "₹500க்கு மேல் இலவச விரைவு டெலிவரி",
            topZeroWaste: "பூஜ்ஜிய உணவு விரயம் & மறுசுழற்சி",
            topFrozen: "சமைக்க தயார் உறைந்த காய்கறி பேக்குகள்",
            heroBadge: "விதையிலிருந்து தட்டு வரை வெளிப்படையான கண்காணிப்பு",
            heroTitleMain: "உங்கள் உணவை அறிந்து கொள்ளுங்கள்,",
            heroTitleSub: "விதை முதல் உங்கள் தட்டு வரை",
            heroDesc: "பண்ணையிலிருந்து உங்கள் வீடு வரை QR குறியீடு மூலம் ஒவ்வொரு பொருளையும் கண்காணிக்கலாம். 100% இயற்கை, 100% வெளிப்படையானது.",
            heroStatFed: "உணவளிக்கப்பட்ட மக்கள்",
            heroStatFoodSaved: "மீட்கப்பட்ட உணவு (கிலோ)",
            heroStatCo2: "குறைக்கப்பட்ட CO₂ (கிலோ)",
            heroStatFarmers: "ஆதரிக்கப்பட்ட விவசாயிகள்",
            heroBtnShop: "விளைபொருட்களை காண்க",
            heroBtnTrack: "உணவை கண்காணிக்கவும்",
            heroFloatOrganic: "100% இயற்கை",
            heroFloatFrozen: "உறைந்த பேக்குகள்",
            frozenTag: "❄️ புதிய அறிமுகம்",
            frozenTitle: "சமைக்கத் தயாரான <span class=\"gradient-text\">உறைந்த காய்கறி பேக்குகள்</span>",
            frozenDesc: "முன்கூட்டியே நறுக்கப்பட்ட, சுத்திகரிக்கப்பட்ட இயற்கை காய்கறிகள். நேரத்தை மிச்சப்படுத்துங்கள், உணவை வீணாக்காதீர்கள்!",
            frozenF1: "5 நிமிடங்களில் தயார்",
            frozenF2: "நறுக்க தேவையில்லை",
            frozenF3: "100% இயற்கை",
            frozenBtn: "இப்போதே வாங்குங்கள்",
            featTag: "🌟 எங்களை ஏன் தேர்வு செய்ய வேண்டும்",
            featTitle: "நமது தனித்துவமான <span class=\"gradient-text\">அம்சங்கள்</span>",
            feat1Title: "விதையிலிருந்து தட்டு வரை",
            feat1Desc: "QR குறியீட்டை ஸ்கேன் செய்து உங்கள் உணவின் பயணத்தை அறியலாம்.",
            feat1Tag: "முதன்மை அம்சம்",
            feat2Title: "சுற்றுச்சூழல் மதிப்பீடு",
            feat2Desc: "ஒவ்வொரு பொருளுக்கும் 0-100 நிலைத்தன்மை மதிப்பெண்.",
            feat2Tag: "ஸ்மார்ட் தரம்",
            feat3Title: "சமுதாய சமையலறை",
            feat3Desc: "ஒன்றாக சமையுங்கள், உணவை பகிருங்கள், பூஜ்ஜிய கழிவு.",
            feat3Tag: "சமூக முயற்சி",
            feat4Title: "குழு கொள்முதல்",
            feat4Desc: "மொத்தமாக ஆர்டர் செய்து 30-50% பணத்தை சேமியுங்கள்.",
            feat4Tag: "பெரும் சேமிப்பு",
            feat5Title: "கார்பன் தடம் கணக்கீடு",
            feat5Desc: "உங்கள் உணவு சுற்றுச்சூழலில் ஏற்படுத்தும் தாக்கத்தை கண்காணிக்கவும்.",
            feat5Tag: "இயற்கை நட்பு",
            feat6Title: "பருவகால பெட்டி",
            feat6Desc: "மாதாந்திர சான்றளிக்கப்பட்ட இயற்கை உணவு சந்தா பெட்டிகள்.",
            feat6Tag: "சந்தா திட்டம்",
            featLearnMore: "மேலும் அறிய →",
            catTag: "🛒 வகை வாரியாக வாங்க",
            catTitle: "நமது <span class=\"gradient-text\">தொகுப்பை ஆராயுங்கள்</span>",
            catVegTitle: "🌾 காய்கறிகள்",
            catVegDesc: "புதிய & இயற்கை காய்கறிகள்",
            catFruitTitle: "🍎 பழங்கள்",
            catFruitDesc: "பருவகால சுவையான பழங்கள்",
            catHmTitle: "🧺 கைவினைப் பொருட்கள்",
            catHmDesc: "தேன், மூலிகை சோப் & பாரம்பரிய நெய்",
            catFrzTitle: "❄️ உறைந்த பேக்குகள்",
            catFrzDesc: "சமைக்க தயார் காய்கறி கலவைகள்",
            catShopNow: "வாங்க →",
            prodTag: "🔥 அதிகம் விற்பனையானவை",
            prodTitle: "சிறப்பு <span class=\"gradient-text\">விளைபொருட்கள்</span>",
            prodViewAll: "அனைத்து விளைபொருட்களையும் காண்க →",
            impactTag: "🌍 நமது கூட்டு தாக்கம்",
            impactTitle: "சமூகத்தில் நாம் ஏற்படுத்தும் <span class=\"gradient-text\">மாற்றம்</span>",
            impactFed: "உணவளிக்கப்பட்ட மக்கள்",
            impactSaved: "மீட்கப்பட்ட உணவு (கிலோ)",
            impactCo2: "குறைக்கப்பட்ட CO₂ (கிலோ)",
            impactFarmers: "ஆதரிக்கப்பட்ட விவசாயிகள்",
            demoTag: "📱 உடனே சோதித்துப் பாருங்கள்",
            demoTitle: "உங்கள் உணவுப் பயணத்தை <span class=\"gradient-text\">ஸ்கேன் செய்து அறிக</span>",
            demoDesc: "விதையிலிருந்து தட்டு வரை QR கண்காணிப்பை அனுபவிக்க கீழே சொடுக்கவும்.",
            demoBtn: "மாதிரி QR ஸ்கேன் செய்",
            demoF1: "பண்ணை விவரங்கள்",
            demoF2: "அறுவடை தேதி",
            demoF3: "விநியோக தகவல்",
            kitchenTag: "🍽️ ஒன்றாக சமைப்போம்",
            kitchenTitle: "சமுதாய <span class=\"gradient-text\">சமையலறையில் இணையுங்கள்</span>",
            kitchenDesc: "அக்கம்பக்கத்தினருடன் சமைத்து, உணவைப் பகிர்ந்து, பணத்தை மிச்சப்படுத்துங்கள்.",
            kitchenB1: "உணவு செலவில் 40% வரை சேமிப்பு",
            kitchenB2: "பூஜ்ஜிய உணவு கழிவு வாழ்க்கை முறை",
            kitchenB3: "வலுவான அக்கம்பக்க சமூக உறவுகள்",
            kitchenBtn: "மேலும் அறிய →",
            testTag: "💬 வாடிக்கையாளர் அனுபவங்கள்",
            testTitle: "உண்மையான மக்களின் <span class=\"gradient-text\">கருத்துக்கள்</span>",
            test1Role: "வாடிக்கையாளர்",
            test1Text: "\"உறைந்த காய்கறி பேக்குகள் மிகவும் அருமை! தினமும் சமையல் நேரம் பாதியாக மிச்சமாகிறது!\"",
            test2Role: "இயற்கை விவசாயி",
            test2Text: "\"நுகர்வோருடன் நேரடி தொடர்பு. இடைத்தரகர்கள் இல்லாமல் நியாயமான விலை கிடைக்கிறது!\"",
            test3Role: "சமுதாய சமையலறை தலைவர்",
            test3Text: "\"சமுதாய சமையலறை மூலம் உணவு விரயத்தை முற்றிலுமாக தடுத்துவிட்டோம்!\"",
            newsTitle: "புதிய தகவல்களை உடனுக்குடன் <span class=\"gradient-text\">பெறுங்கள்</span>",
            newsDesc: "புதிய அறுவடை விளைபொருட்கள் மற்றும் தள்ளுபடி சலுகைகளுக்கு உங்கள் மின்னஞ்சலை பதிவு செய்யுங்கள்.",
            newsPlaceholder: "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்...",
            newsBtn: "பதிவு செய்",
            footerDesc: "இயற்கை உணவு, வெளிப்படைத்தன்மை மற்றும் கூட்டு முயற்சி மூலம் ஒரு ஆரோக்கியமான சமூகத்தை உருவாக்குதல்.",
            footerQuick: "விரைவு இணைப்புகள்",
            footerCats: "வகைகள்",
            footerSupport: "உதவி & ஆதரவு",
            footerHelp: "உதவி மையம்",
            footerContact: "தொடர்பு கொள்க",
            footerPrivacy: "தனியுரிமை கொள்கை",
            footerCopy: "© 2026 ஃபார்ம் டு ஃபோர்க் கூட்டமைப்பு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. 🌱",
            shopHeaderTitle: "சான்றளிக்கப்பட்ட இயற்கை விளைபொருட்கள்",
            shopHeaderSubtitle: "விவசாயிகளிடமிருந்து நேரடியாக உங்கள் இல்லத்திற்கு வரும் 100% தூய இயற்கை அறுவடை",
            shopFilterAll: "அனைத்து பொருட்கள்",
            shopFilterVeg: "🌾 காய்கறிகள்",
            shopFilterFruit: "🍎 பழங்கள்",
            shopFilterHm: "🧺 கைவினைப் பொருட்கள்",
            shopFilterFrz: "❄️ உறைந்த காய்கறிகள்",
            shopSearchPlaceholder: "🔍 இயற்கை தக்காளி, தேன், ஆப்பிள் தேடவும்...",
            shopSortDefault: "வரிசைப்படுத்து: இயல்புநிலை",
            shopSortLow: "விலை: குறைவிலிருந்து அதிகம்",
            shopSortHigh: "விலை: அதிகத்திலிருந்து குறைவு",
            shopSortRating: "உயர் மதிப்பீடு",
            shopAddToCart: "கூடையில் சேர்",
            shopTraceBtn: "பயணம் காண்க",
            shopFreshBadge: "புதிய அறுவடை",
            shopZeroChem: "பூச்சிக்கொல்லி அற்றது",
            detailBreadcrumbHome: "முகப்பு",
            detailBreadcrumbShop: "விளைபொருட்கள்",
            detailInStock: "கையிருப்பில் உள்ளது & புதியது",
            detailLowStock: "குறைந்த கையிருப்பு",
            detailPurityIndex: "சுற்றுச்சூழல் பாதுகாப்பு & தூய்மை குறியீடு",
            detailSelectQty: "அளவைத் தேர்வு செய்யவும்:",
            detailBtnCart: "கூடையில் சேர்",
            detailBtnBuy: "இப்போதே வாங்கு",
            detailBtnTrace: "QR பயணம் காண்க",
            detailTabStory: "🌿 பண்ணை கதை & தோற்றம்",
            detailTabTrace: "📱 விதையிலிருந்து தட்டு வரை பதிவு",
            detailTabNutrition: "🥗 ஊட்டச்சத்து & சான்றிதழ்கள்",
            detailTabReviews: "💬 வாடிக்கையாளர் மதிப்புரைகள்",
            detailFarmerSpotlight: "விவசாயி அறிமுகம்",
            detailDirectFromGrower: "👨‍🌾 விவசாயியிடமிருந்து நேரடியாக",
            detailSendThanks: "விவசாயிக்கு நன்றி தெரிவிக்க",
            detailListenVoice: "விவசாயி குரல் குறிப்பைக் கேளுங்கள்",
            reviewsHeading: "வாடிக்கையாளர் கருத்துக்கள் & விவசாயி பதில்கள்",
            reviewsSub: "சரிபார்க்கப்பட்ட வாங்குபவர்களின் உண்மையான அனுபவங்கள்",
            writeReviewBtn: "மதிப்புரை எழுதுக",
            verifiedBuyerBadge: "சரிபார்க்கப்பட்ட வாங்குபவர்",
            farmerReplyBadge: "விவசாயி பதில்",
            artisanReplyBadge: "கைவினைஞர் பதில்",
            replyToCustomerBtn: "வாடிக்கையாளருக்கு பதில் அளிக்கவும்",
            postReplyBtn: "பதில் அனுப்புக",
            cancelBtn: "ரத்து",
            noReviewsMsg: "இந்த விளைபொருளுக்கு இன்னும் கருத்துக்கள் இல்லை. உங்கள் முதல் அனுபவத்தைப் பகிருங்கள்!",
            reviewSuccessMsg: "நன்றி! உங்கள் கருத்து வெற்றிகரமாக பதிவு செய்யப்பட்டது ⭐",
            replySuccessMsg: "விவசாயி பதில் பதிவு செய்யப்பட்டது! ✅",
            multiFarmerBadge: "விவசாயிகள் நேரடி சந்தை",
            multiFarmerLocalSelling: "உள்ளூர் விவசாயிகள் விற்பனை செய்கின்றனர்",
            multiFarmerCompareTitle: "இப்பயிரை விற்பனை செய்யும் அனைத்து விவசாயிகள்",
            multiFarmerCompareSub: "நேரடி பண்ணை விலை, உங்கள் வீட்டிற்கு உள்ள தூரம், இருப்பு மற்றும் அறுவடை நேரத்தை ஒப்பிட்டு, உங்களுக்கு விருப்பமான விவசாயியிடம் வாங்குங்கள்.",
            multiFarmerSelectBtn: "இவ்விவசாயியிடம் வாங்கவும்",
            multiFarmerSelectedBadge: "தேர்ந்தெடுக்கப்பட்ட விவசாயி",
            multiFarmerViewStore: "விவசாயியைக் காண்க",
            farmerStoreHeading: "விவசாயி நேரடி அங்காடி",
            farmerStoreAboutTitle: "பண்ணையைப் பற்றி",
            farmerStoreDeliveryTitle: "டெலிவரி வசதி",
            farmerStoreHarvestTitle: "இப்பண்ணையின் புதிய அறுவடை",
            farmerStoreFarmingType: "விவசாய முறை:",
            farmerStoreStock: "இருப்பு:",
            farmerStoreHarvested: "அறுவடை:",
            farmerStoreDistance: "உங்கள் முகவரியிலிருந்து",
            farmerStoreAddToCart: "கூடையில் சேர்",
            farmerStoreBuyNow: "உடனே வாங்கு",
            cartTitle: "உங்கள் வணிகக் கூடை",
            cartEmpty: "உங்கள் கூடை காலியாக உள்ளது!",
            cartEmptySub: "புதிய இயற்கை விளைபொருட்களை கூடையிலிட்டு ஆரோக்கியத்தை தொடங்குங்கள்.",
            cartSubtotal: "கூடை மொத்தம்:",
            cartDelivery: "டெலிவரி கட்டணம்:",
            cartFreeDelivery: "இலவசம்",
            cartTotal: "செலுத்த வேண்டிய தொகை:",
            cartCheckoutBtn: "பணம் செலுத்துதலுக்கு செல்லவும்",
            cartContinueShop: "விளைபொருட்களை காண செல்லவும்",
            checkoutTitle: "பாதுகாப்பான பணம் செலுத்துதல்",
            checkoutAddressHeading: "டெலிவரி முகவரி",
            checkoutPaymentHeading: "பணம் செலுத்தும் முறை",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "கிரெடிட் / டெபிட் கார்டு",
            checkoutCod: "பொருளைப் பெற்றவுடன் ரொக்கம் (COD)",
            checkoutPlaceOrder: "ஆர்டரை உறுதி செய்க",
            checkoutOrderSummary: "ஆர்டர் சுருக்கம்",
            loginTitle: "ஃபார்ம் டு ஃபோர்க் உள்நுழைவு",
            loginSub: "உங்கள் கணக்கில் பாதுகாப்பாக உள்நுழைக",
            loginRoleCustomer: "வாடிக்கையாளர்",
            loginRoleFarmer: "விவசாயி",
            loginRoleArtisan: "கைவினைஞர்",
            loginRoleAdmin: "நிர்வாகி",
            loginQuickDemo: "1-கிளிக் மாதிரி கணக்குகள் (5 கணக்குகள்)",
            loginEmailLabel: "மின்னஞ்சல் அல்லது பயனர் பெயர்",
            loginPasswordLabel: "கடவுச்சொல்",
            loginRemember: "நினைவில் கொள்க",
            loginAdminPortal: "நிர்வாகி தளம்",
            loginBtnSubmit: "உள்நுழைக",
            loginOrOAuth: "Google மூலம் தொடர்க",
            loginGoogleBtn: "Google மூலம் உள்நுழைக",
            loginGithubBtn: "GitHub மூலம் உள்நுழைக",
            loginNoAccount: "கணக்கு இல்லையா?",
            loginCreateAccount: "புதிய கணக்கை உருவாக்குங்கள்",
            loginBackHome: "முகப்பிற்குத் திரும்பு",
            regTitle: "புதிய கணக்கு உருவாக்குங்கள்",
            regSub: "ஃபார்ம் டு ஃபோர்க் குடும்பத்தில் இணையுங்கள்",
            regNameLabel: "முழு பெயர்",
            regEmailLabel: "மின்னஞ்சல் முகவரி",
            regPhoneLabel: "தொலைபேசி எண்",
            regPassLabel: "கடவுச்சொல்",
            regConfirmLabel: "கடவுச்சொல்லை உறுதிப்படுத்துக",
            regBtnSubmit: "பதிவு செய்க",
            regAlreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
            regSignIn: "உள்நுழைக",
            dashWelcome: "வணக்கம்,",
            dashFarmerTitle: "விவசாயி கட்டுப்பாட்டு அறை",
            dashArtisanTitle: "கைவினைஞர் கட்டுப்பாட்டு அறை",
            dashCustomerTitle: "வாடிக்கையாளர் கணக்கு அறை",
            dashAdminTitle: "முதன்மை நிர்வாகி கட்டுப்பாட்டு அறை",
            dashStatTotalRevenue: "மொத்த வருவாய்",
            dashStatActiveCrops: "செயலில் உள்ள பயிர்கள்",
            dashStatOrders: "ஆர்டர்கள்",
            dashStatRating: "சராசரி மதிப்பீடு",
            dashManageProduce: "விளைபொருட்களை நிர்வகிக்கவும்",
            dashAddProduce: "புதிய பயிர் சேர்க்க",
            dashUploadJourney: "பயணத்தை பதிவேற்றுக",
            dashCustomerFeedbackSection: "வாடிக்கையாளர் கருத்துக்கள் & பதில்கள்",
            dashOrdersSection: "சமீபத்திய ஆர்டர்கள்",
            themeSettingsTitle: "வண்ண தீம்கள்",
            langSettingsTitle: "மொழியைத் தேர்வு செய்க",
            settingsSavedToast: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!",
            btnSave: "சேமி",
            btnCancel: "ரத்து",
            btnDelete: "நீக்கு",
            btnEdit: "திருத்து",
            btnSubmit: "சமர்ப்பி",
            btnClose: "மூடு",
            btnSearch: "தேடு",
            btnFilter: "வடிகட்டு",
            statusDelivered: "டெலிவரி செய்யப்பட்டது",
            statusProcessing: "செயல்பாட்டில் உள்ளது",
            statusPending: "நிலுவையில் உள்ளது"
        },

        // 2. ENGLISH (en) - CANONICAL MASTER DICTIONARY
        en: {
            "dashboard.title": "Customer Dashboard",
            "profile.completeProfile": "Complete Your Profile",
            "product.addProduct": "Add Product",
            "traceability.journey": "Product Journey & Seed-to-Plate Traceability",
            brandName: "Farm to Fork",
            brandSub: "Collective",
            navHome: "Home",
            navShop: "Shop",
            navKitchen: "Community Kitchen",
            navGroup: "Group Buying",
            navSeed: "Seed to Plate",
            navLogin: "Login",
            navSignup: "Sign Up",
            navLogout: "Logout",
            navApiDocs: "API Docs",
            navDashboard: "Dashboard",
            navWishlist: "Wishlist",
            wishlistHeading: "My Organic Wishlist",
            wishlistSub: "Saved fresh crops, artisanal produce, and healthy essentials you love",
            topOrganic: "100% Certified Organic Food",
            topDelivery: "Free Express Delivery on Orders Over ₹500",
            topZeroWaste: "Zero Food Waste & Sustainable Packaging",
            topFrozen: "Ready-to-Cook Frozen Vegetable Packs",
            heroBadge: "Seed to Plate QR Tracking",
            heroTitleMain: "Know Your Food,",
            heroTitleSub: "From Seed to Plate",
            heroDesc: "Trace every product from farm to your table with QR code tracking. 100% organic, 100% transparent.",
            heroStatFed: "People Fed",
            heroStatFoodSaved: "Food Saved (kg)",
            heroStatCo2: "CO₂ Reduced (kg)",
            heroStatFarmers: "Farmers Supported",
            heroBtnShop: "Explore Products",
            heroBtnTrack: "Track Your Food",
            heroFloatOrganic: "100% Organic",
            heroFloatFrozen: "Frozen Packs",
            frozenTag: "❄️ New Launch",
            frozenTitle: "Ready-to-Cook <span class=\"gradient-text\">Frozen Vegetable Packs</span>",
            frozenDesc: "Pre-cut, pre-washed, ready to cook organic vegetables. Save time, reduce waste!",
            frozenF1: "Ready in 5 mins",
            frozenF2: "No Chopping",
            frozenF3: "100% Organic",
            frozenBtn: "Shop Now",
            featTag: "🌟 Why Choose Us",
            featTitle: "Our Unique <span class=\"gradient-text\">Features</span>",
            feat1Title: "Seed to Plate",
            feat1Desc: "Scan QR codes to trace your food's journey.",
            feat1Tag: "Main Feature",
            feat2Title: "Sustainability Score",
            feat2Desc: "Every product gets a 0-100 eco-score.",
            feat2Tag: "Smart Quality",
            feat3Title: "Community Kitchen",
            feat3Desc: "Cook together, share meals, zero waste.",
            feat3Tag: "Community",
            feat4Title: "Group Buying",
            feat4Desc: "Order bulk & save 30-50%.",
            feat4Tag: "Big Savings",
            feat5Title: "Carbon Footprint",
            feat5Desc: "Track your environmental impact.",
            feat5Tag: "Eco-Friendly",
            feat6Title: "Seasonal Box",
            feat6Desc: "Monthly organic subscription boxes.",
            feat6Tag: "Subscription",
            featLearnMore: "Learn More →",
            catTag: "🛒 Shop by Category",
            catTitle: "Explore Our <span class=\"gradient-text\">Collection</span>",
            catVegTitle: "🌾 Vegetables",
            catVegDesc: "Fresh & Organic Produce",
            catFruitTitle: "🍎 Fruits",
            catFruitDesc: "Seasonal & Sweet Fruits",
            catHmTitle: "🧺 Handmade",
            catHmDesc: "Raw Honey, Herbal Soaps & Pure Ghee",
            catFrzTitle: "❄️ Frozen Packs",
            catFrzDesc: "Ready-to-Cook Vegetable Mixes",
            catShopNow: "Shop Now →",
            prodTag: "🔥 Bestsellers",
            prodTitle: "Featured <span class=\"gradient-text\">Products</span>",
            prodViewAll: "View All Products →",
            impactTag: "🌍 Our Collective Impact",
            impactTitle: "Making a <span class=\"gradient-text\">Difference</span>",
            impactFed: "People Fed",
            impactSaved: "Food Saved (kg)",
            impactCo2: "CO₂ Reduced (kg)",
            impactFarmers: "Farmers Supported",
            demoTag: "📱 Try It Now",
            demoTitle: "Scan & Trace Your <span class=\"gradient-text\">Food Journey</span>",
            demoDesc: "Click below to experience Seed to Plate QR tracking.",
            demoBtn: "Scan Sample QR",
            demoF1: "Farm Details",
            demoF2: "Harvest Date",
            demoF3: "Delivery Info",
            kitchenTag: "🍽️ Cook Together",
            kitchenTitle: "Join a <span class=\"gradient-text\">Community Kitchen</span>",
            kitchenDesc: "Cook with neighbors, share meals, save money, zero waste.",
            kitchenB1: "Save up to 40% on food bills",
            kitchenB2: "Zero food waste lifestyle",
            kitchenB3: "Stronger community bonds",
            kitchenBtn: "Learn More →",
            testTag: "💬 Testimonials",
            testTitle: "Real <span class=\"gradient-text\">Stories</span>",
            test1Role: "Customer",
            test1Text: "\"Love the frozen packs! Saves so much time in the morning!\"",
            test2Role: "Organic Farmer",
            test2Text: "\"Direct connection to customers. Fair prices without middlemen!\"",
            test3Role: "Community Kitchen Lead",
            test3Text: "\"Frozen packs make community cooking so much easier and waste-free!\"",
            newsTitle: "Stay <span class=\"gradient-text\">Connected</span>",
            newsDesc: "Subscribe for updates on fresh harvests and special offers.",
            newsPlaceholder: "Enter your email address...",
            newsBtn: "Subscribe",
            footerDesc: "Building a sustainable community through organic food, transparency, and collective action.",
            footerQuick: "Quick Links",
            footerCats: "Categories",
            footerSupport: "Support",
            footerHelp: "Help Center",
            footerContact: "Contact Us",
            footerPrivacy: "Privacy Policy",
            footerCopy: "© 2026 Farm to Fork Collective. All rights reserved. 🌱",
            shopHeaderTitle: "Certified Organic Produce",
            shopHeaderSubtitle: "Fresh from regional Tamil Nadu regenerative farms to your table",
            shopFilterAll: "All Products",
            shopFilterVeg: "🌾 Vegetables",
            shopFilterFruit: "🍎 Fruits",
            shopFilterHm: "🧺 Handmade",
            shopFilterFrz: "❄️ Frozen Packs",
            shopSearchPlaceholder: "🔍 Search organic tomatoes, honey, apples...",
            shopSortDefault: "Sort By: Default",
            shopSortLow: "Price: Low to High",
            shopSortHigh: "Price: High to Low",
            shopSortRating: "Highest Rating",
            shopAddToCart: "Add to Cart",
            shopTraceBtn: "Trace",
            shopFreshBadge: "Fresh",
            shopZeroChem: "Zero Chemical",
            detailBreadcrumbHome: "Home",
            detailBreadcrumbShop: "Shop",
            detailInStock: "In Stock & Fresh",
            detailLowStock: "Low Stock",
            detailPurityIndex: "Eco-Sustainability & Purity Index",
            detailSelectQty: "Select Quantity:",
            detailBtnCart: "Add to Cart",
            detailBtnBuy: "Buy Now",
            detailBtnTrace: "Trace QR",
            detailTabStory: "🌿 Story & Farm Origin",
            detailTabTrace: "📱 Seed-to-Plate Logs",
            detailTabNutrition: "🥗 Nutrition & Certifications",
            detailTabReviews: "💬 Customer Reviews",
            detailFarmerSpotlight: "Meet the Farmer",
            detailDirectFromGrower: "👨‍🌾 Direct From Grower",
            detailSendThanks: "Send Farmer Thanks",
            detailListenVoice: "Listen to Farmer Field Voice Note",
            reviewsHeading: "Customer Reviews & Farmer Replies",
            reviewsSub: "Real feedback and verified grower conversations",
            writeReviewBtn: "Write a Review",
            verifiedBuyerBadge: "Verified Buyer",
            farmerReplyBadge: "Farmer Reply",
            artisanReplyBadge: "Artisan Reply",
            replyToCustomerBtn: "Reply to Customer",
            postReplyBtn: "Post Reply",
            cancelBtn: "Cancel",
            noReviewsMsg: "No customer reviews yet. Be the first to share your farm-fresh experience!",
            reviewSuccessMsg: "Thank you! Your verified review has been published ⭐",
            replySuccessMsg: "Farmer reply posted successfully! ✅",
            multiFarmerBadge: "Multi-Farmer Marketplace",
            multiFarmerLocalSelling: "Local Farmers Selling",
            multiFarmerCompareTitle: "All Farmers Selling This Product",
            multiFarmerCompareSub: "Compare farm-gate prices, distance to your kitchen, available stock, and organic certifications across all registered growers. Choose your preferred farmer to buy from directly.",
            multiFarmerSelectBtn: "Choose This Farmer",
            multiFarmerSelectedBadge: "Selected Farmer",
            multiFarmerViewStore: "View Farmer",
            farmerStoreHeading: "Farmer Direct Store",
            farmerStoreAboutTitle: "About the Farm",
            farmerStoreDeliveryTitle: "Delivery Availability",
            farmerStoreHarvestTitle: "Fresh Harvest From This Farmer",
            farmerStoreFarmingType: "Farming Type:",
            farmerStoreStock: "Stock:",
            farmerStoreHarvested: "Harvested:",
            farmerStoreDistance: "from registered location",
            farmerStoreAddToCart: "Add to Cart",
            farmerStoreBuyNow: "Buy Now",
            cartTitle: "Your Shopping Cart",
            cartEmpty: "Your cart is empty!",
            cartEmptySub: "Add fresh organic produce to get started.",
            cartSubtotal: "Subtotal:",
            cartDelivery: "Delivery Fee:",
            cartFreeDelivery: "FREE",
            cartTotal: "Grand Total:",
            cartCheckoutBtn: "Proceed to Checkout",
            cartContinueShop: "Continue Shopping",
            checkoutTitle: "Secure Checkout",
            checkoutAddressHeading: "Delivery Address",
            checkoutPaymentHeading: "Payment Method",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "Credit / Debit Card",
            checkoutCod: "Cash on Delivery (COD)",
            checkoutPlaceOrder: "Confirm & Place Order",
            checkoutOrderSummary: "Order Summary",
            loginTitle: "Farm to Fork Sign In",
            loginSub: "Log in to your Farm to Fork account",
            loginRoleCustomer: "Customer",
            loginRoleFarmer: "Farmer",
            loginRoleArtisan: "Artisan",
            loginRoleAdmin: "Admin",
            loginQuickDemo: "Quick Demo Login (5 Accounts)",
            loginEmailLabel: "Email or Username",
            loginPasswordLabel: "Password",
            loginRemember: "Remember me",
            loginAdminPortal: "Admin Portal",
            loginBtnSubmit: "Sign In",
            loginOrOAuth: "Or continue with Google",
            loginGoogleBtn: "Sign in with Google",
            loginGithubBtn: "Continue with GitHub",
            loginNoAccount: "Don't have an account?",
            loginCreateAccount: "Create Account",
            loginBackHome: "Back to Homepage",
            regTitle: "Create Account",
            regSub: "Join the Farm to Fork Collective",
            regNameLabel: "Full Name",
            regEmailLabel: "Email Address",
            regPhoneLabel: "Phone Number",
            regPassLabel: "Password",
            regConfirmLabel: "Confirm Password",
            regBtnSubmit: "Create Account",
            regAlreadyAccount: "Already have an account?",
            regSignIn: "Sign In",
            dashWelcome: "Welcome,",
            dashFarmerTitle: "Farmer Dashboard",
            dashArtisanTitle: "Artisan Dashboard",
            dashCustomerTitle: "Customer Portal",
            dashAdminTitle: "Platform Admin Dashboard",
            dashStatTotalRevenue: "Total Revenue",
            dashStatActiveCrops: "Active Crops",
            dashStatOrders: "Orders Placed",
            dashStatRating: "Average Rating",
            dashManageProduce: "Manage Farm Produce",
            dashAddProduce: "Add Farm Produce",
            dashUploadJourney: "Upload Farm Journey",
            dashCustomerFeedbackSection: "Customer Reviews & Replies",
            dashOrdersSection: "Recent Orders",
            themeSettingsTitle: "Theme Settings",
            langSettingsTitle: "Language Selection",
            settingsSavedToast: "Preferences saved successfully!",
            btnSave: "Save",
            btnCancel: "Cancel",
            btnDelete: "Delete",
            btnEdit: "Edit",
            btnSubmit: "Submit",
            btnClose: "Close",
            btnSearch: "Search",
            btnFilter: "Filter",
            statusDelivered: "Delivered",
            statusProcessing: "Processing",
            statusPending: "Pending"
        },

        // 3. HINDI (hi)
        hi: {
            brandName: "फार्म टू फोर्क",
            brandSub: "सामूहिक मंच",
            navHome: "होम",
            navShop: "उत्पाद",
            navKitchen: "सामुदायिक रसोई",
            navGroup: "सामूहिक खरीद",
            navSeed: "बीज से थाली तक",
            navLogin: "लॉग इन",
            navSignup: "साइन अप",
            navLogout: "लॉग आउट",
            navApiDocs: "API दस्तावेज़",
            navDashboard: "डैशबोर्ड",
            navWishlist: "विशलिस्ट",
            wishlistHeading: "मेरी जैविक विशलिस्ट",
            wishlistSub: "आपके पसंदीदा ताज़ा जैविक उत्पाद और स्वास्थ्यवर्धक आहार",
            topOrganic: "100% प्रमाणित जैविक खाद्य",
            topDelivery: "₹500 से अधिक के आर्डर पर मुफ्त एक्सप्रेस डिलीवरी",
            topZeroWaste: "शून्य खाद्य अपशिष्ट एवं पर्यावरण अनुकूल पैकेजिंग",
            topFrozen: "पकाने के लिए तैयार फ्रोजन सब्जी पैक",
            heroBadge: "बीज से थाली तक QR ट्रैकिंग",
            heroTitleMain: "अपने भोजन को जानिए,",
            heroTitleSub: "बीज से लेकर आपकी थाली तक",
            heroDesc: "खेत से थाली तक प्रत्येक उत्पाद को QR कोड से ट्रैक करें। 100% जैविक, 100% पारदर्शी।",
            heroStatFed: "लाभान्वित परिवार",
            heroStatFoodSaved: "बचाया गया भोजन (किलो)",
            heroStatCo2: "CO₂ में कमी (किलो)",
            heroStatFarmers: "समर्थित किसान",
            heroBtnShop: "उत्पाद देखें",
            heroBtnTrack: "भोजन ट्रैक करें",
            heroFloatOrganic: "100% जैविक",
            heroFloatFrozen: "फ्रोजन पैक्स",
            frozenTag: "❄️ नई पेशकश",
            frozenTitle: "पकाने के लिए तैयार <span class=\"gradient-text\">फ्रोजन सब्जी पैक</span>",
            frozenDesc: "पहले से कटी और धुली जैविक सब्जियां। समय बचाएं, भोजन की बर्बादी रोकें!",
            frozenF1: "5 मिनट में तैयार",
            frozenF2: "काटने की जरूरत नहीं",
            frozenF3: "100% शुद्ध जैविक",
            frozenBtn: "अभी खरीदें",
            featTag: "🌟 हमें क्यों चुनें",
            featTitle: "हमारी अनूठी <span class=\"gradient-text\">विशेषताएं</span>",
            feat1Title: "बीज से थाली तक",
            feat1Desc: "QR कोड स्कैन करके अपने भोजन की संपूर्ण यात्रा जानें।",
            feat1Tag: "प्रमुख विशेषता",
            feat2Title: "स्थिरता स्कोर",
            feat2Desc: "प्रत्येक उत्पाद को 0-100 का इको-स्कोर मिलता है।",
            feat2Tag: "स्मार्ट गुणवत्ता",
            feat3Title: "सामुदायिक रसोई",
            feat3Desc: "साथ मिलकर पकाएं, भोजन साझा करें, शून्य बर्बादी।",
            feat3Tag: "सामुदायिक पहल",
            feat4Title: "सामूहिक खरीद",
            feat4Desc: "थोक में आर्डर करें और 30-50% तक बचत करें।",
            feat4Tag: "बड़ी बचत",
            feat5Title: "कार्बन फुटप्रिंट",
            feat5Desc: "पर्यावरण पर अपने भोजन के प्रभाव को ट्रैक करें।",
            feat5Tag: "पर्यावरण मित्र",
            feat6Title: "मौसमी बॉक्स",
            feat6Desc: "मासिक प्रमाणित जैविक सदस्यता बॉक्स।",
            feat6Tag: "सब्सक्रिप्शन",
            featLearnMore: "और जानें →",
            catTag: "🛒 श्रेणी अनुसार खरीदारी",
            catTitle: "हमारा <span class=\"gradient-text\">संग्रह देखें</span>",
            catVegTitle: "🌾 सब्जियां",
            catVegDesc: "ताज़ी और प्राकृतिक सब्जियां",
            catFruitTitle: "🍎 फल",
            catFruitDesc: "मौसमी और मीठे प्राकृतिक फल",
            catHmTitle: "🧺 हस्तनिर्मित",
            catHmDesc: "शुद्ध शहद, हर्बल साबुन और देसी घी",
            catFrzTitle: "❄️ फ्रोजन पैक",
            catFrzDesc: "पकाने के लिए तैयार सब्जी मिश्रण",
            catShopNow: "खरीदें →",
            prodTag: "🔥 सबसे लोकप्रिय",
            prodTitle: "विशेष <span class=\"gradient-text\">उत्पाद</span>",
            prodViewAll: "सभी उत्पाद देखें →",
            impactTag: "🌍 हमारा सामूहिक प्रभाव",
            impactTitle: "समाज में ला रहे हैं <span class=\"gradient-text\">सकारात्मक बदलाव</span>",
            impactFed: "लाभान्वित परिवार",
            impactSaved: "बचाया गया भोजन (किलो)",
            impactCo2: "CO₂ में कमी (किलो)",
            impactFarmers: "समर्थित किसान",
            demoTag: "📱 अभी आज़माएँ",
            demoTitle: "अपने भोजन की यात्रा <span class=\"gradient-text\">स्कैन करके देखें</span>",
            demoDesc: "बीज से थाली तक QR ट्रैकिंग का अनुभव करने के लिए नीचे क्लिक करें।",
            demoBtn: "नमूना QR स्कैन करें",
            demoF1: "खेत का विवरण",
            demoF2: "कटाई की तारीख",
            demoF3: "वितरण जानकारी",
            kitchenTag: "🍽️ साथ मिलकर पकाएं",
            kitchenTitle: "सामुदायिक <span class=\"gradient-text\">रसोई से जुड़ें</span>",
            kitchenDesc: "पड़ोसियों के साथ मिलकर पकाएं, भोजन साझा करें और पैसे बचाएं।",
            kitchenB1: "खाद्य बिल में 40% तक की बचत",
            kitchenB2: "शून्य खाद्य अपशिष्ट जीवनशैली",
            kitchenB3: "मजबूत सामाजिक रिश्ते",
            kitchenBtn: "और जानें →",
            testTag: "💬 ग्राहक अनुभव",
            testTitle: "सच्चे ग्राहकों की <span class=\"gradient-text\">कहानियां</span>",
            test1Role: "ग्राहक",
            test1Text: "\"फ्रोजन पैक बहुत बढ़िया हैं! सुबह खाना बनाने का समय आधा बच जाता है!\"",
            test2Role: "जैविक किसान",
            test2Text: "\"ग्राहकों से सीधा संपर्क। बिना बिचौलियों के हमें उचित मूल्य मिल रहा है!\"",
            test3Role: "सामुदायिक रसोई प्रमुख",
            test3Text: "\"सामुदायिक रसोई से भोजन की बर्बादी पूरी तरह समाप्त हो गई है!\"",
            newsTitle: "नए अपडेट <span class=\"gradient-text\">पाते रहें</span>",
            newsDesc: "ताज़ी फसल और विशेष छूट के लिए अपना ईमेल दर्ज करें।",
            newsPlaceholder: "अपना ईमेल पता दर्ज करें...",
            newsBtn: "सब्सक्राइब",
            footerDesc: "जैविक भोजन, पारदर्शिता और सामूहिक सहयोग से स्वस्थ समाज का निर्माण।",
            footerQuick: "त्वरित लिंक",
            footerCats: "श्रेणियां",
            footerSupport: "सहायता",
            footerHelp: "सहायता केंद्र",
            footerContact: "संपर्क करें",
            footerPrivacy: "गोपनीयता नीति",
            footerCopy: "© 2026 फार्म टू फोर्क कलेक्टिव। सर्वाधिकार सुरक्षित। 🌱",
            shopHeaderTitle: "प्रमाणित जैविक उत्पाद",
            shopHeaderSubtitle: "तमिलनाडु के पुनर्योजी खेतों से सीधे आपकी रसोई तक 100% शुद्ध उपज",
            shopFilterAll: "सभी उत्पाद",
            shopFilterVeg: "🌾 सब्जियां",
            shopFilterFruit: "🍎 फल",
            shopFilterHm: "🧺 हस्तनिर्मित",
            shopFilterFrz: "❄️ फ्रोजन पैक्स",
            shopSearchPlaceholder: "🔍 जैविक टमाटर, शहद, सेब खोजें...",
            shopSortDefault: "क्रमबद्ध: डिफ़ॉल्ट",
            shopSortLow: "कीमत: कम से ज्यादा",
            shopSortHigh: "कीमत: ज्यादा से कम",
            shopSortRating: "उच्चतम रेटिंग",
            shopAddToCart: "कार्ट में जोड़ें",
            shopTraceBtn: "यात्रा देखें",
            shopFreshBadge: "ताज़ा फसल",
            shopZeroChem: "कीटनाशक मुक्त",
            detailBreadcrumbHome: "होम",
            detailBreadcrumbShop: "उत्पाद",
            detailInStock: "स्टॉक में उपलब्ध & ताज़ा",
            detailLowStock: "सीमित स्टॉक",
            detailPurityIndex: "पारिस्थितिक स्थिरता एवं शुद्धता सूचकांक",
            detailSelectQty: "मात्रा चुनें:",
            detailBtnCart: "कार्ट में जोड़ें",
            detailBtnBuy: "अभी खरीदें",
            detailBtnTrace: "QR यात्रा देखें",
            detailTabStory: "🌿 खेत की कहानी & उत्पत्ति",
            detailTabTrace: "📱 बीज से थाली तक रिकॉर्ड",
            detailTabNutrition: "🥗 पोषण एवं प्रमाणन",
            detailTabReviews: "💬 ग्राहक समीक्षाएं",
            detailFarmerSpotlight: "किसान से मिलिए",
            detailDirectFromGrower: "👨‍🌾 सीधे किसान से",
            detailSendThanks: "किसान को धन्यवाद भेजें",
            detailListenVoice: "खेत से किसान का वॉइस नोट सुनें",
            reviewsHeading: "ग्राहक समीक्षाएं और किसान के उत्तर",
            reviewsSub: "सत्यापित खरीदारों के वास्तविक अनुभव",
            writeReviewBtn: "समीक्षा लिखें",
            verifiedBuyerBadge: "सत्यापित खरीदार",
            farmerReplyBadge: "किसान का उत्तर",
            artisanReplyBadge: "कारीगर का उत्तर",
            replyToCustomerBtn: "ग्राहक को उत्तर दें",
            postReplyBtn: "उत्तर भेजें",
            cancelBtn: "रद्द करें",
            noReviewsMsg: "इस उत्पाद पर अभी कोई समीक्षा नहीं है। अपने अनुभव साझा करने वाले पहले व्यक्ति बनें!",
            reviewSuccessMsg: "धन्यवाद! आपकी समीक्षा प्रकाशित कर दी गई है ⭐",
            replySuccessMsg: "किसान का उत्तर सफलतापूर्वक पोस्ट किया गया! ✅",
            multiFarmerBadge: "मल्टी-फार्मर बाज़ार",
            multiFarmerLocalSelling: "स्थानीय किसान बेच रहे हैं",
            multiFarmerCompareTitle: "इस उत्पाद को बेचने वाले सभी किसान",
            multiFarmerCompareSub: "खेत की कीमत, दूरी, स्टॉक और जैविक प्रमाणन की तुलना करें और अपनी पसंद के किसान से सीधे खरीदें।",
            multiFarmerSelectBtn: "यह किसान चुनें",
            multiFarmerSelectedBadge: "चयनित किसान",
            multiFarmerViewStore: "किसान स्टोर देखें",
            farmerStoreHeading: "किसान डायरेक्ट स्टोर",
            farmerStoreAboutTitle: "खेत के बारे में",
            farmerStoreDeliveryTitle: "डिलीवरी सुविधा",
            farmerStoreHarvestTitle: "इस खेत की ताज़ी फसल",
            farmerStoreFarmingType: "खेती का प्रकार:",
            farmerStoreStock: "स्टॉक:",
            farmerStoreHarvested: "कटाई:",
            farmerStoreDistance: "आपके पते से दूरी",
            farmerStoreAddToCart: "कार्ट में जोड़ें",
            farmerStoreBuyNow: "अभी खरीदें",
            cartTitle: "आपकी खरीदारी कार्ट",
            cartEmpty: "आपकी कार्ट खाली है!",
            cartEmptySub: "ताज़ी जैविक उपज जोड़कर स्वस्थ जीवन की शुरुआत करें।",
            cartSubtotal: "उप-योग:",
            cartDelivery: "डिलीवरी शुल्क:",
            cartFreeDelivery: "मुफ्त",
            cartTotal: "कुल देय राशि:",
            cartCheckoutBtn: "भुगतान के लिए आगे बढ़ें",
            cartContinueShop: "खरीदारी जारी रखें",
            checkoutTitle: "सुरक्षित चेकआउट",
            checkoutAddressHeading: "डिलीवरी का पता",
            checkoutPaymentHeading: "भुगतान का तरीका",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "क्रेडिट / डेबिट कार्ड",
            checkoutCod: "कैश ऑन डिलीवरी (COD)",
            checkoutPlaceOrder: "आर्डर की पुष्टि करें",
            checkoutOrderSummary: "आर्डर सारांश",
            loginTitle: "फार्म टू फोर्क लॉगिन",
            loginSub: "अपने खाते में सुरक्षित लॉगिन करें",
            loginRoleCustomer: "ग्राहक",
            loginRoleFarmer: "किसान",
            loginRoleArtisan: "कारीगर",
            loginRoleAdmin: "व्यवस्थापक",
            loginQuickDemo: "1-क्लिक डेमो खाते (5 खाते)",
            loginEmailLabel: "ईमेल या यूज़रनेम",
            loginPasswordLabel: "पासवर्ड",
            loginRemember: "मुझे याद रखें",
            loginAdminPortal: "व्यवस्थापक पोर्टल",
            loginBtnSubmit: "लॉग इन करें",
            loginOrOAuth: "Google के साथ जारी रखें",
            loginGoogleBtn: "Google से लॉगिन करें",
            loginGithubBtn: "GitHub से लॉगिन करें",
            loginNoAccount: "खाता नहीं है?",
            loginCreateAccount: "नया खाता बनाएं",
            loginBackHome: "होमपेज पर वापस जाएं",
            regTitle: "नया खाता बनाएं",
            regSub: "फार्म टू फोर्क परिवार का हिस्सा बनें",
            regNameLabel: "पूरा नाम",
            regEmailLabel: "ईमेल पता",
            regPhoneLabel: "फ़ोन नंबर",
            regPassLabel: "पासवर्ड",
            regConfirmLabel: "पासवर्ड की पुष्टि करें",
            regBtnSubmit: "खाता बनाएं",
            regAlreadyAccount: "पहले से खाता है?",
            regSignIn: "लॉग इन करें",
            dashWelcome: "नमस्ते,",
            dashFarmerTitle: "किसान डैशबोर्ड",
            dashArtisanTitle: "कारीगर डैशबोर्ड",
            dashCustomerTitle: "ग्राहक पोर्टल",
            dashAdminTitle: "मुख्य व्यवस्थापक डैशबोर्ड",
            dashStatTotalRevenue: "कुल राजस्व",
            dashStatActiveCrops: "सक्रिय फसलें",
            dashStatOrders: "कुल आर्डर",
            dashStatRating: "औसत रेटिंग",
            dashManageProduce: "उपज प्रबंधित करें",
            dashAddProduce: "नई फसल जोड़ें",
            dashUploadJourney: "यात्रा अपलोड करें",
            dashCustomerFeedbackSection: "ग्राहक समीक्षाएं और उत्तर",
            dashOrdersSection: "हाल के आर्डर",
            themeSettingsTitle: "थीम सेटिंग्स",
            langSettingsTitle: "भाषा चयन",
            settingsSavedToast: "प्राथमिकताएं सफलतापूर्वक सहेजी गईं!",
            btnSave: "सहेजें",
            btnCancel: "रद्द करें",
            btnDelete: "हटाएं",
            btnEdit: "संपादित करें",
            btnSubmit: "जमा करें",
            btnClose: "बंद करें",
            btnSearch: "खोजें",
            btnFilter: "फ़िल्टर",
            statusDelivered: "डिलीवर हो गया",
            statusProcessing: "प्रक्रिया जारी है",
            statusPending: "लंबित"
        },

        // 4. TELUGU (te)
        te: {
            brandName: "ఫార్మ్ టు ఫోర్క్",
            brandSub: "సమిష్టి వేదిక",
            navHome: "హోమ్",
            navShop: "ఉత్పత్తులు",
            navKitchen: "కమ్యూనిటీ వంటగది",
            navGroup: "సామూహిక కొనుగోలు",
            navSeed: "విత్తనం నుండి ప్లేట్ వరకు",
            navLogin: "లాగిన్",
            navSignup: "సైన్ అప్",
            navLogout: "లాగ్ అవుట్",
            navApiDocs: "API పత్రాలు",
            navDashboard: "డాష్‌బోర్డ్",
            navWishlist: "కోరికల జాబితా",
            wishlistHeading: "నా సేంద్రీయ కోరికల జాబితా",
            wishlistSub: "మీకు ఇష్టమైన తాజా పంటలు మరియు సహజ ఆరోగ్య ఆహారాలు",
            topOrganic: "100% ధృవీకరించబడిన సేంద్రీయ ఆహారం",
            topDelivery: "₹500 పైబడిన ఆర్డర్లపై ఉచిత ఎక్స్‌ప్రెస్ డెలివరీ",
            topZeroWaste: "సున్నా ఆహార వృధా & పునర్వినియోగ ప్యాకేజింగ్",
            topFrozen: "వండడానికి సిద్ధంగా ఉన్న ఫ్రోజెన్ కూరగాయలు",
            heroBadge: "విత్తనం నుండి ప్లేట్ వరకు QR ట్రాకింగ్",
            heroTitleMain: "మీ ఆహారాన్ని తెలుసుకోండి,",
            heroTitleSub: "విత్తనం నుండి మీ ప్లేట్ వరకు",
            heroDesc: "పొలం నుండి మీ భోజన బల్ల వరకు ప్రతి ఉత్పత్తిని QR కోడ్ ద్వారా ట్రాక్ చేయండి. 100% స్వచ్ఛమైనది, 100% పారదర్శకమైనది.",
            heroStatFed: "ఆహారం పొందిన ప్రజలు",
            heroStatFoodSaved: "కాపాడిన ఆహారం (కిలోలు)",
            heroStatCo2: "తగ్గించిన CO₂ (కిలోలు)",
            heroStatFarmers: "మద్దతు పొందిన రైతులు",
            heroBtnShop: "ఉత్పత్తులను చూడండి",
            heroBtnTrack: "ఆహారాన్ని ట్రాక్ చేయండి",
            heroFloatOrganic: "100% సేంద్రీయం",
            heroFloatFrozen: "ఫ్రోజెన్ ప్యాక్స్",
            frozenTag: "❄️ సరికొత్త పరిచయం",
            frozenTitle: "వండడానికి సిద్ధంగా ఉన్న <span class=\"gradient-text\">కూరగాయల ప్యాక్‌లు</span>",
            frozenDesc: "ముందుగానే కట్ చేసి శుభ్రపరిచిన సేంద్రీయ కూరగాయలు. సమయం ఆదా చేసుకోండి, ఆహారాన్ని వృధా చేయకండి!",
            frozenF1: "5 నిమిషాల్లో సిద్ధం",
            frozenF2: "తరగాల్సిన అవసరం లేదు",
            frozenF3: "100% సహజం",
            frozenBtn: "ఇప్పుడే కొనండి",
            featTag: "🌟 మమ్మల్ని ఎందుకు ఎంచుకోవాలి",
            featTitle: "మా ప్రత్యేక <span class=\"gradient-text\">లక్షణాలు</span>",
            feat1Title: "విత్తనం నుండి ప్లేట్ వరకు",
            feat1Desc: "QR కోడ్ స్కాన్ చేసి మీ ఆహార ప్రయాణాన్ని తెలుసుకోండి.",
            feat1Tag: "ప్రధాన ఫీచర్",
            feat2Title: "పర్యావరణ స్కోరు",
            feat2Desc: "ప్రతి ఉత్పత్తికి 0-100 పర్యావరణ పరిరక్షణ స్కోరు.",
            feat2Tag: "నాణ్యత",
            feat3Title: "కమ్యూనిటీ వంటగది",
            feat3Desc: "కలిసి వండుకోండి, ఆహారం పంచుకోండి, సున్నా వృధా.",
            feat3Tag: "సామాజిక చొరవ",
            feat4Title: "సామూహిక కొనుగోలు",
            feat4Desc: "టోకుగా ఆర్డర్ చేసి 30-50% వరకు ఆదా చేయండి.",
            feat4Tag: "భారీ పొదుపు",
            feat5Title: "కార్బన్ పాదముద్ర",
            feat5Desc: "పర్యావరణంపై మీ ఆహార ప్రభావాన్ని పరిశీలించండి.",
            feat5Tag: "పర్యావరణ హితం",
            feat6Title: "సీజనల్ బాక్స్",
            feat6Desc: "నెలవారీ ధృవీకృత సేంద్రీయ సబ్‌స్క్రిప్షన్ బాక్స్‌లు.",
            feat6Tag: "చందా పథకం",
            featLearnMore: "మరింత తెలుసుకోండి →",
            catTag: "🛒 వర్గాల వారీగా షాపింగ్",
            catTitle: "మా <span class=\"gradient-text\">సేకరణను అన్వేషించండి</span>",
            catVegTitle: "🌾 కూరగాయలు",
            catVegDesc: "తాజా & సహజ కూరగాయలు",
            catFruitTitle: "🍎 పండ్లు",
            catFruitDesc: "సీజనల్ మధురమైన పండ్లు",
            catHmTitle: "🧺 చేతితో చేసినవి",
            catHmDesc: "స్వచ్ఛమైన తేనె, హెర్బల్ సబ్బు & ఆవు నెయ్యి",
            catFrzTitle: "❄️ ఫ్రోజెన్ ప్యాక్స్",
            catFrzDesc: "వండడానికి సిద్ధంగా ఉన్న మిశ్రమాలు",
            catShopNow: "షాపింగ్ చేయండి →",
            prodTag: "🔥 అత్యధికంగా అమ్ముడైనవి",
            prodTitle: "ప్రత్యేక <span class=\"gradient-text\">ఉత్పత్తులు</span>",
            prodViewAll: "అన్ని ఉత్పత్తులను చూడండి →",
            impactTag: "🌍 మన సామూహిక ప్రభావం",
            impactTitle: "సమాజంలో మనం తెస్తున్న <span class=\"gradient-text\">మార్పు</span>",
            impactFed: "ఆహారం పొందిన ప్రజలు",
            impactSaved: "కాపాడిన ఆహారం (కిలోలు)",
            impactCo2: "తగ్గించిన CO₂ (కిలోలు)",
            impactFarmers: "మద్దతు పొందిన రైతులు",
            demoTag: "📱 ఇప్పుడే ప్రయత్నించండి",
            demoTitle: "మీ ఆహార ప్రయాణాన్ని <span class=\"gradient-text\">స్కాన్ చేసి చూడండి</span>",
            demoDesc: "QR కోడ్ ట్రాకింగ్ ఎలా పనిచేస్తుందో స్వయంగా చూడండి.",
            demoBtn: "నమూనా QR స్కాన్ చేయండి",
            demoF1: "రైతు వివరాలు",
            demoF2: "కోత తేదీ",
            demoF3: "రవాణా సమాచారం",
            kitchenTag: "🍽️ కలిసి వండుకుందాం",
            kitchenTitle: "కమ్యూనిటీ <span class=\"gradient-text\">వంటగదిలో చేరండి</span>",
            kitchenDesc: "పక్కింటి వారితో కలిసి వండుకోండి, ఆహారం పంచుకోండి, డబ్బు ఆదా చేయండి.",
            kitchenB1: "ఆహార ఖర్చులపై 40% వరకు ఆదా",
            kitchenB2: "సున్నా ఆహార వృధా జీవనశైలి",
            kitchenB3: "బలమైన సామాజిక సంబంధాలు",
            kitchenBtn: "మరింత తెలుసుకోండి →",
            testTag: "💬 కస్టమర్ అనుభవాలు",
            testTitle: "నిజమైన వ్యక్తుల <span class=\"gradient-text\">అనుభవాలు</span>",
            test1Role: "వినియోగదారుడు",
            test1Text: "\"ఫ్రోజెన్ కూరగాయల ప్యాక్‌లు అద్భుతం! ఉదయం వంట సమయం సగానికి తగ్గింది!\"",
            test2Role: "సేంద్రీయ రైతు",
            test2Text: "\"దళారులు లేకుండా నేరుగా కస్టమర్లకే విక్రయించడం వల్ల మంచి లాభం వస్తోంది!\"",
            test3Role: "కమ్యూనిటీ వంటగది లీడ్",
            test3Text: "\"కమ్యూనిటీ వంటగది ద్వారా ఆహార వృధాను పూర్తిగా అరికట్టాం!\"",
            newsTitle: "తాజా సమాచారాన్ని <span class=\"gradient-text\">పొందండి</span>",
            newsDesc: "తాజా పంటలు మరియు ప్రత్యేక ఆఫర్ల కోసం మీ ఈమెయిల్‌ను నమోదు చేయండి.",
            newsPlaceholder: "మీ ఈమెయిల్ చిరునామా...",
            newsBtn: "సబ్‌స్క్రైబ్",
            footerDesc: "సేంద్రీయ ఆహారం, పారదర్శకత మరియు సమిష్టి కృషితో ఆరోగ్యకరమైన సమాజ నిర్మాణం.",
            footerQuick: "త్వరిత లింకులు",
            footerCats: "వర్గాలు",
            footerSupport: "సహాయం",
            footerHelp: "సహాయ కేంద్రం",
            footerContact: "సంప్రదించండి",
            footerPrivacy: "గోప్యతా విధానం",
            footerCopy: "© 2026 ఫార్మ్ టు ఫోర్క్ కలెక్టివ్. సర్వహక్కులు ప్రత్యేకించబడ్డాయి. 🌱",
            shopHeaderTitle: "ధృవీకరించబడిన సేంద్రీయ పంటలు",
            shopHeaderSubtitle: "తమిళనాడు పునరుత్పాదక క్షేత్రాల నుండి నేరుగా మీ ఇంటికే వచ్చే తాజా ఉత్పత్తులు",
            shopFilterAll: "అన్ని ఉత్పత్తులు",
            shopFilterVeg: "🌾 కూరగాయలు",
            shopFilterFruit: "🍎 పండ్లు",
            shopFilterHm: "🧺 చేతితో చేసినవి",
            shopFilterFrz: "❄️ ఫ్రోజెన్ ప్యాక్స్",
            shopSearchPlaceholder: "🔍 సేంద్రీయ టమోటాలు, తేనె, ఆపిల్ శోధించండి...",
            shopSortDefault: "క్రమబద్ధీకరణ: డిఫాల్ట్",
            shopSortLow: "ధర: తక్కువ నుండి ఎక్కువ",
            shopSortHigh: "ధర: ఎక్కువ నుండి తక్కువ",
            shopSortRating: "అత్యధిక రేటింగ్",
            shopAddToCart: "బుట్టలో వేయి",
            shopTraceBtn: "ప్రయాణం చూడు",
            shopFreshBadge: "తాజా కోత",
            shopZeroChem: "రసాయన రహితం",
            detailBreadcrumbHome: "హోమ్",
            detailBreadcrumbShop: "ఉత్పత్తులు",
            detailInStock: "స్టాక్ అందుబాటులో ఉంది",
            detailLowStock: "తక్కువ స్టాక్",
            detailPurityIndex: "పర్యావరణ పరిరక్షణ & స్వచ్ఛత సూచిక",
            detailSelectQty: "పరిమాణాన్ని ఎంచుకోండి:",
            detailBtnCart: "బుట్టలో వేయి",
            detailBtnBuy: "ఇప్పుడే కొనండి",
            detailBtnTrace: "QR ప్రయాణం",
            detailTabStory: "🌿 పొలం కథ & మూలం",
            detailTabTrace: "📱 విత్తనం నుండి ప్లేట్ లాగ్స్",
            detailTabNutrition: "🥗 పోషకాలు & ధృవపత్రాలు",
            detailTabReviews: "💬 కస్టమర్ సమీక్షలు",
            detailFarmerSpotlight: "రైతు పరిచయం",
            detailDirectFromGrower: "👨‍🌾 నేరుగా రైతు వద్ద నుండి",
            detailSendThanks: "రైతుకు కృతజ్ఞతలు చెప్పండి",
            detailListenVoice: "పొలం నుండి రైతు వాయిస్ నోట్ వినండి",
            reviewsHeading: "వినియోగదారుల సమీక్షలు & రైతు సమాధానాలు",
            reviewsSub: "ధృవీకరించబడిన కొనుగోలుదారుల నిజమైన అనుభవాలు",
            writeReviewBtn: "సమీక్ష రాయండి",
            verifiedBuyerBadge: "ధృవీకరించబడిన కొనుగోలుదారు",
            farmerReplyBadge: "రైతు సమాధానం",
            artisanReplyBadge: "చేతివృత్తిదారుని సమాధానం",
            replyToCustomerBtn: "సమాధానం ఇవ్వండి",
            postReplyBtn: "సమాధానం పంపు",
            cancelBtn: "రద్దు",
            noReviewsMsg: "ఈ ఉత్పత్తికి ఇంకా సమీక్షలు లేవు. మీ మొదటి అనుభవాన్ని పంచుకోండి!",
            reviewSuccessMsg: "ధన్యవాదాలు! మీ సమీక్ష ప్రచురించబడింది ⭐",
            replySuccessMsg: "సమాధానం విజయవంతంగా పోస్ట్ చేయబడింది! ✅",
            multiFarmerBadge: "మల్టీ-ఫార్మర్ మార్కెట్",
            multiFarmerLocalSelling: "స్థానిక రైతులు అమ్ముతున్నారు",
            multiFarmerCompareTitle: "ఈ పంటను విక్రయిస్తున్న రైతులందరూ",
            multiFarmerCompareSub: "ధర, దూరం, నిల్వ మరియు సర్టిఫికేషన్‌లను సరిపోల్చి మీకు నచ్చిన రైతు వద్ద నేరుగా కొనుగోలు చేయండి.",
            multiFarmerSelectBtn: "ఈ రైతును ఎంచుకోండి",
            multiFarmerSelectedBadge: "ఎంచుకున్న రైతు",
            multiFarmerViewStore: "రైతు స్టోర్ చూడండి",
            farmerStoreHeading: "రైతు డైరెక్ట్ స్టోర్",
            farmerStoreAboutTitle: "పొలం గురించి",
            farmerStoreDeliveryTitle: "డెలివరీ లభ్యత",
            farmerStoreHarvestTitle: "ఈ పొలం యొక్క తాజా పంట",
            farmerStoreFarmingType: "వ్యవసాయ పద్ధతి:",
            farmerStoreStock: "నిల్వ:",
            farmerStoreHarvested: "కోత:",
            farmerStoreDistance: "మీ చిరునామా నుండి దూరం",
            farmerStoreAddToCart: "బుట్టలో వేయి",
            farmerStoreBuyNow: "ఇప్పుడే కొనండి",
            cartTitle: "మీ షాపింగ్ కార్ట్",
            cartEmpty: "మీ కార్ట్ ఖాళీగా ఉంది!",
            cartEmptySub: "తాజా సేంద్రీయ ఉత్పత్తులను జోడించి ఆరోగ్య ప్రయాణాన్ని ప్రారంభించండి.",
            cartSubtotal: "ఉపమొత్తం:",
            cartDelivery: "డెలివరీ ఛార్జ్:",
            cartFreeDelivery: "ఉచితం",
            cartTotal: "మొత్తం చెల్లించవలసినది:",
            cartCheckoutBtn: "చెల్లింపుకు వెళ్లండి",
            cartContinueShop: "షాపింగ్ కొనసాగించండి",
            checkoutTitle: "సురక్షిత చెల్లింపు",
            checkoutAddressHeading: "డెలివరీ చిరునామా",
            checkoutPaymentHeading: "చెల్లింపు విధానం",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "క్రెడిట్ / డెబిట్ కార్డు",
            checkoutCod: "క్యాష్ ఆన్ డెలివరీ (COD)",
            checkoutPlaceOrder: "ఆర్డర్‌ను నిర్ధారించండి",
            checkoutOrderSummary: "ఆర్డర్ సారాంశం",
            loginTitle: "ఫార్మ్ టు ఫోర్క్ లాగిన్",
            loginSub: "మీ ఖాతాలోకి సురక్షితంగా లాగిన్ అవ్వండి",
            loginRoleCustomer: "వినియోగదారుడు",
            loginRoleFarmer: "రైతు",
            loginRoleArtisan: "చేతివృత్తిదారుడు",
            loginRoleAdmin: "నిర్వాహకుడు",
            loginQuickDemo: "1-క్లిక్ డెమో ఖాతాలు (5 ఖాతాలు)",
            loginEmailLabel: "ఈమెయిల్ లేదా యూజర్‌నేమ్",
            loginPasswordLabel: "పాస్‌వర్డ్",
            loginRemember: "నన్ను గుర్తుంచుకో",
            loginAdminPortal: "అడ్మిన్ పోర్టల్",
            loginBtnSubmit: "లాగిన్ చేయండి",
            loginOrOAuth: "Google తో కొనసాగండి",
            loginGoogleBtn: "Google తో సైన్ ఇన్",
            loginGithubBtn: "GitHub తో సైన్ ఇన్",
            loginNoAccount: "ఖాతా లేదా?",
            loginCreateAccount: "కొత్త ఖాతా సృష్టించండి",
            loginBackHome: "హోమ్‌పేజీకి తిరిగి వెళ్లండి",
            regTitle: "ఖాతా సృష్టించండి",
            regSub: "ఫార్మ్ టు ఫోర్క్ కుటుంబంలో చేరండి",
            regNameLabel: "పూర్తి పేరు",
            regEmailLabel: "ఈమెయిల్ చిరునామా",
            regPhoneLabel: "ఫోన్ నంబర్",
            regPassLabel: "పాస్‌వర్డ్",
            regConfirmLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
            regBtnSubmit: "ఖాతా తెరవండి",
            regAlreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
            regSignIn: "లాగిన్ అవ్వండి",
            dashWelcome: "స్వాగతం,",
            dashFarmerTitle: "రైతు డాష్‌బోర్డ్",
            dashArtisanTitle: "చేతివృత్తిదారుల డాష్‌బోర్డ్",
            dashCustomerTitle: "కస్టమర్ పోర్టల్",
            dashAdminTitle: "ప్రధాన అడ్మిన్ డాష్‌బోర్డ్",
            dashStatTotalRevenue: "మొత్తం ఆదాయం",
            dashStatActiveCrops: "క్రియాశీల పంటలు",
            dashStatOrders: "ఆర్డర్లు",
            dashStatRating: "సగటు రేటింగ్",
            dashManageProduce: "పంటలను నిర్వహించండి",
            dashAddProduce: "కొత్త పంటను జోడించండి",
            dashUploadJourney: "ప్రయాణాన్ని అప్‌లోడ్ చేయండి",
            dashCustomerFeedbackSection: "కస్టమర్ సమీక్షలు & సమాధానాలు",
            dashOrdersSection: "ఇటీవలి ఆర్డర్లు",
            themeSettingsTitle: "థీమ్ సెట్టింగులు",
            langSettingsTitle: "భాష ఎంపిక",
            settingsSavedToast: "ప్రాధాన్యతలు విజయవంతంగా భద్రపరచబడ్డాయి!",
            btnSave: "సేవ్ చేయి",
            btnCancel: "రద్దు",
            btnDelete: "తొలగించు",
            btnEdit: "సవరించు",
            btnSubmit: "సమర్పించు",
            btnClose: "మూసివేయి",
            btnSearch: "వెతుకు",
            btnFilter: "ఫిల్టర్",
            statusDelivered: "డెలివరీ పూర్తయింది",
            statusProcessing: "పురోగతిలో ఉంది",
            statusPending: "పెండింగ్‌లో ఉంది"
        },

        // 5. MALAYALAM (ml)
        ml: {
            brandName: "ഫാം ടു ഫോർക്ക്",
            brandSub: "കൂട്ടായ്മ",
            navHome: "ഹോം",
            navShop: "വിഭവങ്ങൾ",
            navKitchen: "കമ്മ്യൂണിറ്റി അടുക്കള",
            navGroup: "ഗ്രൂപ്പ് പർച്ചേസ്",
            navSeed: "വിത്തു മുതൽ തളിക വരെ",
            navLogin: "ലോഗിൻ",
            navSignup: "രജിസ്റ്റർ ചെയ്യുക",
            navLogout: "ലോഗ് ഔട്ട്",
            navApiDocs: "API രേഖകൾ",
            navDashboard: "ഡാഷ്‌ബോർഡ്",
            navWishlist: "ആഗ്രഹപ്പട്ടിക",
            wishlistHeading: "എന്റെ ജൈവ ആഗ്രഹപ്പട്ടിക",
            wishlistSub: "നിങ്ങൾ ഇഷ്ടപ്പെട്ട പുതിയ ജൈവ കാർഷിക വിളകളും ഭക്ഷ്യവസ്തുക്കളും",
            topOrganic: "100% സാക്ഷ്യപ്പെടുത്തിയ ജൈവ ഭക്ഷണം",
            topDelivery: "₹500-ന് മുകളിലുള്ള ഓർഡറുകൾക്ക് സൗജന്യ ഡെലിവറി",
            topZeroWaste: "ഭക്ഷ്യ പാഴാക്കൽ പൂജ്യം & പരിസ്ഥിതി സൗഹൃദ പാക്കേജിംഗ്",
            topFrozen: "പാചകത്തിന് തയാറായ ഫ്രോസൺ പച്ചക്കറികൾ",
            heroBadge: "വിത്തു മുതൽ തളിക വരെ QR ട്രാക്കിംഗ്",
            heroTitleMain: "നിങ്ങളുടെ ഭക്ഷണത്തെ അറിയുക,",
            heroTitleSub: "വിത്തു മുതൽ നിങ്ങളുടെ തീന്മേശ വരെ",
            heroDesc: "പാടത്തു നിന്നും നിങ്ങളുടെ തീൻമേശയിലേക്ക് QR കോഡ് വഴി ഓരോ വിഭവവും ട്രാക്ക് ചെയ്യാം. 100% ജൈവം, 100% സുതാര്യം.",
            heroStatFed: "ഭക്ഷണം നൽകിയ കുടുംബങ്ങൾ",
            heroStatFoodSaved: "രക്ഷിച്ച ഭക്ഷണം (കിലോ)",
            heroStatCo2: "കുറച്ച CO₂ (കിലോ)",
            heroStatFarmers: "പിന്തുണച്ച കർഷകർ",
            heroBtnShop: "വിഭവങ്ങൾ കാണുക",
            heroBtnTrack: "ഭക്ഷണം ട്രാക്ക് ചെയ്യുക",
            heroFloatOrganic: "100% ജൈവം",
            heroFloatFrozen: "ഫ്രോസൺ പാക്കുകൾ",
            frozenTag: "❄️ പുതിയ അവതരണം",
            frozenTitle: "പാകം ചെയ്യാൻ തയാറായ <span class=\"gradient-text\">ഫ്രോസൺ പച്ചക്കറികൾ</span>",
            frozenDesc: "മുറിച്ചു കഴുകി വൃത്തിയാക്കിയ ജൈവ പച്ചക്കറികൾ. സമയം ലാഭിക്കൂ, ഭക്ഷണം പാഴാക്കാതിരിക്കൂ!",
            frozenF1: "5 മിനിറ്റിൽ തയാർ",
            frozenF2: "അരിയേണ്ട ആവശ്യമില്ല",
            frozenF3: "100% ശുദ്ധ ജൈവം",
            frozenBtn: "ഇപ്പോൾ വാങ്ങൂ",
            featTag: "🌟 എന്തുകൊണ്ട് ഞങ്ങളെ തിരഞ്ഞെടുക്കണം",
            featTitle: "ഞങ്ങളുടെ സവിശേഷ <span class=\"gradient-text\">സവിശേഷതകൾ</span>",
            feat1Title: "വിത്തു മുതൽ തളിക വരെ",
            feat1Desc: "QR കോഡ് സ്കാൻ ചെയ്തു ഭക്ഷണത്തിന്റെ യാത്ര അറിയാം.",
            feat1Tag: "പ്രധാന ഫീച്ചർ",
            feat2Title: "സുസ്ഥിരതാ സ്കോർ",
            feat2Desc: "ഓരോ ഉൽപ്പന്നത്തിനും 0-100 ഇക്കോ സ്കോർ ലഭിക്കുന്നു.",
            feat2Tag: "മികച്ച ഗുണനിലവാരം",
            feat3Title: "കമ്മ്യൂണിറ്റി അടുക്കള",
            feat3Desc: "ഒരുമിച്ചു പാചകം ചെയ്യൂ, ഭക്ഷണം പങ്കിടൂ, സീറോ വേസ്റ്റ്.",
            feat3Tag: "സാമൂഹിക സംരംഭം",
            feat4Title: "ഗ്രൂപ്പ് പർച്ചേസ്",
            feat4Desc: "കൂട്ടമായി ഓർഡർ ചെയ്തു 30-50% വരെ ലാഭിക്കൂ.",
            feat4Tag: "വൻ ലാഭം",
            feat5Title: "കാർബൺ ഫുട്പ്രിന്റ്",
            feat5Desc: "ഭക്ഷണം പരിസ്ഥിതിയിലുണ്ടാക്കുന്ന ആഘാതം നിരീക്ഷിക്കുക.",
            feat5Tag: "പ്രകൃതി സൗഹൃദം",
            feat6Title: "സീസണൽ ബോക്സ്",
            feat6Desc: "പ്രതിമാസ സാക്ഷ്യപ്പെടുത്തിയ ജൈവ വരിസംഖ്യാ പെട്ടികൾ.",
            feat6Tag: "സബ്സ്ക്രിപ്ഷൻ",
            featLearnMore: "കൂടുതലറിയാൻ →",
            catTag: "🛒 വിഭാഗം തിരിച്ചു വാങ്ങാം",
            catTitle: "ഞങ്ങളുടെ <span class=\"gradient-text\">വിഭവ ശേഖരം</span>",
            catVegTitle: "🌾 പച്ചക്കറികൾ",
            catVegDesc: "ഫ്രഷ് & ജൈവ പച്ചക്കറികൾ",
            catFruitTitle: "🍎 പഴങ്ങൾ",
            catFruitDesc: "സീസണൽ മധുരപ്പഴങ്ങൾ",
            catHmTitle: "🧺 കൈത്തറി ഉൽപ്പന്നങ്ങൾ",
            catHmDesc: "തേൻ, ഹെർബൽ സോപ്പ് & നാടൻ നെയ്യ്",
            catFrzTitle: "❄️ ഫ്രോസൺ പാക്കുകൾ",
            catFrzDesc: "പാചകത്തിന് തയാറായ മിശ്രിതങ്ങൾ",
            catShopNow: "വാങ്ങൂ →",
            prodTag: "🔥 ഏറ്റവും കൂടുതൽ വിറ്റഴിക്കപ്പെടുന്നവ",
            prodTitle: "പ്രത്യേക <span class=\"gradient-text\">വിഭവങ്ങൾ</span>",
            prodViewAll: "എല്ലാ വിഭവങ്ങളും കാണുക →",
            impactTag: "🌍 നമ്മുടെ സംയുക്ത സ്വാധീനം",
            impactTitle: "സമൂഹത്തിൽ നാം കൊണ്ടുവരുന്ന <span class=\"gradient-text\">മാറ്റം</span>",
            impactFed: "ഭക്ഷണം നൽകിയ കുടുംബങ്ങൾ",
            impactSaved: "രക്ഷിച്ച ഭക്ഷണം (കിലോ)",
            impactCo2: "കുറച്ച CO₂ (കിലോ)",
            impactFarmers: "പിന്തുണച്ച കർഷകർ",
            demoTag: "📱 ഇപ്പോൾ തന്നെ പരീക്ഷിക്കൂ",
            demoTitle: "ഭക്ഷണ യാത്ര <span class=\"gradient-text\">സ്കാൻ ചെയ്തു കാണൂ</span>",
            demoDesc: "QR ട്രാക്കിംഗ് എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് കാണാൻ താഴെ ക്ലിക്ക് ചെയ്യുക.",
            demoBtn: "മാതൃക QR സ്കാൻ ചെയ്യുക",
            demoF1: "കൃഷിയിട വിവരങ്ങൾ",
            demoF2: "വിളവെടുത്ത തീയതി",
            demoF3: "വിതരണ വിവരങ്ങൾ",
            kitchenTag: "🍽️ ഒരുമിച്ചു പാചകം ചെയ്യാം",
            kitchenTitle: "കമ്മ്യൂണിറ്റി <span class=\"gradient-text\">അടുക്കളയിൽ പങ്കുചേരൂ</span>",
            kitchenDesc: "അയൽക്കാരുമായി ചേർന്ന് പാകം ചെയ്യൂ, ഭക്ഷണം പങ്കിടൂ, പണം ലാഭിക്കൂ.",
            kitchenB1: "ഭക്ഷണച്ചിലവിൽ 40% വരെ ലാഭം",
            kitchenB2: "ഭക്ഷണം പാഴാക്കാത്ത ജീവിതരീതി",
            kitchenB3: "ദൃഢമായ സാമൂഹിക സൗഹൃദം",
            kitchenBtn: "കൂടുതലറിയാൻ →",
            testTag: "💬 ഉപഭോക്തൃ പ്രതികരണങ്ങൾ",
            testTitle: "യഥാർത്ഥ ആളുകളുടെ <span class=\"gradient-text\">അനുഭവങ്ങൾ</span>",
            test1Role: "ഉപഭോക്താവ്",
            test1Text: "\"ഫ്രോസൺ പാക്കുകൾ മികച്ചതാണ്! രാവിലെ പാചക സമയം പകുതിയായി ലാഭിക്കാം!\"",
            test2Role: "ജൈവ കർഷകൻ",
            test2Text: "\"ഇടനിലക്കാരില്ലാതെ ഉപഭോക്താക്കളിലേക്ക് നേരിട്ടെത്തുന്നു. മികച്ച വില ലഭിക്കുന്നു!\"",
            test3Role: "കമ്മ്യൂണിറ്റി കിച്ചൻ ലീഡ്",
            test3Text: "\"കമ്മ്യൂണിറ്റി അടുക്കള വഴി ഭക്ഷ്യ പാഴാക്കൽ പൂർണ്ണമായും ഇല്ലാതാക്കാൻ കഴിഞ്ഞു!\"",
            newsTitle: "പുതിയ വിവരങ്ങൾ <span class=\"gradient-text\">ലഭിക്കൂ</span>",
            newsDesc: "പുതിയ വിളവെടുപ്പുകളും കിഴിവുകളും അറിയാൻ ഇമെയിൽ രജിസ്റ്റർ ചെയ്യുക.",
            newsPlaceholder: "ഇമെയിൽ വിലാസം നൽകുക...",
            newsBtn: "സബ്സ്ക്രൈബ്",
            footerDesc: "ജൈവ ഭക്ഷണം, സുതാര്യത, കൂട്ടായ്മ എന്നിവയിലൂടെ ആരോഗ്യകരമായ ഒരു സമൂഹം കെട്ടിപ്പടുക്കുന്നു.",
            footerQuick: "പ്രധാന ലിങ്കുകൾ",
            footerCats: "വിഭാഗങ്ങൾ",
            footerSupport: "സഹായം",
            footerHelp: "സഹായ കേന്ദ്രം",
            footerContact: "ബന്ധപ്പെടുക",
            footerPrivacy: "സ്വകാര്യതാ നയം",
            footerCopy: "© 2026 ഫാം ടു ഫോർക്ക് കളക്റ്റീവ്. സർവ്വ അവകാശങ്ങളും നിക്ഷിപ്തം. 🌱",
            shopHeaderTitle: "സാക്ഷ്യപ്പെടുത്തിയ ജൈവ വിഭവങ്ങൾ",
            shopHeaderSubtitle: "തമിഴ്‌നാട്ടിലെ തനതു കൃഷിയിടങ്ങളിൽ നിന്നും നേരിട്ട് നിങ്ങളുടെ തീന്മേശയിലേക്ക്",
            shopFilterAll: "എല്ലാ വിഭവങ്ങളും",
            shopFilterVeg: "🌾 പച്ചക്കറികൾ",
            shopFilterFruit: "🍎 പഴങ്ങൾ",
            shopFilterHm: "🧺 കൈത്തറി ഉൽപ്പന്നങ്ങൾ",
            shopFilterFrz: "❄️ ഫ്രോസൺ പാക്കുകൾ",
            shopSearchPlaceholder: "🔍 ജൈവ തക്കാളി, തേൻ, ആപ്പിൾ തിരയുക...",
            shopSortDefault: "ക്രമീകരിക്കുക: സ്വതവേയുള്ളത്",
            shopSortLow: "വില: കുറഞ്ഞതിൽ നിന്ന് കൂടുതൽ",
            shopSortHigh: "വില: കൂടിയതിൽ നിന്ന് കുറവ്",
            shopSortRating: "കൂടിയ റേറ്റിംഗ്",
            shopAddToCart: "കൂടയിൽ ചേർക്കുക",
            shopTraceBtn: "യാത്ര കാണുക",
            shopFreshBadge: "പുതിയ വിളവ്",
            shopZeroChem: "കീടനാശിനി രഹിതം",
            detailBreadcrumbHome: "ഹോം",
            detailBreadcrumbShop: "വിഭവങ്ങൾ",
            detailInStock: "സ്റ്റോക്കുണ്ട് & പുതിയത്",
            detailLowStock: "കുറഞ്ഞ സ്റ്റോക്ക്",
            detailPurityIndex: "പരിസ്ഥിതി സംരക്ഷണ & ശുദ്ധി സൂചിക",
            detailSelectQty: "അളവ് തിരഞ്ഞെടുക്കുക:",
            detailBtnCart: "കൂടയിൽ ചേർക്കുക",
            detailBtnBuy: "ഇപ്പോൾ വാങ്ങുക",
            detailBtnTrace: "QR യാത്ര കാണുക",
            detailTabStory: "🌿 തോട്ടത്തിന്റെ കഥ & ഉത്ഭവം",
            detailTabTrace: "📱 വിത്തു മുതൽ തളിക വരെ രേഖകൾ",
            detailTabNutrition: "🥗 പോഷകങ്ങളും സർട്ടിഫിക്കറ്റുകളും",
            detailTabReviews: "💬 ഉപഭോക്തൃ അവലോകനങ്ങൾ",
            detailFarmerSpotlight: "കർഷകനെ അറിയുക",
            detailDirectFromGrower: "👨‍🌾 കർഷകനിൽ നിന്ന് നേരിട്ട്",
            detailSendThanks: "കർഷകന് നന്ദി അറിയിക്കുക",
            detailListenVoice: "പാടത്തുനിന്നുള്ള കർഷകന്റെ ശബ്ദ സന്ദേശം കേൾക്കൂ",
            reviewsHeading: "ഉപഭോക്തൃ അവലോകനങ്ങളും കർഷകന്റെ മറുപടിയും",
            reviewsSub: "പരിശോധിച്ചുറപ്പിച്ച ഉപഭോക്താക്കളുടെ അനുഭവങ്ങൾ",
            writeReviewBtn: "അഭിപ്രായം രേഖപ്പെടുത്തുക",
            verifiedBuyerBadge: "സ്ഥിരീകരിച്ച ഉപഭോക്താവ്",
            farmerReplyBadge: "കർഷകന്റെ മറുപടി",
            artisanReplyBadge: "കരകൗശല വിദഗ്ദ്ധന്റെ മറുപടി",
            replyToCustomerBtn: "മറുപടി നൽകുക",
            postReplyBtn: "മറുപടി അയക്കുക",
            cancelBtn: "റദ്ദാക്കുക",
            noReviewsMsg: "ഈ ഉൽപ്പന്നത്തിന് ഇതുവരെ അവലോകനങ്ങൾ ഇല്ല. നിങ്ങളുടെ അനുഭവം ആദ്യം പങ്കിടൂ!",
            reviewSuccessMsg: "നന്ദി! നിങ്ങളുടെ അഭിപ്രായം പ്രസിദ്ധീകരിച്ചു ⭐",
            replySuccessMsg: "കർഷകന്റെ മറുപടി വിജയകരമായി പോസ്റ്റ് ചെയ്തു! ✅",
            multiFarmerBadge: "മൾട്ടി-ഫാർമർ വിപണി",
            multiFarmerLocalSelling: "പ്രാദേശിക കർഷകർ വിൽക്കുന്നു",
            multiFarmerCompareTitle: "ഈ ഉൽപ്പന്നം വിൽക്കുന്ന എല്ലാ കർഷകരും",
            multiFarmerCompareSub: "വില, ദൂരം, സ്റ്റോക്ക് എന്നിവ താരതമ്യം ചെയ്തു ഇഷ്ടമുള്ള കർഷകനിൽ നിന്ന് നേരിട്ട് വാങ്ങൂ.",
            multiFarmerSelectBtn: "ഈ കർഷകനെ തിരഞ്ഞെടുക്കൂ",
            multiFarmerSelectedBadge: "തിരഞ്ഞെടുത്ത കർഷകൻ",
            multiFarmerViewStore: "കർഷക സ്റ്റോർ കാണുക",
            farmerStoreHeading: "കർഷക ഡയറക്റ്റ് സ്റ്റോർ",
            farmerStoreAboutTitle: "കൃഷിയിടത്തെക്കുറിച്ച്",
            farmerStoreDeliveryTitle: "ഡെലിവറി സൗകര്യം",
            farmerStoreHarvestTitle: "ഈ കൃഷിയിടത്തിലെ പുതിയ വിളവ്",
            farmerStoreFarmingType: "കൃഷിരീതി:",
            farmerStoreStock: "സ്റ്റോക്ക്:",
            farmerStoreHarvested: "വിളവെടുത്തത്:",
            farmerStoreDistance: "നിങ്ങളുടെ വിലാസത്തിൽ നിന്നുള്ള ദൂരം",
            farmerStoreAddToCart: "കൂടയിൽ ചേർക്കുക",
            farmerStoreBuyNow: "ഇപ്പോൾ വാങ്ങുക",
            cartTitle: "നിങ്ങളുടെ കാർട്ട്",
            cartEmpty: "നിങ്ങളുടെ കാർട്ട് ശൂന്യമാണ്!",
            cartEmptySub: "പുതിയ ജൈവ ഉൽപ്പന്നങ്ങൾ കാർട്ടിൽ ചേർത്തോളൂ.",
            cartSubtotal: "ആകെ തുക:",
            cartDelivery: "ഡെലിവറി ഫീസ്:",
            cartFreeDelivery: "സൗജന്യം",
            cartTotal: "അടയ്ക്കാനുള്ള തുക:",
            cartCheckoutBtn: "പേയ്‌മെന്റിലേക്ക് പോവുക",
            cartContinueShop: "ഷോപ്പിംഗ് തുടരുക",
            checkoutTitle: "സുരക്ഷിത ചെക്ക്ഔട്ട്",
            checkoutAddressHeading: "ഡെലിവറി വിലാസം",
            checkoutPaymentHeading: "പേയ്‌മെന്റ് രീതി",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "ക്രെഡിറ്റ് / ഡെബിറ്റ് കാർഡ്",
            checkoutCod: "ക്യാഷ് ഓൺ ഡെലിവറി (COD)",
            checkoutPlaceOrder: "ഓർഡർ ഉറപ്പാക്കുക",
            checkoutOrderSummary: "ഓർഡർ സംഗ്രഹം",
            loginTitle: "ഫാം ടു ഫോർക്ക് ലോഗിൻ",
            loginSub: "നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് ലോഗിൻ ചെയ്യുക",
            loginRoleCustomer: "ഉപഭോക്താവ്",
            loginRoleFarmer: "കർഷകൻ",
            loginRoleArtisan: "കരകൗശല വിദഗ്ദ്ധൻ",
            loginRoleAdmin: "അഡ്മിൻ",
            loginQuickDemo: "1-ക്ലിക്ക് ഡെമോ അക്കൗണ്ടുകൾ (5 അക്കൗണ്ടുകൾ)",
            loginEmailLabel: "ഇമെയിൽ അല്ലെങ്കിൽ ഉപയോക്തൃനാമം",
            loginPasswordLabel: "പാസ്‌വേഡ്",
            loginRemember: "ഓർമ്മിക്കുക",
            loginAdminPortal: "അഡ്മിൻ പോർട്ടൽ",
            loginBtnSubmit: "ലോഗിൻ ചെയ്യുക",
            loginOrOAuth: "Google വഴി തുടരുക",
            loginGoogleBtn: "Google ലോഗിൻ",
            loginGithubBtn: "GitHub ലോഗിൻ",
            loginNoAccount: "അക്കൗണ്ട് ഇല്ലേ?",
            loginCreateAccount: "പുതിയ അക്കൗണ്ട് ഉണ്ടാക്കുക",
            loginBackHome: "ഹോംപേജിലേക്ക് മടങ്ങുക",
            regTitle: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
            regSub: "ഫാം ടു ഫോർക്ക് കൂട്ടായ്മയിൽ ചേരൂ",
            regNameLabel: "പൂർണ്ണമായ പേര്",
            regEmailLabel: "ഇമെയിൽ വിലാസം",
            regPhoneLabel: "ഫോൺ നമ്പർ",
            regPassLabel: "പാസ്‌വേഡ്",
            regConfirmLabel: "പാസ്‌വേഡ് ഉറപ്പാക്കുക",
            regBtnSubmit: "രജിസ്റ്റർ ചെയ്യുക",
            regAlreadyAccount: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
            regSignIn: "ലോഗിൻ ചെയ്യുക",
            dashWelcome: "സ്വാഗതം,",
            dashFarmerTitle: "കർഷക ഡാഷ്‌ബോർഡ്",
            dashArtisanTitle: "കരകൗശല വിദഗ്ദ്ധ ഡാഷ്‌ബോർഡ്",
            dashCustomerTitle: "കസ്റ്റമർ പോർട്ടൽ",
            dashAdminTitle: "പ്രധാന അഡ്മിൻ ഡാഷ്‌ബോർഡ്",
            dashStatTotalRevenue: "ആകെ വരുമാനം",
            dashStatActiveCrops: "നിലവിലെ വിളകൾ",
            dashStatOrders: "ഓർഡറുകൾ",
            dashStatRating: "ശരാശരി റേറ്റിംഗ്",
            dashManageProduce: "വിളകൾ കൈകാര്യം ചെയ്യുക",
            dashAddProduce: "പുതിയ വിള ചേർക്കുക",
            dashUploadJourney: "യാത്ര അപ്‌ലോഡ് ചെയ്യുക",
            dashCustomerFeedbackSection: "ഉപഭോക്തൃ പ്രതികരണങ്ങളും മറുപടികളും",
            dashOrdersSection: "സമീപകാല ഓർഡറുകൾ",
            themeSettingsTitle: "തീം ക്രമീകരണങ്ങൾ",
            langSettingsTitle: "ഭാഷ തിരഞ്ഞെടുക്കൽ",
            settingsSavedToast: "ക്രമീകരണങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!",
            btnSave: "സേവ് ചെയ്യുക",
            btnCancel: "റദ്ദാക്കുക",
            btnDelete: "ഡിലീറ്റ് ചെയ്യുക",
            btnEdit: "എഡിറ്റ് ചെയ്യുക",
            btnSubmit: "സമർപ്പിക്കുക",
            btnClose: "അടയ്ക്കുക",
            btnSearch: "തിരയുക",
            btnFilter: "ഫിൽട്ടർ",
            statusDelivered: "ഡെലിവർ ചെയ്തു",
            statusProcessing: "നടന്നുകൊണ്ടിരിക്കുന്നു",
            statusPending: "തീർപ്പാക്കാനുണ്ട്"
        },

        // 6. KANNADA (kn)
        kn: {
            brandName: "ಫಾರ್ಮ್ ಟು ಫೋರ್ಕ್",
            brandSub: "ಸಹಭಾಗಿತ್ವ",
            navHome: "ಮುಖಪುಟ",
            navShop: "ಉತ್ಪನ್ನಗಳು",
            navKitchen: "ಸಮುದಾಯ ಅಡುಗೆಮನೆ",
            navGroup: "ಗುಂಪು ಖರೀದಿ",
            navSeed: "ಬೀಜದಿಂದ ತಟ್ಟೆಯವರೆಗೆ",
            navLogin: "ಲಾಗಿನ್",
            navSignup: "ಸೈನ್ ಅಪ್",
            navLogout: "ಲಾಗ್ ಔಟ್",
            navApiDocs: "API ದಾಖಲೆಗಳು",
            navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            navWishlist: "ಇಷ್ಟಪಟ್ಟ ಪಟ್ಟಿ",
            wishlistHeading: "ನನ್ನ ಸಾವಯವ ಇಷ್ಟಪಟ್ಟ ಪಟ್ಟಿ",
            wishlistSub: "ನೀವು ಇಷ್ಟಪಟ್ಟ ತಾಜಾ ಸಾವಯವ ಬೆಳೆಗಳು ಮತ್ತು ಆಹಾರ ಪದಾರ್ಥಗಳು",
            topOrganic: "100% ಪ್ರಮಾಣೀಕೃತ ಸಾವಯವ ಆಹಾರ",
            topDelivery: "₹500 ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಆರ್ಡರ್‌ಗಳಿಗೆ ಉಚಿತ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಡೆಲಿವರಿ",
            topZeroWaste: "ಶೂನ್ಯ ಆಹಾರ ಪೋಲು & ಪರಿಸರ ಸ್ನೇಹಿ ಪ್ಯಾಕೇಜಿಂಗ್",
            topFrozen: "ಅಡುಗೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಹೆಪ್ಪುಗಟ್ಟಿದ ತರಕಾರಿಗಳು",
            heroBadge: "ಬೀಜದಿಂದ ತಟ್ಟೆಯವರೆಗೆ QR ಟ್ರ್ಯಾಕಿಂಗ್",
            heroTitleMain: "ನಿಮ್ಮ ಆಹಾರವನ್ನು ತಿಳಿಯಿರಿ,",
            heroTitleSub: "ಬೀಜದಿಂದ ನಿಮ್ಮ ಊಟದ ತಟ್ಟೆಯವರೆಗೆ",
            heroDesc: "ಹೊಲದಿಂದ ನಿಮ್ಮ ಊಟದ ಮೇಜಿನವರೆಗೆ ಪ್ರತಿಯೊಂದು ಉತ್ಪನ್ನವನ್ನು QR ಕೋಡ್ ಮೂಲಕ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. 100% ಸಾವಯವ, 100% ಪಾರದರ್ಶಕ.",
            heroStatFed: "ಆಹಾರ ಪಡೆದ ಕುಟುಂಬಗಳು",
            heroStatFoodSaved: "ಉಳಿಸಿದ ಆಹಾರ (ಕೆಜಿ)",
            heroStatCo2: "ಕಡಿಮೆ ಮಾಡಿದ CO₂ (ಕೆಜಿ)",
            heroStatFarmers: "ಬೆಂಬಲಿತ ರೈತರು",
            heroBtnShop: "ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ",
            heroBtnTrack: "ಆಹಾರವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
            heroFloatOrganic: "100% ಸಾವಯವ",
            heroFloatFrozen: "ಫ್ರೋಜನ್ ಪ್ಯಾಕ್‌ಗಳು",
            frozenTag: "❄️ ಹೊಸ ಪರಿಚಯ",
            frozenTitle: "ಅಡುಗೆಗೆ ಸಿದ್ಧವಾಗಿರುವ <span class=\"gradient-text\">ಫ್ರೋಜನ್ ತರಕಾರಿ ಪ್ಯಾಕ್‌ಗಳು</span>",
            frozenDesc: "ಮೊದಲೇ ಕತ್ತರಿಸಿ ಸ್ವಚ್ಛಗೊಳಿಸಿದ ಸಾವಯವ ತರಕಾರಿಗಳು. ಸಮಯ ಉಳಿಸಿ, ಆಹಾರ ಪೋಲು ಮಾಡಬೇಡಿ!",
            frozenF1: "5 ನಿಮಿಷಗಳಲ್ಲಿ ಸಿದ್ಧ",
            frozenF2: "ಹೆಚ್ಚುವ ಅಗತ್ಯವಿಲ್ಲ",
            frozenF3: "100% ನೈಸರ್ಗಿಕ",
            frozenBtn: "ಈಗಲೇ ಖರೀದಿಸಿ",
            featTag: "🌟 ನಮ್ಮನ್ನು ಏಕೆ ಆರಿಸಬೇಕು",
            featTitle: "ನಮ್ಮ ವಿಶಿಷ್ಟ <span class=\"gradient-text\">ವೈಶಿಷ್ಟ್ಯಗಳು</span>",
            feat1Title: "ಬೀಜದಿಂದ ತಟ್ಟೆಯವರೆಗೆ",
            feat1Desc: "QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನಿಮ್ಮ ಆಹಾರದ ಸಂಪೂರ್ಣ ಪ್ರಯಾಣವನ್ನು ತಿಳಿಯಿರಿ.",
            feat1Tag: "ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯ",
            feat2Title: "ಪರಿಸರ ಸ್ಕೋರ್",
            feat2Desc: "ಪ್ರತಿ ಉತ್ಪನ್ನಕ್ಕೆ 0-100 ಪರಿಸರ ರಕ್ಷಣೆಯ ಸ್ಕೋರ್.",
            feat2Tag: "ಗುಣಮಟ್ಟ",
            feat3Title: "ಸಮುದಾಯ ಅಡುಗೆಮನೆ",
            feat3Desc: "ಜೊತೆಯಾಗಿ ಅಡುಗೆ ಮಾಡಿ, ಊಟ ಹಂಚಿಕೊಳ್ಳಿ, ಶೂನ್ಯ ಪೋಲು.",
            feat3Tag: "ಸಾಮಾಜಿಕ ಉಪಕ್ರಮ",
            feat4Title: "ಗುಂಪು ಖರೀದಿ",
            feat4Desc: "ಒಟ್ಟಾಗಿ ಆರ್ಡರ್ ಮಾಡಿ 30-50% ಹಣ ಉಳಿಸಿ.",
            feat4Tag: "ದೊಡ್ಡ ಉಳಿತಾಯ",
            feat5Title: "ಕಾರ್ಬನ್ ಹೆಜ್ಜೆಗುರುತು",
            feat5Desc: "ಪರಿಸರದ ಮೇಲೆ ನಿಮ್ಮ ಆಹಾರದ ಪ್ರಭಾವವನ್ನು ಗಮನಿಸಿ.",
            feat5Tag: "ಪರಿಸರ ಸ್ನೇಹಿ",
            feat6Title: "ಋತುಮಾನದ ಬಾಕ್ಸ್",
            feat6Desc: "ಮಾಸಿಕ ಪ್ರಮಾಣೀಕೃತ ಸಾವಯವ ಚಂದಾದಾರಿಕೆ ಪೆಟ್ಟಿಗೆಗಳು.",
            feat6Tag: "ಚಂದಾದಾರಿಕೆ",
            featLearnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ →",
            catTag: "🛒 ವರ್ಗವಾರು ಖರೀದಿ",
            catTitle: "ನಮ್ಮ <span class=\"gradient-text\">ಸಂಗ್ರಹವನ್ನು ಅನ್ವೇಷಿಸಿ</span>",
            catVegTitle: "🌾 ತರಕಾರಿಗಳು",
            catVegDesc: "ತಾಜಾ & ಸಾವಯವ ತರಕಾರಿಗಳು",
            catFruitTitle: "🍎 ಹಣ್ಣುಗಳು",
            catFruitDesc: "ಋತುಮಾನದ ಮಧುರ ಹಣ್ಣುಗಳು",
            catHmTitle: "🧺 ಕೈಯಿಂದ ತಯಾರಿಸಿದವು",
            catHmDesc: "ಜೇನುತುಪ್ಪ, ಗಿಡಮೂಲಿಕೆ ಸಾಬೂನು & ಹಸುವಿನ ತುಪ್ಪ",
            catFrzTitle: "❄️ ಫ್ರೋಜನ್ ಪ್ಯಾಕ್‌ಗಳು",
            catFrzDesc: "ಅಡುಗೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ತರಕಾರಿ ಮಿಶ್ರಣಗಳು",
            catShopNow: "ಖರೀದಿಸಿ →",
            prodTag: "🔥 ಹೆಚ್ಚು ಮಾರಾಟವಾದವು",
            prodTitle: "ವಿಶೇಷ <span class=\"gradient-text\">ಉತ್ಪನ್ನಗಳು</span>",
            prodViewAll: "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳನ್ನು ವೀಕ್ಷಿಸಿ →",
            impactTag: "🌍 ನಮ್ಮ ಸಾಮೂಹಿಕ ಪ್ರಭಾವ",
            impactTitle: "ಸಮಾಜದಲ್ಲಿ ನಾವು ತರುತ್ತಿರುವ <span class=\"gradient-text\">ಬದಲಾವಣೆ</span>",
            impactFed: "ಆಹಾರ ಪಡೆದ ಕುಟುಂಬಗಳು",
            impactSaved: "ಉಳಿಸಿದ ಆಹಾರ (ಕೆಜಿ)",
            impactCo2: "ಕಡಿಮೆ ಮಾಡಿದ CO₂ (ಕೆಜಿ)",
            impactFarmers: "ಬೆಂಬಲಿತ ರೈತರು",
            demoTag: "📱 ಈಗಲೇ ಪ್ರಯತ್ನಿಸಿ",
            demoTitle: "ನಿಮ್ಮ ಆಹಾರದ ಪ್ರಯಾಣವನ್ನು <span class=\"gradient-text\">ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನೋಡಿ</span>",
            demoDesc: "QR ಕೋಡ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಅನುಭವಿಸಲು ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
            demoBtn: "ಮಾದರಿ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
            demoF1: "ಹೊಲದ ವಿವರಗಳು",
            demoF2: "ಕೊಯ್ಲು ದಿನಾಂಕ",
            demoF3: "ವಿತರಣಾ ಮಾಹಿತಿ",
            kitchenTag: "🍽️ ಜೊತೆಯಾಗಿ ಅಡುಗೆ ಮಾಡೋಣ",
            kitchenTitle: "ಸಮುದಾಯ <span class=\"gradient-text\">ಅಡುಗೆಮನೆಗೆ ಸೇರಿ</span>",
            kitchenDesc: "ನೆರೆಹೊರೆಯವರೊಂದಿಗೆ ಅಡುಗೆ ಮಾಡಿ, ಊಟ ಹಂಚಿಕೊಳ್ಳಿ, ಹಣ ಉಳಿಸಿ.",
            kitchenB1: "ಆಹಾರ ವೆಚ್ಚದಲ್ಲಿ 40% ವರೆಗೆ ಉಳಿತಾಯ",
            kitchenB2: "ಶೂನ್ಯ ಆಹಾರ ಪೋಲು ಜೀವನಶೈಲಿ",
            kitchenB3: "ಬಲವಾದ ಸಮುದಾಯ ಬಾಂಧವ್ಯ",
            kitchenBtn: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ →",
            testTag: "💬 ಗ್ರಾಹಕರ ಅನುಭವಗಳು",
            testTitle: "ನೈಜ ಜನರ <span class=\"gradient-text\">ಅನುಭವಗಳು</span>",
            test1Role: "ಗ್ರಾಹಕ",
            test1Text: "\"ಫ್ರೋಜನ್ ತರಕಾರಿ ಪ್ಯಾಕ್‌ಗಳು ಅದ್ಭುತವಾಗಿವೆ! ಬೆಳಗ್ಗೆ ಅಡುಗೆ ಸಮಯ ಅರ್ಧದಷ್ಟು ಉಳಿಯುತ್ತದೆ!\"",
            test2Role: "ಸಾವಯವ ರೈತ",
            test2Text: "\"ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಗ್ರಾಹಕರಿಗೆ ಮಾರಾಟ ಮಾಡುತ್ತಿರುವುದರಿಂದ ಉತ್ತಮ ಬೆಲೆ ಸಿಗುತ್ತಿದೆ!\"",
            test3Role: "ಸಮುದಾಯ ಅಡುಗೆಮನೆ ಮುಖ್ಯಸ್ಥ",
            test3Text: "\"ಸಮುದಾಯ ಅಡುಗೆಮನೆಯಿಂದ ಆಹಾರ ಪೋಲಾಗುವುದನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ತಡೆದಿದ್ದೇವೆ!\"",
            newsTitle: "ತಾಜಾ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು <span class=\"gradient-text\">ಪಡೆಯಿರಿ</span>",
            newsDesc: "ತಾಜಾ ಕೊಯ್ಲು ಮತ್ತು ರಿಯಾಯಿತಿ ಆಫರ್‌ಗಳಿಗಾಗಿ ನಿಮ್ಮ ಇಮೇಲ್ ನೋಂದಾಯಿಸಿ.",
            newsPlaceholder: "ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ...",
            newsBtn: "ಚಂದಾದಾರರಾಗಿ",
            footerDesc: "ಸಾವಯವ ಆಹಾರ, ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಸಾಮೂಹಿಕ ಸಹಭಾಗಿತ್ವದೊಂದಿಗೆ ಆರೋಗ್ಯಕರ ಸಮಾಜದ ನಿರ್ಮಾಣ.",
            footerQuick: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
            footerCats: "ವರ್ಗಗಳು",
            footerSupport: "ಬೆಂಬಲ",
            footerHelp: "ಸಹಾಯ ಕೇಂದ್ರ",
            footerContact: "ಸಂಪರ್ಕಿಸಿ",
            footerPrivacy: "ಗೌಪ್ಯತಾ ನೀತಿ",
            footerCopy: "© 2026 ಫಾರ್ಮ್ ಟು ಫೋರ್ಕ್ ಕಲೆಕ್ಟಿವ್. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. 🌱",
            shopHeaderTitle: "ಪ್ರಮಾಣೀಕೃತ ಸಾವಯವ ಬೆಳೆಗಳು",
            shopHeaderSubtitle: "ತಮಿಳುನಾಡಿನ ಪುನರುತ್ಪಾದಕ ಜಮೀನುಗಳಿಂದ ನೇರವಾಗಿ ನಿಮ್ಮ ಅಡುಗೆಮನೆಗೆ ಬರುವ ಶುದ್ಧ ಉತ್ಪನ್ನಗಳು",
            shopFilterAll: "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು",
            shopFilterVeg: "🌾 ತರಕಾರಿಗಳು",
            shopFilterFruit: "🍎 ಹಣ್ಣುಗಳು",
            shopFilterHm: "🧺 ಕೈಯಿಂದ ತಯಾರಿಸಿದವು",
            shopFilterFrz: "❄️ ಫ್ರೋಜನ್ ಪ್ಯಾಕ್‌ಗಳು",
            shopSearchPlaceholder: "🔍 ಸಾವಯವ ಟೊಮೆಟೊ, ಜೇನುತುಪ್ಪ, ಸೇಬು ಹುಡುಕಿ...",
            shopSortDefault: "ವಿಂಗಡಣೆ: ಪೂರ್ವನಿಯೋಜಿತ",
            shopSortLow: "ಬೆಲೆ: ಕಡಿಮೆಯಿಂದ ಹೆಚ್ಚು",
            shopSortHigh: "ಬೆಲೆ: ಹೆಚ್ಚಿನಿಂದ ಕಡಿಮೆ",
            shopSortRating: "ಗರಿಷ್ಠ ರೇಟಿಂಗ್",
            shopAddToCart: "ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ",
            shopTraceBtn: "ಪ್ರಯಾಣ ನೋಡಿ",
            shopFreshBadge: "ತಾಜಾ ಕೊಯ್ಲು",
            shopZeroChem: "ರಾಸಾಯನಿಕ ಮುಕ್ತ",
            detailBreadcrumbHome: "ಮುಖಪುಟ",
            detailBreadcrumbShop: "ಉತ್ಪನ್ನಗಳು",
            detailInStock: "ಸ್ಟಾಕ್ ಲಭ್ಯವಿದೆ & ತಾಜಾ",
            detailLowStock: "ಕಡಿಮೆ ಸ್ಟಾಕ್",
            detailPurityIndex: "ಪರಿಸರ ಸಂರಕ್ಷಣೆ & ಶುದ್ಧತೆಯ ಸೂಚ್ಯಂಕ",
            detailSelectQty: "ಪ್ರಮಾಣವನ್ನು ಆರಿಸಿ:",
            detailBtnCart: "ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ",
            detailBtnBuy: "ಈಗಲೇ ಖರೀದಿಸಿ",
            detailBtnTrace: "QR ಪ್ರಯಾಣ",
            detailTabStory: "🌿 ಜಮೀನಿನ ಕಥೆ & ಮೂಲ",
            detailTabTrace: "📱 ಬೀಜದಿಂದ ತಟ್ಟೆಯವರೆಗಿನ ದಾಖಲೆಗಳು",
            detailTabNutrition: "🥗 ಪೌಷ್ಟಿಕಾಂಶ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳು",
            detailTabReviews: "💬 ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು",
            detailFarmerSpotlight: "ರೈತರ ಪರಿಚಯ",
            detailDirectFromGrower: "👨‍🌾 ನೇರವಾಗಿ ರೈತರಿಂದ",
            detailSendThanks: "ರೈತರಿಗೆ ಧನ್ಯವಾದ ತಿಳಿಸಿ",
            detailListenVoice: "ಹೊಲದಿಂದ ರೈತರ ವಾಯ್ಸ್ ನೋಟ್ ಆಲಿಸಿ",
            reviewsHeading: "ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು ಮತ್ತು ರೈತರ ಪ್ರತಿಕ್ರಿಯೆಗಳು",
            reviewsSub: "ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರ ನೈಜ ಅನುಭವಗಳು",
            writeReviewBtn: "ವಿಮರ್ಶೆ ಬರೆಯಿರಿ",
            verifiedBuyerBadge: "ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರ",
            farmerReplyBadge: "ರೈತರ ಉತ್ತರ",
            artisanReplyBadge: "ಕುಶಲಕರ್ಮಿಗಳ ಉತ್ತರ",
            replyToCustomerBtn: "ಉತ್ತರ ನೀಡಿ",
            postReplyBtn: "ಉತ್ತರ ಕಳುಹಿಸಿ",
            cancelBtn: "ರದ್ದುಮಾಡಿ",
            noReviewsMsg: "ಈ ಉತ್ಪನ್ನಕ್ಕೆ ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ!",
            reviewSuccessMsg: "ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿಮರ್ಶೆಯನ್ನು ಪ್ರಕಟಿಸಲಾಗಿದೆ ⭐",
            replySuccessMsg: "ರೈತರ ಉತ್ತರ ಯಶಸ್ವಿಯಾಗಿ ಪೋಸ್ಟ್ ಆಗಿದೆ! ✅",
            multiFarmerBadge: "ಮಲ್ಟಿ-ಫಾರ್ಮರ್ ಮಾರುಕಟ್ಟೆ",
            multiFarmerLocalSelling: "ಸ್ಥಳೀಯ ರೈತರು ಮಾರಾಟ ಮಾಡುತ್ತಿದ್ದಾರೆ",
            multiFarmerCompareTitle: "ಈ ಉತ್ಪನ್ನವನ್ನು ಮಾರಾಟ ಮಾಡುವ ರೈತರು",
            multiFarmerCompareSub: "ಬೆಲೆ, ಅಂತರ, ಸ್ಟಾಕ್ ಮತ್ತು ಸಾವಯವ ಪ್ರಮಾಣೀಕರಣವನ್ನು ಹೋಲಿಸಿ ನಿಮ್ಮ ನೆಚ್ಚಿನ ರೈತರಿಂದ ನೇರವಾಗಿ ಖರೀದಿಸಿ.",
            multiFarmerSelectBtn: "ಈ ರೈತರನ್ನು ಆಯ್ಕೆಮಾಡಿ",
            multiFarmerSelectedBadge: "ಆಯ್ಕೆಯಾದ ರೈತ",
            multiFarmerViewStore: "ರೈತರ ಅಂಗಡಿ ನೋಡಿ",
            farmerStoreHeading: "ರೈತ ಡೈರೆಕ್ಟ್ ಸ್ಟೋರ್",
            farmerStoreAboutTitle: "ಜಮೀನಿನ ಬಗ್ಗೆ",
            farmerStoreDeliveryTitle: "ಡೆಲಿವರಿ ಲಭ್ಯತೆ",
            farmerStoreHarvestTitle: "ಈ ಜಮೀನಿನ ತಾಜಾ ಕೊಯ್ಲು",
            farmerStoreFarmingType: "ಕೃಷಿ ವಿಧಾನ:",
            farmerStoreStock: "ಸ್ಟಾಕ್:",
            farmerStoreHarvested: "ಕೊಯ್ಲು:",
            farmerStoreDistance: "ನಿಮ್ಮ ವಿಳಾಸದಿಂದ ಅಂತರ",
            farmerStoreAddToCart: "ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ",
            farmerStoreBuyNow: "ಈಗಲೇ ಖರೀದಿಸಿ",
            cartTitle: "ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
            cartEmpty: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ!",
            cartEmptySub: "ತಾಜಾ ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಿ ಆರೋಗ್ಯಕರ ಜೀವನ ಪ್ರಾರಂಭಿಸಿ.",
            cartSubtotal: "ಉಪಮೊತ್ತ:",
            cartDelivery: "ಡೆಲಿವರಿ ಶುಲ್ಕ:",
            cartFreeDelivery: "ಉಚಿತ",
            cartTotal: "ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ:",
            cartCheckoutBtn: "ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ",
            cartContinueShop: "ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ",
            checkoutTitle: "ಸುರಕ್ಷಿತ ಚೆಕ್‌ಔಟ್",
            checkoutAddressHeading: "ಡೆಲಿವರಿ ವಿಳಾಸ",
            checkoutPaymentHeading: "ಪಾವತಿ ವಿಧಾನ",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "ಕ್ರೆಡಿಟ್ / ಡೆಬಿಟ್ ಕಾರ್ಡ್",
            checkoutCod: "ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ (COD)",
            checkoutPlaceOrder: "ಆರ್ಡರ್ ದೃಢೀಕರಿಸಿ",
            checkoutOrderSummary: "ಆರ್ಡರ್ ಸಾರಾಂಶ",
            loginTitle: "ಫಾರ್ಮ್ ಟು ಫೋರ್ಕ್ ಲಾಗಿನ್",
            loginSub: "ನಿಮ್ಮ ಖಾತೆಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಲಾಗಿನ್ ಆಗಿ",
            loginRoleCustomer: "ಗ್ರಾಹಕ",
            loginRoleFarmer: "ರೈತ",
            loginRoleArtisan: "ಕುಶಲಕರ್ಮಿ",
            loginRoleAdmin: "ನಿರ್ವಾಹಕ",
            loginQuickDemo: "1-ಕ್ಲಿಕ್ ಡೆಮೊ ಖಾತೆಗಳು (5 ಖಾತೆಗಳು)",
            loginEmailLabel: "ಇಮೇಲ್ ಅಥವಾ ಬಳಕೆದಾರ ಹೆಸರು",
            loginPasswordLabel: "ಪಾಸ್‌ವರ್ಡ್",
            loginRemember: "ನನ್ನನ್ನು ನೆನಪಿಡಿ",
            loginAdminPortal: "ಅಡ್ಮಿನ್ ಪೋರ್ಟಲ್",
            loginBtnSubmit: "ಲಾಗಿನ್ ಆಗಿ",
            loginOrOAuth: "Google ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
            loginGoogleBtn: "Google ನೊಂದಿಗೆ ಸೈನ್ ಇನ್",
            loginGithubBtn: "GitHub ನೊಂದಿಗೆ ಸೈನ್ ಇನ್",
            loginNoAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
            loginCreateAccount: "ಹೊಸ ಖಾತೆ ತೆರೆಯಿರಿ",
            loginBackHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
            regTitle: "ಖಾತೆ ತೆರೆಯಿರಿ",
            regSub: "ಫಾರ್ಮ್ ಟು ಫೋರ್ಕ್ ಕುಟುಂಬಕ್ಕೆ ಸೇರಿ",
            regNameLabel: "ಪೂರ್ಣ ಹೆಸರು",
            regEmailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
            regPhoneLabel: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
            regPassLabel: "ಪಾಸ್‌ವರ್ಡ್",
            regConfirmLabel: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
            regBtnSubmit: "ಖಾತೆ ರಚಿಸಿ",
            regAlreadyAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
            regSignIn: "ಲಾಗಿನ್ ಆಗಿ",
            dashWelcome: "ಸ್ವಾಗತ,",
            dashFarmerTitle: "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            dashArtisanTitle: "ಕುಶಲಕರ್ಮಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            dashCustomerTitle: "ಗ್ರಾಹಕ ಪೋರ್ಟಲ್",
            dashAdminTitle: "ಮುಖ್ಯ ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            dashStatTotalRevenue: "ಒಟ್ಟು ಆದಾಯ",
            dashStatActiveCrops: "ಸಕ್ರಿಯ ಬೆಳೆಗಳು",
            dashStatOrders: "ಆರ್ಡರ್‌ಗಳು",
            dashStatRating: "ಸರಾಸರಿ ರೇಟಿಂಗ್",
            dashManageProduce: "ಬೆಳೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
            dashAddProduce: "ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ",
            dashUploadJourney: "ಪ್ರಯಾಣ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
            dashCustomerFeedbackSection: "ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು & ಉತ್ತರಗಳು",
            dashOrdersSection: "ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು",
            themeSettingsTitle: "ಥೀಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
            langSettingsTitle: "ಭಾಷೆ ಆಯ್ಕೆ",
            settingsSavedToast: "ಆದ್ಯತೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
            btnSave: "ಉಳಿಸಿ",
            btnCancel: "ರದ್ದುಮಾಡಿ",
            btnDelete: "ಅಳಿಸಿ",
            btnEdit: "ತಿದ್ದು",
            btnSubmit: "ಸಲ್ಲಿಸು",
            btnClose: "ಮುಚ್ಚು",
            btnSearch: "ಹುಡುಕು",
            btnFilter: "ಫಿಲ್ಟರ್",
            statusDelivered: "ವಿತರಿಸಲಾಗಿದೆ",
            statusProcessing: "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ",
            statusPending: "ಬಾಕಿ ಇದೆ"
        },

        // 7. SPANISH (es)
        es: {
            brandName: "Farm to Fork",
            brandSub: "Colectivo",
            navHome: "Inicio",
            navShop: "Tienda",
            navKitchen: "Cocina Comunitaria",
            navGroup: "Compra Grupal",
            navSeed: "De la Semilla al Plato",
            navLogin: "Iniciar Sesión",
            navSignup: "Registrarse",
            navLogout: "Cerrar Sesión",
            navApiDocs: "Docs de API",
            navDashboard: "Panel",
            navWishlist: "Lista de Deseos",
            wishlistHeading: "Mi Lista de Deseos Orgánicos",
            wishlistSub: "Cultivos frescos y productos artesanales que te encantan",
            topOrganic: "Comida 100% Orgánica Certificada",
            topDelivery: "Envío Express Gratis en Pedidos Mayores a ₹500",
            topZeroWaste: "Cero Desperdicio de Alimentos y Empaque Sostenible",
            topFrozen: "Packs de Verduras Congeladas Listas para Cocinar",
            heroBadge: "Trazabilidad QR de la Semilla al Plato",
            heroTitleMain: "Conoce tu comida,",
            heroTitleSub: "De la semilla a tu mesa",
            heroDesc: "Rastrea cada producto desde la granja hasta tu mesa con código QR. 100% orgánico, 100% transparente.",
            heroStatFed: "Personas Alimentadas",
            heroStatFoodSaved: "Alimento Salvado (kg)",
            heroStatCo2: "CO₂ Reducido (kg)",
            heroStatFarmers: "Agricultores Apoyados",
            heroBtnShop: "Explorar Productos",
            heroBtnTrack: "Rastrear Alimento",
            heroFloatOrganic: "100% Orgánico",
            heroFloatFrozen: "Packs Congelados",
            frozenTag: "❄️ Nuevo Lanzamiento",
            frozenTitle: "Listas para Cocinar <span class=\"gradient-text\">Verduras Congeladas</span>",
            frozenDesc: "Verduras orgánicas precortadas y lavadas. ¡Ahorra tiempo y evita desperdicios!",
            frozenF1: "Listas en 5 minutos",
            frozenF2: "Sin Picado Previo",
            frozenF3: "100% Orgánico",
            frozenBtn: "Comprar Ahora",
            featTag: "🌟 Por Qué Elegirnos",
            featTitle: "Nuestras <span class=\"gradient-text\">Características Únicas</span>",
            feat1Title: "De la Semilla al Plato",
            feat1Desc: "Escanea códigos QR para conocer el recorrido de tu comida.",
            feat1Tag: "Característica Principal",
            feat2Title: "Puntuación de Sostenibilidad",
            feat2Desc: "Cada producto recibe una puntuación ecológica de 0 a 100.",
            feat2Tag: "Calidad Inteligente",
            feat3Title: "Cocina Comunitaria",
            feat3Desc: "Cocinen juntos, compartan comidas, cero residuos.",
            feat3Tag: "Comunidad",
            feat4Title: "Compra Grupal",
            feat4Desc: "Haz pedidos al por mayor y ahorra del 30 al 50%.",
            feat4Tag: "Grandes Ahorros",
            feat5Title: "Huella de Carbono",
            feat5Desc: "Monitorea tu impacto ambiental.",
            feat5Tag: "Ecológico",
            feat6Title: "Caja de Temporada",
            feat6Desc: "Cajas de suscripción orgánica mensual.",
            feat6Tag: "Suscripción",
            featLearnMore: "Saber Más →",
            catTag: "🛒 Comprar por Categoría",
            catTitle: "Explora Nuestra <span class=\"gradient-text\">Colección</span>",
            catVegTitle: "🌾 Verduras",
            catVegDesc: "Productos Frescos y Orgánicos",
            catFruitTitle: "🍎 Frutas",
            catFruitDesc: "Frutas Dulces de Temporada",
            catHmTitle: "🧺 Artesanal",
            catHmDesc: "Miel Cruda, Jabones y Ghee Puro",
            catFrzTitle: "❄️ Packs Congelados",
            catFrzDesc: "Mezclas de Verduras Listas para Cocinar",
            catShopNow: "Comprar →",
            prodTag: "🔥 Más Vendidos",
            prodTitle: "Productos <span class=\"gradient-text\">Destacados</span>",
            prodViewAll: "Ver Todos los Productos →",
            impactTag: "🌍 Nuestro Impacto Colectivo",
            impactTitle: "Marcando la <span class=\"gradient-text\">Diferencia</span>",
            impactFed: "Personas Alimentadas",
            impactSaved: "Alimento Salvado (kg)",
            impactCo2: "CO₂ Reducido (kg)",
            impactFarmers: "Agricultores Apoyados",
            demoTag: "📱 Pruébalo Ahora",
            demoTitle: "Escanea y Rastrea el <span class=\"gradient-text\">Viaje de tu Comida</span>",
            demoDesc: "Haz clic abajo para experimentar el rastreo QR.",
            demoBtn: "Escanear QR de Muestra",
            demoF1: "Datos de la Granja",
            demoF2: "Fecha de Cosecha",
            demoF3: "Info de Entrega",
            kitchenTag: "🍽️ Cocinemos Juntos",
            kitchenTitle: "Únete a una <span class=\"gradient-text\">Cocina Comunitaria</span>",
            kitchenDesc: "Cocina con tus vecinos, comparte comida, ahorra dinero y evita residuos.",
            kitchenB1: "Ahorra hasta un 40% en comida",
            kitchenB2: "Estilo de vida sin desperdicio",
            kitchenB3: "Lazos comunitarios más fuertes",
            kitchenBtn: "Saber Más →",
            testTag: "💬 Testimonios",
            testTitle: "Historias <span class=\"gradient-text\">Reales</span>",
            test1Role: "Cliente",
            test1Text: "\"¡Me encantan los packs congelados! ¡Ahorro muchísimo tiempo por la mañana!\"",
            test2Role: "Agricultor Orgánico",
            test2Text: "\"Conexión directa con los clientes. ¡Precios justos sin intermediarios!\"",
            test3Role: "Líder de Cocina Comunitaria",
            test3Text: "\"¡La cocina comunitaria ha eliminado el desperdicio de comida por completo!\"",
            newsTitle: "Mantente <span class=\"gradient-text\">Conectado</span>",
            newsDesc: "Suscríbete para recibir novedades sobre cosechas frescas y ofertas.",
            newsPlaceholder: "Ingresa tu correo electrónico...",
            newsBtn: "Suscribirse",
            footerDesc: "Construyendo una comunidad sostenible a través de comida orgánica, transparencia y acción colectiva.",
            footerQuick: "Enlaces Rápidos",
            footerCats: "Categorías",
            footerSupport: "Soporte",
            footerHelp: "Centro de Ayuda",
            footerContact: "Contáctanos",
            footerPrivacy: "Política de Privacidad",
            footerCopy: "© 2026 Farm to Fork Collective. Todos los derechos reservados. 🌱",
            shopHeaderTitle: "Productos Orgánicos Certificados",
            shopHeaderSubtitle: "Directo de granjas regenerativas de Tamil Nadu a tu mesa",
            shopFilterAll: "Todos los Productos",
            shopFilterVeg: "🌾 Verduras",
            shopFilterFruit: "🍎 Frutas",
            shopFilterHm: "🧺 Artesanal",
            shopFilterFrz: "❄️ Packs Congelados",
            shopSearchPlaceholder: "🔍 Buscar tomates orgánicos, miel, manzanas...",
            shopSortDefault: "Ordenar por: Predeterminado",
            shopSortLow: "Precio: Menor a Mayor",
            shopSortHigh: "Precio: Mayor a Menor",
            shopSortRating: "Mejor Calificación",
            shopAddToCart: "Añadir al Carrito",
            shopTraceBtn: "Rastrear",
            shopFreshBadge: "Fresco",
            shopZeroChem: "Sin Químicos",
            detailBreadcrumbHome: "Inicio",
            detailBreadcrumbShop: "Tienda",
            detailInStock: "En Stock y Fresco",
            detailLowStock: "Poco Stock",
            detailPurityIndex: "Índice de Sostenibilidad y Pureza",
            detailSelectQty: "Seleccionar Cantidad:",
            detailBtnCart: "Añadir al Carrito",
            detailBtnBuy: "Comprar Ahora",
            detailBtnTrace: "Rastrear QR",
            detailTabStory: "🌿 Historia y Origen",
            detailTabTrace: "📱 Registros de Trazabilidad",
            detailTabNutrition: "🥗 Nutrición y Certificados",
            detailTabReviews: "💬 Reseñas de Clientes",
            detailFarmerSpotlight: "Conoce al Agricultor",
            detailDirectFromGrower: "👨‍🌾 Directo del Productor",
            detailSendThanks: "Agradecer al Agricultor",
            detailListenVoice: "Escuchar Nota de Voz del Agricultor",
            reviewsHeading: "Reseñas de Clientes y Respuestas",
            reviewsSub: "Experiencias reales de compradores verificados",
            writeReviewBtn: "Escribir Reseña",
            verifiedBuyerBadge: "Comprador Verificado",
            farmerReplyBadge: "Respuesta del Agricultor",
            artisanReplyBadge: "Respuesta del Artesano",
            replyToCustomerBtn: "Responder al Cliente",
            postReplyBtn: "Publicar Respuesta",
            cancelBtn: "Cancelar",
            noReviewsMsg: "Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!",
            reviewSuccessMsg: "¡Gracias! Tu reseña ha sido publicada ⭐",
            replySuccessMsg: "¡Respuesta publicada con éxito! ✅",
            multiFarmerBadge: "Mercado de Múltiples Agricultores",
            multiFarmerLocalSelling: "Agricultores Locales Vendiendo",
            multiFarmerCompareTitle: "Todos los Agricultores que Venden este Producto",
            multiFarmerCompareSub: "Compara precios, distancia a tu cocina, stock y certificaciones para comprar directamente.",
            multiFarmerSelectBtn: "Elegir este Agricultor",
            multiFarmerSelectedBadge: "Agricultor Seleccionado",
            multiFarmerViewStore: "Ver Tienda del Agricultor",
            farmerStoreHeading: "Tienda Directa del Agricultor",
            farmerStoreAboutTitle: "Acerca de la Granja",
            farmerStoreDeliveryTitle: "Disponibilidad de Entrega",
            farmerStoreHarvestTitle: "Cosecha Fresca de esta Granja",
            farmerStoreFarmingType: "Tipo de Cultivo:",
            farmerStoreStock: "Stock:",
            farmerStoreHarvested: "Cosechado:",
            farmerStoreDistance: "desde tu ubicación",
            farmerStoreAddToCart: "Añadir al Carrito",
            farmerStoreBuyNow: "Comprar Ahora",
            cartTitle: "Tu Carrito de Compras",
            cartEmpty: "¡Tu carrito está vacío!",
            cartEmptySub: "Agrega productos orgánicos frescos para comenzar.",
            cartSubtotal: "Subtotal:",
            cartDelivery: "Costo de Envío:",
            cartFreeDelivery: "GRATIS",
            cartTotal: "Total a Pagar:",
            cartCheckoutBtn: "Proceder al Pago",
            cartContinueShop: "Continuar Comprando",
            checkoutTitle: "Pago Seguro",
            checkoutAddressHeading: "Dirección de Entrega",
            checkoutPaymentHeading: "Método de Pago",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "Tarjeta de Crédito / Débito",
            checkoutCod: "Pago Contra Entrega (COD)",
            checkoutPlaceOrder: "Confirmar Pedido",
            checkoutOrderSummary: "Resumen del Pedido",
            loginTitle: "Iniciar Sesión en Farm to Fork",
            loginSub: "Accede a tu cuenta de forma segura",
            loginRoleCustomer: "Cliente",
            loginRoleFarmer: "Agricultor",
            loginRoleArtisan: "Artesano",
            loginRoleAdmin: "Administrador",
            loginQuickDemo: "Acceso Demo en 1 Clic (5 Cuentas)",
            loginEmailLabel: "Correo o Usuario",
            loginPasswordLabel: "Contraseña",
            loginRemember: "Recordarme",
            loginAdminPortal: "Portal de Admin",
            loginBtnSubmit: "Iniciar Sesión",
            loginOrOAuth: "O continúa con Google",
            loginGoogleBtn: "Iniciar sesión con Google",
            loginGithubBtn: "Continuar con GitHub",
            loginNoAccount: "¿No tienes una cuenta?",
            loginCreateAccount: "Crear Cuenta",
            loginBackHome: "Volver al Inicio",
            regTitle: "Crear Cuenta",
            regSub: "Únete a la comunidad Farm to Fork",
            regNameLabel: "Nombre Completo",
            regEmailLabel: "Correo Electrónico",
            regPhoneLabel: "Número de Teléfono",
            regPassLabel: "Contraseña",
            regConfirmLabel: "Confirmar Contraseña",
            regBtnSubmit: "Crear Cuenta",
            regAlreadyAccount: "¿Ya tienes cuenta?",
            regSignIn: "Inicia Sesión",
            dashWelcome: "Bienvenido,",
            dashFarmerTitle: "Panel del Agricultor",
            dashArtisanTitle: "Panel del Artesano",
            dashCustomerTitle: "Portal del Cliente",
            dashAdminTitle: "Panel de Administración",
            dashStatTotalRevenue: "Ingresos Totales",
            dashStatActiveCrops: "Cultivos Activos",
            dashStatOrders: "Pedidos Realizados",
            dashStatRating: "Calificación Promedio",
            dashManageProduce: "Gestionar Cultivos",
            dashAddProduce: "Añadir Nuevo Cultivo",
            dashUploadJourney: "Subir Trazabilidad",
            dashCustomerFeedbackSection: "Reseñas y Respuestas",
            dashOrdersSection: "Pedidos Recientes",
            themeSettingsTitle: "Ajustes de Tema",
            langSettingsTitle: "Selección de Idioma",
            settingsSavedToast: "¡Preferencias guardadas con éxito!",
            btnSave: "Guardar",
            btnCancel: "Cancelar",
            btnDelete: "Eliminar",
            btnEdit: "Editar",
            btnSubmit: "Enviar",
            btnClose: "Cerrar",
            btnSearch: "Buscar",
            btnFilter: "Filtrar",
            statusDelivered: "Entregado",
            statusProcessing: "En Proceso",
            statusPending: "Pendiente"
        },

        // 8. FRENCH (fr)
        fr: {
            brandName: "Farm to Fork",
            brandSub: "Collectif",
            navHome: "Accueil",
            navShop: "Boutique",
            navKitchen: "Cuisine Communautaire",
            navGroup: "Achat Groupé",
            navSeed: "De la Graine à l'Assiette",
            navLogin: "Connexion",
            navSignup: "S'inscrire",
            navLogout: "Déconnexion",
            navApiDocs: "Docs API",
            navDashboard: "Tableau de Bord",
            navWishlist: "Favoris",
            wishlistHeading: "Mes Favoris Biologiques",
            wishlistSub: "Produits frais et artisanaux enregistrés que vous aimez",
            topOrganic: "100% Alimentation Biologique Certifiée",
            topDelivery: "Livraison Express Gratuite dès ₹500",
            topZeroWaste: "Zéro Gaspillage Alimentaire & Emballage Durable",
            topFrozen: "Légumes Surgelés Prêts à Cuisiner",
            heroBadge: "Traçabilité QR de la Graine à l'Assiette",
            heroTitleMain: "Connaissez votre nourriture,",
            heroTitleSub: "De la graine à votre assiette",
            heroDesc: "Tracez chaque produit de la ferme à votre table grâce au QR code. 100% biologique, 100% transparent.",
            heroStatFed: "Personnes Nourries",
            heroStatFoodSaved: "Nourriture Sauvée (kg)",
            heroStatCo2: "CO₂ Économisé (kg)",
            heroStatFarmers: "Agriculteurs Soutenus",
            heroBtnShop: "Explorer les Produits",
            heroBtnTrack: "Tracer Votre Nourriture",
            heroFloatOrganic: "100% Bio",
            heroFloatFrozen: "Packs Surgelés",
            frozenTag: "❄️ Nouveauté",
            frozenTitle: "Prêts à Cuisiner <span class=\"gradient-text\">Légumes Surgelés</span>",
            frozenDesc: "Légumes biologiques prédécoupés et lavés. Gagnez du temps, évitez le gaspillage !",
            frozenF1: "Prêt en 5 minutes",
            frozenF2: "Sans découpe",
            frozenF3: "100% Biologique",
            frozenBtn: "Acheter Maintenant",
            featTag: "🌟 Pourquoi Nous Choisir",
            featTitle: "Nos <span class=\"gradient-text\">Points Forts</span>",
            feat1Title: "De la Graine à l'Assiette",
            feat1Desc: "Scannez les QR codes pour retracer le parcours de vos aliments.",
            feat1Tag: "Fonction Principale",
            feat2Title: "Score Écologique",
            feat2Desc: "Chaque produit reçoit un éco-score de 0 à 100.",
            feat2Tag: "Qualité Intelligente",
            feat3Title: "Cuisine Communautaire",
            feat3Desc: "Cuisinez ensemble, partagez les repas, zéro déchet.",
            feat3Tag: "Communauté",
            feat4Title: "Achat Groupé",
            feat4Desc: "Commandez en gros et économisez 30 à 50%.",
            feat4Tag: "Grandes Économies",
            feat5Title: "Empreinte Carbone",
            feat5Desc: "Suivez votre impact environnemental.",
            feat5Tag: "Écologique",
            feat6Title: "Panier de Saison",
            feat6Desc: "Paniers d'abonnement bio mensuels.",
            feat6Tag: "Abonnement",
            featLearnMore: "En Savoir Plus →",
            catTag: "🛒 Parcourir par Catégorie",
            catTitle: "Explorez Notre <span class=\"gradient-text\">Collection</span>",
            catVegTitle: "🌾 Légumes",
            catVegDesc: "Produits Frais et Biologiques",
            catFruitTitle: "🍎 Fruits",
            catFruitDesc: "Fruits Sucrés et de Saison",
            catHmTitle: "🧺 Fait Main",
            catHmDesc: "Miel Brut, Savons Végétaux & Ghee Pur",
            catFrzTitle: "❄️ Packs Surgelés",
            catFrzDesc: "Mélanges de Légumes Prêts à Cuisiner",
            catShopNow: "Découvrir →",
            prodTag: "🔥 Meilleures Ventes",
            prodTitle: "Produits <span class=\"gradient-text\">Vedettes</span>",
            prodViewAll: "Voir Tous les Produits →",
            impactTag: "🌍 Notre Impact Collectif",
            impactTitle: "Faire la <span class=\"gradient-text\">Différence</span>",
            impactFed: "Personnes Nourries",
            impactSaved: "Nourriture Sauvée (kg)",
            impactCo2: "CO₂ Économisé (kg)",
            impactFarmers: "Agriculteurs Soutenus",
            demoTag: "📱 Essayez Maintenant",
            demoTitle: "Scannez & Retracez Votre <span class=\"gradient-text\">Parcours Alimentaire</span>",
            demoDesc: "Cliquez ci-dessous pour tester la traçabilité par QR code.",
            demoBtn: "Scanner un QR Exemple",
            demoF1: "Détails de la Ferme",
            demoF2: "Date de Récolte",
            demoF3: "Infos de Livraison",
            kitchenTag: "🍽️ Cuisinons Ensemble",
            kitchenTitle: "Rejoignez une <span class=\"gradient-text\">Cuisine Communautaire</span>",
            kitchenDesc: "Cuisinez avec vos voisins, partagez des repas, économisez, zéro déchet.",
            kitchenB1: "Jusqu'à 40% d'économie sur vos repas",
            kitchenB2: "Mode de vie zéro déchet",
            kitchenB3: "Liens communautaires renforcés",
            kitchenBtn: "En Savoir Plus →",
            testTag: "💬 Témoignages",
            testTitle: "Histoires <span class=\"gradient-text\">Vraies</span>",
            test1Role: "Client",
            test1Text: "\"J'adore les légumes surgelés ! Je gagne tellement de temps chaque matin !\"",
            test2Role: "Agriculteur Bio",
            test2Text: "\"Contact direct avec les clients. Des prix équitables sans intermédiaires !\"",
            test3Role: "Responsable Cuisine Communautaire",
            test3Text: "\"La cuisine communautaire a permis de supprimer totalement le gaspillage !\"",
            newsTitle: "Restez <span class=\"gradient-text\">Connecté</span>",
            newsDesc: "Abonnez-vous pour suivre les récoltes fraîches et les offres.",
            newsPlaceholder: "Votre adresse e-mail...",
            newsBtn: "S'inscrire",
            footerDesc: "Bâtir une communauté durable grâce au bio, à la transparence et à l'action collective.",
            footerQuick: "Liens Rapides",
            footerCats: "Catégories",
            footerSupport: "Assistance",
            footerHelp: "Centre d'Aide",
            footerContact: "Contactez-nous",
            footerPrivacy: "Politique de Confidentialité",
            footerCopy: "© 2026 Farm to Fork Collective. Tous droits réservés. 🌱",
            shopHeaderTitle: "Produits Biologiques Certifiés",
            shopHeaderSubtitle: "Directement des fermes régénératrices du Tamil Nadu à votre table",
            shopFilterAll: "Tous les Produits",
            shopFilterVeg: "🌾 Légumes",
            shopFilterFruit: "🍎 Fruits",
            shopFilterHm: "🧺 Fait Main",
            shopFilterFrz: "❄️ Packs Surgelés",
            shopSearchPlaceholder: "🔍 Rechercher tomates bio, miel, pommes...",
            shopSortDefault: "Trier par : Défaut",
            shopSortLow: "Prix : Croissant",
            shopSortHigh: "Prix : Décroissant",
            shopSortRating: "Meilleure Note",
            shopAddToCart: "Ajouter au Panier",
            shopTraceBtn: "Tracer",
            shopFreshBadge: "Frais",
            shopZeroChem: "Sans Produits Chimiques",
            detailBreadcrumbHome: "Accueil",
            detailBreadcrumbShop: "Boutique",
            detailInStock: "En Stock & Frais",
            detailLowStock: "Stock Faible",
            detailPurityIndex: "Indice de Pureté et Durabilité",
            detailSelectQty: "Choisir la Quantité :",
            detailBtnCart: "Ajouter au Panier",
            detailBtnBuy: "Acheter Maintenant",
            detailBtnTrace: "Tracer par QR",
            detailTabStory: "🌿 Origine & Histoire de la Ferme",
            detailTabTrace: "📱 Registre de la Graine à l'Assiette",
            detailTabNutrition: "🥗 Nutrition & Certifications",
            detailTabReviews: "💬 Avis Clients",
            detailFarmerSpotlight: "Rencontrez l'Agriculteur",
            detailDirectFromGrower: "👨‍🌾 Direct du Producteur",
            detailSendThanks: "Remercier l'Agriculteur",
            detailListenVoice: "Écouter la Note Vocale du Producteur",
            reviewsHeading: "Avis Clients et Réponses du Producteur",
            reviewsSub: "Retours réels d'acheteurs vérifiés",
            writeReviewBtn: "Donner un Avis",
            verifiedBuyerBadge: "Acheteur Vérifié",
            farmerReplyBadge: "Réponse du Producteur",
            artisanReplyBadge: "Réponse de l'Artisan",
            replyToCustomerBtn: "Répondre au Client",
            postReplyBtn: "Publier la Réponse",
            cancelBtn: "Annuler",
            noReviewsMsg: "Aucun avis pour l'instant. Soyez le premier à partager votre expérience !",
            reviewSuccessMsg: "Merci ! Votre avis vérifié a été publié ⭐",
            replySuccessMsg: "Réponse du producteur publiée ! ✅",
            multiFarmerBadge: "Place de Marché Multi-Producteurs",
            multiFarmerLocalSelling: "Producteurs Locaux en Vente",
            multiFarmerCompareTitle: "Tous les Producteurs Vendant ce Produit",
            multiFarmerCompareSub: "Comparez les prix, la distance, le stock et les labels bio pour choisir votre producteur direct.",
            multiFarmerSelectBtn: "Choisir ce Producteur",
            multiFarmerSelectedBadge: "Producteur Sélectionné",
            multiFarmerViewStore: "Voir la Ferme",
            farmerStoreHeading: "Boutique Directe du Producteur",
            farmerStoreAboutTitle: "À Propos de la Ferme",
            farmerStoreDeliveryTitle: "Disponibilité de Livraison",
            farmerStoreHarvestTitle: "Récolte Fraîche de cette Ferme",
            farmerStoreFarmingType: "Type de Culture :",
            farmerStoreStock: "Stock :",
            farmerStoreHarvested: "Récolté :",
            farmerStoreDistance: "depuis votre adresse",
            farmerStoreAddToCart: "Ajouter au Panier",
            farmerStoreBuyNow: "Acheter Maintenant",
            cartTitle: "Votre Panier",
            cartEmpty: "Votre panier est vide !",
            cartEmptySub: "Ajoutez des produits bio frais pour commencer.",
            cartSubtotal: "Sous-total :",
            cartDelivery: "Frais de Livraison :",
            cartFreeDelivery: "GRATUIT",
            cartTotal: "Montant Total :",
            cartCheckoutBtn: "Passer à la Caisse",
            cartContinueShop: "Continuer les Achats",
            checkoutTitle: "Paiement Sécurisé",
            checkoutAddressHeading: "Adresse de Livraison",
            checkoutPaymentHeading: "Mode de Paiement",
            checkoutUpi: "UPI (Google Pay, PhonePe, Paytm)",
            checkoutCard: "Carte Bancaire",
            checkoutCod: "Paiement à la Livraison (COD)",
            checkoutPlaceOrder: "Confirmer la Commande",
            checkoutOrderSummary: "Résumé de la Commande",
            loginTitle: "Connexion Farm to Fork",
            loginSub: "Connectez-vous en toute sécurité",
            loginRoleCustomer: "Client",
            loginRoleFarmer: "Agriculteur",
            loginRoleArtisan: "Artisan",
            loginRoleAdmin: "Administrateur",
            loginQuickDemo: "Comptes Démo en 1 Clic (5 Comptes)",
            loginEmailLabel: "E-mail ou Nom d'utilisateur",
            loginPasswordLabel: "Mot de passe",
            loginRemember: "Se souvenir de moi",
            loginAdminPortal: "Portail Admin",
            loginBtnSubmit: "Se Connecter",
            loginOrOAuth: "Ou continuer avec Google",
            loginGoogleBtn: "Connexion Google",
            loginGithubBtn: "Connexion GitHub",
            loginNoAccount: "Pas encore de compte ?",
            loginCreateAccount: "Créer un Compte",
            loginBackHome: "Retour à l'Accueil",
            regTitle: "Créer un Compte",
            regSub: "Rejoignez le Collectif Farm to Fork",
            regNameLabel: "Nom Complet",
            regEmailLabel: "Adresse E-mail",
            regPhoneLabel: "Numéro de Téléphone",
            regPassLabel: "Mot de passe",
            regConfirmLabel: "Confirmer le Mot de passe",
            regBtnSubmit: "Créer mon Compte",
            regAlreadyAccount: "Déjà un compte ?",
            regSignIn: "Se Connecter",
            dashWelcome: "Bienvenue,",
            dashFarmerTitle: "Tableau de Bord Agriculteur",
            dashArtisanTitle: "Tableau de Bord Artisan",
            dashCustomerTitle: "Portail Client",
            dashAdminTitle: "Administration de la Plateforme",
            dashStatTotalRevenue: "Revenu Total",
            dashStatActiveCrops: "Cultures Actives",
            dashStatOrders: "Commandes Passées",
            dashStatRating: "Note Moyenne",
            dashManageProduce: "Gérer la Production",
            dashAddProduce: "Ajouter une Culture",
            dashUploadJourney: "Téléverser la Traçabilité",
            dashCustomerFeedbackSection: "Avis Clients & Réponses",
            dashOrdersSection: "Commandes Récentes",
            themeSettingsTitle: "Paramètres de Thème",
            langSettingsTitle: "Sélection de la Langue",
            settingsSavedToast: "Préférences enregistrées avec succès !",
            btnSave: "Enregistrer",
            btnCancel: "Annuler",
            btnDelete: "Supprimer",
            btnEdit: "Modifier",
            btnSubmit: "Envoyer",
            btnClose: "Fermer",
            btnSearch: "Rechercher",
            btnFilter: "Filtrer",
            statusDelivered: "Livré",
            statusProcessing: "En Traitement",
            statusPending: "En Attente"
        }
    };

    // ----------------------------------------------------
    // 34 AUTHENTIC PRODUCT NAMES ACROSS ALL LANGUAGES
    // ----------------------------------------------------
    const PRODUCT_NAMES = {
        en: {
            1: "Organic Tomatoes", 2: "Organic Spinach", 3: "Organic Mountain Carrots (Ooty)", 4: "Organic Broccoli",
            5: "Organic Cauliflower", 6: "Organic Bell Peppers", 7: "Organic Shallots (Small Onions)", 8: "Organic Mountain Potatoes",
            9: "Organic Beetroot", 10: "Organic Pumpkin", 11: "Organic Shimla Apples", 12: "Organic Poovan Bananas",
            13: "Organic Mosambi (Sweet Lime)", 14: "Organic Paneer Grapes", 15: "Organic Alphonso Mangoes", 16: "Organic Strawberries",
            17: "Organic Watermelon", 18: "Organic Pomegranates", 19: "Wild Forest Honey (Javadi Hills)", 20: "Artisanal Whole Wheat Sourdough Bread",
            21: "Herbal Handcrafted Bath Soap", 22: "Traditional Chettinad Raw Mango Pickle", 23: "Organic Stone-Ground Peanut Butter",
            24: "Traditional A2 Gir Cow Desi Ghee", 25: "Organic Aromatic Spice Blend (Masala)", 26: "Traditional Organic Palm Jaggery",
            27: "Wood-Pressed Pure Coconut Oil", 28: "Organic Herbal Wellness Tea", 29: "Ready-to-Cook Mixed Veg Pack",
            30: "Chinese Stir-Fry Vegetable Mix", 31: "Wellness Soup Veg Mix", 32: "Sambar & Curry Veg Pack",
            33: "Premium Vegetable Medley", 34: "Fresh Green Peas Pack"
        },
        ta: {
            1: "இயற்கை நாட்டு தக்காளி", 2: "இயற்கை பசலைக்கீரை", 3: "இயற்கை மலை கேரட் (ஊட்டி)", 4: "இயற்கை ப்ரோக்கோலி",
            5: "இயற்கை காலிஃபிளவர்", 6: "இயற்கை குடைமிளகாய்", 7: "இயற்கை சின்ன வெங்காயம்", 8: "இயற்கை மலை உருளைக்கிழங்கு",
            9: "இயற்கை சத்து பீட்ரூட்", 10: "இயற்கை பரங்கிக்காய்", 11: "இயற்கை சிம்லா ஆப்பிள்", 12: "இயற்கை பூவன் வாழைப்பழம்",
            13: "இயற்கை சாத்துக்குடி ஆரஞ்சு", 14: "இயற்கை பன்னீர் திராட்சை", 15: "இயற்கை அல்போன்சா மாம்பழம்", 16: "இயற்கை ஸ்ட்ராபெர்ரி",
            17: "இயற்கை தர்பூசணி", 18: "இயற்கை மாதுளம் பழம்", 19: "இயற்கை காட்டுத் தேன் (ஜவ்வாது மலை)", 20: "இயற்கை கைவினை முழு கோதுமை ரொட்டி",
            21: "இயற்கை மூலிகை குளியல் சோப்", 22: "பாரம்பரிய செட்டிநாடு மாங்காய் ஊறுகாய்", 23: "இயற்கை வேர்க்கடலை வெண்ணெய்",
            24: "பாரம்பரிய A2 நாட்டுப் பசு நெய்", 25: "இயற்கை வாசனை மசாலா தொகுப்பு", 26: "பாரம்பரிய இயற்கை நாட்டு வெல்லம்",
            27: "மரச்செக்கு சுத்தமான தேங்காய் எண்ணெய்", 28: "இயற்கை மூலிகை ஆரோக்கிய தேநீர்", 29: "கலவை காய்கறி பேக் (Ready-to-Cook)",
            30: "சீன வதக்கல் காய்கறி கலவை", 31: "ஆரோக்கிய சூப் காய்கறி கலவை", 32: "சாம்பார் & கறி காய்கறி பேக்",
            33: "பிரீமியம் காய்கறி மெட்லி", 34: "புதிய பச்சை பட்டாணி பேக்"
        },
        hi: {
            1: "जैविक देसी टमाटर", 2: "जैविक पालक", 3: "जैविक ऊटी गाजर", 4: "जैविक ब्रोकली",
            5: "जैविक फूलगोभी", 6: "जैविक शिमला मिर्च", 7: "जैविक छोटे प्याज (शैलट्स)", 8: "जैविक पहाड़ी आलू",
            9: "जैविक चुकंदर", 10: "जैविक कद्दू", 11: "जैविक शिमला सेब", 12: "जैविक केले",
            13: "जैविक मौसमी", 14: "जैविक पनीर अंगूर", 15: "जैविक अल्फोंसो आम", 16: "जैविक स्ट्रॉबेरी",
            17: "जैविक तरबूज", 18: "जैविक अनार", 19: "जंगली शहद (जावादी हिल्स)", 20: "हस्तनिर्मित गेहूं की ब्रेड",
            21: "हर्बल स्नान साबुन", 22: "पारंपरिक चेट्टीनाड आम का अचार", 23: "जैविक पीनट बटर",
            24: "पारंपरिक A2 गिर गाय का देसी घी", 25: "जैविक सुगंधित मसाला", 26: "पारंपरिक जैविक गुड़",
            27: "कोल्ड-प्रेस्ड नारियल तेल", 28: "हर्बल स्वास्थ्यवर्धक चाय", 29: "मिश्रित सब्जी पैक (पकाने के लिए तैयार)",
            30: "चाइनीज स्टिर-फ्राई सब्जी मिक्स", 31: "सूप सब्जी मिक्स", 32: "सांभर और करी सब्जी पैक",
            33: "प्रीमियम सब्जी मेडली", 34: "ताज़ी हरी मटर पैक"
        },
        te: {
            1: "సేంద్రీయ నాటు టమోటాలు", 2: "సేంద్రీయ పాలకూర", 3: "సేంద్రీయ ఊటీ క్యారెట్లు", 4: "సేంద్రీయ బ్రోకలీ",
            5: "సేంద్రీయ క్యాలీఫ్లవర్", 6: "సేంద్రీయ బెల్ పెప్పర్స్", 7: "సేంద్రీయ సాంబార్ ఉల్లిపాయలు", 8: "సేంద్రీయ కొండ బంగాళాదుంపలు",
            9: "సేంద్రీయ బీట్‌రూట్", 10: "సేంద్రీయ గుమ్మడికాయ", 11: "సేంద్రీయ సిమ్లా ఆపిల్స్", 12: "సేంద్రీయ అరటిపండ్లు",
            13: "సేంద్రీయ బత్తాయి", 14: "సేంద్రీయ పన్నీర్ ద్రాక్ష", 15: "సేంద్రీయ అల్ఫోన్సో మామిడి", 16: "సేంద్రీయ స్ట్రాబెర్రీలు",
            17: "సేంద్రీయ పుచ్చకాయ", 18: "సేంద్రీయ దానిమ్మ", 19: "అటవీ తేనె (జావాది హిల్స్)", 20: "చేతితో చేసిన గోధుమ బ్రెడ్",
            21: "హెర్బల్ బాత్ సబ్బు", 22: "చెట్టినాడ్ మామిడికాయ ఊరగాయ", 23: "సేంద్రీయ పీనట్ బటర్",
            24: "సాంప్రదాయ A2 ఆవు నెయ్యి", 25: "సుగంధ మసాలా మిశ్రమం", 26: "సేంద్రీయ తాటి బెల్లం",
            27: "గానుగ స్వచ్ఛమైన కొబ్బరి నూనె", 28: "హెర్బల్ ఆరోగ్య టీ", 29: "మిశ్రమ కూరగాయల ప్యాక్ (రెడీ-టు-కుక్)",
            30: "చైనీస్ స్టిర్-ఫ్రై వెజ్ మిక్స్", 31: "సూప్ కూరగాయల మిక్స్", 32: "సాంబార్ & కూర వెజ్ ప్యాక్",
            33: "ప్రీమియం వెజిటబుల్ మెడ్లే", 34: "తాజా పచ్చి బఠానీలు"
        },
        ml: {
            1: "ജൈവ നാടൻ തക്കാളി", 2: "ജൈവ ചീര", 3: "ഊട്ടി ക്യാരറ്റ്", 4: "ജൈവ ബ്രൊക്കോളി",
            5: "ജൈവ കോളിഫ്ലവർ", 6: "ജൈവ കാപ്സിക്കം", 7: "ജൈവ ചെറിയ ഉള്ളി", 8: "ജൈവ ഉരുളക്കിഴങ്ങ്",
            9: "ജൈവ ബീറ്റ്‌റൂട്ട്", 10: "ജൈവ മത്തങ്ങ", 11: "ജൈവ ഷിംല ആപ്പിൾ", 12: "ജൈവ പൂവൻ പഴം",
            13: "ജൈവ മുസംബി", 14: "ജൈവ പന്നീർ മുന്തിരി", 15: "ജൈവ അൽഫോൻസോ മാമ്പഴം", 16: "ജൈവ സ്ട്രോബെറി",
            17: "ജൈവ തണ്ണിമത്തൻ", 18: "ജൈവ മാതളനാരങ്ങ", 19: "കാട്ടുതേൻ (ജവാദി ഹിൽസ്)", 20: "കൈത്തറി ഗോതമ്പ് ബ്രെഡ്",
            21: "ഹെർബൽ സോപ്പ്", 22: "ചെട്ടിനാട് മാങ്ങാ അച്ചാർ", 23: "ജൈവ പീനട്ട് ബട്ടർ",
            24: "തനതു A2 പശുവിൻ നെയ്യ്", 25: "ജൈവ മസാലക്കൂട്ട്", 26: "തനതു കരിപ്പട്ടി ശർക്കര",
            27: "ചക്കിലാട്ടിയ വെളിച്ചെണ്ണ", 28: "ഹെർബൽ ആരോഗ്യ ചായ", 29: "മിക്സഡ് വെജിറ്റബിൾ പായ്ക്ക്",
            30: "സ്റ്റിർ-ഫ്രൈ വെജ് മിക്സ്", 31: "സൂപ്പ് വെജ് മിക്സ്", 32: "സാമ്പാർ വെജ് പായ്ക്ക്",
            33: "പ്രീമിയം പച്ചക്കറി മെഡ്‌ലി", 34: "പച്ചപ്പട്ടാണി പായ്ക്ക്"
        },
        kn: {
            1: "ಸಾವಯವ ನಾಟಿ ಟೊಮೆಟೊ", 2: "ಸಾವಯವ ಪಾಲಕ್", 3: "ಸಾವಯವ ಊಟಿ ಕ್ಯಾರೆಟ್", 4: "ಸಾವಯವ ಬ್ರೊಕೋಲಿ",
            5: "ಸಾವಯವ ಹೂಕೋಸು", 6: "ಸಾವಯವ ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ", 7: "ಸಾವಯವ ಸಾಂಬಾರ್ ಈರುಳ್ಳಿ", 8: "ಸಾವಯವ ಆಲೂಗಡ್ಡೆ",
            9: "ಸಾವಯವ ಬೀಟ್‌ರೂಟ್", 10: "ಸಾವಯವ ಕುಂಬಳಕಾಯಿ", 11: "ಸಾವಯವ ಶಿಮ್ಲಾ ಸೇಬು", 12: "ಸಾವಯವ ಬಾಳೆಹಣ್ಣು",
            13: "ಸಾವಯವ ಮೊಸಂಬಿ", 14: "ಸಾವಯವ ಪನ್ನೀರ್ ದ್ರಾಕ್ಷಿ", 15: "ಸಾವಯವ ಆಲ್ಫೋನ್ಸೋ ಮಾವು", 16: "ಸಾವಯವ ಸ್ಟ್ರಾಬೆರಿ",
            17: "ಸಾವಯವ ಕಲ್ಲಂಗಡಿ", 18: "ಸಾವಯವ ದಾಳಿಂಬೆ", 19: "ಕಾಡು ಜೇನುತುಪ್ಪ", 20: "ಕೈಯಿಂದ ಮಾಡಿದ ಗೋಧಿ ಬ್ರೆಡ್",
            21: "ಗಿಡಮೂಲಿಕೆ ಸಾಬೂನು", 22: "ಚೆಟ್ಟಿನಾಡ್ ಮಾವಿನಕಾಯಿ ಉಪ್ಪಿನಕಾಯಿ", 23: "ಸಾವಯವ ಕಡಲೆಕಾಯಿ ಬೆಣ್ಣೆ",
            24: "ಸಾಂಪ್ರದಾಯಿಕ A2 ಹಸುವಿನ ತುಪ್ಪ", 25: "ಸಾವಯವ ಮಸಾಲೆ ಮಿಶ್ರಣ", 26: "ಸಾವಯವ ತಾಳೆ ಬೆಲ್ಲ",
            27: "ಗಾಣದ ಶುದ್ಧ ಕೊಬ್ಬರಿ ಎಣ್ಣೆ", 28: "ಗಿಡಮೂಲಿಕೆ ಚಹಾ", 29: "ಮಿಶ್ರ ತರಕಾರಿ ಪ್ಯಾಕ್ (ರೆಡಿ-ಟು-ಕುಕ್)",
            30: "ಚೈನೀಸ್ ಸ್ಟಿರ್-ಫ್ರೈ ವೆಜ್ ಮಿಕ್ಸ್", 31: "ಸೂಪ್ ತರಕಾರಿ ಮಿಕ್ಸ್", 32: "ಸಾಂಬಾರ್ ವೆಜ್ ಪ್ಯಾಕ್",
            33: "ಪ್ರೀಮಿಯಂ ತರಕಾರಿ ಮೆಡ್ಲೆ", 34: "ತಾಜಾ ಹಸಿರು ಬಟಾಣಿ"
        },
        es: {
            1: "Tomates Orgánicos", 2: "Espinacas Orgánicas", 3: "Zanahorias de Montaña de Ooty", 4: "Brócoli Orgánico",
            5: "Coliflor Orgánica", 6: "Pimientos Orgánicos", 7: "Chalotas Orgánicas", 8: "Patatas de Montaña",
            9: "Remolacha Orgánica", 10: "Calabaza Orgánica", 11: "Manzanas de Shimla", 12: "Plátanos Poovan Orgánicos",
            13: "Lima Dulce Mosambi", 14: "Uvas Paneer Orgánicas", 15: "Mangos Alphonso Orgánicos", 16: "Fresas Orgánicas",
            17: "Sandía Orgánica", 18: "Granadas Orgánicas", 19: "Miel Silvestre de Javadi Hills", 20: "Pan de Masa Madre Integral",
            21: "Jabón Artesanal de Hierbas", 22: "Encurtido Tradicional de Mango Chettinad", 23: "Mantequilla de Cacahuete Orgánica",
            24: "Ghee Tradicional de Vaca Gir A2", 25: "Mezcla de Especias Aromáticas", 26: "Panela Orgánica Tradicional",
            27: "Aceite de Coco Puro Prensado en Frío", 28: "Té de Hierbas para el Bienestar", 29: "Pack de Verduras Listas para Cocinar",
            30: "Mezcla de Verduras para Saltear", 31: "Mezcla de Verduras para Sopa", 32: "Pack de Verduras para Sambar y Curry",
            33: "Popurrí de Verduras Premium", 34: "Guisantes Frescos"
        },
        fr: {
            1: "Tomates Biologiques", 2: "Épinards Biologiques", 3: "Carottes de Montagne d'Ooty", 4: "Brocoli Biologique",
            5: "Chou-fleur Biologique", 6: "Poivrons Biologiques", 7: "Échalotes Biologiques", 8: "Pommes de Terre de Montagne",
            9: "Betteraves Biologiques", 10: "Citrouille Biologique", 11: "Pommes de Shimla", 12: "Bananes Poovan Biologiques",
            13: "Lime Douce Mosambi", 14: "Raisins Paneer Biologiques", 15: "Mangues Alphonso Biologiques", 16: "Fraises Biologiques",
            17: "Pastèque Biologique", 18: "Grenades Biologiques", 19: "Miel Sauvage de Javadi Hills", 20: "Pain au Levain Complet Artisanal",
            21: "Savon Artisanal aux Herbes", 22: "Pickles Traditionnels de Mangue Chettinad", 23: "Beurre de Cacahuète Moulu sur Pierre",
            24: "Ghee Traditionnel de Vache Gir A2", 25: "Mélange d'Épices Aromatiques", 26: "Sucre de Palme Traditionnel Bio",
            27: "Huile de Coco Pure Pressée à Froid", 28: "Thé Bien-être aux Herbes Bio", 29: "Pack de Légumes Prêts à Cuisiner",
            30: "Mélange de Légumes pour Wok", 31: "Mélange de Légumes pour Soupe", 32: "Pack de Légumes pour Sambar & Curry",
            33: "Méli-mélo de Légumes Premium", 34: "Petits Pois Frais"
        }
    };

    // ----------------------------------------------------
    // COMPREHENSIVE DIRECT STRING MAPS (UI SCANNER)
    // ----------------------------------------------------
    const STRING_MAPS = {
        ta: {
            "Home": "முகப்பு", "Shop": "விளைபொருட்கள்", "Community Kitchen": "சமுதாய சமையலறை",
            "Group Buying": "குழு கொள்முதல்", "Seed to Plate": "விதையிலிருந்து தட்டு வரை",
            "Login": "உள்நுழைக", "Sign In": "உள்நுழைக", "Sign Up": "பதிவு செய்க", "Logout": "வெளியேறு",
            "My Account": "என் கணக்கு", "Cart": "கூடை", "Checkout": "செலுத்துதல்", "Search": "தேடு",
            "View All": "அனைத்தும் காண்க", "Add to Cart": "கூடையில் சேர்", "Add": "+ சேர்",
            "Trace": "பயணம் காண்க", "Trace QR": "QR பயணம்", "Buy Now": "இப்போதே வாங்கு",
            "Price": "விலை", "Category": "வகை", "Quantity": "அளவு", "Subtotal": "கூடை மொத்தம்",
            "Total": "மொத்தம்", "Delivery Fee": "டெலிவரி கட்டணம்", "Customer": "வாடிக்கையாளர்",
            "Farmer": "விவசாயி", "Artisan": "கைவினைஞர்", "Admin": "நிர்வாகி", "Administrator": "முதன்மை நிர்வாகி",
            "In Stock": "கையிருப்பில் உள்ளது", "Low Stock": "குறைந்த கையிருப்பு", "Fresh": "புதியது",
            "Good": "நன்று", "Rating": "மதிப்பீடு", "Reviews": "மதிப்புரைகள்", "Farm Details": "பண்ணை விவரங்கள்",
            "Harvest Date": "அறுவடை தேதி", "Shelf Life": "ஆயுட்காலம்", "Certifications": "சான்றிதழ்கள்",
            "Nutrition": "ஊட்டச்சத்து", "Description": "விளக்கம்", "Quick Actions": "விரைவு செயல்கள்",
            "Orders": "ஆர்டர்கள்", "Donate": "தானம் செய்", "Upload Journey": "பயணத்தை பதிவேற்று",
            "Add Product": "பொருள் சேர்க்க", "Manage Products": "பொருட்களை நிர்வகி",
            "Customer Reviews": "வாடிக்கையாளர் மதிப்புரைகள்", "Write a Review": "மதிப்புரை எழுதுக",
            "Submit Review": "மதிப்புரையை அனுப்பு", "Verified Buyer": "சரிபார்க்கப்பட்ட வாங்குபவர்",
            "Farmer Reply": "விவசாயி பதில்", "Artisan Reply": "கைவினைஞர் பதில்",
            "Reply to Customer": "வாடிக்கையாளருக்கு பதில் அளிக்கவும்", "Post Reply": "பதில் அனுப்புக",
            "Cancel": "ரத்து", "Save": "சேமி", "Close": "மூடு", "Back to Homepage": "முகப்பிற்குத் திரும்பு",
            "Remember me": "நினைவில் கொள்க", "Don't have an account?": "கணக்கு இல்லையா?",
            "Create Account": "பதிவு செய்க", "Already have an account?": "ஏற்கனவே கணக்கு உள்ளதா?",
            "Wishlist": "விருப்பப்பட்டியல்", "My Organic Wishlist": "என் விருப்பப்பட்டியல்",
            "Move to Cart": "கூடையில் சேர்", "Clear All": "அனைத்தையும் நீக்கு",
            "Theme": "வண்ண தீம்", "Language": "மொழி", "Stock": "இருப்பு", "Harvested": "அறுவடை"
        },
        hi: {
            "Home": "होम", "Shop": "उत्पाद", "Community Kitchen": "सामुदायिक रसोई",
            "Group Buying": "सामूहिक खरीद", "Seed to Plate": "बीज से थाली तक",
            "Login": "लॉग इन", "Sign In": "लॉग इन", "Sign Up": "साइन अप", "Logout": "लॉग आउट",
            "My Account": "मेरा खाता", "Cart": "कार्ट", "Checkout": "चेकआउट", "Search": "खोजें",
            "View All": "सभी देखें", "Add to Cart": "कार्ट में जोड़ें", "Add": "+ जोड़ें",
            "Trace": "यात्रा देखें", "Trace QR": "QR यात्रा", "Buy Now": "अभी खरीदें",
            "Price": "कीमत", "Category": "श्रेणी", "Quantity": "मात्रा", "Subtotal": "उप-योग",
            "Total": "कुल", "Delivery Fee": "डिलीवरी शुल्क", "Customer": "ग्राहक",
            "Farmer": "किसान", "Artisan": "कारीगर", "Admin": "व्यवस्थापक", "Administrator": "मुख्य व्यवस्थापक",
            "In Stock": "स्टॉक में है", "Low Stock": "सीमित स्टॉक", "Fresh": "ताज़ा",
            "Good": "अच्छा", "Rating": "रेटिंग", "Reviews": "समीक्षाएं", "Farm Details": "खेत का विवरण",
            "Harvest Date": "कटाई की तारीख", "Shelf Life": "शेल्फ लाइफ", "Certifications": "प्रमाणन",
            "Nutrition": "पोषण", "Description": "विवरण", "Quick Actions": "त्वरित क्रियाएं",
            "Orders": "आर्डर", "Donate": "दान करें", "Upload Journey": "यात्रा अपलोड करें",
            "Add Product": "उत्पाद जोड़ें", "Manage Products": "उत्पाद प्रबंधित करें",
            "Customer Reviews": "ग्राहक समीक्षाएं", "Write a Review": "समीक्षा लिखें",
            "Submit Review": "समीक्षा भेजें", "Verified Buyer": "सत्यापित खरीदार",
            "Farmer Reply": "किसान का उत्तर", "Artisan Reply": "कारीगर का उत्तर",
            "Reply to Customer": "ग्राहक को उत्तर दें", "Post Reply": "उत्तर भेजें",
            "Cancel": "रद्द करें", "Save": "सहेजें", "Close": "बंद करें", "Back to Homepage": "होमपेज पर वापस जाएं",
            "Remember me": "मुझे याद रखें", "Don't have an account?": "खाता नहीं है?",
            "Create Account": "खाता बनाएं", "Already have an account?": "पहले से खाता है?",
            "Wishlist": "विशलिस्ट", "My Organic Wishlist": "मेरी जैविक विशलिस्ट",
            "Move to Cart": "कार्ट में डालें", "Clear All": "सभी हटाएं",
            "Theme": "थीम", "Language": "भाषा", "Stock": "स्टॉक", "Harvested": "कटाई"
        },
        te: {
            "Home": "హోమ్", "Shop": "ఉత్పత్తులు", "Community Kitchen": "కమ్యూనిటీ వంటగది",
            "Group Buying": "సామూహిక కొనుగోలు", "Seed to Plate": "విత్తనం నుండి ప్లేట్ వరకు",
            "Login": "లాగిన్", "Sign In": "లాగిన్", "Sign Up": "సైన్ అప్", "Logout": "లాగ్ అవుట్",
            "My Account": "నా ఖాతా", "Cart": "కార్ట్", "Checkout": "చెక్‌అవుట్", "Search": "వెతుకు",
            "View All": "అన్నీ చూడండి", "Add to Cart": "బుట్టలో వేయి", "Add": "+ జోడించు",
            "Trace": "ప్రయాణం చూడు", "Trace QR": "QR ప్రయాణం", "Buy Now": "ఇప్పుడే కొనండి",
            "Price": "ధర", "Category": "వర్గం", "Quantity": "పరిమాణం", "Subtotal": "ఉపమొత్తం",
            "Total": "మొత్తం", "Delivery Fee": "డెలివరీ ఛార్జ్", "Customer": "వినియోగదారుడు",
            "Farmer": "రైతు", "Artisan": "చేతివృత్తిదారుడు", "Admin": "అడ్మిన్", "Administrator": "ప్రధాన అడ్మిన్",
            "In Stock": "స్టాక్ ఉంది", "Low Stock": "తక్కువ స్టాక్", "Fresh": "తాజా",
            "Good": "మంచిది", "Rating": "రేటింగ్", "Reviews": "సమీక్షలు", "Farm Details": "పొలం వివరాలు",
            "Harvest Date": "కోత తేదీ", "Shelf Life": "షెల్ఫ్ లైఫ్", "Certifications": "ధృవపత్రాలు",
            "Nutrition": "పోషకాలు", "Description": "వివరణ", "Quick Actions": "త్వరిత చర్యలు",
            "Orders": "ఆర్డర్లు", "Donate": "దానం చేయండి", "Upload Journey": "ప్రయాణాన్ని అప్‌లోడ్ చేయండి",
            "Add Product": "ఉత్పత్తిని జోడించండి", "Manage Products": "ఉత్పత్తులను నిర్వహించండి",
            "Customer Reviews": "కస్టమర్ సమీక్షలు", "Write a Review": "సమీక్ష రాయండి",
            "Submit Review": "సమీక్ష పంపు", "Verified Buyer": "ధృవీకరించబడిన కొనుగోలుదారు",
            "Farmer Reply": "రైతు సమాధానం", "Artisan Reply": "చేతివృత్తిదారుని సమాధానం",
            "Reply to Customer": "సమాధానం ఇవ్వండి", "Post Reply": "సమాధానం పంపు",
            "Cancel": "రద్దు", "Save": "సేవ్ చేయి", "Close": "మూసివేయి", "Back to Homepage": "హోమ్‌పేజీకి తిరిగి వెళ్లండి",
            "Remember me": "గుర్తుంచుకో", "Don't have an account?": "ఖాతా లేదా?",
            "Create Account": "ఖాతా సృష్టించండి", "Already have an account?": "ఖాతా ఉందా?",
            "Wishlist": "విష్‌లిస్ట్", "My Organic Wishlist": "నా సేంద్రీయ కోరికల జాబితా",
            "Move to Cart": "బుట్టలోకి తరలించు", "Clear All": "అన్నీ తొలగించు",
            "Theme": "థీమ్", "Language": "భాష", "Stock": "నిల్వ", "Harvested": "కోత"
        },
        ml: {
            "Home": "ഹോം", "Shop": "വിഭവങ്ങൾ", "Community Kitchen": "കമ്മ്യൂണിറ്റി അടുക്കള",
            "Group Buying": "ഗ്രൂപ്പ് പർച്ചേസ്", "Seed to Plate": "വിത്തു മുതൽ തളിക വരെ",
            "Login": "ലോഗിൻ", "Sign In": "ലോഗിൻ", "Sign Up": "രജിസ്റ്റർ ചെയ്യുക", "Logout": "ലോഗ് ഔട്ട്",
            "My Account": "എന്റെ അക്കൗണ്ട്", "Cart": "കാർട്ട്", "Checkout": "ചെക്ക്ഔട്ട്", "Search": "തിരയുക",
            "View All": "എല്ലാം കാണുക", "Add to Cart": "കൂടയിൽ ചേർക്കുക", "Add": "+ ചേർക്കുക",
            "Trace": "യാത്ര കാണുക", "Trace QR": "QR യാത്ര", "Buy Now": "ഇപ്പോൾ വാങ്ങുക",
            "Price": "വില", "Category": "വിഭാഗം", "Quantity": "അളവ്", "Subtotal": "ഉപതുക",
            "Total": "ആകെ തുക", "Delivery Fee": "ഡെലിവറി ഫീസ്", "Customer": "ഉപഭോക്താവ്",
            "Farmer": "കർഷകൻ", "Artisan": "കരകൗശല വിദഗ്ദ്ധൻ", "Admin": "അഡ്മിൻ", "Administrator": "പ്രധാന അഡ്മിൻ",
            "In Stock": "സ്റ്റോക്കുണ്ട്", "Low Stock": "കുറഞ്ഞ സ്റ്റോക്ക്", "Fresh": "ഫ്രഷ്",
            "Good": "നല്ലത്", "Rating": "റേറ്റിംഗ്", "Reviews": "അവലോകനങ്ങൾ", "Farm Details": "കൃഷിയിട വിവരങ്ങൾ",
            "Harvest Date": "വിളവെടുത്ത തീയതി", "Shelf Life": "ആയുസ്സ്", "Certifications": "സർട്ടിഫിക്കറ്റുകൾ",
            "Nutrition": "പോഷകങ്ങൾ", "Description": "വിവരണം", "Quick Actions": "ദ്രുത പ്രവർത്തനങ്ങൾ",
            "Orders": "ഓർഡറുകൾ", "Donate": "സംഭാവന ചെയ്യുക", "Upload Journey": "യാത്ര അപ്‌ലോഡ് ചെയ്യുക",
            "Add Product": "ഉൽപ്പന്നം ചേർക്കുക", "Manage Products": "ഉൽപ്പന്നങ്ങൾ കൈകാര്യം ചെയ്യുക",
            "Customer Reviews": "ഉപഭോക്തൃ അവലോകനങ്ങൾ", "Write a Review": "അഭിപ്രായം രേഖപ്പെടുത്തുക",
            "Submit Review": "സമർപ്പിക്കുക", "Verified Buyer": "സ്ഥിരീകരിച്ച ഉപഭോക്താവ്",
            "Farmer Reply": "കർഷകന്റെ മറുപടി", "Artisan Reply": "കരകൗശല വിദഗ്ദ്ധന്റെ മറുപടി",
            "Reply to Customer": "മറുപടി നൽകുക", "Post Reply": "മറുപടി അയക്കുക",
            "Cancel": "റദ്ദാക്കുക", "Save": "സേവ് ചെയ്യുക", "Close": "അടയ്ക്കുക", "Back to Homepage": "ഹോംപേജിലേക്ക് മടങ്ങുക",
            "Remember me": "ഓർമ്മിക്കുക", "Don't have an account?": "അക്കൗണ്ട് ഇല്ലേ?",
            "Create Account": "അക്കൗണ്ട് ഉണ്ടാക്കുക", "Already have an account?": "അക്കൗണ്ട് ഉണ്ടോ?",
            "Wishlist": "ആഗ്രഹപ്പട്ടിക", "My Organic Wishlist": "എന്റെ ജൈവ ആഗ്രഹപ്പട്ടിക",
            "Move to Cart": "കാർട്ടിലേക്ക് മാറ്റുക", "Clear All": "എല്ലാം നീക്കം ചെയ്യുക",
            "Theme": "തീം", "Language": "ഭാഷ", "Stock": "സ്റ്റോക്ക്", "Harvested": "വിളവെടുത്തത്"
        },
        kn: {
            "Home": "ಮುಖಪುಟ", "Shop": "ಉತ್ಪನ್ನಗಳು", "Community Kitchen": "ಸಮುದಾಯ ಅಡುಗೆಮನೆ",
            "Group Buying": "ಗುಂಪು ಖರೀದಿ", "Seed to Plate": "ಬೀಜದಿಂದ ತಟ್ಟೆಯವರೆಗೆ",
            "Login": "ಲಾಗಿನ್", "Sign In": "ಲಾಗಿನ್", "Sign Up": "ಸೈನ್ ಅಪ್", "Logout": "ಲಾಗ್ ಔಟ್",
            "My Account": "ನನ್ನ ಖಾತೆ", "Cart": "ಕಾರ್ಟ್", "Checkout": "ಚೆಕ್‌ಔಟ್", "Search": "ಹುಡುಕು",
            "View All": "ಎಲ್ಲಾ ನೋಡಿ", "Add to Cart": "ಬುಟ್ಟಿಗೆ ಸೇರಿಸಿ", "Add": "+ ಸೇರಿಸಿ",
            "Trace": "ಪ್ರಯಾಣ ನೋಡಿ", "Trace QR": "QR ಪ್ರಯಾಣ", "Buy Now": "ಈಗಲೇ ಖರೀದಿಸಿ",
            "Price": "ಬೆಲೆ", "Category": "ವರ್ಗ", "Quantity": "ಪ್ರಮಾಣ", "Subtotal": "ಉಪಮೊತ್ತ",
            "Total": "ಒಟ್ಟು ಮೊತ್ತ", "Delivery Fee": "ಡೆಲಿವರಿ ಶುಲ್ಕ", "Customer": "ಗ್ರಾಹಕ",
            "Farmer": "ರೈತ", "Artisan": "ಕುಶಲಕರ್ಮಿ", "Admin": "ಅಡ್ಮಿನ್", "Administrator": "ಮುಖ್ಯ ಅಡ್ಮಿನ್",
            "In Stock": "ಸ್ಟಾಕ್ ಇದೆ", "Low Stock": "ಕಡಿಮೆ ಸ್ಟಾಕ್", "Fresh": "ತಾಜಾ",
            "Good": "ಉತ್ತಮ", "Rating": "ರೇಟಿಂಗ್", "Reviews": "ವಿಮರ್ಶೆಗಳು", "Farm Details": "ಹೊಲದ ವಿವರಗಳು",
            "Harvest Date": "ಕೊಯ್ಲು ದಿನಾಂಕ", "Shelf Life": "ಬಾಳಿಕೆ", "Certifications": "ಪ್ರಮಾಣಪತ್ರಗಳು",
            "Nutrition": "ಪೌಷ್ಟಿಕಾಂಶ", "Description": "ವಿವರಣೆ", "Quick Actions": "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
            "Orders": "ಆರ್ಡರ್‌ಗಳು", "Donate": "ದಾನ ಮಾಡಿ", "Upload Journey": "ಪ್ರಯಾಣ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
            "Add Product": "ಉತ್ಪನ್ನ ಸೇರಿಸಿ", "Manage Products": "ಉತ್ಪನ್ನಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
            "Customer Reviews": "ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು", "Write a Review": "ವಿಮರ್ಶೆ ಬರೆಯಿರಿ",
            "Submit Review": "ಸಲ್ಲಿಸಿ", "Verified Buyer": "ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರ",
            "Farmer Reply": "ರೈತರ ಉತ್ತರ", "Artisan Reply": "ಕುಶಲಕರ್ಮಿಗಳ ಉತ್ತರ",
            "Reply to Customer": "ಉತ್ತರ ನೀಡಿ", "Post Reply": "ಉತ್ತರ ಕಳುಹಿಸಿ",
            "Cancel": "ರದ್ದುಮಾಡಿ", "Save": "ಉಳಿಸಿ", "Close": "ಮುಚ್ಚು", "Back to Homepage": "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
            "Remember me": "ನೆನಪಿಡಿ", "Don't have an account?": "ಖಾತೆ ಇಲ್ಲವೇ?",
            "Create Account": "ಖಾತೆ ತೆರೆಯಿರಿ", "Already have an account?": "ಖಾತೆ ಇದೆಯೇ?",
            "Wishlist": "ವಿಶ್‌ಲಿಸ್ಟ್", "My Organic Wishlist": "ನನ್ನ ಸಾವಯವ ಇಷ್ಟಪಟ್ಟ ಪಟ್ಟಿ",
            "Move to Cart": "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ", "Clear All": "ಎಲ್ಲ ಅಳಿಸಿ",
            "Theme": "ಥೀಮ್", "Language": "ಭಾಷೆ", "Stock": "ಸ್ಟಾಕ್", "Harvested": "ಕೊಯ್ಲು"
        },
        es: {
            "Home": "Inicio", "Shop": "Tienda", "Community Kitchen": "Cocina Comunitaria",
            "Group Buying": "Compra Grupal", "Seed to Plate": "De la Semilla al Plato",
            "Login": "Iniciar Sesión", "Sign In": "Iniciar Sesión", "Sign Up": "Registrarse", "Logout": "Cerrar Sesión",
            "My Account": "Mi Cuenta", "Cart": "Carrito", "Checkout": "Pago", "Search": "Buscar",
            "View All": "Ver Todos", "Add to Cart": "Añadir al Carrito", "Add": "+ Añadir",
            "Trace": "Rastrear", "Trace QR": "Rastrear QR", "Buy Now": "Comprar Ahora",
            "Price": "Precio", "Category": "Categoría", "Quantity": "Cantidad", "Subtotal": "Subtotal",
            "Total": "Total", "Delivery Fee": "Costo de Envío", "Customer": "Cliente",
            "Farmer": "Agricultor", "Artisan": "Artesano", "Admin": "Admin", "Administrator": "Administrador",
            "In Stock": "En Stock", "Low Stock": "Poco Stock", "Fresh": "Fresco",
            "Good": "Bueno", "Rating": "Calificación", "Reviews": "Reseñas", "Farm Details": "Datos de Granja",
            "Harvest Date": "Fecha de Cosecha", "Shelf Life": "Vida Útil", "Certifications": "Certificaciones",
            "Nutrition": "Nutrición", "Description": "Descripción", "Quick Actions": "Acciones Rápidas",
            "Orders": "Pedidos", "Donate": "Donar", "Upload Journey": "Subir Trazabilidad",
            "Add Product": "Añadir Producto", "Manage Products": "Gestionar Productos",
            "Customer Reviews": "Reseñas de Clientes", "Write a Review": "Escribir Reseña",
            "Submit Review": "Enviar Reseña", "Verified Buyer": "Comprador Verificado",
            "Farmer Reply": "Respuesta del Agricultor", "Artisan Reply": "Respuesta del Artesano",
            "Reply to Customer": "Responder", "Post Reply": "Publicar Respuesta",
            "Cancel": "Cancelar", "Save": "Guardar", "Close": "Cerrar", "Back to Homepage": "Volver al Inicio",
            "Remember me": "Recordarme", "Don't have an account?": "¿No tienes cuenta?",
            "Create Account": "Crear Cuenta", "Already have an account?": "¿Ya tienes cuenta?",
            "Wishlist": "Deseos", "My Organic Wishlist": "Mi Lista de Deseos Orgánicos",
            "Move to Cart": "Mover al Carrito", "Clear All": "Limpiar Todo",
            "Theme": "Tema", "Language": "Idioma", "Stock": "Stock", "Harvested": "Cosechado"
        },
        fr: {
            "Home": "Accueil", "Shop": "Boutique", "Community Kitchen": "Cuisine Communautaire",
            "Group Buying": "Achat Groupé", "Seed to Plate": "De la Graine à l'Assiette",
            "Login": "Connexion", "Sign In": "Connexion", "Sign Up": "S'inscrire", "Logout": "Déconnexion",
            "My Account": "Mon Compte", "Cart": "Panier", "Checkout": "Caisse", "Search": "Rechercher",
            "View All": "Voir Tout", "Add to Cart": "Ajouter au Panier", "Add": "+ Ajouter",
            "Trace": "Tracer", "Trace QR": "Tracer QR", "Buy Now": "Acheter Maintenant",
            "Price": "Prix", "Category": "Catégorie", "Quantity": "Quantité", "Subtotal": "Sous-total",
            "Total": "Total", "Delivery Fee": "Frais de Port", "Customer": "Client",
            "Farmer": "Agriculteur", "Artisan": "Artisan", "Admin": "Admin", "Administrator": "Administrateur",
            "In Stock": "En Stock", "Low Stock": "Stock Faible", "Fresh": "Frais",
            "Good": "Bon", "Rating": "Note", "Reviews": "Avis", "Farm Details": "Détails de la Ferme",
            "Harvest Date": "Date de Récolte", "Shelf Life": "Conservation", "Certifications": "Certifications",
            "Nutrition": "Nutrition", "Description": "Description", "Quick Actions": "Actions Rapides",
            "Orders": "Commandes", "Donate": "Faire un Don", "Upload Journey": "Téléverser Traçabilité",
            "Add Product": "Ajouter un Produit", "Manage Products": "Gérer les Produits",
            "Customer Reviews": "Avis Clients", "Write a Review": "Donner un Avis",
            "Submit Review": "Envoyer", "Verified Buyer": "Acheteur Vérifié",
            "Farmer Reply": "Réponse du Producteur", "Artisan Reply": "Réponse de l'Artisan",
            "Reply to Customer": "Répondre", "Post Reply": "Publier la Réponse",
            "Cancel": "Annuler", "Save": "Enregistrer", "Close": "Fermer", "Back to Homepage": "Retour à l'Accueil",
            "Remember me": "Se souvenir de moi", "Don't have an account?": "Pas de compte ?",
            "Create Account": "Créer un Compte", "Already have an account?": "Déjà un compte ?",
            "Wishlist": "Favoris", "My Organic Wishlist": "Mes Favoris Biologiques",
            "Move to Cart": "Mettre au Panier", "Clear All": "Tout Effacer",
            "Theme": "Thème", "Language": "Langue", "Stock": "Stock", "Harvested": "Récolté"
        }
    };

    // ----------------------------------------------------
    // THEME CONTROLLER & GLOBAL APPLICATION
    // ----------------------------------------------------
    function getStoredTheme() {
        const raw = localStorage.getItem('ftf_theme') || localStorage.getItem('farmToForkTheme') || 'emerald';
        if (raw === 'dark') return 'midnight';
        if (raw === 'light') return 'emerald';
        return raw;
    }

    function applyTheme(themeName) {
        const normalized = (themeName === 'dark') ? 'midnight' : ((themeName === 'light') ? 'emerald' : (themeName || 'emerald'));
        
        document.documentElement.setAttribute('data-theme', normalized);
        if (document.body) {
            document.body.setAttribute('data-theme', normalized);
        }

        const isDark = normalized === 'midnight';
        if (isDark) {
            document.documentElement.classList.add('dark-theme');
            if (document.body) document.body.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
            if (document.body) document.body.classList.remove('dark-theme');
        }

        // Update Theme UI indicators
        updateThemeControlsUI(normalized);

        // Dispatch system-wide events
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark, theme: normalized } }));
        window.dispatchEvent(new CustomEvent('ftf:themeChanged', { detail: { isDark, theme: normalized } }));
    }

    function setGlobalTheme(themeName) {
        const normalized = (themeName === 'dark') ? 'midnight' : ((themeName === 'light') ? 'emerald' : themeName);
        localStorage.setItem('ftf_theme', normalized);
        localStorage.setItem('farmToForkTheme', normalized); // backwards compatibility
        applyTheme(normalized);
    }

    function toggleTheme() {
        const current = getStoredTheme();
        const next = (current === 'midnight' || document.documentElement.classList.contains('dark-theme')) ? 'emerald' : 'midnight';
        setGlobalTheme(next);
    }

    function updateThemeControlsUI(themeName) {
        const currentMeta = THEMES.find(t => t.id === themeName) || THEMES[0];
        
        // Update labels and dot swatches in navbar
        const themeLabel = document.getElementById('currentThemeLabel');
        if (themeLabel) themeLabel.textContent = currentMeta.name;
        
        const themeDot = document.getElementById('currentThemeDot');
        if (themeDot) {
            themeDot.style.background = currentMeta.color;
            if (currentMeta.border) themeDot.style.borderColor = currentMeta.border;
        }

        // Update active class on dropdown and modal items
        document.querySelectorAll('.global-dropdown-menu [data-theme], .global-theme-card[data-theme]').forEach(el => {
            el.classList.toggle('active', el.dataset.theme === themeName);
        });

        // Update classic toggle icons if present
        document.querySelectorAll('.theme-toggle i').forEach(icon => {
            icon.className = themeName === 'midnight' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // ----------------------------------------------------
    // LANGUAGE CONTROLLER & FULL DOM TRANSLATION
    // ----------------------------------------------------
    function getStoredLanguage() {
        return localStorage.getItem('ftf_lang') || 'en';
    }

    function applyFullTranslation(lang) {
        const activeLang = lang || getStoredLanguage();
        const t = I18N[activeLang] || I18N.en;
        document.documentElement.setAttribute('lang', activeLang);

        // 1. Data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                if (el.dataset.origHtml === undefined) el.dataset.origHtml = el.innerHTML;
                el.innerHTML = t[key];
            }
        });

        // 2. Data-i18n-placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key] !== undefined) {
                if (el.dataset.origPlaceholder === undefined) el.dataset.origPlaceholder = el.placeholder;
                el.placeholder = t[key];
            }
        });

        // 3. Data-i18n-title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (t[key] !== undefined) {
                if (el.dataset.origTitle === undefined) el.dataset.origTitle = el.title;
                el.title = t[key];
            }
        });

        // 4. Mapped Unique Element IDs
        const directIdMap = {
            'txtLoginTitle': t.loginTitle,
            'txtLoginSub': t.loginSub,
            'txtRememberMe': t.loginRemember,
            'btnSubmitLogin': `<i class="fas fa-sign-in-alt"></i> ${t.loginBtnSubmit}`,
            'shopHeaderTitle': t.shopHeaderTitle,
            'shopHeaderSubtitle': t.shopHeaderSubtitle,
            'txtHomeTopOrganic': `<i class="fas fa-leaf"></i> ${t.topOrganic}`,
            'txtHomeTopDelivery': `<i class="fas fa-truck"></i> ${t.topDelivery}`,
            'txtHomeTopZero': `<i class="fas fa-hand-holding-heart"></i> ${t.topZeroWaste}`,
            'txtHomeTopFrozen': `<i class="fas fa-snowflake"></i> ${t.topFrozen}`,
            'txtWishlistHeading': t.wishlistHeading,
            'txtWishlistSub': t.wishlistSub
        };

        Object.entries(directIdMap).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val) el.innerHTML = val;
        });

        // 5. Navigation Links
        const navMap = {
            'navHomeLink': t.navHome, 'navHome': t.navHome,
            'navShopLink': t.navShop, 'navShop': t.navShop,
            'navKitchenLink': t.navKitchen, 'navKitchen': t.navKitchen,
            'navGroupLink': t.navGroup, 'navGroup': t.navGroup,
            'navSeedLink': t.navSeed, 'navSeed': t.navSeed,
            'navLoginBtn': t.navLogin, 'navSignupBtn': t.navSignup,
            'navShopHome': t.navHome, 'navShopProducts': t.navShop,
            'navShopKitchen': t.navKitchen, 'navShopGroup': t.navGroup,
            'navShopSeed': t.navSeed, 'navShopLogin': t.navLogin,
            'navShopSignup': t.navSignup, 'navDetailHome': t.navHome,
            'navDetailShop': t.navShop, 'navDetailKitchen': t.navKitchen,
            'navDetailGroup': t.navGroup, 'navDetailSeed': t.navSeed,
            'navDetailLogin': t.navLogin, 'navDetailSignup': t.navSignup
        };

        Object.entries(navMap).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val) el.textContent = val;
        });

        // 6. Homepage Specific Sections
        const heroBadge = document.querySelector('.hero-badge');
        if (heroBadge) heroBadge.innerHTML = `<i class="fas fa-qrcode"></i> ${t.heroBadge}`;
        const heroH1 = document.querySelector('.hero-content h1');
        if (heroH1) heroH1.innerHTML = `<span class="gradient-text">${t.heroTitleMain}</span><br /><span>${t.heroTitleSub}</span>`;
        const heroP = document.querySelector('.hero-content p');
        if (heroP) heroP.textContent = t.heroDesc;
        const heroBtnShop = document.querySelector('.hero-buttons a.btn-primary');
        if (heroBtnShop) heroBtnShop.innerHTML = `<i class="fas fa-shopping-bag"></i> ${t.heroBtnShop}`;
        const heroBtnTrack = document.querySelector('.hero-buttons a.btn-secondary');
        if (heroBtnTrack) heroBtnTrack.innerHTML = `<i class="fas fa-qrcode"></i> ${t.heroBtnTrack}`;

        const frozenTag = document.querySelector('.frozen-banner .section-tag');
        if (frozenTag) frozenTag.textContent = t.frozenTag;
        const frozenH2 = document.querySelector('.frozen-text h2');
        if (frozenH2) frozenH2.innerHTML = t.frozenTitle;
        const frozenP = document.querySelector('.frozen-text p');
        if (frozenP) frozenP.textContent = t.frozenDesc;
        const frozenBtn = document.querySelector('.frozen-text a.btn-primary');
        if (frozenBtn) frozenBtn.innerHTML = `<i class="fas fa-snowflake"></i> ${t.frozenBtn}`;

        const catTag = document.querySelector('.categories-section .section-tag');
        if (catTag) catTag.textContent = t.catTag;
        const catH2 = document.querySelector('.categories-section .section-header h2');
        if (catH2) catH2.innerHTML = t.catTitle;
        const catOverlays = document.querySelectorAll('.category-overlay');
        if (catOverlays.length >= 4) {
            catOverlays[0].querySelector('h3').textContent = t.catVegTitle;
            catOverlays[0].querySelector('p').textContent = t.catVegDesc;
            catOverlays[0].querySelector('a').textContent = t.catShopNow;

            catOverlays[1].querySelector('h3').textContent = t.catFruitTitle;
            catOverlays[1].querySelector('p').textContent = t.catFruitDesc;
            catOverlays[1].querySelector('a').textContent = t.catShopNow;

            catOverlays[2].querySelector('h3').textContent = t.catHmTitle;
            catOverlays[2].querySelector('p').textContent = t.catHmDesc;
            catOverlays[2].querySelector('a').textContent = t.catShopNow;

            catOverlays[3].querySelector('h3').textContent = t.catFrzTitle;
            catOverlays[3].querySelector('p').textContent = t.catFrzDesc;
            catOverlays[3].querySelector('a').textContent = t.catShopNow;
        }

        const featTag = document.querySelector('.features-section .section-tag');
        if (featTag) featTag.textContent = t.featTag;
        const featH2 = document.querySelector('.features-section .section-header h2');
        if (featH2) featH2.innerHTML = t.featTitle;
        const featureCards = document.querySelectorAll('.features-grid .feature-card');
        if (featureCards.length >= 6) {
            featureCards[0].querySelector('h3').textContent = t.feat1Title;
            featureCards[0].querySelector('p').textContent = t.feat1Desc;
            featureCards[0].querySelector('.feature-tag').textContent = t.feat1Tag;

            featureCards[1].querySelector('h3').textContent = t.feat2Title;
            featureCards[1].querySelector('p').textContent = t.feat2Desc;
            featureCards[1].querySelector('.feature-tag').textContent = t.feat2Tag;

            featureCards[2].querySelector('h3').textContent = t.feat3Title;
            featureCards[2].querySelector('p').textContent = t.feat3Desc;
            featureCards[2].querySelector('.feature-tag').textContent = t.feat3Tag;

            featureCards[3].querySelector('h3').textContent = t.feat4Title;
            featureCards[3].querySelector('p').textContent = t.feat4Desc;
            featureCards[3].querySelector('.feature-tag').textContent = t.feat4Tag;

            featureCards[4].querySelector('h3').textContent = t.feat5Title;
            featureCards[4].querySelector('p').textContent = t.feat5Desc;
            featureCards[4].querySelector('.feature-tag').textContent = t.feat5Tag;

            featureCards[5].querySelector('h3').textContent = t.feat6Title;
            featureCards[5].querySelector('p').textContent = t.feat6Desc;
            featureCards[5].querySelector('.feature-tag').textContent = t.feat6Tag;
        }

        const footerBrandP = document.querySelector('.footer-brand p');
        if (footerBrandP) footerBrandP.textContent = t.footerDesc;
        const footerBottomP = document.querySelector('.footer-bottom p');
        if (footerBottomP) footerBottomP.textContent = t.footerCopy;

        // 7. Dynamic Product Names on Cards & Details Across Catalog
        const activeProdMap = PRODUCT_NAMES[activeLang] || PRODUCT_NAMES.en;
        document.querySelectorAll('.product-card, .ftf-farmer-product-card').forEach(card => {
            const nameEl = card.querySelector('.product-name, h3');
            if (nameEl) {
                if (nameEl.dataset.origName === undefined) {
                    nameEl.dataset.origName = nameEl.textContent.trim();
                }
                const onclickStr = card.getAttribute('onclick') || card.innerHTML || '';
                const match = onclickStr.match(/id=(\d+)/) || onclickStr.match(/addToCart\((\d+)\)/) || onclickStr.match(/product-details\.html\?id=(\d+)/);
                if (match && activeProdMap[match[1]]) {
                    nameEl.textContent = activeProdMap[match[1]];
                } else if (activeLang === 'en') {
                    nameEl.textContent = nameEl.dataset.origName;
                }
            }
        });

        // 8. Direct String Scanner: Buttons, Badges, Labels, Headers
        const activeMap = STRING_MAPS[activeLang];
        document.querySelectorAll('button, a.btn-primary, a.btn-secondary, a.btn-signup, a.btn-login, .badge, .status-pill, h1, h2, h3, h4, label, th, .section-tag').forEach(el => {
            if (el.querySelector('#summaryItemCount, #cartCount, #cartBadge, .cart-badge, .stat-number, #cartSubtotal, #cartTotal, #cartDelivery, #cartDiscount') || el.id === 'summaryItemCount' || el.id === 'cartCount') return;
            if (el.children.length > 2) return;
            const text = el.textContent.trim();
            if (el.dataset.origText === undefined) {
                el.dataset.origText = text;
            }

            const baseText = el.dataset.origText;
            if (activeLang === 'en') {
                el.textContent = baseText;
            } else if (activeMap && activeMap[baseText]) {
                el.textContent = activeMap[baseText];
            }
        });

        // 9. Update Language UI Controls
        updateLanguageControlsUI(activeLang);

        // 10. Re-trigger custom page renderers if present
        if (typeof window.applyFiltersAndRender === 'function' && window.location.pathname.includes('products.html')) {
            window.applyFiltersAndRender();
        }

        // 11. Dispatch system-wide events
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: activeLang } }));
        window.dispatchEvent(new CustomEvent('ftf:languageChanged', { detail: { lang: activeLang } }));
    }

    function setGlobalLanguage(langCode) {
        localStorage.setItem('ftf_lang', langCode);
        applyFullTranslation(langCode);
    }

    function updateLanguageControlsUI(langCode) {
        const currentMeta = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
        
        // Update label in navbar dropdown
        const langLabel = document.getElementById('currentLangLabel');
        if (langLabel) langLabel.textContent = `${currentMeta.flag} ${currentMeta.native}`;

        // Update active class on dropdown and modal items
        document.querySelectorAll('.global-dropdown-menu [data-lang], .global-lang-card[data-lang]').forEach(el => {
            el.classList.toggle('active', el.dataset.lang === langCode);
        });

        // Update classic pill buttons if present
        document.querySelectorAll('.nav-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === langCode);
        });
    }

    // ----------------------------------------------------
    // INJECT UI CONTROLS (NAVBAR & FLOATING HUB)
    // ----------------------------------------------------
    function injectGlobalControls() {
        // 1. Inject Navbar Controls Cluster
        const navActions = document.querySelector('.navbar .nav-actions, .navbar-actions, nav .nav-actions');
        if (navActions && !document.getElementById('globalPreferencesCluster')) {
            const cluster = document.createElement('div');
            cluster.className = 'global-preferences-cluster';
            cluster.id = 'globalPreferencesCluster';
            
            const currentLang = getStoredLanguage();
            const currentTheme = getStoredTheme();
            const langMeta = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
            const themeMeta = THEMES.find(t => t.id === currentTheme) || THEMES[0];

            cluster.innerHTML = `
                <!-- Language Dropdown -->
                <div class="global-dropdown global-lang-dropdown" id="globalLangDropdown">
                    <button type="button" class="global-control-btn" id="globalLangToggleBtn" aria-label="Select Language" onclick="window.toggleGlobalDropdown('globalLangDropdown', event)">
                        <i class="fas fa-globe"></i>
                        <span class="global-control-label" id="currentLangLabel">${langMeta.flag} ${langMeta.native}</span>
                        <i class="fas fa-chevron-down caret-icon"></i>
                    </button>
                    <div class="global-dropdown-menu" id="globalLangMenu">
                        ${LANGUAGES.map(l => `
                            <button type="button" class="global-menu-item ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}" onclick="window.setGlobalLanguage('${l.code}')">
                                <span class="lang-flag">${l.flag}</span>
                                <span class="lang-name">${l.native}</span>
                                <span class="lang-code">(${l.label})</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Theme Dropdown -->
                <div class="global-dropdown global-theme-dropdown" id="globalThemeDropdown">
                    <button type="button" class="global-control-btn" id="globalThemeToggleBtn" aria-label="Select Theme" onclick="window.toggleGlobalDropdown('globalThemeDropdown', event)">
                        <i class="fas fa-palette"></i>
                        <span class="global-control-label" id="currentThemeLabel">${themeMeta.name}</span>
                        <span class="theme-swatch-dot" id="currentThemeDot" style="background:${themeMeta.color};"></span>
                        <i class="fas fa-chevron-down caret-icon"></i>
                    </button>
                    <div class="global-dropdown-menu" id="globalThemeMenu">
                        ${THEMES.map(t => `
                            <button type="button" class="global-menu-item ${t.id === currentTheme ? 'active' : ''}" data-theme="${t.id}" onclick="window.setGlobalTheme('${t.id}')">
                                <span class="theme-preview-dot" style="background:${t.color}; ${t.border ? 'border:1px solid ' + t.border : ''}"></span>
                                <span>${t.icon} ${t.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            // Insert cleanly before cart button or user widget
            const cartBtn = navActions.querySelector('.cart-btn, #navCartBtn');
            const userWidget = navActions.querySelector('#navbarUserWidget');
            const hamburger = navActions.querySelector('.hamburger');

            if (userWidget) {
                navActions.insertBefore(cluster, userWidget);
            } else if (cartBtn) {
                navActions.insertBefore(cluster, cartBtn);
            } else if (hamburger) {
                navActions.insertBefore(cluster, hamburger);
            } else {
                navActions.appendChild(cluster);
            }
        }

        // 2. Inject Global Floating Settings Hub (Accessible on Every Single Page)
        if (!document.getElementById('ftfGlobalSettingsHub')) {
            const floatingHub = document.createElement('div');
            floatingHub.className = 'global-floating-hub';
            floatingHub.id = 'ftfGlobalSettingsHub';
            floatingHub.innerHTML = `
                <button type="button" class="global-floating-btn" id="ftfFloatingSettingsTrigger" onclick="window.openGlobalSettingsModal()" title="Change Language & Theme">
                    <i class="fas fa-sliders-h"></i>
                    <span>Language & Theme</span>
                </button>
            `;
            document.body.appendChild(floatingHub);
        }

        // 3. Inject Global Settings Modal
        if (!document.getElementById('ftfGlobalSettingsModal')) {
            const currentLang = getStoredLanguage();
            const currentTheme = getStoredTheme();
            const modalBackdrop = document.createElement('div');
            modalBackdrop.className = 'global-settings-modal-backdrop';
            modalBackdrop.id = 'ftfGlobalSettingsModal';
            modalBackdrop.onclick = function(e) {
                if (e.target === modalBackdrop) window.closeGlobalSettingsModal();
            };

            modalBackdrop.innerHTML = `
                <div class="global-settings-modal-card" onclick="event.stopPropagation()">
                    <div class="global-settings-header">
                        <h3><i class="fas fa-sliders-h"></i> Global Preferences</h3>
                        <button type="button" class="global-settings-close" onclick="window.closeGlobalSettingsModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Language Section -->
                    <div class="global-settings-section">
                        <div class="global-settings-title">
                            <i class="fas fa-globe"></i> Select Application Language
                        </div>
                        <div class="global-lang-grid">
                            ${LANGUAGES.map(l => `
                                <div class="global-lang-card ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}" onclick="window.setGlobalLanguage('${l.code}')">
                                    <span class="flag">${l.flag}</span>
                                    <span class="name">${l.native}</span>
                                    <span class="sub">${l.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Theme Section -->
                    <div class="global-settings-section">
                        <div class="global-settings-title">
                            <i class="fas fa-palette"></i> Select Visual Theme
                        </div>
                        <div class="global-theme-grid">
                            ${THEMES.map(t => `
                                <div class="global-theme-card ${t.id === currentTheme ? 'active' : ''}" data-theme="${t.id}" onclick="window.setGlobalTheme('${t.id}')">
                                    <div class="theme-preview-box" style="background:${t.color}; ${t.border ? 'border:1px solid ' + t.border : ''}"></div>
                                    <div class="theme-info">
                                        <span class="theme-title">${t.icon} ${t.name}</span>
                                        <span class="theme-desc">${t.desc}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalBackdrop);
        }
    }

    // ----------------------------------------------------
    // DROPDOWN & MODAL EVENT HANDLERS
    // ----------------------------------------------------
    window.toggleGlobalDropdown = function(dropdownId, event) {
        if (event) event.stopPropagation();
        const target = document.getElementById(dropdownId);
        const isOpen = target ? target.classList.contains('open') : false;

        document.querySelectorAll('.global-dropdown').forEach(d => d.classList.remove('open'));
        if (target && !isOpen) {
            target.classList.add('open');
        }
    };

    window.openGlobalSettingsModal = function() {
        const modal = document.getElementById('ftfGlobalSettingsModal');
        if (modal) modal.classList.add('open');
    };

    window.closeGlobalSettingsModal = function() {
        const modal = document.getElementById('ftfGlobalSettingsModal');
        if (modal) modal.classList.remove('open');
    };

    // Close dropdowns on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.global-dropdown')) {
            document.querySelectorAll('.global-dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // Close modal on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeGlobalSettingsModal();
            document.querySelectorAll('.global-dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // ----------------------------------------------------
    // CROSS-TAB MULTI-WINDOW SYNCHRONIZATION
    // ----------------------------------------------------
    window.addEventListener('storage', function(e) {
        if (e.key === 'ftf_theme' && e.newValue) {
            applyTheme(e.newValue);
        }
        if (e.key === 'ftf_lang' && e.newValue) {
            applyFullTranslation(e.newValue);
        }
    });

    // ----------------------------------------------------
    // EXPOSE PUBLIC API
    // ----------------------------------------------------
    window.FTF_I18N = {
        languages: LANGUAGES,
        themes: THEMES,
        dict: I18N,
        productNames: PRODUCT_NAMES,
        tamilProductNames: PRODUCT_NAMES.ta, // backwards compatibility
        stringMaps: STRING_MAPS,
        stringMapEnToTa: STRING_MAPS.ta,    // backwards compatibility
        apply: applyFullTranslation,
        t: function(key, lang) {
            const current = lang || getStoredLanguage();
            return (I18N[current] && I18N[current][key]) || (I18N.en && I18N.en[key]) || key;
        }
    };

    window.FTF_THEMES = {
        themes: THEMES,
        apply: applyTheme,
        set: setGlobalTheme,
        get: getStoredTheme
    };

    window.setGlobalLanguage = setGlobalLanguage;
    window.getStoredLanguage = getStoredLanguage;
    window.setGlobalTheme = setGlobalTheme;
    window.applyTheme = applyTheme;
    window.getStoredTheme = getStoredTheme;
    window.toggleTheme = toggleTheme;
    window.t = function(key, lang) {
        return window.FTF_I18N ? window.FTF_I18N.t(key, lang) : key;
    };

    // ----------------------------------------------------
    // BOOTSTRAP ON LOAD
    // ----------------------------------------------------
    function init() {
        applyTheme(getStoredTheme());
        injectGlobalControls();
        applyFullTranslation(getStoredLanguage());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window);
