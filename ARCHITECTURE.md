# 🏗️ Emlak - Mimari Dokümantasyon

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Teknoloji Stack](#teknoloji-stack)
- [Klasör Yapısı](#klasör-yapısı)
- [Katmanlı Mimari](#katmanlı-mimari)
- [Modüller ve Özellikler](#modüller-ve-özellikler)
- [Veri Akışı](#veri-akışı)
- [State Yönetimi](#state-yönetimi)
- [API Tasarımı](#api-tasarımı)
- [Güvenlik](#güvenlik)
- [Performans](#performans)
- [Deployment](#deployment)

## 🎯 Genel Bakış

Emlak, Next.js 16 tabanlı, AI destekli, modern bir gayrimenkul yönetim platformudur. Modüler mimari prensiplerine göre tasarlanmıştır.

### Temel Prensipler

- **Modülerlik**: Her özellik bağımsız modül
- **Scalability**: Yüksek trafik için optimize
- **Maintainability**: Kolay bakım ve geliştirme
- **Type Safety**: TypeScript ile tam tip güvenliği
- **Code Reusability**: DRY (Don't Repeat Yourself)

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet + React-Leaflet + Leaflet-Draw
- **Charts**: Recharts
- **Language**: TypeScript 5.9

### Backend (API Routes)
- **Runtime**: Next.js API Routes
- **Validation**: Custom validators
- **Error Handling**: Custom error classes

### Services & APIs
- **AI**: OpenAI GPT-4, Stability AI, Remove.bg, Replicate
- **Social Media**: Facebook, Instagram, Twitter, LinkedIn APIs
- **Data Scraping**: Custom scraper engine

## 📁 Klasör Yapısı

```
Emlak/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route grupları
│   │   ├── page.tsx              # Ana sayfa
│   │   ├── properties/           # İlan sayfaları
│   │   ├── analytics/            # Bölge analizi
│   │   ├── create-listing/       # İlan oluşturma
│   │   ├── dashboard/            # Kullanıcı paneli
│   │   ├── pricing/              # Fiyatlandırma
│   │   └── login/                # Giriş
│   ├── admin/                    # Admin sayfaları
│   │   └── scrapers/             # Scraper yönetimi
│   ├── api/                      # API endpoints
│   │   ├── ai/                   # AI servisleri
│   │   ├── scrape/               # Scraper API
│   │   └── social/               # Sosyal medya API
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React bileşenleri
│   ├── Header.tsx                # Header
│   ├── Footer.tsx                # Footer
│   ├── PropertyCard.tsx          # İlan kartı
│   ├── MapView.tsx               # Harita görünümü
│   ├── DrawableMap.tsx           # Çizilebilir harita
│   ├── *Chart.tsx                # Grafik bileşenleri
│   ├── SocialMediaPostGenerator.tsx
│   └── index.ts                  # Barrel export
│
├── lib/                          # Core business logic
│   ├── config/                   # Konfigürasyon
│   │   └── index.ts              # App config
│   ├── services/                 # Business servisler
│   │   ├── aiService.ts          # AI servisi
│   │   ├── scraperService.ts    # Scraper servisi
│   │   ├── socialMediaService.ts # Social media
│   │   ├── propertyNormalizer.ts # Veri normalizasyonu
│   │   └── index.ts              # Barrel export
│   ├── scrapers/                 # Scraper implementasyonları
│   │   ├── BaseScraper.ts        # Base class
│   │   ├── MockScraper.ts        # Mock scraper
│   │   └── index.ts              # Barrel export
│   ├── types/                    # TypeScript tipleri
│   │   ├── index.ts              # Main types
│   │   ├── ai.ts                 # AI types
│   │   ├── scraper.ts            # Scraper types
│   │   ├── social.ts             # Social media types
│   │   └── index.ts              # Barrel export
│   ├── utils/                    # Utility fonksiyonlar
│   │   ├── api.ts                # API helpers
│   │   ├── constants.ts          # Sabitler
│   │   ├── errors.ts             # Error classes
│   │   ├── formatters.ts         # Formatters
│   │   ├── validators.ts         # Validators
│   │   ├── rateLimiter.ts        # Rate limiting
│   │   └── index.ts              # Barrel export
│   ├── analytics.ts              # Analytics utils
│   ├── geoUtils.ts               # Geo-spatial utils
│   ├── propertyEnhancer.ts       # Property enhancer
│   └── index.ts                  # Main barrel export
│
├── data/                         # Mock/Static data
│   ├── properties.ts             # İlan verisi
│   ├── districts.ts              # İlçe verisi
│   ├── priceHistory.ts           # Fiyat geçmişi
│   ├── plans.ts                  # Abonelik planları
│   ├── mockData.ts               # Mock data
│   └── index.ts                  # Barrel export
│
├── hooks/                        # Custom React hooks
│   └── useFavorites.ts           # Favoriler hook
│
├── public/                       # Static assets
│
├── README.md                     # Ana README
├── ARCHITECTURE.md               # Bu dosya
├── SCRAPER_README.md             # Scraper dokümantasyonu
├── AI_SOCIAL_MEDIA_README.md    # AI & Social media dokümantasyonu
└── package.json                  # Dependencies
```

## 🏛️ Katmanlı Mimari

### 1. Presentation Layer (UI)
- **Sorumluluk**: Kullanıcı arayüzü ve etkileşim
- **Teknolojiler**: React 19, Tailwind CSS
- **Bileşenler**: Pages, Components

### 2. Business Logic Layer
- **Sorumluluk**: İş kuralları ve data processing
- **Lokasyon**: `lib/services/`
- **Servisler**:
  - AIService: AI işlemleri
  - ScraperService: Veri çekme
  - SocialMediaService: Sosyal medya entegrasyonu
  - PropertyNormalizer: Veri normalizasyonu

### 3. Data Access Layer
- **Sorumluluk**: Veri erişimi ve dönüşümü
- **Lokasyon**: `lib/utils/`, `data/`
- **Modüller**:
  - API helpers
  - Data transformers
  - Mock data providers

### 4. API Layer
- **Sorumluluk**: HTTP endpoints
- **Lokasyon**: `app/api/`
- **Endpoints**:
  - `/api/ai/*` - AI servisleri
  - `/api/scrape/*` - Scraper API
  - `/api/social/*` - Social media API

## 🔧 Modüller ve Özellikler

### 1. AI Modülü
**Lokasyon**: `lib/services/aiService.ts`, `lib/types/ai.ts`

**Özellikler**:
- Görsel iyileştirme
- Görsel büyütme (upscaling)
- Arka plan kaldırma
- Sanal mobilyalama
- Otomatik metin oluşturma
- Hashtag önerileri

**API Endpoints**:
- `POST /api/ai/enhance`
- `POST /api/ai/generate-text`

### 2. Scraper Modülü
**Lokasyon**: `lib/scrapers/`, `lib/services/scraperService.ts`

**Özellikler**:
- Çoklu kaynak desteği
- Rate limiting
- Retry logic
- Error handling
- Veri normalizasyonu

**API Endpoints**:
- `POST /api/scrape`
- `POST /api/scrape/all`
- `POST /api/scrape/test`
- `GET /api/scrape` (status)

### 3. Sosyal Medya Modülü
**Lokasyon**: `lib/services/socialMediaService.ts`, `lib/types/social.ts`

**Özellikler**:
- 6 platform desteği
- AI destekli post oluşturma
- Platform limitlerini otomatik kontrol
- Post zamanlama

**API Endpoints**:
- `POST /api/social/generate-post`

### 4. Harita ve Analiz Modülü
**Lokasyon**: `components/DrawableMap.tsx`, `lib/geoUtils.ts`, `lib/analytics.ts`

**Özellikler**:
- İnteraktif harita
- Bölge çizme (polygon, rectangle, circle)
- Jeospatial filtreleme
- Fiyat analizi
- Trend grafikleri

### 5. İlan Yönetimi Modülü
**Lokasyon**: `app/create-listing/`, `app/properties/`

**Özellikler**:
- İlan oluşturma
- AI destekli açıklama
- Görsel yükleme ve iyileştirme
- Sosyal medya paylaşımı

## 🔄 Veri Akışı

### Örnek: AI Destekli İlan Oluşturma

```
User Input (Form)
    ↓
[Validation Layer]
    ↓
[Business Logic Layer]
    ├─→ [AI Service]
    │     ├─ Text Generation
    │     └─ Image Enhancement
    ├─→ [Social Media Service]
    │     └─ Post Generation
    └─→ [Data Normalization]
          ↓
[API Layer]
    ↓
[Response to UI]
```

### Örnek: Veri Çekme (Scraping)

```
Admin Dashboard
    ↓
[API Request] POST /api/scrape
    ↓
[Scraper Service]
    ├─→ [Rate Limiter] Check
    ├─→ [Scraper] Execute
    │     ├─ Fetch HTML
    │     ├─ Parse Data
    │     └─ Retry on Error
    └─→ [Normalizer] Transform
          ↓
[Store/Display]
```

## 💾 State Yönetimi

### Client State
- **Yöntem**: React useState, useReducer
- **Kullanım**: Form state, UI state, filters

### Server State
- **Yöntem**: Server Components, API Routes
- **Kullanım**: Property data, analytics, user data

### Local Storage
```typescript
// lib/utils/constants.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recent_searches',
}
```

## 🌐 API Tasarımı

### Standart Response Format

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

### Error Handling

```typescript
// Custom error classes
class AppError extends Error {
  statusCode: number
  isOperational: boolean
}

// Usage in API route
try {
  const result = await someOperation()
  return NextResponse.json({ success: true, data: result })
} catch (error) {
  const formatted = formatErrorResponse(error)
  return NextResponse.json(formatted, { status: formatted.statusCode })
}
```

### API Helpers

```typescript
// lib/utils/api.ts
import { apiPost, apiGet } from '@/lib/utils'

// Usage
const response = await apiPost('/api/ai/generate-text', { property })
if (response.success) {
  console.log(response.data)
}
```

## 🔒 Güvenlik

### Input Validation
```typescript
// lib/utils/validators.ts
import { validateEmail, validatePrice } from '@/lib/utils'

const emailValidation = validateEmail(input)
if (!emailValidation.isValid) {
  throw new ValidationError(emailValidation.error)
}
```

### Rate Limiting
```typescript
// lib/utils/rateLimiter.ts
const limiter = new RateLimiter(30, 60) // 30 req/min

if (!limiter.canMakeRequest()) {
  throw new RateLimitError()
}
```

### Error Handling
- Custom error classes
- Operational vs programming errors
- User-friendly error messages
- Error logging (production)

## ⚡ Performans

### Optimizasyon Stratejileri

1. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

2. **Server Components**
   - Default Server Components
   - Client Components only when needed
   - Reduced JavaScript bundle

3. **Image Optimization**
   - Next.js Image component
   - WebP format
   - Lazy loading

4. **Caching**
   ```typescript
   // lib/config/index.ts
   cache: {
     ttl: {
       properties: 5 * 60,    // 5 min
       districts: 60 * 60,    // 1 hour
       analytics: 15 * 60,    // 15 min
     }
   }
   ```

5. **Memoization**
   - useMemo for expensive calculations
   - React.memo for components
   - Server-side caching

## 🚀 Deployment

### Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# AI Services
OPENAI_API_KEY=sk-...
STABILITY_API_KEY=sk-...
REMOVEBG_API_KEY=...
REPLICATE_API_TOKEN=r8_...

# Social Media
FACEBOOK_APP_ID=...
INSTAGRAM_CLIENT_ID=...
# ... etc
```

### Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Or deploy to Vercel
vercel deploy
```

### Production Checklist

- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (Google Analytics)
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] Database backup strategy
- [ ] CDN for static assets
- [ ] SSL certificate
- [ ] Rate limiting enabled

## 📊 Monitoring

### Metrics to Track

- **Performance**: Page load time, API response time
- **Errors**: Error rate, error types
- **Usage**: Active users, page views, feature usage
- **Business**: Conversions, signups, AI usage, scraper success rate

### Tools

- **Vercel Analytics**: Performance monitoring
- **Sentry**: Error tracking
- **Google Analytics**: User behavior
- **Custom Dashboard**: Business metrics

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Example: validators.test.ts
describe('validateEmail', () => {
  it('should validate correct email', () => {
    const result = validateEmail('test@example.com')
    expect(result.isValid).toBe(true)
  })
})
```

### Integration Tests
- API endpoint testing
- Service integration testing

### E2E Tests
- Critical user flows
- Key features

## 📚 Best Practices

### Code Organization
- **Barrel exports**: Use index.ts files
- **Single responsibility**: One concern per file
- **Naming conventions**: Clear, descriptive names
- **Type safety**: Strict TypeScript

### Import Organization
```typescript
// Good
import { formatCurrency, validatePrice } from '@/lib/utils'

// Instead of
import { formatCurrency } from '@/lib/utils/formatters'
import { validatePrice } from '@/lib/utils/validators'
```

### Error Handling
```typescript
// Always use try-catch in API routes
export async function POST(request: NextRequest) {
  try {
    // ... operation
    return NextResponse.json({ success: true, data })
  } catch (error) {
    const formatted = formatErrorResponse(error)
    return NextResponse.json(formatted, { status: formatted.statusCode })
  }
}
```

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'

// 2. Types/Interfaces
interface Props { /* ... */ }

// 3. Component
export default function Component({ prop }: Props) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Functions
  const handleClick = () => { /* ... */ }

  // 6. Render
  return (/* ... */)
}
```

## 🔄 Future Enhancements

### Planned Features
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Property comparison
- [ ] Virtual tours (360°)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline support (PWA)

### Technical Improvements
- [ ] Database integration (PostgreSQL)
- [ ] Redis caching
- [ ] Queue system (Bull/BullMQ)
- [ ] WebSocket for real-time updates
- [ ] GraphQL API
- [ ] Microservices architecture

## 📞 Support & Contributing

### Documentation
- README.md - Genel bakış
- ARCHITECTURE.md - Bu dosya
- SCRAPER_README.md - Scraper detayları
- AI_SOCIAL_MEDIA_README.md - AI & Social media detayları

### Contributing Guidelines
1. Fork repository
2. Create feature branch
3. Follow code style
4. Add tests
5. Submit PR

---

**Version**: 1.0.0
**Last Updated**: 2024-01-15
**Maintainer**: Development Team
