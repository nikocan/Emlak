'use client'

import Link from 'next/link'
import { Property } from '@/lib/types'
import { useFavorites } from '@/hooks/useFavorites'

export default function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(property.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-white text-6xl">🏠</span>
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.type}
          </div>
          {property.category && (
            <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {property.category}
            </div>
          )}
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute bottom-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all hover:scale-110"
            aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          >
            <span className="text-2xl">
              {favorite ? '❤️' : '🤍'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
          <p className="text-gray-600 mb-3 flex items-center gap-1">
            <span>📍</span>
            {property.location}
          </p>

          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                🛏️ {property.bedrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              🚿 {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              📐 {property.area}m²
            </span>
          </div>

          <div className="border-t pt-3 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ₺{property.price}
              </span>
              {property.type === 'Kiralık' && (
                <span className="text-gray-600 text-sm">/ay</span>
              )}
            </div>
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Detay
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
