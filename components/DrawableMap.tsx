'use client'

import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-draw'
import { Property } from '@/lib/types'
import Link from 'next/link'
import { filterPropertiesByShape, getShapeBounds } from '@/lib/geoUtils'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface DrawableMapProps {
  properties: Property[]
  onShapeDrawn?: (filteredProperties: Property[]) => void
  center?: [number, number]
  zoom?: number
}

function DrawControl({ onShapeDrawn }: { onShapeDrawn: (layer: any) => void }) {
  const map = useMap()

  useEffect(() => {
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2
          }
        },
        circle: {
          shapeOptions: {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2
          }
        },
        polyline: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    })

    map.addControl(drawControl)

    // Çizim tamamlandığında
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer
      drawnItems.clearLayers() // Önceki çizimleri temizle
      drawnItems.addLayer(layer)
      onShapeDrawn(layer)

      // Çizilen alana zoom yap
      const bounds = getShapeBounds(layer)
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    })

    // Çizim silindiğinde
    map.on(L.Draw.Event.DELETED, () => {
      onShapeDrawn(null)
    })

    return () => {
      map.removeControl(drawControl)
      map.removeLayer(drawnItems)
      map.off(L.Draw.Event.CREATED)
      map.off(L.Draw.Event.DELETED)
    }
  }, [map, onShapeDrawn])

  return null
}

export default function DrawableMap({
  properties,
  onShapeDrawn,
  center = [39.0, 35.0],
  zoom = 6
}: DrawableMapProps) {
  const [mounted, setMounted] = useState(false)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setFilteredProperties(properties)
  }, [properties])

  const handleShapeDrawn = (layer: any) => {
    if (!layer) {
      // Çizim silindi, tüm ilanları göster
      setFilteredProperties(properties)
      onShapeDrawn?.(properties)
    } else {
      // Çizilen alan içindeki ilanları filtrele
      const filtered = filterPropertiesByShape(properties, layer)
      setFilteredProperties(filtered)
      onShapeDrawn?.(filtered)
    }
  }

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-600">Harita yükleniyor...</div>
      </div>
    )
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-lg"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DrawControl onShapeDrawn={handleShapeDrawn} />

      {/* Property işaretleyicileri */}
      {filteredProperties.map((property) => (
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
                {property.bedrooms > 0 && ' • '}
                {property.bathrooms} banyo
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
