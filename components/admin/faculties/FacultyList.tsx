import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { Faculty } from '@/types'

type FacultyListProps = {
    faculties: Faculty[];
    onEdit: (faculty: Faculty) => void;
    onDelete: (id: string) => void;
}

export default function FacultyList({ faculties, onEdit, onDelete }: FacultyListProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Photo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Qualification
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Experience
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {faculties.map((faculty) => (
                        <tr key={faculty.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Image 
                                    src={faculty.profile_image_url || '/assets/jnani-logo.jpeg'} 
                                    alt={faculty.name} 
                                    width={40} 
                                    height={40} 
                                    className="rounded-full"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {faculty.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {faculty.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {faculty.qualification}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {faculty.experience} years
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(faculty)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(faculty.id)} className="text-red-600 hover:text-red-900">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
} 