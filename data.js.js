/data.js — Ten Digital MZ - Dados dos Produtos */

// ==========================================
// PRODUTOS — CATALOGO PRINCIPAL
// ==========================================
const products = [
    // FREE FIRE
    {
        id: 'ff-100',
        name: '100 Diamantes — Garena',
        category: 'ff',
        price: 100,
        region: 'Global',
        delivery: 'codigo_resgate',
        tag: 'Free Fire',
        badge: null,
        image: 'prod-img-ff'
    },
    {
        id: 'ff-310',
        name: '310 Diamantes — Garena',
        category: 'ff',
        price: 275,
        region: 'Global',
        delivery: 'codigo_resgate',
        tag: 'Free Fire',
        badge: 'Mais Vendido',
        image: 'prod-img-ff'
    },
    {
        id: 'ff-520',
        name: '520 Diamantes — Garena',
        category: 'ff',
        price: 425,
        region: 'Global',
        delivery: 'codigo_resgate',
        tag: 'Free Fire',
        badge: null,
        image: 'prod-img-ff'
    },
    {
        id: 'ff-1060',
        name: '1060 Diamantes — Garena',
        category: 'ff',
        price: 825,
        region: 'Global',
        delivery: 'codigo_resgate',
        tag: 'Free Fire',
        badge: 'Popular',
        image: 'prod-img-ff'
    },

    // GIFT CARDS — BRASIL
    {
        id: 'gc-gp-10',
        name: 'Google Play R$10 — Brasil',
        category: 'gc',
        price: 215,
        region: 'Brasil',
        delivery: 'codigo',
        tag: 'Gift Card',
        badge: null,
        image: 'prod-img-gc'
    },
    {
        id: 'gc-psn-100',
        name: 'PlayStation R$100 — Brasil',
        category: 'gc',
        price: 1499,
        region: 'Brasil',
        delivery: 'codigo',
        tag: 'Gift Card',
        badge: null,
        image: 'prod-img-gc'
    },
    {
        id: 'gc-xbox-50',
        name: 'Xbox Gift Card R$50 — Brasil',
        category: 'gc',
        price: 975,
        region: 'Brasil',
        delivery: 'codigo',
        tag: 'Gift Card',
        badge: null,
        image: 'prod-img-gc'
    },
    {
        id: 'gc-steam-20',
        name: 'Steam Gift Card R$20 — Brasil',
        category: 'gc',
        price: 425,
        region: 'Brasil',
        delivery: 'codigo',
        tag: 'Jogos',
        badge: null,
        image: 'prod-img-ga'
    },

    // GIFT CARDS — INTERNACIONAL
    {
        id: 'gc-apple-10-us',
        name: 'Apple iTunes $10 — USA',
        category: 'gc',
        price: 950,
        region: 'USA',
        delivery: 'codigo',
        tag: 'Gift Card',
        badge: null,
        image: 'prod-img-gc'
    },

    // STREAMING
    {
        id: 'st-netflix',
        name: 'Netflix Premium — 1 Mês',
        category: 'st',
        price: 900,
        region: 'Global',
        delivery: 'conta',
        tag: 'Streaming',
        badge: null,
        image: 'prod-img-st'
    },
    {
        id: 'st-spotify',
        name: 'Spotify Premium — 1 Mês',
        category: 'st',
        price: 450,
        region: 'Global',
        delivery: 'conta',
        tag: 'Streaming',
        badge: null,
        image: 'prod-img-st'
    },
    {
        id: 'st-disney',
        name: 'Disney+ Premium — 1 Mês',
        category: 'st',
        price: 800,
        region: 'Global',
        delivery: 'conta',
        tag: 'Streaming',
        badge: null,
        image: 'prod-img-st'
    },
    {
        id: 'st-youtube',
        name: 'YouTube Premium — 1 Mês',
        category: 'st',
        price: 400,
        region: 'Global',
        delivery: 'conta',
        tag: 'Streaming',
        badge: null,
        image: 'prod-img-st'
    },

    // JOGOS
    {
        id: 'ga-pubg-600',
        name: 'PUBG Mobile — 600 UC',
        category: 'ga',
        price: 560,
        region: 'Global',
        delivery: 'codigo_resgate',
        tag: 'Jogos',
        badge: null,
        image: 'prod-img-ga'
    },

    // INTERNACIONAL
    {
        id: 'in-paypal-10',
        name: 'Adição Saldo PayPal — $10 USD',
        category: 'in',
        price: 900,
        region: 'Internacional',
        delivery: 'conta',
        tag: 'Internacional',
        badge: null,
        image: 'prod-img-in'
    },
    {
        id: 'in-amazon-25',
        name: 'Amazon Gift Card $25 — USA',
        category: 'in',
        price: 2100,
        region: 'USA',
        delivery: 'codigo',
        tag: 'Internacional',
        badge: null,
        image: 'prod-img-in'
    }
];

// ==========================================
// PLANOS — STREAMING
// ==========================================
const streamingPlans = {
    netflix: [
        { name: 'Básico', price: 600 },
        { name: 'Standard', price: 750 },
        { name: 'Premium', price: 900 }
    ],
    spotify: [
        { name: 'Individual', price: 450 },
        { name: 'Duo', price: 550 },
        { name: 'Família', price: 700 }
    ],
    disney: [
        { name: 'Standard', price: 600 },
        { name: 'Premium', price: 800 },
        { name: 'Anual', price: 8000 }
    ],
    youtube: [
        { name: 'Individual', price: 400 },
        { name: 'Família', price: 600 }
    ],
    hbomax: [
        { name: 'Basic', price: 650 },
        { name: 'Ultimate', price: 950 }
    ],
    prime: [
        { name: 'Mensal', price: 500 },
        { name: 'Anual', price: 5000 }
    ]
};

// ==========================================
// PLANOS — FREE FIRE
// ==========================================
const freefirePlans = [
    { gems: 100, priceMin: 80, priceMax: 120 },
    { gems: 310, priceMin: 200, priceMax: 350 },
    { gems: 520, priceMin: 350, priceMax: 500 },
    { gems: 1060, priceMin: 700, priceMax: 950 },
    { gems: 2180, priceMin: 1300, priceMax: 1900 },
    { gems: 5600, priceMin: 3500, priceMax: 5000 }
];

// ==========================================
// REGIOES — GIFT CARDS
// ==========================================
const regions = [
    { code: 'us', name: 'Estados Unidos', flag: '🇺🇸', priceFrom: 950 },
    { code: 'br', name: 'Brasil', flag: '🇧🇷', priceFrom: 215 },
    { code: 'pt', name: 'Portugal', flag: '🇵🇹', priceFrom: 850 },
    { code: 'uk', name: 'Reino Unido', flag: '🇬🇧', priceFrom: 1100 },
    { code: 'za', name: 'África do Sul', flag: '🇿🇦', priceFrom: 600 },
    { code: 'ca', name: 'Canadá', flag: '🇨🇦', priceFrom: 900 },
    { code: 'au', name: 'Austrália', flag: '🇦🇺', priceFrom: 1000 },
    { code: 'de', name: 'Alemanha', flag: '🇩🇪', priceFrom: 950 },
    { code: 'ae', name: 'Dubai / UAE', flag: '🇦🇪', priceFrom: 1200 },
    { code: 'fr', name: 'França', flag: '🇫🇷', priceFrom: 920 }
];

// ==========================================
// TABELA DE PRECOS — INTERNACIONAL
// ==========================================
const priceTable = [
    // Google Play
    { product: 'Google Play', region: 'Brasil', value: 'R$10', price: '180 – 250 MT' },
    { product: 'Google Play', region: 'Brasil', value: 'R$50', price: '700 – 950 MT' },
    { product: 'Google Play', region: 'África do Sul', value: 'R100 ZAR', price: '500 – 700 MT' },
    // PlayStation
    { product: 'PlayStation', region: 'Brasil', value: 'R$35', price: '550 MT' },
    { product: 'PlayStation', region: 'Brasil', value: 'R$60', price: '950 MT' },
    { product: 'PlayStation', region: 'Brasil', value: 'R$100', price: '1.499 MT' },
    { product: 'PlayStation', region: 'Brasil', value: 'R$250', price: '3.650 MT' },
    // Steam
    { product: 'Steam', region: 'Brasil', value: 'R$20', price: '350 – 500 MT' },
    // Apple
    { product: 'Apple / iTunes', region: 'EUA', value: '$10 USD', price: '800 – 1.100 MT' },
    // Xbox
    { product: 'Xbox', region: 'Brasil', value: 'R$50', price: '850 – 1.100 MT' },
    // Netflix
    { product: 'Netflix', region: 'Brasil', value: 'R$30', price: '500 – 700 MT' },
    // Free Fire
    { product: 'Free Fire', region: 'Global', value: '100 Diamantes', price: '80 – 120 MT' },
    { product: 'Free Fire', region: 'Global', value: '310 Diamantes', price: '200 – 350 MT' },
    { product: 'Free Fire', region: 'Global', value: '520 Diamantes', price: '350 – 500 MT' },
    { product: 'Free Fire', region: 'Global', value: '1060 Diamantes', price: '700 – 950 MT' },
    { product: 'Free Fire', region: 'Global', value: '2180 Diamantes', price: '1.300 – 1.900 MT' },
    { product: 'Free Fire', region: 'Global', value: '5600 Diamantes', price: '3.500 – 5.000 MT' }
];

// ==========================================
// METODOS DE PAGAMENTO
// ==========================================
const paymentMethods = [
    {
        id: 'mpesa',
        name: 'M-Pesa',
        icon: 'M',
        available: false, // Em breve
        desc: 'Pague com M-Pesa diretamente do telemóvel.'
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: 'PP',
        available: true,
        desc: 'Pague com sua conta PayPal. Aceito globally.'
    },
    {
        id: 'stripe',
        name: 'Stripe',
        icon: 'ST',
        available: true,
        desc: 'Cartão de crédito e débito. Visa, Mastercard.'
    }
];

// ==========================================
// CONFIGURACOES DO SITE
// ==========================================
const config = {
    siteName: 'Ten Digital MZ',
    currency: 'MT',
    currencySymbol: 'MT',
    locale: 'pt-MZ',
    whatsapp: '258844772002',
    email: 'tenurbo2026@gmail.com',
    shopUrl: 'https://shop.garena.sg/',
    
    // Cores (deve coincidir com CSS)
    colors: {
        primary: '#0f0f3d',
        secondary: '#1d1d5c',
        accent: '#00d4ff',
        blueLight: '#00d4ff',
        text: '#1a1a2e',
        textMuted: '#6b7280'
    },
    
    // Links
    links: {
        garenaShop: 'https://shop.garena.sg/',
        spotify: 'https://www.spotify.com/',
        netflix: 'https://www.netflix.com/',
        disney: 'https://www.disneyplus.com/'
    }
};

// ==========================================
// EXPORTAR (se usando modules)
// ==========================================
// module.exports = { products, streamingPlans, freefirePlans, regions, priceTable, paymentMethods, config };