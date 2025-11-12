/**
 * AI hizmet tipleri ve konfigürasyonları
 */

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  STABILITY = 'stability',
  REPLICATE = 'replicate',
}

export enum AIFeature {
  IMAGE_ENHANCEMENT = 'image_enhancement',
  IMAGE_UPSCALE = 'image_upscale',
  BACKGROUND_REMOVAL = 'background_removal',
  VIRTUAL_STAGING = 'virtual_staging',
  DESCRIPTION_GENERATION = 'description_generation',
  TITLE_GENERATION = 'title_generation',
  HASHTAG_GENERATION = 'hashtag_generation',
  SEO_OPTIMIZATION = 'seo_optimization',
}

/**
 * Görsel İyileştirme Seçenekleri
 */
export interface ImageEnhancementOptions {
  brightness?: number // -100 to 100
  contrast?: number // -100 to 100
  saturation?: number // -100 to 100
  sharpness?: number // 0 to 100
  denoise?: boolean
  upscale?: boolean
  upscaleFactor?: 2 | 4 // 2x veya 4x
  removeBackground?: boolean
  autoEnhance?: boolean
  hdr?: boolean
}

/**
 * AI Görsel İşleme Sonucu
 */
export interface AIImageResult {
  originalUrl: string
  enhancedUrl: string
  width: number
  height: number
  fileSize: number
  improvements: string[]
  processingTime: number // ms
  cost?: number // credits/USD
}

/**
 * Metin Oluşturma Seçenekleri
 */
export interface TextGenerationOptions {
  property: {
    type: string
    city: string
    district: string
    area: number
    rooms: string
    price: number
    features?: string[]
  }
  tone?: 'professional' | 'casual' | 'luxury' | 'friendly'
  length?: 'short' | 'medium' | 'long'
  language?: 'tr' | 'en'
  includeEmojis?: boolean
  seoOptimized?: boolean
}

/**
 * AI Metin Sonucu
 */
export interface AITextResult {
  title: string
  description: string
  shortDescription: string
  hashtags: string[]
  keywords: string[]
  seoScore?: number
  tone: string
  wordCount: number
}

/**
 * Sanal Mobilyalama Seçenekleri
 */
export interface VirtualStagingOptions {
  roomType: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office'
  style: 'modern' | 'classic' | 'minimalist' | 'scandinavian' | 'industrial'
  furnitureLevel: 'minimal' | 'medium' | 'full'
}

/**
 * AI İşleme İsteği
 */
export interface AIProcessRequest {
  feature: AIFeature
  input: string | string[] // URL(s)
  options?: ImageEnhancementOptions | TextGenerationOptions | VirtualStagingOptions
}

/**
 * AI İşleme Sonucu
 */
export interface AIProcessResult {
  success: boolean
  feature: AIFeature
  result?: AIImageResult | AITextResult | any
  error?: string
  processingTime: number
  cost?: number
}

/**
 * AI Kullanım İstatistikleri
 */
export interface AIUsageStats {
  userId: string
  totalRequests: number
  totalCredits: number
  remainingCredits: number
  features: Record<AIFeature, number>
  lastUsed: Date
}
