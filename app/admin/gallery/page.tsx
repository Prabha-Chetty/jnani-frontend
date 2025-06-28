'use client'

import { useState, useEffect } from 'react'
import { Plus, Image as ImageIcon, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AlbumForm from '@/components/admin/gallery/AlbumForm'
import AlbumList from '@/components/admin/gallery/AlbumList'
import AlbumDetail from '@/components/admin/gallery/AlbumDetail'
import ImageUpload from '@/components/admin/gallery/ImageUpload'

interface Album {
  id: string
  title: string
  description?: string
  is_active: boolean
  image_count: number
  created_at: string
  updated_at: string
}

type ViewMode = 'list' | 'detail' | 'upload'

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('')
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [showAlbumForm, setShowAlbumForm] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)

  useEffect(() => {
    loadAlbums()
  }, [])

  const loadAlbums = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/albums`)
      if (response.ok) {
        const data = await response.json()
        setAlbums(data)
      } else {
        toast.error('Failed to load albums')
      }
    } catch (error) {
      console.error('Error loading albums:', error)
      toast.error('Failed to load albums')
    } finally {
      setLoading(false)
    }
  }

  const handleAlbumSuccess = () => {
    loadAlbums()
  }

  const handleAlbumDelete = (albumId: string) => {
    setAlbums(prev => prev.filter(album => album.id !== albumId))
  }

  const handleViewAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId)
    setViewMode('detail')
  }

  const handleEditAlbum = (album: Album) => {
    setSelectedAlbum(album)
    setShowAlbumForm(true)
  }

  const handleAddImages = (albumId: string) => {
    setSelectedAlbumId(albumId)
    setShowImageUpload(true)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedAlbumId('')
  }

  const handleImageUploadSuccess = () => {
    if (viewMode === 'detail') {
      // Refresh the album detail view
      setViewMode('detail')
    } else {
      loadAlbums()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-secondary-500" />
          <span className="text-dark-200">Loading gallery...</span>
        </div>
      </div>
    )
  }

  if (viewMode === 'detail') {
    return (
      <AlbumDetail
        albumId={selectedAlbumId}
        onBack={handleBackToList}
        onEdit={handleEditAlbum}
        onAddImages={handleAddImages}
      />
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-50 mb-2">Gallery Management</h1>
            <p className="text-dark-300">Organize your images into albums for better presentation</p>
          </div>
          <button
            onClick={() => setShowAlbumForm(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Album
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Total Albums</p>
                  <p className="text-2xl font-bold text-dark-50">{albums.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Active Albums</p>
                  <p className="text-2xl font-bold text-dark-50">
                    {albums.filter(album => album.is_active).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-lg">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Total Images</p>
                  <p className="text-2xl font-bold text-dark-50">
                    {albums.reduce((total, album) => total + album.image_count, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Albums List */}
        <AlbumList
          albums={albums}
          onEdit={handleEditAlbum}
          onDelete={handleAlbumDelete}
          onView={handleViewAlbum}
          onAddImages={handleAddImages}
        />
      </div>

      {/* Album Form Modal */}
      {showAlbumForm && (
        <AlbumForm
          album={selectedAlbum || undefined}
          onSuccess={handleAlbumSuccess}
          onClose={() => {
            setShowAlbumForm(false)
            setSelectedAlbum(null)
          }}
        />
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          albumId={selectedAlbumId}
          onSuccess={handleImageUploadSuccess}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  )
} 