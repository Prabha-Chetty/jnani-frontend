'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../../../components/admin/AuthProvider'
import FacultyForm from '../../../components/admin/faculties/FacultyForm'
import FacultyList from '../../../components/admin/faculties/FacultyList'
import { Faculty } from '../../../types'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getFaculties(token: string): Promise<Faculty[]> {
    const { data } = await axios.get(`${API_URL}/admin/faculties/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
}

async function deleteFaculty(id: string, token: string): Promise<void> {
    await axios.delete(`${API_URL}/admin/faculties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export default function FacultiesPage() {
    const { getAuthToken } = useAuth()
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchFaculties = async () => {
        const token = getAuthToken();
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await getFaculties(token);
            setFaculties(data);
        } catch (error) {
            console.error("Failed to fetch faculties", error);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchFaculties();
    }, [getAuthToken])

    const handleAdd = () => {
        setSelectedFaculty(null)
        setIsModalOpen(true)
    }

    const handleEdit = (faculty: Faculty) => {
        setSelectedFaculty(faculty)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        const token = getAuthToken();
        if (token && window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                await deleteFaculty(id, token);
                fetchFaculties();
            } catch (error) {
                console.error("Failed to delete faculty", error);
            }
        }
    }

    const handleFormSuccess = () => {
        fetchFaculties()
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Faculties</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Faculty
                </button>
            </div>
            
            <FacultyList 
                faculties={faculties} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <FacultyForm 
                    faculty={selectedFaculty}
                    onSuccess={handleFormSuccess}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
} 