import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatArea(area: number | undefined): string {
  if (!area) return '-'
  return `${area.toLocaleString('tr-TR')} m²`
}

export function formatRooms(rooms: number | undefined, bedrooms: number | undefined): string {
  if (bedrooms && rooms) {
    const living = rooms - bedrooms
    return `${bedrooms}+${living}`
  }
  if (rooms) {
    return `${rooms} oda`
  }
  return '-'
}

export function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    sahibinden: 'bg-yellow-500',
    hurriyetemlak: 'bg-blue-500',
    emlakjet: 'bg-green-500',
  }
  return colors[source] || 'bg-gray-500'
}

export function getSourceName(source: string): string {
  const names: Record<string, string> = {
    sahibinden: 'Sahibinden',
    hurriyetemlak: 'Hürriyet Emlak',
    emlakjet: 'Emlakjet',
  }
  return names[source] || source
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) {
    return `${diffMins} dakika önce`
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`
  } else {
    return date.toLocaleDateString('tr-TR')
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
