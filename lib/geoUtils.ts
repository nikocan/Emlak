import { Property } from './types'
import L from 'leaflet'

/**
 * Bir noktanın poligon içinde olup olmadığını kontrol eder (Ray Casting Algorithm)
 */
export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: L.LatLng[]
): boolean {
  let inside = false
  const x = point.lng
  const y = point.lat

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng
    const yi = polygon[i].lat
    const xj = polygon[j].lng
    const yj = polygon[j].lat

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }

  return inside
}

/**
 * Bir noktanın daire içinde olup olmadığını kontrol eder
 */
export function isPointInCircle(
  point: { lat: number; lng: number },
  center: { lat: number; lng: number },
  radius: number
): boolean {
  const R = 6371e3 // Dünya yarıçapı (metre)
  const φ1 = (point.lat * Math.PI) / 180
  const φ2 = (center.lat * Math.PI) / 180
  const Δφ = ((center.lat - point.lat) * Math.PI) / 180
  const Δλ = ((center.lng - point.lng) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c

  return distance <= radius
}

/**
 * Bir noktanın dikdörtgen içinde olup olmadığını kontrol eder
 */
export function isPointInBounds(
  point: { lat: number; lng: number },
  bounds: L.LatLngBounds
): boolean {
  const lat = point.lat
  const lng = point.lng
  const south = bounds.getSouth()
  const north = bounds.getNorth()
  const west = bounds.getWest()
  const east = bounds.getEast()

  return lat >= south && lat <= north && lng >= west && lng <= east
}

/**
 * Çizilen şekle göre ilanları filtrele
 */
export function filterPropertiesByShape(
  properties: Property[],
  shape: any // Leaflet layer
): Property[] {
  if (!shape) return properties

  // Polygon veya Rectangle
  if (shape instanceof L.Polygon || shape instanceof L.Rectangle) {
    const latLngs = shape.getLatLngs()[0] as L.LatLng[]
    return properties.filter((property) =>
      isPointInPolygon(property.coordinates, latLngs)
    )
  }

  // Circle
  if (shape instanceof L.Circle) {
    const center = shape.getLatLng()
    const radius = shape.getRadius()
    return properties.filter((property) =>
      isPointInCircle(
        property.coordinates,
        { lat: center.lat, lng: center.lng },
        radius
      )
    )
  }

  return properties
}

/**
 * Çizilen şeklin merkezini ve zoom seviyesini hesapla
 */
export function getShapeBounds(shape: any): L.LatLngBounds | null {
  if (!shape) return null

  if (shape instanceof L.Circle) {
    const center = shape.getLatLng()
    const radius = shape.getRadius()
    // Yaklaşık bounds hesapla (basitleştirilmiş)
    const latOffset = (radius / 111320) * 1.5 // 1 derece ≈ 111km
    const lngOffset = (radius / (111320 * Math.cos((center.lat * Math.PI) / 180))) * 1.5

    return L.latLngBounds(
      [center.lat - latOffset, center.lng - lngOffset],
      [center.lat + latOffset, center.lng + lngOffset]
    )
  }

  if (shape.getBounds) {
    return shape.getBounds()
  }

  return null
}
