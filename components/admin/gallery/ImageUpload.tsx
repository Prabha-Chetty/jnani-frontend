'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  albumId: string
  onSuccess: () => void
  onClose: () => void
}

interface UploadingImage {
  file: File
  id: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export default function ImageUpload({ albumId, onSuccess, onClose }: ImageUploadProps) {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    )

    if (imageFiles.length === 0) {
      toast.error('Please select valid image files (max 10MB each)')
      return
    }

    const newUploadingImages: UploadingImage[] = imageFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0
    }))

    setUploadingImages(prev => [...prev, ...newUploadingImages])
    uploadImages(newUploadingImages)
  }

  const uploadImages = async (images: UploadingImage[]) => {
    for (const image of images) {
      try {
        const formData = new FormData()
        formData.append('file', image.file)
        formData.append('alt_text', image.file.name)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/albums/${albumId}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
          },
          body: formData
        })

        if (response.ok) {
          setUploadingImages(prev => 
            prev.map(img => 
              img.id === image.id 
                ? { ...img, status: 'success', progress: 100 }
                : img
            )
          )
        } else {
          const error = await response.text()
          setUploadingImages(prev => 
            prev.map(img => 
              img.id === image.id 
                ? { ...img, status: 'error', error: error }
                : img
            )
          )
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        setUploadingImages(prev => 
          prev.map(img => 
            img.id === image.id 
              ? { ...img, status: 'error', error: 'Upload failed' }
              : img
          )
        )
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const allUploadsComplete = uploadingImages.length > 0 && 
    uploadingImages.every(img => img.status === 'success' || img.status === 'error')

  const successfulUploads = uploadingImages.filter(img => img.status === 'success').length

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-dark-50">Upload Images</h2>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-200 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive 
              ? 'border-secondary-500 bg-secondary-500/10' 
              : 'border-dark-600 hover:border-dark-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-200 mb-2">
            Drop images here or click to browse
          </h3>
          <p className="text-dark-300 mb-4">
            Supports JPG, PNG, GIF up to 10MB each
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            Select Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Upload Progress */}
        {uploadingImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-dark-200 mb-4">Upload Progress</h3>
            <div className="space-y-3">
              {uploadingImages.map((image) => (
                <div key={image.id} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
                  <div className="flex-shrink-0">
                    {image.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 text-secondary-500 animate-spin" />
                    )}
                    {image.status === 'success' && (
                      <Check className="w-5 h-5 text-success-500" />
                    )}
                    {image.status === 'error' && (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-100 truncate">
                      {image.file.name}
                    </p>
                    <p className="text-xs text-dark-300">
                      {formatFileSize(image.file.size)}
                    </p>
                    {image.error && (
                      <p className="text-xs text-red-400">{image.error}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      image.status === 'success' 
                        ? 'bg-success-500/20 text-success-400'
                        : image.status === 'error'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-secondary-500/20 text-secondary-400'
                    }`}>
                      {image.status === 'uploading' && 'Uploading...'}
                      {image.status === 'success' && 'Success'}
                      {image.status === 'error' && 'Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {allUploadsComplete && (
          <div className="mt-6 p-4 bg-dark-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-200">
                  Upload complete: {successfulUploads} of {uploadingImages.length} images uploaded successfully
                </p>
                {successfulUploads > 0 && (
                  <p className="text-success-400 text-sm">
                    {successfulUploads} image(s) added to album
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  if (successfulUploads > 0) {
                    onSuccess()
                  }
                  onClose()
                }}
                className="btn-primary"
              >
                {successfulUploads > 0 ? 'View Album' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 