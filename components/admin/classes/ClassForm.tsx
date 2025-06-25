'use client'

import { useState, FormEvent } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Class } from '@/types'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type ClassFormProps = {
    classItem: Class | null
    onSuccess: () => void
    onClose: () => void
}

export default function ClassForm({ classItem, onSuccess, onClose }: ClassFormProps) {
    const { getAuthToken } = useAuth()
    const [name, setName] = useState(classItem?.name || '')
    const [description, setDescription] = useState(classItem?.description || '')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const token = getAuthToken()
        if (!token) return

        setIsSubmitting(true)
        setError(null)

        try {
            const classData = { name, description: description || null }
            const url = classItem ? `${API_URL}/classes/${classItem.id}` : `${API_URL}/classes/`
            const method = classItem ? 'put' : 'post'
            
            await axios({
                method,
                url,
                data: classData,
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
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
                    <h2 className="text-2xl font-bold text-gray-900">{classItem ? 'Edit Class' : 'Add New Class'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Class Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                               className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                                  className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"/>
                    </div>

                    {error && <p className="text-red-500 text-xs italic">{error}</p>}

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                                className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300 disabled:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting}
                                className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-primary-300">
                            {isSubmitting ? 'Saving...' : 'Save Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 