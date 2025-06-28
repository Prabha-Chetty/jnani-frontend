'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  getAuthToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminAuthToken')
    if (token) {
      setAuthToken(token)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

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
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, getAuthToken }}>
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