'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Student, Class } from '@/types'
import axios from 'axios'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type StudentFormProps = {
    student: Student | null
    onSuccess: () => void
    onClose: () => void
}

export default function StudentForm({ student, onSuccess, onClose }: StudentFormProps) {
    const { getAuthToken } = useAuth()
    const [name, setName] = useState(student?.name || '')
    const [className, setClassName] = useState(student?.class_name || '')
    const [parentName, setParentName] = useState(student?.parent_name || '')
    const [contactNumber, setContactNumber] = useState(student?.contact_number || '')
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(student?.profile_image_url || null)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [classes, setClasses] = useState<Class[]>([])
    const [loadingClasses, setLoadingClasses] = useState(true)
    const [mobileError, setMobileError] = useState<string | null>(null)

    // Fetch classes from API
    useEffect(() => {
        const fetchClasses = async () => {
            const token = getAuthToken()
            if (!token) {
                setLoadingClasses(false)
                return
            }
            
            try {
                const { data } = await axios.get(`${API_URL}/classes/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setClasses(data)
            } catch (error) {
                console.error("Failed to fetch classes", error)
            } finally {
                setLoadingClasses(false)
            }
        }

        fetchClasses()
    }, [getAuthToken])

    // Mobile number validation
    const validateMobileNumber = (value: string): boolean => {
        // Only allow digits
        if (!/^\d+$/.test(value)) {
            return false
        }
        // Must be exactly 10 digits
        if (value.length !== 10) {
            return false
        }
        return true
    }

    const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        
        // Only allow digits
        if (!/^\d*$/.test(value)) {
            return
        }
        
        // Limit to 10 digits
        if (value.length <= 10) {
            setContactNumber(value)
            
            // Clear error if valid
            if (validateMobileNumber(value)) {
                setMobileError(null)
            } else if (value.length > 0) {
                if (value.length < 10) {
                    setMobileError('Mobile number must be exactly 10 digits')
                } else {
                    setMobileError('Please enter a valid 10-digit mobile number')
                }
            } else {
                setMobileError(null)
            }
        }
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setProfileImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        
        // Validate mobile number before submission
        if (!validateMobileNumber(contactNumber)) {
            setMobileError('Please enter a valid 10-digit mobile number')
            return
        }
        
        const token = getAuthToken()
        if (!token) return

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData()
        const studentData = { name, class_name: className, parent_name: parentName, contact_number: contactNumber }
        formData.append('student_json', JSON.stringify(studentData))
        
        if (profileImage) {
            formData.append('profile_image', profileImage)
        }

        try {
            if (student) {
                await axios.put(`${API_URL}/students/${student.id}`, formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
            } else {
                await axios.post(`${API_URL}/students/`, formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
            }
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An unexpected error occurred')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-dark-900 rounded-lg shadow-xl p-8 m-4 max-w-lg w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{student ? 'Edit Student' : 'Add New Student'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="className">
                            Class
                        </label>
                        <select
                            id="className"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                            required
                            disabled={loadingClasses}
                        >
                            <option value="">{loadingClasses ? 'Loading classes...' : 'Select a class'}</option>
                            {classes.map((classItem) => (
                                <option key={classItem.id} value={classItem.name}>
                                    {classItem.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parentName">
                            Parent Name
                        </label>
                        <input
                            id="parentName"
                            type="text"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactNumber">
                            Contact Number *
                        </label>
                        <input
                            id="contactNumber"
                            type="tel"
                            value={contactNumber}
                            onChange={handleMobileChange}
                            className={`mt-1 block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm ${
                                mobileError ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                            required
                        />
                        {mobileError && (
                            <p className="text-red-500 text-xs italic mt-1">{mobileError}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Only numbers allowed, exactly 10 digits</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Profile Image
                        </label>
                        <div className="flex items-center space-x-4">
                            {preview ? (
                                <Image src={preview} alt="Preview" width={80} height={80} className="rounded-full object-cover" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">No Image</span>
                                </div>
                            )}
                            <label htmlFor="profile-image-upload" className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow-sm inline-flex items-center">
                               <Upload className="w-5 h-5 mr-2"/> 
                               <span>Upload Image</span>
                               <input id="profile-image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/jpeg,image/png,image/jpg"/>
                            </label>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg"
                            disabled={isSubmitting || !!mobileError}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 