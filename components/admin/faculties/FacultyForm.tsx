'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { Faculty } from '../../../types'
import { useAuth } from '../AuthProvider'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type FacultyFormProps = {
    faculty: Faculty | null;
    // On create, the new faculty's id is passed so callers can auto-select it.
    onSuccess: (newId?: string) => void;
    onClose: () => void;
}

type FormData = {
    name: string;
    subject: string;
    qualification: string;
    experience: number;
    rate_per_class?: number;
    class_minutes?: number;
    profile_image?: FileList;
}

export default function FacultyForm({ faculty, onSuccess, onClose }: FacultyFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()
    const { getAuthToken } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (faculty) {
            reset({
                name: faculty.name,
                subject: faculty.subject,
                qualification: faculty.qualification,
                experience: faculty.experience,
                rate_per_class: faculty.rate_per_class ?? undefined,
                class_minutes: faculty.class_minutes ?? undefined,
            })
        } else {
            reset({
                name: '',
                subject: '',
                qualification: '',
                experience: 0,
                rate_per_class: undefined,
                class_minutes: undefined,
                profile_image: undefined
            })
        }
    }, [faculty, reset])

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        const token = getAuthToken()
        if (!token) return

        const formData = new FormData()
        
        // Create a JSON blob for the faculty data
        const facultyData = {
            name: data.name,
            subject: data.subject,
            qualification: data.qualification,
            experience: data.experience
        };
        formData.append('name', facultyData.name);
        formData.append('subject', facultyData.subject);
        formData.append('qualification', facultyData.qualification);
        formData.append('experience', facultyData.experience.toString());

        // Optional per-faculty remuneration overrides. Only send when a valid
        // positive number is entered; leaving them blank means "use the global
        // default rate" on the backend.
        if (Number.isFinite(data.rate_per_class) && (data.rate_per_class as number) > 0) {
            formData.append('rate_per_class', String(data.rate_per_class))
        }
        if (Number.isFinite(data.class_minutes) && (data.class_minutes as number) > 0) {
            formData.append('class_minutes', String(data.class_minutes))
        }

        if (data.profile_image && data.profile_image.length > 0) {
            formData.append('profile_image', data.profile_image[0])
        }

        try {
            const config = {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
            if (faculty) {
                await axios.put(`${API_URL}/admin/faculties/${faculty.id}`, formData, config)
                onSuccess()
            } else {
                const res = await axios.post(`${API_URL}/admin/faculties/`, formData, config)
                onSuccess(res?.data?.id)
            }
        } catch (error) {
            console.error('Failed to save faculty', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-900 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{faculty ? 'Edit' : 'Add'} Faculty</h2>
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
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            id="subject"
                            type="text"
                            {...register('subject', { required: 'Subject is required' })}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                        />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Qualification</label>
                        <input
                            id="qualification"
                            type="text"
                            {...register('qualification', { required: 'Qualification is required' })}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                        />
                        {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience (years)</label>
                        <input
                            id="experience"
                            type="number"
                            {...register('experience', { required: 'Experience is required', valueAsNumber: true })}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                        />
                        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="rate_per_class" className="block text-sm font-medium text-gray-700">Rate per class (₹)</label>
                            <input
                                id="rate_per_class"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Default"
                                {...register('rate_per_class', { valueAsNumber: true, min: { value: 0, message: 'Must be positive' } })}
                                className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                            />
                            {errors.rate_per_class && <p className="text-red-500 text-xs mt-1">{errors.rate_per_class.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="class_minutes" className="block text-sm font-medium text-gray-700">Class length (min)</label>
                            <input
                                id="class_minutes"
                                type="number"
                                step="1"
                                min="0"
                                placeholder="Default"
                                {...register('class_minutes', { valueAsNumber: true, min: { value: 0, message: 'Must be positive' } })}
                                className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                            />
                            {errors.class_minutes && <p className="text-red-500 text-xs mt-1">{errors.class_minutes.message}</p>}
                        </div>
                        <p className="col-span-2 -mt-2 text-xs text-dark-400">Leave blank to use the centre-wide default rate.</p>
                    </div>
                    <div>
                        <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700">Profile Image</label>
                        <input
                            id="profile_image"
                            type="file"
                            {...register('profile_image')}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
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