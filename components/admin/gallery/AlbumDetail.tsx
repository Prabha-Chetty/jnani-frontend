'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, Edit, Eye, Download, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'
import AlbumForm from './AlbumForm'

interface Image {
  id: string
  file_path: string
  alt_text?: string
  uploaded_at: string
}

interface Album {
  id: string
  title: string
  description?: string
  is_active: boolean
  images: Image[]
  image_count: number
  created_at: string
  updated_at: string
}

interface AlbumDetailProps {
  albumId: string
  onBack: () => void
  onEdit: (album: Album) => void
  onAddImages: (albumId: string) => void
}

export default function AlbumDetail({ albumId, onBack, onEdit, onAddImages }: AlbumDetailProps) {
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showAlbumForm, setShowAlbumForm] = useState(false)

  useEffect(() => {
    loadAlbum()
  }, [albumId])

  const loadAlbum = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/albums/${albumId}`)
      console.log('Album response:', response)
      if (response.ok) {
        const data = await response.json()
        setAlbum(data)
      } else {
        toast.error('Failed to load album')
      }
    } catch (error) {
      console.error('Error loading album:', error)
      toast.error('Failed to load album')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    setDeletingImageId(imageId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        }
      })

      if (response.ok) {
        toast.success('Image deleted successfully!')
        loadAlbum() // Reload album to update image list
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    } finally {
      setDeletingImageId(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getImageUrl = (filePath: string) => {
    if (!filePath) return ''
    if (filePath.startsWith('http')) return filePath
    return `https://jnani-backend.onrender.com${filePath.startsWith('/') ? '' : '/'}${filePath}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-dark-200 mb-2">Album not found</h2>
          <button onClick={onBack} className="btn-primary">Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="btn-outline flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Albums
            </button>
            <div>
              <h1 className="text-3xl font-bold text-dark-50">{album.title}</h1>
              {album.description && (
                <p className="text-dark-300 mt-1">{album.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAlbumForm(true)}
              className="btn-outline text-secondary-500 border-secondary-500 hover:bg-secondary-500 hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Album
            </button>
            <button
              onClick={() => setShowImageUpload(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Images
            </button>
          </div>
        </div>

        {/* Album Info */}
        <div className="card bg-dark-800 border-dark-700 mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-1">Total Images</h3>
                <p className="text-2xl font-bold text-dark-50">{album.image_count}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-1">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  album.is_active 
                    ? 'bg-success-500/20 text-success-400' 
                    : 'bg-dark-600 text-dark-300'
                }`}>
                  {album.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-dark-300 mb-1">Created</h3>
                <p className="text-dark-100">{formatDate(album.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        {album.images.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-dark-400" />
            </div>
            <h3 className="text-lg font-medium text-dark-200 mb-2">No images yet</h3>
            <p className="text-dark-300 mb-4">Add some images to this album to get started.</p>
            <button
              onClick={() => setShowImageUpload(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {album.images.map((image) => (
              <div key={image.id} className="card bg-dark-800 border-dark-700 hover-lift">
                <div className="relative group">
                  <img
                    src={getImageUrl(image.file_path)}
                    alt={image.alt_text || 'Image'}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-t-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-200"
                        title="View Image"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={deletingImageId === image.id}
                        className="p-2 bg-red-500 bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-200 disabled:opacity-50"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-dark-100 mb-1 truncate">
                    {image.alt_text || 'Image'}
                  </h3>
                  <p className="text-xs text-dark-300 mb-2">
                    {formatFileSize(0)}
                  </p>
                  <p className="text-xs text-dark-400">
                    {formatDate(image.uploaded_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-50">
                {selectedImage.alt_text || 'Image'}
              </h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-dark-400 hover:text-dark-200 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <img
                src={getImageUrl(selectedImage.file_path)}
                alt={selectedImage.alt_text || 'Image'}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium text-dark-200 mb-1">File Information</h3>
                  <p className="text-dark-300">Size: {formatFileSize(0)}</p>
                  <p className="text-dark-300">Type: Unknown</p>
                  <p className="text-dark-300">Uploaded: {formatDate(selectedImage.uploaded_at)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-dark-200 mb-1">Actions</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteImage(selectedImage.id)}
                      disabled={deletingImageId === selectedImage.id}
                      className="btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                    <a
                      href={getImageUrl(selectedImage.file_path)}
                      download={selectedImage.alt_text || 'Image'}
                      className="btn-outline text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          albumId={album.id}
          onSuccess={() => {
            setShowImageUpload(false)
            loadAlbum()
          }}
          onClose={() => setShowImageUpload(false)}
        />
      )}

      {/* Album Form Modal */}
      {showAlbumForm && album && (
        <AlbumForm
          album={album}
          onSuccess={() => {
            setShowAlbumForm(false)
            loadAlbum()
          }}
          onClose={() => setShowAlbumForm(false)}
        />
      )}
    </div>
  )
} 