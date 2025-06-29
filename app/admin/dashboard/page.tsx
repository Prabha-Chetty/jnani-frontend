'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Users, BookOpen, Calendar, TrendingUp, Settings, LogOut, ArrowRight, Star, FileText, ImageIcon, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/admin/AuthProvider'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated, isLoading, logout } = useAuth()

  // Redirect if not authenticated
  if (!isAuthenticated && !isLoading) {
    router.push('/admin')
    return null
  }

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const stats = [
    { title: 'Total Students', value: '500+', icon: <Users className="w-6 h-6" />, color: 'bg-primary-500', gradient: 'from-primary-500 to-primary-600' },
    { title: 'Active Courses', value: '9', icon: <BookOpen className="w-6 h-6" />, color: 'bg-success-500', gradient: 'from-success-500 to-success-600' },
    { title: 'Classes Today', value: '15', icon: <Calendar className="w-6 h-6" />, color: 'bg-secondary-500', gradient: 'from-secondary-500 to-secondary-600' },
    { title: 'Success Rate', value: '95%', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-warning-500', gradient: 'from-warning-500 to-warning-600' },
  ]

  const quickActions = [
    { title: 'Manage Students', description: 'Add, edit, or remove student records', href: '/admin/students', icon: <Users className="w-6 h-6" /> },
    { title: 'Manage Events', description: 'Create and manage upcoming events', href: '/admin/events', icon: <Calendar className="w-6 h-6" /> },
    { title: 'Manage Library', description: 'Upload and organize digital resources', href: '/admin/library', icon: <BookOpen className="w-6 h-6" /> },
    { title: 'Manage Classes', description: 'Configure class levels and settings', href: '/admin/classes', icon: <Settings className="w-6 h-6" /> },
    { title: 'Content Management', description: 'Update about, contact, and social media content', href: '/admin/content', icon: <FileText className="w-6 h-6" /> },
    { title: 'Gallery Management', description: 'Organize images into albums and collections', href: '/admin/gallery', icon: <ImageIcon className="w-6 h-6" /> },
    { title: 'Contact Enquiries', description: 'View and manage contact form submissions', href: '/admin/contact-enquiries', icon: <MessageCircle className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="glass border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/assets/jnani-logo.jpeg"
                alt="Jnani Logo"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-secondary-500/20"
              />
              <span className="ml-3 text-xl font-bold text-gradient-primary">Admin Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-50 mb-2">Welcome back, Admin!</h1>
          <p className="text-dark-300">Here's what's happening with your tuition classes today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 hover-lift">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-dark-50">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark-50 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div key={index} className="card p-6 hover-lift cursor-pointer group" onClick={() => router.push(action.href)}>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white group-hover:scale-110 transition-transform duration-200">
                    {action.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-dark-100 mb-2 group-hover:text-secondary-400 transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-dark-300 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-secondary-400 text-sm group-hover:text-secondary-300 transition-colors duration-200">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="px-6 py-4 border-b border-dark-700">
            <h2 className="text-xl font-semibold text-dark-50">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors duration-200">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-dark-100">New student registration: Priya Sharma (Class 8)</p>
                  <p className="text-xs text-dark-400">2 hours ago</p>
                </div>
                <Star className="w-4 h-4 text-secondary-400" />
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors duration-200">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-dark-100">Course content updated: Mathematics for Class 10</p>
                  <p className="text-xs text-dark-400">4 hours ago</p>
                </div>
                <BookOpen className="w-4 h-4 text-primary-400" />
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors duration-200">
                <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-dark-100">New event created: Annual Sports Day</p>
                  <p className="text-xs text-dark-400">1 day ago</p>
                </div>
                <Calendar className="w-4 h-4 text-secondary-400" />
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors duration-200">
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-dark-100">Library item added: Advanced Physics Notes</p>
                  <p className="text-xs text-dark-400">2 days ago</p>
                </div>
                <BookOpen className="w-4 h-4 text-warning-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 