'use client'

import { useState } from 'react'
import { FilterOptions } from '@/lib/types'

interface PropertyFilterProps {
  onFilterChange: (filters: FilterOptions) => void
}

export default function PropertyFilter({ onFilterChange }: PropertyFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: 'all',
    city: 'all',
  })

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Filtrele</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İlan Tipi
          </label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tümü</option>
            <option value="Satılık">Satılık</option>
            <option value="Kiralık">Kiralık</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tümü</option>
            <option value="Daire">Daire</option>
            <option value="Villa">Villa</option>
            <option value="Ofis">Ofis</option>
            <option value="Arsa">Arsa</option>
            <option value="Dükkan">Dükkan</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şehir
          </label>
          <select
            value={filters.city || 'all'}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tümü</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
            <option value="Antalya">Antalya</option>
            <option value="Bursa">Bursa</option>
            <option value="Muğla">Muğla</option>
          </select>
        </div>

        {/* Bedrooms Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Oda Sayısı
          </label>
          <select
            value={filters.bedrooms || 'all'}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value === 'all' ? undefined : parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tümü</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>
    </div>
  )
}
