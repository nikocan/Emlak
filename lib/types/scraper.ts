import { Property } from '../types'

/**
 * Scraper kaynak siteleri
 */
export enum ScraperSource {
  SAHIBINDEN = 'sahibinden',
  HEPSIEMLAK = 'hepsiemlak',
  EMLAKJET = 'emlakjet',
  ZINGAT = 'zingat',
}

/**
 * Scraper durumları
 */
export enum ScraperStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  SUCCESS = 'success',
  ERROR = 'error',
  RATE_LIMITED = 'rate_limited',
}

/**
 * Scraping yapılandırması
 */
export interface ScraperConfig {
  source: ScraperSource
  enabled: boolean
  maxRequestsPerMinute: number
  maxConcurrentRequests: number
  timeout: number // milliseconds
  retryAttempts: number
  retryDelay: number // milliseconds
}

/**
 * Ham scrape edilen veri
 */
export interface RawPropertyData {
  externalId: string
  source: ScraperSource
  url: string
  title: string
  description?: string
  price: string | number
  currency: string
  type: string
  city: string
  district: string
  neighborhood?: string
  address?: string
  area?: number
  rooms?: string
  bathrooms?: number
  floor?: string
  buildingAge?: string | number
  heating?: string
  furnished?: boolean
  images?: string[]
  features?: string[]
  coordinates?: {
    lat: number
    lng: number
  }
  contactInfo?: {
    name?: string
    phone?: string
    isAgent?: boolean
  }
  createdAt?: Date
  updatedAt?: Date
  [key: string]: any // Siteye özel ekstra alanlar
}

/**
 * Scraping sonucu
 */
export interface ScrapeResult {
  source: ScraperSource
  status: ScraperStatus
  totalFound: number
  totalProcessed: number
  totalSaved: number
  totalErrors: number
  duration: number // milliseconds
  errors?: Array<{
    url: string
    error: string
    timestamp: Date
  }>
  startedAt: Date
  completedAt?: Date
}

/**
 * Scraper interface - Tüm scraper'lar bu interface'i implement eder
 */
export interface IScraper {
  source: ScraperSource
  config: ScraperConfig

  /**
   * Belirli bir şehir ve ilçe için ilanları çeker
   */
  scrapeByLocation(city: string, district?: string, options?: ScrapeOptions): Promise<RawPropertyData[]>

  /**
   * Belirli bir URL'den ilan detayını çeker
   */
  scrapePropertyDetail(url: string): Promise<RawPropertyData | null>

  /**
   * Scraper'ın çalışıp çalışmadığını test eder
   */
  testConnection(): Promise<boolean>

  /**
   * Rate limiting durumunu kontrol eder
   */
  canMakeRequest(): boolean
}

/**
 * Scraping seçenekleri
 */
export interface ScrapeOptions {
  maxPages?: number
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
  propertyType?: string
  listingType?: 'sale' | 'rent'
  includeDetails?: boolean
}

/**
 * Scraper job - Zamanlanmış scraping işleri için
 */
export interface ScraperJob {
  id: string
  source: ScraperSource
  city: string
  district?: string
  options?: ScrapeOptions
  schedule?: string // cron expression
  lastRun?: Date
  nextRun?: Date
  enabled: boolean
  results?: ScrapeResult[]
}

/**
 * Property normalization - Ham veriyi Property tipine dönüştürür
 */
export interface PropertyNormalizer {
  normalize(raw: RawPropertyData): Partial<Property>
  validatePrice(price: string | number, currency: string): number
  parseCoordinates(address: string): Promise<{ lat: number; lng: number } | null>
}
