import { useAuth } from './AuthProvider'

interface FetchOptions extends RequestInit {
  requireAuth?: boolean
}

export function useAuthenticatedFetch() {
  const { getAuthToken, checkTokenExpiry } = useAuth()

  const authenticatedFetch = async (url: string, options: FetchOptions = {}) => {
    const { requireAuth = true, ...fetchOptions } = options

    // Check if token is expired before making the request
    if (requireAuth) {
      const isExpired = checkTokenExpiry()
      if (isExpired) {
        throw new Error('Session expired')
      }
    }

    // Add authorization header if required
    if (requireAuth) {
      const token = getAuthToken()
      if (token) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${token}`
        }
      }
    }

    const response = await fetch(url, fetchOptions)

    // If we get a 401, the token might be expired
    if (response.status === 401 && requireAuth) {
      checkTokenExpiry() // This will trigger auto logout
      throw new Error('Unauthorized - Session may have expired')
    }

    return response
  }

  return { authenticatedFetch }
} 