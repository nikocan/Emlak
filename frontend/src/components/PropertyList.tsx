'use client'

import { useQuery } from '@tanstack/react-query'
import { propertyApi } from '@/lib/api'
import { PropertyFilter } from '@/types/property'
import PropertyCard from './PropertyCard'
import { Loader2 } from 'lucide-react'

interface PropertyListProps {
  filters: PropertyFilter
}

export default function PropertyList({ filters }: PropertyListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.search(filters),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Bir hata oluştu. Lütfen tekrar deneyin.
      </div>
    )
  }

  if (!data || data.properties.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg mb-2">İlan bulunamadı</p>
        <p className="text-sm">Filtreleri değiştirerek tekrar deneyin</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4">
      {data.properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
