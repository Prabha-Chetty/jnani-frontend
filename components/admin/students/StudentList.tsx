import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { Student } from '@/types'

type StudentListProps = {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
}

export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
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
                            Class
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Parent
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Image 
                                    src={student.profile_image_url || '/assets/jnani-logo.jpeg'} 
                                    alt={student.name} 
                                    width={40} 
                                    height={40} 
                                    className="rounded-full"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.class_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.parent_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.contact_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(student)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(student.id)} className="text-red-600 hover:text-red-900">
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