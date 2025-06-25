'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { X, Upload } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Event } from '@/types'
import axios from 'axios'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type EventFormProps = {
    event: Event | null
    onSuccess: () => void
    onClose: () => void
}

export default function EventForm({ event, onSuccess, onClose }: EventFormProps) {
    const { getAuthToken } = useAuth()
    const [title, setTitle] = useState(event?.title || '')
    const [description, setDescription] = useState(event?.description || '')
    const [eventDate, setEventDate] = useState(event ? new Date(event.event_date).toISOString().split('T')[0] : '')
    const [image, setImage] = useState<File | null>(null)
    const [video, setVideo] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(event?.image_url || null)
    const [videoPreview, setVideoPreview] = useState<string | null>(event?.video_url || null)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setVideo(file)
            setVideoPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const token = getAuthToken()
        if (!token) return

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData()
        const eventData = { title, description, event_date: new Date(eventDate).toISOString() }
        formData.append('event_json', JSON.stringify(eventData))
        
        if (image) formData.append('image', image)
        if (video) formData.append('video', video)

        try {
            const url = event ? `${API_URL}/events/${event.id}` : `${API_URL}/events/`
            const method = event ? 'put' : 'post'
            
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
            <div className="bg-dark-900 rounded-lg shadow-xl p-8 m-4 max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-dark-100">{event ? 'Edit Event' : 'Add New Event'}</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-dark-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-dark-100">Title</label>
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
                               className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-dark-100">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                                  className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="eventDate" className="block text-sm font-medium text-dark-100">Event Date</label>
                        <input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required
                               className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"/>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-dark-100">Event Image</label>
                            <div className="mt-1 flex items-center space-x-4">
                                {imagePreview ? <Image src={imagePreview} alt="Preview" width={80} height={80} className="rounded-md object-cover"/> : <div className="w-20 h-20 rounded-md bg-dark-800 flex items-center justify-center text-xs text-dark-400">No Image</div>}
                                <label htmlFor="image-upload" className="cursor-pointer bg-dark-900 py-2 px-3 border border-dark-700 rounded-md shadow-sm text-sm leading-4 font-medium text-dark-100 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                                    <Upload className="w-5 h-5 inline-block mr-2"/>
                                    <span>Change</span>
                                    <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*"/>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-100">Event Video</label>
                            <div className="mt-1 flex items-center space-x-4">
                                {videoPreview ? <video src={videoPreview} width="120" controls className="rounded-md"/> : <div className="w-28 h-20 rounded-md bg-dark-800 flex items-center justify-center text-xs text-dark-400">No Video</div>}
                                <label htmlFor="video-upload" className="cursor-pointer bg-dark-900 py-2 px-3 border border-dark-700 rounded-md shadow-sm text-sm leading-4 font-medium text-dark-100 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                                    <Upload className="w-5 h-5 inline-block mr-2"/>
                                    <span>Change</span>
                                    <input id="video-upload" type="file" className="hidden" onChange={handleVideoChange} accept="video/*"/>
                                </label>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs italic">{error}</p>}

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} disabled={isSubmitting}
                                className="bg-dark-800 text-dark-100 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-dark-700 disabled:bg-dark-600">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting}
                                className="bg-secondary-600 text-dark-100 font-bold py-2 px-4 rounded-lg hover:bg-secondary-700 disabled:bg-secondary-300">
                            {isSubmitting ? 'Saving...' : 'Save Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 