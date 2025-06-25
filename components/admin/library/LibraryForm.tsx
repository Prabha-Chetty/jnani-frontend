'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { X, Upload, FileText } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { LibraryItem } from '@/types'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type LibraryFormProps = {
    item: LibraryItem | null
    onSuccess: () => void
    onClose: () => void
}

export default function LibraryForm({ item, onSuccess, onClose }: LibraryFormProps) {
    const { getAuthToken } = useAuth()
    const [title, setTitle] = useState(item?.title || '')
    const [description, setDescription] = useState(item?.description || '')
    const [file, setFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string | null>(item?.file_url || null)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Debug logging
    console.log('LibraryForm item prop:', item)
    console.log('Item ID in form:', item?.id)
    console.log('Item keys in form:', item ? Object.keys(item) : 'No item')

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setFilePreview(URL.createObjectURL(selectedFile))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const token = getAuthToken()
        if (!token) return

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData()
        const itemData = { title, description }
        formData.append('item_json', JSON.stringify(itemData))
        
        if (file) formData.append('file', file)

        try {
            const url = item ? `${API_URL}/library/${item.id}` : `${API_URL}/library/`
            const method = item ? 'put' : 'post'
            
            await axios({
                method,
                url,
                data: formData,
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An unexpected error occurred')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-900 rounded-lg shadow-xl p-8 m-4 max-w-lg w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-dark-100">{item ? 'Edit Library Item' : 'Add New Library Item'}</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-dark-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-dark-100">Title</label>
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
                               className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm input-field"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-dark-100">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                                  className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm input-field"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-100">File</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {filePreview ? (
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-8 h-8 text-blue-600"/>
                                    <span className="text-sm text-dark-600">{filePreview.split('/').pop()}</span>
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-md bg-dark-800 flex items-center justify-center text-xs text-dark-500">No File</div>
                            )}
                            <label htmlFor="file-upload" className="cursor-pointer bg-dark-900 py-2 px-3 border border-dark-700 rounded-md shadow-sm text-sm leading-4 font-medium text-dark-100 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                                <Upload className="w-5 h-5 inline-block mr-2"/>
                                <span>Change</span>
                                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.jpeg,.pdf,.doc,.docx"/>
                            </label>
                        </div>
                        <p className="mt-1 text-xs text-dark-500">Accepted formats: JPG, JPEG, PDF, DOC, DOCX</p>
                    </div>

                    {error && <p className="text-red-500 text-xs italic">{error}</p>}

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                                className="bg-dark-800 text-dark-100 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-dark-700 disabled:bg-dark-900">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting}
                                className="bg-secondary-600 text-dark-100 font-bold py-2 px-4 rounded-lg hover:bg-secondary-700 disabled:bg-secondary-300">
                            {isSubmitting ? 'Saving...' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 