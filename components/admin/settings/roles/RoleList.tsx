import { Pencil, Trash2 } from 'lucide-react'
import { Role } from '@/types'

type RoleListProps = {
    roles: Role[];
    onEdit: (role: Role) => void;
    onDelete: (id: string) => void;
}

export default function RoleList({ roles, onEdit, onDelete }: RoleListProps) {
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
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {roles.map((role) => (
                        <tr key={role.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {role.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {role.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(role)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(role.id)} className="text-red-600 hover:text-red-900">
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