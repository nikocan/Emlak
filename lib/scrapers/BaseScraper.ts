import {
  IScraper,
  ScraperSource,
  ScraperConfig,
  RawPropertyData,
  ScrapeOptions,
} from '../types/scraper'
import { RateLimiter } from '../utils/rateLimiter'

/**
 * Base Scraper - Tüm scraper'ların extend edeceği abstract class
 */
export abstract class BaseScraper implements IScraper {
  public source: ScraperSource
  public config: ScraperConfig
  protected rateLimiter: RateLimiter
  protected errors: Array<{ url: string; error: string; timestamp: Date }> = []

  constructor(config: ScraperConfig) {
    this.source = config.source
    this.config = config

    // Rate limiter oluştur
    this.rateLimiter = new RateLimiter(
      config.maxRequestsPerMinute,
      60 // 60 saniye
    )
  }

  /**
   * İstek yapılabilir mi kontrol eder
   */
  canMakeRequest(): boolean {
    if (!this.config.enabled) {
      return false
    }
    return this.rateLimiter.canMakeRequest()
  }

  /**
   * Bir sonraki isteğe kadar bekler
   */
  protected async waitForRateLimit(): Promise<void> {
    await this.rateLimiter.waitForSlot()
    this.rateLimiter.recordRequest()
  }

  /**
   * Hata kaydeder
   */
  protected recordError(url: string, error: string): void {
    this.errors.push({
      url,
      error,
      timestamp: new Date(),
    })

    // Son 100 hatayı sakla
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100)
    }
  }

  /**
   * Hataları döndürür
   */
  getErrors() {
    return this.errors
  }

  /**
   * Retry logic ile istek yapar
   */
  protected async retryRequest<T>(
    requestFn: () => Promise<T>,
    url: string
  ): Promise<T | null> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        // Rate limit bekle
        await this.waitForRateLimit()

        // İsteği yap
        const result = await Promise.race([
          requestFn(),
          this.timeout(this.config.timeout),
        ])

        return result as T
      } catch (error) {
        lastError = error as Error

        // Son deneme değilse bekle ve tekrar dene
        if (attempt < this.config.retryAttempts) {
          const delay = this.config.retryDelay * Math.pow(2, attempt) // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    // Tüm denemeler başarısız
    this.recordError(url, lastError?.message || 'Unknown error')
    return null
  }

  /**
   * Timeout promise
   */
  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), ms)
    )
  }

  /**
   * HTML parse etmek için yardımcı method (override edilebilir)
   */
  protected async fetchHTML(url: string): Promise<string | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      throw error
    }
  }

  // Abstract methods - Alt sınıflar implement etmeli
  abstract scrapeByLocation(
    city: string,
    district?: string,
    options?: ScrapeOptions
  ): Promise<RawPropertyData[]>

  abstract scrapePropertyDetail(url: string): Promise<RawPropertyData | null>

  abstract testConnection(): Promise<boolean>
}
