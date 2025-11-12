import { Lead, PropertyStats, AgentDashboardStats } from '@/lib/types'
import { properties } from './properties'

// Mock Leads Data
export const mockLeads: Lead[] = [
  {
    id: 1,
    propertyId: 1,
    agentId: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 111 2233',
    message: 'Bu villa için detaylı bilgi almak istiyorum. Görüşme ayarlayabilir miyiz?',
    status: 'new',
    source: 'website',
    createdAt: '2024-11-12T10:30:00',
    updatedAt: '2024-11-12T10:30:00'
  },
  {
    id: 2,
    propertyId: 2,
    agentId: 1,
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    phone: '+90 555 222 3344',
    message: 'Daire için kredi imkanı var mı?',
    status: 'contacted',
    source: 'phone',
    createdAt: '2024-11-11T14:20:00',
    updatedAt: '2024-11-11T16:45:00',
    notes: 'Kredi konusunda bilgi verildi. Yarın tekrar arayacak.'
  },
  {
    id: 3,
    propertyId: 3,
    agentId: 1,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    phone: '+90 555 333 4455',
    message: 'Bu hafta sonu gezebilir miyim?',
    status: 'viewing',
    source: 'website',
    createdAt: '2024-11-10T09:15:00',
    updatedAt: '2024-11-11T11:20:00',
    notes: 'Cumartesi 14:00 için görüşme ayarlandı.'
  },
  {
    id: 4,
    propertyId: 1,
    agentId: 1,
    name: 'Zeynep Şahin',
    email: 'zeynep@example.com',
    phone: '+90 555 444 5566',
    message: 'Fiyatta indirim olabilir mi?',
    status: 'negotiating',
    source: 'email',
    createdAt: '2024-11-09T16:30:00',
    updatedAt: '2024-11-10T10:15:00',
    notes: 'Fiyat görüşmesi devam ediyor. %5 indirim teklif edildi.'
  },
  {
    id: 5,
    propertyId: 4,
    agentId: 1,
    name: 'Can Öztürk',
    email: 'can@example.com',
    phone: '+90 555 555 6677',
    message: 'Ofis için bilgi almak istiyorum',
    status: 'closed',
    source: 'website',
    createdAt: '2024-11-05T11:00:00',
    updatedAt: '2024-11-08T15:30:00',
    notes: 'Satış tamamlandı.'
  },
  {
    id: 6,
    propertyId: 5,
    agentId: 1,
    name: 'Elif Yıldız',
    email: 'elif@example.com',
    phone: '+90 555 666 7788',
    message: 'Daha büyük seçenekler var mı?',
    status: 'lost',
    source: 'referral',
    createdAt: '2024-11-03T13:45:00',
    updatedAt: '2024-11-04T09:20:00',
    notes: 'Bütçe uyuşmadı.'
  }
]

// Mock Property Stats
export const mockPropertyStats: PropertyStats[] = properties.slice(0, 12).map((property, index) => ({
  propertyId: property.id,
  views: Math.floor(Math.random() * 500) + 100,
  clicks: Math.floor(Math.random() * 100) + 20,
  favorites: Math.floor(Math.random() * 50) + 5,
  leads: Math.floor(Math.random() * 20) + 1,
  phoneReveals: Math.floor(Math.random() * 30) + 5,
  lastViewed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
}))

// Mock Dashboard Stats
export function getMockDashboardStats(): AgentDashboardStats {
  const totalViews = mockPropertyStats.reduce((sum, stat) => sum + stat.views, 0)
  const totalLeads = mockLeads.length
  const leadsThisMonth = mockLeads.filter(lead => {
    const leadDate = new Date(lead.createdAt)
    const now = new Date()
    return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear()
  }).length

  const closedLeads = mockLeads.filter(l => l.status === 'closed').length
  const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0

  // En popüler 5 ilan
  const popularProperties = mockPropertyStats
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(stat => properties.find(p => p.id === stat.propertyId)!)
    .filter(Boolean)

  // Son 5 lead
  const recentLeads = [...mockLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return {
    totalListings: properties.length,
    activeListings: properties.length,
    totalViews,
    totalLeads,
    leadsThisMonth,
    conversionRate,
    popularProperties,
    recentLeads
  }
}

export function getLeadsByStatus(status: Lead['status']): Lead[] {
  return mockLeads.filter(lead => lead.status === status)
}

export function getPropertyStats(propertyId: number): PropertyStats | undefined {
  return mockPropertyStats.find(stat => stat.propertyId === propertyId)
}
