# 🏠 Emlak - AI Destekli Emlak Yönetim Platformu

> Modern, ölçeklenebilir ve AI destekli emlak yönetim platformu. Emlakçılar için profesyonel SaaS çözümü.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## 🎯 Genel Bakış

Emlak, Next.js 16 ile geliştirilmiş, modüler mimariye sahip, yapay zeka destekli modern bir emlak yönetim platformudur. Emlakçıların işlerini kolaylaştırmak, verimliliği artırmak ve dijital dönüşüme yardımcı olmak için tasarlanmıştır.

### 🌟 Temel Özellikler

- 🤖 **AI Destekli İçerik**: Otomatik ilan metni ve görsel iyileştirme
- 📱 **Sosyal Medya Entegrasyonu**: 6 platformda tek tıkla paylaşım
- 🗺️ **İnteraktif Harita ve Analiz**: Bölge çizme ve detaylı analitik
- 📊 **Kapsamlı Bölge Analizi**: Fiyat trendleri ve pazar analizi
- 🔄 **Veri Çekme Sistemi**: Otomatik emlak sitelerinden veri toplama
- 💼 **SaaS Platform**: Abonelik tabanlı iş modeli

## 📚 Dokümantasyon

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Mimari detayları ve teknik dokümantasyon
- **[SCRAPER_README.md](SCRAPER_README.md)** - Veri çekme sistemi rehberi
- **[AI_SOCIAL_MEDIA_README.md](AI_SOCIAL_MEDIA_README.md)** - AI ve sosyal medya özellikleri

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+ veya 20+
- npm 9+

### Kurulum

```bash
# Repository'yi klonlayın
git clone <repository-url>
cd Emlak

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

### Production Build

```bash
npm run build
npm start
```

## 🎨 Özellikler

### 🤖 AI Destekli Özellikler

#### Görsel İyileştirme
- ✨ Otomatik parlaklık/kontrast ayarı
- 📐 2x ve 4x görsel büyütme (upscaling)
- 🎭 Arka plan kaldırma
- 🛋️ Sanal mobilyalama (5 farklı stil)
- 💫 HDR ve gürültü azaltma

#### Metin Oluşturma
- ✍️ Profesyonel ilan açıklamaları
- 📝 SEO-uyumlu başlıklar
- #️⃣ Otomatik hashtag önerileri
- 🎭 4 farklı ton (Profesyonel, Samimi, Lüks, Arkadaşça)

### 📱 Sosyal Medya Entegrasyonu

**6 Platform Desteği:**
- 📘 Facebook
- 📸 Instagram
- 🐦 Twitter
- 💼 LinkedIn
- 💚 WhatsApp
- ✈️ Telegram

**Özellikler:**
- 🤖 AI ile otomatik post oluşturma
- 📏 Platform limitlerini otomatik kontrol
- 🎨 Her platform için özel format
- 📊 Erişim tahmini
- ⏰ Post zamanlama (hazır altyapı)

### 🗺️ Harita ve Bölge Analizi

- **İnteraktif Harita**: Leaflet tabanlı harita sistemi
- **Bölge Çizme**: Polygon, rectangle, circle çizim araçları
- **Jeospatial Filtreleme**: Ray Casting ve Haversine algoritmaları
- **Fiyat Analizi**: Ortalama, medyan, min/max fiyatlar
- **Trend Grafikleri**: 2020-2024 fiyat geçmişi
- **m² Fiyat Hesaplamaları**: Bölgesel metrekare fiyatları

### 🔄 Veri Çekme Sistemi (Scraper)

**Desteklenen Kaynaklar:**
- Sahibinden
- Hepsiemlak
- Emlakjet
- Zingat

**Özellikler:**
- ✅ Modüler scraper mimarisi
- ✅ Rate limiting (30 istek/dakika)
- ✅ Retry logic (exponential backoff)
- ✅ Veri normalizasyonu
- ✅ Paralel veri çekme
- ✅ Admin kontrol paneli

### 💼 SaaS ve Abonelik Sistemi

**3 Paket:**
- **Başlangıç** - ₺499/ay (₺4.990/yıl)
- **Profesyonel** - ₺999/ay (₺9.990/yıl)
- **Kurumsal** - ₺2.499/ay (₺24.990/yıl)

**Özellikler:**
- 📊 Kullanıcı dashboard'u
- 📈 İlan ve lead takibi
- 💳 Esnek fiyatlandırma
- 🎁 14 gün ücretsiz deneme

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5.9
- **Maps**: Leaflet + React-Leaflet + Leaflet-Draw
- **Charts**: Recharts

### Backend (API Routes)
- **Runtime**: Next.js API Routes
- **Validation**: Custom validators
- **Error Handling**: Custom error classes

### AI Services (Opsiyonel)
- **Text Generation**: OpenAI GPT-4
- **Image Enhancement**: Stability AI
- **Background Removal**: Remove.bg
- **Upscaling**: Replicate (Real-ESRGAN)

### Social Media APIs
- Facebook Graph API
- Instagram Graph API
- Twitter API v2
- LinkedIn Share API

## 📁 Proje Yapısı

```
Emlak/
├── app/                      # Next.js App Router
│   ├── (pages)/              # Public pages
│   ├── admin/                # Admin pages
│   ├── api/                  # API endpoints
│   │   ├── ai/               # AI services
│   │   ├── scrape/           # Scraper API
│   │   └── social/           # Social media API
│   └── create-listing/       # AI-powered listing creation
│
├── components/               # React components
│   ├── Header.tsx
│   ├── DrawableMap.tsx
│   ├── SocialMediaPostGenerator.tsx
│   └── index.ts              # Barrel export
│
├── lib/                      # Core business logic
│   ├── config/               # App configuration
│   ├── services/             # Business services
│   │   ├── aiService.ts
│   │   ├── scraperService.ts
│   │   └── socialMediaService.ts
│   ├── scrapers/             # Scraper implementations
│   ├── types/                # TypeScript types
│   ├── utils/                # Utilities
│   │   ├── api.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── errors.ts
│   │   └── constants.ts
│   └── index.ts              # Main barrel export
│
├── data/                     # Mock/Static data
└── public/                   # Static assets

Total: 57 TypeScript files
```

## 🔧 Konfigürasyon

### Environment Variables

`.env.local` dosyası oluşturun:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Services (Opsiyonel)
OPENAI_API_KEY=sk-...
STABILITY_API_KEY=sk-...
REMOVEBG_API_KEY=...
REPLICATE_API_TOKEN=r8_...

# Social Media (Opsiyonel)
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
INSTAGRAM_CLIENT_ID=...
# ... etc
```

## 📊 Kullanım Örnekleri

### AI ile İlan Oluşturma

```typescript
import { aiService } from '@/lib/services'

const result = await aiService.process({
  feature: AIFeature.DESCRIPTION_GENERATION,
  input: '',
  options: {
    property: {
      type: 'Daire',
      city: 'İstanbul',
      district: 'Beşiktaş',
      area: 150,
      rooms: '3+1',
      price: 5000000
    },
    tone: 'professional',
    includeEmojis: true
  }
})
```

### Sosyal Medya Post'u Oluşturma

```typescript
import { socialMediaService } from '@/lib/services'

const posts = await socialMediaService.generatePost({
  property: { /* ... */ },
  platforms: [SocialPlatform.FACEBOOK, SocialPlatform.INSTAGRAM],
  useAI: true,
  aiOptions: {
    tone: 'casual',
    includeEmojis: true
  }
})
```

### Veri Çekme

```typescript
import { scraperService } from '@/lib/services'

const result = await scraperService.scrape(
  ScraperSource.SAHIBINDEN,
  'İstanbul',
  'Beşiktaş',
  { maxPages: 2 }
)
```

## 🎯 Kullanım Senaryoları

### 1. İlan Oluşturma
**URL**: `/create-listing`

1. Temel bilgileri girin (konum, fiyat, alan)
2. AI ile otomatik metin oluştur
3. Görselleri yükle ve iyileştir
4. Sosyal medya için post oluştur
5. Tümünü tek tıkla paylaş

### 2. Bölge Analizi
**URL**: `/analytics`

1. Şehir ve ilçe seçin
2. Haritada bölge çizin
3. Detaylı istatistikleri görün
4. Fiyat trendlerini inceleyin

### 3. Veri Çekme
**URL**: `/admin/scrapers`

1. Kaynak sitesini seçin
2. Lokasyon belirleyin
3. Veri çekme işlemini başlatın
4. Sonuçları görüntüleyin

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📦 Build & Deploy

### Vercel'e Deploy

```bash
# Vercel CLI ile
vercel

# Veya GitHub entegrasyonu ile otomatik deploy
```

### Diğer Platformlar

```bash
# Production build
npm run build

# Start production server
npm start
```

## 🔒 Güvenlik

- ✅ TypeScript ile tip güvenliği
- ✅ Input validation
- ✅ Rate limiting
- ✅ Error handling
- ✅ Env variable yönetimi
- ✅ Secure API endpoints

## ⚡ Performans

- ✅ Server Components (default)
- ✅ Dynamic imports
- ✅ Image optimization
- ✅ Code splitting
- ✅ Memoization
- ✅ Caching strategies

## 🐛 Troubleshooting

### Harita Görünmüyor
```bash
# Leaflet CSS'in yüklendiğinden emin olun
# app/globals.css kontrol edin
```

### AI Özellikleri Çalışmıyor
```bash
# API key'lerini kontrol edin
# Şu an mock mode'da çalışıyor, gerçek API key ekleyin
```

### Scraper Hataları
```bash
# Rate limiting aktif olabilir
# robots.txt ve ToS kontrol edin
```

## 📈 Roadmap

### v1.1 (Q2 2024)
- [ ] Gerçek veritabanı entegrasyonu (PostgreSQL)
- [ ] Redis caching
- [ ] Real-time notifications
- [ ] Advanced search filters

### v1.2 (Q3 2024)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Virtual tours (360°)

### v2.0 (Q4 2024)
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] WebSocket real-time updates
- [ ] Advanced AI features

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team** - Initial work and maintenance
- **Contributors** - See the list of [contributors](https://github.com/yourrepo/contributors)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React team for the UI library
- Leaflet for the mapping solution
- All open-source contributors

## 📞 İletişim

- **Issues**: [GitHub Issues](https://github.com/yourrepo/issues)
- **Email**: support@example.com
- **Website**: https://yourdomain.com

---

**Made with ❤️ by Development Team**

**Version**: 1.0.0 | **Last Updated**: 2024-01-15
