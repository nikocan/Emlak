'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { subscriptionPlans } from '@/data/plans'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Emlak İşinizi Dijital Dünyaya Taşıyın
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Profesyonel emlak yönetim platformu ile ilanlarınızı yönetin, potansiyel
                müşterilerinizi takip edin ve satışlarınızı artırın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors text-center"
                >
                  14 Gün Ücretsiz Deneyin
                </Link>
                <Link
                  href="/pricing"
                  className="bg-blue-500 bg-opacity-20 backdrop-blur text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-30 transition-colors text-center border-2 border-white border-opacity-20"
                >
                  Fiyatları Görüntüle
                </Link>
              </div>
              <p className="mt-4 text-sm text-blue-200">
                ✓ Kredi kartı gerekmez  ✓ Anında başlayın  ✓ İstediğiniz zaman iptal edin
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-4xl">📊</div>
                    <div>
                      <div className="font-semibold">Detaylı Analitik</div>
                      <div className="text-sm text-blue-100">Gerçek zamanlı raporlar</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-4xl">🗺️</div>
                    <div>
                      <div className="font-semibold">Harita Entegrasyonu</div>
                      <div className="text-sm text-blue-100">İnteraktif konum gösterimi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-4xl">💬</div>
                    <div>
                      <div className="font-semibold">Lead Yönetimi</div>
                      <div className="text-sm text-blue-100">Müşteri takip sistemi</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Emlakçı</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Aktif İlan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Aylık Görüntülenme</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">%95</div>
              <div className="text-gray-600">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              İhtiyacınız Olan Her Şey Tek Platformda
            </h2>
            <p className="text-xl text-gray-600">
              Emlak işinizi yönetmek için gereken tüm araçlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kolay İlan Yönetimi</h3>
              <p className="text-gray-600">
                İlanlarınızı hızlıca ekleyin, düzenleyin ve yayınlayın. Sürükle-bırak ile fotoğraf
                yükleyin.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detaylı Analitik</h3>
              <p className="text-gray-600">
                İlanlarınızın performansını izleyin. Görüntülenme, tıklama ve lead istatistikleri.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">CRM ve Lead Yönetimi</h3>
              <p className="text-gray-600">
                Potansiyel müşterilerinizi takip edin. Her lead için notlar ve durumlar.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">İnteraktif Harita</h3>
              <p className="text-gray-600">
                İlanlarınızı harita üzerinde gösterin. Bölge bazlı fiyat analizi yapın.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobil Uyumlu</h3>
              <p className="text-gray-600">
                Tüm cihazlarda mükemmel görünüm. Mobil, tablet ve masaüstü desteği.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Entegrasyonlar</h3>
              <p className="text-gray-600">
                Popüler emlak portalları ile otomatik senkronizasyon. API desteği.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-xl text-gray-600">3 basit adımda başlayın</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kayıt Olun</h3>
              <p className="text-gray-600">
                14 gün ücretsiz deneme ile başlayın. Kredi kartı gerekmez.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">İlanları Ekleyin</h3>
              <p className="text-gray-600">
                Emlak ilanlarınızı hızlıca platforma yükleyin ve yayınlayın.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Satın</h3>
              <p className="text-gray-600">
                Leadlerinizi takip edin, raporlarınızı görüntüleyin ve satışlarınızı artırın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Size Uygun Paketi Seçin</h2>
            <p className="text-xl text-gray-600">Esnek fiyatlandırma, güçlü özellikler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-lg p-8 ${
                  plan.popular ? 'ring-4 ring-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="text-blue-600 font-semibold text-sm mb-2">EN POPÜLER</div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">₺{plan.price.monthly}</span>
                  <span className="text-gray-600">/ay</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Detayları Gör
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-block text-blue-600 hover:underline font-semibold"
            >
              Tüm paketleri karşılaştır →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Hemen Başlayın</h2>
          <p className="text-xl mb-8 text-blue-100">
            14 gün boyunca tüm özellikleri ücretsiz deneyin. Kredi kartı bilgisi gerekmez.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Ücretsiz Deneyin
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
