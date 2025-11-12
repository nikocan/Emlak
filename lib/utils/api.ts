/**
 * API Helper Functions
 */

import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS } from './constants'
import { AppError, NetworkError } from './errors'

export interface APIRequestOptions extends RequestInit {
  timeout?: number
  baseURL?: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * API fetch with timeout and error handling
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: APIRequestOptions = {}
): Promise<APIResponse<T>> {
  const {
    timeout = API_TIMEOUT,
    baseURL = API_BASE_URL,
    headers = {},
    ...fetchOptions
  } = options

  const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    if (!response.ok) {
      throw new AppError(
        data.message || data.error || 'Request failed',
        response.status
      )
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new NetworkError('Request timeout')
    }

    if (error instanceof AppError) {
      throw error
    }

    throw new NetworkError('Network request failed')
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(
  endpoint: string,
  options?: APIRequestOptions
): Promise<APIResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'GET',
  })
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: APIRequestOptions
): Promise<APIResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: APIRequestOptions
): Promise<APIResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  options?: APIRequestOptions
): Promise<APIResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options?: APIRequestOptions
): Promise<APIResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
  })
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * Handle API error and return user-friendly message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Bir hata oluştu'
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError!
}

/**
 * Check if response is success
 */
export function isAPISuccess<T>(response: APIResponse<T>): response is APIResponse<T> & { data: T } {
  return response.success && response.data !== undefined
}
