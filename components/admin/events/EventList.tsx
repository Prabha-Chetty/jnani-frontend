import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { Event } from '@/types'

type EventListProps = {
    events: Event[];
    onEdit: (event: Event) => void;
    onDelete: (id: string) => void;
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
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
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Image 
                                    src={event.image_url || '/assets/jnani-logo.jpeg'} 
                                    alt={event.title} 
                                    width={80} 
                                    height={50}
                                    className="object-cover"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {event.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(event.event_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                <p className="truncate w-64">{event.description}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onEdit(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-900">
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