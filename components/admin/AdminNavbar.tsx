'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  Home, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Briefcase,
  Shield,
  Key,
  ChevronDown,
  Calendar,
  Library,
  GraduationCap,
  ImageIcon,
  MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthProvider'

export default function AdminNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Students', href: '/admin/students', icon: <Users className="w-5 h-5" /> },
    { name: 'Faculties', href: '/admin/faculties', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Events', href: '/admin/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Library', href: '/admin/library', icon: <Library className="w-5 h-5" /> },
    { name: 'Classes', href: '/admin/classes', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Content', href: '/admin/content', icon: <FileText className="w-5 h-5" /> },
    { name: 'Gallery', href: '/admin/gallery', icon: <ImageIcon className="w-5 h-5" /> },
    { name: 'Contact Enquiries', href: '/admin/contact-enquiries', icon: <MessageCircle className="w-5 h-5" /> },
  ]

  const settingsNavigation = [
    { name: 'Users', href: '/admin/settings/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Roles', href: '/admin/settings/roles', icon: <Shield className="w-5 h-5" /> },
    { name: 'Permissions', href: '/admin/settings/permissions', icon: <Key className="w-5 h-5" /> },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }
  
  const NavItem = ({ item }: { item: { name: string; href: string; icon: React.ReactNode } }) => {
      const isActive = pathname === item.href
      return (
        <Link
          key={item.name}
          href={item.href}
          className={`nav-item ${
            isActive
              ? 'nav-item-active'
              : 'nav-item-inactive'
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <span className="mr-3">{item.icon}</span>
          {item.name}
        </Link>
      )
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-dark-300 hover:text-white hover:bg-dark-700 transition-colors duration-200"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-800 border-r border-dark-700 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-300 ease-in-out`}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-dark-700">
          <div className="flex items-center">
            <Image
              src="/assets/jnani-logo.jpeg"
              alt="Jnani Logo"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-secondary-500/20"
            />
            <span className="ml-3 text-lg font-semibold text-gradient-primary">Admin Panel</span>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => <NavItem key={item.name} item={item} />)}
            
            {/* Settings Dropdown */}
            <div>
                <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="nav-item w-full justify-between"
                >
                    <div className="flex items-center">
                        <Settings className="w-5 h-5 mr-3" />
                        <span>Settings</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${settingsOpen ? 'rotate-180' : ''}`} />
                </button>
                {settingsOpen && (
                    <div className="mt-2 space-y-2 pl-4 animate-slide-down">
                        {settingsNavigation.map((item) => <NavItem key={item.name} item={item} />)}
                    </div>
                )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-dark-700">
            <button
              onClick={handleLogout}
              className="nav-item w-full text-left"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
} 