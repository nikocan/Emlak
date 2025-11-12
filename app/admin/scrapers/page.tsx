'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ScraperSource, ScrapeResult, ScraperStatus } from '@/lib/types/scraper'

interface ScraperStatusInfo {
  enabled: boolean
  canMakeRequest: boolean
  config: any
}

export default function ScrapersAdminPage() {
  const [scraperStatuses, setScraperStatuses] = useState<Record<ScraperSource, ScraperStatusInfo> | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSource, setSelectedSource] = useState<ScraperSource>(ScraperSource.SAHIBINDEN)
  const [city, setCity] = useState('İstanbul')
  const [district, setDistrict] = useState('Beşiktaş')
  const [results, setResults] = useState<ScrapeResult[]>([])
  const [testResults, setTestResults] = useState<Record<string, boolean> | null>(null)

  // Scraper durumlarını yükle
  useEffect(() => {
    fetchScraperStatuses()
  }, [])

  const fetchScraperStatuses = async () => {
    try {
      const response = await fetch('/api/scrape')
      const data = await response.json()
      setScraperStatuses(data.statuses)
    } catch (error) {
      console.error('Failed to fetch scraper statuses:', error)
    }
  }

  const handleScrape = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: selectedSource,
          city,
          district,
          options: {
            maxPages: 2,
            includeDetails: false,
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        setResults([data.result, ...results])
        alert(`Başarılı! ${data.result.totalSaved} ilan çekildi.`)
      } else {
        alert(`Hata: ${data.error}`)
      }
    } catch (error) {
      console.error('Scrape error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleScrapeAll = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/scrape/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          district,
          options: {
            maxPages: 1,
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        setResults([...data.results, ...results])
        alert(`Başarılı! Toplam ${data.summary.totalProperties} ilan çekildi.`)
      } else {
        alert(`Hata: ${data.error}`)
      }
    } catch (error) {
      console.error('Scrape all error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleTestAll = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/scrape/test')
      const data = await response.json()
      if (data.success) {
        setTestResults(data.results)
      }
    } catch (error) {
      console.error('Test error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: ScraperStatus) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      rate_limited: 'bg-yellow-100 text-yellow-800',
      idle: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || colors.idle
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Veri Çekme Yönetimi</h1>
          <p className="text-gray-600">
            Emlak sitelerinden ilan çekin ve veritabanınızı güncelleyin
          </p>
        </div>

        {/* Scraper Durumları */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Scraper Durumları</h2>
            <button
              onClick={handleTestAll}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              Tümünü Test Et
            </button>
          </div>

          {scraperStatuses && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(scraperStatuses).map(([source, status]) => (
                <div key={source} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 capitalize">{source}</h3>
                    {testResults && (
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          testResults[source]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {testResults[source] ? 'Çalışıyor' : 'Hata'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className={status.enabled ? 'text-green-600' : 'text-red-600'}>
                        {status.enabled ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">İstek Yapılabilir:</span>
                      <span className={status.canMakeRequest ? 'text-green-600' : 'text-red-600'}>
                        {status.canMakeRequest ? 'Evet' : 'Hayır'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate Limit:</span>
                      <span className="text-gray-900">
                        {status.config.maxRequestsPerMinute}/dk
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scraping Kontrolü */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Veri Çekme İşlemi Başlat</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kaynak</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as ScraperSource)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {Object.values(ScraperSource).map((source) => (
                  <option key={source} value={source} className="capitalize">
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleScrape}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'İşleniyor...' : 'Seçili Kaynaktan Çek'}
            </button>

            <button
              onClick={handleScrapeAll}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'İşleniyor...' : 'Tüm Kaynaklardan Çek'}
            </button>
          </div>
        </div>

        {/* Sonuçlar */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">İşlem Geçmişi</h2>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 capitalize">
                        {result.source}
                      </span>
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(
                          result.status
                        )}`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(result.startedAt).toLocaleString('tr-TR')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Bulunan</div>
                      <div className="text-lg font-bold text-gray-900">
                        {result.totalFound}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">İşlenen</div>
                      <div className="text-lg font-bold text-gray-900">
                        {result.totalProcessed}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Kaydedilen</div>
                      <div className="text-lg font-bold text-green-600">
                        {result.totalSaved}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Hata</div>
                      <div className="text-lg font-bold text-red-600">
                        {result.totalErrors}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Süre</div>
                      <div className="text-lg font-bold text-gray-900">
                        {(result.duration / 1000).toFixed(1)}s
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uyarı */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Önemli Uyarı:</strong> Bu özellik şu an demo amaçlı mock verilerle
                çalışmaktadır. Gerçek emlak sitelerinden veri çekmek için:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-yellow-700 space-y-1">
                <li>Sitelerin robots.txt dosyalarını ve kullanım koşullarını kontrol edin</li>
                <li>Yasal izinleri alın veya resmi API kullanın</li>
                <li>Rate limiting kurallarına uyun</li>
                <li>Telif hakları ve kişisel verileri koruyun</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
