'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { User } from '@/types'
import axios from 'axios'
import UserList from '@/components/admin/settings/users/UserList'
import UserForm from '@/components/admin/settings/users/UserForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getUsers(token: string): Promise<User[]> {
    const { data } = await axios.get(`${API_URL}/admin/users/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

async function deleteUser(id: string, token: string) {
    await axios.delete(`${API_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export default function UsersPage() {
    const { getAuthToken } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = getAuthToken()
        if (token) {
            fetchUsers(token)
        } else {
            setLoading(false)
        }
    }, [getAuthToken])

    const fetchUsers = async (token: string) => {
        setLoading(true)
        try {
            const data = await getUsers(token)
            setUsers(data)
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setSelectedUser(null)
        setIsModalOpen(true)
    }

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const token = getAuthToken()
            if (token) {
                await deleteUser(id, token)
                fetchUsers(token)
            }
        }
    }

    const handleFormSuccess = () => {
        const token = getAuthToken()
        if (token) {
            fetchUsers(token)
        }
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add User
                </button>
            </div>
            
            <UserList 
                users={users} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <UserForm 
                    user={selectedUser}
                    onSuccess={handleFormSuccess}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
} 