'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function PublicNavbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/#courses' },
    { name: 'Events', href: '/#events' },
    { name: 'About', href: '/#about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Library', href: '/library' },
    { name: 'Contact', href: '/#contact' },
  ]

  const getLinkTag = (link: {name: string, href: string}) => {
    // Check if the current path is active for styling
    const isActive = (pathname === link.href) || (link.href !== '/' && !link.href.includes('#') && pathname.startsWith(link.href));
    
    // For hash links (like /#about), use a standard <a> tag on the home page for smooth scrolling,
    // but a <Link> tag on other pages to navigate back to the home page first.
    if (link.href.includes('#')) {
      if (pathname === '/') {
        return (
          <a
            key={link.name}
            href={link.href.substring(1)} // e.g., #courses
            className="text-dark-200 hover:text-secondary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {link.name}
          </a>
        )
      } else {
        return (
          <Link
            key={link.name}
            href={link.href} // e.g., /#courses
            className="text-dark-200 hover:text-secondary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
          isActive ? 'text-secondary-400' : 'text-dark-200'
        } hover:text-secondary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
      >
        {link.name}
      </Link>
    )
  }

  return (
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
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => getLinkTag(link))}
              <Link href="/admin" className="btn-secondary flex items-center">
                Admin Panel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 