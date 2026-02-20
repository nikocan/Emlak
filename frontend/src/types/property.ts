export interface Property {
  id: number
  external_id: string
  source: string
  source_url: string
  title: string
  description?: string
  property_type: string
  listing_type: string
  latitude: number
  longitude: number
  address?: string
  city: string
  district: string
  neighborhood?: string
  price: number
  currency: string
  price_per_sqm?: number
  area_sqm?: number
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  floor?: number
  total_floors?: number
  building_age?: number
  features?: Record<string, any>
  heating_type?: string
  furnished: boolean
  images?: string[]
  thumbnail_url?: string
  agent_name?: string
  agent_phone?: string
  agency_name?: string
  is_active: boolean
  view_count: number
  scraped_at: string
  updated_at?: string
  published_at?: string
}

export interface PropertyFilter {
  city?: string
  district?: string
  neighborhood?: string
  polygon?: number[][]
  center_lat?: number
  center_lng?: number
  radius_km?: number
  property_type?: string
  listing_type?: string
  source?: string[]
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
  min_rooms?: number
  max_rooms?: number
  min_bedrooms?: number
  max_bedrooms?: number
  furnished?: boolean
  min_floor?: number
  max_floor?: number
  skip: number
  limit: number
  sort_by: 'price' | 'area_sqm' | 'scraped_at' | 'published_at'
  sort_order: 'asc' | 'desc'
}

export interface PropertySearchResponse {
  total: number
  properties: Property[]
  avg_price?: number
  avg_price_per_sqm?: number
  min_price?: number
  max_price?: number
}

export interface PropertyStats {
  total_properties: number
  by_source: Record<string, number>
  by_property_type: Record<string, number>
  by_city: Record<string, number>
  avg_price: number
  avg_price_per_sqm?: number
  price_range: {
    min: number
    max: number
  }
}
