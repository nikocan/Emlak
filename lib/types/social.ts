/**
 * Sosyal medya entegrasyonu tipleri
 */

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

/**
 * Sosyal Medya Hesabı
 */
export interface SocialAccount {
  id: string
  platform: SocialPlatform
  accountName: string
  accountId: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  isConnected: boolean
  profileImage?: string
  followers?: number
}

/**
 * Sosyal Medya Post
 */
export interface SocialPost {
  id: string
  propertyId: string
  platforms: SocialPlatform[]
  content: {
    text: string
    images: string[]
    hashtags: string[]
    link?: string
  }
  status: PostStatus
  scheduledFor?: Date
  publishedAt?: Date
  analytics?: PostAnalytics
  createdAt: Date
  updatedAt: Date
}

/**
 * Post Analitikleri
 */
export interface PostAnalytics {
  platform: SocialPlatform
  postId: string
  views: number
  likes: number
  comments: number
  shares: number
  clicks: number
  reach: number
  engagement: number // percentage
  lastUpdated: Date
}

/**
 * Post Template
 */
export interface PostTemplate {
  id: string
  name: string
  category: 'sale' | 'rent' | 'general'
  propertyType?: string
  template: string // Template string with variables
  hashtags: string[]
  tone: 'professional' | 'casual' | 'luxury' | 'friendly'
  language: 'tr' | 'en'
  isDefault: boolean
  usageCount: number
}

/**
 * Post Oluşturma Seçenekleri
 */
export interface PostGenerationOptions {
  property: {
    title: string
    type: string
    city: string
    district: string
    price: string
    area: number
    rooms: string
    features?: string[]
    images?: string[]
  }
  platforms: SocialPlatform[]
  template?: PostTemplate
  customText?: string
  useAI?: boolean
  aiOptions?: {
    tone: 'professional' | 'casual' | 'luxury' | 'friendly'
    includeEmojis: boolean
    length: 'short' | 'medium' | 'long'
  }
  schedule?: Date
  autoPublish?: boolean
}

/**
 * Post Oluşturma Sonucu
 */
export interface PostGenerationResult {
  success: boolean
  posts: {
    platform: SocialPlatform
    content: {
      text: string
      images: string[]
      hashtags: string[]
    }
    preview: string
    characterCount: number
    estimatedReach?: number
  }[]
  error?: string
}

/**
 * Platform Limitleri
 */
export const PLATFORM_LIMITS = {
  [SocialPlatform.FACEBOOK]: {
    maxText: 63206,
    maxImages: 10,
    maxHashtags: 30,
    maxVideo: 240 * 60, // 240 minutes
  },
  [SocialPlatform.INSTAGRAM]: {
    maxText: 2200,
    maxImages: 10,
    maxHashtags: 30,
    maxVideo: 60, // 60 seconds for feed, 15 for stories
  },
  [SocialPlatform.TWITTER]: {
    maxText: 280,
    maxImages: 4,
    maxHashtags: 10, // recommended
    maxVideo: 140, // 140 seconds
  },
  [SocialPlatform.LINKEDIN]: {
    maxText: 3000,
    maxImages: 9,
    maxHashtags: 30,
    maxVideo: 10 * 60, // 10 minutes
  },
  [SocialPlatform.WHATSAPP]: {
    maxText: 65536,
    maxImages: 30,
    maxHashtags: 0, // no hashtags
    maxVideo: 16 * 1024 * 1024, // 16MB
  },
  [SocialPlatform.TELEGRAM]: {
    maxText: 4096,
    maxImages: 10,
    maxHashtags: 0,
    maxVideo: 2048 * 1024 * 1024, // 2GB
  },
}

/**
 * Platform İkonları ve Renkler
 */
export const PLATFORM_CONFIG = {
  [SocialPlatform.FACEBOOK]: {
    name: 'Facebook',
    color: '#1877F2',
    icon: 'facebook',
  },
  [SocialPlatform.INSTAGRAM]: {
    name: 'Instagram',
    color: '#E4405F',
    icon: 'instagram',
  },
  [SocialPlatform.TWITTER]: {
    name: 'Twitter',
    color: '#1DA1F2',
    icon: 'twitter',
  },
  [SocialPlatform.LINKEDIN]: {
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: 'linkedin',
  },
  [SocialPlatform.WHATSAPP]: {
    name: 'WhatsApp',
    color: '#25D366',
    icon: 'whatsapp',
  },
  [SocialPlatform.TELEGRAM]: {
    name: 'Telegram',
    color: '#26A5E4',
    icon: 'telegram',
  },
}
