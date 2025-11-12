import { DistrictData } from '@/lib/types'

// Türkiye'deki başlıca ilçelerin koordinatları ve bölge verileri
export const districts: DistrictData[] = [
  {
    name: 'Beşiktaş',
    city: 'İstanbul',
    coordinates: { lat: 41.0422, lng: 29.0074 },
    bounds: {
      north: 41.0922,
      south: 40.9922,
      east: 29.0574,
      west: 28.9574
    },
    stats: {
      totalProperties: 156,
      averagePrice: 12500000,
      averagePricePerSqm: 65000,
      minPrice: 2500000,
      maxPrice: 35000000,
      priceChange1Year: 28.5,
      priceChange5Year: 145.3
    }
  },
  {
    name: 'Maslak',
    city: 'İstanbul',
    coordinates: { lat: 41.1101, lng: 29.0218 },
    bounds: {
      north: 41.1601,
      south: 41.0601,
      east: 29.0718,
      west: 28.9718
    },
    stats: {
      totalProperties: 203,
      averagePrice: 8750000,
      averagePricePerSqm: 58000,
      minPrice: 1800000,
      maxPrice: 25000000,
      priceChange1Year: 32.1,
      priceChange5Year: 158.7
    }
  },
  {
    name: 'Bahçeşehir',
    city: 'İstanbul',
    coordinates: { lat: 41.0056, lng: 28.8016 },
    bounds: {
      north: 41.0556,
      south: 40.9556,
      east: 28.8516,
      west: 28.7516
    },
    stats: {
      totalProperties: 312,
      averagePrice: 5200000,
      averagePricePerSqm: 42000,
      minPrice: 1500000,
      maxPrice: 15000000,
      priceChange1Year: 25.8,
      priceChange5Year: 132.4
    }
  },
  {
    name: 'Etiler',
    city: 'İstanbul',
    coordinates: { lat: 41.0761, lng: 29.0344 },
    bounds: {
      north: 41.1261,
      south: 41.0261,
      east: 29.0844,
      west: 28.9844
    },
    stats: {
      totalProperties: 89,
      averagePrice: 18500000,
      averagePricePerSqm: 75000,
      minPrice: 5000000,
      maxPrice: 45000000,
      priceChange1Year: 35.2,
      priceChange5Year: 172.9
    }
  },
  {
    name: 'Ataşehir',
    city: 'İstanbul',
    coordinates: { lat: 40.9828, lng: 29.1253 },
    bounds: {
      north: 41.0328,
      south: 40.9328,
      east: 29.1753,
      west: 29.0753
    },
    stats: {
      totalProperties: 267,
      averagePrice: 6800000,
      averagePricePerSqm: 48000,
      minPrice: 2000000,
      maxPrice: 20000000,
      priceChange1Year: 29.3,
      priceChange5Year: 142.6
    }
  },
  {
    name: 'Çankaya',
    city: 'Ankara',
    coordinates: { lat: 39.9192, lng: 32.8575 },
    bounds: {
      north: 39.9692,
      south: 39.8692,
      east: 32.9075,
      west: 32.8075
    },
    stats: {
      totalProperties: 198,
      averagePrice: 3200000,
      averagePricePerSqm: 28000,
      minPrice: 800000,
      maxPrice: 12000000,
      priceChange1Year: 22.4,
      priceChange5Year: 118.3
    }
  },
  {
    name: 'Kızılay',
    city: 'Ankara',
    coordinates: { lat: 39.9219, lng: 32.8540 },
    bounds: {
      north: 39.9719,
      south: 39.8719,
      east: 32.9040,
      west: 32.8040
    },
    stats: {
      totalProperties: 156,
      averagePrice: 2800000,
      averagePricePerSqm: 32000,
      minPrice: 600000,
      maxPrice: 9000000,
      priceChange1Year: 20.1,
      priceChange5Year: 112.5
    }
  },
  {
    name: 'Çeşme',
    city: 'İzmir',
    coordinates: { lat: 38.3225, lng: 26.3062 },
    bounds: {
      north: 38.3725,
      south: 38.2725,
      east: 26.3562,
      west: 26.2562
    },
    stats: {
      totalProperties: 124,
      averagePrice: 15800000,
      averagePricePerSqm: 52000,
      minPrice: 3000000,
      maxPrice: 45000000,
      priceChange1Year: 38.7,
      priceChange5Year: 189.2
    }
  },
  {
    name: 'Karşıyaka',
    city: 'İzmir',
    coordinates: { lat: 38.4607, lng: 27.0948 },
    bounds: {
      north: 38.5107,
      south: 38.4107,
      east: 27.1448,
      west: 27.0448
    },
    stats: {
      totalProperties: 201,
      averagePrice: 4200000,
      averagePricePerSqm: 35000,
      minPrice: 1200000,
      maxPrice: 15000000,
      priceChange1Year: 24.6,
      priceChange5Year: 128.9
    }
  },
  {
    name: 'Nilüfer',
    city: 'Bursa',
    coordinates: { lat: 40.2039, lng: 28.9864 },
    bounds: {
      north: 40.2539,
      south: 40.1539,
      east: 29.0364,
      west: 28.9364
    },
    stats: {
      totalProperties: 187,
      averagePrice: 4500000,
      averagePricePerSqm: 30000,
      minPrice: 1000000,
      maxPrice: 14000000,
      priceChange1Year: 26.3,
      priceChange5Year: 135.7
    }
  },
  {
    name: 'Konyaaltı',
    city: 'Antalya',
    coordinates: { lat: 36.8886, lng: 30.6854 },
    bounds: {
      north: 36.9386,
      south: 36.8386,
      east: 30.7354,
      west: 30.6354
    },
    stats: {
      totalProperties: 143,
      averagePrice: 6200000,
      averagePricePerSqm: 38000,
      minPrice: 1500000,
      maxPrice: 22000000,
      priceChange1Year: 31.2,
      priceChange5Year: 156.4
    }
  },
  {
    name: 'Datça',
    city: 'Muğla',
    coordinates: { lat: 36.7267, lng: 27.6861 },
    bounds: {
      north: 36.7767,
      south: 36.6767,
      east: 27.7361,
      west: 27.6361
    },
    stats: {
      totalProperties: 76,
      averagePrice: 5800000,
      averagePricePerSqm: 42000,
      minPrice: 1200000,
      maxPrice: 18000000,
      priceChange1Year: 34.8,
      priceChange5Year: 168.3
    }
  }
]

export function getDistrictByName(name: string, city: string): DistrictData | undefined {
  return districts.find(d => d.name === name && d.city === city)
}

export function getDistrictsByCity(city: string): DistrictData[] {
  return districts.filter(d => d.city === city)
}
