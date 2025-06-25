'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Class } from '@/types'
import axios from 'axios'
import ClassList from '@/components/admin/classes/ClassList'
import ClassForm from '@/components/admin/classes/ClassForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getClasses(token: string): Promise<Class[]> {
    const { data } = await axios.get(`${API_URL}/classes/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

async function deleteClass(id: string, token: string) {
    await axios.delete(`${API_URL}/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export default function ClassesPage() {
    const { getAuthToken } = useAuth()
    const [classes, setClasses] = useState<Class[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchClasses = async () => {
        const token = getAuthToken()
        if (!token) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const data = await getClasses(token)
            setClasses(data)
        } catch (error) {
            console.error("Failed to fetch classes", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClasses()
    }, [getAuthToken])


    const handleAdd = () => {
        setSelectedClass(null)
        setIsModalOpen(true)
    }

    const handleEdit = (classItem: Class) => {
        setSelectedClass(classItem)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        const token = getAuthToken()
        if (token && window.confirm('Are you sure you want to delete this class?')) {
            await deleteClass(id, token)
            fetchClasses()
        }
    }

    const handleFormSuccess = () => {
        fetchClasses()
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Classes</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Class
                </button>
            </div>
            
            <ClassList 
                classes={classes} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <ClassForm
                    classItem={selectedClass}
                    onSuccess={handleFormSuccess}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
} 