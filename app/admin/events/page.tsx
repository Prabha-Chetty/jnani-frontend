'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Event } from '@/types'
import axios from 'axios'
import EventList from '@/components/admin/events/EventList'
import EventForm from '@/components/admin/events/EventForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getEvents(token: string): Promise<Event[]> {
    const { data } = await axios.get(`${API_URL}/events/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

async function deleteEvent(id: string, token: string) {
    await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export default function EventsPage() {
    const { getAuthToken } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchEvents = async () => {
        const token = getAuthToken()
        if (!token) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const data = await getEvents(token)
            setEvents(data)
        } catch (error) {
            console.error("Failed to fetch events", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [getAuthToken])


    const handleAdd = () => {
        setSelectedEvent(null)
        setIsModalOpen(true)
    }

    const handleEdit = (event: Event) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        const token = getAuthToken()
        if (token && window.confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(id, token)
            fetchEvents()
        }
    }

    const handleFormSuccess = () => {
        fetchEvents()
        setIsModalOpen(false)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Event
                </button>
            </div>
            
            <EventList 
                events={events} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <EventForm 
                    event={selectedEvent}
                    onSuccess={handleFormSuccess}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
} 