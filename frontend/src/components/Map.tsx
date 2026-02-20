'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { propertyApi } from '@/lib/api'
import { PropertyFilter } from '@/types/property'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapProps {
  filters: PropertyFilter
  onPolygonDrawn: (coordinates: number[][]) => void
  selectedPolygon: number[][] | null
}

export default function Map({ filters, onPolygonDrawn, selectedPolygon }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.MarkerClusterGroup | null>(null)
  const polygonLayerRef = useRef<L.Polygon | null>(null)
  const drawControlRef = useRef<L.Control.Draw | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  // Fetch properties for map markers
  const { data: searchResults } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.search(filters),
    enabled: isMapReady,
  })

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current) return

    const initMap = async () => {
      // Dynamically import Leaflet modules
      const L = (await import('leaflet')).default
      await import('leaflet-draw')

      // Create marker cluster group
      const MarkerClusterGroup = (await import('leaflet.markercluster')).default

      const map = L.map('map').setView([41.0082, 28.9784], 11)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Create marker cluster group
      const markers = (L as any).markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      })
      map.addLayer(markers)
      markersRef.current = markers

      // Add drawing controls
      const drawnItems = new L.FeatureGroup()
      map.addLayer(drawnItems)

      const drawControl = new (L.Control as any).Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: '#3b82f6',
              weight: 2,
            },
          },
          polyline: false,
          circle: false,
          rectangle: {
            shapeOptions: {
              color: '#3b82f6',
              weight: 2,
            },
          },
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      })
      map.addControl(drawControl)
      drawControlRef.current = drawControl

      // Handle polygon drawing
      map.on((L.Draw as any).Event.CREATED, (e: any) => {
        const layer = e.layer
        drawnItems.clearLayers()
        drawnItems.addLayer(layer)

        if (e.layerType === 'polygon' || e.layerType === 'rectangle') {
          const coords = layer.getLatLngs()[0].map((latlng: L.LatLng) => [
            latlng.lng,
            latlng.lat,
          ])
          polygonLayerRef.current = layer
          onPolygonDrawn(coords)
        }
      })

      map.on((L.Draw as any).Event.DELETED, () => {
        polygonLayerRef.current = null
        onPolygonDrawn([])
      })

      mapRef.current = map
      setIsMapReady(true)
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [onPolygonDrawn])

  // Update markers when properties change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !searchResults) return

    const L = require('leaflet')
    const markers = markersRef.current

    // Clear existing markers
    markers.clearLayers()

    // Add new markers
    searchResults.properties.forEach((property) => {
      const marker = L.marker([property.latitude, property.longitude])

      // Create popup content
      const popupContent = `
        <div class="p-2 max-w-xs">
          <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
          <p class="text-xs text-gray-600 mb-2">${property.district}, ${property.city}</p>
          <div class="flex justify-between items-center mb-2">
            <span class="font-bold text-primary-600">
              ${new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 0,
              }).format(property.price)}
            </span>
            <span class="text-xs bg-${getSourceColor(property.source)} text-white px-2 py-1 rounded">
              ${property.source}
            </span>
          </div>
          ${
            property.area_sqm || property.rooms
              ? `
            <div class="text-xs text-gray-600">
              ${property.area_sqm ? `${property.area_sqm} m²` : ''}
              ${property.rooms ? `• ${property.rooms} oda` : ''}
            </div>
          `
              : ''
          }
          <a href="${property.source_url}" target="_blank"
             class="block mt-2 text-xs text-primary-600 hover:underline">
            İlanı Görüntüle →
          </a>
        </div>
      `

      marker.bindPopup(popupContent)
      markers.addLayer(marker)
    })
  }, [searchResults])

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full z-0" />

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-lg z-[1000] text-xs">
        <div className="font-semibold mb-2">Kaynaklar</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Sahibinden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Hürriyet Emlak</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Emlakjet</span>
          </div>
        </div>
      </div>

      {/* Property count */}
      {searchResults && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded shadow-lg z-[1000]">
          <span className="font-semibold">{searchResults.total}</span> ilan bulundu
        </div>
      )}
    </div>
  )
}

function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    sahibinden: 'yellow-500',
    hurriyetemlak: 'blue-500',
    emlakjet: 'green-500',
  }
  return colors[source] || 'gray-500'
}
