'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PriceTrendChart from '@/components/PriceTrendChart'
import CategoryDistributionChart from '@/components/CategoryDistributionChart'
import YearlyComparisonChart from '@/components/YearlyComparisonChart'
import { properties } from '@/data/properties'
import { districts } from '@/data/districts'
import { priceHistory, getYearlyAverages, getPriceHistoryByDistrict } from '@/data/priceHistory'
import { calculateRegionAnalytics, calculatePriceChange, formatCurrency } from '@/lib/analytics'
import { DistrictData } from '@/lib/types'

// Dynamic import for map to avoid SSR issues
const DrawableMap = dynamic(() => import('@/components/DrawableMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">Harita yükleniyor...</div>
})

export default function AnalyticsPage() {
  const [selectedCity, setSelectedCity] = useState<string>('İstanbul')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Beşiktaş')
  const [drawnAreaProperties, setDrawnAreaProperties] = useState<typeof properties | null>(null)

  // Seçili şehrin ilçelerini al
  const cityDistricts = useMemo(() => {
    return districts.filter(d => d.city === selectedCity)
  }, [selectedCity])

  // Seçili ilçenin verisini al
  const districtData = useMemo(() => {
    return districts.find(d => d.city === selectedCity && d.name === selectedDistrict)
  }, [selectedCity, selectedDistrict])

  // İlçedeki ilanları filtrele
  const districtProperties = useMemo(() => {
    return properties.filter(p => p.city === selectedCity && p.district === selectedDistrict)
  }, [selectedCity, selectedDistrict])

  // Bölge analitiklerini hesapla
  const analytics = useMemo(() => {
    return calculateRegionAnalytics(properties, selectedDistrict, selectedCity, priceHistory)
  }, [selectedDistrict, selectedCity])

  // Fiyat değişimlerini hesapla
  const priceChange1Year = useMemo(() => {
    return calculatePriceChange(priceHistory, selectedDistrict, selectedCity, 12)
  }, [selectedDistrict, selectedCity])

  const priceChange5Year = useMemo(() => {
    return calculatePriceChange(priceHistory, selectedDistrict, selectedCity, 60)
  }, [selectedDistrict, selectedCity])

  // Yıllık ortalamalar
  const yearlyData = useMemo(() => {
    return getYearlyAverages(selectedDistrict, selectedCity)
  }, [selectedDistrict, selectedCity])

  // Son 24 ayın verisini al
  const recentHistory = useMemo(() => {
    const history = getPriceHistoryByDistrict(selectedDistrict, selectedCity)
    return history.slice(-24)
  }, [selectedDistrict, selectedCity])

  const cities = Array.from(new Set(districts.map(d => d.city)))

  // Çizilen alan analitikleri
  const drawnAreaAnalytics = useMemo(() => {
    if (!drawnAreaProperties || drawnAreaProperties.length === 0) return null

    const prices = drawnAreaProperties.map(p => p.priceNumeric)
    const pricesPerSqm = drawnAreaProperties.map(p => p.pricePerSqm)

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPricePerSqm = pricesPerSqm.reduce((a, b) => a + b, 0) / pricesPerSqm.length

    const sortedPrices = [...prices].sort((a, b) => a - b)
    const medianPrice = sortedPrices.length % 2 === 0
      ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
      : sortedPrices[Math.floor(sortedPrices.length / 2)]

    const typeDistribution = drawnAreaProperties.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      count: drawnAreaProperties.length,
      avgPrice,
      minPrice,
      maxPrice,
      medianPrice,
      avgPricePerSqm,
      typeDistribution
    }
  }, [drawnAreaProperties])

  const handleShapeDrawn = (filteredProperties: typeof properties) => {
    setDrawnAreaProperties(filteredProperties)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Bölgesel Analiz</h1>
          <p className="text-xl">Harita üzerinde bölge seçin ve detaylı emlak istatistiklerini görüntüleyin</p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bölge Seçin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value)
                  // Şehir değiştiğinde ilk ilçeyi seç
                  const newDistricts = districts.filter(d => d.city === e.target.value)
                  if (newDistricts.length > 0) {
                    setSelectedDistrict(newDistricts[0].name)
                  }
                }}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {cityDistricts.map(district => (
                  <option key={district.name} value={district.name}>{district.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        {districtData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Toplam İlan</div>
              <div className="text-3xl font-bold text-blue-600">{analytics.statistics.totalCount}</div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.statistics.saleCount} satılık, {analytics.statistics.rentCount} kiralık
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Ortalama Fiyat</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analytics.statistics.averagePrice)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Min: {formatCurrency(analytics.statistics.priceRange.min)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">m² Fiyatı</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analytics.statistics.averagePricePerSqm)}/m²
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Ortalama metrekare fiyatı
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Yıllık Değişim</div>
              <div className={`text-2xl font-bold ${priceChange1Year >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange1Year >= 0 ? '+' : ''}{priceChange1Year.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Son 12 ay
              </div>
            </div>
          </div>
        )}

        {/* Map with Drawing Tools */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">İnteraktif Harita</h2>
            <div className="text-sm text-gray-600">
              Sol üst köşedeki araçları kullanarak haritada bölge çizin
            </div>
          </div>
          <div className="h-[500px]">
            <DrawableMap
              properties={districtProperties}
              onShapeDrawn={handleShapeDrawn}
              center={districtData ? [districtData.coordinates.lat, districtData.coordinates.lng] : undefined}
              zoom={12}
            />
          </div>
        </div>

        {/* Drawn Area Analysis */}
        {drawnAreaAnalytics && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Çizilen Bölge Analizi</h2>
              <button
                onClick={() => setDrawnAreaProperties(null)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Temizle
              </button>
            </div>

            {/* Key Stats for Drawn Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600 mb-1">Toplam İlan</div>
                <div className="text-3xl font-bold text-blue-600">{drawnAreaAnalytics.count}</div>
                <div className="text-xs text-gray-500 mt-1">Seçili bölgede</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600 mb-1">Ortalama Fiyat</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(drawnAreaAnalytics.avgPrice)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Medyan: {formatCurrency(drawnAreaAnalytics.medianPrice)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600 mb-1">Fiyat Aralığı</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(drawnAreaAnalytics.minPrice)}
                </div>
                <div className="text-xs text-gray-500">
                  - {formatCurrency(drawnAreaAnalytics.maxPrice)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-600 mb-1">m² Fiyatı</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(drawnAreaAnalytics.avgPricePerSqm)}/m²
                </div>
                <div className="text-xs text-gray-500 mt-1">Ortalama</div>
              </div>
            </div>

            {/* Type Distribution */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">İlan Tipi Dağılımı</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.entries(drawnAreaAnalytics.typeDistribution).map(([type, count]) => (
                  <div key={type} className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <div className="text-xs text-gray-600">{type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison with District */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">İlçe ile Karşılaştırma</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <div className="text-sm text-gray-600 mb-1">Ortalama Fiyat Farkı</div>
                  <div className={`text-xl font-bold ${drawnAreaAnalytics.avgPrice > analytics.statistics.averagePrice ? 'text-red-600' : 'text-green-600'}`}>
                    {drawnAreaAnalytics.avgPrice > analytics.statistics.averagePrice ? '+' : ''}
                    {(((drawnAreaAnalytics.avgPrice - analytics.statistics.averagePrice) / analytics.statistics.averagePrice) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">İlçe ortalamasına göre</div>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <div className="text-sm text-gray-600 mb-1">m² Fiyat Farkı</div>
                  <div className={`text-xl font-bold ${drawnAreaAnalytics.avgPricePerSqm > analytics.statistics.averagePricePerSqm ? 'text-red-600' : 'text-green-600'}`}>
                    {drawnAreaAnalytics.avgPricePerSqm > analytics.statistics.averagePricePerSqm ? '+' : ''}
                    {(((drawnAreaAnalytics.avgPricePerSqm - analytics.statistics.averagePricePerSqm) / analytics.statistics.averagePricePerSqm) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">İlçe ortalamasına göre</div>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <div className="text-sm text-gray-600 mb-1">İlan Yoğunluğu</div>
                  <div className="text-xl font-bold text-gray-900">
                    {((drawnAreaAnalytics.count / analytics.statistics.totalCount) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Toplam ilanların oranı</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PriceTrendChart
            data={recentHistory}
            title="Son 2 Yıl Fiyat Trendi"
          />

          <CategoryDistributionChart
            distribution={analytics.statistics.categoryDistribution}
            title="Kategori Dağılımı"
          />
        </div>

        {/* Yearly Comparison */}
        <div className="mb-8">
          <YearlyComparisonChart
            data={yearlyData}
            title="Yıllara Göre Ortalama Fiyat Değişimi (2020-2024)"
          />
        </div>

        {/* Detailed Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detaylı İstatistikler</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <div className="text-sm text-gray-600 mb-1">5 Yıllık Değişim</div>
              <div className={`text-2xl font-bold ${priceChange5Year >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange5Year >= 0 ? '+' : ''}{priceChange5Year.toFixed(1)}%
              </div>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <div className="text-sm text-gray-600 mb-1">Medyan Fiyat</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.statistics.medianPrice)}
              </div>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <div className="text-sm text-gray-600 mb-1">Maksimum Fiyat</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.statistics.priceRange.max)}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Kategorilere Göre Dağılım</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(analytics.statistics.categoryDistribution).map(([category, count]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-sm text-gray-600">{category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
