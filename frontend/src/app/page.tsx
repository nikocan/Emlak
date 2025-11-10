'use client'

import { useState } from 'react'
import Map from '@/components/Map'
import PropertyList from '@/components/PropertyList'
import FilterPanel from '@/components/FilterPanel'
import StatsPanel from '@/components/StatsPanel'
import { PropertyFilter } from '@/types/property'
import { Menu, X } from 'lucide-react'

export default function Home() {
  const [filters, setFilters] = useState<PropertyFilter>({
    skip: 0,
    limit: 100,
    sort_by: 'scraped_at',
    sort_order: 'desc',
  })

  const [selectedPolygon, setSelectedPolygon] = useState<number[][] | null>(null)
  const [showFilters, setShowFilters] = useState(true)

  const handleFilterChange = (newFilters: Partial<PropertyFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handlePolygonDrawn = (coordinates: number[][]) => {
    setSelectedPolygon(coordinates)
    handleFilterChange({ polygon: coordinates })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-lg z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Emlak</h1>
              <p className="text-sm text-primary-100 hidden md:block">
                Türkiye genelindeki emlak sitelerinden ilan topla
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 hover:bg-primary-700 rounded"
            >
              {showFilters ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        <aside
          className={`
            ${showFilters ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:relative
            z-20 lg:z-0
            w-80 h-full
            bg-white shadow-lg
            transition-transform duration-300
            overflow-y-auto
          `}
        >
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Map and Property List */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Map */}
          <div className="w-full lg:w-2/3 h-1/2 lg:h-full relative">
            <Map
              filters={filters}
              onPolygonDrawn={handlePolygonDrawn}
              selectedPolygon={selectedPolygon}
            />
          </div>

          {/* Property List */}
          <div className="w-full lg:w-1/3 h-1/2 lg:h-full overflow-y-auto bg-gray-50">
            <StatsPanel filters={filters} />
            <PropertyList filters={filters} />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  )
}
