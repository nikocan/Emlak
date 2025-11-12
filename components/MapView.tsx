'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { Icon, LatLngBounds } from 'leaflet'
import { Property, DistrictData } from '@/lib/types'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapViewProps {
  properties: Property[]
  selectedDistrict?: DistrictData
  onDistrictSelect?: (district: DistrictData) => void
  center?: [number, number]
  zoom?: number
  showDistricts?: boolean
}

function MapController({ bounds }: { bounds?: LatLngBounds }) {
  const map = useMap()

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [bounds, map])

  return null
}

export default function MapView({
  properties,
  selectedDistrict,
  center = [39.0, 35.0], // Türkiye merkezi
  zoom = 6,
  showDistricts = false
}: MapViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-600">Harita yükleniyor...</div>
      </div>
    )
  }

  // Seçili bölge varsa bounds hesapla
  const bounds = selectedDistrict
    ? new LatLngBounds(
        [selectedDistrict.bounds.south, selectedDistrict.bounds.west],
        [selectedDistrict.bounds.north, selectedDistrict.bounds.east]
      )
    : undefined

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {bounds && <MapController bounds={bounds} />}

      {/* Bölge gösterimi (isteğe bağlı) */}
      {showDistricts && selectedDistrict && (
        <Circle
          center={[selectedDistrict.coordinates.lat, selectedDistrict.coordinates.lng]}
          radius={2000}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1
          }}
        />
      )}

      {/* Property işaretleyicileri */}
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.coordinates.lat, property.coordinates.lng]}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-sm mb-1">{property.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{property.location}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-600 font-bold">₺{property.price}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {property.type}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {property.area}m² • {property.bedrooms > 0 && `${property.bedrooms} oda`}
                {property.bedrooms > 0 && ' • '}{property.bathrooms} banyo
              </div>
              <div className="text-xs text-gray-600 mb-3">
                ₺{property.pricePerSqm.toLocaleString('tr-TR')}/m²
              </div>
              <Link
                href={`/properties/${property.id}`}
                className="block text-center bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              >
                Detayları Gör
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
