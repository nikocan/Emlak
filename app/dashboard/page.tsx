'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getMockDashboardStats } from '@/data/mockData'
import { AgentDashboardStats } from '@/lib/types'
import { formatCurrency } from '@/lib/analytics'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AgentDashboardStats | null>(null)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Check auth
    const isAuth = localStorage.getItem('isAuthenticated')
    if (!isAuth) {
      router.push('/login')
      return
    }

    // Load user data
    const name = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'Emlakçı'
    setUserName(name)

    // Load stats
    setStats(getMockDashboardStats())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userCompany')
    router.push('/')
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      viewing: 'bg-purple-100 text-purple-800',
      negotiating: 'bg-orange-100 text-orange-800',
      closed: 'bg-green-100 text-green-800',
      lost: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      new: 'Yeni',
      contacted: 'İletişimde',
      viewing: 'Görüşme',
      negotiating: 'Pazarlık',
      closed: 'Kapandı',
      lost: 'Kaybedildi'
    }
    return texts[status] || status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Emlak
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-blue-600 font-semibold">
                  Dashboard
                </Link>
                <Link href="/dashboard/listings" className="text-gray-700 hover:text-blue-600">
                  İlanlarım
                </Link>
                <Link href="/dashboard/leads" className="text-gray-700 hover:text-blue-600">
                  Talepler
                </Link>
                <Link href="/dashboard/analytics" className="text-gray-700 hover:text-blue-600">
                  Analitik
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Merhaba, {userName}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">İşletmenizin genel görünümü</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📝</div>
              <div className="text-sm text-green-600 font-semibold">Aktif</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeListings}</div>
            <div className="text-sm text-gray-600">Toplam İlan</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👁️</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalViews.toLocaleString('tr-TR')}
            </div>
            <div className="text-sm text-gray-600">Toplam Görüntülenme</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💬</div>
              <div className="text-sm text-blue-600 font-semibold">
                +{stats.leadsThisMonth} bu ay
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalLeads}</div>
            <div className="text-sm text-gray-600">Toplam Talep</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📊</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              %{stats.conversionRate.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Dönüşüm Oranı</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/listings/new"
              className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 text-center text-white hover:bg-opacity-30 transition-all"
            >
              <div className="text-3xl mb-2">➕</div>
              <div className="font-semibold">Yeni İlan</div>
            </Link>
            <Link
              href="/dashboard/leads"
              className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 text-center text-white hover:bg-opacity-30 transition-all"
            >
              <div className="text-3xl mb-2">📞</div>
              <div className="font-semibold">Talepleri Görüntüle</div>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 text-center text-white hover:bg-opacity-30 transition-all"
            >
              <div className="text-3xl mb-2">📈</div>
              <div className="font-semibold">Raporlar</div>
            </Link>
            <Link
              href="/pricing"
              className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 text-center text-white hover:bg-opacity-30 transition-all"
            >
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold">Paketi Yükselt</div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Son Talepler</h2>
              <Link href="/dashboard/leads" className="text-blue-600 hover:underline text-sm">
                Tümünü Gör →
              </Link>
            </div>

            <div className="space-y-4">
              {stats.recentLeads.map((lead) => (
                <div key={lead.id} className="border-l-4 border-blue-600 pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-600">{lead.email}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(lead.status)}`}>
                      {getStatusText(lead.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">{lead.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Properties */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Popüler İlanlar</h2>
              <Link href="/dashboard/listings" className="text-blue-600 hover:underline text-sm">
                Tümünü Gör →
              </Link>
            </div>

            <div className="space-y-4">
              {stats.popularProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">🏠</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{property.title}</div>
                    <div className="text-sm text-gray-600">{property.location}</div>
                    <div className="text-blue-600 font-bold mt-1">{formatCurrency(property.priceNumeric)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
