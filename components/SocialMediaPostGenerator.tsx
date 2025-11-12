'use client'

import { useState } from 'react'
import { SocialPlatform, PLATFORM_CONFIG } from '@/lib/types/social'

interface SocialMediaPostGeneratorProps {
  property: {
    title: string
    type: string
    city: string
    district: string
    price: string
    area: number
    rooms: string
    features?: string[]
    images?: string[]
  }
}

export default function SocialMediaPostGenerator({ property }: SocialMediaPostGeneratorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    SocialPlatform.FACEBOOK,
    SocialPlatform.INSTAGRAM,
  ])
  const [tone, setTone] = useState<'professional' | 'casual' | 'luxury' | 'friendly'>('professional')
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([])

  const platforms = Object.values(SocialPlatform)

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const generatePosts = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Lütfen en az bir platform seçin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/social/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property,
          platforms: selectedPlatforms,
          useAI: true,
          aiOptions: {
            tone,
            includeEmojis,
            length: 'medium',
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedPosts(data.posts)
      } else {
        alert('Hata: ' + data.error)
      }
    } catch (error) {
      console.error('Post generation error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Metin kopyalandı!')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Sosyal Medya Paylaşımı Oluştur
      </h2>

      {/* Platform Seçimi */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Platformlar Seçin
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platforms.map(platform => {
            const config = PLATFORM_CONFIG[platform]
            const isSelected = selectedPlatforms.includes(platform)

            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`p-4 rounded-lg border-2 transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{config.name}</div>
                    <div className="text-xs text-gray-500">
                      {isSelected ? 'Seçili' : 'Seç'}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Ton Seçimi */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Yazım Tonu
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'professional', label: 'Profesyonel', icon: '💼' },
            { value: 'casual', label: 'Samimi', icon: '😊' },
            { value: 'luxury', label: 'Lüks', icon: '💎' },
            { value: 'friendly', label: 'Arkadaşça', icon: '👋' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTone(option.value as any)}
              className={`p-3 rounded-lg border-2 transition ${
                tone === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Emoji Seçeneği */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeEmojis}
            onChange={(e) => setIncludeEmojis(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Emoji kullan 😊🏡📍
          </span>
        </label>
      </div>

      {/* Oluştur Butonu */}
      <button
        onClick={generatePosts}
        disabled={loading || selectedPlatforms.length === 0}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition"
      >
        {loading ? 'Oluşturuluyor...' : '🤖 AI ile Post Oluştur'}
      </button>

      {/* Oluşturulan Post'lar */}
      {generatedPosts.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Oluşturulan Paylaşımlar</h3>

          {generatedPosts.map((post, index) => {
            const config = PLATFORM_CONFIG[post.platform]

            return (
              <div key={index} className="border-2 border-gray-200 rounded-lg p-5">
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: config.color }}
                    >
                      {config.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{config.name}</div>
                      <div className="text-sm text-gray-600">
                        {post.characterCount} karakter
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(
                      post.content.text + '\n\n' + post.content.hashtags.join(' ')
                    )}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                  >
                    📋 Kopyala
                  </button>
                </div>

                {/* Post İçeriği */}
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                    {post.content.text}
                  </pre>
                </div>

                {/* Hashtags */}
                {post.content.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.content.hashtags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* İstatistikler */}
                {post.estimatedReach && (
                  <div className="text-sm text-gray-600">
                    📊 Tahmini erişim: ~{Math.round(post.estimatedReach)} kişi
                  </div>
                )}
              </div>
            )
          })}

          {/* Toplu İşlemler */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
              ✅ Tümünü Onayla ve Paylaş
            </button>
            <button className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition">
              ⏰ Zamanla
            </button>
          </div>
        </div>
      )}

      {/* Bilgilendirme */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div className="text-sm text-blue-800">
            <strong>AI Destekli Post Oluşturma:</strong> İlanınız için özel olarak
            hazırlanmış, platform limitlerini dikkate alan ve SEO uyumlu içerikler
            otomatik oluşturulur.
          </div>
        </div>
      </div>
    </div>
  )
}
