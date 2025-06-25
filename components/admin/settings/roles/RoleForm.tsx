'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { Role, Permission } from '@/types'
import { useAuth } from '@/components/admin/AuthProvider'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type RoleFormProps = {
    role: Role | null;
    onSuccess: () => void;
    onClose: () => void;
}

type FormData = {
    name: string;
    description: string;
    permissions: string[];
}

async function getPermissions(token: string): Promise<Permission[]> {
    const { data } = await axios.get(`${API_URL}/permissions/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

export default function RoleForm({ role, onSuccess, onClose }: RoleFormProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>()
    const { getAuthToken } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [permissions, setPermissions] = useState<Permission[]>([])

    useEffect(() => {
        const token = getAuthToken()
        if (token) {
            getPermissions(token).then(setPermissions)
        }
    }, [getAuthToken])
    
    useEffect(() => {
        if (role) {
            reset({
                name: role.name,
                description: role.description,
                permissions: role.permissions,
            })
        } else {
            reset({ name: '', description: '', permissions: [] })
        }
    }, [role, reset])

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        const token = getAuthToken()
        if (!token) {
            setIsLoading(false)
            return
        }

        try {
            if (role) {
                await axios.put(`${API_URL}/roles/${role.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } else {
                await axios.post(`${API_URL}/roles/`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
            onSuccess()
        } catch (error) {
            console.error('Failed to save role', error)
        } finally {
            setIsLoading(false)
        }
    }

    const selectedPermissions = watch('permissions') || []

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-900 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{role ? 'Edit' : 'Add'} Role</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: 'Name is required' })}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            id="description"
                            type="text"
                            {...register('description')}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Permissions</label>
                        <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-2">
                            {permissions.map(p => (
                                <label key={p.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={p.id}
                                        checked={selectedPermissions.includes(p.id)}
                                        onChange={e => {
                                            const newPermissions = e.target.checked
                                                ? [...selectedPermissions, p.id]
                                                : selectedPermissions.filter(id => id !== p.id)
                                            setValue('permissions', newPermissions)
                                        }}
                                        className="rounded text-primary-600 focus:ring-primary-500"
                                    />
                                    <span>{p.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 