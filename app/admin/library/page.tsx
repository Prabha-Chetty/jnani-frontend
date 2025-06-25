'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { LibraryItem } from '@/types'
import axios from 'axios'
import LibraryList from '@/components/admin/library/LibraryList'
import LibraryForm from '@/components/admin/library/LibraryForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getLibraryItems(token: string): Promise<LibraryItem[]> {
    const { data } = await axios.get(`${API_URL}/library/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

async function deleteLibraryItem(id: string, token: string) {
    await axios.delete(`${API_URL}/library/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export default function LibraryPage() {
    const { getAuthToken } = useAuth()
    const [items, setItems] = useState<LibraryItem[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchItems = async () => {
        const token = getAuthToken()
        if (!token) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const data = await getLibraryItems(token)
            console.log('Fetched library items:', data)
            console.log('First item structure:', data[0])
            setItems(data)
        } catch (error) {
            console.error("Failed to fetch library items", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [getAuthToken])


    const handleAdd = () => {
        setSelectedItem(null)
        setIsModalOpen(true)
    }

    const handleEdit = (item: LibraryItem) => {
        console.log('Editing item:', item)
        console.log('Item ID:', item.id)
        console.log('Item keys:', Object.keys(item))
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        const token = getAuthToken()
        if (token && window.confirm('Are you sure you want to delete this item?')) {
            await deleteLibraryItem(id, token)
            fetchItems()
        }
    }

    const handleFormSuccess = () => {
        fetchItems()
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Library</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Item
                </button>
            </div>
            
            <LibraryList 
                items={items} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <LibraryForm
                    item={selectedItem}
                    onSuccess={handleFormSuccess}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
} 