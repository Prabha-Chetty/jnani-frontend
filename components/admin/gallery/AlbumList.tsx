'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, Image as ImageIcon, Calendar, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Album {
  id: string
  title: string
  description?: string
  is_active: boolean
  image_count: number
  created_at: string
  updated_at: string
}

interface AlbumListProps {
  albums: Album[]
  onEdit: (album: Album) => void
  onDelete: (albumId: string) => void
  onView: (albumId: string) => void
  onAddImages: (albumId: string) => void
}

export default function AlbumList({ albums, onEdit, onDelete, onView, onAddImages }: AlbumListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (albumId: string) => {
    if (!confirm('Are you sure you want to delete this album? This will also delete all images in the album.')) {
      return
    }

    setDeletingId(albumId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/albums/${albumId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        }
      })

      if (response.ok) {
        toast.success('Album deleted successfully!')
        onDelete(albumId)
      } else {
        toast.error('Failed to delete album')
      }
    } catch (error) {
      console.error('Error deleting album:', error)
      toast.error('Failed to delete album')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-16 h-16 text-dark-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-200 mb-2">No albums yet</h3>
        <p className="text-dark-300">Create your first album to start organizing your gallery images.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <div key={album.id} className="card bg-dark-800 border-dark-700 hover-lift">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-100 mb-1">{album.title}</h3>
                {album.description && (
                  <p className="text-dark-300 text-sm line-clamp-2">{album.description}</p>
                )}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                album.is_active 
                  ? 'bg-success-500/20 text-success-400' 
                  : 'bg-dark-600 text-dark-300'
              }`}>
                {album.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4 text-sm text-dark-300">
              <div className="flex items-center">
                <ImageIcon className="w-4 h-4 mr-1" />
                <span>{album.image_count} images</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(album.created_at)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onView(album.id)}
                className="btn-outline flex-1 text-sm"
                title="View Album"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button
                onClick={() => onAddImages(album.id)}
                className="btn-outline flex-1 text-sm"
                title="Add Images"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
              <button
                onClick={() => onEdit(album)}
                className="btn-outline text-secondary-500 border-secondary-500 hover:bg-secondary-500 hover:text-white"
                title="Edit Album"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(album.id)}
                disabled={deletingId === album.id}
                className="btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                title="Delete Album"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 