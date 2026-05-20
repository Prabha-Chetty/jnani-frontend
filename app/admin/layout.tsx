import type { Metadata } from 'next'
import { AuthProvider } from '@/components/admin/AuthProvider'
import AdminAppLayout from '@/components/admin/AdminAppLayout'

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
    <AuthProvider>
      <AdminAppLayout>{children}</AdminAppLayout>
    </AuthProvider>
  )
}
