export interface Property {
  id: number
  title: string
  description: string
  location: string
  city: string
  district: string
  price: string
  priceNumeric: number
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
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  bedrooms?: number
}
