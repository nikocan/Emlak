/**
 * Uygulama sabitleri
 */

// Genel
export const APP_NAME = 'Emlak'
export const APP_DESCRIPTION = 'AI Destekli Emlak Yönetim Platformu'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
export const API_TIMEOUT = 30000 // 30 saniye

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_FILES = 10
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Property
export const PROPERTY_TYPES = [
  'Daire',
  'Villa',
  'Rezidans',
  'Dubleks',
  'Müstakil Ev',
  'Yazlık',
  'İşyeri',
  'Arsa',
  'Ofis',
] as const

export const PROPERTY_CATEGORIES = ['Satılık', 'Kiralık', 'Devren'] as const

export const ROOM_OPTIONS = [
  '1+0',
  '1+1',
  '2+0',
  '2+1',
  '3+1',
  '4+1',
  '5+1',
  '6+1',
  'Stüdyo',
] as const

export const BUILDING_AGE_OPTIONS = [
  '0 (Yeni)',
  '0-5',
  '6-10',
  '11-15',
  '16-20',
  '20+',
] as const

// Cities (Başlıca şehirler)
export const MAJOR_CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Antalya',
  'Bursa',
  'Adana',
  'Gaziantep',
  'Konya',
  'Kocaeli',
  'Mersin',
] as const

// Features
export const COMMON_FEATURES = [
  'Asansör',
  'Otopark',
  'Güvenlik',
  'Havuz',
  'Spor Salonu',
  'Çocuk Parkı',
  'Jeneratör',
  'Balkon',
  'Teras',
  'Bahçe',
  'Kapalı Otopark',
  'Açık Otopark',
  'Kamera Sistemi',
  'Site İçi',
  'Merkezi Isıtma',
  'Kombi',
  'Klima',
  'Doğalgaz',
  'Görüntülü Diafon',
  'Amerikan Mutfak',
  'Laminat Parke',
  'PVC',
  'Marley',
  'Seramik Zemin',
  'Fayans',
  'Alüminyum Doğrama',
  'PVC Doğrama',
] as const

// Maps
export const DEFAULT_MAP_CENTER = {
  lat: 41.0082,
  lng: 28.9784,
} as const

export const DEFAULT_MAP_ZOOM = 12

// Subscription Plans
export const PLAN_LIMITS = {
  basic: {
    maxListings: 10,
    maxPhotos: 10,
    maxAICredits: 50,
    supportLevel: 'email',
  },
  pro: {
    maxListings: 50,
    maxPhotos: 20,
    maxAICredits: 200,
    supportLevel: 'priority',
  },
  enterprise: {
    maxListings: -1, // unlimited
    maxPhotos: 50,
    maxAICredits: 1000,
    supportLevel: '24/7',
  },
} as const

// AI
export const AI_FEATURES = {
  IMAGE_ENHANCEMENT: 'image_enhancement',
  IMAGE_UPSCALE: 'image_upscale',
  BACKGROUND_REMOVAL: 'background_removal',
  VIRTUAL_STAGING: 'virtual_staging',
  DESCRIPTION_GENERATION: 'description_generation',
  TITLE_GENERATION: 'title_generation',
  HASHTAG_GENERATION: 'hashtag_generation',
} as const

export const AI_COSTS = {
  IMAGE_ENHANCEMENT: 0.05,
  IMAGE_UPSCALE: 0.10,
  BACKGROUND_REMOVAL: 0.02,
  VIRTUAL_STAGING: 0.50,
  DESCRIPTION_GENERATION: 0.01,
  TITLE_GENERATION: 0.005,
  HASHTAG_GENERATION: 0.005,
} as const

// Social Media
export const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
  'whatsapp',
  'telegram',
] as const

export const PLATFORM_COLORS = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  whatsapp: '#25D366',
  telegram: '#26A5E4',
} as const

// Scraper
export const SCRAPER_SOURCES = [
  'sahibinden',
  'hepsiemlak',
  'emlakjet',
  'zingat',
] as const

export const SCRAPER_RATE_LIMITS = {
  sahibinden: 20,
  hepsiemlak: 30,
  emlakjet: 25,
  zingat: 30,
} as const

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY'
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm'
export const TIME_FORMAT = 'HH:mm'

// Regex Patterns
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10,11}$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'Bu alan zorunludur',
  INVALID_EMAIL: 'Geçerli bir email adresi giriniz',
  INVALID_PHONE: 'Geçerli bir telefon numarası giriniz',
  INVALID_URL: 'Geçerli bir URL giriniz',
  INVALID_PRICE: 'Geçerli bir fiyat giriniz',
  INVALID_AREA: 'Geçerli bir alan giriniz',
  MIN_LENGTH: 'En az {min} karakter olmalıdır',
  MAX_LENGTH: 'En fazla {max} karakter olabilir',
  MIN_VALUE: 'En az {min} olmalıdır',
  MAX_VALUE: 'En fazla {max} olabilir',
  NETWORK_ERROR: 'Bağlantı hatası oluştu',
  SERVER_ERROR: 'Sunucu hatası oluştu',
  NOT_FOUND: 'Kayıt bulunamadı',
  UNAUTHORIZED: 'Yetkiniz bulunmamaktadır',
  FORBIDDEN: 'Bu işlem için yetkiniz yok',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Başarıyla kaydedildi',
  UPDATED: 'Başarıyla güncellendi',
  DELETED: 'Başarıyla silindi',
  SENT: 'Başarıyla gönderildi',
  UPLOADED: 'Başarıyla yüklendi',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recent_searches',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

// Query Keys (React Query)
export const QUERY_KEYS = {
  PROPERTIES: 'properties',
  PROPERTY: 'property',
  DISTRICTS: 'districts',
  ANALYTICS: 'analytics',
  SCRAPER_STATUS: 'scraper_status',
  AI_USAGE: 'ai_usage',
  SOCIAL_ACCOUNTS: 'social_accounts',
  USER_PROFILE: 'user_profile',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/[id]',
  ANALYTICS: '/analytics',
  CREATE_LISTING: '/create-listing',
  DASHBOARD: '/dashboard',
  PRICING: '/pricing',
  LOGIN: '/login',
  ADMIN_SCRAPERS: '/admin/scrapers',
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const
