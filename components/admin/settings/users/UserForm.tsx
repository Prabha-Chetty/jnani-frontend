'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { User, Role } from '@/types'
import { useAuth } from '@/components/admin/AuthProvider'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type UserFormProps = {
    user: User | null;
    onSuccess: () => void;
    onClose: () => void;
}

type FormData = {
    name: string;
    email: string;
    password?: string;
    is_active: boolean;
    roles: string[];
}

async function getRoles(token: string): Promise<Role[]> {
    const { data } = await axios.get(`${API_URL}/roles/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data
}

export default function UserForm({ user, onSuccess, onClose }: UserFormProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>()
    const { getAuthToken } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [roles, setRoles] = useState<Role[]>([])

    useEffect(() => {
        const token = getAuthToken()
        if (token) {
            getRoles(token).then(setRoles)
        }
    }, [getAuthToken])
    
    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                is_active: user.is_active,
                roles: user.roles,
            })
        } else {
            reset({ name: '', email: '', password: '', is_active: true, roles: [] })
        }
    }, [user, reset])

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        const token = getAuthToken()
        if (!token) {
            setIsLoading(false)
            return
        }

        // Don't submit password if it's empty (for updates)
        const payload: any = { ...data }
        if (user && !payload.password) {
            delete payload.password
        }

        try {
            if (user) {
                await axios.put(`${API_URL}/admin/users/${user.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } else {
                await axios.post(`${API_URL}/admin/users/`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
            onSuccess()
        } catch (error) {
            console.error('Failed to save user', error)
        } finally {
            setIsLoading(false)
        }
    }

    const selectedRoles = watch('roles') || []

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-900 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{user ? 'Edit' : 'Add'} User</h2>
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: !user })}
                            placeholder={user ? 'Leave blank to keep current password' : ''}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Roles</label>
                        <div className="mt-2 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                            {roles.map(r => (
                                <label key={r.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={r.name}
                                        checked={selectedRoles.includes(r.name)}
                                        onChange={e => {
                                            const newRoles = e.target.checked
                                                ? [...selectedRoles, r.name]
                                                : selectedRoles.filter(name => name !== r.name)
                                            setValue('roles', newRoles)
                                        }}
                                        className="rounded text-primary-600 focus:ring-primary-500"
                                    />
                                    <span>{r.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="is_active"
                            type="checkbox"
                            {...register('is_active')}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
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