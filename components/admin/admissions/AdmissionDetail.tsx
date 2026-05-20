'use client'

import { useEffect, useState } from 'react'
import { X, Printer, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthenticatedFetch } from '@/components/admin/useAuthenticatedFetch'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Admission = {
  id: string
  reference_no: string
  student_name: string
  father_name: string
  mother_name: string
  dob: string
  gender: string
  mobile_number?: string | null
  parent_phone: string
  email?: string | null
  address: string
  pincode: string
  enrolling_class?: string | null
  current_school?: string | null
  board?: string | null
  medium?: string | null
  referrer?: string | null
  opted_subjects: string[]
  first_language?: string | null
  second_language?: string | null
  parent_declaration_name: string
  parent_relation: string
  terms_agreed: boolean
  photo_url?: string | null
  student_signature_url?: string | null
  parent_signature_url?: string | null
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
}

type Props = {
  admissionId: string
  onClose: () => void
  onChange: () => void
}

const fmtSubject = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export default function AdmissionDetail({ admissionId, onClose, onChange }: Props) {
  const { authenticatedFetch } = useAuthenticatedFetch()
  const [admission, setAdmission] = useState<Admission | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authenticatedFetch(`${API_URL}/admin/admissions/${admissionId}`)
        if (!res.ok) throw new Error()
        setAdmission(await res.json())
      } catch {
        toast.error('Could not load admission')
        onClose()
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [admissionId])

  const approve = async () => {
    if (!admission) return
    setActionLoading(true)
    try {
      const res = await authenticatedFetch(
        `${API_URL}/admin/admissions/${admission.id}/approve`,
        { method: 'PATCH' }
      )
      if (!res.ok) throw new Error()
      toast.success('Admission approved')
      onChange()
      onClose()
    } catch {
      toast.error('Approval failed')
    } finally {
      setActionLoading(false)
    }
  }

  const reject = async () => {
    if (!admission) return
    if (!confirm('Reject this admission?')) return
    setActionLoading(true)
    try {
      const res = await authenticatedFetch(
        `${API_URL}/admin/admissions/${admission.id}/reject`,
        { method: 'PATCH' }
      )
      if (!res.ok) throw new Error()
      toast.success('Admission rejected')
      onChange()
      onClose()
    } catch {
      toast.error('Rejection failed')
    } finally {
      setActionLoading(false)
    }
  }

  const printForm = () => window.print()

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 print:bg-white print:p-0 print:static">
      <div className="bg-dark-800 rounded-xl shadow-2xl border border-dark-700 max-w-4xl w-full my-8 print:bg-white print:border-0 print:my-0 print:shadow-none">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-dark-800/95 backdrop-blur z-10 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-gradient-primary">Admission Details</h2>
            {admission && (
              <p className="text-xs font-mono text-secondary-300 mt-0.5">
                {admission.reference_no}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={printForm} className="btn-ghost flex items-center gap-1.5 text-sm">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={onClose} className="p-2 hover:bg-dark-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading || !admission ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary-400" />
          </div>
        ) : (
          <div className="p-6 md:p-8 print:p-8 print:text-black">
            {/* Printable replica header */}
            <div className="text-center mb-6 print:mb-8">
              <h3 className="text-2xl font-bold tracking-wide text-secondary-400 print:text-blue-900">
                JNANI STUDY CENTRE
              </h3>
              <p className="text-xs text-dark-300 print:text-gray-700 italic">
                KNOWLEDGE is more than you EXPECT which gives you RESPECT
              </p>
              <p className="text-sm font-semibold mt-1 underline">ADMISSION FORM</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2 space-y-3">
                <Field label="Student's Name" value={admission.student_name} />
                <Field label="Father's Name" value={admission.father_name} />
                <Field label="Mother's Name" value={admission.mother_name} />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Birth Date"
                    value={new Date(admission.dob).toLocaleDateString('en-IN')}
                  />
                  <Field label="Gender" value={admission.gender} />
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                {admission.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={admission.photo_url}
                    alt="Student"
                    className="w-32 h-40 object-cover border-2 border-secondary-500/50 print:border-blue-900 rounded"
                  />
                ) : (
                  <div className="w-32 h-40 border-2 border-dashed border-dark-600 print:border-blue-900 rounded flex items-center justify-center text-xs text-dark-400 text-center px-2">
                    Affix passport size photo
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <Field label="Mobile Number" value={admission.mobile_number || '—'} />
              <Field label="Parent's Phone" value={admission.parent_phone} />
              <div className="md:col-span-2">
                <Field label="Address" value={admission.address} />
              </div>
              <Field label="Pincode" value={admission.pincode} />
              <Field label="Class Enrolling For" value={admission.enrolling_class || '—'} />
              <Field label="Board" value={admission.board || '—'} />
              <Field label="Current School" value={admission.current_school || '—'} />
              <Field label="Medium" value={admission.medium || '—'} />
              <Field label="E-mail" value={admission.email || '—'} />
              <Field label="Referrer" value={admission.referrer || '—'} />
            </div>

            <div className="mb-6 space-y-2">
              <Field
                label="Opted Subjects"
                value={
                  admission.opted_subjects.length
                    ? admission.opted_subjects.map(fmtSubject).join(', ')
                    : '—'
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First Language"
                  value={admission.first_language ? fmtSubject(admission.first_language) : '—'}
                />
                <Field
                  label="Second Language"
                  value={admission.second_language ? fmtSubject(admission.second_language) : '—'}
                />
              </div>
            </div>

            <div className="border-t border-dark-700 print:border-gray-400 pt-4 mb-6">
              <p className="italic text-sm text-dark-300 print:text-gray-700 mb-3">
                I hereby agree to the present and future terms &amp; conditions of Jnani Study
                Centre.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <SignatureBlock
                  label="Date of declaration"
                  value={new Date(admission.submitted_at).toLocaleDateString('en-IN')}
                />
                <SignatureBlock label="Signature" image={admission.student_signature_url} />
              </div>
            </div>

            <div className="border-t border-dark-700 print:border-gray-400 pt-4">
              <p className="text-sm font-semibold underline mb-3">Declaration by Parents</p>
              <p className="text-sm text-dark-300 print:text-gray-800 leading-relaxed mb-4">
                I, <strong className="text-dark-100 print:text-black">{admission.parent_declaration_name}</strong> ({admission.parent_relation}) of{' '}
                <strong className="text-dark-100 print:text-black">{admission.student_name}</strong>, confirm that the above information is correct to the best of
                my knowledge and belief. I am ready to follow all the rules and regulations of the
                academy.
              </p>
              <div className="flex justify-end">
                <SignatureBlock label="Parent's signature" image={admission.parent_signature_url} />
              </div>
            </div>

            {/* Status + actions */}
            <div className="mt-6 pt-6 border-t border-dark-700 flex items-center justify-between print:hidden">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${
                  admission.status === 'approved'
                    ? 'bg-success-500/15 text-success-300 border-success-500/40'
                    : admission.status === 'rejected'
                      ? 'bg-error-500/15 text-error-300 border-error-500/40'
                      : 'bg-warning-500/15 text-warning-300 border-warning-500/40'
                }`}
              >
                {admission.status}
              </span>
              {admission.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={reject}
                    disabled={actionLoading}
                    className="btn-outline flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={approve}
                    disabled={actionLoading}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve &amp; create student
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-dark-400 print:text-gray-600 mb-0.5">
        {label}
      </p>
      <p className="text-sm text-dark-100 print:text-black capitalize border-b border-dark-700 print:border-gray-400 pb-1">
        {value}
      </p>
    </div>
  )
}

function SignatureBlock({ label, value, image }: { label: string; value?: string; image?: string | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-dark-400 print:text-gray-600 mb-1">
        {label}
      </p>
      <div className="h-16 border border-dark-700 print:border-gray-400 rounded flex items-center justify-center bg-dark-900/40 print:bg-white">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={label} className="max-h-full" />
        ) : (
          <span className="text-sm text-dark-200 print:text-black">{value || ''}</span>
        )}
      </div>
    </div>
  )
}
