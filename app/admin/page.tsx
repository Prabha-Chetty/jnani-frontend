'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/admin/AuthProvider'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading, login } = useAuth()

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/admin/dashboard')
    return null
  }

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast.success('Login successful!')
        router.push('/admin/dashboard')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/assets/jnani-logo.jpeg"
              alt="Jnani Logo"
              width={80}
              height={80}
              className="rounded-full ring-4 ring-secondary-500/20 shadow-2xl"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-dark-50">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-dark-300">
            Sign in to manage your study center website
          </p>
        </div>
        
        <div className="card p-8">
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-200">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full mt-1"
                  placeholder="admin@jnanistudycenter.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-200">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-200 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-dark-400">
                Demo Credentials: admin@jnanistudycenter.com / admin123
              </p>
            </div>
          </form>
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className="text-dark-300 hover:text-secondary-400 text-sm transition-colors duration-200 flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
} 