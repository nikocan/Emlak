'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { subscriptionPlans, calculateYearlySavings } from '@/data/plans'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Fiyatlandırma</h1>
          <p className="text-xl mb-8">
            İşinize en uygun paketi seçin ve hemen başlayın
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={billingCycle === 'monthly' ? 'font-bold' : 'text-gray-200'}>
              Aylık
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-white"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-blue-600 transition ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingCycle === 'yearly' ? 'font-bold' : 'text-gray-200'}>
              Yıllık
              <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded">
                %17 tasarruf
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
            const savings = calculateYearlySavings(plan)

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-4 ring-blue-600 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                    En Popüler
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ₺{price}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                    </span>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-green-600 mt-2">
                        Yıllık ₺{savings} tasarruf
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/login"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Hemen Başla
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Tüm paketlerde 14 gün ücretsiz deneme. Kredi kartı gerekmez.
          </p>
          <p className="text-gray-600">
            Sorularınız mı var?{' '}
            <Link href="/iletisim" className="text-blue-600 hover:underline">
              Bize ulaşın
            </Link>
          </p>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Özellik Karşılaştırması
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4">Özellik</th>
                  {subscriptionPlans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-4">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4">Maksimum İlan Sayısı</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4">
                      {plan.limits.maxListings === -1 ? 'Sınırsız' : plan.limits.maxListings}
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-4 px-4">Fotoğraf / İlan</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4">
                      {plan.limits.maxPhotos === -1 ? 'Sınırsız' : plan.limits.maxPhotos}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Gelişmiş Analitik</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4">
                      {plan.limits.analytics ? '✓' : '—'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-4 px-4">API Erişimi</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4">
                      {plan.limits.apiAccess ? '✓' : '—'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Özel Domain</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4">
                      {plan.limits.customDomain ? '✓' : '—'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-4 px-4">Takım Üyesi</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4">
                      {plan.limits.teamMembers === -1 ? 'Sınırsız' : plan.limits.teamMembers}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Destek</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 px-4 capitalize">
                      {plan.limits.support}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Sık Sorulan Sorular
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ücretsiz deneme süresi var mı?
            </h3>
            <p className="text-gray-600">
              Evet, tüm paketlerimizde 14 gün ücretsiz deneme süresi bulunmaktadır. Kredi kartı
              bilgisi gerekmez.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Paketimi dilediğim zaman değiştirebilir miyim?
            </h3>
            <p className="text-gray-600">
              Evet, istediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Değişiklik
              anında geçerli olur.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              İptal politikanız nedir?
            </h3>
            <p className="text-gray-600">
              Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem
              sonuna kadar hizmet almaya devam edersiniz.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Özel entegrasyon desteği sunuyor musunuz?
            </h3>
            <p className="text-gray-600">
              Enterprise paketimizde özel entegrasyon desteği bulunmaktadır. Ayrıca tüm paketlerde
              yaygın emlak portallarıyla entegrasyon mevcuttur.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
