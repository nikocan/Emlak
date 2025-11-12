/**
 * Custom Error Classes
 */

/**
 * Base Application Error
 */
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends AppError {
  public errors: Record<string, string>

  constructor(message: string = 'Validation failed', errors: Record<string, string> = {}) {
    super(message, 400)
    this.errors = errors
  }
}

/**
 * Authentication Error (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401)
  }
}

/**
 * Authorization Error (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409)
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429)
  }
}

/**
 * External API Error
 */
export class ExternalAPIError extends AppError {
  public service: string

  constructor(service: string, message: string = 'External API error') {
    super(message, 502)
    this.service = service
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error') {
    super(message, 500, false)
  }
}

/**
 * Network Error
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network error') {
    super(message, 503)
  }
}

/**
 * AI Service Error
 */
export class AIServiceError extends AppError {
  public feature: string

  constructor(feature: string, message: string = 'AI service error') {
    super(message, 500)
    this.feature = feature
  }
}

/**
 * Scraper Error
 */
export class ScraperError extends AppError {
  public source: string

  constructor(source: string, message: string = 'Scraper error') {
    super(message, 500)
    this.source = source
  }
}

/**
 * Social Media Error
 */
export class SocialMediaError extends AppError {
  public platform: string

  constructor(platform: string, message: string = 'Social media error') {
    super(message, 500)
    this.platform = platform
  }
}

/**
 * Check if error is operational
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown): {
  error: string
  message: string
  statusCode: number
  details?: any
} {
  if (error instanceof AppError) {
    const response: any = {
      error: error.name,
      message: error.message,
      statusCode: error.statusCode,
    }

    if (error instanceof ValidationError && Object.keys(error.errors).length > 0) {
      response.details = error.errors
    }

    return response
  }

  if (error instanceof Error) {
    return {
      error: 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
      statusCode: 500,
    }
  }

  return {
    error: 'UnknownError',
    message: 'An unknown error occurred',
    statusCode: 500,
  }
}
