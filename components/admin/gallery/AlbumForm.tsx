'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Album {
  id?: string
  title: string
  description?: string
  is_active: boolean
}

interface AlbumFormProps {
  album?: Album
  onSuccess: () => void
  onClose: () => void
}

export default function AlbumForm({ album, onSuccess, onClose }: AlbumFormProps) {
  const [formData, setFormData] = useState<Album>({
    title: '',
    description: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (album) {
      setFormData(album)
    }
  }, [album])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = album 
        ? `http://localhost:8000/gallery/albums/${album.id}`
        : 'http://localhost:8000/gallery/albums'
      
      const method = album ? 'PUT' : 'POST'
      const body = album 
        ? { title: formData.title, description: formData.description, is_active: formData.is_active }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast.success(album ? 'Album updated successfully!' : 'Album created successfully!')
        onSuccess()
        onClose()
      } else {
        const error = await response.text()
        toast.error(`Failed to ${album ? 'update' : 'create'} album: ${error}`)
      }
    } catch (error) {
      console.error('Error saving album:', error)
      toast.error(`Failed to ${album ? 'update' : 'create'} album`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="bg-dark-900 rounded-lg shadow-xl p-8 m-4 max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-dark-50">
            {album ? 'Edit Album' : 'Create New Album'}
          </h2>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-200 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Album Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
              placeholder="Enter album title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
              placeholder="Enter album description (optional)"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 text-secondary-500 bg-dark-700 border-dark-600 rounded focus:ring-secondary-500 focus:ring-2"
            />
            <label htmlFor="is_active" className="text-sm text-dark-200">
              Album is active
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="btn-primary flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {album ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {album ? 'Update Album' : 'Create Album'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 