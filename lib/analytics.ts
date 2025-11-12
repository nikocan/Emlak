import { Property, RegionAnalytics, PriceHistory } from './types'

export function calculateRegionAnalytics(
  properties: Property[],
  district: string,
  city: string,
  priceHistory: PriceHistory[]
): RegionAnalytics {
  const filteredProperties = properties.filter(
    p => p.district === district && p.city === city
  )

  if (filteredProperties.length === 0) {
    return {
      district,
      city,
      properties: [],
      statistics: {
        totalCount: 0,
        saleCount: 0,
        rentCount: 0,
        averagePrice: 0,
        medianPrice: 0,
        averagePricePerSqm: 0,
        priceRange: { min: 0, max: 0 },
        categoryDistribution: {},
        priceHistory: []
      }
    }
  }

  const saleProperties = filteredProperties.filter(p => p.type === 'Satılık')
  const rentProperties = filteredProperties.filter(p => p.type === 'Kiralık')

  // Fiyat hesaplamaları
  const prices = saleProperties.map(p => p.priceNumeric).sort((a, b) => a - b)
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length
  const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0

  // Metrekare fiyatı
  const pricesPerSqm = saleProperties.map(p => p.pricePerSqm || (p.priceNumeric / p.area))
  const averagePricePerSqm = pricesPerSqm.reduce((sum, p) => sum + p, 0) / pricesPerSqm.length

  // Kategori dağılımı
  const categoryDistribution: Record<string, number> = {}
  filteredProperties.forEach(p => {
    categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1
  })

  // İlgili fiyat geçmişini filtrele
  const relevantHistory = priceHistory.filter(
    h => h.district === district && h.city === city
  )

  return {
    district,
    city,
    properties: filteredProperties,
    statistics: {
      totalCount: filteredProperties.length,
      saleCount: saleProperties.length,
      rentCount: rentProperties.length,
      averagePrice: Math.round(averagePrice),
      medianPrice,
      averagePricePerSqm: Math.round(averagePricePerSqm),
      priceRange: {
        min: prices.length > 0 ? prices[0] : 0,
        max: prices.length > 0 ? prices[prices.length - 1] : 0
      },
      categoryDistribution,
      priceHistory: relevantHistory
    }
  }
}

export function calculatePriceChange(
  priceHistory: PriceHistory[],
  district: string,
  city: string,
  months: number = 12
): number {
  const history = priceHistory
    .filter(h => h.district === district && h.city === city)
    .sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month))

  if (history.length < months) return 0

  const latestPrice = history[history.length - 1].averagePrice
  const oldPrice = history[history.length - months].averagePrice

  return ((latestPrice - oldPrice) / oldPrice) * 100
}

export function getMonthlyTrend(
  priceHistory: PriceHistory[],
  district: string,
  city: string,
  monthsBack: number = 12
): PriceHistory[] {
  const history = priceHistory
    .filter(h => h.district === district && h.city === city)
    .sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month))

  return history.slice(-monthsBack)
}

export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(2)} M`
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)} K`
  }
  return price.toString()
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
