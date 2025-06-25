import { Pencil, Trash2 } from 'lucide-react'
import { Class } from '@/types'

type ClassListProps = {
    classes: Class[];
    onEdit: (classItem: Class) => void;
    onDelete: (id: string) => void;
}

export default function ClassList({ classes, onEdit, onDelete }: ClassListProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Class Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {classes.map((classItem) => (
                        <tr key={classItem.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {classItem.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {classItem.description || 'No description'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(classItem)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(classItem.id)} className="text-red-600 hover:text-red-900">
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