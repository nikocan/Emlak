# AI ve Sosyal Medya Entegrasyonu

Bu dokümantasyon, emlak uygulamasının AI destekli özellikleri ve sosyal medya entegrasyonunu açıklar.

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [AI Özellikleri](#ai-özellikleri)
- [Sosyal Medya Özellikleri](#sosyal-medya-özellikleri)
- [Kullanım](#kullanım)
- [API Referansı](#api-referansı)
- [Gerçek AI Entegrasyonu](#gerçek-ai-entegrasyonu)

## 🎯 Genel Bakış

Emlakçıların iş süreçlerini kolaylaştırmak için AI ve sosyal medya özellikleri eklendi:

### ✨ Özellikler

**AI Özellikleri:**
- 🖼️ Görsel iyileştirme (parlaklık, kontrast, keskinlik)
- 📐 Görsel büyütme (2x, 4x upscaling)
- 🎨 Arka plan kaldırma
- 🛋️ Sanal mobilyalama (Virtual Staging)
- ✍️ Otomatik ilan metni oluşturma
- 📝 SEO-uyumlu başlık oluşturma
- #️⃣ Hashtag önerileri

**Sosyal Medya Özellikleri:**
- 📱 6 platform desteği (Facebook, Instagram, Twitter, LinkedIn, WhatsApp, Telegram)
- 🤖 AI destekli post oluşturma
- 📊 Platform limitlerini otomatik kontrol
- 🎯 Ton seçimi (Profesyonel, Samimi, Lüks, Arkadaşça)
- ⏰ Post zamanlama
- 📈 Erişim tahmini

## 🤖 AI Özellikleri

### 1. Görsel İyileştirme

Emlak fotoğraflarını profesyonel kaliteye yükseltir:

```typescript
// API kullanımı
const response = await fetch('/api/ai/enhance', {
  method: 'POST',
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg',
    options: {
      brightness: 10,
      contrast: 15,
      sharpness: 20,
      autoEnhance: true,
      denoise: true,
    }
  })
})
```

**Özellikler:**
- Otomatik parlaklık/kontrast ayarı
- Gürültü azaltma
- Keskinlik artırma
- HDR efekt
- Işık düzeltme

### 2. Görsel Büyütme (Upscaling)

Düşük çözünürlüklü görselleri 2x veya 4x büyütür:

```typescript
const result = await aiService.process({
  feature: AIFeature.IMAGE_UPSCALE,
  input: imageUrl,
  options: { upscaleFactor: 4 }
})
```

**Kullanım Alanları:**
- Eski ilan fotoğraflarını iyileştirme
- Mobil fotoğrafları profesyonel hale getirme
- Baskı kalitesi için hazırlama

### 3. Arka Plan Kaldırma

Görselin arka planını kaldırıp transparan PNG oluşturur:

```typescript
const result = await aiService.process({
  feature: AIFeature.BACKGROUND_REMOVAL,
  input: imageUrl
})
```

**Kullanım Alanları:**
- Sosyal medya görselleri
- Katalog hazırlama
- Özel tasarımlar

### 4. Sanal Mobilyalama

Boş mekanları mobilyalı gösterir:

```typescript
const result = await aiService.process({
  feature: AIFeature.VIRTUAL_STAGING,
  input: imageUrl,
  options: {
    roomType: 'living',
    style: 'modern',
    furnitureLevel: 'full'
  }
})
```

**Stil Seçenekleri:**
- Modern
- Klasik
- Minimalist
- İskandinav
- Endüstriyel

### 5. Otomatik Metin Oluşturma

İlan için profesyonel başlık ve açıklama oluşturur:

```typescript
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
      price: 5000000,
      features: ['Asansör', 'Otopark', 'Güvenlik']
    },
    tone: 'professional',
    length: 'medium',
    includeEmojis: true,
    language: 'tr'
  }
})
```

**Ton Seçenekleri:**
- **Professional**: Kurumsal, ciddi, detaylı
- **Casual**: Samimi, gündelik, kolay okunur
- **Luxury**: Prestijli, özel, lüks
- **Friendly**: Arkadaşça, sıcak, yakın

**Çıktı:**
```javascript
{
  title: "Daire 3+1 - Beşiktaş, İstanbul - 150m²",
  description: "🏡 Daire - 3+1 - 150m²\n\n📍 İstanbul Beşiktaş bölgesinde...",
  shortDescription: "150m² kullanım alanına sahip, 3+1 oda dağılımlı...",
  hashtags: ["#emlak", "#satılık", "#daire", "#istanbul", "#beşiktaş"],
  keywords: ["Daire", "İstanbul", "Beşiktaş", "3+1", "satılık"],
  seoScore: 85,
  wordCount: 87
}
```

## 📱 Sosyal Medya Özellikleri

### Desteklenen Platformlar

| Platform | Max Metin | Max Görsel | Max Hashtag | Özel Özellik |
|----------|-----------|------------|-------------|--------------|
| Facebook | 63,206 | 10 | 30 | En geniş kitle |
| Instagram | 2,200 | 10 | 30 | Görsel odaklı |
| Twitter | 280 | 4 | ~10 | Kısa ve öz |
| LinkedIn | 3,000 | 9 | 30 | B2B odaklı |
| WhatsApp | 65,536 | 30 | - | Direkt mesaj |
| Telegram | 4,096 | 10 | - | Grup paylaşımı |

### Post Oluşturma

```typescript
const result = await socialMediaService.generatePost({
  property: {
    title: "Lüks Villa",
    type: "Villa",
    city: "Antalya",
    district: "Lara",
    price: "15.000.000 ₺",
    area: 350,
    rooms: "5+1",
    features: ["Özel Havuz", "Deniz Manzarası", "Akıllı Ev"],
    images: ["url1.jpg", "url2.jpg"]
  },
  platforms: [
    SocialPlatform.FACEBOOK,
    SocialPlatform.INSTAGRAM,
    SocialPlatform.TWITTER
  ],
  useAI: true,
  aiOptions: {
    tone: 'luxury',
    includeEmojis: true,
    length: 'medium'
  }
})
```

**Örnek Çıktı (Instagram):**

```
🏡 Lüks Villa | Lara, Antalya

📍 Lara
💰 15.000.000 ₺
📐 350m²

✓ Özel Havuz
✓ Deniz Manzarası

DM'den ulaşın! 📩

#emlak #satılık #villa #antalya #lara #lüksvilla #denizmanzarası #özelh havuz #yatırım #ev
```

### Otomatik Platform Optimizasyonu

Her platform için içerik otomatik optimize edilir:

- **Karakter sayısı**: Platform limitine göre kısaltılır
- **Hashtag sayısı**: Platform kurallarına uygun şekilde sınırlandırılır
- **Görsel sayısı**: Maximum limite göre seçilir
- **Format**: Platform'a özel format (emoji, markdown, vb.)

## 🚀 Kullanım

### 1. Web Arayüzünden

**URL:** `/create-listing`

#### Adım 1: Temel Bilgiler
1. İlan tipini seçin (Daire, Villa, vb.)
2. Lokasyon bilgilerini girin
3. Fiyat ve alan bilgilerini ekleyin
4. Özellikleri seçin

#### Adım 2: AI İyileştirme
1. "AI ile Oluştur" butonuna tıklayın
2. Oluşturulan başlık ve açıklamayı düzenleyin
3. İsteğe bağlı: Görselleri iyileştirin

#### Adım 3: Sosyal Medya
1. Platformları seçin
2. Yazım tonunu belirleyin
3. "AI ile Post Oluştur" butonuna tıklayın
4. Oluşturulan post'ları inceleyin ve düzenleyin
5. Paylaşın veya zamanlayın

### 2. API ile

#### AI Metin Oluşturma

```bash
curl -X POST http://localhost:3000/api/ai/generate-text \
  -H "Content-Type: application/json" \
  -d '{
    "property": {
      "type": "Daire",
      "city": "İstanbul",
      "district": "Kadıköy",
      "area": 120,
      "rooms": "2+1",
      "price": 3500000,
      "features": ["Balkon", "Asansör"]
    },
    "tone": "casual",
    "includeEmojis": true
  }'
```

#### Görsel İyileştirme

```bash
curl -X POST http://localhost:3000/api/ai/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "options": {
      "autoEnhance": true,
      "brightness": 10,
      "contrast": 15
    }
  }'
```

#### Sosyal Medya Post Oluşturma

```bash
curl -X POST http://localhost:3000/api/social/generate-post \
  -H "Content-Type: application/json" \
  -d '{
    "property": {...},
    "platforms": ["facebook", "instagram"],
    "useAI": true,
    "aiOptions": {
      "tone": "professional",
      "includeEmojis": true
    }
  }'
```

### 3. Kod ile

```typescript
import { aiService } from '@/lib/services/aiService'
import { socialMediaService } from '@/lib/services/socialMediaService'
import { AIFeature } from '@/lib/types/ai'

// AI metin oluştur
const textResult = await aiService.process({
  feature: AIFeature.DESCRIPTION_GENERATION,
  input: '',
  options: { property: {...}, tone: 'professional' }
})

// Sosyal medya post'u oluştur
const socialResult = await socialMediaService.generatePost({
  property: {...},
  platforms: [SocialPlatform.FACEBOOK, SocialPlatform.INSTAGRAM],
  useAI: true
})
```

## 📚 API Referansı

### POST /api/ai/enhance

Görsel iyileştirme

**Request:**
```json
{
  "imageUrl": "string",
  "options": {
    "brightness": number,
    "contrast": number,
    "sharpness": number,
    "denoise": boolean,
    "autoEnhance": boolean
  }
}
```

**Response:**
```json
{
  "success": true,
  "feature": "image_enhancement",
  "result": {
    "originalUrl": "string",
    "enhancedUrl": "string",
    "width": number,
    "height": number,
    "improvements": ["string"],
    "processingTime": number
  },
  "processingTime": number,
  "cost": number
}
```

### POST /api/ai/generate-text

AI metin oluşturma

**Request:**
```json
{
  "property": {
    "type": "string",
    "city": "string",
    "district": "string",
    "area": number,
    "rooms": "string",
    "price": number,
    "features": ["string"]
  },
  "tone": "professional|casual|luxury|friendly",
  "length": "short|medium|long",
  "includeEmojis": boolean
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "title": "string",
    "description": "string",
    "shortDescription": "string",
    "hashtags": ["string"],
    "keywords": ["string"],
    "seoScore": number,
    "wordCount": number
  }
}
```

### POST /api/social/generate-post

Sosyal medya post oluşturma

**Request:**
```json
{
  "property": {...},
  "platforms": ["facebook", "instagram"],
  "useAI": boolean,
  "aiOptions": {
    "tone": "string",
    "includeEmojis": boolean,
    "length": "string"
  },
  "customText": "string"
}
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "platform": "facebook",
      "content": {
        "text": "string",
        "images": ["string"],
        "hashtags": ["string"]
      },
      "preview": "string",
      "characterCount": number,
      "estimatedReach": number
    }
  ]
}
```

## 🔧 Gerçek AI Entegrasyonu

### Şu Anki Durum

Sistem şu an **DEMO mode**'da mock verilerle çalışıyor.

### Gerçek AI Servisleri Entegrasyonu

#### 1. OpenAI (GPT-4)

Metin oluşturma için:

```typescript
// lib/services/aiService.ts

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async generateDescription(options: TextGenerationOptions) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Sen profesyonel bir emlak danışmanısın. Türkçe emlak ilanları yazıyorsun."
      },
      {
        role: "user",
        content: `Şu emlak için profesyonel bir ilan metni yaz: ${JSON.stringify(options.property)}`
      }
    ],
    temperature: 0.7,
  })

  return completion.choices[0].message.content
}
```

**Maliyet:** ~$0.03 per 1K tokens (GPT-4)

#### 2. Stability AI

Görsel iyileştirme için:

```typescript
import fetch from 'node-fetch'

async enhanceImage(imageUrl: string) {
  const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_strength: 0.35,
        init_image: imageUrl,
        text_prompts: [
          {
            text: "high quality real estate photography, bright, professional",
            weight: 1
          }
        ],
      })
    }
  )

  return await response.json()
}
```

**Maliyet:** ~$0.002 per image

#### 3. Remove.bg

Arka plan kaldırma için:

```typescript
async removeBackground(imageUrl: string) {
  const formData = new FormData()
  formData.append('image_url', imageUrl)
  formData.append('size', 'auto')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.REMOVEBG_API_KEY,
    },
    body: formData
  })

  return await response.arrayBuffer()
}
```

**Maliyet:** ~$0.20 per image

#### 4. Replicate (Real-ESRGAN)

Görsel büyütme için:

```typescript
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

async upscaleImage(imageUrl: string, scale: number) {
  const output = await replicate.run(
    "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
    {
      input: {
        image: imageUrl,
        scale: scale,
        face_enhance: false
      }
    }
  )

  return output
}
```

**Maliyet:** ~$0.05 per image

### Ortam Değişkenleri

`.env.local` dosyası oluşturun:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Stability AI
STABILITY_API_KEY=sk-...

# Remove.bg
REMOVEBG_API_KEY=...

# Replicate
REPLICATE_API_TOKEN=r8_...

# Facebook Graph API
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

# Instagram Graph API
INSTAGRAM_CLIENT_ID=...
INSTAGRAM_CLIENT_SECRET=...
```

### Paket Kurulumu

```bash
npm install openai replicate remove.bg-sdk
npm install @types/node-fetch
```

## 💰 Maliyet Tahmini

Demo credit sistemi:

| Özellik | Credit/İşlem | Gerçek Maliyet |
|---------|--------------|----------------|
| Metin oluşturma | 0.01 | ~$0.01-0.03 |
| Görsel iyileştirme | 0.05 | ~$0.002-0.01 |
| Görsel büyütme 2x | 0.10 | ~$0.05 |
| Görsel büyütme 4x | 0.20 | ~$0.10 |
| Arka plan kaldırma | 0.02 | ~$0.20 |
| Sanal mobilyalama | 0.50 | ~$0.50-1.00 |

**Örnek Hesap (Aylık 100 İlan):**
- 100 metin oluşturma: $1-3
- 500 görsel iyileştirme: $1-5
- 200 upscaling: $10-20
- **Toplam:** ~$12-28/ay

## 🎨 Özelleştirme

### Özel Prompt Template'leri

```typescript
// lib/services/aiService.ts

const customPrompts = {
  luxury: "Sen lüks emlak uzmanısın. VIP müşterilere hitap edecek...",
  commercial: "Ticari gayrimenkul danışmanısın...",
  // ...
}
```

### Platform-Specific Ayarlar

```typescript
// lib/types/social.ts

export const CUSTOM_PLATFORM_CONFIG = {
  [SocialPlatform.INSTAGRAM]: {
    preferredHashtagCount: 15,
    imageAspectRatio: '1:1',
    preferredTone: 'casual'
  }
}
```

## 🐛 Troubleshooting

### AI İstekleri Başarısız

```
Hata: Real AI implementation not configured
Çözüm: Mock mode aktif. Gerçek API key'leri ekleyin.
```

### Rate Limiting

```
Hata: Too many requests
Çözüm: API limitlerini kontrol edin, credit satın alın.
```

### Görsel Yükleme Hatası

```
Hata: Image URL not accessible
Çözüm: Görselin public URL olduğundan emin olun.
```

## 📞 Destek

- GitHub Issues: github.com/yourrepo/issues
- Email: support@example.com
- Dokümantasyon: docs.example.com

---

**Son Güncelleme:** 2024-01-15
**Versiyon:** 1.0.0
