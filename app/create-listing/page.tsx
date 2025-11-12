'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialMediaPostGenerator from '@/components/SocialMediaPostGenerator'

export default function CreateListingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form verileri
  const [formData, setFormData] = useState({
    title: '',
    type: 'Daire',
    category: 'Satılık',
    city: 'İstanbul',
    district: 'Beşiktaş',
    price: '',
    area: '',
    rooms: '2+1',
    floor: '',
    buildingAge: '',
    description: '',
    features: [] as string[],
    images: [] as string[],
  })

  const [aiGeneratedText, setAiGeneratedText] = useState<any>(null)
  const [enhancedImages, setEnhancedImages] = useState<string[]>([])

  const propertyTypes = ['Daire', 'Villa', 'Rezidans', 'Dubleks', 'Müstakil Ev', 'Yazlık']
  const roomOptions = ['1+0', '1+1', '2+1', '3+1', '4+1', '5+1', '6+1']
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya']

  const availableFeatures = [
    'Asansör',
    'Otopark',
    'Güvenlik',
    'Havuz',
    'Spor Salonu',
    'Çocuk Parkı',
    'Jeneratör',
    'Balkon',
    'Teras',
    'Bahçe',
  ]

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const generateAIText = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: {
            type: formData.type,
            city: formData.city,
            district: formData.district,
            area: parseInt(formData.area),
            rooms: formData.rooms,
            price: parseInt(formData.price),
            features: formData.features,
          },
          tone: 'professional',
          length: 'medium',
          includeEmojis: true,
        }),
      })

      const data = await response.json()

      if (data.success && data.result) {
        setAiGeneratedText(data.result)
        setFormData(prev => ({
          ...prev,
          title: data.result.title,
          description: data.result.description,
        }))
      }
    } catch (error) {
      console.error('AI text generation error:', error)
      alert('AI metin oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const enhanceImage = async (imageUrl: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          options: {
            autoEnhance: true,
            brightness: 10,
            contrast: 15,
            sharpness: 20,
          },
        }),
      })

      const data = await response.json()

      if (data.success && data.result) {
        setEnhancedImages(prev => [...prev, data.result.enhancedUrl])
        alert('Görsel başarıyla iyileştirildi!')
      }
    } catch (error) {
      console.error('Image enhancement error:', error)
      alert('Görsel iyileştirme sırasında hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 AI Destekli İlan Oluştur
          </h1>
          <p className="text-gray-600">
            Yapay zeka ile profesyonel ilan metinleri oluşturun, görselleri iyileştirin ve sosyal
            medyada paylaşın
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Temel Bilgiler' },
              { num: 2, label: 'AI İyileştirme' },
              { num: 3, label: 'Sosyal Medya' },
            ].map(s => (
              <div key={s.num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s.num}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{s.label}</div>
                </div>
                {s.num < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Temel Bilgiler */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Temel Bilgiler</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlan Tipi
                </label>
                <select
                  value={formData.type}
                  onChange={e => updateFormData('type', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={e => updateFormData('category', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Satılık">Satılık</option>
                  <option value="Kiralık">Kiralık</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                <select
                  value={formData.city}
                  onChange={e => updateFormData('city', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İlçe</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => updateFormData('district', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Örn: Beşiktaş"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => updateFormData('price', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Örn: 5000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alan (m²)</label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={e => updateFormData('area', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Örn: 150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oda Sayısı
                </label>
                <select
                  value={formData.rooms}
                  onChange={e => updateFormData('rooms', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  {roomOptions.map(room => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kat</label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={e => updateFormData('floor', e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Örn: 5"
                />
              </div>
            </div>

            {/* Özellikler */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Özellikler (Seçiniz)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {availableFeatures.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                      formData.features.includes(feature)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {formData.features.includes(feature) ? '✓ ' : ''}
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.price || !formData.area}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition"
              >
                Sonraki: AI İyileştirme →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: AI İyileştirme */}
        {step === 2 && (
          <div className="space-y-6">
            {/* AI Metin Oluşturma */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🤖 AI ile Metin Oluştur
              </h2>

              <p className="text-gray-600 mb-4">
                Yapay zeka, ilanınız için profesyonel başlık ve açıklama oluşturacak
              </p>

              <button
                onClick={generateAIText}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition mb-4"
              >
                {loading ? 'Oluşturuluyor...' : '✨ AI ile Oluştur'}
              </button>

              {aiGeneratedText && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oluşturulan Başlık
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => updateFormData('title', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oluşturulan Açıklama
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => updateFormData('description', e.target.value)}
                      rows={10}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div className="text-sm text-green-800">
                        <strong>AI Sonuçları:</strong>
                        <ul className="mt-2 space-y-1">
                          <li>• SEO Skoru: {aiGeneratedText.seoScore}/100</li>
                          <li>• Kelime Sayısı: {aiGeneratedText.wordCount}</li>
                          <li>• Ton: {aiGeneratedText.tone}</li>
                          <li>• Hashtag: {aiGeneratedText.hashtags?.join(', ')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Görsel İyileştirme */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎨 Görsel İyileştirme
              </h2>

              <p className="text-gray-600 mb-4">
                Görselleri AI ile otomatik iyileştirin (demo)
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="text-sm text-yellow-800">
                    <strong>Görsel İyileştirme Özellikleri:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Otomatik parlaklık ve kontrast ayarı</li>
                      <li>• 4K upscaling (2x, 4x)</li>
                      <li>• Arka plan kaldırma</li>
                      <li>• Sanal mobilyalama (Virtual Staging)</li>
                      <li>• HDR iyileştirme</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
              >
                ← Geri
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Sonraki: Sosyal Medya →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sosyal Medya */}
        {step === 3 && (
          <div className="space-y-6">
            <SocialMediaPostGenerator
              property={{
                title: formData.title || `${formData.type} ${formData.rooms}`,
                type: formData.type,
                city: formData.city,
                district: formData.district,
                price: `${parseInt(formData.price || '0').toLocaleString('tr-TR')} ₺`,
                area: parseInt(formData.area || '0'),
                rooms: formData.rooms,
                features: formData.features,
                images: formData.images,
              }}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
              >
                ← Geri
              </button>
              <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                ✅ İlanı Kaydet ve Yayınla
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
