'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PublicNavbar from '@/components/PublicNavbar'

type Album = {
  id: string
  title: string
  description: string
  images: { file_path: string }[]
};

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch('http://localhost:8000/gallery/albums')
        if (!res.ok) {
          throw new Error('Failed to fetch albums')
        }
        const data = await res.json()
        setAlbums(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbums()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 text-dark-200">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-primary">
            Our Gallery
          </h1>
          <p className="mt-4 text-lg text-dark-300">
            A glimpse into our world at Jnani Study Center.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-lg text-dark-300">Loading albums...</div>
        ) : albums.length === 0 ? (
          <div className="text-center text-lg text-dark-300">No albums have been added yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link href={`/gallery/${album.id}`} key={album.id} className="block group card-glass p-4 rounded-xl overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-dark-800">
                  <Image
                    src={album.images && album.images.length > 0 ? album.images[0].file_path : '/assets/jnani-logo.jpeg'}
                    alt={album.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-300"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-dark-100">{album.title}</h3>
                  <p className="mt-2 text-sm text-dark-400 line-clamp-2">{album.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 