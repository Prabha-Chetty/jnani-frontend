import { Pencil, Trash2, FileText } from 'lucide-react'
import { LibraryItem } from '@/types'

type LibraryListProps = {
    items: LibraryItem[];
    onEdit: (item: LibraryItem) => void;
    onDelete: (id: string) => void;
}

const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase()
}

export default function LibraryList({ items, onEdit, onDelete }: LibraryListProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            File
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
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
                    {items.map((item) => {
                        const fileExt = item.file_url ? getFileExtension(item.file_url) : ''
                        const isImage = ['jpg', 'jpeg', 'png'].includes(fileExt || '')

                        return (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.file_url ? (
                                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-600 hover:underline">
                                            {isImage ? (
                                                <img src={item.file_url} alt={item.title} className="h-10 w-10 object-cover rounded-md"/>
                                            ) : (
                                                <FileText className="w-8 h-8"/>
                                            )}
                                            <span className="truncate w-32">{item.file_url.split('/').pop()}</span>
                                        </a>
                                    ) : (
                                        <span>No file</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <p className="truncate w-64">{item.description}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
} 