# Emlak Veri Çekme Sistemi (Scraper)

Bu dokümantasyon, emlak uygulamasının veri çekme (scraping) mimarisini açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Mimari](#mimari)
- [Kullanım](#kullanım)
- [API Endpoints](#api-endpoints)
- [Yeni Scraper Ekleme](#yeni-scraper-ekleme)
- [Yasal ve Etik Uyarılar](#yasal-ve-etik-uyarılar)

## 🎯 Genel Bakış

Bu sistem, Türkiye'deki emlak sitelerinden (Sahibinden, Hepsiemlak, Emlakjet, Zingat) ilan verilerini çekebilecek şekilde tasarlanmış modüler bir yapıdır.

### Özellikler

- ✅ Modüler scraper mimarisi
- ✅ Rate limiting (istek sınırlama)
- ✅ Retry logic (yeniden deneme)
- ✅ Error handling (hata yönetimi)
- ✅ Veri normalizasyonu
- ✅ Paralel veri çekme
- ✅ Admin paneli ile kontrol
- ✅ Mock mode (demo için)

## 🏗️ Mimari

### Klasör Yapısı

```
lib/
├── types/
│   └── scraper.ts              # Tip tanımlamaları
├── utils/
│   └── rateLimiter.ts          # Rate limiting utility
├── services/
│   ├── scraperService.ts       # Ana scraper servisi
│   └── propertyNormalizer.ts   # Veri normalizasyonu
└── scrapers/
    ├── BaseScraper.ts          # Abstract base class
    └── MockScraper.ts          # Demo scraper

app/
├── api/
│   └── scrape/
│       ├── route.ts            # Tekli scraping
│       ├── all/route.ts        # Toplu scraping
│       └── test/route.ts       # Scraper testleri
└── admin/
    └── scrapers/
        └── page.tsx            # Admin kontrol paneli
```

### Bileşenler

#### 1. BaseScraper (Abstract Class)

Tüm scraper'ların extend etmesi gereken temel sınıf:

```typescript
abstract class BaseScraper implements IScraper {
  // Rate limiting
  // Retry logic
  // Error handling
  // Abstract methods
}
```

#### 2. RateLimiter

İstek sıklığını kontrol eder:

```typescript
const limiter = new RateLimiter(30, 60) // 30 istek/dakika
if (limiter.canMakeRequest()) {
  await limiter.waitForSlot()
  // İstek yap
}
```

#### 3. PropertyNormalizer

Ham veriyi standart Property formatına dönüştürür:

```typescript
const normalized = propertyNormalizer.normalize(rawData)
// price, coordinates, type normalization
```

#### 4. ScraperService

Tüm scraper'ları yönetir:

```typescript
const result = await scraperService.scrape(
  ScraperSource.SAHIBINDEN,
  'İstanbul',
  'Beşiktaş'
)
```

## 🚀 Kullanım

### 1. Admin Panelinden

**URL:** `/admin/scrapers`

1. Kaynak seçin (Sahibinden, Hepsiemlak, vb.)
2. Şehir ve ilçe girin
3. "Seçili Kaynaktan Çek" veya "Tüm Kaynaklardan Çek" butonuna tıklayın
4. Sonuçları görüntüleyin

### 2. API ile

#### Tekli Scraping

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "source": "sahibinden",
    "city": "İstanbul",
    "district": "Beşiktaş",
    "options": {
      "maxPages": 2,
      "listingType": "sale"
    }
  }'
```

#### Toplu Scraping

```bash
curl -X POST http://localhost:3000/api/scrape/all \
  -H "Content-Type: application/json" \
  -d '{
    "city": "İstanbul",
    "district": "Beşiktaş",
    "options": {
      "maxPages": 1
    }
  }'
```

#### Test

```bash
# Tüm scraper'ları test et
curl http://localhost:3000/api/scrape/test

# Durum kontrolü
curl http://localhost:3000/api/scrape
```

### 3. Kod ile

```typescript
import { scraperService } from '@/lib/services/scraperService'
import { ScraperSource } from '@/lib/types/scraper'

// Tek kaynak
const result = await scraperService.scrape(
  ScraperSource.SAHIBINDEN,
  'İstanbul',
  'Beşiktaş',
  { maxPages: 2 }
)

console.log(`${result.totalSaved} ilan kaydedildi`)

// Tüm kaynaklar
const results = await scraperService.scrapeAll(
  'İstanbul',
  'Beşiktaş'
)
```

## 📡 API Endpoints

### POST /api/scrape

Tek bir kaynaktan veri çeker.

**Request:**
```json
{
  "source": "sahibinden",
  "city": "İstanbul",
  "district": "Beşiktaş",
  "options": {
    "maxPages": 2,
    "priceMin": 1000000,
    "priceMax": 5000000,
    "listingType": "sale"
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "source": "sahibinden",
    "status": "success",
    "totalFound": 50,
    "totalProcessed": 50,
    "totalSaved": 48,
    "totalErrors": 2,
    "duration": 5234,
    "startedAt": "2024-01-15T10:30:00.000Z",
    "completedAt": "2024-01-15T10:30:05.234Z"
  }
}
```

### POST /api/scrape/all

Tüm kaynaklardan paralel veri çeker.

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalSources": 4,
    "successfulSources": 4,
    "totalProperties": 192,
    "totalErrors": 8,
    "totalDuration": 12500
  },
  "results": [...]
}
```

### GET /api/scrape

Scraper durumlarını döndürür.

### GET /api/scrape/test

Tüm scraper'ları test eder.

## 🔧 Yeni Scraper Ekleme

### 1. Scraper Sınıfı Oluştur

```typescript
// lib/scrapers/SahibindenScraper.ts
import { BaseScraper } from './BaseScraper'
import { ScraperSource, ScraperConfig, RawPropertyData } from '../types/scraper'

export class SahibindenScraper extends BaseScraper {
  constructor() {
    const config: ScraperConfig = {
      source: ScraperSource.SAHIBINDEN,
      enabled: true,
      maxRequestsPerMinute: 20,
      maxConcurrentRequests: 3,
      timeout: 15000,
      retryAttempts: 3,
      retryDelay: 2000,
    }
    super(config)
  }

  async scrapeByLocation(
    city: string,
    district?: string,
    options?: ScrapeOptions
  ): Promise<RawPropertyData[]> {
    const url = this.buildUrl(city, district, options)
    const html = await this.retryRequest(() => this.fetchHTML(url), url)

    if (!html) return []

    return this.parseListingPage(html)
  }

  async scrapePropertyDetail(url: string): Promise<RawPropertyData | null> {
    const html = await this.retryRequest(() => this.fetchHTML(url), url)
    if (!html) return null

    return this.parseDetailPage(html, url)
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://www.sahibinden.com', {
        method: 'HEAD',
      })
      return response.ok
    } catch {
      return false
    }
  }

  private buildUrl(city: string, district?: string, options?: ScrapeOptions): string {
    // URL oluşturma logic'i
    return `https://www.sahibinden.com/satilik-daire/${city.toLowerCase()}`
  }

  private parseListingPage(html: string): RawPropertyData[] {
    // HTML parsing (cheerio kullanılabilir)
    // CSS selectors ile veri çekme
    return []
  }

  private parseDetailPage(html: string, url: string): RawPropertyData | null {
    // Detay sayfası parsing
    return null
  }
}
```

### 2. Scraper'ı Servise Ekle

```typescript
// lib/services/scraperService.ts
private initializeScrapers(): void {
  this.scrapers.set(ScraperSource.SAHIBINDEN, new SahibindenScraper())
  // Diğer scraper'lar...
}
```

### 3. HTML Parsing için Kütüphane Ekle

```bash
npm install cheerio
```

```typescript
import * as cheerio from 'cheerio'

private parseListingPage(html: string): RawPropertyData[] {
  const $ = cheerio.load(html)
  const properties: RawPropertyData[] = []

  $('.listing-item').each((i, el) => {
    const title = $(el).find('.title').text()
    const price = $(el).find('.price').text()
    // ...
    properties.push({ title, price, ... })
  })

  return properties
}
```

## ⚠️ Yasal ve Etik Uyarılar

### Önemli Notlar

1. **robots.txt Kontrolü**
   ```bash
   # Örnek:
   curl https://www.sahibinden.com/robots.txt
   ```

2. **Kullanım Koşulları**
   - Her sitenin Terms of Service'ini okuyun
   - Veri kullanım haklarını kontrol edin

3. **Rate Limiting**
   - Sunuculara aşırı yük bindirmeyin
   - Makul bekleme süreleri kullanın
   - robots.txt'deki Crawl-delay'e uyun

4. **User-Agent**
   - Bot olduğunuzu belirtin
   - İletişim bilgisi ekleyin
   ```
   User-Agent: EmlakBot/1.0 (+https://example.com/bot)
   ```

5. **Kişisel Veriler**
   - KVKK (GDPR) uyumluluğu sağlayın
   - Kişisel verileri koruyun
   - Anonimleştirme yapın

6. **Telif Hakları**
   - Fotoğraf ve içerik haklarına dikkat edin
   - Kaynak belirtin

### Önerilen Yaklaşımlar

1. **Resmi API Kullanın**
   - Sitelerle iletişime geçin
   - B2B anlaşmaları yapın
   - API erişimi isteyin

2. **Veri Ortaklıkları**
   - Data feed anlaşmaları
   - Lisanslama

3. **Yasal Danışmanlık**
   - Avukattan görüş alın
   - Ticari kullanım için izin

### Şu Anki Durum

**Bu uygulama şu an DEMO amaçlı mock verilerle çalışmaktadır.**

Gerçek scraping yapmak için:
- Yasal izinler alınmalı
- Sitelerle anlaşmalar yapılmalı
- Resmi API'ler kullanılmalı

## 🔍 Troubleshooting

### Rate Limiting Hatası

```typescript
// config'de değerleri düşürün
maxRequestsPerMinute: 10 // 30 yerine
```

### Timeout Hatası

```typescript
// timeout süresini artırın
timeout: 30000 // 10000 yerine
```

### HTML Parse Hatası

```typescript
// CSS selector'ları güncelleyin
// Site yapısı değişmiş olabilir
```

## 📚 Referanslar

- [Web Scraping Best Practices](https://www.scrapehero.com/web-scraping-best-practices/)
- [robots.txt Specification](https://www.robotstxt.org/)
- [KVKK](https://www.kvkk.gov.tr/)
- [Cheerio Documentation](https://cheerio.js.org/)

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Email: support@example.com

---

**Son Güncelleme:** 2024-01-15
