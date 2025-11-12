import { PriceHistory } from '@/lib/types'

// 2020-2024 yılları arası aylık fiyat geçmişi verileri
export const priceHistory: PriceHistory[] = []

const districts = [
  { name: 'Beşiktaş', city: 'İstanbul', basePrice: 5200000, basePricePerSqm: 28000 },
  { name: 'Maslak', city: 'İstanbul', basePrice: 3400000, basePricePerSqm: 22500 },
  { name: 'Bahçeşehir', city: 'İstanbul', basePrice: 2100000, basePricePerSqm: 17000 },
  { name: 'Etiler', city: 'İstanbul', basePrice: 6800000, basePricePerSqm: 32000 },
  { name: 'Ataşehir', city: 'İstanbul', basePrice: 2800000, basePricePerSqm: 19500 },
  { name: 'Çankaya', city: 'Ankara', basePrice: 1350000, basePricePerSqm: 12000 },
  { name: 'Kızılay', city: 'Ankara', basePrice: 1180000, basePricePerSqm: 13700 },
  { name: 'Çeşme', city: 'İzmir', basePrice: 5500000, basePricePerSqm: 22000 },
  { name: 'Karşıyaka', city: 'İzmir', basePrice: 1750000, basePricePerSqm: 15000 },
  { name: 'Nilüfer', city: 'Bursa', basePrice: 1680000, basePricePerSqm: 12800 },
  { name: 'Konyaaltı', city: 'Antalya', basePrice: 2400000, basePricePerSqm: 15500 },
  { name: 'Datça', city: 'Muğla', basePrice: 2180000, basePricePerSqm: 17000 }
]

// 2020'den 2024'e kadar aylık veriler oluştur
for (let year = 2020; year <= 2024; year++) {
  const endMonth = year === 2024 ? 11 : 12 // 2024 için Kasım ayına kadar

  for (let month = 1; month <= endMonth; month++) {
    districts.forEach(district => {
      // Zaman içinde fiyat artışı hesabı (yıllık ortalama %20-30 arası)
      const monthsFromStart = (year - 2020) * 12 + month
      const growthFactor = Math.pow(1.024, monthsFromStart) // Aylık %2.4 büyüme (~33% yıllık)

      // Mevsimsel dalgalanmalar
      const seasonalFactor = 1 + Math.sin((month / 12) * Math.PI * 2) * 0.05

      // İşlem hacmi (yaz aylarında daha yüksek)
      const baseTransactions = 15 + Math.floor(Math.random() * 10)
      const seasonalTransactions = month >= 4 && month <= 9 ? 1.3 : 0.8

      priceHistory.push({
        district: district.name,
        city: district.city,
        year,
        month,
        averagePrice: Math.round(district.basePrice * growthFactor * seasonalFactor),
        averagePricePerSqm: Math.round(district.basePricePerSqm * growthFactor * seasonalFactor),
        transactionCount: Math.round(baseTransactions * seasonalTransactions)
      })
    })
  }
}

export function getPriceHistoryByDistrict(district: string, city: string): PriceHistory[] {
  return priceHistory.filter(h => h.district === district && h.city === city)
}

export function getPriceHistoryByYear(district: string, city: string, year: number): PriceHistory[] {
  return priceHistory.filter(h => h.district === district && h.city === city && h.year === year)
}

export function getYearlyAverages(district: string, city: string): Array<{year: number, avgPrice: number, avgPricePerSqm: number}> {
  const years = [2020, 2021, 2022, 2023, 2024]
  return years.map(year => {
    const yearData = getPriceHistoryByYear(district, city, year)
    const avgPrice = yearData.reduce((sum, d) => sum + d.averagePrice, 0) / yearData.length
    const avgPricePerSqm = yearData.reduce((sum, d) => sum + d.averagePricePerSqm, 0) / yearData.length
    return { year, avgPrice: Math.round(avgPrice), avgPricePerSqm: Math.round(avgPricePerSqm) }
  })
}
