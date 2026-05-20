'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthenticatedFetch } from '@/components/admin/useAuthenticatedFetch'
import AdmissionDetail from '@/components/admin/admissions/AdmissionDetail'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Admission = {
  id: string
  reference_no: string
  student_name: string
  parent_declaration_name: string
  parent_phone: string
  submitted_at: string
  status: 'pending' | 'approved' | 'rejected'
  photo_url?: string | null
}

const STATUS_STYLES: Record<Admission['status'], string> = {
  pending: 'bg-warning-500/15 text-warning-300 border-warning-500/40',
  approved: 'bg-success-500/15 text-success-300 border-success-500/40',
  rejected: 'bg-error-500/15 text-error-300 border-error-500/40',
}

export default function AdmissionsListPage() {
  const router = useRouter()
  const search = useSearchParams()
  const highlightRef = search.get('ref')
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [items, setItems] = useState<Admission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | Admission['status']>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/admissions/`)
      if (!res.ok) throw new Error('Failed to load admissions')
      const data = await res.json()
      setItems(data)
    } catch (e: any) {
      if (!(e instanceof Error) || !e.message.includes('Session expired')) {
        toast.error('Could not load admissions')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = items.filter((a) => {
    if (filter !== 'all' && a.status !== filter) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      a.student_name.toLowerCase().includes(q) ||
      a.reference_no.toLowerCase().includes(q) ||
      a.parent_phone.includes(q) ||
      a.parent_declaration_name.toLowerCase().includes(q)
    )
  })

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this admission? A student record will be created.')) return
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/admissions/${id}/approve`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error()
      toast.success('Admission approved')
      load()
    } catch {
      toast.error('Approval failed')
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Reject this admission?')) return
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/admissions/${id}/reject`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error()
      toast.success('Admission rejected')
      load()
    } catch {
      toast.error('Rejection failed')
    }
  }

  const counts = {
    all: items.length,
    pending: items.filter((a) => a.status === 'pending').length,
    approved: items.filter((a) => a.status === 'approved').length,
    rejected: items.filter((a) => a.status === 'rejected').length,
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Admissions</h1>
          <p className="text-dark-300 text-sm mt-1">
            New admission applications and approval workflow
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/admission')}
          className="btn-secondary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Admission
        </button>
      </div>

      {highlightRef && (
        <div className="mb-6 p-4 rounded-lg bg-success-500/10 border border-success-500/40 text-success-200">
          <span className="font-semibold">Reference {highlightRef}</span> was submitted
          successfully. It now appears below as <em>Pending</em>.
        </div>
      )}

      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${
                  filter === s
                    ? 'bg-secondary-500 text-white shadow'
                    : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
                }`}
              >
                {s} <span className="opacity-70 ml-1">{counts[s]}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              className="pl-9 pr-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-sm text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 w-full md:w-80"
              placeholder="Search name, reference, phone…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-dark-500 mb-3" />
          <p className="text-dark-300">No admissions found.</p>
          <button
            onClick={() => router.push('/admin/admission')}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create the first one
          </button>
        </div>
      ) : (
        <div className="table-dark overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Student</th>
                <th>Parent</th>
                <th>Phone</th>
                <th>Submitted</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className={highlightRef === a.reference_no ? 'bg-secondary-500/10' : ''}
                >
                  <td className="font-mono text-secondary-300">{a.reference_no}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      {a.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.photo_url}
                          alt={a.student_name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-xs text-dark-400">
                          {a.student_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-dark-100">{a.student_name}</span>
                    </div>
                  </td>
                  <td>{a.parent_declaration_name}</td>
                  <td className="font-mono">{a.parent_phone}</td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-xs text-dark-300">
                      <Clock className="w-3 h-3" />
                      {new Date(a.submitted_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs capitalize border ${STATUS_STYLES[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setSelectedId(a.id)}
                        className="p-2 rounded hover:bg-dark-600 text-dark-200"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {a.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(a.id)}
                            className="p-2 rounded hover:bg-success-500/20 text-success-400"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(a.id)}
                            className="p-2 rounded hover:bg-error-500/20 text-error-400"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedId && (
        <AdmissionDetail
          admissionId={selectedId}
          onClose={() => setSelectedId(null)}
          onChange={load}
        />
      )}
    </div>
  )
}
