'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'
import PublicNavbar from '@/components/PublicNavbar'

interface AlbumImage {
  id: string;
  file_path: string;
  alt_text?: string;
}

interface Album {
  id: string;
  title: string;
  description?: string;
  images: AlbumImage[];
}

export default function AlbumDetailPage({ params }: { params: { albumId: string } }) {
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<AlbumImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchAlbumDetail() {
      if (!params.albumId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/albums/${params.albumId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch album details')
        }
        const data = await res.json()
        setAlbum(data)
      } catch (error) {
        console.error('Failed to fetch album:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbumDetail()
  }, [params.albumId])

  const openModal = (image: AlbumImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const showNextImage = () => {
    if (album && selectedImage) {
      const nextIndex = (currentIndex + 1) % album.images.length;
      setSelectedImage(album.images[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  };

  const showPrevImage = () => {
    if (album && selectedImage) {
      const prevIndex = (currentIndex - 1 + album.images.length) % album.images.length;
      setSelectedImage(album.images[prevIndex]);
      setCurrentIndex(prevIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 text-dark-200">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/gallery" className="inline-flex items-center text-secondary-400 hover:text-secondary-300 mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Gallery
        </Link>
        <div className="text-center mb-12">
          {loading ? (
            <div className="text-center">Loading album...</div>
          ) : album ? (
            <>
              <h1 className="text-4xl font-bold">{album.title}</h1>
              <p className="text-dark-300 mt-2">{album.description}</p>
            </>
          ) : (
            <div className="text-center">Album not found.</div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {album?.images.map((image, index) => (
            <div key={image.id} className="group relative aspect-square" onClick={() => openModal(image, index)}>
              <Image
                src={image.file_path}
                alt={image.alt_text || album?.title || 'Album Image'}
                layout="fill"
                className="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </main>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage.file_path}
              alt={selectedImage.alt_text || album?.title || 'Album Image'}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] rounded-lg"
            />
            <button onClick={closeModal} className="absolute -top-4 -right-4 btn-secondary rounded-full p-2">
              <X className="w-6 h-6" />
            </button>
            <button onClick={showPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 btn-secondary rounded-full p-2">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={showNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 btn-secondary rounded-full p-2">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 