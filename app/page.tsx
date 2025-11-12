'use client'

import { useState, useMemo } from 'react'
import PropertyCard from '@/components/PropertyCard'
import PropertyFilter from '@/components/PropertyFilter'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { properties } from '@/data/properties'
import { FilterOptions } from '@/lib/types'

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({})

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      if (filters.type && filters.type !== 'all' && property.type !== filters.type) {
        return false
      }
      if (filters.category && property.category !== filters.category) {
        return false
      }
      if (filters.city && property.city !== filters.city) {
        return false
      }
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
        return false
      }
      return true
    })
  }, [filters])

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-4">Hayalinizdeki Evi Bulun</h2>
          <p className="text-xl mb-8">Binlerce emlak ilanı arasından size en uygun olanı seçin</p>
          <div className="flex gap-4 justify-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Şehir, semt veya mahalle..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ara
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{properties.length}</div>
            <div className="text-gray-600">Toplam İlan</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {properties.filter(p => p.type === 'Satılık').length}
            </div>
            <div className="text-gray-600">Satılık</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {properties.filter(p => p.type === 'Kiralık').length}
            </div>
            <div className="text-gray-600">Kiralık</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
            <div className="text-gray-600">Şehir</div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8">Tüm İlanlar</h3>

        <PropertyFilter onFilterChange={handleFilterChange} />

        {filteredProperties.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              {filteredProperties.length} ilan bulundu
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">İlan Bulunamadı</h4>
            <p className="text-gray-600">Filtreleri değiştirerek tekrar deneyin</p>
          </div>
        )}
      </section>

      {/* Analytics CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-12 text-white text-center">
          <h3 className="text-4xl font-bold mb-4">📊 Bölge Analizi</h3>
          <p className="text-xl mb-6">
            Harita üzerinde bölge seçin, fiyat trendlerini görüntüleyin, detaylı istatistiklere ulaşın
          </p>
          <a
            href="/analytics"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Bölge Analizini Görüntüle
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Neden Biz?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Güvenilir</h4>
              <p className="text-gray-600">Tüm ilanlarımız doğrulanmış ve günceldir</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Hızlı</h4>
              <p className="text-gray-600">Aradığınız evi anında bulun</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Profesyonel</h4>
              <p className="text-gray-600">Uzman danışmanlarımız her zaman yanınızda</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Analitik</h4>
              <p className="text-gray-600">Piyasa analizi ve fiyat trendleri</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
