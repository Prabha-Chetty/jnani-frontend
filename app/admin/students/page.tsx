'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Student } from '@/types'
import axios from 'axios'
import StudentList from '../../../components/admin/students/StudentList'
import StudentForm from '../../../components/admin/students/StudentForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getStudents(token: string): Promise<Student[]> {
    const { data } = await axios.get(`${API_URL}/students/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

async function deleteStudent(id: string, token: string) {
    await axios.delete(`${API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export default function StudentsPage() {
    const { getAuthToken } = useAuth()
    const [students, setStudents] = useState<Student[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchStudents = async () => {
        const token = getAuthToken()
        if (!token) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const data = await getStudents(token)
            setStudents(data)
        } catch (error) {
            console.error("Failed to fetch students", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [getAuthToken])

    const handleAdd = () => {
        setSelectedStudent(null)
        setIsModalOpen(true)
    }

    const handleEdit = (student: Student) => {
        setSelectedStudent(student)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        const token = getAuthToken()
        if (token && window.confirm('Are you sure you want to delete this student?')) {
            await deleteStudent(id, token)
            fetchStudents()
        }
    }

    const handleFormSuccess = () => {
        fetchStudents()
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Student
                </button>
            </div>
            
            <StudentList 
                students={students} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <StudentForm 
                    student={selectedStudent}
                    onSuccess={handleFormSuccess}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
} 