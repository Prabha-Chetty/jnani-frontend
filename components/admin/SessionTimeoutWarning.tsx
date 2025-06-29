'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useAuthenticatedFetch } from './useAuthenticatedFetch'
import { AlertTriangle, X, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function SessionTimeoutWarning() {
  const { getAuthToken, checkTokenExpiry } = useAuth()
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const checkSession = () => {
      const token = getAuthToken()
      if (!token) return

      try {
        // Decode token to get expiry time
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        const decoded = JSON.parse(jsonPayload)

        if (!decoded.exp) return

        const currentTime = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = decoded.exp - currentTime
        const fiveMinutesInSeconds = 5 * 60

        if (timeUntilExpiry <= 0) {
          // Session expired
          checkTokenExpiry()
        } else if (timeUntilExpiry <= fiveMinutesInSeconds) {
          // Show warning
          setShowWarning(true)
          setTimeLeft(timeUntilExpiry)
        } else {
          setShowWarning(false)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    // Check immediately
    checkSession()

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000)

    // Update countdown every second when warning is shown
    const countdownInterval = setInterval(() => {
      if (showWarning) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            checkTokenExpiry()
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [getAuthToken, checkTokenExpiry, showWarning])

  const handleRefreshSession = async () => {
    setIsRefreshing(true)
    try {
      const response = await authenticatedFetch(`${API_URL}/auth/refresh`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('adminAuthToken', data.access_token)
        toast.success('Session refreshed successfully')
        setShowWarning(false)
      } else {
        toast.error('Failed to refresh session')
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
      toast.error('Failed to refresh session')
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!showWarning) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Session Timeout Warning
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Your session will expire in {formatTime(timeLeft)}</p>
            <p className="mt-1">Please save your work and refresh your session.</p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleRefreshSession}
              disabled={isRefreshing}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
            </button>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => setShowWarning(false)}
            className="inline-flex text-yellow-400 hover:text-yellow-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 