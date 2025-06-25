import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/admin/AuthProvider'
import AdminAppLayout from '@/components/admin/AdminAppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Panel - Jnani Study Center',
  description: 'Admin panel for managing Jnani Study Center website',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminAppLayout>
            {children}
          </AdminAppLayout>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
} 