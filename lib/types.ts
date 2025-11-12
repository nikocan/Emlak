export interface Property {
  id: number
  title: string
  description: string
  location: string
  city: string
  district: string
  price: string
  priceNumeric: number
  pricePerSqm: number // Metrekare başına fiyat
  bedrooms: number
  bathrooms: number
  area: number
  type: 'Satılık' | 'Kiralık'
  category: 'Daire' | 'Villa' | 'Ofis' | 'Arsa' | 'Dükkan'
  images: string[]
  features: string[]
  yearBuilt?: number
  floor?: number
  totalFloors?: number
  heating?: string
  furnished?: boolean
  parking?: boolean
  balcony?: boolean
  elevator?: boolean
  coordinates: {
    lat: number
    lng: number
  }
  agent: {
    name: string
    phone: string
    email: string
  }
  createdAt: string
}

export interface FilterOptions {
  type?: 'Satılık' | 'Kiralık' | 'all'
  category?: string
  city?: string
  district?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  bedrooms?: number
}

export interface DistrictData {
  name: string
  city: string
  coordinates: {
    lat: number
    lng: number
  }
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
  stats: {
    totalProperties: number
    averagePrice: number
    averagePricePerSqm: number
    minPrice: number
    maxPrice: number
    priceChange1Year: number // % değişim
    priceChange5Year: number // % değişim
  }
}

export interface PriceHistory {
  district: string
  city: string
  year: number
  month: number
  averagePrice: number
  averagePricePerSqm: number
  transactionCount: number
}

export interface RegionAnalytics {
  district: string
  city: string
  properties: Property[]
  statistics: {
    totalCount: number
    saleCount: number
    rentCount: number
    averagePrice: number
    medianPrice: number
    averagePricePerSqm: number
    priceRange: {
      min: number
      max: number
    }
    categoryDistribution: Record<string, number>
    priceHistory: PriceHistory[]
  }
}
