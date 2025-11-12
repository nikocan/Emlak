/**
 * Ortak formatters ve utility fonksiyonları
 */

/**
 * Para formatı
 */
export function formatCurrency(amount: number, currency: string = 'TRY'): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} M ${getCurrencySymbol(currency)}`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)} K ${getCurrencySymbol(currency)}`
  }
  return `${amount.toLocaleString('tr-TR')} ${getCurrencySymbol(currency)}`
}

/**
 * Para sembolü
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }
  return symbols[currency] || currency
}

/**
 * Tam para formatı (1.234.567 ₺)
 */
export function formatFullCurrency(amount: number, currency: string = 'TRY'): string {
  return `${amount.toLocaleString('tr-TR')} ${getCurrencySymbol(currency)}`
}

/**
 * Tarih formatı
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    return getRelativeTime(d)
  }

  if (format === 'long') {
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return d.toLocaleDateString('tr-TR')
}

/**
 * Göreceli zaman (2 saat önce, 3 gün önce)
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return 'Az önce'
  if (diffMin < 60) return `${diffMin} dakika önce`
  if (diffHour < 24) return `${diffHour} saat önce`
  if (diffDay < 30) return `${diffDay} gün önce`
  if (diffMonth < 12) return `${diffMonth} ay önce`
  return `${diffYear} yıl önce`
}

/**
 * Alan formatı (m²)
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString('tr-TR')}m²`
}

/**
 * Yüzde formatı
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Telefon numarası formatı
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2 $3 $4')
  }

  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3 $4 $5')
  }

  return phone
}

/**
 * Metni kısalt
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Slug oluştur (URL-friendly)
 */
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U',
  }

  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Dosya boyutu formatı
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Sayıyı formatla (1K, 1M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * İlk harfi büyük yap
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Her kelimenin ilk harfini büyük yap
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}
