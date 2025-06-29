'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  getAuthToken: () => string | null
  checkTokenExpiry: () => boolean
  refreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const router = useRouter()

  // Function to decode JWT token and check expiry
  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  }

  // Function to check if token is about to expire (within 5 minutes)
  const isTokenAboutToExpire = (token: string): boolean => {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return false
    
    const currentTime = Math.floor(Date.now() / 1000)
    const fiveMinutesInSeconds = 5 * 60
    return decoded.exp - currentTime < fiveMinutesInSeconds
  }

  // Function to refresh the session token
  const refreshSession = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('adminAuthToken', data.access_token)
        setAuthToken(data.access_token)
        return true
      }
      return false
    } catch (error) {
      console.error('Error refreshing session:', error)
      return false
    }
  }

  // Function to check token expiry and logout if expired
  const checkTokenExpiry = (): boolean => {
    const token = localStorage.getItem('adminAuthToken')
    if (!token) {
      if (isAuthenticated) {
        handleAutoLogout()
      }
      return true
    }

    if (isTokenExpired(token)) {
      handleAutoLogout()
      return true
    }

    // Show warning if token is about to expire
    if (isTokenAboutToExpire(token) && isAuthenticated) {
      toast.error('Your session will expire soon. Please save your work.', {
        duration: 10000, // Show for 10 seconds
        id: 'session-warning' // Prevent duplicate toasts
      })
    }

    return false
  }

  // Function to handle automatic logout
  const handleAutoLogout = () => {
    localStorage.removeItem('adminAuthToken')
    setAuthToken(null)
    setIsAuthenticated(false)
    toast.error('Session expired. Please login again.')
    router.push('/admin')
  }

  // Check token on mount and set up periodic checks
  useEffect(() => {
    const token = localStorage.getItem('adminAuthToken')
    if (token) {
      if (isTokenExpired(token)) {
        handleAutoLogout()
      } else {
        setAuthToken(token)
        setIsAuthenticated(true)
      }
    }
    setIsLoading(false)

    // Set up periodic token expiry check (every 5 minutes)
    const interval = setInterval(() => {
      if (isAuthenticated) {
        checkTokenExpiry()
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    // Set up automatic session refresh (every 20 minutes)
    const refreshInterval = setInterval(async () => {
      if (isAuthenticated && authToken) {
        const decoded = decodeToken(authToken)
        if (decoded && decoded.exp) {
          const currentTime = Math.floor(Date.now() / 1000)
          const timeUntilExpiry = decoded.exp - currentTime
          const tenMinutesInSeconds = 10 * 60
          
          // Refresh if token expires in less than 10 minutes
          if (timeUntilExpiry < tenMinutesInSeconds && timeUntilExpiry > 0) {
            const success = await refreshSession()
            if (!success) {
              handleAutoLogout()
            }
          }
        }
      }
    }, 20 * 60 * 1000) // Check every 20 minutes

    return () => {
      clearInterval(interval)
      clearInterval(refreshInterval)
    }
  }, [isAuthenticated, authToken])

  // Set up global fetch interceptor to handle 401 responses
  useEffect(() => {
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const response = await originalFetch(...args)
      
      // If we get a 401 Unauthorized response, logout the user
      if (response.status === 401 && isAuthenticated) {
        handleAutoLogout()
      }
      
      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [isAuthenticated])

  // Set up user activity detection for session refresh
  useEffect(() => {
    let activityTimeout: NodeJS.Timeout

    const handleUserActivity = async () => {
      if (isAuthenticated && authToken) {
        const decoded = decodeToken(authToken)
        if (decoded && decoded.exp) {
          const currentTime = Math.floor(Date.now() / 1000)
          const timeUntilExpiry = decoded.exp - currentTime
          const fiveMinutesInSeconds = 5 * 60
          
          // If token expires in less than 5 minutes and user is active, try to refresh
          if (timeUntilExpiry < fiveMinutesInSeconds && timeUntilExpiry > 0) {
            const success = await refreshSession()
            if (!success) {
              handleAutoLogout()
            }
          }
        }
      }
    }

    const resetActivityTimeout = () => {
      clearTimeout(activityTimeout)
      activityTimeout = setTimeout(handleUserActivity, 30000) // 30 seconds of inactivity
    }

    if (isAuthenticated) {
      // Listen for user activity events
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
      events.forEach(event => {
        document.addEventListener(event, resetActivityTimeout, true)
      })

      // Initial activity check
      resetActivityTimeout()

      return () => {
        clearTimeout(activityTimeout)
        events.forEach(event => {
          document.removeEventListener(event, resetActivityTimeout, true)
        })
      }
    }
  }, [isAuthenticated, authToken])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
        console.log('Attempting login with:', { email, password })
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        console.log('Response status:', response.status)
        console.log('Response headers:', response.headers)

        if (response.ok) {
            const data = await response.json()
            console.log('Login successful:', data)
            localStorage.setItem('adminAuthToken', data.access_token)
            setAuthToken(data.access_token)
            setIsAuthenticated(true)
            return true
        } else {
            const errorData = await response.text()
            console.error('Login failed with status:', response.status, 'Error:', errorData)
            return false
        }
    } catch (error) {
        console.error('Login failed with exception:', error)
        return false
    }
  }

  const logout = () => {
    localStorage.removeItem('adminAuthToken')
    setAuthToken(null)
    setIsAuthenticated(false)
    router.push('/admin')
  }

  const getAuthToken = () => {
    return authToken
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout,
      getAuthToken,
      checkTokenExpiry,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 