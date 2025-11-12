import { SubscriptionPlan } from '@/lib/types'

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Başlangıç',
    price: {
      monthly: 499,
      yearly: 4990 // ~17% indirim
    },
    features: [
      '10 aktif ilan',
      'Her ilan için 10 fotoğraf',
      'Temel istatistikler',
      'Harita üzerinde gösterim',
      'Email destek',
      'Mobil uyumlu ilanlar'
    ],
    limits: {
      maxListings: 10,
      maxPhotos: 10,
      analytics: false,
      apiAccess: false,
      support: 'email',
      customDomain: false,
      teamMembers: 1
    }
  },
  {
    id: 'pro',
    name: 'Profesyonel',
    price: {
      monthly: 999,
      yearly: 9990 // ~17% indirim
    },
    features: [
      '50 aktif ilan',
      'Her ilan için 20 fotoğraf',
      'Gelişmiş analitik ve raporlar',
      'Lead yönetim sistemi',
      'Öncelikli destek',
      'Harita üzerinde öne çıkarma',
      'WhatsApp entegrasyonu',
      'CRM özellikleri',
      '3 takım üyesi'
    ],
    limits: {
      maxListings: 50,
      maxPhotos: 20,
      analytics: true,
      apiAccess: false,
      support: 'priority',
      customDomain: false,
      teamMembers: 3
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    price: {
      monthly: 2499,
      yearly: 24990 // ~17% indirim
    },
    features: [
      'Sınırsız ilan',
      'Sınırsız fotoğraf',
      'Tüm analitik özellikleri',
      'API erişimi',
      '7/24 özel destek',
      'Özel domain',
      'Beyaz etiket çözüm',
      'Özel entegrasyonlar',
      'Sınırsız takım üyesi',
      'Özel eğitim ve onboarding',
      'Öncelikli özellik geliştirme'
    ],
    limits: {
      maxListings: -1, // unlimited
      maxPhotos: -1, // unlimited
      analytics: true,
      apiAccess: true,
      support: '24/7',
      customDomain: true,
      teamMembers: -1 // unlimited
    }
  }
]

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find(p => p.id === planId)
}

export function calculateYearlySavings(plan: SubscriptionPlan): number {
  return (plan.price.monthly * 12) - plan.price.yearly
}
