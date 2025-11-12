/**
 * Form validation utilities
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Email validasyonu
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email adresi gereklidir' }
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Geçerli bir email adresi giriniz' }
  }

  return { isValid: true }
}

/**
 * Telefon numarası validasyonu (Türkiye)
 */
export function validatePhone(phone: string): ValidationResult {
  const cleaned = phone.replace(/\D/g, '')

  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Telefon numarası gereklidir' }
  }

  if (cleaned.length !== 10 && cleaned.length !== 11) {
    return { isValid: false, error: 'Geçerli bir telefon numarası giriniz (10 veya 11 haneli)' }
  }

  if (cleaned.length === 11 && !cleaned.startsWith('0')) {
    return { isValid: false, error: 'Telefon numarası 0 ile başlamalıdır' }
  }

  return { isValid: true }
}

/**
 * Fiyat validasyonu
 */
export function validatePrice(price: number | string): ValidationResult {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price

  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Geçerli bir fiyat giriniz' }
  }

  if (numPrice <= 0) {
    return { isValid: false, error: 'Fiyat sıfırdan büyük olmalıdır' }
  }

  if (numPrice > 1000000000) {
    return { isValid: false, error: 'Fiyat çok yüksek' }
  }

  return { isValid: true }
}

/**
 * Alan validasyonu (m²)
 */
export function validateArea(area: number | string): ValidationResult {
  const numArea = typeof area === 'string' ? parseFloat(area) : area

  if (isNaN(numArea)) {
    return { isValid: false, error: 'Geçerli bir alan giriniz' }
  }

  if (numArea <= 0) {
    return { isValid: false, error: 'Alan sıfırdan büyük olmalıdır' }
  }

  if (numArea > 100000) {
    return { isValid: false, error: 'Alan çok büyük' }
  }

  return { isValid: true }
}

/**
 * Şifre validasyonu
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Şifre gereklidir' }
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Şifre en az 6 karakter olmalıdır' }
  }

  if (password.length > 128) {
    return { isValid: false, error: 'Şifre çok uzun' }
  }

  // Güçlü şifre kontrolü (opsiyonel)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      error: 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
    }
  }

  return { isValid: true }
}

/**
 * URL validasyonu
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL gereklidir' }
  }

  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Geçerli bir URL giriniz' }
  }
}

/**
 * Required field validasyonu
 */
export function validateRequired(value: any, fieldName: string = 'Alan'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} gereklidir` }
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} gereklidir` }
  }

  return { isValid: true }
}

/**
 * Min length validasyonu
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string = 'Alan'
): ValidationResult {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} en az ${minLength} karakter olmalıdır`,
    }
  }

  return { isValid: true }
}

/**
 * Max length validasyonu
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string = 'Alan'
): ValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} en fazla ${maxLength} karakter olabilir`,
    }
  }

  return { isValid: true }
}

/**
 * Range validasyonu (sayı aralığı)
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Değer'
): ValidationResult {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} ${min} ile ${max} arasında olmalıdır`,
    }
  }

  return { isValid: true }
}

/**
 * Dosya validasyonu
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // bytes
    allowedTypes?: string[]
  } = {}
): ValidationResult {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Dosya boyutu en fazla ${maxSize / 1024 / 1024}MB olabilir`,
    }
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Desteklenen dosya türleri: ${allowedTypes.join(', ')}`,
    }
  }

  return { isValid: true }
}

/**
 * Çoklu validasyon çalıştır
 */
export function runValidations(validations: ValidationResult[]): ValidationResult {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation
    }
  }

  return { isValid: true }
}
