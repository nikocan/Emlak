import axios from 'axios'
import { PropertyFilter, PropertySearchResponse, PropertyStats, Property } from '@/types/property'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const propertyApi = {
  // Search properties
  search: async (filters: Partial<PropertyFilter>): Promise<PropertySearchResponse> => {
    const params = new URLSearchParams()

    // Convert filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'polygon' && Array.isArray(value)) {
          params.append(key, JSON.stringify(value))
        } else if (key === 'source' && Array.isArray(value)) {
          value.forEach((s) => params.append(key, s))
        } else {
          params.append(key, String(value))
        }
      }
    })

    const response = await api.get<PropertySearchResponse>(`/properties/search?${params}`)
    return response.data
  },

  // Get property by ID
  getById: async (id: number): Promise<Property> => {
    const response = await api.get<Property>(`/properties/${id}`)
    return response.data
  },

  // Get property statistics
  getStats: async (): Promise<PropertyStats> => {
    const response = await api.get<PropertyStats>('/properties/stats/overview')
    return response.data
  },

  // Increment view count
  incrementView: async (id: number): Promise<void> => {
    await api.post(`/properties/${id}/view`)
  },
}

export const scraperApi = {
  // Trigger scraping
  scrape: async (params: {
    city: string
    district?: string
    listing_type?: string
    property_type?: string
    max_pages?: number
  }) => {
    const response = await api.post('/scraper/scrape', params)
    return response.data
  },

  // Scrape synchronously
  scrapeSync: async (params: {
    city: string
    district?: string
    listing_type?: string
    property_type?: string
    max_pages?: number
  }) => {
    const response = await api.post('/scraper/scrape/sync', params)
    return response.data
  },

  // Scrape property details
  scrapeDetail: async (propertyId: number) => {
    const response = await api.post(`/scraper/scrape/detail/${propertyId}`)
    return response.data
  },
}

export default api
