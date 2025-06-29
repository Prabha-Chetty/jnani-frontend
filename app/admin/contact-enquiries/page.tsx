'use client'

import { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  Clock, 
  Eye, 
  CheckCircle, 
  Reply, 
  Archive, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  User,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ContactEnquiry {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'pending' | 'read' | 'replied' | 'closed'
  admin_notes?: string
  created_at: string
  updated_at: string
}

interface EnquiryStats {
  total: number
  pending: number
  read: number
  replied: number
  closed: number
}

export default function ContactEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([])
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<EnquiryStats>({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
    closed: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadEnquiries()
    loadStats()
  }, [])

  const loadEnquiries = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contact-enquiries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setEnquiries(data)
      } else {
        toast.error('Failed to load enquiries')
      }
    } catch (error) {
      console.error('Error loading enquiries:', error)
      toast.error('Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contact-enquiries/stats/counts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const updateEnquiryStatus = async (enquiryId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contact-enquiries/${enquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        },
        body: JSON.stringify({ status, admin_notes: notes })
      })

      if (response.ok) {
        toast.success('Enquiry status updated successfully')
        loadEnquiries()
        loadStats()
        if (selectedEnquiry?.id === enquiryId) {
          setSelectedEnquiry(prev => prev ? { ...prev, status: status as 'pending' | 'read' | 'replied' | 'closed', admin_notes: notes } : null)
        }
      } else {
        toast.error('Failed to update enquiry status')
      }
    } catch (error) {
      console.error('Error updating enquiry:', error)
      toast.error('Failed to update enquiry status')
    }
  }

  const deleteEnquiry = async (enquiryId: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contact-enquiries/${enquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAuthToken')}`
        }
      })

      if (response.ok) {
        toast.success('Enquiry deleted successfully')
        setEnquiries(prev => prev.filter(e => e.id !== enquiryId))
        loadStats()
        if (selectedEnquiry?.id === enquiryId) {
          setSelectedEnquiry(null)
        }
      } else {
        toast.error('Failed to delete enquiry')
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      toast.error('Failed to delete enquiry')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-warning-500" />
      case 'read': return <Eye className="w-4 h-4 text-info-500" />
      case 'replied': return <Reply className="w-4 h-4 text-success-500" />
      case 'closed': return <Archive className="w-4 h-4 text-dark-400" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-500/20 text-warning-400'
      case 'read': return 'bg-info-500/20 text-info-400'
      case 'replied': return 'bg-success-500/20 text-success-400'
      case 'closed': return 'bg-dark-500/20 text-dark-400'
      default: return 'bg-dark-500/20 text-dark-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-secondary-500" />
          <span className="text-dark-200">Loading enquiries...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-50 mb-2">Contact Enquiries</h1>
            <p className="text-dark-300">Manage and respond to contact form submissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Total</p>
                  <p className="text-2xl font-bold text-dark-50">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Pending</p>
                  <p className="text-2xl font-bold text-dark-50">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-info-500 to-info-600 text-white shadow-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Read</p>
                  <p className="text-2xl font-bold text-dark-50">{stats.read}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-success-500 to-success-600 text-white shadow-lg">
                  <Reply className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Replied</p>
                  <p className="text-2xl font-bold text-dark-50">{stats.replied}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-dark-800 border-dark-700">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-dark-500 to-dark-600 text-white shadow-lg">
                  <Archive className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-dark-300">Closed</p>
                  <p className="text-2xl font-bold text-dark-50">{stats.closed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card bg-dark-800 border-dark-700 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Search enquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </button>
              </div>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="flex flex-wrap gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enquiries List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enquiries List */}
          <div className="lg:col-span-1">
            <div className="card bg-dark-800 border-dark-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dark-100 mb-4">Enquiries ({filteredEnquiries.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredEnquiries.length === 0 ? (
                    <p className="text-dark-400 text-center py-8">No enquiries found</p>
                  ) : (
                    filteredEnquiries.map((enquiry) => (
                      <div
                        key={enquiry.id}
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedEnquiry?.id === enquiry.id
                            ? 'bg-secondary-500/20 border border-secondary-500/30'
                            : 'bg-dark-700 hover:bg-dark-600'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-dark-100 truncate">{enquiry.name}</h4>
                            <p className="text-xs text-dark-400 truncate">{enquiry.email}</p>
                            <p className="text-xs text-dark-400 mt-1">{formatDate(enquiry.created_at)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(enquiry.status)}
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(enquiry.status)}`}>
                              {enquiry.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-dark-300 mt-2 line-clamp-2">{enquiry.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Detail */}
          <div className="lg:col-span-2">
            {selectedEnquiry ? (
              <div className="card bg-dark-800 border-dark-700">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-dark-100">Enquiry Details</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedEnquiry.status)}
                      <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedEnquiry.status)}`}>
                        {selectedEnquiry.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-dark-300">Name</p>
                          <p className="text-dark-100 font-medium">{selectedEnquiry.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-dark-300">Email</p>
                          <p className="text-dark-100 font-medium">{selectedEnquiry.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-dark-300">Phone</p>
                          <p className="text-dark-100 font-medium">{selectedEnquiry.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-secondary-400" />
                        <div>
                          <p className="text-sm text-dark-300">Submitted</p>
                          <p className="text-dark-100 font-medium">{formatDate(selectedEnquiry.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <h4 className="text-lg font-medium text-dark-100 mb-3">Message</h4>
                      <div className="bg-dark-700 p-4 rounded-lg">
                        <p className="text-dark-200 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <h4 className="text-lg font-medium text-dark-100 mb-3">Admin Notes</h4>
                      <textarea
                        placeholder="Add notes about this enquiry..."
                        defaultValue={selectedEnquiry.admin_notes || ''}
                        onChange={(e) => {
                          const notes = e.target.value
                          updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, notes)
                        }}
                        className="input-field w-full min-h-[100px] resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-dark-700">
                      <button
                        onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'read')}
                        disabled={selectedEnquiry.status === 'read'}
                        className="btn-secondary flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Mark as Read
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'replied')}
                        disabled={selectedEnquiry.status === 'replied'}
                        className="btn-secondary flex items-center"
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Mark as Replied
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'closed')}
                        disabled={selectedEnquiry.status === 'closed'}
                        className="btn-secondary flex items-center"
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Close
                      </button>
                      <button
                        onClick={() => deleteEnquiry(selectedEnquiry.id)}
                        className="btn-danger flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card bg-dark-800 border-dark-700">
                <div className="p-6 text-center">
                  <MessageCircle className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-200 mb-2">Select an Enquiry</h3>
                  <p className="text-dark-400">Choose an enquiry from the list to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 