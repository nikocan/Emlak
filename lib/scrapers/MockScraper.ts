import { BaseScraper } from './BaseScraper'
import {
  ScraperSource,
  ScraperConfig,
  RawPropertyData,
  ScrapeOptions,
} from '../types/scraper'

/**
 * Mock Scraper - Demo ve test amaçlı
 * Gerçek scraper'lar bu yapıyı takip edebilir
 */
export class MockScraper extends BaseScraper {
  constructor(source: ScraperSource) {
    const config: ScraperConfig = {
      source,
      enabled: true,
      maxRequestsPerMinute: 30,
      maxConcurrentRequests: 5,
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    }
    super(config)
  }

  /**
   * Belirli bir lokasyon için ilanları çeker (Mock)
   */
  async scrapeByLocation(
    city: string,
    district?: string,
    options?: ScrapeOptions
  ): Promise<RawPropertyData[]> {
    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 500))

    const properties: RawPropertyData[] = []
    const count = options?.maxPages ? options.maxPages * 25 : 50

    for (let i = 0; i < count; i++) {
      properties.push(this.generateMockProperty(city, district, i))
    }

    return properties
  }

  /**
   * Belirli bir URL'den ilan detayını çeker (Mock)
   */
  async scrapePropertyDetail(url: string): Promise<RawPropertyData | null> {
    // Simüle edilmiş gecikme
    await new Promise(resolve => setTimeout(resolve, 300))

    return this.generateMockProperty('İstanbul', 'Beşiktaş', Math.random())
  }

  /**
   * Bağlantı testi (Mock)
   */
  async testConnection(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return true
  }

  /**
   * Mock ilan verisi üretir
   */
  private generateMockProperty(
    city: string,
    district: string | undefined,
    seed: number
  ): RawPropertyData {
    const types = ['Daire', 'Villa', 'Rezidans', 'Dubleks', 'Müstakil Ev']
    const rooms = ['1+1', '2+1', '3+1', '4+1', '5+1', '6+1']
    const neighborhoods = ['Merkez', 'Çarşı', 'Sahil', 'Yeni Mahalle', 'Eski Mahalle']

    const type = types[Math.floor(Math.abs(seed) * types.length) % types.length]
    const room = rooms[Math.floor(Math.abs(seed * 7) * rooms.length) % rooms.length]
    const neighborhood = neighborhoods[Math.floor(Math.abs(seed * 13) * neighborhoods.length) % neighborhoods.length]

    const area = 50 + Math.floor(Math.abs(seed * 100) % 250)
    const pricePerSqm = 15000 + Math.floor(Math.abs(seed * 5000) % 35000)
    const price = area * pricePerSqm

    const id = `${this.source}-${Date.now()}-${Math.floor(Math.abs(seed * 10000))}`
    const actualDistrict = district || 'Merkez'

    return {
      externalId: id,
      source: this.source,
      url: `https://example.com/${this.source}/ilan/${id}`,
      title: `${type} ${room} ${area}m² ${actualDistrict}`,
      description: `Satılık ${type}, ${room}, ${area}m², ${actualDistrict}, ${city}. Geniş ve ferah, modern tasarım.`,
      price,
      currency: 'TRY',
      type,
      city,
      district: actualDistrict,
      neighborhood,
      address: `${neighborhood}, ${actualDistrict}, ${city}`,
      area,
      rooms: room,
      bathrooms: parseInt(room.split('+')[1]) || 1,
      floor: `${Math.floor(Math.abs(seed * 20) % 10) + 1}`,
      buildingAge: Math.floor(Math.abs(seed * 30) % 20),
      heating: ['Kombi', 'Merkezi', 'Klima'][Math.floor(Math.abs(seed * 3) % 3)],
      furnished: Math.abs(seed) % 2 === 0,
      images: [
        `https://picsum.photos/800/600?random=${Math.abs(seed * 1)}`,
        `https://picsum.photos/800/600?random=${Math.abs(seed * 2)}`,
        `https://picsum.photos/800/600?random=${Math.abs(seed * 3)}`,
      ],
      features: [
        'Asansör',
        'Otopark',
        'Güvenlik',
        'Balkon',
      ].filter(() => Math.random() > 0.5),
      coordinates: {
        lat: 41.0082 + (Math.random() - 0.5) * 0.1,
        lng: 28.9784 + (Math.random() - 0.5) * 0.1,
      },
      contactInfo: {
        name: `Emlakçı ${Math.floor(Math.abs(seed * 100) % 100)}`,
        phone: '0555 555 5555',
        isAgent: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

/**
 * Gerçek scraper implementasyonu için template
 *
 * UYARI: Web scraping yapmadan önce:
 * 1. Site'nin robots.txt dosyasını kontrol edin
 * 2. Kullanım koşullarını okuyun
 * 3. API erişimi olup olmadığını araştırın
 * 4. Rate limiting uygulayın
 * 5. User-Agent header'ı ekleyin
 * 6. Yasal danışmanlık alın
 */

/* Örnek gerçek scraper implementasyonu:

export class SahibindenScraper extends BaseScraper {
  constructor() {
    const config: ScraperConfig = {
      source: ScraperSource.SAHIBINDEN,
      enabled: true,
      maxRequestsPerMinute: 20, // Daha düşük rate limit
      maxConcurrentRequests: 3,
      timeout: 15000,
      retryAttempts: 3,
      retryDelay: 2000,
    }
    super(config)
  }

  async scrapeByLocation(
    city: string,
    district?: string,
    options?: ScrapeOptions
  ): Promise<RawPropertyData[]> {
    const baseUrl = 'https://www.sahibinden.com/satilik-daire'
    const url = this.buildSearchUrl(baseUrl, city, district, options)

    const html = await this.retryRequest(() => this.fetchHTML(url), url)
    if (!html) return []

    return this.parseListingPage(html)
  }

  async scrapePropertyDetail(url: string): Promise<RawPropertyData | null> {
    const html = await this.retryRequest(() => this.fetchHTML(url), url)
    if (!html) return null

    return this.parseDetailPage(html, url)
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://www.sahibinden.com', {
        method: 'HEAD',
        headers: { 'User-Agent': '...' }
      })
      return response.ok
    } catch {
      return false
    }
  }

  private buildSearchUrl(
    baseUrl: string,
    city: string,
    district?: string,
    options?: ScrapeOptions
  ): string {
    // URL oluşturma logic'i
    // Örnek: https://www.sahibinden.com/satilik-daire/istanbul-besiktas?pageno=1
    return baseUrl
  }

  private parseListingPage(html: string): RawPropertyData[] {
    // HTML parse etme logic'i (cheerio veya jsdom kullanılabilir)
    // CSS selectors ile veri çekme
    return []
  }

  private parseDetailPage(html: string, url: string): RawPropertyData | null {
    // Detay sayfası parse etme logic'i
    return null
  }
}
*/
