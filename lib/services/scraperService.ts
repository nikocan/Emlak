import {
  ScraperSource,
  ScrapeResult,
  ScraperStatus,
  ScrapeOptions,
  IScraper,
  RawPropertyData,
} from '../types/scraper'
import { MockScraper } from '../scrapers/MockScraper'
import { propertyNormalizer } from './propertyNormalizer'
import { Property } from '../types'

/**
 * Scraper Service - Tüm scraper'ları yönetir ve orchestrate eder
 */
export class ScraperService {
  private scrapers: Map<ScraperSource, IScraper> = new Map()
  private runningJobs: Map<string, boolean> = new Map()

  constructor() {
    this.initializeScrapers()
  }

  /**
   * Scraper'ları başlatır
   */
  private initializeScrapers(): void {
    // Mock scraper'ları ekle (Demo için)
    this.scrapers.set(ScraperSource.SAHIBINDEN, new MockScraper(ScraperSource.SAHIBINDEN))
    this.scrapers.set(ScraperSource.HEPSIEMLAK, new MockScraper(ScraperSource.HEPSIEMLAK))
    this.scrapers.set(ScraperSource.EMLAKJET, new MockScraper(ScraperSource.EMLAKJET))
    this.scrapers.set(ScraperSource.ZINGAT, new MockScraper(ScraperSource.ZINGAT))

    // Gerçek scraper'lar burada eklenebilir:
    // this.scrapers.set(ScraperSource.SAHIBINDEN, new SahibindenScraper())
  }

  /**
   * Belirli bir kaynak için scraping işlemi başlatır
   */
  async scrape(
    source: ScraperSource,
    city: string,
    district?: string,
    options?: ScrapeOptions
  ): Promise<ScrapeResult> {
    const jobId = `${source}-${city}-${district || 'all'}-${Date.now()}`

    // Zaten çalışan bir job var mı kontrol et
    if (this.runningJobs.get(jobId)) {
      throw new Error(`Scraping job already running: ${jobId}`)
    }

    const scraper = this.scrapers.get(source)
    if (!scraper) {
      throw new Error(`Scraper not found for source: ${source}`)
    }

    if (!scraper.canMakeRequest()) {
      return this.createResult(source, ScraperStatus.RATE_LIMITED, 0, 0, 0, 0, 0)
    }

    // Job'ı başlat
    this.runningJobs.set(jobId, true)
    const startedAt = new Date()

    try {
      // Scraping yap
      const rawData = await scraper.scrapeByLocation(city, district, options)

      // Normalize et ve kaydet
      const properties = await this.normalizeAndSave(rawData)

      // Sonucu döndür
      const completedAt = new Date()
      const duration = completedAt.getTime() - startedAt.getTime()

      return {
        source,
        status: ScraperStatus.SUCCESS,
        totalFound: rawData.length,
        totalProcessed: rawData.length,
        totalSaved: properties.length,
        totalErrors: rawData.length - properties.length,
        duration,
        startedAt,
        completedAt,
      }
    } catch (error) {
      const completedAt = new Date()
      const duration = completedAt.getTime() - startedAt.getTime()

      return {
        source,
        status: ScraperStatus.ERROR,
        totalFound: 0,
        totalProcessed: 0,
        totalSaved: 0,
        totalErrors: 1,
        duration,
        errors: [{
          url: '',
          error: (error as Error).message,
          timestamp: new Date(),
        }],
        startedAt,
        completedAt,
      }
    } finally {
      this.runningJobs.delete(jobId)
    }
  }

  /**
   * Tüm kaynaklardan paralel scraping yapar
   */
  async scrapeAll(
    city: string,
    district?: string,
    options?: ScrapeOptions
  ): Promise<ScrapeResult[]> {
    const sources = Array.from(this.scrapers.keys())
    const promises = sources.map(source =>
      this.scrape(source, city, district, options)
    )

    return await Promise.all(promises)
  }

  /**
   * Belirli bir URL'den detay çeker
   */
  async scrapeDetail(
    source: ScraperSource,
    url: string
  ): Promise<Property | null> {
    const scraper = this.scrapers.get(source)
    if (!scraper) {
      throw new Error(`Scraper not found for source: ${source}`)
    }

    const rawData = await scraper.scrapePropertyDetail(url)
    if (!rawData) return null

    try {
      const normalized = propertyNormalizer.normalize(rawData)
      return normalized as Property
    } catch (error) {
      console.error('Failed to normalize property:', error)
      return null
    }
  }

  /**
   * Scraper durumlarını döndürür
   */
  getScraperStatuses(): Record<ScraperSource, {
    enabled: boolean
    canMakeRequest: boolean
    config: any
  }> {
    const statuses: any = {}

    this.scrapers.forEach((scraper, source) => {
      statuses[source] = {
        enabled: scraper.config.enabled,
        canMakeRequest: scraper.canMakeRequest(),
        config: scraper.config,
      }
    })

    return statuses
  }

  /**
   * Belirli bir scraper'ı test eder
   */
  async testScraper(source: ScraperSource): Promise<boolean> {
    const scraper = this.scrapers.get(source)
    if (!scraper) return false

    return await scraper.testConnection()
  }

  /**
   * Ham veriyi normalize eder ve kaydeder
   */
  private async normalizeAndSave(
    rawData: RawPropertyData[]
  ): Promise<Property[]> {
    const properties: Property[] = []

    for (const raw of rawData) {
      try {
        const normalized = propertyNormalizer.normalize(raw)

        // Eksik alanları tamamla
        const property: Property = {
          id: normalized.id || `property-${Date.now()}`,
          title: normalized.title || '',
          description: normalized.description || '',
          price: normalized.price || '0 ₺',
          priceNumeric: normalized.priceNumeric || 0,
          pricePerSqm: normalized.pricePerSqm || 0,
          type: normalized.type || 'Daire',
          category: normalized.category || 'Satılık',
          city: normalized.city || '',
          district: normalized.district || '',
          address: normalized.address || '',
          area: normalized.area || 0,
          rooms: normalized.rooms || '2+1',
          floor: normalized.floor,
          buildingAge: normalized.buildingAge,
          images: normalized.images || [],
          features: normalized.features || [],
          coordinates: normalized.coordinates || { lat: 0, lng: 0 },
          externalId: normalized.externalId,
          externalSource: normalized.externalSource,
          externalUrl: normalized.externalUrl,
        }

        properties.push(property)

        // Gerçek uygulamada burada veritabanına kayıt yapılır
        // await saveToDatabase(property)
      } catch (error) {
        console.error('Failed to normalize property:', raw, error)
      }
    }

    return properties
  }

  /**
   * ScrapeResult oluşturur
   */
  private createResult(
    source: ScraperSource,
    status: ScraperStatus,
    found: number,
    processed: number,
    saved: number,
    errors: number,
    duration: number
  ): ScrapeResult {
    return {
      source,
      status,
      totalFound: found,
      totalProcessed: processed,
      totalSaved: saved,
      totalErrors: errors,
      duration,
      startedAt: new Date(),
    }
  }
}

// Singleton instance
export const scraperService = new ScraperService()
