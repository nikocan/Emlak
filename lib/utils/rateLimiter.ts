/**
 * Rate Limiter - İstekleri kontrol altında tutar
 */
export class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private timeWindow: number // milliseconds

  constructor(maxRequests: number, timeWindowSeconds: number) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowSeconds * 1000
  }

  /**
   * İstek yapılabilir mi kontrol eder
   */
  canMakeRequest(): boolean {
    this.clearOldRequests()
    return this.requests.length < this.maxRequests
  }

  /**
   * Bir istek kaydeder
   */
  recordRequest(): void {
    this.clearOldRequests()
    this.requests.push(Date.now())
  }

  /**
   * Bir sonraki isteğe kadar beklemesi gereken süreyi döndürür (ms)
   */
  getWaitTime(): number {
    this.clearOldRequests()

    if (this.requests.length < this.maxRequests) {
      return 0
    }

    const oldestRequest = this.requests[0]
    const timeSinceOldest = Date.now() - oldestRequest
    return Math.max(0, this.timeWindow - timeSinceOldest)
  }

  /**
   * İstek yapılabilene kadar bekler
   */
  async waitForSlot(): Promise<void> {
    const waitTime = this.getWaitTime()
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  /**
   * Mevcut kapasite kullanımını döndürür (0-1 arası)
   */
  getCurrentLoad(): number {
    this.clearOldRequests()
    return this.requests.length / this.maxRequests
  }

  /**
   * İstatistikleri döndürür
   */
  getStats() {
    this.clearOldRequests()
    return {
      currentRequests: this.requests.length,
      maxRequests: this.maxRequests,
      load: this.getCurrentLoad(),
      canMakeRequest: this.canMakeRequest(),
      waitTime: this.getWaitTime(),
    }
  }

  /**
   * Eski istekleri temizler
   */
  private clearOldRequests(): void {
    const now = Date.now()
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    )
  }

  /**
   * Tüm kayıtları sıfırlar
   */
  reset(): void {
    this.requests = []
  }
}

/**
 * Global rate limiter instance'ları - Her kaynak için ayrı
 */
const rateLimiters = new Map<string, RateLimiter>()

/**
 * Belirli bir kaynak için rate limiter döndürür
 */
export function getRateLimiter(
  source: string,
  maxRequests: number,
  timeWindowSeconds: number
): RateLimiter {
  const key = `${source}:${maxRequests}:${timeWindowSeconds}`

  if (!rateLimiters.has(key)) {
    rateLimiters.set(key, new RateLimiter(maxRequests, timeWindowSeconds))
  }

  return rateLimiters.get(key)!
}
