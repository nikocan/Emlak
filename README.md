# 🏠 Emlak - Gayrimenkul Portalı

Modern, responsive ve kullanıcı dostu bir emlak uygulaması. Next.js, React, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ **Ana Sayfa** - Hero section, istatistikler ve öne çıkan ilanlar
- ✅ **İlan Listeleme** - 12+ örnek emlak ilanı
- ✅ **Detaylı İlan Sayfaları** - Tüm emlak özellikleri ve iletişim bilgileri
- ✅ **Filtreleme Sistemi** - İlan tipi, kategori, şehir ve oda sayısına göre filtreleme
- ✅ **Favoriler** - İlanları favorilere ekleme (localStorage ile)
- ✅ **Hakkımızda Sayfası** - Şirket bilgileri ve ekip tanıtımı
- ✅ **İletişim Sayfası** - İletişim formu ve bilgiler
- ✅ **Responsive Tasarım** - Mobil, tablet ve masaüstü uyumlu
- ✅ **Modern UI/UX** - Tailwind CSS ile şık ve kullanıcı dostu arayüz

## 🛠️ Teknolojiler

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Stil:** Tailwind CSS 4
- **Dil:** TypeScript
- **Paket Yöneticisi:** npm

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
├── app/                    # Next.js App Router sayfaları
│   ├── hakkimizda/        # Hakkımızda sayfası
│   ├── iletisim/          # İletişim sayfası
│   ├── properties/[id]/   # Dinamik emlak detay sayfası
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # Ana layout
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   ├── Footer.tsx         # Footer bileşeni
│   ├── Header.tsx         # Header bileşeni
│   ├── PropertyCard.tsx   # Emlak kartı bileşeni
│   └── PropertyFilter.tsx # Filtreleme bileşeni
├── data/                  # Veri dosyaları
│   └── properties.ts      # Örnek emlak verileri
├── hooks/                 # Custom React hooks
│   └── useFavorites.ts    # Favoriler hook'u
├── lib/                   # Yardımcı fonksiyonlar ve tipler
│   └── types.ts           # TypeScript tip tanımları
└── public/                # Statik dosyalar

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

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Katkıda Bulunma

Katkılarınızı bekliyoruz! Pull request göndermekten çekinmeyin.

## 📧 İletişim

Sorularınız için: info@emlak.com