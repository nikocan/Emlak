# 🏠 Emlak - Emlakçılar İçin SaaS Platformu

Emlakçılar için profesyonel, modern ve kullanıcı dostu SaaS platformu. Next.js, React, TypeScript ve Tailwind CSS ile geliştirilmiştir. Aylık/yıllık abonelik modeliyle emlakçılara hizmet verir.

## 🚀 Özellikler

### 💼 SaaS ve Abonelik Özellikleri
- ✅ **3 Farklı Paket** - Başlangıç (₺499/ay), Profesyonel (₺999/ay), Kurumsal (₺2499/ay)
- ✅ **Aylık/Yıllık Abonelik** - Yıllık ödemede %17 indirim
- ✅ **14 Gün Ücretsiz Deneme** - Kredi kartı gerekmez
- ✅ **Paket Karşılaştırması** - Detaylı özellik tablosu
- ✅ **Esnek Fiyatlandırma** - İlan sayısı, özellikler ve destek seviyesine göre

### 🎯 Emlakçı Dashboard
- ✅ **Özet İstatistikler** - Toplam ilan, görüntülenme, lead, dönüşüm oranı
- ✅ **Son Talepler** - Lead listesi ve durum takibi
- ✅ **Popüler İlanlar** - En çok görüntülenen ilanlar
- ✅ **Hızlı İşlemler** - Yeni ilan, talep görüntüleme, rapor, paket yükseltme
- ✅ **Mock Authentication** - Giriş/kayıt sistemi (localStorage)

### 📝 İlan ve CRM Yönetimi
- ✅ **Lead Takip Sistemi** - Yeni, iletişimde, görüşme, pazarlık, kapandı, kaybedildi durumları
- ✅ **İlan İstatistikleri** - Görüntülenme, tıklama, favori, lead sayıları
- ✅ **Detaylı İlan Sayfaları** - Tüm emlak özellikleri ve iletişim bilgileri
- ✅ **Filtreleme Sistemi** - İlan tipi, kategori, şehir ve oda sayısına göre filtreleme
- ✅ **Responsive Tasarım** - Mobil, tablet ve masaüstü uyumlu

### 📊 Gelişmiş Analitik Özellikler
- ✅ **Bölge Analizi Sayfası** - İnteraktif harita ve bölge seçimi
- ✅ **İnteraktif Harita** - Leaflet ile harita üzerinde emlak görüntüleme
- ✅ **Fiyat Trend Grafikleri** - Son 2 yıl aylık fiyat değişimleri (Recharts)
- ✅ **Kategori Dağılımı** - Bar chart ile görsel istatistikler
- ✅ **Yıllara Göre Karşılaştırma** - 2020-2024 yıllık fiyat analizi
- ✅ **Metrekare Fiyatları** - Bölgesel m² fiyat hesaplamaları
- ✅ **Fiyat Değişim Oranları** - 1 yıllık ve 5 yıllık değişim yüzdeleri
- ✅ **Bölge İstatistikleri** - Ortalama, medyan, min/max fiyat bilgileri
- ✅ **Gerçekçi Veri Seti** - 2020-2024 arası aylık fiyat geçmişi verisi
- ✅ **12 İlçe Verisi** - İstanbul, Ankara, İzmir, Bursa, Antalya, Muğla

## 🛠️ Teknolojiler

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Stil:** Tailwind CSS 4
- **Dil:** TypeScript
- **Paket Yöneticisi:** npm
- **Harita:** Leaflet & React-Leaflet
- **Grafikler:** Recharts
- **State Management:** React Hooks & LocalStorage

## 📦 Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📂 Proje Yapısı

```
Emlak/
├── app/                          # Next.js App Router sayfaları
│   ├── analytics/               # Bölge analizi sayfası
│   ├── hakkimizda/              # Hakkımızda sayfası
│   ├── iletisim/                # İletişim sayfası
│   ├── properties/[id]/         # Dinamik emlak detay sayfası
│   ├── globals.css              # Global stiller (Leaflet CSS dahil)
│   ├── layout.tsx               # Ana layout
│   └── page.tsx                 # Ana sayfa
├── components/                  # React bileşenleri
│   ├── CategoryDistributionChart.tsx  # Kategori dağılım grafiği
│   ├── Footer.tsx               # Footer bileşeni
│   ├── Header.tsx               # Header bileşeni (Analytics linki ile)
│   ├── MapView.tsx              # İnteraktif harita bileşeni
│   ├── PriceTrendChart.tsx      # Fiyat trend grafiği
│   ├── PropertyCard.tsx         # Emlak kartı (favoriler ile)
│   ├── PropertyFilter.tsx       # Filtreleme bileşeni
│   └── YearlyComparisonChart.tsx # Yıllık karşılaştırma grafiği
├── data/                        # Veri dosyaları
│   ├── districts.ts             # İlçe verileri ve koordinatlar
│   ├── priceHistory.ts          # 2020-2024 fiyat geçmişi
│   └── properties.ts            # Emlak verileri (koordinatlar ile)
├── hooks/                       # Custom React hooks
│   └── useFavorites.ts          # Favoriler hook'u
├── lib/                         # Yardımcı fonksiyonlar ve tipler
│   ├── analytics.ts             # Analitik hesaplama fonksiyonları
│   ├── propertyEnhancer.ts      # Property veri zenginleştirme
│   └── types.ts                 # TypeScript tip tanımları
└── public/                      # Statik dosyalar

```

## 🎯 Kullanım

### Geliştirme Sunucusu
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Kod Kalitesi Kontrolü
```bash
npm run lint
```

## 🌟 Özellikler Detayı

### Ana Sayfa
- Büyük hero section ile çarpıcı giriş
- İstatistik kartları (Toplam ilan, satılık, kiralık sayıları)
- Filtreleme sistemi
- Tüm ilanları grid layout ile gösterim
- "Neden Biz?" bölümü

### İlan Detay Sayfası
- Büyük görsel alan
- Detaylı özellikler (oda sayısı, banyo, alan, kat, ısıtma vb.)
- Özelliklerin listesi
- Danışman bilgileri
- İletişim formu

### Filtreleme
- İlan tipi (Satılık/Kiralık)
- Kategori (Daire, Villa, Ofis, Arsa, Dükkan)
- Şehir
- Minimum oda sayısı

### Favoriler
- İlanları favorilere ekleme/çıkarma
- LocalStorage ile kalıcı saklama
- Kalp ikonu ile görsel geri bildirim

### 📊 Bölge Analizi Sayfası
- **Şehir ve İlçe Seçimi**: Dropdown menüler ile bölge seçimi
- **İnteraktif Harita**: Leaflet haritası üzerinde ilanları görüntüleme
- **Harita Özellikleri**:
  - Her emlak için marker (işaretleyici)
  - Popup ile hızlı bilgi (fiyat, m², detay linki)
  - Bölge sınırları gösterimi
  - Otomatik zoom ve merkez ayarı
- **Fiyat Trend Grafiği**:
  - Son 24 ay fiyat değişimi
  - Çift eksenli grafik (ortalama fiyat + m² fiyat)
  - İnteraktif tooltip'ler
- **Kategori Dağılımı**: Bar chart ile emlak tiplerinin dağılımı
- **Yıllara Göre Karşılaştırma**: 2020-2024 yıllık ortalama fiyat değişimi
- **İstatistik Kartları**:
  - Toplam ilan sayısı
  - Ortalama fiyat
  - Metrekare fiyatı
  - Yıllık değişim oranı
- **Detaylı İstatistikler**:
  - 5 yıllık değişim yüzdesi
  - Medyan fiyat
  - Minimum/Maksimum fiyatlar
  - Kategori bazlı dağılım

### 📈 Veri Seti
- **12 İlçe**: Beşiktaş, Maslak, Bahçeşehir, Etiler, Ataşehir, Çankaya, Kızılay, Çeşme, Karşıyaka, Nilüfer, Konyaaltı, Datça
- **Fiyat Geçmişi**: 2020-2024 arası aylık veriler (58 ay)
- **Her İlçe İçin**:
  - Koordinat bilgisi (enlem/boylam)
  - Bölge sınırları
  - Ortalama fiyatlar
  - Metrekare fiyatları
  - İşlem sayıları
  - Fiyat değişim oranları

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📧 İletişim

Sorularınız için: info@emlak.com