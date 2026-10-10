
// ============================================
// IMAGE PATH RESOLVER (LOCAL + HTTP RESILIENT)
// ============================================
function getProductImagePath(img) {
    if (!img) return '../assets/images/products/organic-honey.jpg';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const clean = img.replace(/^\/+/, '');
    const href = (typeof window !== 'undefined' && window.location && window.location.href) ? window.location.href.toLowerCase().replace(/\\/g, '/') : '';
    const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname.toLowerCase().replace(/\\/g, '/') : '';
    const isPages = href.includes('/pages/') || pathname.includes('/pages/') || 
                    href.includes('products.html') || href.includes('product-details.html') || 
                    href.includes('dashboard-') || href.includes('cart.html') || href.includes('seed-to-plate.html') ||
                    href.includes('community-kitchen.html') || href.includes('group-buying.html') || href.includes('checkout.html');
    return isPages ? '../' + clean : clean;
}
if (typeof window !== 'undefined') {
    window.getProductImagePath = getProductImagePath;
}

// ============================================
// COMPLETE PRODUCT DATA & CORE UTILITIES
// Farm to Fork Collective
// ============================================

const products = [
    // === VEGETABLES (10 products) ===
    {
        id: 1,
        name: "Organic Tomatoes",
        category: "vegetables",
        price: 60,
        originalPrice: 80,
        unit: "kg",
        image: "/assets/images/products/organic-tomatoes.jpg",
        backupImage: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 85,
        rating: 4.5,
        reviewsCount: 38,
        seller: "Green Valley Farm",
        origin: "Anna Nagar, Tamil Nadu",
        harvestDate: "Yesterday",
        shelfLife: "5-7 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 92,
        description: "Naturally vine-ripened organic tomatoes grown without synthetic pesticides or chemical fertilizers. Rich in Vitamin C, potassium, and lycopene antioxidant.",
        nutrition: { calories: "18 kcal", carbs: "3.9g", protein: "0.9g", vitaminC: "28%" },
        certifications: ["India Organic", "Jaivik Bharat", "Zero Chemical"]
    },
    {
        id: 2,
        name: "Organic Spinach",
        category: "vegetables",
        price: 40,
        originalPrice: 55,
        unit: "bunch",
        image: "/assets/images/products/organic-spinach.jpg",
        backupImage: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 88,
        rating: 4.3,
        reviewsCount: 24,
        seller: "Fresh Farm",
        origin: "Kanchipuram, Tamil Nadu",
        harvestDate: "Today Morning",
        shelfLife: "3-4 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 95,
        description: "Crisp and nutrient-dense farm spinach. Hand-harvested early in the morning and washed in natural spring water.",
        nutrition: { calories: "23 kcal", carbs: "3.6g", protein: "2.9g", iron: "15%" },
        certifications: ["India Organic", "Zero Pesticide"]
    },
    {
        id: 3,
        name: "Organic Carrots",
        category: "vegetables",
        price: 50,
        originalPrice: 65,
        unit: "kg",
        image: "/assets/images/products/organic-carrots.jpg",
        backupImage: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 90,
        rating: 4.4,
        reviewsCount: 29,
        seller: "Root Farm",
        origin: "Ooty, Nilgiris",
        harvestDate: "2 days ago",
        shelfLife: "10-14 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 90,
        description: "Sweet, crunchy mountain carrots grown in the cool climate of Nilgiris with natural compost soil enrichers.",
        nutrition: { calories: "41 kcal", carbs: "9.6g", protein: "0.9g", vitaminA: "334%" },
        certifications: ["India Organic", "Nilgiris Fresh"]
    },
    {
        id: 4,
        name: "Organic Broccoli",
        category: "vegetables",
        price: 80,
        originalPrice: 100,
        unit: "kg",
        image: "/assets/images/products/organic-broccoli.jpg",
        backupImage: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 82,
        rating: 4.6,
        reviewsCount: 42,
        seller: "Green Valley Farm",
        origin: "Kodaikanal, Tamil Nadu",
        harvestDate: "Yesterday",
        shelfLife: "5-6 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 88,
        description: "Tender broccoli florets rich in dietary fiber and essential vitamins. Hand-picked for peak freshness.",
        nutrition: { calories: "34 kcal", carbs: "6.6g", protein: "2.8g", vitaminC: "148%" },
        certifications: ["India Organic", "Jaivik Bharat"]
    },
    {
        id: 5,
        name: "Organic Cauliflower",
        category: "vegetables",
        price: 70,
        originalPrice: 90,
        unit: "kg",
        image: "/assets/images/products/organic-cauliflower.jpg",
        backupImage: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 80,
        rating: 4.2,
        reviewsCount: 19,
        seller: "Fresh Farm",
        origin: "Hosur, Tamil Nadu",
        harvestDate: "2 days ago",
        shelfLife: "5-7 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 86,
        description: "Snow-white organic cauliflower heads grown with bio-fertilizers. Perfect for curries, roasts, and rice substitutes.",
        nutrition: { calories: "25 kcal", carbs: "5.0g", protein: "1.9g", vitaminC: "77%" },
        certifications: ["India Organic"]
    },
    {
        id: 6,
        name: "Organic Capsicum",
        category: "vegetables",
        price: 90,
        originalPrice: 110,
        unit: "kg",
        image: "/assets/images/products/organic-capsicum.jpg",
        backupImage: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80",
        freshness: "Good",
        freshnessScore: 72,
        rating: 4.1,
        reviewsCount: 15,
        seller: "Root Farm",
        origin: "Coimbatore, Tamil Nadu",
        harvestDate: "3 days ago",
        shelfLife: "6-8 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 84,
        description: "Crunchy green bell peppers packed with Vitamin C and antioxidant flavonoids. Excellent for stir-fries and salads.",
        nutrition: { calories: "20 kcal", carbs: "4.6g", protein: "0.9g", vitaminC: "134%" },
        certifications: ["India Organic"]
    },
    {
        id: 7,
        name: "Organic Onion",
        category: "vegetables",
        price: 35,
        originalPrice: 45,
        unit: "kg",
        image: "/assets/images/products/organic-onion.jpg",
        backupImage: "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 86,
        rating: 4.0,
        reviewsCount: 33,
        seller: "Green Valley Farm",
        origin: "Dindigul, Tamil Nadu",
        harvestDate: "4 days ago",
        shelfLife: "20-30 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 91,
        description: "Flavor-rich red onions grown in mineral-rich red soil. Essential kitchen staple for authentic Indian cooking.",
        nutrition: { calories: "40 kcal", carbs: "9.3g", protein: "1.1g", potassium: "146mg" },
        certifications: ["Jaivik Bharat"]
    },
    {
        id: 8,
        name: "Organic Potato",
        category: "vegetables",
        price: 30,
        originalPrice: 40,
        unit: "kg",
        image: "/assets/images/products/organic-potato.jpg",
        backupImage: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 84,
        rating: 4.2,
        reviewsCount: 27,
        seller: "Fresh Farm",
        origin: "Ooty Hills, Tamil Nadu",
        harvestDate: "5 days ago",
        shelfLife: "20-30 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 89,
        description: "Naturally grown hillside potatoes with firm texture and thin skin. Free from chemical sprout inhibitors.",
        nutrition: { calories: "77 kcal", carbs: "17g", protein: "2.0g", potassium: "421mg" },
        certifications: ["India Organic"]
    },
    {
        id: 9,
        name: "Organic Beetroot",
        category: "vegetables",
        price: 55,
        originalPrice: 70,
        unit: "kg",
        image: "/assets/images/products/organic-beetroot.jpg",
        backupImage: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 87,
        rating: 4.3,
        reviewsCount: 18,
        seller: "Root Farm",
        origin: "Salem, Tamil Nadu",
        harvestDate: "2 days ago",
        shelfLife: "10-15 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 93,
        description: "Deep red, sweet organic beetroots loaded with nitrates, folate, and iron. Great for fresh juicing and salads.",
        nutrition: { calories: "43 kcal", carbs: "9.6g", protein: "1.6g", folate: "27%" },
        certifications: ["India Organic", "Jaivik Bharat"]
    },
    {
        id: 10,
        name: "Organic Pumpkin",
        category: "vegetables",
        price: 45,
        originalPrice: 60,
        unit: "kg",
        image: "/assets/images/products/organic-pumpkin.jpg",
        backupImage: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600&q=80",
        freshness: "Good",
        freshnessScore: 70,
        rating: 4.0,
        reviewsCount: 12,
        seller: "Green Valley Farm",
        origin: "Madurai, Tamil Nadu",
        harvestDate: "3 days ago",
        shelfLife: "15-20 days",
        badge: "🌿 Organic",
        type: "fresh",
        ecoScore: 88,
        description: "Golden organic pumpkin with tender flesh and rich flavor. Ideal for sambar, soups, and desserts.",
        nutrition: { calories: "26 kcal", carbs: "6.5g", protein: "1.0g", vitaminA: "245%" },
        certifications: ["India Organic"]
    },

    // === FRUITS (8 products) ===
    {
        id: 11,
        name: "Organic Apples",
        category: "fruits",
        price: 120,
        originalPrice: 150,
        unit: "kg",
        image: "/assets/images/products/organic-apples.jpg",
        backupImage: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 92,
        rating: 4.8,
        reviewsCount: 56,
        seller: "Himalayan Orchard",
        origin: "Kinnaur, Himachal Pradesh",
        harvestDate: "3 days ago",
        shelfLife: "14-21 days",
        badge: "🍎 Premium",
        type: "fresh",
        ecoScore: 94,
        description: "Crisp, sweet, tree-ripened organic apples grown without synthetic waxes or preservative washes.",
        nutrition: { calories: "52 kcal", carbs: "14g", fiber: "2.4g", vitaminC: "14%" },
        certifications: ["India Organic", "Himachal Pure"]
    },
    {
        id: 12,
        name: "Organic Bananas",
        category: "fruits",
        price: 50,
        originalPrice: 65,
        unit: "dozen",
        image: "/assets/images/products/organic-bananas.jpg",
        backupImage: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 88,
        rating: 4.5,
        reviewsCount: 45,
        seller: "Tropical Farm",
        origin: "Theni, Tamil Nadu",
        harvestDate: "Yesterday",
        shelfLife: "4-6 days",
        badge: "🍌 Fresh",
        type: "fresh",
        ecoScore: 96,
        description: "Naturally ripened Robusta bananas free from calcium carbide. High in potassium and instant energy.",
        nutrition: { calories: "89 kcal", carbs: "23g", potassium: "358mg", vitaminB6: "20%" },
        certifications: ["India Organic", "Jaivik Bharat"]
    },
    {
        id: 13,
        name: "Organic Oranges",
        category: "fruits",
        price: 80,
        originalPrice: 100,
        unit: "kg",
        image: "/assets/images/products/organic-oranges.jpg",
        backupImage: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 90,
        rating: 4.7,
        reviewsCount: 31,
        seller: "Citrus Farm",
        origin: "Nagpur, Maharashtra",
        harvestDate: "2 days ago",
        shelfLife: "8-12 days",
        badge: "🍊 Juicy",
        type: "fresh",
        ecoScore: 91,
        description: "Juicy, zesty Nagpur oranges bursting with natural citrus flavor and immunity-boosting Vitamin C.",
        nutrition: { calories: "47 kcal", carbs: "12g", vitaminC: "89%", calcium: "40mg" },
        certifications: ["India Organic"]
    },
    {
        id: 14,
        name: "Organic Grapes",
        category: "fruits",
        price: 150,
        originalPrice: 180,
        unit: "kg",
        image: "/assets/images/products/organic-grapes.jpg",
        backupImage: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 85,
        rating: 4.6,
        reviewsCount: 28,
        seller: "Vineyard Fresh",
        origin: "Nashik, Maharashtra",
        harvestDate: "2 days ago",
        shelfLife: "5-7 days",
        badge: "🍇 Sweet",
        type: "fresh",
        ecoScore: 89,
        description: "Crisp and seedless black organic grapes harvested at peak brix sweetness from certified vineyards.",
        nutrition: { calories: "69 kcal", carbs: "18g", resveratrol: "High", vitaminK: "18%" },
        certifications: ["India Organic", "EcoCert"]
    },
    {
        id: 15,
        name: "Organic Mangoes",
        category: "fruits",
        price: 200,
        originalPrice: 250,
        unit: "kg",
        image: "/assets/images/products/organic-mangoes.jpg",
        backupImage: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80",
        freshness: "Seasonal",
        freshnessScore: 80,
        rating: 4.9,
        reviewsCount: 68,
        seller: "Mango Valley",
        origin: "Krishnagiri, Tamil Nadu",
        harvestDate: "Yesterday",
        shelfLife: "4-6 days",
        badge: "🥭 King of Fruits",
        type: "fresh",
        ecoScore: 95,
        description: "Authentic Alphonso & Banganapalli mangoes ripened traditionally with dry grass hay. Incomparable aroma and taste.",
        nutrition: { calories: "60 kcal", carbs: "15g", vitaminA: "21%", vitaminC: "60%" },
        certifications: ["India Organic", "Jaivik Bharat"]
    },
    {
        id: 16,
        name: "Organic Strawberries",
        category: "fruits",
        price: 180,
        originalPrice: 220,
        unit: "250g",
        image: "/assets/images/products/organic-strawberries.jpg",
        backupImage: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 88,
        rating: 4.8,
        reviewsCount: 40,
        seller: "Berry Farm",
        origin: "Mahabaleshwar, Maharashtra",
        harvestDate: "Yesterday",
        shelfLife: "3-4 days",
        badge: "🍓 Organic",
        type: "fresh",
        ecoScore: 92,
        description: "Plump, aromatic red strawberries freshly picked and packed in breathable eco-boxes.",
        nutrition: { calories: "32 kcal", carbs: "7.7g", manganese: "19%", vitaminC: "99%" },
        certifications: ["India Organic"]
    },
    {
        id: 17,
        name: "Organic Watermelon",
        category: "fruits",
        price: 60,
        originalPrice: 80,
        unit: "kg",
        image: "/assets/images/products/organic-watermelon.jpg",
        backupImage: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 82,
        rating: 4.3,
        reviewsCount: 22,
        seller: "Summer Farm",
        origin: "Tiruvannamalai, Tamil Nadu",
        harvestDate: "2 days ago",
        shelfLife: "7-10 days",
        badge: "🍉 Refreshing",
        type: "fresh",
        ecoScore: 90,
        description: "Hydrating, sweet red watermelon grown on riverbank organic plots. Great for beating the heat.",
        nutrition: { calories: "30 kcal", carbs: "7.6g", water: "92%", lycopene: "High" },
        certifications: ["India Organic"]
    },
    {
        id: 18,
        name: "Organic Pomegranate",
        category: "fruits",
        price: 130,
        originalPrice: 160,
        unit: "kg",
        image: "/assets/images/products/organic-pomegranate.jpg",
        backupImage: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 86,
        rating: 4.5,
        reviewsCount: 30,
        seller: "Pomegranate Farm",
        origin: "Solapur, Maharashtra",
        harvestDate: "3 days ago",
        shelfLife: "15-20 days",
        badge: "🍎 Ruby Red",
        type: "fresh",
        ecoScore: 93,
        description: "Ruby-red organic pomegranates with juicy arils loaded with punicalagin antioxidants.",
        nutrition: { calories: "83 kcal", carbs: "19g", fiber: "4.0g", vitaminC: "17%" },
        certifications: ["India Organic"]
    },

    // === HANDMADE PRODUCTS (10 products) ===
    {
        id: 19,
        name: "Organic Honey",
        category: "handmade",
        price: 350,
        originalPrice: 500,
        unit: "500g",
        image: "/assets/images/products/organic-honey.jpg",
        backupImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 95,
        rating: 4.9,
        reviewsCount: 92,
        seller: "Bee Natural",
        origin: "Jawadhu Hills, Tamil Nadu",
        harvestDate: "Raw & Unprocessed",
        shelfLife: "24 months",
        badge: "🍯 Pure",
        type: "handmade",
        ecoScore: 98,
        description: "Raw wild forest honey extracted using sustainable bee-friendly methods without heating or artificial filtration.",
        nutrition: { calories: "304 kcal", carbs: "82g", sugars: "82g", enzymes: "Active" },
        certifications: ["FSSAI Organic", "Forest Collect", "Zero Sugar Adulteration"]
    },
    {
        id: 20,
        name: "Organic Artisan Bread",
        category: "handmade",
        price: 45,
        originalPrice: 60,
        unit: "loaf",
        image: "/assets/images/products/organic-artisan-bread.jpg",
        backupImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
        freshness: "Good",
        freshnessScore: 70,
        rating: 4.3,
        reviewsCount: 26,
        seller: "Bake Organic",
        origin: "Chennai Artisan Bakery",
        harvestDate: "Baked Today",
        shelfLife: "3 days",
        badge: "🍞 Fresh",
        type: "handmade",
        ecoScore: 87,
        description: "Artisanal sourdough loaf fermented for 24 hours with whole wheat organic flour. No palm oil or chemical improvers.",
        nutrition: { calories: "265 kcal", carbs: "49g", protein: "9g", fiber: "4g" },
        certifications: ["FSSAI", "100% Whole Wheat"]
    },
    {
        id: 21,
        name: "Organic Handmade Soap",
        category: "handmade",
        price: 150,
        originalPrice: 200,
        unit: "piece",
        image: "/assets/images/products/organic-handmade-soap.jpg",
        backupImage: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 92,
        rating: 4.7,
        reviewsCount: 37,
        seller: "Nature's Touch",
        origin: "Auroville, Tamil Nadu",
        harvestDate: "Cold Processed",
        shelfLife: "24 months",
        badge: "🧼 Natural",
        type: "handmade",
        ecoScore: 96,
        description: "Handcrafted cold-processed soap made with cold-pressed coconut oil, shea butter, and essential neem & tulsi extracts.",
        nutrition: { ingredients: "Virgin Coconut Oil, Neem, Tulsi, Essential Oils", sulfates: "0%", parabens: "0%" },
        certifications: ["Cruelty Free", "Zero Chemical", "Plastic Free"]
    },
    {
        id: 22,
        name: "Organic Traditional Pickle",
        category: "handmade",
        price: 180,
        originalPrice: 250,
        unit: "500g",
        image: "/assets/images/products/organic-traditional-pickle.jpg",
        backupImage: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=600&q=80",
        freshness: "Good",
        freshnessScore: 65,
        rating: 4.1,
        reviewsCount: 34,
        seller: "Spice Cottage",
        origin: "Chettinad, Tamil Nadu",
        harvestDate: "Sun-Cured",
        shelfLife: "12 months",
        badge: "🥒 Homemade",
        type: "handmade",
        ecoScore: 91,
        description: "Sun-dried raw mango and lemon pickles cured in cold-pressed sesame oil with rock salt and hand-ground spices.",
        nutrition: { oil: "Cold Pressed Sesame", preservatives: "None", shelfLife: "12 months" },
        certifications: ["FSSAI", "Traditional Recipe"]
    },
    {
        id: 23,
        name: "Organic Peanut Butter",
        category: "handmade",
        price: 280,
        originalPrice: 350,
        unit: "500g",
        image: "/assets/images/products/organic-peanut-butter.jpg",
        backupImage: "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 90,
        rating: 4.6,
        reviewsCount: 48,
        seller: "Nut House",
        origin: "Pollachi, Tamil Nadu",
        harvestDate: "Fresh Batch",
        shelfLife: "6 months",
        badge: "🥜 Pure",
        type: "handmade",
        ecoScore: 94,
        description: "Single-ingredient creamy peanut butter stone-ground from slow-roasted organic country peanuts with zero added sugar.",
        nutrition: { calories: "588 kcal", carbs: "20g", protein: "25g", sugar: "0g" },
        certifications: ["100% Peanuts", "No Palm Oil", "FSSAI"]
    },
    {
        id: 24,
        name: "Organic A2 Desi Ghee",
        category: "handmade",
        price: 450,
        originalPrice: 600,
        unit: "500ml",
        image: "/assets/images/products/organic-desi-ghee.jpg",
        backupImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 93,
        rating: 4.8,
        reviewsCount: 81,
        seller: "Dairy Fresh",
        origin: "Thanjavur, Tamil Nadu",
        harvestDate: "Bilona Method",
        shelfLife: "12 months",
        badge: "🧈 Pure",
        type: "handmade",
        ecoScore: 97,
        description: "Pure A2 Gir cow ghee prepared using traditional Ayurvedic Bilona churning method from whole curd over slow wood fire.",
        nutrition: { fat: "99.8%", vitamins: "A, D, E, K2", lactoseFree: "Yes" },
        certifications: ["A2 Certified", "Grass Fed", "FSSAI"]
    },
    {
        id: 25,
        name: "Organic Spices Gift Set",
        category: "handmade",
        price: 399,
        originalPrice: 499,
        unit: "set",
        image: "/assets/images/products/organic-spices-gift-set.jpg",
        backupImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 88,
        rating: 4.5,
        reviewsCount: 22,
        seller: "Spice Garden",
        origin: "Idukki, Kerala",
        harvestDate: "Recent Harvest",
        shelfLife: "18 months",
        badge: "🌿 100% Pure",
        type: "handmade",
        ecoScore: 95,
        description: "Curated collection of aromatic whole spices (Cardamom, Black Pepper, Cloves, Cinnamon, Star Anise) from organic spice hills.",
        nutrition: { contents: "5 Whole Organic Spices", aroma: "Intense", processing: "Hand Sorted" },
        certifications: ["Spices Board India", "Organic Certified"]
    },
    {
        id: 26,
        name: "Organic Country Jaggery",
        category: "handmade",
        price: 120,
        originalPrice: 160,
        unit: "kg",
        image: "/assets/images/products/organic-country-jaggery.jpg",
        backupImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 85,
        rating: 4.2,
        reviewsCount: 29,
        seller: "Sweet Harvest",
        origin: "Erode, Tamil Nadu",
        harvestDate: "Handmade Batch",
        shelfLife: "12 months",
        badge: "🍬 Natural",
        type: "handmade",
        ecoScore: 92,
        description: "Chemical-free unrefined country jaggery cubes produced from freshly squeezed sugarcane juice. Natural source of iron.",
        nutrition: { calories: "383 kcal", carbs: "98g", iron: "11mg", calcium: "80mg" },
        certifications: ["Zero Clarifiers", "India Organic"]
    },
    {
        id: 27,
        name: "Organic Cold Pressed Coconut Oil",
        category: "handmade",
        price: 250,
        originalPrice: 320,
        unit: "500ml",
        image: "/assets/images/products/organic-coconut-oil.jpg",
        backupImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 90,
        rating: 4.7,
        reviewsCount: 52,
        seller: "Coconut Grove",
        origin: "Pollachi, Tamil Nadu",
        harvestDate: "Wood Pressed (Chekku)",
        shelfLife: "12 months",
        badge: "🥥 Pure",
        type: "handmade",
        ecoScore: 96,
        description: "Traditional wood-pressed (Marachekku) virgin coconut oil extracted from sun-dried organic copra without heat or bleaching.",
        nutrition: { lauricAcid: "52%", mct: "High", smokingPoint: "177°C" },
        certifications: ["Wood Pressed", "FSSAI Organic"]
    },
    {
        id: 28,
        name: "Organic Herbal Wellness Tea",
        category: "handmade",
        price: 180,
        originalPrice: 230,
        unit: "100g",
        image: "/assets/images/products/organic-wellness-tea.jpg",
        backupImage: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80",
        freshness: "Fresh",
        freshnessScore: 92,
        rating: 4.6,
        reviewsCount: 35,
        seller: "Tea Garden",
        origin: "Valparai, Tamil Nadu",
        harvestDate: "Hand Plucked",
        shelfLife: "18 months",
        badge: "🍵 Organic",
        type: "handmade",
        ecoScore: 95,
        description: "Soothing blend of whole leaf green tea, holy basil (tulsi), ginger flakes, and dried lemongrass for daily vitality.",
        nutrition: { caffeine: "Low", antioxidants: "Very High", calories: "0 kcal" },
        certifications: ["Rainforest Alliance", "India Organic"]
    },

    // === FROZEN VEGETABLE PACKS (6 products) ===
    {
        id: 29,
        name: "Mixed Vegetable Pack",
        category: "frozen",
        price: 120,
        originalPrice: 160,
        unit: "500g",
        image: "/assets/images/products/mixed-vegetable-pack.jpg",
        backupImage: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=600&q=80",
        freshness: "Frozen",
        freshnessScore: 90,
        rating: 4.6,
        reviewsCount: 64,
        seller: "Frozen Fresh Organic",
        origin: "Cold-chain Hub, Chennai",
        harvestDate: "Flash Frozen at -35°C",
        shelfLife: "9 months",
        badge: "❄️ Ready to Cook",
        type: "frozen",
        prepTime: "5 mins",
        servings: "4-5 people",
        ecoScore: 94,
        description: "Pre-cut, pre-washed organic carrots, beans, peas, and corn. Individual quick-frozen (IQF) to lock in nutrients and freshness. Zero preservatives!",
        nutrition: { calories: "65 kcal", fiber: "3.2g", vitaminA: "45%", vitaminC: "20%" },
        certifications: ["IQF Flash Freeze", "Zero Waste", "100% Organic"]
    },
    {
        id: 30,
        name: "Stir-Fry Vegetable Pack",
        category: "frozen",
        price: 140,
        originalPrice: 180,
        unit: "500g",
        image: "/assets/images/products/stir-fry-pack.jpg",
        backupImage: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
        freshness: "Frozen",
        freshnessScore: 92,
        rating: 4.8,
        reviewsCount: 51,
        seller: "Quick Cook Organics",
        origin: "Cold-chain Hub, Chennai",
        harvestDate: "Flash Frozen at -35°C",
        shelfLife: "9 months",
        badge: "❄️ Ready to Cook",
        type: "frozen",
        prepTime: "5 mins",
        servings: "4-5 people",
        ecoScore: 93,
        description: "Gourmet mix of broccoli florets, bell peppers, baby corn, and zucchini. Pre-cut for wok stir-fries and pasta in minutes.",
        nutrition: { calories: "55 kcal", fiber: "2.8g", vitaminC: "70%", prep: "Direct to pan" },
        certifications: ["IQF Flash Freeze", "No Chopping"]
    },
    {
        id: 31,
        name: "Soup Vegetable Pack",
        category: "frozen",
        price: 100,
        originalPrice: 130,
        unit: "400g",
        image: "/assets/images/products/soup-vegetable-pack.jpg",
        backupImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
        freshness: "Frozen",
        freshnessScore: 88,
        rating: 4.4,
        reviewsCount: 38,
        seller: "Soup Masters Organic",
        origin: "Cold-chain Hub, Chennai",
        harvestDate: "Flash Frozen at -35°C",
        shelfLife: "9 months",
        badge: "❄️ Ready to Cook",
        type: "frozen",
        prepTime: "5 mins",
        servings: "6-8 people",
        ecoScore: 92,
        description: "Finely diced celery, carrots, leeks, and mushrooms designed for instant hearty soups and vegetable broths.",
        nutrition: { calories: "45 kcal", potassium: "240mg", vitamins: "A, B, C" },
        certifications: ["IQF Flash Freeze", "FSSAI"]
    },
    {
        id: 32,
        name: "Curry Vegetable Pack",
        category: "frozen",
        price: 130,
        originalPrice: 170,
        unit: "500g",
        image: "/assets/images/products/curry-vegetable-pack.jpg",
        backupImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
        freshness: "Frozen",
        freshnessScore: 85,
        rating: 4.3,
        reviewsCount: 42,
        seller: "Curry House Organics",
        origin: "Cold-chain Hub, Chennai",
        harvestDate: "Flash Frozen at -35°C",
        shelfLife: "9 months",
        badge: "❄️ Ready to Cook",
        type: "frozen",
        prepTime: "5 mins",
        servings: "4-5 people",
        ecoScore: 91,
        description: "Traditional Indian curry mix featuring cut drumstick, raw banana, yam, pumpkin, and beans. Perfect for Sambar and Avial.",
        nutrition: { calories: "70 kcal", fiber: "4.5g", minerals: "Rich" },
        certifications: ["Traditional Cut", "100% Organic"]
    },
    {
        id: 33,
        name: "Premium Veggie Medley",
        category: "frozen",
        price: 160,
        originalPrice: 200,
        unit: "500g",
        image: "/assets/images/products/premium-veggie-medley.jpg",
        backupImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
        freshness: "Frozen",
        freshnessScore: 94,
        rating: 4.9,
        reviewsCount: 77,
        seller: "Premium Organic",
        origin: "Cold-chain Hub, Chennai",
        harvestDate: "Flash Frozen at -35°C",
        shelfLife: "9 months",
        badge: "❄️ Premium",
        type: "frozen",
        prepTime: "5 mins",
        servings: "5-6 people",
        ecoScore: 96,
        description: "Exotic medley including asparagus cuts, sugar snap peas, yellow squash, and baby carrots for continental cooking.",
        nutrition: { calories: "50 kcal", folate: "22%", fiber: "3.5g" },
        certifications: ["Exotic Organic", "IQF Flash Freeze"]
    },
    {
        id: 34,
        name: "Organic Green Peas Pack",
        category: "frozen",
        price: 80,
        originalPrice: 110,
        unit: "500g",
        image: "/assets/images/products/organic-green-peas.jpg",
        backupImage: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600&q=80",
        freshness: "Frozen",
        freshnessScore: 86,
        rating: 4.2,
        reviewsCount: 59,
        seller: "Green Harvest",
        origin: "Cold-chain Hub, Chennai",
        harvestDate: "Flash Frozen at -35°C",
        shelfLife: "9 months",
        badge: "❄️ Fresh Frozen",
        type: "frozen",
        prepTime: "5 mins",
        servings: "4 people",
        ecoScore: 94,
        description: "Tender, sweet green peas harvested within 3 hours of shelling and immediately blast-frozen to preserve natural sugars.",
        nutrition: { calories: "81 kcal", protein: "5.4g", fiber: "5.7g" },
        certifications: ["Sweet Garden Peas", "IQF"]
    }
];

// Automatically map batch codes if not present
const batchMap = {
  1: 'FTF-TOM-2024-001', 2: 'FTF-SPN-2024-001', 3: 'FTF-CAR-2024-001', 4: 'FTF-BRO-2024-001',
  5: 'FTF-CAU-2024-001', 6: 'FTF-CAP-2024-001', 7: 'FTF-ONI-2024-001', 8: 'FTF-POT-2024-001',
  9: 'FTF-BEET-2024-001', 10: 'FTF-PUM-2024-001', 11: 'FTF-APP-2024-001', 12: 'FTF-BAN-2024-001',
  13: 'FTF-ORA-2024-001', 14: 'FTF-GRA-2024-001', 15: 'FTF-MAN-2024-001', 16: 'FTF-STR-2024-001',
  17: 'FTF-WAT-2024-001', 18: 'FTF-POM-2024-001', 19: 'FTF-HONEY-2024-001', 20: 'FTF-BRD-2024-001',
  21: 'FTF-SOAP-2024-001', 22: 'FTF-PCK-2024-001', 23: 'FTF-PB-2024-001', 24: 'FTF-GHEE-2024-001',
  25: 'FTF-SPC-2024-001', 26: 'FTF-JAG-2024-001', 27: 'FTF-COCO-2024-001', 28: 'FTF-TEA-2024-001',
  29: 'FTF-MIX-2024-001', 30: 'FTF-STIR-2024-001', 31: 'FTF-SOUP-2024-001', 32: 'FTF-CURRY-2024-001',
  33: 'FTF-MED-2024-001', 34: 'FTF-PEAS-2024-001'
};
products.forEach(p => {
    if (!p.batchCode) p.batchCode = batchMap[p.id] || `FTF-PRD-2024-${String(p.id).padStart(3, '0')}`;
});

// ============================================
// HELPER LOOKUPS
// ============================================
function getProductById(id) {
    const numId = parseInt(id, 10);
    return products.find(p => p.id === numId) || null;
}

function getProductsByCategory(category) {
    if (!category || category === 'all') return products;
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

// ============================================
// USER AUTH & SESSION MANAGEMENT
// ============================================
// ============================================
// USER AUTHENTICATION & NAVBAR SESSION CONTINUITY
// ============================================
function getCurrentUser() {
    try {
        const saved = localStorage.getItem('farmToForkUser');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && (parsed.name || parsed.email)) return parsed;
        }
        // Fallback: check legacy individual keys
        const userName = localStorage.getItem('userName');
        if (userName && (localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('userRole'))) {
            return {
                name: userName,
                email: localStorage.getItem('userEmail') || '',
                role: localStorage.getItem('userRole') || 'customer'
            };
        }
        return null;
    } catch (e) {
        return null;
    }
}

function setCurrentUser(userData) {
    if (!userData) return;
    localStorage.setItem('farmToForkUser', JSON.stringify(userData));
    localStorage.setItem('userName', userData.name || '');
    localStorage.setItem('userEmail', userData.email || '');
    localStorage.setItem('userRole', userData.role || 'customer');
    if (userData.profilePicture || userData.avatar) {
        localStorage.setItem('userAvatar', userData.profilePicture || userData.avatar);
    }
    if (userData.googleId) {
        localStorage.setItem('userGoogleId', userData.googleId);
    }
    if (userData.firstName) {
        localStorage.setItem('userFirstName', userData.firstName);
    }
    if (userData.lastName) {
        localStorage.setItem('userLastName', userData.lastName);
    }
    if (userData.authProvider) {
        localStorage.setItem('authProvider', userData.authProvider);
    }
    localStorage.setItem('isLoggedIn', 'true');
    syncNavbarUser();
}

function logoutUser() {
    const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
    localStorage.removeItem('farmToForkUser');
    localStorage.removeItem('farmToForkToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userGoogleId');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('authProvider');
    localStorage.removeItem('isLoggedIn');
    syncNavbarUser();
    
    showNotification(
        isTa ? 'வெற்றிகரமாக வெளியேறினீர்கள். முகப்புப் பக்கத்திற்குத் திரும்புகிறது! 👋' : 'Logged out successfully. Returning to main menu! 👋',
        'fas fa-sign-out-alt'
    );
    
    setTimeout(() => {
        const isPages = window.location.pathname.includes('/pages/');
        window.location.href = isPages ? '../index.html' : 'index.html';
    }, 700);
}

function syncNavbarUser() {
    const user = getCurrentUser();
    const isPages = window.location.pathname.includes('/pages/');
    const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
    const loginBtns = document.querySelectorAll('.btn-login, .btn-signup');
    const navActions = document.querySelector('.navbar .nav-actions') || document.querySelector('.nav-actions');
    const isHomePage = !isPages || window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/MWT%20EL/') || window.location.pathname.endsWith('/MWT EL/');

    // Update body and root auth state classes
    if (user) {
        document.documentElement.classList.add('user-logged-in');
        document.documentElement.classList.remove('user-logged-out');
        if (document.body) {
            document.body.classList.add('user-logged-in');
            document.body.classList.remove('user-logged-out');
        }
    } else {
        document.documentElement.classList.remove('user-logged-in');
        document.documentElement.classList.add('user-logged-out');
        if (document.body) {
            document.body.classList.remove('user-logged-in');
            document.body.classList.add('user-logged-out');
        }
    }

    // Home Page specific: Wishlist and Cart are only visible after login
    const wishlistLinks = document.querySelectorAll('#navWishlistLink, .nav-wishlist-link');
    const cartBtns = document.querySelectorAll('#navCartBtn, .cart-btn');

    if (isHomePage) {
        if (user) {
            wishlistLinks.forEach(el => el.style.setProperty('display', 'inline-flex', 'important'));
            cartBtns.forEach(el => el.style.setProperty('display', 'inline-flex', 'important'));
        } else {
            wishlistLinks.forEach(el => el.style.setProperty('display', 'none', 'important'));
            cartBtns.forEach(el => el.style.setProperty('display', 'none', 'important'));
        }
    } else {
        wishlistLinks.forEach(el => el.style.removeProperty('display'));
        cartBtns.forEach(el => el.style.removeProperty('display'));
    }

    if (user && navActions) {
        let dashboardUrl = '';
        let roleBadgeName = '';
        let roleIcon = 'fa-user';

        switch(user.role) {
            case 'farmer':
                dashboardUrl = isPages ? 'dashboard-farmer.html' : 'pages/dashboard-farmer.html';
                roleBadgeName = isTa ? 'விவசாயி' : 'Farmer';
                roleIcon = 'fa-tractor';
                break;
            case 'artisan':
                dashboardUrl = isPages ? 'dashboard-artisan.html' : 'pages/dashboard-artisan.html';
                roleBadgeName = isTa ? 'கைவினைஞர்' : 'Artisan';
                roleIcon = 'fa-hand-sparkles';
                break;
            case 'admin':
                dashboardUrl = isPages ? 'dashboard-admin.html' : 'pages/dashboard-admin.html';
                roleBadgeName = isTa ? 'நிர்வாகி' : 'Admin';
                roleIcon = 'fa-shield-alt';
                break;
            default:
                dashboardUrl = isPages ? 'dashboard-customer.html' : 'pages/dashboard-customer.html';
                roleBadgeName = isTa ? 'வாடிக்கையாளர்' : 'Customer';
                roleIcon = 'fa-user-circle';
        }

        const existingUserWidget = document.getElementById('navbarUserWidget');
        if (existingUserWidget) existingUserWidget.remove();

        // Hide standard login/signup buttons
        loginBtns.forEach(btn => {
            if (!btn.closest('#navbarUserWidget')) {
                btn.style.display = 'none';
            }
        });

        const fullName = (user.name && user.name.trim()) || (isTa ? 'பயனர்' : 'User');
        const welcomeText = isTa ? `வணக்கம், ${fullName}` : `Hi, ${fullName}`;
        const pic = user.profilePicture || user.avatar || localStorage.getItem('userAvatar');
        const userAvatarHtml = pic 
            ? `<img src="${pic}" alt="${fullName}" style="width:22px; height:22px; border-radius:50%; object-fit:cover; margin-right:2px; vertical-align:middle;" onerror="this.outerHTML='<i class=\\'fas ${roleIcon}\\'></i>';">`
            : `<i class="fas ${roleIcon}"></i>`;

        const widget = document.createElement('div');
        widget.id = 'navbarUserWidget';
        widget.className = 'navbar-user-widget';
        widget.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; font-size: 0.88rem; flex-shrink: 0; white-space: nowrap;';
        widget.innerHTML = `
            <a href="${dashboardUrl}" class="btn-signup nav-user-profile-btn" title="${isTa ? 'கட்டுப்பாட்டு அறைக்குச் செல்லவும்' : 'Go to Role Dashboard'}" style="height: 38px; padding: 0 12px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px; border-radius: 50px; white-space: nowrap;">
                ${userAvatarHtml}
                <span class="nav-user-greeting" style="display: inline-block; font-weight: 700; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle;" title="${fullName}">${welcomeText}</span>
                <span class="nav-user-role-badge" style="font-size: 0.68rem; opacity: 0.95; background: rgba(255,255,255,0.28); padding: 2px 7px; border-radius: 6px; font-weight: 700; flex-shrink: 0;">${roleBadgeName}</span>
            </a>
            <button onclick="logoutUser()" class="nav-logout-btn" title="${isTa ? 'வெளியேறு' : 'Logout'}" aria-label="Logout" style="background: var(--bg-secondary, rgba(45, 106, 79, 0.08)); border: 1px solid var(--border); color: var(--text); cursor: pointer; border-radius: 50%; width: 38px; height: 38px; min-width: 38px; display: inline-flex; align-items: center; justify-content: center; transition: var(--transition); flex-shrink: 0; padding: 0;">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;

        const hamburger = navActions.querySelector('.hamburger');
        if (hamburger) {
            navActions.insertBefore(widget, hamburger);
        } else {
            navActions.appendChild(widget);
        }
    } else {
        // Not logged in: remove any widget and show login/signup buttons
        const existingUserWidget = document.getElementById('navbarUserWidget');
        if (existingUserWidget) existingUserWidget.remove();
        loginBtns.forEach(btn => {
            btn.style.display = '';
        });
    }

    // Admin-Only Navigation Visibility (API Docs)
    const activeUser = getCurrentUser();
    const activeRole = (activeUser && activeUser.role) || localStorage.getItem('userRole') || '';
    const isAdmin = activeRole === 'admin';
    document.querySelectorAll('#navApiDocsLink, #navShopApiDocs, .admin-only-nav, [data-admin-only]').forEach(el => {
        el.style.display = isAdmin ? 'inline-flex' : 'none';
    });
}

// ============================================
// SYSTEM-WIDE THEME (DARK / LIGHT) MANAGEMENT
// ============================================
function getStoredTheme() {
    try {
        const t = localStorage.getItem('ftf_theme') || localStorage.getItem('farmToForkTheme') || 'emerald';
        if (t === 'dark') return 'midnight';
        if (t === 'light') return 'emerald';
        return t;
    } catch (e) {
        return 'emerald';
    }
}

function setStoredTheme(theme) {
    try {
        const normalized = (theme === 'dark') ? 'midnight' : ((theme === 'light') ? 'emerald' : theme);
        localStorage.setItem('ftf_theme', normalized);
        localStorage.setItem('farmToForkTheme', normalized); // backward compatibility
    } catch (e) {
        console.warn('LocalStorage unavailable for theme storage:', e);
    }
}

function applyTheme(theme) {
    const normalized = (theme === 'dark') ? 'midnight' : ((theme === 'light') ? 'emerald' : (theme || 'emerald'));
    const isDark = normalized === 'midnight';
    
    document.documentElement.setAttribute('data-theme', normalized);
    if (document.body) {
        document.body.setAttribute('data-theme', normalized);
    }

    if (isDark) {
        document.documentElement.classList.add('dark-theme');
        if (document.body) {
            document.body.classList.add('dark-theme');
        }
    } else {
        document.documentElement.classList.remove('dark-theme');
        if (document.body) {
            document.body.classList.remove('dark-theme');
        }
    }
    
    updateThemeIcon(isDark);

    if (window.FTF_THEMES && typeof window.FTF_THEMES.apply === 'function' && window.FTF_THEMES.apply !== applyTheme) {
        window.FTF_THEMES.apply(normalized);
    }
}

function initTheme() {
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);
    ensureThemeToggleButton();
}

function toggleTheme() {
    const currentTheme = getStoredTheme();
    const newTheme = (currentTheme === 'midnight' || document.documentElement.classList.contains('dark-theme') || (document.body && document.body.classList.contains('dark-theme'))) ? 'emerald' : 'midnight';
    
    setStoredTheme(newTheme);
    applyTheme(newTheme);
    
    // Announce to any listening modules
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: newTheme === 'midnight', theme: newTheme } }));
    window.dispatchEvent(new CustomEvent('ftf:themeChanged', { detail: { isDark: newTheme === 'midnight', theme: newTheme } }));
}

function updateThemeIcon(isDark) {
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.setAttribute('title', isDark ? 'Switch Theme' : 'Switch Theme');
        btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
}

function ensureThemeToggleButton() {
    const navActions = document.querySelector('.navbar .nav-actions') || document.querySelector('.nav-actions');
    if (navActions && !document.querySelector('.navbar .theme-toggle') && !document.querySelector('.top-bar .theme-toggle')) {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle';
        themeBtn.setAttribute('onclick', 'toggleTheme()');
        themeBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
        themeBtn.style.cssText = 'background: rgba(45, 106, 79, 0.08); border: 1px solid var(--border); border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text); font-size: 1rem; transition: var(--transition); flex-shrink: 0;';
        
        const isDark = getStoredTheme() === 'dark';
        themeBtn.innerHTML = `<i class="${isDark ? 'fas fa-sun' : 'fas fa-moon'}"></i>`;
        
        const hamburger = navActions.querySelector('.hamburger');
        if (hamburger) {
            navActions.insertBefore(themeBtn, hamburger);
        } else {
            navActions.appendChild(themeBtn);
        }
    }
}

// Immediate execution for fast zero-flicker application
if (typeof document !== 'undefined') {
    const initialTheme = getStoredTheme();
    if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (document.body) {
            document.body.classList.add('dark-theme');
        }
    }
}

if (typeof window !== 'undefined') {
    window.toggleTheme = toggleTheme;
    window.initTheme = initTheme;
    window.applyTheme = applyTheme;
    window.getStoredTheme = getStoredTheme;
    window.setStoredTheme = setStoredTheme;
}

// ============================================
// CART MANAGEMENT (Cross-page)
// ============================================
var cart = window.cart || [];
window.cart = cart;

function loadCart() {
    try {
        const saved = localStorage.getItem('farmToForkCart');
        cart = saved ? JSON.parse(saved) : [];
    } catch (e) {
        cart = [];
    }
    window.cart = cart;
    updateCartBadge();
}

function saveCart() {
    window.cart = cart;
    localStorage.setItem('farmToForkCart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(productId, quantity = 1, showToast = true, farmerId = null) {
    loadCart();
    const product = getProductById(productId);
    if (!product) return;

    // If product has multiple farmers and no farmerId was explicitly chosen, prompt farmer comparison modal
    // "When a customer searches or opens a product like Tomato, do not show only one product. Display all farmers selling that product... The customer selects a farmer first, then buys products from that farmer."
    if (!farmerId && window.FTF_MARKETPLACE && typeof window.FTF_MARKETPLACE.getFarmersForProduct === 'function') {
        const farmers = window.FTF_MARKETPLACE.getFarmersForProduct(product.id);
        if (farmers && farmers.length > 1) {
            window.FTF_MARKETPLACE.openFarmerComparisonModal(product.id, product.name);
            return;
        }
    }

    // If a specific farmerId is provided, pull listing
    let farmerListing = null;
    if (farmerId && window.FTF_MARKETPLACE && typeof window.FTF_MARKETPLACE.getFarmerListing === 'function') {
        farmerListing = window.FTF_MARKETPLACE.getFarmerListing(productId, farmerId);
    }

    const finalPrice = farmerListing ? farmerListing.price : product.price;
    const finalOrigPrice = farmerListing ? farmerListing.originalPrice : product.originalPrice;
    const finalSeller = farmerListing ? farmerListing.farmName : product.seller;
    const finalFarmerName = farmerListing ? farmerListing.farmerName : (product.farmerName || product.seller);
    const finalLocation = farmerListing ? farmerListing.formattedLocation : (product.origin || '');
    const finalDistance = farmerListing ? farmerListing.distanceKm : (product.distanceKm || null);
    const finalFarmerId = farmerListing ? farmerListing.farmerId : (farmerId || product.farmerId || null);

    // Do NOT merge products from different farmers into one listing!
    // Match by product ID and identical farmerId (or seller if no farmerId)
    const existingIndex = cart.findIndex(item => 
        item.id === product.id && 
        (finalFarmerId ? item.farmerId === finalFarmerId : item.seller === finalSeller)
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: finalPrice,
            originalPrice: finalOrigPrice,
            unit: product.unit || 'kg',
            quantity: quantity,
            image: (farmerListing && farmerListing.productImage) ? farmerListing.productImage : product.image,
            category: product.category,
            seller: finalSeller,
            farmerId: finalFarmerId,
            farmerName: finalFarmerName,
            farmName: finalSeller,
            farmLocation: finalLocation,
            distanceKm: finalDistance,
            harvestDate: farmerListing ? farmerListing.harvestDate : (product.harvestDate || '')
        });
    }

    saveCart();

    if (showToast) {
        const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
        const msg = isTa
            ? `🌾 <strong>${finalFarmerName}</strong> இடமிருந்து <strong>${product.name}</strong> கூடையில் சேர்க்கப்பட்டது! 🛒`
            : `🌾 Added <strong>${product.name}</strong> from <strong>${finalFarmerName}</strong> to cart! 🛒`;
        showNotification(msg, 'fas fa-cart-plus');
    }
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// ============================================
// WISHLIST MANAGEMENT
// ============================================
function getWishlist() {
    try {
        const raw = localStorage.getItem('farmToForkWishlist');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {}
    return [1, 21, 23, 25];
}

function addToWishlist(productId) {
    const list = getWishlist();
    const numId = parseInt(productId, 10);
    if (!list.includes(numId)) {
        list.push(numId);
        localStorage.setItem('farmToForkWishlist', JSON.stringify(list));
    }
    const product = typeof getProductById === 'function' ? getProductById(numId) : null;
    showNotification(`<strong>${product ? product.name : 'Item'}</strong> added to Wishlist! ❤️`, 'fas fa-heart');
}

function removeFromWishlist(productId) {
    let list = getWishlist();
    const numId = parseInt(productId, 10);
    list = list.filter(id => id !== numId);
    localStorage.setItem('farmToForkWishlist', JSON.stringify(list));
    showNotification('Item removed from Wishlist 💔', 'fas fa-heart-broken');
}

function toggleWishlist(productId) {
    const list = getWishlist();
    const numId = parseInt(productId, 10);
    if (list.includes(numId)) {
        removeFromWishlist(numId);
        return false;
    } else {
        addToWishlist(numId);
        return true;
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showNotification(message, icon = 'fas fa-check-circle', type = 'success') {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `notification-toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content" style="display: flex; align-items: center; gap: 12px;">
            <i class="${icon}" style="color: var(--primary); font-size: 1.2rem;"></i>
            <div style="font-size: 0.9rem; line-height: 1.4;">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--text-light); font-size: 1.1rem; cursor: pointer; padding: 0 4px;">✕</button>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--white);
        color: var(--text);
        padding: 14px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.18);
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        animation: slideUp 0.4s ease;
        border-left: 4px solid var(--primary);
        max-width: 380px;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }
    }, 3500);
}

// ============================================
// SEARCH & SEARCH OVERLAY
// ============================================
function toggleSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.classList.toggle('active');
    if (overlay.classList.contains('active')) {
        const input = document.getElementById('searchInput');
        if (input) input.focus();
    }
}

function initSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('searchSuggestions');
    const isPages = window.location.pathname.includes('/pages/');

    if (searchInput && suggestions) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    toggleSearch();
                    window.location.href = isPages ? `products.html?search=${encodeURIComponent(query)}` : `pages/products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });

        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            const isTa = (localStorage.getItem('ftf_lang') || 'en') === 'ta';
            if (query.length > 0) {
                const results = products.filter(p => 
                    p.name.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query) ||
                    p.seller.toLowerCase().includes(query)
                ).slice(0, 6);

                suggestions.style.display = 'block';
                if (results.length === 0) {
                    suggestions.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-light);">${isTa ? `"${query}" -க்கு பொருட்கள் எதுவும் கிடைக்கவில்லை` : `No products found for "${query}"`}</div>`;
                } else {
                    suggestions.innerHTML = results.map(p => {
                        const targetUrl = isPages ? `product-details.html?id=${p.id}` : `pages/product-details.html?id=${p.id}`;
                        const farmers = (window.FTF_MARKETPLACE && typeof window.FTF_MARKETPLACE.getFarmersForProduct === 'function')
                            ? window.FTF_MARKETPLACE.getFarmersForProduct(p.id)
                            : null;
                        const multiBadge = (farmers && farmers.length > 1) 
                            ? `<span style="background: #dcfce7; color: #166534; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 10px; margin-left: 6px;">🌾 ${farmers.length} ${isTa ? 'விவசாயிகள்' : 'Farmers'}</span>`
                            : '';

                        return `
                            <div style="padding: 10px 16px; border-bottom: 1px solid rgba(0,0,0,0.06); cursor: pointer; display: flex; align-items: center; gap: 12px;" onclick="window.location.href='${targetUrl}'">
                                <img src="${getProductImagePath(p.image)}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" onerror="this.src='${p.backupImage || 'https://via.placeholder.com/100'}'" />
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 0.95rem; display: flex; align-items: center;">
                                        ${p.name} ${multiBadge}
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-light);">₹${p.price}/${p.unit} • ${p.seller}</div>
                                </div>
                                <button onclick="event.stopPropagation(); addToCart(${p.id}); toggleSearch();" style="padding: 6px 12px; background: var(--primary); color: white; border: none; border-radius: 6px; font-size: 0.8rem; cursor: pointer; font-weight: 600;">
                                    ${(farmers && farmers.length > 1) ? (isTa ? 'ஒப்பிடு' : 'Compare') : (isTa ? '+ சேர்' : '+ Add')}
                                </button>
                            </div>
                        `;
                    }).join('');
                }
            } else {
                suggestions.style.display = 'none';
            }
        });
    }
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('active');
}

// ============================================
// COUNTERS & SCROLL ANIMATION
// ============================================
function animateCounters() {
    document.querySelectorAll('.impact-number, .stat-number').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        if (!target) return;
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current.toLocaleString();
        }, 25);
    });
}

function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.feature-card, .category-card, .product-card, .impact-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });
}

// ============================================
// QR SCAN SIMULATOR
// ============================================
function scanQRCode(productId) {
    if (typeof triggerTraceModal === 'function') {
        triggerTraceModal();
        return;
    }
    const id = productId || (typeof currentSelectedProductId !== 'undefined' ? currentSelectedProductId : null);
    const p = (id && getProductById(id)) || products[0];
    showNotification(`
        <strong>📱 Seed-to-Plate Trace Verified</strong><br>
        🌱 <strong>Product:</strong> ${p.name}<br>
        🏡 <strong>Farm:</strong> ${p.seller} (${p.origin})<br>
        📅 <strong>Harvested:</strong> ${p.harvestDate}<br>
        🔬 <strong>Pesticide Residue:</strong> 0.0% (Certified Organic)
    `, 'fas fa-qrcode');
}

// ============================================
// RENDER HOMEPAGE FEATURED PRODUCTS
// ============================================
function renderHomepageFeatured() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.slice(0, 8);
    const isPages = window.location.pathname.includes('/pages/');

    container.innerHTML = featured.map(product => {
        let badgeClass = 'badge-fresh';
        if (product.category === 'frozen') badgeClass = 'badge-frozen';
        else if (product.freshness === 'Good') badgeClass = 'badge-good';

        const detailUrl = isPages ? `product-details.html?id=${product.id}` : `pages/product-details.html?id=${product.id}`;

        return `
            <div class="product-card animate-scale" onclick="window.location.href='${detailUrl}'" style="cursor: pointer;">
                <div style="position: relative; overflow: hidden; border-radius: 12px 12px 0 0;">
                    <img src="${getProductImagePath(product.image)}" alt="${product.name}" onerror="this.src='${product.backupImage || 'https://via.placeholder.com/400x300?text=Product'}'" style="width: 100%; height: 200px; object-fit: cover; transition: transform 0.4s ease;">
                    <div class="product-badge ${badgeClass}">${product.badge}</div>
                </div>
                <div class="product-info" style="padding: 16px;">
                    <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; text-transform: uppercase;">${product.category}</div>
                    <h3 class="product-name" style="margin: 4px 0; font-size: 1.1rem;">${product.name}</h3>
                    <p class="product-seller" style="color: var(--text-light); font-size: 0.85rem; margin-bottom: 8px;">
                        <i class="fas fa-store"></i> ${product.seller}
                    </p>
                    <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;">
                        <span class="product-price" style="font-size: 1.3rem; font-weight: 800; color: var(--primary);">₹${product.price}</span>
                        <span class="product-original" style="text-decoration: line-through; color: var(--text-light); font-size: 0.9rem;">₹${product.originalPrice}</span>
                        <span style="font-size: 0.85rem; color: var(--text-light);">/${product.unit}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.85rem;">
                        <span class="freshness-badge ${badgeClass}" style="padding: 2px 8px; border-radius: 6px; font-size: 0.75rem;">${product.freshness}</span>
                        <span style="color: #FFB300;">★ ${product.rating} <span style="color: var(--text-light); font-size: 0.8rem;">(${product.reviewsCount})</span></span>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 6px;">
                        <button onclick="event.stopPropagation(); addToCart(${product.id});" style="flex: 1; padding: 10px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.85rem; transition: transform 0.2s;">
                            <i class="fas fa-shopping-bag"></i> Add
                        </button>
                        <button onclick="event.stopPropagation(); window.location.href='${isPages ? 'seed-to-plate.html?batch=' + (product.batchCode || 'FTF-TOM-2024-001') : 'pages/seed-to-plate.html?batch=' + (product.batchCode || 'FTF-TOM-2024-001')}';" style="padding: 10px 14px; background: #f0fdf4; color: var(--primary-dark); border: 1.5px solid #86efac; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.8rem;" title="Trace Born to Delivery Journey">
                            <i class="fas fa-qrcode"></i> Trace
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// GLOBAL LANGUAGE SWITCHER & MULTI-PAGE TRANSLATION
// ============================================
function getStoredLanguage() {
    return localStorage.getItem('ftf_lang') || 'en';
}

function setGlobalLanguage(lang) {
    localStorage.setItem('ftf_lang', lang);
    const isTa = lang === 'ta';

    // 1. Invoke centralized FTF_I18N engine if loaded
    if (window.FTF_I18N && typeof window.FTF_I18N.apply === 'function') {
        window.FTF_I18N.apply(lang);
    }

    // 2. Call page-specific handlers if defined
    if (typeof window.setHomeLanguage === 'function') {
        window.setHomeLanguage(lang);
    } else if (typeof window.setShopLanguage === 'function') {
        window.setShopLanguage(lang);
    } else if (typeof window.setDetailLanguage === 'function') {
        window.setDetailLanguage(lang);
    } else if (typeof window.setLanguage === 'function') {
        window.setLanguage(lang);
    }

    // 3. Re-sync navbar user badge with active language
    syncNavbarUser();

    // 4. Update all navbar and top-bar language buttons
    document.querySelectorAll('.btn-lang-en, #btnShopLangEn, #btnHomeLangEn, #btnDetailLangEn, #btnLangEn').forEach(el => {
        if (lang === 'en') {
            el.classList.add('active');
            el.style.background = 'white';
            el.style.color = 'var(--primary-dark)';
        } else {
            el.classList.remove('active');
            el.style.background = 'transparent';
            el.style.color = 'rgba(255,255,255,0.85)';
        }
    });

    document.querySelectorAll('.btn-lang-ta, #btnShopLangTa, #btnHomeLangTa, #btnDetailLangTa, #btnLangTa').forEach(el => {
        if (lang === 'ta') {
            el.classList.add('active');
            el.style.background = 'white';
            el.style.color = 'var(--primary-dark)';
        } else {
            el.classList.remove('active');
            el.style.background = 'transparent';
            el.style.color = 'rgba(255,255,255,0.85)';
        }
    });

    // Ensure legacy 2-language switchers are cleanly purged from DOM
    const legacyFloat = document.getElementById('globalFloatingLangBtn');
    if (legacyFloat) legacyFloat.remove();
    document.querySelectorAll('.floating-lang-btn, .nav-lang-pill, .lang-switch-wrap').forEach(el => el.remove());

    // 6. Translate common navbar links across all pages
    const navHome = document.getElementById('navHomeLink') || document.getElementById('navHome');
    const navShop = document.getElementById('navShopLink') || document.getElementById('navShop');
    const navKitchen = document.getElementById('navKitchenLink') || document.getElementById('navKitchen');
    const navGroup = document.getElementById('navGroupLink') || document.getElementById('navGroup');
    const navSeed = document.getElementById('navSeedLink') || document.getElementById('navSeed');
    const navLogin = document.getElementById('navLoginBtn') || document.querySelector('.btn-login');
    const navSignup = document.getElementById('navSignupBtn') || document.querySelector('.btn-signup');

    if (navHome) navHome.textContent = isTa ? 'முகப்பு' : 'Home';
    if (navShop) navShop.textContent = isTa ? 'விளைபொருட்கள்' : 'Shop';
    if (navKitchen) navKitchen.textContent = isTa ? 'சமுதாய சமையலறை' : 'Community Kitchen';
    if (navGroup) navGroup.textContent = isTa ? 'குழு கொள்முதல்' : 'Group Buying';
    if (navSeed) navSeed.textContent = isTa ? 'விதையிலிருந்து தட்டு வரை' : 'Seed to Plate';
    if (navLogin && !navLogin.closest('#navbarUserWidget')) navLogin.textContent = isTa ? 'உள்நுழைக' : 'Login';
    if (navSignup && !navSignup.closest('#navbarUserWidget')) navSignup.textContent = isTa ? 'பதிவு செய்க' : 'Sign Up';
}

function initGlobalLanguageSwitcher() {
    const currentLang = getStoredLanguage();

    // 1. Ensure centralized i18n engine is present
    if (typeof window.FTF_I18N === 'undefined') {
        const isPages = window.location.pathname.includes('/pages/');
        const s = document.createElement('script');
        s.src = isPages ? '../js/i18n.js' : 'js/i18n.js';
        s.onload = () => {
            if (window.FTF_I18N && typeof window.FTF_I18N.apply === 'function') {
                window.FTF_I18N.apply(currentLang);
            }
        };
        document.head.appendChild(s);
    }

    // Remove legacy 2-language toggle buttons if present
    const legacyFloat = document.getElementById('globalFloatingLangBtn');
    if (legacyFloat) legacyFloat.remove();
    document.querySelectorAll('.floating-lang-btn, .nav-lang-pill, .lang-switch-wrap').forEach(el => el.remove());

    // Apply language state
    setGlobalLanguage(currentLang);
}

// ============================================
// MOBILE DASHBOARD SIDEBAR CONTROLLER
// ============================================
function toggleMobileSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.toggle('sidebar-open');
    if (backdrop) backdrop.classList.toggle('active');
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('dashboardSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('sidebar-open');
    if (backdrop) backdrop.classList.remove('active');
}

// ============================================
// INTERACTIVE FEATURE MODALS (OUR UNIQUE FEATURES)
// ============================================
function openSustainabilityModal() {
    const m = document.getElementById('sustainabilityModal');
    if (m) m.classList.add('active');
}
function closeSustainabilityModal() {
    const m = document.getElementById('sustainabilityModal');
    if (m) m.classList.remove('active');
}

function openCarbonFootprintModal() {
    const m = document.getElementById('carbonFootprintModal');
    if (m) m.classList.add('active');
}
function closeCarbonFootprintModal() {
    const m = document.getElementById('carbonFootprintModal');
    if (m) m.classList.remove('active');
}
function updateCarbonCalc(qtyKg) {
    const val = parseFloat(qtyKg) || 1;
    const label = document.getElementById('carbonSliderVal');
    if (label) label.textContent = `${val} kg`;
    
    // Formula: 1.03 km saved per kg factor * 0.171 kg CO2 emission factor
    const co2Saved = (val * 1.761).toFixed(2);
    const waterSaved = Math.round(val * 14);
    const kmSaved = Math.round(val * 10.3);
    
    const dispCo2 = document.getElementById('calcCo2Saved');
    const dispWater = document.getElementById('calcWaterSaved');
    const dispKm = document.getElementById('calcKmSaved');
    
    if (dispCo2) dispCo2.textContent = `${co2Saved} kg`;
    if (dispWater) dispWater.textContent = `${waterSaved} L`;
    if (dispKm) dispKm.textContent = `${kmSaved} km`;
}

function openSeasonalBoxModal() {
    const m = document.getElementById('seasonalBoxModal');
    if (m) m.classList.add('active');
}
function closeSeasonalBoxModal() {
    const m = document.getElementById('seasonalBoxModal');
    if (m) m.classList.remove('active');
}

if (typeof window !== 'undefined') {
    window.setGlobalLanguage = setGlobalLanguage;
    window.getStoredLanguage = getStoredLanguage;
    window.initGlobalLanguageSwitcher = initGlobalLanguageSwitcher;
    window.toggleMobileSidebar = toggleMobileSidebar;
    window.closeMobileSidebar = closeMobileSidebar;
    window.openSustainabilityModal = openSustainabilityModal;
    window.closeSustainabilityModal = closeSustainabilityModal;
    window.openCarbonFootprintModal = openCarbonFootprintModal;
    window.closeCarbonFootprintModal = closeCarbonFootprintModal;
    window.updateCarbonCalc = updateCarbonCalc;
    window.openSeasonalBoxModal = openSeasonalBoxModal;
    window.closeSeasonalBoxModal = closeSeasonalBoxModal;
    window.openContactModal = openContactModal;
    window.closeContactModal = closeContactModal;
}

// ============================================
// GLOBAL INTERACTIVE CONTACT MODAL & EMAIL SUPPORT
// ============================================
function ensureContactModal() {
    let modal = document.getElementById('ftfGlobalContactModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'ftfGlobalContactModal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); z-index:999999; display:none; align-items:center; justify-content:center; padding:16px;';
    modal.innerHTML = `
        <div style="background:var(--card, #ffffff); color:var(--text, #1e293b); border:1.5px solid var(--border, #e2e8f0); border-radius:20px; max-width:500px; width:100%; padding:28px; box-shadow:0 25px 60px rgba(0,0,0,0.25); position:relative; max-height:90vh; overflow-y:auto;">
            <button type="button" onclick="closeContactModal()" style="position:absolute; top:16px; right:16px; background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--text-light, #94a3b8); line-height:1;">✕</button>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                <span style="font-size:1.8rem;">🌱</span>
                <div>
                    <h3 style="margin:0; font-size:1.3rem; font-weight:800; color:var(--text, #0f172a);">Contact Us</h3>
                    <p style="margin:2px 0 0; font-size:0.82rem; color:var(--primary, #16a34a); font-weight:600;">Official Admin: anushiyaselvi06@gmail.com</p>
                </div>
            </div>
            <p style="color:var(--text-light, #64748b); font-size:0.88rem; margin:0 0 18px; line-height:1.5;">Have a question about our organic harvests, seed-to-plate traceability, or community kitchens? Send us a message and receive an instant email confirmation.</p>
            
            <form id="globalContactForm" onsubmit="handleGlobalContactSubmit(event)">
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.82rem; font-weight:700; margin-bottom:4px; color:var(--text, #334155);">Your Name *</label>
                    <input type="text" id="contactModalName" required placeholder="e.g. Anushiya Selvi" style="width:100%; box-sizing:border-box; padding:10px 14px; border:1.5px solid var(--border, #cbd5e1); border-radius:10px; background:var(--bg, #f8fafc); color:var(--text, #0f172a); font-size:0.9rem; outline:none;" />
                </div>
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.82rem; font-weight:700; margin-bottom:4px; color:var(--text, #334155);">Registered Email Address *</label>
                    <input type="email" id="contactModalEmail" required placeholder="name@gmail.com" style="width:100%; box-sizing:border-box; padding:10px 14px; border:1.5px solid var(--border, #cbd5e1); border-radius:10px; background:var(--bg, #f8fafc); color:var(--text, #0f172a); font-size:0.9rem; outline:none;" />
                </div>
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.82rem; font-weight:700; margin-bottom:4px; color:var(--text, #334155);">Phone (Optional)</label>
                    <input type="tel" id="contactModalPhone" placeholder="+91 98765 43210" style="width:100%; box-sizing:border-box; padding:10px 14px; border:1.5px solid var(--border, #cbd5e1); border-radius:10px; background:var(--bg, #f8fafc); color:var(--text, #0f172a); font-size:0.9rem; outline:none;" />
                </div>
                <div style="margin-bottom:12px;">
                    <label style="display:block; font-size:0.82rem; font-weight:700; margin-bottom:4px; color:var(--text, #334155);">Subject *</label>
                    <input type="text" id="contactModalSubject" required placeholder="e.g. Inquiry about Organic Certification" style="width:100%; box-sizing:border-box; padding:10px 14px; border:1.5px solid var(--border, #cbd5e1); border-radius:10px; background:var(--bg, #f8fafc); color:var(--text, #0f172a); font-size:0.9rem; outline:none;" />
                </div>
                <div style="margin-bottom:18px;">
                    <label style="display:block; font-size:0.82rem; font-weight:700; margin-bottom:4px; color:var(--text, #334155);">Message *</label>
                    <textarea id="contactModalMessage" required rows="3" placeholder="Write your message here..." style="width:100%; box-sizing:border-box; padding:10px 14px; border:1.5px solid var(--border, #cbd5e1); border-radius:10px; background:var(--bg, #f8fafc); color:var(--text, #0f172a); font-size:0.9rem; outline:none; resize:vertical;"></textarea>
                </div>
                <button type="submit" id="btnSubmitContact" style="width:100%; padding:13px; background:linear-gradient(135deg, #15803d, #16a34a); color:#ffffff; border:none; border-radius:10px; font-weight:700; font-size:0.95rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
                    <span>Send Message & Trigger Email</span> ✉️
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

function openContactModal() {
    const modal = ensureContactModal();
    const emailField = document.getElementById('contactModalEmail');
    const nameField = document.getElementById('contactModalName');
    
    // Auto-populate from logged in user if available
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    if (emailField && savedEmail) emailField.value = savedEmail;
    if (nameField && savedName) nameField.value = savedName;

    modal.style.display = 'flex';
}

function closeContactModal() {
    const modal = document.getElementById('ftfGlobalContactModal');
    if (modal) modal.style.display = 'none';
}

async function handleGlobalContactSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitContact');
    const name = document.getElementById('contactModalName').value.trim();
    const email = document.getElementById('contactModalEmail').value.trim();
    const phone = document.getElementById('contactModalPhone').value.trim();
    const subject = document.getElementById('contactModalSubject').value.trim();
    const message = document.getElementById('contactModalMessage').value.trim();

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Sending & Dispatching Email...</span> ⏳';
    }

    try {
        let res = null;
        if (window.FTF_API && window.FTF_API.contact && window.FTF_API.contact.sendMessage) {
            res = await window.FTF_API.contact.sendMessage({ name, email, phone, subject, message });
        } else {
            const raw = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, subject, message })
            });
            res = await raw.json();
        }

        if (res && res.success) {
            if (typeof showNotification === 'function') {
                showNotification('✅ Message sent! A confirmation email has been dispatched to your inbox.');
            } else {
                alert('✅ Message sent! A confirmation email has been dispatched to your inbox.');
            }
            closeContactModal();
            const form = document.getElementById('globalContactForm');
            if (form) form.reset();
        } else {
            const err = (res && res.message) || 'Failed to deliver message.';
            if (typeof showNotification === 'function') showNotification('⚠️ ' + err);
            else alert('⚠️ ' + err);
        }
    } catch (err) {
        console.warn('Contact submit error:', err);
        if (typeof showNotification === 'function') showNotification('⚠️ Server offline or request failed.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>Send Message & Trigger Email</span> ✉️';
        }
    }
}

function wireUpContactLinks() {
    // Wire up all "Contact Us" links on current page
    document.querySelectorAll('a, button').forEach(el => {
        const text = (el.textContent || '').trim().toLowerCase();
        if (text === 'contact us' || text === 'contact' || el.id === 'footerLinkContact') {
            el.addEventListener('click', function(ev) {
                ev.preventDefault();
                openContactModal();
            });
        }
    });
}

// ============================================
// INITIALIZATION ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    loadCart();
    syncNavbarUser();
    initSearchListeners();
    renderHomepageFeatured();
    animateCounters();
    initScrollAnimations();
    initGlobalLanguageSwitcher();
    wireUpContactLinks();

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('searchOverlay');
            if (overlay && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
            }
            closeContactModal();
        }
    });
});