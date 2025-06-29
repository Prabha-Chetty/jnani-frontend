'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function PublicNavbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/#courses' },
    { name: 'Events', href: '/#events' },
    { name: 'About', href: '/#about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Library', href: '/library' },
    { name: 'Contact', href: '/#contact' },
  ]

  const getLinkTag = (link: {name: string, href: string}, isMobile: boolean = false) => {
    // Check if the current path is active for styling
    const isActive = (pathname === link.href) || (link.href !== '/' && !link.href.includes('#') && pathname.startsWith(link.href));
    
    const baseClasses = isMobile 
      ? "text-white hover:text-secondary-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
      : "text-dark-200 hover:text-secondary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
    
    const activeClasses = isMobile
      ? "text-secondary-400 bg-secondary-900/80"
      : "text-secondary-400"
    
    // For hash links (like /#about), use a standard <a> tag on the home page for smooth scrolling,
    // but a <Link> tag on other pages to navigate back to the home page first.
    if (link.href.includes('#')) {
      if (pathname === '/') {
        return (
          <a
            key={link.name}
            href={link.href.substring(1)} // e.g., #courses
            className={baseClasses}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </a>
        )
      } else {
        return (
          <Link
            key={link.name}
            href={link.href} // e.g., /#courses
            className={baseClasses}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        )
      }
    }

    // For all other standard links
    return (
      <Link
        key={link.name}
        href={link.href}
        className={`${
          isActive ? activeClasses : baseClasses
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {link.name}
      </Link>
    )
  }

  return (
    <>
      <nav className="glass sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/jnani-logo.jpeg"
                alt="Jnani Logo"
                width={50}
                height={50}
                className="rounded-full ring-2 ring-secondary-500/20"
              />
              <span className="ml-3 text-xl font-bold text-gradient-primary">Jnani Study Center</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => getLinkTag(link))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-dark-200 hover:text-secondary-400 hover:bg-secondary-100/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary-500 transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-900/95 backdrop-blur-md border-t border-gray-800/50 shadow-lg rounded-b-xl">
            {navLinks.map((link) => getLinkTag(link, true))}
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
} 