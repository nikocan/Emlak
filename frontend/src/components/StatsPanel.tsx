'use client'

import { useQuery } from '@tanstack/react-query'
import { propertyApi } from '@/lib/api'
import { PropertyFilter } from '@/types/property'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Home } from 'lucide-react'

interface StatsPanelProps {
  filters: PropertyFilter
}

export default function StatsPanel({ filters }: StatsPanelProps) {
  const { data } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.search(filters),
  })

  if (!data || data.total === 0) {
    return null
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Total Properties */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Home size={16} />
            <span className="text-xs font-medium">Toplam İlan</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{data.total}</div>
        </div>

        {/* Average Price */}
        {data.avg_price && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <DollarSign size={16} />
              <span className="text-xs font-medium">Ort. Fiyat</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {formatPrice(data.avg_price)}
            </div>
          </div>
        )}

        {/* Min Price */}
        {data.min_price && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <TrendingDown size={16} />
              <span className="text-xs font-medium">Min Fiyat</span>
            </div>
            <div className="text-lg font-bold text-orange-900">
              {formatPrice(data.min_price)}
            </div>
          </div>
        )}

        {/* Max Price */}
        {data.max_price && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <TrendingUp size={16} />
              <span className="text-xs font-medium">Max Fiyat</span>
            </div>
            <div className="text-lg font-bold text-purple-900">
              {formatPrice(data.max_price)}
            </div>
          </div>
        )}
      </div>

      {/* Average price per sqm */}
      {data.avg_price_per_sqm && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-center">
          <span className="text-xs text-gray-600">Ortalama m² Fiyatı: </span>
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(data.avg_price_per_sqm)}/m²
          </span>
        </div>
      )}
    </div>
  )
}
