// ============================================
// FARMER MARKETPLACE & MULTI-SELLER ENGINE
// Farm to Fork Collective
// Handles multiple farmers selling the same organic produce
// Transparent comparison of price, distance, stock, harvest date, ratings & delivery
// Dedicated Farmer Store integration & Direct Buy Flow
// ============================================

// ============================================
// TAMIL NADU HIGHWAY ROAD DISTANCES MATRIX (KM)
// Accurate distance between agricultural hubs & consumer cities
// ============================================
const TN_ROAD_DISTANCES = {
    'Dindigul': {
        'Dindigul': 18,
        'Madurai': 62,
        'Tiruchirappalli': 102,
        'Kovilpatti': 165,
        'Tirunelveli': 215,
        'Coimbatore': 155,
        'Erode': 135,
        'Salem': 175,
        'Sivaganga': 105,
        'Thanjavur': 155,
        'Dharmapuri': 210,
        'Nilgiris': 215,
        'Chennai': 420
    },
    'Coimbatore': {
        'Coimbatore': 42,
        'Nilgiris': 86,
        'Erode': 98,
        'Dindigul': 125,
        'Salem': 160,
        'Madurai': 180,
        'Dharmapuri': 200,
        'Tiruchirappalli': 215,
        'Sivaganga': 230,
        'Thanjavur': 265,
        'Kovilpatti': 285,
        'Tirunelveli': 335,
        'Chennai': 510
    },
    'Dharmapuri': {
        'Dharmapuri': 25,
        'Salem': 65,
        'Erode': 120,
        'Tiruchirappalli': 195,
        'Coimbatore': 200,
        'Dindigul': 210,
        'Nilgiris': 225,
        'Thanjavur': 240,
        'Madurai': 265,
        'Sivaganga': 280,
        'Chennai': 290,
        'Kovilpatti': 365,
        'Tirunelveli': 415
    },
    'Sivaganga': {
        'Sivaganga': 15,
        'Madurai': 85,
        'Tiruchirappalli': 90,
        'Thanjavur': 95,
        'Dindigul': 105,
        'Kovilpatti': 120,
        'Tirunelveli': 170,
        'Erode': 210,
        'Salem': 220,
        'Coimbatore': 230,
        'Dharmapuri': 280,
        'Nilgiris': 310,
        'Chennai': 415
    },
    'Nilgiris': {
        'Nilgiris': 12,
        'Coimbatore': 86,
        'Erode': 145,
        'Salem': 210,
        'Dindigul': 215,
        'Dharmapuri': 225,
        'Madurai': 275,
        'Tiruchirappalli': 290,
        'Sivaganga': 310,
        'Kovilpatti': 375,
        'Tirunelveli': 425,
        'Chennai': 535
    },
    'Salem': {
        'Salem': 15,
        'Dharmapuri': 65,
        'Erode': 65,
        'Tiruchirappalli': 135,
        'Coimbatore': 160,
        'Dindigul': 175,
        'Nilgiris': 210,
        'Madurai': 235,
        'Thanjavur': 180,
        'Sivaganga': 220,
        'Chennai': 340,
        'Kovilpatti': 335,
        'Tirunelveli': 385
    },
    'Madurai': {
        'Madurai': 15,
        'Dindigul': 62,
        'Sivaganga': 85,
        'Kovilpatti': 95,
        'Tiruchirappalli': 130,
        'Tirunelveli': 155,
        'Coimbatore': 180,
        'Salem': 235,
        'Thanjavur': 160,
        'Chennai': 455,
        'Dharmapuri': 265,
        'Nilgiris': 275
    },
    'Namakkal': {
        'Namakkal': 22,
        'Salem': 55,
        'Tiruchirappalli': 85,
        'Erode': 60,
        'Dindigul': 110,
        'Madurai': 170,
        'Coimbatore': 145,
        'Dharmapuri': 120,
        'Chennai': 380,
        'Kovilpatti': 270,
        'Tirunelveli': 320
    }
};

function calculateFarmerDistance(farmerDistrict, customerDistrict) {
    const fDist = farmerDistrict || 'Dindigul';
    const cDist = customerDistrict || 'Chennai';
    if (fDist.toLowerCase() === cDist.toLowerCase()) return 18;
    if (TN_ROAD_DISTANCES[fDist] && TN_ROAD_DISTANCES[fDist][cDist] !== undefined) {
        return TN_ROAD_DISTANCES[fDist][cDist];
    }
    if (TN_ROAD_DISTANCES[cDist] && TN_ROAD_DISTANCES[cDist][fDist] !== undefined) {
        return TN_ROAD_DISTANCES[cDist][fDist];
    }
    return 185;
}

function getDeliveryInfoForDistance(distKm) {
    if (distKm <= 50) {
        return {
            distKm: distKm,
            delivery: '⚡ Same-Day Express (2-4 hrs)',
            deliveryTa: '⚡ இன்றே விரைவு டெலிவரி (2-4 மணி)',
            badge: '⚡ Same-Day Express',
            tag: '⚡ Hyper-local Farm (< 50 km)',
            tagTa: '⚡ மிக அருகில் உள்ள பண்ணை (< 50 கி.மீ)'
        };
    } else if (distKm <= 150) {
        return {
            distKm: distKm,
            delivery: '🚚 Same-Day Evening (within 6-8 hrs)',
            deliveryTa: '🚚 இன்றே மாலை டெலிவரி (6-8 மணி)',
            badge: '🚚 Same-Day Evening',
            tag: '🚚 Regional Direct (Same-Day)',
            tagTa: '🚚 மண்டல நேரடி விநியோகம்'
        };
    } else {
        return {
            distKm: distKm,
            delivery: '❄️ Cold-Chain Overnight (Next-Day 7-10 AM)',
            deliveryTa: '❄️ குளிர்சங்கிலி மறுநாள் காலை (7-10 AM)',
            badge: '❄️ Next-Day Cold-Chain',
            tag: '❄️ Inter-district Direct',
            tagTa: '❄️ மாவட்டங்களுக்கு இடையேயான விநியோகம்'
        };
    }
}

// Registered Customer Location Helper (Detects Logged-in User Address or Saved Location)
function getRegisteredCustomerLocation() {
    let loc = {
        name: 'Anna Nagar, Chennai',
        district: 'Chennai',
        address: '42, 4th Avenue, Anna Nagar West, Chennai - 600040',
        isLoggedIn: false,
        userName: 'Guest Customer'
    };

    try {
        let user = null;
        if (typeof getCurrentUser === 'function') {
            user = getCurrentUser();
        } else {
            const savedUser = localStorage.getItem('farmToForkUser');
            if (savedUser) user = JSON.parse(savedUser);
        }

        const savedLoc = localStorage.getItem('customerRegisteredLocation');

        if (user && (user.name || user.email)) {
            loc.isLoggedIn = true;
            loc.userName = user.name || 'Member';

            if (savedLoc) {
                const parsed = JSON.parse(savedLoc);
                return { ...loc, ...parsed, isLoggedIn: true, userName: user.name || 'Member' };
            }

            const addr = (user.address || '').toLowerCase();
            const email = (user.email || '').toLowerCase();

            if (addr.includes('coimbatore') || addr.includes('pollachi')) {
                loc.district = 'Coimbatore';
                loc.name = 'RS Puram, Coimbatore';
            } else if (addr.includes('madurai')) {
                loc.district = 'Madurai';
                loc.name = 'KK Nagar, Madurai';
            } else if (addr.includes('dindigul') || addr.includes('oddanchatram')) {
                loc.district = 'Dindigul';
                loc.name = 'Oddanchatram / Dindigul';
            } else if (addr.includes('salem')) {
                loc.district = 'Salem';
                loc.name = 'Hasthampatti, Salem';
            } else if (addr.includes('trichy') || addr.includes('tiruchirappalli')) {
                loc.district = 'Tiruchirappalli';
                loc.name = 'Thillai Nagar, Trichy';
            } else if (addr.includes('kovilpatti') || addr.includes('thoothukudi') || email.includes('nec.edu.in')) {
                loc.district = 'Kovilpatti';
                loc.name = 'Kovilpatti, Thoothukudi (NEC)';
            } else if (addr.includes('tirunelveli')) {
                loc.district = 'Tirunelveli';
                loc.name = 'Palayamkottai, Tirunelveli';
            } else if (addr.includes('dharmapuri')) {
                loc.district = 'Dharmapuri';
                loc.name = 'Dharmapuri Town';
            } else if (addr.includes('ooty') || addr.includes('nilgiris')) {
                loc.district = 'Nilgiris';
                loc.name = 'Ooty, Nilgiris';
            } else if (addr.includes('erode')) {
                loc.district = 'Erode';
                loc.name = 'Perundurai Road, Erode';
            } else if (addr.includes('sivaganga') || addr.includes('karaikudi') || addr.includes('chettinad')) {
                loc.district = 'Sivaganga';
                loc.name = 'Karaikudi, Sivaganga';
            } else if (addr.includes('thanjavur')) {
                loc.district = 'Thanjavur';
                loc.name = 'Thanjavur Town';
            } else {
                loc.district = 'Chennai';
                loc.name = user.address ? user.address.split(',')[0].trim() + ', Chennai' : 'Anna Nagar, Chennai';
            }

            if (user.address) loc.address = user.address;
            return loc;
        }

        if (savedLoc) {
            const parsed = JSON.parse(savedLoc);
            return { ...loc, ...parsed };
        }
    } catch(e) {}

    return loc;
}

function setRegisteredCustomerLocation(locationObj) {
    if (!locationObj) return;
    try {
        const current = getRegisteredCustomerLocation();
        const merged = { ...current, ...locationObj };
        localStorage.setItem('customerRegisteredLocation', JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('customerLocationChanged', { detail: merged }));
    } catch(e) {}
}

// ============================================
// COMPREHENSIVE FARMERS REGISTRY
// ============================================
const FARMERS_REGISTRY = {
    'farmer-sundaram': {
        farmerId: 'farmer-sundaram',
        farmerName: 'Sundaram Perumal',
        farmerNameTa: 'சுந்தரம் பெருமாள்',
        farmName: 'Green Valley Organic Farm',
        farmNameTa: 'கிரீன் வேலி ஆர்கானிக் பண்ணை',
        village: 'Oddanchatram',
        villageTa: 'ஒட்டன்சத்திரம்',
        district: 'Dindigul',
        districtTa: 'திண்டுக்கல்',
        state: 'Tamil Nadu',
        formattedLocation: 'Oddanchatram, Dindigul, Tamil Nadu',
        formattedLocationTa: 'ஒட்டன்சத்திரம், திண்டுக்கல், தமிழ்நாடு',
        distanceKm: 18,
        farmingType: 'Organic', // Organic, Natural, Regular
        farmingTypeTa: 'இயற்கை விவசாயம் (Organic)',
        farmingMethod: 'Natural Panchagavya & Heirloom Desi Seeds (ZBNF)',
        farmingMethodTa: 'பாரம்பரிய பஞ்சகவ்யம் & நாட்டு விதை இயற்கை முறை',
        about: 'Green Valley Organic Farm spans 12 acres of certified organic land in Oddanchatram, Dindigul. We cultivate heritage crops with zero chemical fertilizers or synthetic pesticides. Nourished exclusively by solar drip irrigation and Jeevamrutham bio-liquid made with indigenous native cows.',
        aboutTa: 'திண்டுக்கல் ஒட்டன்சத்திரத்தில் 12 ஏக்கர் பரப்பளவில் அமைந்துள்ள இயற்கை பண்ணை. 20 ஆண்டுகளுக்கும் மேலாக நாட்டு பசுவின் ஜீவாமிர்தம், பஞ்சகவ்யம் மற்றும் சூரிய மின்சார சொட்டுநீர் பாசனம் கொண்டு 100% பூச்சிக்கொல்லி இல்லாத ஆரோக்கியமான காய்கறிகளை உற்பத்தி செய்கிறோம்.',
        deliveryAvailability: 'Available Daily: Same-Day Cold-Chain Express (within 2-4 hrs) & Morning Slot (7:00 AM - 10:00 AM)',
        deliveryAvailabilityTa: 'தினசரி கிடைக்கும்: இன்றே விரைவு குளிர்சங்கிலி டெலிவரி (2-4 மணி நேரத்தில்) & காலை டெலிவரி (காலை 7:00 - 10:00)',
        estimatedDelivery: 'Same-Day Delivery (2-4 hrs)',
        estimatedDeliveryTa: 'இன்றே டெலிவரி (2-4 மணி நேரம்)',
        deliveryBadge: '⚡ Same-Day Delivery',
        rating: 4.8,
        reviewsCount: 56,
        certifications: ['India Organic', 'Jaivik Bharat', 'Zero Chemical'],
        certificationBadge: 'Jaivik Bharat (TN-ORG-8921)',
        farmerPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        phone: '+91 98401 23456',
        email: 'farmer@farmtofork.com',
        products: [
            {
                productId: 1,
                farmerProductId: 'farmer-sundaram-1',
                name: 'Organic Tomatoes',
                nameTa: 'இயற்கை தக்காளி',
                category: 'vegetables',
                price: 60,
                originalPrice: 80,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 45,
                harvestDate: 'Today 5:30 AM',
                harvestDateTa: 'இன்று காலை 5:30',
                badge: '🌿 100% Organic',
                badgeTa: '🌿 100% இயற்கை',
                image: '/assets/images/products/organic-tomatoes.jpg',
                backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day (2-4 hrs)',
                estimatedDeliveryTa: '⚡ இன்றே டெலிவரி (2-4 மணி)',
                batchCode: 'FTF-TOM-2024-001',
                description: 'Naturally vine-ripened heritage tomatoes. Rich in Vitamin C, potassium, and lycopene.'
            },
            {
                productId: 4,
                farmerProductId: 'farmer-sundaram-4',
                name: 'Organic Broccoli',
                nameTa: 'இயற்கை பிராக்கோலி',
                category: 'vegetables',
                price: 80,
                originalPrice: 100,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 35,
                harvestDate: 'Yesterday 6:00 AM',
                harvestDateTa: 'நேற்று காலை 6:00',
                badge: '🌿 Fresh Harvest',
                badgeTa: '🌿 புதிய அறுவடை',
                image: '/assets/images/products/organic-broccoli.jpg',
                backupImage: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day (2-4 hrs)',
                estimatedDeliveryTa: '⚡ இன்றே டெலிவரி (2-4 மணி)',
                batchCode: 'FTF-BRO-2024-001',
                description: 'Crisp green organic broccoli florets rich in dietary fiber and antioxidants.'
            },
            {
                productId: 6,
                farmerProductId: 'farmer-sundaram-6',
                name: 'Organic Capsicum',
                nameTa: 'குடைமிளகாய்',
                category: 'vegetables',
                price: 65,
                originalPrice: 85,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 40,
                harvestDate: 'Today Morning',
                harvestDateTa: 'இன்று காலை',
                badge: '🌿 Crisp Green',
                badgeTa: '🌿 பசுமையானது',
                image: '/assets/images/products/organic-capsicum.jpg',
                backupImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day (2-4 hrs)',
                estimatedDeliveryTa: '⚡ இன்றே டெலிவரி (2-4 மணி)',
                batchCode: 'FTF-CAP-2024-001',
                description: 'Crunchy bell peppers packed with Vitamin A & C, grown in cool shaded tunnels.'
            },
            {
                productId: 12,
                farmerProductId: 'farmer-sundaram-12',
                name: 'Organic Country Bananas',
                nameTa: 'நாட்டு வாழைப்பழம்',
                category: 'fruits',
                price: 50,
                originalPrice: 65,
                unit: 'dozen',
                unitTa: 'டஜன்',
                stock: 60,
                harvestDate: 'Fresh Tree-Cut',
                harvestDateTa: 'மரத்தில் பழுத்தது',
                badge: '🍌 Naturally Ripened',
                badgeTa: '🍌 கல் வைக்காமல் பழுத்தது',
                image: '/assets/images/products/organic-bananas.jpg',
                backupImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day (2-4 hrs)',
                estimatedDeliveryTa: '⚡ இன்றே டெலிவரி (2-4 மணி)',
                batchCode: 'FTF-BAN-2024-001',
                description: 'Chemical-free country bananas with natural sweetness and high potassium.'
            },
            {
                productId: 24,
                farmerProductId: 'farmer-sundaram-24',
                name: 'Organic A2 Desi Cow Ghee',
                nameTa: 'பாரம்பரிய A2 பசு நெய்',
                category: 'handmade',
                price: 450,
                originalPrice: 600,
                unit: '500ml',
                unitTa: '500 மிலி',
                stock: 25,
                harvestDate: 'Bilona Churned Fresh',
                harvestDateTa: 'மத்து கொண்டு கடையப்பட்டது',
                badge: '🧈 Pure A2 Vedic Bilona',
                badgeTa: '🧈 தூய A2 நாட்டுப்பசு நெய்',
                image: '/assets/images/products/organic-desi-ghee.jpg',
                backupImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day (2-4 hrs)',
                estimatedDeliveryTa: '⚡ இன்றே டெலிவரி (2-4 மணி)',
                batchCode: 'FTF-GHEE-2024-001',
                description: 'Slow-cooked golden ghee prepared with indigenous Kangayam cow curd bilona churning.'
            }
        ]
    },

    'farmer-velmurugan': {
        farmerId: 'farmer-velmurugan',
        farmerName: 'Velmurugan & Selvi K.',
        farmerNameTa: 'வேல்முருகன் & செல்வி',
        farmName: 'Sri Amman Bio-Farms',
        farmNameTa: 'ஸ்ரீ அம்மன் பயோ பண்ணை',
        village: 'Anaimalai',
        villageTa: 'ஆனைமலை',
        district: 'Pollachi',
        districtTa: 'பொள்ளாச்சி',
        state: 'Tamil Nadu',
        formattedLocation: 'Anaimalai, Pollachi, Tamil Nadu',
        formattedLocationTa: 'ஆனைமலை, பொள்ளாச்சி, தமிழ்நாடு',
        distanceKm: 34,
        farmingType: 'Natural', // Organic, Natural, Regular
        farmingTypeTa: 'இயற்கை வழி வேளாண்மை (Natural)',
        farmingMethod: 'Vedic Organic Agriculture & Drip Loam Beds',
        farmingMethodTa: 'வேதகால இயற்கை விவசாயம் & இயற்கை உரம்',
        about: 'Located at the foothills of the Western Ghats in Anaimalai, Pollachi. Blessed with rich red loam soil, sweet mountain water, and farm honeybee colonies for natural pollination. We use organic neem cake, vermicompost, and heirloom seeds.',
        aboutTa: 'பொள்ளாச்சி ஆனைமலை மேற்குத் தொடர்ச்சி மலையடிவாரத்தில் அமைந்துள்ள இயற்கை பண்ணை. செம்மண் வளம், மலைத்தேன் தேனீக்கள் மூலம் மகரந்தச்சேர்க்கை மற்றும் வேப்பம்புண்ணாக்கு கொண்டு இயற்கையான முறையில் பயிர் செய்கிறோம்.',
        deliveryAvailability: 'Available Daily: Next-Day Morning Slot (7:00 AM - 10:00 AM) & Evening Fresh Route',
        deliveryAvailabilityTa: 'தினசரி கிடைக்கும்: அடுத்த நாள் காலை டெலிவரி (காலை 7:00 - 10:00) & மாலை டெலிவரி',
        estimatedDelivery: 'Next-Day Morning (7-10 AM)',
        estimatedDeliveryTa: 'நாளை காலை டெலிவரி (7-10 மணி)',
        deliveryBadge: '🚚 Next-Day Morning Slot',
        rating: 4.9,
        reviewsCount: 78,
        certifications: ['PGS-India Green', 'Zero Pesticide', 'Bee Pollinated'],
        certificationBadge: 'PGS-India Green (TN-CBE-4412)',
        farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
        phone: '+91 98405 67890',
        email: 'velmurugan@farmtofork.com',
        products: [
            {
                productId: 1,
                farmerProductId: 'farmer-velmurugan-1',
                name: 'Organic Tomatoes',
                nameTa: 'இயற்கை தக்காளி',
                category: 'vegetables',
                price: 54,
                originalPrice: 75,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 80,
                harvestDate: 'Today Morning 6:00 AM',
                harvestDateTa: 'இன்று காலை 6:00',
                badge: '🐝 Bee Pollinated',
                badgeTa: '🐝 தேனீ மகரந்தம்',
                image: '/assets/images/products/organic-tomatoes.jpg',
                backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Morning (7-10 AM)',
                estimatedDeliveryTa: '🚚 நாளை காலை டெலிவரி (7-10 மணி)',
                batchCode: 'FTF-TOM-POL-002',
                description: 'Sun-drenched Pollachi country tomatoes, firm and richly juicy with balanced tartness.'
            },
            {
                productId: 2,
                farmerProductId: 'farmer-velmurugan-2',
                name: 'Organic Spinach',
                nameTa: 'இயற்கை பசலைக்கீரை',
                category: 'vegetables',
                price: 40,
                originalPrice: 55,
                unit: 'bunch',
                unitTa: 'கட்டு',
                stock: 8,
                harvestDate: 'Today 5:00 AM',
                harvestDateTa: 'இன்று அதிகாலை 5:00',
                badge: '⚡ Only 8 Left!',
                badgeTa: '⚡ 8 கட்டுகளே உள்ளன!',
                image: '/assets/images/products/organic-spinach.jpg',
                backupImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Morning (7-10 AM)',
                estimatedDeliveryTa: '🚚 நாளை காலை டெலிவரி (7-10 மணி)',
                batchCode: 'FTF-SPN-2024-001',
                description: 'Tender baby spinach hand-harvested and washed in fresh spring water.'
            },
            {
                productId: 17,
                farmerProductId: 'farmer-velmurugan-17',
                name: 'Tender Organic Coconuts',
                nameTa: 'இயற்கை இளநீர்',
                category: 'fruits',
                price: 45,
                originalPrice: 60,
                unit: 'piece',
                unitTa: 'ஒன்று',
                stock: 40,
                harvestDate: 'Plucked Today Dawn',
                harvestDateTa: 'இன்று காலை பறிக்கப்பட்டது',
                badge: '🥥 Pure Mountain Electrolytes',
                badgeTa: '🥥 மலை இளநீர்',
                image: '/assets/images/products/organic-coconut-oil.jpg',
                backupImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Morning (7-10 AM)',
                estimatedDeliveryTa: '🚚 நாளை காலை டெலிவரி (7-10 மணி)',
                batchCode: 'FTF-COC-POL-003',
                description: 'Naturally sweet Pollachi tender coconuts overflowing with refreshing cooling electrolytes.'
            },
            {
                productId: 27,
                farmerProductId: 'farmer-velmurugan-27',
                name: 'Cold Pressed Coconut Oil',
                nameTa: 'மரச்செக்கு தேங்காய் எண்ணெய்',
                category: 'handmade',
                price: 260,
                originalPrice: 320,
                unit: '1L',
                unitTa: '1 லிட்டர்',
                stock: 35,
                harvestDate: 'Wood-Pressed Yesterday',
                harvestDateTa: 'நேற்று மரச்செக்கில் ஆட்டப்பட்டது',
                badge: '🥥 Wood Pressed Pure',
                badgeTa: '🥥 சுத்தமான மரச்செக்கு',
                image: '/assets/images/products/organic-coconut-oil.jpg',
                backupImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Express',
                estimatedDeliveryTa: '🚚 நாளை விரைவு டெலிவரி',
                batchCode: 'FTF-COCO-2024-001',
                description: 'Unrefined, unbleached virgin coconut oil extracted from Pollachi organic coconuts.'
            }
        ]
    },

    'farmer-selvi': {
        farmerId: 'farmer-selvi',
        farmerName: 'Selvi Thangavel',
        farmerNameTa: 'செல்வி தங்கவேல்',
        farmName: 'Nilgiris Bio-Valley',
        farmNameTa: 'நீலகிரி பயோ வேலி',
        village: 'Kotagiri',
        villageTa: 'கோத்தகிரி',
        district: 'Nilgiris',
        districtTa: 'நீலகிரி',
        state: 'Tamil Nadu',
        formattedLocation: 'Kotagiri, Nilgiris, Tamil Nadu',
        formattedLocationTa: 'கோத்தகிரி, நீலகிரி, தமிழ்நாடு',
        distanceKm: 48,
        farmingType: 'Organic', // Organic, Natural, Regular
        farmingTypeTa: 'மலைப்பகுதி இயற்கை விவசாயம் (Organic)',
        farmingMethod: 'High-Altitude Mountain Loam & Rainfed Cultivation',
        farmingMethodTa: 'மலைப்பகுதி இயற்கை உரம் & தூய மழைநீர் பாசனம்',
        about: 'Located at 1800m altitude in Kotagiri, Nilgiris. The cool mountain mist and volcanic humus-rich soil create produce with dense pulp, low acidity, and natural sweetness without any artificial sprays.',
        aboutTa: 'நீலகிரி கோத்தகிரியில் 1800 மீட்டர் உயரத்தில் அமைந்துள்ள பண்ணை. மலைப்பகுதி பனிமூட்டம், இயற்கையான மலைமண் மற்றும் ஊற்றுநீர் கொண்டு நஞ்சில்லா காய்கறிகளை விளைவிக்கிறோம்.',
        deliveryAvailability: 'Available: Temperature-Controlled Cold Van (Mon, Wed, Fri, Sat)',
        deliveryAvailabilityTa: 'குளிர்சங்கிலி வாகனம் மூலம் திங்கள், புதன், வெள்ளி, சனி டெலிவரி செய்யப்படுகிறது',
        estimatedDelivery: 'Cold-Chain Van (Within 24 hrs)',
        estimatedDeliveryTa: 'குளிர்சங்கிலி வேன் (24 மணி நேரத்தில்)',
        deliveryBadge: '❄️ Cold-Chain Fresh',
        rating: 4.7,
        reviewsCount: 32,
        certifications: ['India Organic', 'NPOP Certified', 'Mountain Fresh'],
        certificationBadge: 'NPOP India (NIL-ORG-1029)',
        farmerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=800',
        phone: '+91 98403 98765',
        email: 'selvi@farmtofork.com',
        products: [
            {
                productId: 1,
                farmerProductId: 'farmer-selvi-1',
                name: 'Organic Tomatoes',
                nameTa: 'இயற்கை தக்காளி (மலைப்பயிர்)',
                category: 'vegetables',
                price: 68,
                originalPrice: 85,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 25,
                harvestDate: 'Yesterday Afternoon',
                harvestDateTa: 'நேற்று மதியம்',
                badge: '🏔️ Mountain Fresh',
                badgeTa: '🏔️ மலைப்பயிர்',
                image: '/assets/images/products/organic-tomatoes.jpg',
                backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
                estimatedDelivery: '❄️ Cold-Chain (24 hrs)',
                estimatedDeliveryTa: '❄️ குளிர்சங்கிலி (24 மணி)',
                batchCode: 'FTF-TOM-NIL-003',
                description: 'High-altitude Kotagiri mountain tomatoes, rich in pulp and slow-grown in cool mountain weather.'
            },
            {
                productId: 16,
                farmerProductId: 'farmer-selvi-16',
                name: 'Organic Strawberries',
                nameTa: 'இயற்கை ஸ்ட்ராபெர்ரி',
                category: 'fruits',
                price: 180,
                originalPrice: 240,
                unit: 'box',
                unitTa: 'பாக்ஸ்',
                stock: 18,
                harvestDate: 'Yesterday Evening',
                harvestDateTa: 'நேற்று மாலை',
                badge: '🍓 Mountain Sweet',
                badgeTa: '🍓 மலை இனிப்பு',
                image: '/assets/images/products/organic-strawberries.jpg',
                backupImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80',
                estimatedDelivery: '❄️ Cold-Chain (24 hrs)',
                estimatedDeliveryTa: '❄️ குளிர்சங்கிலி (24 மணி)',
                batchCode: 'FTF-STR-2024-001',
                description: 'Freshly handpicked sweet mountain strawberries packed gently in breathable punnets.'
            },
            {
                productId: 28,
                farmerProductId: 'farmer-selvi-28',
                name: 'Nilgiris Herbal Green Tea',
                nameTa: 'நீலகிரி மூலிகை கிரீன் டீ',
                category: 'handmade',
                price: 180,
                originalPrice: 220,
                unit: '250g',
                unitTa: '250 கிராம்',
                stock: 40,
                harvestDate: 'Fresh Hand-Plucked Flush',
                harvestDateTa: 'புதிய கைக்கொய்த கொழுந்து',
                badge: '🍵 High Grown Whole Leaf',
                badgeTa: '🍵 உயர்தர தேயிலை',
                image: '/assets/images/products/organic-herbal-tea.jpg',
                backupImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
                estimatedDelivery: '🚚 Express Courier',
                estimatedDeliveryTa: '🚚 விரைவு கூரியர்',
                batchCode: 'FTF-TEA-2024-001',
                description: 'Single-estate loose leaf orthodox green tea rich in catechins and polyphenols.'
            },
            {
                productId: 8,
                farmerProductId: 'farmer-selvi-8',
                name: 'Organic Mountain Potatoes',
                nameTa: 'ஊட்டி மலை உருளைக்கிழங்கு',
                category: 'vegetables',
                price: 45,
                originalPrice: 60,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 45,
                harvestDate: 'Harvested Yesterday',
                harvestDateTa: 'நேற்று அறுவடை',
                badge: '🥔 Mountain Loam Grown',
                badgeTa: '🥔 மலை உருளை',
                image: '/assets/images/products/organic-potatoes.jpg',
                backupImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
                estimatedDelivery: '❄️ Cold-Chain (24 hrs)',
                estimatedDeliveryTa: '❄️ குளிர்சங்கிலி (24 மணி)',
                batchCode: 'FTF-POT-NIL-002',
                description: 'Firm and flavorful high-altitude Nilgiris golden potatoes grown in rich volcanic mist beds.'
            }
        ]
    },

    'farmer-muthusamy': {
        farmerId: 'farmer-muthusamy',
        farmerName: 'Muthusamy R.',
        farmerNameTa: 'முத்துசாமி ஆர்.',
        farmName: 'Kaveri Delta Natural Farm',
        farmNameTa: 'காவிரி டெல்டா இயற்கை பண்ணை',
        village: 'Thiruvaiyaru',
        villageTa: 'திருவையாறு',
        district: 'Thanjavur',
        districtTa: 'தஞ்சாவூர்',
        state: 'Tamil Nadu',
        formattedLocation: 'Thiruvaiyaru, Thanjavur, Tamil Nadu',
        formattedLocationTa: 'திருவையாறு, தஞ்சாவூர், தமிழ்நாடு',
        distanceKm: 65,
        farmingType: 'Natural', // Organic, Natural, Regular
        farmingTypeTa: 'இயற்கை வழி வேளாண்மை (ZBNF)',
        farmingMethod: 'Subhash Palekar Zero Budget Natural Farming (ZBNF)',
        farmingMethodTa: 'சுபாஷ் பாலேக்கர் பூஜ்ஜிய பட்ஜெட் இயற்கை விவசாயம்',
        about: 'Located on the fertile alluvial river silt of the sacred Kaveri in Thiruvaiyaru. Cultivating heritage crops with native cow dung, fermented jaggery, and pulse flour bio-sprays.',
        aboutTa: 'தஞ்சாவூர் திருவையாற்றில் காவிரி ஆற்றின் வளமான வண்டல் மண்ணில் அமைந்த பாரம்பரிய பண்ணை. நாட்டு மாட்டு சாணம், வெல்லம் கொண்டு ஜீவாமிர்தம் தயாரித்து நஞ்சில்லா உணவை அளிக்கிறோம்.',
        deliveryAvailability: 'Available: Direct Farm Gate Green Transit (Next-Day Morning Delivery)',
        deliveryAvailabilityTa: 'பண்ணையிலிருந்து நேரடியாக அடுத்த நாள் காலை டெலிவரி',
        estimatedDelivery: 'Next-Day Delivery',
        estimatedDeliveryTa: 'நாளை டெலிவரி',
        deliveryBadge: '🌱 Direct Farm Gate',
        rating: 4.6,
        reviewsCount: 22,
        certifications: ['Jaivik Bharat', 'ZBNF Certified', 'Riverbed Silt'],
        certificationBadge: 'Jaivik Bharat (TN-TNJ-5519)',
        farmerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800',
        phone: '+91 98408 11223',
        email: 'muthusamy@farmtofork.com',
        products: [
            {
                productId: 1,
                farmerProductId: 'farmer-muthusamy-1',
                name: 'Organic Tomatoes',
                nameTa: 'இயற்கை தக்காளி (டெல்டா)',
                category: 'vegetables',
                price: 50,
                originalPrice: 70,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 120,
                harvestDate: 'Today Dawn 5:00 AM',
                harvestDateTa: 'இன்று அதிகாலை 5:00',
                badge: '💰 Best Value Price',
                badgeTa: '💰 சிறந்த விலை',
                image: '/assets/images/products/organic-tomatoes.jpg',
                backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Morning',
                estimatedDeliveryTa: '🚚 நாளை காலை டெலிவரி',
                batchCode: 'FTF-TOM-TNJ-004',
                description: 'Riverbed alluvial soil organic tomatoes with great taste and maximum affordability.'
            },
            {
                productId: 26,
                farmerProductId: 'farmer-muthusamy-26',
                name: 'Organic Traditional Jaggery',
                nameTa: 'பாரம்பரிய நாட்டு வெல்லம்',
                category: 'handmade',
                price: 90,
                originalPrice: 120,
                unit: '1kg',
                unitTa: '1 கிலோ',
                stock: 75,
                harvestDate: 'Freshly Boiled & Set',
                harvestDateTa: 'புதிதாக காய்ச்சப்பட்டது',
                badge: '🌿 Chemical Free Sweetener',
                badgeTa: '🌿 சுத்தமான நாட்டு வெல்லம்',
                image: '/assets/images/products/organic-jaggery.jpg',
                backupImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
                estimatedDelivery: '🚚 Standard Transit',
                estimatedDeliveryTa: '🚚 வழக்கமான டெலிவரி',
                batchCode: 'FTF-JAG-2024-001',
                description: 'Made from heirloom sugarcane juice boiled in traditional iron pans with zero sodium hydrosulfite chemical bleaches.'
            },
            {
                productId: 17,
                farmerProductId: 'farmer-muthusamy-17',
                name: 'Organic Watermelon',
                nameTa: 'இயற்கை தர்பூசணி',
                category: 'fruits',
                price: 35,
                originalPrice: 50,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 50,
                harvestDate: 'Harvested Yesterday',
                harvestDateTa: 'நேற்று அறுவடை',
                badge: '🍉 Sweet & Crisp',
                badgeTa: '🍉 இனிப்பானது',
                image: '/assets/images/products/organic-watermelon.jpg',
                backupImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Morning',
                estimatedDeliveryTa: '🚚 நாளை காலை',
                batchCode: 'FTF-WAT-2024-001',
                description: 'Refreshing riverbed organic watermelons with deep red, juicy, naturally sweet flesh.'
            }
        ]
    },

    'farmer-anand': {
        farmerId: 'farmer-anand',
        farmerName: 'Anand & Devi Mountain Collective',
        farmerNameTa: 'ஆனந்த் & தேவி கூட்டுப் பண்ணை',
        farmName: 'Root Farm',
        farmNameTa: 'ரூட் பார்ம்',
        village: 'Ketti Valley',
        villageTa: 'கெட்டி பள்ளத்தாக்கு',
        district: 'Ooty (Nilgiris)',
        districtTa: 'ஊட்டி (நீலகிரி)',
        state: 'Tamil Nadu',
        formattedLocation: 'Ketti Valley, Ooty, Tamil Nadu',
        formattedLocationTa: 'கெட்டி பள்ளத்தாக்கு, ஊட்டி, தமிழ்நாடு',
        distanceKm: 52,
        farmingType: 'Organic',
        farmingTypeTa: 'இயற்கை விவசாயம் (Organic)',
        farmingMethod: 'Volcanic Terrace Loam & Natural Mountain Compost',
        farmingMethodTa: 'மலை மாடித்தோட்ட இயற்கை உரம்',
        about: 'Perched in the misty Ketti Valley near Ooty. We specialize in cold-climate root vegetables nurtured with volcanic soil and organic bio-compost.',
        aboutTa: 'ஊட்டி கெட்டி பள்ளத்தாக்கில் உள்ள இயற்கை பண்ணை. குளிர் காலநிலையில் இனிப்பான மலை கேரட் மற்றும் கிழங்கு வகைகளை ரசாயனமின்றி பயிர் செய்கிறோம்.',
        deliveryAvailability: 'Available: Next-Day Express Cold Van',
        deliveryAvailabilityTa: 'அடுத்த நாள் விரைவு குளிர்சங்கிலி வேன் மூலம் டெலிவரி',
        estimatedDelivery: 'Next-Day Express',
        estimatedDeliveryTa: 'நாளை விரைவு டெலிவரி',
        deliveryBadge: '🚚 Next-Day Delivery',
        rating: 4.8,
        reviewsCount: 49,
        certifications: ['India Organic', 'Nilgiris Fresh'],
        certificationBadge: 'India Organic (NIL-ORG-3321)',
        farmerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=800',
        phone: '+91 98409 55667',
        email: 'anand@farmtofork.com',
        products: [
            {
                productId: 3,
                farmerProductId: 'farmer-anand-3',
                name: 'Organic Carrots',
                nameTa: 'ஊட்டி இயற்கை கேரட்',
                category: 'vegetables',
                price: 50,
                originalPrice: 65,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 50,
                harvestDate: 'Yesterday 8:00 AM',
                harvestDateTa: 'நேற்று காலை 8:00',
                badge: '🥕 Ooty Mountain Sweet',
                badgeTa: '🥕 ஊட்டி மலை இனிப்பு',
                image: '/assets/images/products/organic-carrots.jpg',
                backupImage: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Delivery',
                estimatedDeliveryTa: '🚚 நாளை டெலிவரி',
                batchCode: 'FTF-CAR-2024-001',
                description: 'Crunchy mountain carrots grown in the cool climate of Nilgiris with natural compost.'
            },
            {
                productId: 8,
                farmerProductId: 'farmer-anand-8',
                name: 'Organic Baby Potatoes',
                nameTa: 'இயற்கை உருளைக்கிழங்கு',
                category: 'vegetables',
                price: 40,
                originalPrice: 55,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 80,
                harvestDate: '2 days ago',
                harvestDateTa: '2 நாட்களுக்கு முன்',
                badge: '🥔 Mountain Grown',
                badgeTa: '🥔 மலை உருளை',
                image: '/assets/images/products/organic-potatoes.jpg',
                backupImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Delivery',
                estimatedDeliveryTa: '🚚 நாளை டெலிவரி',
                batchCode: 'FTF-POT-2024-001',
                description: 'Firm, golden mountain potatoes with high mineral density and natural flavor.'
            },
            {
                productId: 11,
                farmerProductId: 'farmer-anand-11',
                name: 'Organic Mountain Apples',
                nameTa: 'ஊட்டி மலை ஆப்பிள்',
                category: 'fruits',
                price: 130,
                originalPrice: 160,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 30,
                harvestDate: '2 days ago',
                harvestDateTa: '2 நாட்களுக்கு முன்',
                badge: '🍎 Zero Wax Coated',
                badgeTa: '🍎 மெழுகு பூச்சற்றது',
                image: '/assets/images/products/organic-apples.jpg',
                backupImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Express',
                estimatedDeliveryTa: '🚚 நாளை விரைவு டெலிவரி',
                batchCode: 'FTF-APP-NIL-001',
                description: 'Crisp, sweet, pesticide-free hillside apples picked at peak maturity.'
            },
            {
                productId: 19,
                farmerProductId: 'farmer-anand-19',
                name: 'Raw Eucalyptus Forest Honey',
                nameTa: 'நீலகிரி தைல மரத் தேன்',
                category: 'handmade',
                price: 290,
                originalPrice: 380,
                unit: '500g jar',
                unitTa: '500g பாட்டில்',
                stock: 20,
                harvestDate: 'Ethically Extracted',
                harvestDateTa: 'இயற்கை தேன்',
                badge: '🍯 Wild Floral Aroma',
                badgeTa: '🍯 மலைத் தேன்',
                image: '/assets/images/products/organic-honey.jpg',
                backupImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
                estimatedDelivery: '🚚 Next-Day Express',
                estimatedDeliveryTa: '🚚 நாளை விரைவு டெலிவரி',
                batchCode: 'FTF-HON-NIL-002',
                description: 'Unheated, raw forest apiary honey collected from flowering Nilgiris eucalyptus groves.'
            }
        ]
    },

    'farmer-karthik': {
        farmerId: 'farmer-karthik',
        farmerName: 'Karthikeyan S.',
        farmerNameTa: 'கார்த்திகேயன் எஸ்.',
        farmName: 'Palani Foothills Bio-Agro',
        farmNameTa: 'பழனி அடிவாரம் பயோ அக்ரோ',
        village: 'Reddiarchatram',
        villageTa: 'ரெட்டியார்சத்திரம்',
        district: 'Dindigul',
        districtTa: 'திண்டுக்கல்',
        state: 'Tamil Nadu',
        formattedLocation: 'Reddiarchatram, Dindigul, Tamil Nadu',
        formattedLocationTa: 'ரெட்டியார்சத்திரம், திண்டுக்கல், தமிழ்நாடு',
        distanceKm: 26,
        farmingType: 'Natural',
        farmingTypeTa: 'இயற்கை வழி வேளாண்மை (Natural)',
        farmingMethod: 'Natural Mulching & Bio-Compost Soil',
        farmingMethodTa: 'இயற்கை மூடாக்கு & மண்புழு உரம்',
        about: 'Situated at the Palani hills buffer zone. We practice water-efficient drip farming with natural sugarcane bagasse mulching.',
        aboutTa: 'பழனி மலைச்சாரலில் சொட்டுநீர் மற்றும் கரும்பு சக்கை மூடாக்கு கொண்டு இயற்கை முறையில் காய்கறிகளை சாகுபடி செய்கிறோம்.',
        deliveryAvailability: 'Available: Same-Day Evening Route',
        deliveryAvailabilityTa: 'இன்றே மாலைக்குள் டெலிவரி செய்யப்படுகிறது',
        estimatedDelivery: 'Same-Day Evening',
        estimatedDeliveryTa: 'இன்றே மாலை டெலிவரி',
        deliveryBadge: '⚡ Same-Day Delivery',
        rating: 4.6,
        reviewsCount: 28,
        certifications: ['Jaivik Bharat', 'Zero Pesticide'],
        certificationBadge: 'Jaivik Bharat (TN-DGL-8812)',
        farmerPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=800',
        phone: '+91 98404 77889',
        email: 'karthik@farmtofork.com',
        products: [
            {
                productId: 3,
                farmerProductId: 'farmer-karthik-3',
                name: 'Organic Carrots',
                nameTa: 'இயற்கை கேரட் (திண்டுக்கல்)',
                category: 'vegetables',
                price: 45,
                originalPrice: 60,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 90,
                harvestDate: 'Today Morning',
                harvestDateTa: 'இன்று காலை',
                badge: '🥕 Direct Farm Harvest',
                badgeTa: '🥕 நேரடி அறுவடை',
                image: '/assets/images/products/organic-carrots.jpg',
                backupImage: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day Evening',
                estimatedDeliveryTa: '⚡ இன்றே மாலை',
                batchCode: 'FTF-CAR-DGL-002',
                description: 'Tender baby carrots grown with organic compost soil enrichers.'
            },
            {
                productId: 7,
                farmerProductId: 'farmer-karthik-7',
                name: 'Organic Country Onions (Shallots)',
                nameTa: 'நாட்டு சின்ன வெங்காயம்',
                category: 'vegetables',
                price: 55,
                originalPrice: 75,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 110,
                harvestDate: 'Sun-Cured 2 days ago',
                harvestDateTa: '2 நாட்களுக்கு முன் உலர்த்தப்பட்டது',
                badge: '🧅 Pungent & Pure',
                badgeTa: '🧅 நாட்டு சின்ன வெங்காயம்',
                image: '/assets/images/products/organic-onions.jpg',
                backupImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day Evening',
                estimatedDeliveryTa: '⚡ இன்றே மாலை',
                batchCode: 'FTF-ONI-2024-001',
                description: 'Authentic Dindigul small country shallots with intense aroma and immunity-boosting quercetin.'
            },
            {
                productId: 18,
                farmerProductId: 'farmer-karthik-18',
                name: 'Organic Country Pomegranate',
                nameTa: 'இயற்கை மாதுளை',
                category: 'fruits',
                price: 140,
                originalPrice: 180,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 35,
                harvestDate: 'Fresh Tree-Plucked',
                harvestDateTa: 'மரத்திலிருந்து பறிக்கப்பட்டது',
                badge: '🔴 Ruby Seeds Antioxidant',
                badgeTa: '🔴 இயற்கை மாதுளை',
                image: '/assets/images/products/organic-pomegranate.jpg',
                backupImage: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day Evening',
                estimatedDeliveryTa: '⚡ இன்றே மாலை',
                batchCode: 'FTF-POM-DGL-001',
                description: 'Sun-drenched Palani foothills sweet red pomegranates rich in polyphenols.'
            },
            {
                productId: 27,
                farmerProductId: 'farmer-karthik-27',
                name: 'Cold Pressed Sesame (Gingelly) Oil',
                nameTa: 'நாட்டு மரச்செக்கு நல்லெண்ணெய்',
                category: 'handmade',
                price: 240,
                originalPrice: 310,
                unit: '1L',
                unitTa: '1 லிட்டர்',
                stock: 45,
                harvestDate: 'Wood-Pressed with Palm Jaggery',
                harvestDateTa: 'பனைவெல்லம் சேர்த்து ஆட்டப்பட்டது',
                badge: '🌿 Traditional Vaagai Chekku',
                badgeTa: '🌿 பாரம்பரிய மரச்செக்கு',
                image: '/assets/images/products/organic-sesame-oil.jpg',
                backupImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
                estimatedDelivery: '⚡ Same-Day Evening',
                estimatedDeliveryTa: '⚡ இன்றே மாலை',
                batchCode: 'FTF-SES-DGL-001',
                description: 'Authentic stone-mill cold-pressed black sesame oil blended with pure palm jaggery.'
            }
        ]
    },

    'farmer-arun': {
        farmerId: 'farmer-arun',
        farmerName: 'Arunmozhi Varman',
        farmerNameTa: 'அருண்மொழி வர்மன்',
        farmName: 'Palar Riverbed Greenery',
        farmNameTa: 'பாலாறு இயற்கை கீரை பண்ணை',
        village: 'Walajapet',
        villageTa: 'வாலாஜாபேட்டை',
        district: 'Ranipet',
        districtTa: 'ராணிப்பேட்டை',
        state: 'Tamil Nadu',
        formattedLocation: 'Walajapet, Ranipet, Tamil Nadu',
        formattedLocationTa: 'வாலாஜாபேட்டை, ராணிப்பேட்டை, தமிழ்நாடு',
        distanceKm: 22,
        farmingType: 'Natural',
        farmingTypeTa: 'இயற்கை வழி முறை (Natural)',
        farmingMethod: 'Natural Vermicompost & River Silt Horticultural Beds',
        farmingMethodTa: 'மண்புழு உரம் & ஆற்றுப்படுகை விவசாயம்',
        about: 'Located on virgin alluvial soil along Palar river basin. We specialize in indigenous leafy greens, herbs, and gourds with pure spring water rinsing.',
        aboutTa: 'பாலாற்று படுகையில் அமைந்துள்ள இயற்கை கீரை பண்ணை. மண்புழு உரம் கொண்டு ஊட்டச்சத்துக்கள் நிறைந்த நாட்டு கீரைகளை விளைவிக்கிறோம்.',
        deliveryAvailability: 'Available: Same-Day Morning Route (Deliveries by 8:30 AM)',
        deliveryAvailabilityTa: 'காலை 8:30 மணிக்குள் விரைவு டெலிவரி',
        estimatedDelivery: 'Same-Day Early Morning',
        estimatedDeliveryTa: 'இன்றே அதிகாலை டெலிவரி',
        deliveryBadge: '⚡ Early Morning Fresh',
        rating: 4.7,
        reviewsCount: 31,
        certifications: ['Jaivik Bharat', 'Local PGS Certified'],
        certificationBadge: 'Jaivik Bharat (TN-RPT-2091)',
        farmerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
        phone: '+91 98407 33445',
        email: 'arun@farmtofork.com',
        products: [
            {
                productId: 2,
                farmerProductId: 'farmer-arun-2',
                name: 'Organic Spinach',
                nameTa: 'இயற்கை பசலைக்கீரை',
                category: 'vegetables',
                price: 35,
                originalPrice: 50,
                unit: 'bunch',
                unitTa: 'கட்டு',
                stock: 60,
                harvestDate: 'Today 6:15 AM',
                harvestDateTa: 'இன்று காலை 6:15',
                badge: '🥬 Farm Gate Value',
                badgeTa: '🥬 புதிய கீரை',
                image: '/assets/images/products/organic-spinach.jpg',
                backupImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
                estimatedDelivery: '⚡ Early Morning (2-3 hrs)',
                estimatedDeliveryTa: '⚡ காலையிலேயே (2-3 மணி)',
                batchCode: 'FTF-SPN-RPT-002',
                description: 'Dense iron-rich indigenous spinach grown on virgin organic riverbed plots.'
            },
            {
                productId: 17,
                farmerProductId: 'farmer-arun-17',
                name: 'Riverbed Organic Watermelon',
                nameTa: 'பாலாறு இயற்கை தர்பூசணி',
                category: 'fruits',
                price: 32,
                originalPrice: 48,
                unit: 'kg',
                unitTa: 'கிலோ',
                stock: 45,
                harvestDate: 'Today Dawn 5:30 AM',
                harvestDateTa: 'இன்று விடியற்காலை',
                badge: '🍉 Crisp Alluvial Grown',
                badgeTa: '🍉 ஆற்றுப்படுகை தர்பூசணி',
                image: '/assets/images/products/organic-watermelon.jpg',
                backupImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
                estimatedDelivery: '⚡ Early Morning (2-3 hrs)',
                estimatedDeliveryTa: '⚡ காலையிலேயே (2-3 மணி)',
                batchCode: 'FTF-WAT-RPT-001',
                description: 'Naturally hydrating sugar-baby watermelon cultivated on pure river sands.'
            },
            {
                productId: 28,
                farmerProductId: 'farmer-arun-28',
                name: 'Pure Moringa Leaf Herbal Powder',
                nameTa: 'இயற்கை முருங்கை இலை பொடி',
                category: 'handmade',
                price: 110,
                originalPrice: 150,
                unit: '200g',
                unitTa: '200 கிராம்',
                stock: 50,
                harvestDate: 'Shade Dried',
                harvestDateTa: 'நிழலில் உலர்த்தப்பட்டது',
                badge: '🌿 Superfood Multi-Vitamin',
                badgeTa: '🌿 மூலிகை சத்துப்பொடி',
                image: '/assets/images/products/organic-moringa.jpg',
                backupImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
                estimatedDelivery: '⚡ Early Morning (2-3 hrs)',
                estimatedDeliveryTa: '⚡ காலையிலேயே (2-3 மணி)',
                batchCode: 'FTF-MOR-RPT-001',
                description: 'Hand-sorted native moringa leaves dried under shade to preserve raw chlorophyll and minerals.'
            }
        ]
    },

    'artisan-kavitha': {
        farmerId: 'artisan-kavitha',
        farmerName: 'Kavitha Natarajan',
        farmerNameTa: 'கவிதா நடராஜன்',
        farmName: "Nature's Touch Artisans",
        farmNameTa: 'நேச்சர்ஸ் டச் கைவினைப் பொருட்கள்',
        village: 'Jamunamarathur',
        villageTa: 'ஜமுனாமரத்தூர்',
        district: 'Jawadhu Hills',
        districtTa: 'ஜவ்வாது மலை',
        state: 'Tamil Nadu',
        formattedLocation: 'Jawadhu Hills, Tiruvannamalai, Tamil Nadu',
        formattedLocationTa: 'ஜவ்வாது மலை, திருவண்ணாமலை, தமிழ்நாடு',
        distanceKm: 42,
        farmingType: 'Organic',
        farmingTypeTa: 'இயற்கை மற்றும் மூலிகை கைவினை (Organic)',
        farmingMethod: 'Sustainable Tribal Forest Foraging (Ethical Apiculture)',
        farmingMethodTa: 'பழங்குடியின காட்டுத் தேன் & இயற்கை மூலிகை தயாரிப்பு',
        about: 'Working with 45 indigenous tribal families across the misty Jawadhu Hills. We harvest raw wildflower honey and handcraft cold-process soaps from virgin wood-pressed oils and forest herbs.',
        aboutTa: 'ஜவ்வாது மலைவாழ் பழங்குடியின மக்களுடன் இணைந்து அடர்ந்த காடுகளில் மருத்துவ குணம் கொண்ட காட்டுத் தேனை சேகரிக்கிறோம். மரச்செக்கு எண்ணெய் கொண்டு ரசாயனமில்லா மூலிகை சோப்புகளையும் தயாரிக்கிறோம்.',
        deliveryAvailability: 'Available: Eco Bubble-Padded Glass Courier Dispatch Daily',
        deliveryAvailabilityTa: 'பாதுகாப்பான கண்ணாடி குப்பியில் விரைவு கூரியர் மூலம் டெலிவரி',
        estimatedDelivery: 'Eco-Pack Express (24-48 hrs)',
        estimatedDeliveryTa: 'சுற்றுச்சூழல் பேக்கிங் விரைவு டெலிவரி',
        deliveryBadge: '📦 Eco-Pack Express',
        rating: 4.9,
        reviewsCount: 64,
        certifications: ['FSSAI Jaivik Bharat', 'Wild Foraged Certified', 'Cruelty Free'],
        certificationBadge: 'Jaivik Bharat (FSSAI-124230)',
        farmerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800',
        phone: '+91 98402 34567',
        email: 'artisan@farmtofork.com',
        products: [
            {
                productId: 19,
                farmerProductId: 'artisan-kavitha-19',
                name: 'Raw Forest Honey',
                nameTa: 'இயற்கை காட்டுத் தேன்',
                category: 'handmade',
                price: 320,
                originalPrice: 400,
                unit: '500g jar',
                unitTa: '500g பாட்டில்',
                stock: 14,
                harvestDate: '3 days ago',
                harvestDateTa: '3 நாட்களுக்கு முன்',
                badge: '🍯 Wild Tribal Foraged',
                badgeTa: '🍯 காட்டுத் தேன்',
                image: '/assets/images/products/organic-honey.jpg',
                backupImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
                estimatedDelivery: '📦 Eco-Pack Express',
                estimatedDeliveryTa: '📦 விரைவு கூரியர்',
                batchCode: 'FTF-HON-2024-001',
                description: 'Multi-floral raw honey collected by indigenous forest guardians. Unprocessed and rich in active pollen.'
            },
            {
                productId: 21,
                farmerProductId: 'artisan-kavitha-21',
                name: 'Handcrafted Neem & Tulsi Soap',
                nameTa: 'வேம்பு & துளசி மூலிகை சோப்',
                category: 'handmade',
                price: 150,
                originalPrice: 200,
                unit: 'piece',
                unitTa: 'துண்டு',
                stock: 50,
                harvestDate: 'Cold Processed Batch',
                harvestDateTa: 'குளிர் முறையில் தயாரிக்கப்பட்டது',
                badge: '🧼 0% Sulphates & Parabens',
                badgeTa: '🧼 ரசாயனமற்றது',
                image: '/assets/images/products/organic-handmade-soap.jpg',
                backupImage: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&q=80',
                estimatedDelivery: '📦 Eco-Pack Express',
                estimatedDeliveryTa: '📦 விரைவு கூரியர்',
                batchCode: 'FTF-SOAP-2024-001',
                description: 'Cold-pressed virgin coconut oil, neem leaf extracts, and essential oils. 100% biodegradable.'
            }
        ]
    },

    'artisan-murugan': {
        farmerId: 'artisan-murugan',
        farmerName: 'Murugan T.',
        farmerNameTa: 'முருகன் டி.',
        farmName: 'Kolli Hills Honey Collective',
        farmNameTa: 'கொல்லிமலை தேன் உற்பத்தியாளர் குழு',
        village: 'Semmedu',
        villageTa: 'செம்மேடு',
        district: 'Namakkal',
        districtTa: 'நாமக்கல்',
        state: 'Tamil Nadu',
        formattedLocation: 'Kolli Hills, Namakkal, Tamil Nadu',
        formattedLocationTa: 'கொல்லிமலை, நாமக்கல், தமிழ்நாடு',
        distanceKm: 58,
        farmingType: 'Natural',
        farmingTypeTa: 'இயற்கை காட்டுத் தேன் (Natural)',
        farmingMethod: 'Medicinal Flora Wild Hive Harvest',
        farmingMethodTa: 'மூலிகை காடுகளில் இயற்கையாக சேகரிக்கப்பட்டது',
        about: 'Harvested from medicinal plants across the 70 hairpin bends of the misty Kolli Hills. High in medicinal enzymes and unprocessed bio-active propolis.',
        aboutTa: '70 கொண்டை ஊசி வளைவுகள் கொண்ட கொல்லிமலையின் அபூர்வ மூலிகைகளில் இருந்து தேனீக்களால் சேகரிக்கப்பட்ட சுத்தமான மலைத்தேன்.',
        deliveryAvailability: 'Available: Standard Eco Courier Dispatch',
        deliveryAvailabilityTa: 'பாதுகாப்பான கூரியர் டெலிவரி வசதி',
        estimatedDelivery: 'Standard Courier (2-3 days)',
        estimatedDeliveryTa: 'கூரியர் (2-3 நாட்கள்)',
        deliveryBadge: '🚚 Courier Delivery',
        rating: 4.8,
        reviewsCount: 39,
        certifications: ['India Organic', 'Wild Forest Certified'],
        certificationBadge: 'India Organic (TN-NMK-7719)',
        farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        farmPhoto: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800',
        phone: '+91 98406 22334',
        email: 'murugan@farmtofork.com',
        products: [
            {
                productId: 19,
                farmerProductId: 'artisan-murugan-19',
                name: 'Raw Forest Honey',
                nameTa: 'கொல்லிமலை காட்டுத் தேன்',
                category: 'handmade',
                price: 295,
                originalPrice: 380,
                unit: '500g jar',
                unitTa: '500g பாட்டில்',
                stock: 22,
                harvestDate: 'Last week',
                harvestDateTa: 'கடந்த வாரம்',
                badge: '🍯 Medicinal Flora Honey',
                badgeTa: '🍯 மூலிகை மலைத்தேன்',
                image: '/assets/images/products/organic-honey.jpg',
                backupImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
                estimatedDelivery: '🚚 2-3 Days Courier',
                estimatedDeliveryTa: '🚚 2-3 நாட்கள் கூரியர்',
                batchCode: 'FTF-HON-KOL-002',
                description: 'Medicinal flora wild honey collected ethically from cliffs and wild trees in Kolli Hills.'
            }
        ]
    }
};

// ============================================
// MULTI-FARMER CATALOG (BY PRODUCT ID)
// ============================================
// Builds on top of FARMERS_REGISTRY so product cards get full details
const MULTI_FARMER_CATALOG = {
    // 1. ORGANIC TOMATOES (4 Farmers)
    1: [
        {
            farmerId: 'farmer-sundaram',
            productId: 1,
            productName: 'Organic Tomatoes',
            productNameTa: 'இயற்கை தக்காளி',
            category: 'vegetables',
            farmerName: 'Sundaram Perumal',
            farmerNameTa: 'சுந்தரம் பெருமாள்',
            farmName: 'Green Valley Organic Farm',
            farmNameTa: 'கிரீன் வேலி ஆர்கானிக் பண்ணை',
            village: 'Oddanchatram',
            villageTa: 'ஒட்டன்சத்திரம்',
            district: 'Dindigul',
            districtTa: 'திண்டுக்கல்',
            formattedLocation: 'Oddanchatram, Dindigul, Tamil Nadu',
            formattedLocationTa: 'ஒட்டன்சத்திரம், திண்டுக்கல், தமிழ்நாடு',
            distanceKm: 18,
            price: 60,
            originalPrice: 80,
            unit: 'kg',
            unitTa: 'கிலோ',
            stock: 45,
            harvestDate: 'Today 5:30 AM',
            harvestDateTa: 'இன்று காலை 5:30',
            badge: '🌿 100% Organic',
            badgeTa: '🌿 100% இயற்கை',
            organicBadge: '🌿 100% Organic',
            estimatedDelivery: '⚡ Same-Day Delivery (2-4 hrs)',
            estimatedDeliveryTa: '⚡ இன்றே டெலிவரி (2-4 மணி)',
            deliveryBadge: '⚡ Same-Day Delivery',
            deliveryOption: 'Same-Day Cold Chain Dispatch (4°C)',
            farmingType: 'Organic',
            farmingTypeTa: 'இயற்கை விவசாயம்',
            farmingMethod: 'Natural Panchagavya & Heirloom Desi Seeds (ZBNF)',
            productImage: '/assets/images/products/organic-tomatoes.jpg',
            backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600',
            rating: 4.8,
            reviewsCount: 56,
            certifications: ['India Organic', 'Jaivik Bharat', 'Zero Chemical'],
            certificationBadge: 'Jaivik Bharat (TN-ORG-8921)',
            batchCode: 'FTF-TOM-2024-001',
            story: 'Cultivating 12 acres of heirloom heritage tomatoes with zero chemicals. Fed purely with solar drip irrigation and Jeevamrutham bio-liquid.'
        },
        {
            farmerId: 'farmer-velmurugan',
            productId: 1,
            productName: 'Organic Tomatoes',
            productNameTa: 'இயற்கை தக்காளி',
            category: 'vegetables',
            farmerName: 'Velmurugan & Selvi K.',
            farmerNameTa: 'வேல்முருகன் & செல்வி',
            farmName: 'Sri Amman Bio-Farms',
            farmNameTa: 'ஸ்ரீ அம்மன் பயோ பண்ணை',
            village: 'Anaimalai',
            villageTa: 'ஆனைமலை',
            district: 'Pollachi',
            districtTa: 'பொள்ளாச்சி',
            formattedLocation: 'Anaimalai, Pollachi, Tamil Nadu',
            formattedLocationTa: 'ஆனைமலை, பொள்ளாச்சி, தமிழ்நாடு',
            distanceKm: 34,
            price: 54,
            originalPrice: 75,
            unit: 'kg',
            unitTa: 'கிலோ',
            stock: 80,
            harvestDate: 'Today Morning 6:00 AM',
            harvestDateTa: 'இன்று காலை 6:00',
            badge: '🐝 Bee Pollinated',
            badgeTa: '🐝 தேனீ மகரந்தம்',
            organicBadge: '🐝 Bee Pollinated Natural',
            estimatedDelivery: '🚚 Next-Day Morning Slot (7-10 AM)',
            estimatedDeliveryTa: '🚚 நாளை காலை டெலிவரி (7-10 மணி)',
            deliveryBadge: '🚚 Next-Day Morning Slot',
            deliveryOption: 'Next-Day Morning Slot (7:00 AM - 10:00 AM)',
            farmingType: 'Natural',
            farmingTypeTa: 'இயற்கை வழி முறை (Natural)',
            farmingMethod: 'Vedic Organic Agriculture & Drip Loam Beds',
            productImage: '/assets/images/products/organic-tomatoes.jpg',
            backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
            rating: 4.9,
            reviewsCount: 78,
            certifications: ['PGS-India Green', 'Zero Pesticide'],
            certificationBadge: 'PGS-India Green (TN-CBE-4412)',
            batchCode: 'FTF-TOM-POL-002',
            story: 'Naturally pollinated with farm honeybees. Soil enriched with neem cake and vermicompost for maximum lycopene content.'
        },
        {
            farmerId: 'farmer-selvi',
            productId: 1,
            productName: 'Organic Tomatoes',
            productNameTa: 'இயற்கை தக்காளி (மலைப்பயிர்)',
            category: 'vegetables',
            farmerName: 'Selvi Thangavel',
            farmerNameTa: 'செல்வி தங்கவேல்',
            farmName: 'Nilgiris Bio-Valley',
            farmNameTa: 'நீலகிரி பயோ வேலி',
            village: 'Kotagiri',
            villageTa: 'கோத்தகிரி',
            district: 'Nilgiris',
            districtTa: 'நீலகிரி',
            formattedLocation: 'Kotagiri, Nilgiris, Tamil Nadu',
            formattedLocationTa: 'கோத்தகிரி, நீலகிரி, தமிழ்நாடு',
            distanceKm: 48,
            price: 68,
            originalPrice: 85,
            unit: 'kg',
            unitTa: 'கிலோ',
            stock: 25,
            harvestDate: 'Yesterday Afternoon',
            harvestDateTa: 'நேற்று மதியம்',
            badge: '🏔️ Mountain Fresh',
            badgeTa: '🏔️ மலைப்பயிர்',
            organicBadge: '🏔️ NPOP Certified Mountain Organic',
            estimatedDelivery: '❄️ Cold-Chain Van (Within 24 hrs)',
            estimatedDeliveryTa: '❄️ குளிர்சங்கிலி வேன் (24 மணி நேரத்தில்)',
            deliveryBadge: '❄️ Cold-Chain Fresh',
            deliveryOption: 'Climate-Controlled Van Express',
            farmingType: 'Organic',
            farmingTypeTa: 'இயற்கை விவசாயம்',
            farmingMethod: 'High-Altitude Mountain Loam & Rainfed Cultivation',
            productImage: '/assets/images/products/organic-tomatoes.jpg',
            backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600',
            rating: 4.7,
            reviewsCount: 32,
            certifications: ['India Organic', 'NPOP Certified', 'Mountain Fresh'],
            certificationBadge: 'NPOP India (NIL-ORG-1029)',
            batchCode: 'FTF-TOM-NIL-003',
            story: 'Mountain-grown tomatoes with dense pulp, low acidity, and intense natural sweetness fostered by cool altitude nights.'
        },
        {
            farmerId: 'farmer-muthusamy',
            productId: 1,
            productName: 'Organic Tomatoes',
            productNameTa: 'இயற்கை தக்காளி (டெல்டா)',
            category: 'vegetables',
            farmerName: 'Muthusamy R.',
            farmerNameTa: 'முத்துசாமி ஆர்.',
            farmName: 'Kaveri Delta Natural Farm',
            farmNameTa: 'காவிரி டெல்டா இயற்கை பண்ணை',
            village: 'Thiruvaiyaru',
            villageTa: 'திருவையாறு',
            district: 'Thanjavur',
            districtTa: 'தஞ்சாவூர்',
            formattedLocation: 'Thiruvaiyaru, Thanjavur, Tamil Nadu',
            formattedLocationTa: 'திருவையாறு, தஞ்சாவூர், தமிழ்நாடு',
            distanceKm: 65,
            price: 50,
            originalPrice: 70,
            unit: 'kg',
            unitTa: 'கிலோ',
            stock: 120,
            harvestDate: 'Today Dawn 5:00 AM',
            harvestDateTa: 'இன்று அதிகாலை 5:00',
            badge: '💰 Best Value Price',
            badgeTa: '💰 சிறந்த விலை',
            organicBadge: '🌱 Jaivik ZBNF Natural',
            estimatedDelivery: '🚚 Next-Day Morning Transit',
            estimatedDeliveryTa: '🚚 நாளை காலை டெலிவரி',
            deliveryBadge: '🌱 Direct Farm Gate',
            deliveryOption: 'Express Green Transit',
            farmingType: 'Natural',
            farmingTypeTa: 'இயற்கை வழி வேளாண்மை (ZBNF)',
            farmingMethod: 'Subhash Palekar Zero Budget Natural Farming (ZBNF)',
            productImage: '/assets/images/products/organic-tomatoes.jpg',
            backupImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600',
            rating: 4.6,
            reviewsCount: 22,
            certifications: ['Jaivik Bharat', 'ZBNF Certified'],
            certificationBadge: 'Jaivik Bharat (TN-TNJ-5519)',
            batchCode: 'FTF-TOM-TNJ-004',
            story: 'Cultivated on fertile Kaveri river silt soil. Fermented native cow dung and jaggery bio-sprays protect the crop naturally.'
        }
    ],

    // 2. ORGANIC SPINACH (2 Farmers)
    2: [
        {
            farmerId: 'farmer-velmurugan',
            productId: 2,
            productName: 'Organic Spinach',
            productNameTa: 'இயற்கை பசலைக்கீரை',
            category: 'vegetables',
            farmerName: 'Velmurugan & Selvi K.',
            farmerNameTa: 'வேல்முருகன் & செல்வி',
            farmName: 'Sri Amman Bio-Farms',
            farmNameTa: 'ஸ்ரீ அம்மன் பயோ பண்ணை',
            village: 'Anaimalai',
            villageTa: 'ஆனைமலை',
            district: 'Pollachi',
            districtTa: 'பொள்ளாச்சி',
            formattedLocation: 'Anaimalai, Pollachi, Tamil Nadu',
            formattedLocationTa: 'ஆனைமலை, பொள்ளாச்சி, தமிழ்நாடு',
            distanceKm: 34,
            price: 40,
            originalPrice: 55,
            unit: 'bunch',
            unitTa: 'கட்டு',
            stock: 8,
            harvestDate: 'Today 5:00 AM',
            harvestDateTa: 'இன்று காலை 5:00',
            badge: '⚡ Only 8 Left!',
            badgeTa: '⚡ 8 கட்டுகளே உள்ளன!',
            organicBadge: '🌿 100% Organic Zero Pesticide',
            estimatedDelivery: '⚡ Same-Day Delivery',
            estimatedDeliveryTa: '⚡ இன்றே டெலிவரி',
            deliveryBadge: '⚡ Same-Day Delivery',
            deliveryOption: 'Same-Day Cold Chain Dispatch (4°C)',
            farmingType: 'Natural',
            farmingTypeTa: 'இயற்கை வழி முறை',
            farmingMethod: 'Spring-Water Rinsed Hydro-Organic Drip',
            productImage: '/assets/images/products/organic-spinach.jpg',
            backupImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600',
            rating: 4.9,
            reviewsCount: 44,
            certifications: ['India Organic', 'Zero Pesticide'],
            certificationBadge: 'India Organic (TN-ORG-7781)',
            batchCode: 'FTF-SPN-2024-001',
            story: 'Hand-picked leaves washed in pure mountain water before eco-leaf wrapping.'
        },
        {
            farmerId: 'farmer-arun',
            productId: 2,
            productName: 'Organic Spinach',
            productNameTa: 'இயற்கை பசலைக்கீரை',
            category: 'vegetables',
            farmerName: 'Arunmozhi Varman',
            farmerNameTa: 'அருண்மொழி வர்மன்',
            farmName: 'Palar Riverbed Greenery',
            farmNameTa: 'பாலாறு இயற்கை கீரை பண்ணை',
            village: 'Walajapet',
            villageTa: 'வாலாஜாபேட்டை',
            district: 'Ranipet',
            districtTa: 'ராணிப்பேட்டை',
            formattedLocation: 'Walajapet, Ranipet, Tamil Nadu',
            formattedLocationTa: 'வாலாஜாபேட்டை, ராணிப்பேட்டை, தமிழ்நாடு',
            distanceKm: 22,
            price: 35,
            originalPrice: 50,
            unit: 'bunch',
            unitTa: 'கட்டு',
            stock: 60,
            harvestDate: 'Today 6:15 AM',
            harvestDateTa: 'இன்று காலை 6:15',
            badge: '🥬 Best Value',
            badgeTa: '🥬 சிறந்த விலை',
            organicBadge: '🌱 River Silt Organic',
            estimatedDelivery: '⚡ Same-Day Morning Route',
            estimatedDeliveryTa: '⚡ இன்றே காலை டெலிவரி',
            deliveryBadge: '⚡ Same-Day Delivery',
            deliveryOption: 'Same-Day Morning Route',
            farmingType: 'Natural',
            farmingTypeTa: 'இயற்கை வழி முறை',
            farmingMethod: 'Natural Vermicompost & River Silt',
            productImage: '/assets/images/products/organic-spinach.jpg',
            backupImage: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600',
            rating: 4.7,
            reviewsCount: 31,
            certifications: ['Jaivik Bharat', 'Local PGS'],
            certificationBadge: 'Jaivik Bharat (TN-RPT-2091)',
            batchCode: 'FTF-SPN-RPT-002',
            story: 'Dense iron-rich indigenous spinach grown on virgin organic riverbed plots.'
        }
    ],

    // 3. ORGANIC CARROTS (2 Farmers)
    3: [
        {
            farmerId: 'farmer-anand',
            productId: 3,
            productName: 'Organic Carrots',
            productNameTa: 'ஊட்டி இயற்கை கேரட்',
            category: 'vegetables',
            farmerName: 'Anand & Devi Mountain Collective',
            farmerNameTa: 'ஆனந்த் & தேவி',
            farmName: 'Root Farm',
            farmNameTa: 'ரூட் பார்ம்',
            village: 'Ketti Valley',
            villageTa: 'கெட்டி பள்ளத்தாக்கு',
            district: 'Ooty (Nilgiris)',
            districtTa: 'ஊட்டி (நீலகிரி)',
            formattedLocation: 'Ketti Valley, Ooty, Tamil Nadu',
            formattedLocationTa: 'கெட்டி பள்ளத்தாக்கு, ஊட்டி, தமிழ்நாடு',
            distanceKm: 52,
            price: 50,
            originalPrice: 65,
            unit: 'kg',
            unitTa: 'கிலோ',
            stock: 50,
            harvestDate: 'Yesterday 8:00 AM',
            harvestDateTa: 'நேற்று காலை 8:00',
            badge: '🥕 Mountain Sweet',
            badgeTa: '🥕 மலை இனிப்பு',
            organicBadge: '🌿 Nilgiris High Organic',
            estimatedDelivery: '🚚 Next-Day Express Cold Van',
            estimatedDeliveryTa: '🚚 நாளை விரைவு குளிர்சங்கிலி',
            deliveryBadge: '🚚 Next-Day Delivery',
            deliveryOption: 'Next-Day Express Cold Van',
            farmingType: 'Organic',
            farmingTypeTa: 'இயற்கை விவசாயம்',
            farmingMethod: 'Volcanic Terrace Loam & Natural Compost',
            productImage: '/assets/images/products/organic-carrots.jpg',
            backupImage: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600',
            rating: 4.8,
            reviewsCount: 49,
            certifications: ['India Organic', 'Nilgiris Fresh'],
            certificationBadge: 'India Organic (NIL-ORG-3321)',
            batchCode: 'FTF-CAR-2024-001',
            story: 'Grown in high-altitude cool mist, giving these carrots a natural sweet crunch.'
        },
        {
            farmerId: 'farmer-karthik',
            productId: 3,
            productName: 'Organic Carrots',
            productNameTa: 'இயற்கை கேரட் (திண்டுக்கல்)',
            category: 'vegetables',
            farmerName: 'Karthikeyan S.',
            farmerNameTa: 'கார்த்திகேயன் எஸ்.',
            farmName: 'Palani Foothills Bio-Agro',
            farmNameTa: 'பழனி அடிவாரம் பயோ அக்ரோ',
            village: 'Reddiarchatram',
            villageTa: 'ரெட்டியார்சத்திரம்',
            district: 'Dindigul',
            districtTa: 'திண்டுக்கல்',
            formattedLocation: 'Reddiarchatram, Dindigul, Tamil Nadu',
            formattedLocationTa: 'ரெட்டியார்சத்திரம், திண்டுக்கல், தமிழ்நாடு',
            distanceKm: 26,
            price: 45,
            originalPrice: 60,
            unit: 'kg',
            unitTa: 'கிலோ',
            stock: 90,
            harvestDate: 'Today Morning',
            harvestDateTa: 'இன்று காலை',
            badge: '🥕 Lowest Price',
            badgeTa: '🥕 குறைந்த விலை',
            organicBadge: '🌱 Jaivik Bio-Agro',
            estimatedDelivery: '⚡ Same-Day Evening Route',
            estimatedDeliveryTa: '⚡ இன்றே மாலை',
            deliveryBadge: '⚡ Same-Day Delivery',
            deliveryOption: 'Same-Day Dispatch',
            farmingType: 'Natural',
            farmingTypeTa: 'இயற்கை வழி முறை',
            farmingMethod: 'Natural Mulching & Bio-Compost Soil',
            productImage: '/assets/images/products/organic-carrots.jpg',
            backupImage: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=600',
            rating: 4.6,
            reviewsCount: 28,
            certifications: ['Jaivik Bharat', 'Zero Pesticide'],
            certificationBadge: 'Jaivik Bharat (TN-DGL-8812)',
            batchCode: 'FTF-CAR-DGL-002',
            story: 'Tender baby carrots grown with organic sugarcane bagasse compost.'
        }
    ],

    // 19. RAW FOREST HONEY (2 Artisans)
    19: [
        {
            farmerId: 'artisan-kavitha',
            productId: 19,
            productName: 'Raw Forest Honey',
            productNameTa: 'இயற்கை காட்டுத் தேன்',
            category: 'handmade',
            farmerName: 'Kavitha Natarajan',
            farmerNameTa: 'கவிதா நடராஜன்',
            farmName: "Nature's Touch Artisans",
            farmNameTa: 'நேச்சர்ஸ் டச் கைவினைப் பொருட்கள்',
            village: 'Jamunamarathur',
            villageTa: 'ஜமுனாமரத்தூர்',
            district: 'Jawadhu Hills',
            districtTa: 'ஜவ்வாது மலை',
            formattedLocation: 'Jawadhu Hills, Tiruvannamalai, Tamil Nadu',
            formattedLocationTa: 'ஜவ்வாது மலை, திருவண்ணாமலை, தமிழ்நாடு',
            distanceKm: 42,
            price: 320,
            originalPrice: 400,
            unit: '500g jar',
            unitTa: '500g பாட்டில்',
            stock: 14,
            harvestDate: '3 days ago',
            harvestDateTa: '3 நாட்களுக்கு முன்',
            badge: '🍯 Wild Forest',
            badgeTa: '🍯 காட்டுத் தேன்',
            organicBadge: '🌿 Wild Foraged Tribal Certified',
            estimatedDelivery: '📦 Eco-Pack Express (24-48 hrs)',
            estimatedDeliveryTa: '📦 விரைவு கூரியர்',
            deliveryBadge: '📦 Eco-Pack Express',
            deliveryOption: 'Eco Bubble-Padded Glass Courier',
            farmingType: 'Organic',
            farmingTypeTa: 'இயற்கை மூலிகை மற்றும் பழங்குடி முறை',
            farmingMethod: 'Sustainable Tribal Forest Foraging (Ethical Apiculture)',
            productImage: '/assets/images/products/organic-honey.jpg',
            backupImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
            rating: 4.9,
            reviewsCount: 64,
            certifications: ['FSSAI Jaivik Bharat', 'Wild Foraged Certified'],
            certificationBadge: 'Jaivik Bharat (FSSAI-124230)',
            batchCode: 'FTF-HON-2024-001',
            story: 'Multi-floral raw honey collected by indigenous forest guardians. Unprocessed, unheated, preserving natural propolis.'
        },
        {
            farmerId: 'artisan-murugan',
            productId: 19,
            productName: 'Raw Forest Honey',
            productNameTa: 'கொல்லிமலை காட்டுத் தேன்',
            category: 'handmade',
            farmerName: 'Murugan T.',
            farmerNameTa: 'முருகன் டி.',
            farmName: 'Kolli Hills Honey Collective',
            farmNameTa: 'கொல்லிமலை தேன் உற்பத்தியாளர் குழு',
            village: 'Semmedu',
            villageTa: 'செம்மேடு',
            district: 'Namakkal',
            districtTa: 'நாமக்கல்',
            formattedLocation: 'Kolli Hills, Namakkal, Tamil Nadu',
            formattedLocationTa: 'கொல்லிமலை, நாமக்கல், தமிழ்நாடு',
            distanceKm: 58,
            price: 295,
            originalPrice: 380,
            unit: '500g jar',
            unitTa: '500g பாட்டில்',
            stock: 22,
            harvestDate: 'Last week',
            harvestDateTa: 'கடந்த வாரம்',
            badge: '🍯 Best Price',
            badgeTa: '🍯 சிறந்த விலை',
            organicBadge: '🌱 Medicinal Flora Hive Harvest',
            estimatedDelivery: '🚚 2-Day Delivery',
            estimatedDeliveryTa: '🚚 2-நாள் டெலிவரி',
            deliveryBadge: '🚚 2-Day Delivery',
            deliveryOption: 'Standard Courier',
            farmingType: 'Natural',
            farmingTypeTa: 'இயற்கை வழி முறை',
            farmingMethod: 'Medicinal Flora Wild Hive Harvest',
            productImage: '/assets/images/products/organic-honey.jpg',
            backupImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
            farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
            farmPhoto: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
            rating: 4.8,
            reviewsCount: 39,
            certifications: ['India Organic', 'Wild Forest Certified'],
            certificationBadge: 'India Organic (TN-NMK-7719)',
            batchCode: 'FTF-HON-KOL-002',
            story: 'Harvested from medicinal plants across 70 hairpin bends of misty Kolli Hills.'
        }
    ]
};

// ============================================
// HELPER QUERY FUNCTIONS
// ============================================

function getFarmerById(farmerId) {
    if (!farmerId) return null;
    return FARMERS_REGISTRY[farmerId] || null;
}

function getAllFarmers() {
    return Object.values(FARMERS_REGISTRY);
}

function getFarmersForProduct(productId) {
    const id = parseInt(productId, 10);
    let rawList = [];
    if (MULTI_FARMER_CATALOG[id]) {
        rawList = MULTI_FARMER_CATALOG[id];
    } else {
        // Auto-generate realistic multi-farmer entries for products without explicit hardcoding
        let baseProd = null;
        if (typeof products !== 'undefined') {
            baseProd = products.find(p => p.id === id);
        }
        if (!baseProd && window.shopProducts) {
            baseProd = window.shopProducts.find(p => p.id === id);
        }
        if (!baseProd) {
            baseProd = { id, name: 'Organic Produce', price: 60, unit: 'kg', seller: 'Green Valley Farm', origin: 'Tamil Nadu' };
        }

        const price = baseProd.price || 60;
        rawList = [
            {
                farmerId: 'farmer-primary-' + id,
                productId: id,
                productName: baseProd.name,
                productNameTa: baseProd.name,
                category: baseProd.category || 'vegetables',
                farmerName: 'Sundaram Perumal',
                farmerNameTa: 'சுந்தரம் பெருமாள்',
                farmName: baseProd.seller || 'Green Valley Organic Farm',
                farmNameTa: 'கிரீன் வேலி ஆர்கானிக் பண்ணை',
                village: 'Oddanchatram',
                villageTa: 'ஒட்டன்சத்திரம்',
                district: 'Dindigul',
                districtTa: 'திண்டுக்கல்',
                state: 'Tamil Nadu',
                formattedLocation: baseProd.origin || 'Dindigul, Tamil Nadu',
                formattedLocationTa: 'திண்டுக்கல், தமிழ்நாடு',
                distanceKm: 18,
                price: price,
                originalPrice: Math.round(price * 1.25),
                unit: baseProd.unit || 'kg',
                unitTa: 'கிலோ',
                stock: 35,
                harvestDate: 'Today 5:30 AM',
                harvestDateTa: 'இன்று காலை 5:30',
                badge: '🌿 India Organic',
                badgeTa: '🌿 இயற்கை',
                organicBadge: '🌿 Jaivik Bharat Certified',
                estimatedDelivery: '⚡ Same-Day Delivery',
                estimatedDeliveryTa: '⚡ இன்றே டெலிவரி',
                deliveryBadge: '⚡ Same-Day Delivery',
                deliveryOption: 'Same-Day Cold Chain Dispatch',
                farmingType: 'Organic',
                farmingTypeTa: 'இயற்கை விவசாயம்',
                farmingMethod: 'Natural Panchagavya & Heirloom Seeds',
                productImage: baseProd.image || '/assets/images/products/organic-tomatoes.jpg',
                backupImage: baseProd.backupImage || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600',
                farmerPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300',
                farmPhoto: baseProd.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600',
                rating: 4.8,
                reviewsCount: 38,
                certifications: ['India Organic', 'Jaivik Bharat'],
                certificationBadge: 'Jaivik Bharat Certified',
                batchCode: baseProd.batchCode || 'FTF-BATCH-' + id,
                story: 'Naturally cultivated with native soil enrichers, solar drip irrigation, and zero synthetic pesticides.'
            },
            {
                farmerId: 'farmer-secondary-' + id,
                productId: id,
                productName: baseProd.name,
                productNameTa: baseProd.name,
                category: baseProd.category || 'vegetables',
                farmerName: 'Velmurugan K.',
                farmerNameTa: 'வேல்முருகன் கே.',
                farmName: 'Sri Amman Bio-Farms',
                farmNameTa: 'ஸ்ரீ அம்மன் பயோ பண்ணை',
                village: 'Anaimalai',
                villageTa: 'ஆனைமலை',
                district: 'Pollachi',
                districtTa: 'பொள்ளாச்சி',
                state: 'Tamil Nadu',
                formattedLocation: 'Pollachi, Coimbatore, Tamil Nadu',
                formattedLocationTa: 'பொள்ளாச்சி, தமிழ்நாடு',
                distanceKm: 32,
                price: Math.max(20, Math.round(price * 0.92)),
                originalPrice: Math.round(price * 1.2),
                unit: baseProd.unit || 'kg',
                unitTa: 'கிலோ',
                stock: 65,
                harvestDate: 'Today Morning 6:00 AM',
                harvestDateTa: 'இன்று காலை 6:00',
                badge: '🌱 PGS Green',
                badgeTa: '🌱 இயற்கை',
                organicBadge: '🌱 PGS-India Green Certified',
                estimatedDelivery: '🚚 Next-Day Morning Slot',
                estimatedDeliveryTa: '🚚 நாளை காலை',
                deliveryBadge: '🚚 Next-Day Morning Slot',
                deliveryOption: 'Next-Day Morning Slot',
                farmingType: 'Natural',
                farmingTypeTa: 'இயற்கை வழி முறை',
                farmingMethod: 'Vedic Organic Agriculture & Drip Loam Beds',
                productImage: baseProd.image || '/assets/images/products/organic-tomatoes.jpg',
                backupImage: baseProd.backupImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
                farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
                farmPhoto: baseProd.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
                rating: 4.9,
                reviewsCount: 52,
                certifications: ['PGS-India Green', 'Zero Pesticide'],
                certificationBadge: 'PGS-India Green Certified',
                batchCode: 'FTF-POL-' + id,
                story: 'Naturally pollinated with farm honeybees and fed with fermented Jeevamrutham bio-liquid.'
            }
        ];
    }

    // Dynamic Location Distance & Delivery Calculator
    const custLoc = getRegisteredCustomerLocation();
    const cDist = custLoc.district || 'Chennai';

    return rawList.map(f => {
        const farmerDist = f.district || 'Dindigul';
        const dist = calculateFarmerDistance(farmerDist, cDist);
        const dInfo = getDeliveryInfoForDistance(dist);
        return {
            ...f,
            distanceKm: dist,
            estimatedDelivery: dInfo.delivery,
            estimatedDeliveryTa: dInfo.deliveryTa,
            deliveryBadge: dInfo.badge,
            deliveryTag: dInfo.tag,
            deliveryTagTa: dInfo.tagTa
        };
    });
}

function getFarmerListing(productId, farmerId) {
    const list = getFarmersForProduct(productId);
    return list.find(f => f.farmerId === farmerId) || list[0];
}

// ============================================
// MODAL & COMPARISON RENDERER
// ============================================

function openFarmerComparisonModal(productId, productName) {
    const farmers = getFarmersForProduct(productId);
    const existingModal = document.getElementById('farmerComparisonModal');
    if (existingModal) existingModal.remove();

    const name = productName || (farmers[0] ? farmers[0].productName : 'Organic Produce');
    const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';

    const modal = document.createElement('div');
    modal.id = 'farmerComparisonModal';
    modal.className = 'farmer-comp-modal-backdrop';
    modal.innerHTML = `
        <div class="farmer-comp-modal-card">
            <div class="farmer-comp-modal-header">
                <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="farmer-badge-pill">🌾 ${isTa ? 'விவசாயிகள் நேரடி சந்தை' : 'Multi-Farmer Marketplace'}</span>
                        <span style="font-size:0.8rem; color:var(--text-light);">${farmers.length} ${isTa ? 'உள்ளூர் விவசாயிகள் விற்பனை செய்கின்றனர்' : 'Local Farmers Selling'}</span>
                    </div>
                    <h2 style="margin:4px 0 0; font-size:1.6rem; color:var(--text);">${isTa ? 'ஒப்பிட்டு தேர்வு செய்க: ' + (farmers[0].productNameTa || name) : 'Compare & Choose: ' + name}</h2>
                    <p style="margin:2px 0 0; font-size:0.85rem; color:var(--text-light);">
                        ${isTa 
                            ? 'நேரடி பண்ணை விலை, உங்கள் வீட்டிற்கு உள்ள தூரம், இயற்கை சான்றிதழ் மற்றும் அறுவடை நேரத்தை ஒப்பிட்டு உங்களுக்கு விருப்பமான விவசாயியிடம் வாங்குங்கள்.' 
                            : 'Compare real-time farm-gate prices, distance to your kitchen, available stock, and organic audits. Choose your preferred farmer directly!'}
                    </p>
                </div>
                <button class="farmer-modal-close-btn" onclick="closeFarmerComparisonModal()" aria-label="Close Comparison Modal">✕</button>
            </div>

            <!-- Sorting & Filter Controls inside Modal -->
            <div class="farmer-comp-sort-bar">
                <span style="font-size:0.85rem; font-weight:700; color:var(--text);">${isTa ? 'வரிசைப்படுத்து:' : 'Sort By:'}</span>
                <button class="farmer-sort-btn active" onclick="sortFarmerModalCards(${productId}, 'price-low')">🏷️ ${isTa ? 'குறைந்த விலை' : 'Lowest Price'}</button>
                <button class="farmer-sort-btn" onclick="sortFarmerModalCards(${productId}, 'distance')">📍 ${isTa ? 'அருகிலுள்ள பண்ணை' : 'Nearest Farm'}</button>
                <button class="farmer-sort-btn" onclick="sortFarmerModalCards(${productId}, 'rating')">⭐ ${isTa ? 'உயர்ந்த மதிப்பீடு' : 'Top Rated'}</button>
                <button class="farmer-sort-btn" onclick="sortFarmerModalCards(${productId}, 'stock')">📦 ${isTa ? 'அதிக இருப்பு' : 'Highest Stock'}</button>
            </div>

            <!-- Farmers Cards Grid -->
            <div class="farmer-comp-cards-grid" id="farmerModalCardsGrid">
                ${renderFarmerCardsHtml(farmers)}
            </div>

            <div class="farmer-comp-footer">
                <div>
                    <i class="fas fa-shield-alt" style="color:var(--primary);"></i> 
                    <strong>${isTa ? 'நேரடி விவசாயி உறுதிமொழி:' : 'Direct Farmer Promise:'}</strong> 
                    ${isTa ? 'இடைத்தரகர்கள் இன்றி 100% பணம் விவசாயிக்கே நேரடியாக சென்றடைகிறது.' : '100% of fair price goes to the farmer without middleman inflation.'}
                </div>
                <button class="btn-secondary" onclick="closeFarmerComparisonModal()">${isTa ? 'மூடுக' : 'Close'}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeFarmerComparisonModal();
    });
}

function closeFarmerComparisonModal() {
    const modal = document.getElementById('farmerComparisonModal');
    if (modal) modal.remove();
}

function sortFarmerModalCards(productId, criterion) {
    const farmers = [...getFarmersForProduct(productId)];
    document.querySelectorAll('.farmer-sort-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    if (criterion === 'price-low') farmers.sort((a, b) => a.price - b.price);
    else if (criterion === 'distance') farmers.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (criterion === 'rating') farmers.sort((a, b) => b.rating - a.rating);
    else if (criterion === 'stock') farmers.sort((a, b) => b.stock - a.stock);

    const container = document.getElementById('farmerModalCardsGrid');
    if (container) {
        container.innerHTML = renderFarmerCardsHtml(farmers);
    }
}

// ============================================
// UNIFIED PRODUCT CARD RENDERER (ALL REQUIRED FIELDS)
// ============================================
// Each farmer should appear as a separate product card with:
// * Product image.
// * Farmer name.
// * Farm name.
// * Farm location (Village, District).
// * Distance from the customer's registered location.
// * Price (per kg/per item).
// * Available stock.
// * Harvest date.
// * Organic/Fresh badge.
// * Estimated delivery time.
// * View Farmer button.

function renderFarmerProductCardHtml(f, options = {}) {
    const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
    const regLoc = getRegisteredCustomerLocation();
    const isPages = (typeof window !== 'undefined' && window.location && window.location.pathname.includes('/pages/'));
    const storeUrl = isPages ? `farmer-store.html?farmer=${f.farmerId}` : `pages/farmer-store.html?farmer=${f.farmerId}`;
    const detailUrl = isPages ? `product-details.html?id=${f.productId}&farmer=${f.farmerId}` : `pages/product-details.html?id=${f.productId}&farmer=${f.farmerId}`;

    const rawImg = f.productImage || f.farmPhoto || '/assets/images/products/organic-tomatoes.jpg';
    const imgSrc = typeof getProductImagePath === 'function' ? getProductImagePath(rawImg) : (isPages ? '../' + rawImg.replace(/^\/+/, '') : rawImg);
    const farmerImg = f.farmerPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300';
    const farmerName = isTa ? (f.farmerNameTa || f.farmerName) : f.farmerName;
    const farmName = isTa ? (f.farmNameTa || f.farmName) : f.farmName;
    const village = isTa ? (f.villageTa || f.village) : f.village;
    const district = isTa ? (f.districtTa || f.district) : f.district;
    const prodName = isTa ? (f.productNameTa || f.productName) : f.productName;
    const unit = isTa ? (f.unitTa || f.unit) : f.unit;
    const harvestDate = isTa ? (f.harvestDateTa || f.harvestDate) : f.harvestDate;
    const badge = isTa ? (f.badgeTa || f.badge || '🌿 இயற்கை') : (f.badge || '🌿 Organic');
    const estimatedDelivery = isTa ? (f.estimatedDeliveryTa || f.estimatedDelivery || '⚡ இன்றே டெலிவரி') : (f.estimatedDelivery || '⚡ Same-Day Delivery');
    const isSelected = options.selectedFarmerId ? options.selectedFarmerId === f.farmerId : false;

    return `
        <div class="farmer-market-card ftf-farmer-product-card animate-scale ${isSelected ? 'selected-farmer-card' : ''}" data-farmer-id="${f.farmerId}" data-product-id="${f.productId}">
            <!-- Product Image & Top Badges -->
            <div class="ftf-card-image-box" onclick="window.location.href='${detailUrl}'" style="cursor: pointer; position: relative;">
                <img src="${imgSrc}" alt="${prodName}" class="ftf-card-prod-img" onerror="this.src='${f.backupImage || 'https://via.placeholder.com/400x300?text=Organic+Produce'}'">
                <span class="product-badge badge-fresh ftf-badge-organic">${badge}</span>
                ${isSelected ? `<span style="position: absolute; top: 12px; right: 12px; background: #16a34a; color: white; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);"><i class="fas fa-check-circle"></i> ${isTa ? 'தேர்வு செய்யப்பட்டது' : 'Selected Farmer'}</span>` : ''}
                <span class="ftf-badge-delivery"><i class="fas fa-truck-fast"></i> ${estimatedDelivery}</span>
            </div>

            <!-- Farmer & Farm Details -->
            <div class="ftf-card-content">
                <div class="ftf-farmer-header">
                    <img src="${farmerImg}" alt="${farmerName}" class="ftf-farmer-avatar-img">
                    <div style="flex: 1; min-width: 0;">
                        <h4 class="ftf-farmer-name" title="${farmerName}">
                            <i class="fas fa-user-circle" style="color: var(--primary);"></i> ${farmerName}
                        </h4>
                        <div class="ftf-farm-name" title="${farmName}">
                            <i class="fas fa-tractor" style="color: var(--secondary);"></i> ${farmName}
                        </div>
                        <div class="ftf-farm-location">
                            <i class="fas fa-map-marker-alt" style="color: #ef4444;"></i> ${village}, ${district}
                        </div>
                    </div>
                </div>

                <!-- Distance from customer's registered location -->
                <div class="ftf-distance-row">
                    <i class="fas fa-location-arrow"></i> 
                    <span><strong>${f.distanceKm} km</strong> ${isTa ? 'உங்கள் முகவரியிலிருந்து' : 'from your location'} (${regLoc.name || regLoc.district})</span>
                </div>
                ${f.deliveryTag ? `
                <div style="margin: 4px 0 8px;">
                    <span style="display:inline-block; font-size:0.75rem; font-weight:800; color:#15803d; background:#dcfce7; padding:3px 8px; border-radius:6px; border:1px solid #86efac;">
                        ${isTa ? (f.deliveryTagTa || f.deliveryTag) : f.deliveryTag}
                    </span>
                </div>
                ` : ''}

                <!-- Price and Available Stock -->
                <div class="ftf-price-stock-row">
                    <div class="ftf-price-col">
                        <span class="ftf-price-val">₹${f.price}</span>
                        <span class="ftf-price-unit">/${unit}</span>
                        ${f.originalPrice ? `<span class="ftf-price-orig">₹${f.originalPrice}</span>` : ''}
                    </div>
                    <div class="ftf-stock-badge ${f.stock < 15 ? 'low-stock' : 'in-stock'}">
                        <i class="fas fa-cubes"></i> ${isTa ? 'இருப்பு:' : 'Stock:'} <strong>${f.stock} ${unit}</strong>
                    </div>
                </div>

                <!-- Harvest Date -->
                <div class="ftf-harvest-row">
                    <i class="fas fa-clock" style="color: #16a34a;"></i> 
                    <span><strong>${isTa ? 'அறுவடை:' : 'Harvested:'}</strong> ${harvestDate}</span>
                </div>

                <!-- Card Actions -->
                <div class="ftf-card-actions-grid">
                    <!-- View Farmer Button (Opens Dedicated Farmer Store Page) -->
                    <a href="${storeUrl}" class="btn-view-farmer" title="${isTa ? 'விவசாயி அங்காடியைக் காண்க' : 'Open Dedicated Farmer Store'}">
                        <i class="fas fa-store"></i> ${isTa ? 'விவசாயியைக் காண்க' : 'View Farmer'}
                    </a>
                    
                    ${options.showSelectBtn ? `
                        <button type="button" class="ftf-btn-select-farmer ${isSelected ? 'is-selected' : ''}" onclick="event.stopPropagation(); if(typeof selectFarmerOnProductDetail==='function'){selectFarmerOnProductDetail('${f.farmerId}');}else{selectFarmerAndAddToCart(${f.productId}, '${f.farmerId}', 1, true);}">
                            <i class="fas fa-check-circle"></i> ${isSelected ? (isTa ? '✓ தேர்ந்தெடுக்கப்பட்ட விவசாயி' : '✓ Selected Farmer') : (isTa ? 'இவ்விவசாயியிடம் வாங்கவும்' : 'Choose This Farmer')}
                        </button>
                    ` : ''}

                    <button type="button" class="btn-primary ftf-btn-add-cart" onclick="event.stopPropagation(); selectFarmerAndAddToCart(${f.productId}, '${f.farmerId}');">
                        <i class="fas fa-plus"></i> ${isTa ? 'சேர்' : 'Add to Cart'}
                    </button>

                    <button type="button" class="btn-secondary ftf-btn-buy-now" onclick="event.stopPropagation(); selectFarmerAndBuyNow(${f.productId}, '${f.farmerId}');">
                        <i class="fas fa-bolt"></i> ${isTa ? 'உடனே வாங்கு' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderFarmerCardsHtml(farmers, options = {}) {
    if (!farmers || farmers.length === 0) return '<div style="padding:20px; text-align:center;">No farmers found.</div>';
    return farmers.map(f => renderFarmerProductCardHtml(f, options)).join('');
}

// ============================================
// BUY FLOW: SELECT FARMER & CART / ORDER LINKING
// ============================================

function selectFarmerAndAddToCart(productId, farmerId, qty = 1, showToast = true) {
    const listing = getFarmerListing(productId, farmerId);
    if (!listing) return;

    const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
    const quantity = parseInt(qty, 10) || 1;

    // Build custom cart item storing full farmer information
    const customCartItem = {
        id: listing.productId,
        productId: listing.productId,
        farmerId: listing.farmerId,
        farmerName: listing.farmerName,
        farmName: listing.farmName,
        farmLocation: listing.formattedLocation,
        distanceKm: listing.distanceKm,
        name: listing.productName,
        price: parseFloat(listing.price),
        originalPrice: listing.originalPrice ? parseFloat(listing.originalPrice) : Math.round(listing.price * 1.25),
        unit: listing.unit || 'kg',
        quantity: quantity,
        image: listing.productImage || listing.farmPhoto || '/assets/images/products/organic-tomatoes.jpg',
        backupImage: listing.backupImage || listing.farmerPhoto,
        seller: listing.farmName, // for backward compatibility
        harvestDate: listing.harvestDate,
        badge: listing.badge || '🌿 Organic'
    };

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('farmToForkCart') || '[]');
    } catch(e) {
        cart = [];
    }

    // Do NOT merge products from different farmers!
    // Check if same product from the EXACT SAME farmer is already in cart
    const existingIndex = cart.findIndex(item => 
        item.id === customCartItem.id && 
        (item.farmerId ? item.farmerId === customCartItem.farmerId : item.seller === customCartItem.seller)
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(customCartItem);
    }

    localStorage.setItem('farmToForkCart', JSON.stringify(cart));
    window.cart = cart;
    if (typeof loadCart === 'function') loadCart();
    else if (typeof updateCartUI === 'function') updateCartUI();
    if (typeof updateCartBadge === 'function') updateCartBadge();

    // Trigger Notification
    if (window.FTF_NOTIFICATIONS && typeof window.FTF_NOTIFICATIONS.addNotification === 'function') {
        window.FTF_NOTIFICATIONS.addNotification('customer', {
            type: 'orders',
            title: isTa ? `${listing.farmerName} இடமிருந்து ${listing.productName} கூடையில் சேர்க்கப்பட்டது` : `Added ${listing.productName} from ${listing.farmerName}`,
            message: `${quantity} ${listing.unit} from ${listing.farmName} (${listing.formattedLocation}) added to cart at ₹${listing.price}/${listing.unit}.`,
            actionUrl: 'cart.html',
            actionText: isTa ? 'கூடையைக் காண்க' : 'View Cart'
        });
    }

    if (showToast) {
        const msg = isTa
            ? `🌾 <strong>${listing.farmerName}</strong> (${listing.farmName}) இடமிருந்து <strong>${listing.productName}</strong> கூடையில் சேர்க்கப்பட்டது! 🛒`
            : `🌾 Added <strong>${listing.productName}</strong> directly from <strong>${listing.farmerName}</strong> (${listing.farmName})! 🛒`;
        if (typeof showNotification === 'function') {
            showNotification(msg, 'fas fa-check-circle');
        } else {
            alert(`Added to cart directly from ${listing.farmerName}!`);
        }
    }

    closeFarmerComparisonModal();
}

function selectFarmerAndBuyNow(productId, farmerId, qty = 1) {
    selectFarmerAndAddToCart(productId, farmerId, qty, false);
    const isPages = (typeof window !== 'undefined' && window.location && window.location.pathname.includes('/pages/'));
    window.location.href = isPages ? 'checkout.html' : 'pages/checkout.html';
}

function viewFarmerDedicatedPage(productId, farmerId) {
    closeFarmerComparisonModal();
    const isPages = (typeof window !== 'undefined' && window.location && window.location.pathname.includes('/pages/'));
    window.location.href = isPages ? `farmer-store.html?farmer=${farmerId}` : `pages/farmer-store.html?farmer=${farmerId}`;
}

// ============================================
// CATALOG INTEGRATION: INJECT BADGES & MULTI-FARMER CHIPS
// ============================================

function injectMarketplaceBadgesOnCatalog() {
    // Front catalog product cards remain clean and normal without compare badges.
    // Multi-farmer comparison, individual rates & dynamic locations appear inside the product details page.
    return;
}

// Export globally
if (typeof window !== 'undefined') {
    window.FTF_MARKETPLACE = {
        catalog: MULTI_FARMER_CATALOG,
        registry: FARMERS_REGISTRY,
        getFarmersForProduct,
        getFarmerListing,
        getFarmerById,
        getAllFarmers,
        getRegisteredCustomerLocation,
        setRegisteredCustomerLocation,
        renderFarmerProductCardHtml,
        renderFarmerCardsHtml,
        openFarmerComparisonModal,
        closeFarmerComparisonModal,
        selectFarmerAndAddToCart,
        selectFarmerAndBuyNow,
        viewFarmerDedicatedPage,
        sortFarmerModalCards,
        injectMarketplaceBadgesOnCatalog
    };
    window.openFarmerComparisonModal = openFarmerComparisonModal;
    window.closeFarmerComparisonModal = closeFarmerComparisonModal;
    window.selectFarmerAndAddToCart = selectFarmerAndAddToCart;
    window.selectFarmerAndBuyNow = selectFarmerAndBuyNow;
    window.viewFarmerDedicatedPage = viewFarmerDedicatedPage;
    window.sortFarmerModalCards = sortFarmerModalCards;
    window.getFarmersForProduct = getFarmersForProduct;
    window.renderFarmerProductCardHtml = renderFarmerProductCardHtml;
    window.getFarmerById = getFarmerById;
}
