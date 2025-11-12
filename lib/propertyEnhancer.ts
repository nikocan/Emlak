import { Property } from './types'

// İlçe koordinatları
const districtCoordinates: Record<string, { lat: number, lng: number }> = {
  'Beşiktaş': { lat: 41.0422, lng: 29.0074 },
  'Maslak': { lat: 41.1101, lng: 29.0218 },
  'Bahçeşehir': { lat: 41.0056, lng: 28.8016 },
  'Etiler': { lat: 41.0761, lng: 29.0344 },
  'Ataşehir': { lat: 40.9828, lng: 29.1253 },
  'Çankaya': { lat: 39.9192, lng: 32.8575 },
  'Kızılay': { lat: 39.9219, lng: 32.8540 },
  'Çeşme': { lat: 38.3225, lng: 26.3062 },
  'Karşıyaka': { lat: 38.4607, lng: 27.0948 },
  'Nilüfer': { lat: 40.2039, lng: 28.9864 },
  'Konyaaltı': { lat: 36.8886, lng: 30.6854 },
  'Datça': { lat: 36.7267, lng: 27.6861 }
}

/**
 * Mevcut property verilerine koordinat ve metrekare fiyatı ekler
 */
export function enhanceProperty(property: any): Property {
  // Koordinatlar ekle
  const baseCoords = districtCoordinates[property.district] || { lat: 41.0082, lng: 28.9784 }

  // Her property için küçük bir offset ekle (gerçekçi konum dağılımı için)
  const offset = {
    lat: (Math.random() - 0.5) * 0.02,
    lng: (Math.random() - 0.5) * 0.02
  }

  const coordinates = {
    lat: parseFloat((baseCoords.lat + offset.lat).toFixed(6)),
    lng: parseFloat((baseCoords.lng + offset.lng).toFixed(6))
  }

  // Metrekare fiyatı hesapla
  const pricePerSqm = Math.round(property.priceNumeric / property.area)

  return {
    ...property,
    coordinates,
    pricePerSqm
  } as Property
}

/**
 * Property dizisinin tamamını enhance eder
 */
export function enhanceProperties(properties: any[]): Property[] {
  return properties.map(enhanceProperty)
}
