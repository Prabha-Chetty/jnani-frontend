'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Permission } from '@/types'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getPermissions(token: string): Promise<Permission[]> {
    const { data } = await axios.get(`${API_URL}/permissions/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

function PermissionList({ permissions }: { permissions: Permission[] }) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {permissions.map((permission) => (
                        <tr key={permission.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {permission.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {permission.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default function PermissionsPage() {
    const { getAuthToken } = useAuth()
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = getAuthToken()
        if (token) {
            fetchPermissions(token)
        } else {
            setLoading(false)
        }
    }, [getAuthToken])

    const fetchPermissions = async (token: string) => {
        setLoading(true)
        try {
            const data = await getPermissions(token)
            setPermissions(data)
        } catch (error) {
            console.error("Failed to fetch permissions", error)
        } finally {
            setLoading(false)
        }
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
                <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>
            </div>
            
            <PermissionList permissions={permissions} />
        </div>
    )
} 