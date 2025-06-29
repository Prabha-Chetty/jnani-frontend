'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { useAuthenticatedFetch } from '@/components/admin/useAuthenticatedFetch'
import { Student } from '@/types'
import StudentList from '../../../components/admin/students/StudentList'
import StudentForm from '../../../components/admin/students/StudentForm'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function StudentsPage() {
    const { authenticatedFetch } = useAuthenticatedFetch()
    const [students, setStudents] = useState<Student[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const response = await authenticatedFetch(`${API_URL}/students/`)
            if (response.ok) {
                const data = await response.json()
                setStudents(data)
            } else {
                toast.error('Failed to fetch students')
            }
        } catch (error) {
            console.error("Failed to fetch students", error)
            if (error instanceof Error && error.message.includes('Session expired')) {
                // Auto logout will be handled by the fetch hook
                return
            }
            toast.error('Failed to fetch students')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleAdd = () => {
        setSelectedStudent(null)
        setIsModalOpen(true)
    }

    const handleEdit = (student: Student) => {
        setSelectedStudent(student)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await authenticatedFetch(`${API_URL}/students/${id}`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    toast.success('Student deleted successfully')
                    fetchStudents()
                } else {
                    toast.error('Failed to delete student')
                }
            } catch (error) {
                console.error("Failed to delete student", error)
                if (error instanceof Error && error.message.includes('Session expired')) {
                    // Auto logout will be handled by the fetch hook
                    return
                }
                toast.error('Failed to delete student')
            }
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