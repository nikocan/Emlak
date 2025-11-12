/**
 * Application Configuration
 */

export const config = {
  app: {
    name: 'Emlak',
    description: 'AI Destekli Emlak Yönetim Platformu',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0',
  },

  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
  },

  features: {
    enableAI: process.env.NEXT_PUBLIC_ENABLE_AI !== 'false',
    enableScraper: process.env.NEXT_PUBLIC_ENABLE_SCRAPER !== 'false',
    enableSocialMedia: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_MEDIA !== 'false',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
    enableDrawing: process.env.NEXT_PUBLIC_ENABLE_DRAWING !== 'false',
  },

  ai: {
    openAIKey: process.env.OPENAI_API_KEY,
    stabilityKey: process.env.STABILITY_API_KEY,
    removeBgKey: process.env.REMOVEBG_API_KEY,
    replicateToken: process.env.REPLICATE_API_TOKEN,
    mockMode: process.env.NODE_ENV === 'development' || !process.env.OPENAI_API_KEY,
  },

  social: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
    },
    instagram: {
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    },
  },

  scraper: {
    maxConcurrent: parseInt(process.env.SCRAPER_MAX_CONCURRENT || '5'),
    timeout: parseInt(process.env.SCRAPER_TIMEOUT || '15000'),
    retryAttempts: parseInt(process.env.SCRAPER_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.SCRAPER_RETRY_DELAY || '2000'),
  },

  map: {
    defaultCenter: {
      lat: 41.0082,
      lng: 28.9784,
    },
    defaultZoom: 12,
    apiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
  },

  storage: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },

  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  cache: {
    ttl: {
      properties: 5 * 60, // 5 minutes
      districts: 60 * 60, // 1 hour
      analytics: 15 * 60, // 15 minutes
    },
  },

  rateLimit: {
    api: {
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    scraper: {
      maxRequests: 30,
      windowMs: 60 * 1000, // 1 minute
    },
    ai: {
      maxRequests: 50,
      windowMs: 60 * 1000, // 1 minute
    },
  },

  auth: {
    sessionDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    tokenExpiry: 24 * 60 * 60, // 24 hours in seconds
  },

  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const

export default config
