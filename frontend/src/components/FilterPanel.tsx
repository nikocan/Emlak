'use client'

import { useState } from 'react'
import { PropertyFilter } from '@/types/property'
import { Search, SlidersHorizontal } from 'lucide-react'

interface FilterPanelProps {
  filters: PropertyFilter
  onFilterChange: (filters: Partial<PropertyFilter>) => void
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<Partial<PropertyFilter>>(filters)

  const handleChange = (key: keyof PropertyFilter, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange({ [key]: value })
  }

  const handleReset = () => {
    const resetFilters: Partial<PropertyFilter> = {
      city: undefined,
      district: undefined,
      property_type: undefined,
      listing_type: undefined,
      min_price: undefined,
      max_price: undefined,
      min_area: undefined,
      max_area: undefined,
      min_rooms: undefined,
      max_rooms: undefined,
      furnished: undefined,
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal size={20} />
          Filtreler
        </h2>
        <button
          onClick={handleReset}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Temizle
        </button>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Şehir</label>
        <input
          type="text"
          value={localFilters.city || ''}
          onChange={(e) => handleChange('city', e.target.value || undefined)}
          placeholder="Örn: Istanbul"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">İlçe</label>
        <input
          type="text"
          value={localFilters.district || ''}
          onChange={(e) => handleChange('district', e.target.value || undefined)}
          placeholder="Örn: Kadıköy"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Listing Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">İlan Tipi</label>
        <select
          value={localFilters.listing_type || ''}
          onChange={(e) => handleChange('listing_type', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tümü</option>
          <option value="sale">Satılık</option>
          <option value="rent">Kiralık</option>
        </select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Emlak Tipi</label>
        <select
          value={localFilters.property_type || ''}
          onChange={(e) => handleChange('property_type', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tümü</option>
          <option value="apartment">Daire</option>
          <option value="villa">Villa</option>
          <option value="office">Ofis</option>
          <option value="land">Arsa</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Fiyat Aralığı</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={localFilters.min_price || ''}
            onChange={(e) =>
              handleChange('min_price', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Min"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="number"
            value={localFilters.max_price || ''}
            onChange={(e) =>
              handleChange('max_price', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Max"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Area Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Alan (m²)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={localFilters.min_area || ''}
            onChange={(e) =>
              handleChange('min_area', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Min"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="number"
            value={localFilters.max_area || ''}
            onChange={(e) =>
              handleChange('max_area', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Max"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Oda Sayısı</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={localFilters.min_rooms || ''}
            onChange={(e) =>
              handleChange('min_rooms', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Min"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="number"
            value={localFilters.max_rooms || ''}
            onChange={(e) =>
              handleChange('max_rooms', e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Max"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Furnished */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={localFilters.furnished || false}
            onChange={(e) => handleChange('furnished', e.target.checked ? true : undefined)}
            className="rounded text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Eşyalı</span>
        </label>
      </div>

      {/* Source Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Kaynaklar</label>
        <div className="space-y-1">
          {['sahibinden', 'hurriyetemlak', 'emlakjet'].map((source) => (
            <label key={source} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters.source?.includes(source) || false}
                onChange={(e) => {
                  const currentSources = localFilters.source || []
                  const newSources = e.target.checked
                    ? [...currentSources, source]
                    : currentSources.filter((s) => s !== source)
                  handleChange('source', newSources.length > 0 ? newSources : undefined)
                }}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm capitalize">{source}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Sıralama</label>
        <select
          value={localFilters.sort_by || 'scraped_at'}
          onChange={(e) => handleChange('sort_by', e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="scraped_at">Tarih</option>
          <option value="price">Fiyat</option>
          <option value="area_sqm">Alan</option>
        </select>
      </div>

      <div className="space-y-2">
        <select
          value={localFilters.sort_order || 'desc'}
          onChange={(e) => handleChange('sort_order', e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="desc">Azalan</option>
          <option value="asc">Artan</option>
        </select>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-md text-xs text-blue-800">
        💡 Haritada bir bölge seçmek için sağ üstteki çizim araçlarını kullanın
      </div>
    </div>
  )
}
