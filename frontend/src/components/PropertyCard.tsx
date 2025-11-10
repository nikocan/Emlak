'use client'

import { Property } from '@/types/property'
import { formatPrice, formatArea, formatRooms, getSourceColor, getSourceName, formatRelativeTime } from '@/lib/utils'
import { ExternalLink, MapPin, Home, Maximize2, DoorOpen } from 'lucide-react'
import Image from 'next/image'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const handleClick = () => {
    window.open(property.source_url, '_blank')
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {property.thumbnail_url ? (
          <img
            src={property.thumbnail_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={48} className="text-gray-400" />
          </div>
        )}

        {/* Source badge */}
        <div className={`absolute top-2 right-2 ${getSourceColor(property.source)} text-white text-xs px-2 py-1 rounded`}>
          {getSourceName(property.source)}
        </div>

        {/* Listing type badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {property.listing_type === 'sale' ? 'Satılık' : 'Kiralık'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-1 text-xs text-gray-600 mb-3">
          <MapPin size={14} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.neighborhood && `${property.neighborhood}, `}
            {property.district}, {property.city}
          </span>
        </div>

        {/* Property details */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          {property.area_sqm && (
            <div className="flex items-center gap-1">
              <Maximize2 size={14} />
              <span>{formatArea(property.area_sqm)}</span>
            </div>
          )}
          {property.rooms && (
            <div className="flex items-center gap-1">
              <DoorOpen size={14} />
              <span>{formatRooms(property.rooms, property.bedrooms)}</span>
            </div>
          )}
          {property.floor && (
            <div className="flex items-center gap-1">
              <span>{property.floor}. Kat</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-primary-600">
              {formatPrice(property.price, property.currency)}
            </div>
            {property.price_per_sqm && (
              <div className="text-xs text-gray-500">
                {formatPrice(property.price_per_sqm, property.currency)}/m²
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm"
          >
            <span>Detay</span>
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{formatRelativeTime(property.scraped_at)}</span>
          {property.view_count > 0 && <span>{property.view_count} görüntülenme</span>}
        </div>
      </div>
    </div>
  )
}
