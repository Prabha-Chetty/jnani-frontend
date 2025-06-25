'use client'

import { useAuth } from './AuthProvider'
import AdminNavbar from './AdminNavbar'
import { ReactNode } from 'react'

export default function AdminAppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900">
        <AdminNavbar />
        <div className="lg:pl-64">
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
} 