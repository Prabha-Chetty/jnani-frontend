'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Role } from '@/types'
import axios from 'axios'
import RoleList from '@/components/admin/settings/roles/RoleList'
import RoleForm from '@/components/admin/settings/roles/RoleForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getRoles(token: string): Promise<Role[]> {
    const { data } = await axios.get(`${API_URL}/admin/roles/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

async function deleteRole(id: string, token: string) {
    await axios.delete(`${API_URL}/admin/roles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export default function RolesPage() {
    const { getAuthToken } = useAuth()
    const [roles, setRoles] = useState<Role[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = getAuthToken()
        if (token) {
            fetchRoles(token)
        } else {
            setLoading(false)
        }
    }, [getAuthToken])

    const fetchRoles = async (token: string) => {
        setLoading(true)
        try {
            const data = await getRoles(token)
            setRoles(data)
        } catch (error) {
            console.error("Failed to fetch roles", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setSelectedRole(null)
        setIsModalOpen(true)
    }

    const handleEdit = (role: Role) => {
        setSelectedRole(role)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            const token = getAuthToken()
            if (token) {
                await deleteRole(id, token)
                fetchRoles(token)
            }
        }
    }

    const handleFormSuccess = () => {
        const token = getAuthToken()
        if (token) {
            fetchRoles(token)
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Roles</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Role
                </button>
            </div>
            
            <RoleList 
                roles={roles} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />

            {isModalOpen && (
                <RoleForm 
                    role={selectedRole}
                    onSuccess={handleFormSuccess}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
} 