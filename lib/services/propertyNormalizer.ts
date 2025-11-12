import { Property } from '../types'
import { RawPropertyData, PropertyNormalizer as IPropertyNormalizer } from '../types/scraper'

/**
 * Ham scrape edilen veriyi normalize eder ve Property tipine dönüştürür
 */
export class PropertyNormalizer implements IPropertyNormalizer {
  /**
   * Ham veriyi Property tipine normalize eder
   */
  normalize(raw: RawPropertyData): Partial<Property> {
    const priceNumeric = this.validatePrice(raw.price, raw.currency)
    const area = this.parseArea(raw.area)
    const pricePerSqm = area > 0 ? Math.round(priceNumeric / area) : 0

    return {
      id: this.generateId(raw),
      title: this.cleanText(raw.title),
      description: raw.description ? this.cleanText(raw.description) : undefined,
      price: this.formatPrice(priceNumeric),
      priceNumeric,
      pricePerSqm,
      type: this.normalizePropertyType(raw.type),
      category: this.inferCategory(raw),
      city: this.normalizeLocation(raw.city),
      district: this.normalizeLocation(raw.district),
      address: raw.address || `${raw.district}, ${raw.city}`,
      area,
      rooms: raw.rooms || '2+1',
      floor: raw.floor,
      buildingAge: this.parseBuildingAge(raw.buildingAge),
      images: raw.images || [],
      features: raw.features || [],
      coordinates: raw.coordinates || this.getDefaultCoordinates(raw.city, raw.district),
      externalId: raw.externalId,
      externalSource: raw.source,
      externalUrl: raw.url,
    }
  }

  /**
   * Fiyatı doğrular ve sayıya çevirir
   */
  validatePrice(price: string | number, currency: string): number {
    let numericPrice: number

    if (typeof price === 'string') {
      // String ise temizle ve parse et
      numericPrice = parseFloat(
        price.replace(/[^\d.,]/g, '').replace(',', '.')
      )
    } else {
      numericPrice = price
    }

    // NaN kontrolü
    if (isNaN(numericPrice) || numericPrice <= 0) {
      throw new Error(`Invalid price: ${price}`)
    }

    // Döviz dönüşümü (gerekirse)
    if (currency.toLowerCase() !== 'try' && currency !== '₺') {
      // Basit dönüşüm - gerçek uygulamada güncel kur kullanılmalı
      const rates: Record<string, number> = {
        usd: 32,
        eur: 35,
        gbp: 40,
      }
      const rate = rates[currency.toLowerCase()] || 1
      numericPrice = numericPrice * rate
    }

    return Math.round(numericPrice)
  }

  /**
   * Koordinatları parse eder (opsiyonel: geocoding API kullanılabilir)
   */
  async parseCoordinates(
    address: string
  ): Promise<{ lat: number; lng: number } | null> {
    // Gerçek uygulamada Google Maps Geocoding API veya benzeri kullanılabilir
    // Şu an için null döndürüyoruz
    return null
  }

  /**
   * Metrekare alanını parse eder
   */
  private parseArea(area: any): number {
    if (typeof area === 'number') return area

    if (typeof area === 'string') {
      const parsed = parseFloat(area.replace(/[^\d.,]/g, '').replace(',', '.'))
      return isNaN(parsed) ? 0 : Math.round(parsed)
    }

    return 0
  }

  /**
   * Bina yaşını parse eder
   */
  private parseBuildingAge(age: any): string {
    if (typeof age === 'string') return age

    if (typeof age === 'number') {
      if (age === 0) return '0 (Yeni)'
      if (age <= 5) return '0-5'
      if (age <= 10) return '6-10'
      if (age <= 15) return '11-15'
      if (age <= 20) return '16-20'
      return '20+'
    }

    return 'Belirtilmemiş'
  }

  /**
   * Property tipini normalize eder
   */
  private normalizePropertyType(type: string): string {
    const normalized = type.toLowerCase().trim()

    const typeMap: Record<string, string> = {
      daire: 'Daire',
      apartment: 'Daire',
      villa: 'Villa',
      house: 'Villa',
      residence: 'Rezidans',
      rezidans: 'Rezidans',
      'yazlık ev': 'Yazlık',
      duplex: 'Duplex',
      'müstakil ev': 'Müstakil Ev',
      arsa: 'Arsa',
      land: 'Arsa',
      office: 'İşyeri',
      işyeri: 'İşyeri',
      dükkan: 'Dükkan',
      shop: 'Dükkan',
    }

    return typeMap[normalized] || 'Daire'
  }

  /**
   * Kategoriyi infer eder
   */
  private inferCategory(raw: RawPropertyData): string {
    // URL veya type'dan kategoriyi çıkar
    const url = raw.url.toLowerCase()
    const type = raw.type.toLowerCase()

    if (url.includes('satilik') || url.includes('sale')) return 'Satılık'
    if (url.includes('kiralik') || url.includes('rent')) return 'Kiralık'

    // Default olarak Satılık
    return 'Satılık'
  }

  /**
   * Lokasyon isimlerini normalize eder
   */
  private normalizeLocation(location: string): string {
    return location
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  /**
   * Metni temizler
   */
  private cleanText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[\n\r\t]/g, ' ')
      .substring(0, 500) // Max length
  }

  /**
   * Fiyatı formatlar
   */
  private formatPrice(price: number): string {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} M ₺`
    }
    return `${(price / 1000).toFixed(0)} K ₺`
  }

  /**
   * Unique ID generate eder
   */
  private generateId(raw: RawPropertyData): string {
    return `${raw.source}-${raw.externalId || Date.now()}`
  }

  /**
   * Default koordinatları döndürür (şehir merkezi)
   */
  private getDefaultCoordinates(
    city: string,
    district: string
  ): { lat: number; lng: number } {
    // Basit bir merkez koordinat sistemi
    const cityCoords: Record<string, { lat: number; lng: number }> = {
      istanbul: { lat: 41.0082, lng: 28.9784 },
      ankara: { lat: 39.9334, lng: 32.8597 },
      izmir: { lat: 38.4237, lng: 27.1428 },
      bursa: { lat: 40.1826, lng: 29.0665 },
      antalya: { lat: 36.8969, lng: 30.7133 },
    }

    const normalizedCity = city.toLowerCase().replace(/ı/g, 'i')
    return cityCoords[normalizedCity] || { lat: 41.0082, lng: 28.9784 }
  }
}

// Singleton instance
export const propertyNormalizer = new PropertyNormalizer()
