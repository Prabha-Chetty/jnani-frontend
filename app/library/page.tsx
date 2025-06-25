'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Book, Download, FileText, File, Image as ImageIcon } from 'lucide-react'
import PublicNavbar from '@/components/PublicNavbar'

interface LibraryItem {
  id: string;
  title: string;
  description?: string;
  file_path: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:8000/library')
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (error) {
        console.error('Failed to fetch library items:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const getFileIcon = (filePath: string) => {
    if (!filePath) return <FileText className="w-12 h-12 text-dark-500" />;
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
      return <Image src={filePath} alt="thumbnail" width={48} height={48} className="w-12 h-12 object-cover rounded-lg" />;
    }
    switch (fileExtension) {
      case 'pdf':
        return <FileText className="w-12 h-12 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-12 h-12 text-blue-500" />;
      default:
        return <File className="w-12 h-12 text-dark-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-900 text-dark-200">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient-primary">Digital Library</h1>
          <p className="text-dark-300 mt-2">Download previous year question papers and study materials.</p>
        </div>

        {loading ? (
          <div className="text-center">Loading library...</div>
        ) : (
          <div className="bg-dark-800/50 rounded-lg shadow-lg">
            <ul className="divide-y divide-dark-700">
              {items.map((item) => (
                <li key={item.id} className="p-6 flex items-center justify-between hover:bg-dark-800 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 text-center">
                      {getFileIcon(item.file_path || '')}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-dark-100">{item.title}</h3>
                      <p className="text-dark-300">{item.description}</p>
                    </div>
                  </div>
                  <a
                    href={item.file_path || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center btn-secondary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
} 