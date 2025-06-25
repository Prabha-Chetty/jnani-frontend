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
    onSuccess: () => void;
    onClose: () => void;
}

type FormData = {
    name: string;
    subject: string;
    qualification: string;
    experience: number;
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
            })
        } else {
            reset({
                name: '',
                subject: '',
                qualification: '',
                experience: 0,
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
            } else {
                await axios.post(`${API_URL}/admin/faculties/`, formData, config)
            }
            onSuccess()
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