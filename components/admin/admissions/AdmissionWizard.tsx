'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Check,
  Trash2,
  User,
  Phone,
  MapPin,
  School,
  BookOpen,
  PenLine,
  FileCheck2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/admin/AuthProvider'
import SignaturePad, { SignaturePadHandle } from './SignaturePad'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const DRAFT_KEY = 'jnani.admission.draft.v1'

type FormState = {
  student_name: string
  father_name: string
  mother_name: string
  dob: string
  gender: '' | 'male' | 'female'
  mobile_number: string
  parent_phone: string
  email: string
  address: string
  pincode: string
  enrolling_class: string
  current_school: string
  board: string
  medium: string
  referrer: string
  opted_subjects: string[]
  first_language: '' | 'kannada' | 'english'
  second_language: '' | 'kannada' | 'english'
  parent_declaration_name: string
  parent_relation: '' | 'father' | 'mother' | 'guardian'
  terms_agreed: boolean
}

const blank: FormState = {
  student_name: '',
  father_name: '',
  mother_name: '',
  dob: '',
  gender: '',
  mobile_number: '',
  parent_phone: '',
  email: '',
  address: '',
  pincode: '',
  enrolling_class: '',
  current_school: '',
  board: '',
  medium: '',
  referrer: '',
  opted_subjects: [],
  first_language: '',
  second_language: '',
  parent_declaration_name: '',
  parent_relation: '',
  terms_agreed: false,
}

const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9',
  'SSLC', '1st PUC', '2nd PUC',
]

const SUBJECTS = [
  { value: 'kannada', label: 'Kannada' },
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'social_science', label: 'Social Science' },
]

const STEPS = [
  { title: 'Student details', icon: User },
  { title: 'Parents & contact', icon: Phone },
  { title: 'Address', icon: MapPin },
  { title: 'School background', icon: School },
  { title: 'Subjects & languages', icon: BookOpen },
  { title: 'Student photo', icon: Camera },
  { title: 'Terms & signatures', icon: PenLine },
]

export default function AdmissionWizard() {
  const router = useRouter()
  const { getAuthToken } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(blank)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const studentSigRef = useRef<SignaturePadHandle>(null)
  const parentSigRef = useRef<SignaturePadHandle>(null)

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setForm({ ...blank, ...parsed })
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Persist draft on every form change (photo + signatures intentionally not persisted)
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    } catch {
      /* ignore */
    }
  }, [form])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleSubject = (subject: string) => {
    setForm((f) => ({
      ...f,
      opted_subjects: f.opted_subjects.includes(subject)
        ? f.opted_subjects.filter((s) => s !== subject)
        : [...f.opted_subjects, subject],
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const validateStep = (): string | null => {
    switch (step) {
      case 0:
        if (!form.student_name.trim()) return 'Please enter the student\'s name'
        if (!form.dob) return 'Please enter date of birth'
        if (!form.gender) return 'Please select gender'
        return null
      case 1:
        if (!form.father_name.trim()) return 'Please enter father\'s name'
        if (!form.mother_name.trim()) return 'Please enter mother\'s name'
        if (!/^\d{10}$/.test(form.parent_phone)) return 'Parent phone must be 10 digits'
        if (form.mobile_number && !/^\d{10}$/.test(form.mobile_number))
          return 'Mobile number must be 10 digits'
        return null
      case 2:
        if (!form.address.trim()) return 'Please enter the address'
        if (!/^\d{6}$/.test(form.pincode)) return 'Pincode must be 6 digits'
        return null
      case 3:
        if (!form.enrolling_class) return 'Please select the class the student is enrolling for'
        return null
      case 6:
        if (!form.parent_declaration_name.trim()) return 'Please enter parent name for declaration'
        if (!form.parent_relation) return 'Please select Father / Mother / Guardian'
        if (!form.terms_agreed) return 'Please tick the terms agreement'
        if (studentSigRef.current?.isEmpty()) return 'Student signature is required'
        if (parentSigRef.current?.isEmpty()) return 'Parent signature is required'
        return null
      default:
        return null
    }
  }

  const next = () => {
    const err = validateStep()
    if (err) {
      toast.error(err)
      return
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  const prev = () => setStep((s) => Math.max(0, s - 1))

  const submit = async () => {
    const err = validateStep()
    if (err) {
      toast.error(err)
      return
    }
    const token = getAuthToken()
    if (!token) {
      toast.error('Not signed in')
      return
    }

    setSubmitting(true)
    try {
      const payload: any = { ...form }
      // Convert empty optional fields to nulls to satisfy backend types
      if (!payload.email) delete payload.email
      if (!payload.mobile_number) delete payload.mobile_number
      if (!payload.current_school) delete payload.current_school
      if (!payload.board) delete payload.board
      if (!payload.medium) delete payload.medium
      if (!payload.referrer) delete payload.referrer
      if (!payload.first_language) delete payload.first_language
      if (!payload.second_language) delete payload.second_language

      const fd = new FormData()
      fd.append('admission_json', JSON.stringify(payload))
      if (photo) fd.append('photo', photo)
      const studentSig = studentSigRef.current?.toDataURL()
      const parentSig = parentSigRef.current?.toDataURL()
      if (studentSig) fd.append('student_signature', studentSig)
      if (parentSig) fd.append('parent_signature', parentSig)

      const res = await fetch(`${API_URL}/admin/admissions/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Submission failed')
      }
      const data = await res.json()
      localStorage.removeItem(DRAFT_KEY)
      toast.success(`Admission submitted! Reference: ${data.reference_no}`)
      router.push(`/admin/admissions?ref=${encodeURIComponent(data.reference_no)}`)
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const clearDraft = () => {
    if (!confirm('Clear all entered information and start over?')) return
    localStorage.removeItem(DRAFT_KEY)
    setForm(blank)
    setPhoto(null)
    setPhotoPreview(null)
    setStep(0)
  }

  const inputCls =
    'w-full px-4 py-3 bg-dark-900 text-dark-50 placeholder-dark-400 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-base'
  const labelCls = 'block text-sm font-semibold text-dark-100 mb-2'

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">New Admission</h1>
            <p className="text-sm text-dark-300 mt-1">
              Step {step + 1} of {STEPS.length} — {STEPS[step].title}
            </p>
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="btn-ghost text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= step ? 'bg-secondary-500' : 'bg-dark-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="card p-6 md:p-8 mb-6">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Student&apos;s full name *</label>
              <input
                className={inputCls}
                value={form.student_name}
                onChange={(e) => update('student_name', e.target.value)}
                placeholder="Enter the student's full name"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Date of birth *</label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.dob}
                  onChange={(e) => update('dob', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Gender *</label>
                <div className="flex gap-3">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => update('gender', g)}
                      className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition ${
                        form.gender === g
                          ? 'border-secondary-500 bg-secondary-500/10 text-secondary-300'
                          : 'border-dark-600 text-dark-200 hover:border-dark-500'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Father&apos;s name *</label>
                <input
                  className={inputCls}
                  value={form.father_name}
                  onChange={(e) => update('father_name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Mother&apos;s name *</label>
                <input
                  className={inputCls}
                  value={form.mother_name}
                  onChange={(e) => update('mother_name', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Parent&apos;s phone number *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className={inputCls}
                  value={form.parent_phone}
                  onChange={(e) =>
                    update('parent_phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="10-digit number"
                />
              </div>
              <div>
                <label className={labelCls}>Student&apos;s mobile (optional)</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className={inputCls}
                  value={form.mobile_number}
                  onChange={(e) =>
                    update('mobile_number', e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="10-digit number"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email (optional)</label>
              <input
                type="email"
                className={inputCls}
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="parent@example.com"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Address *</label>
              <textarea
                className={inputCls}
                rows={4}
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="House no, street, area, city"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Pincode *</label>
                <input
                  inputMode="numeric"
                  maxLength={6}
                  className={inputCls}
                  value={form.pincode}
                  onChange={(e) =>
                    update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="6-digit pincode"
                />
              </div>
              <div>
                <label className={labelCls}>Referred by</label>
                <input
                  className={inputCls}
                  value={form.referrer}
                  onChange={(e) => update('referrer', e.target.value)}
                  placeholder="Name of referrer (optional)"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Class enrolling for *</label>
              <select
                className={inputCls}
                value={form.enrolling_class}
                onChange={(e) => update('enrolling_class', e.target.value)}
                autoFocus
              >
                <option value="">Select the class</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Current school</label>
              <input
                className={inputCls}
                value={form.current_school}
                onChange={(e) => update('current_school', e.target.value)}
                placeholder="School name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Board</label>
                <select
                  className={inputCls}
                  value={form.board}
                  onChange={(e) => update('board', e.target.value)}
                >
                  <option value="">Select board</option>
                  <option value="State">State</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Medium</label>
                <select
                  className={inputCls}
                  value={form.medium}
                  onChange={(e) => update('medium', e.target.value)}
                >
                  <option value="">Select medium</option>
                  <option value="English">English</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Opted subjects (tap to select)</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => {
                  const active = form.opted_subjects.includes(s.value)
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleSubject(s.value)}
                      className={`px-4 py-2 rounded-full border-2 font-medium transition ${
                        active
                          ? 'border-secondary-500 bg-secondary-500/10 text-secondary-300'
                          : 'border-dark-600 text-dark-200 hover:border-dark-500'
                      }`}
                    >
                      {active && <Check className="inline w-4 h-4 mr-1.5 -mt-0.5" />}
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>First language</label>
                <div className="flex gap-3">
                  {(['kannada', 'english'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => update('first_language', l)}
                      className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition ${
                        form.first_language === l
                          ? 'border-secondary-500 bg-secondary-500/10 text-secondary-300'
                          : 'border-dark-600 text-dark-200 hover:border-dark-500'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Second language</label>
                <div className="flex gap-3">
                  {(['kannada', 'english'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => update('second_language', l)}
                      className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition ${
                        form.second_language === l
                          ? 'border-secondary-500 bg-secondary-500/10 text-secondary-300'
                          : 'border-dark-600 text-dark-200 hover:border-dark-500'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <label className={labelCls}>Student passport-size photo</label>
            <div className="flex flex-col items-center gap-4 p-6 rounded-lg border-2 border-dashed border-dark-600 bg-dark-900/50">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Student photo preview"
                  width={140}
                  height={180}
                  className="rounded-lg object-cover border-2 border-secondary-500/40 shadow-lg"
                  style={{ width: 140, height: 180 }}
                />
              ) : (
                <div className="w-[140px] h-[180px] rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-400">
                  <Camera className="w-10 h-10" />
                </div>
              )}
              <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {photoPreview ? 'Retake photo' : 'Take or upload photo'}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
              <p className="text-xs text-dark-400 text-center">
                Use the centre&apos;s tablet to capture the photo, or upload an existing one.
              </p>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div className="rounded-lg bg-dark-900/60 border border-dark-700 p-4 text-sm text-dark-200 leading-relaxed">
              <p className="font-semibold text-dark-100 mb-2">Terms &amp; conditions</p>
              <p className="mb-2 font-medium text-dark-100">Do&apos;s</p>
              <ul className="list-disc list-inside space-y-1 mb-3 text-dark-300">
                <li>Arrive on time</li>
                <li>Wear appropriate attire</li>
                <li>Maintain peaceful relations with peers</li>
                <li>Listen attentively to the tutor and take notes</li>
                <li>Raise your hand for doubts</li>
                <li>Maintain discipline inside the academy</li>
                <li>Compulsory attendance for unit tests and exams</li>
              </ul>
              <p className="mb-2 font-medium text-dark-100">Don&apos;ts</p>
              <ul className="list-disc list-inside space-y-1 text-dark-300">
                <li>Bullying others</li>
                <li>Missing a session without prior notice</li>
                <li>Physical or verbal aggression</li>
                <li>Electronic gadgets inside the academy</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Parent / Guardian name *</label>
                <input
                  className={inputCls}
                  value={form.parent_declaration_name}
                  onChange={(e) => update('parent_declaration_name', e.target.value)}
                  placeholder="Mr. / Mrs. ___"
                />
              </div>
              <div>
                <label className={labelCls}>Relation *</label>
                <div className="flex gap-2">
                  {(['father', 'mother', 'guardian'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => update('parent_relation', r)}
                      className={`flex-1 py-3 rounded-lg border-2 capitalize text-sm font-medium transition ${
                        form.parent_relation === r
                          ? 'border-secondary-500 bg-secondary-500/10 text-secondary-300'
                          : 'border-dark-600 text-dark-200 hover:border-dark-500'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-lg bg-dark-900/60 border border-dark-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.terms_agreed}
                onChange={(e) => update('terms_agreed', e.target.checked)}
                className="mt-1 w-5 h-5 accent-secondary-500"
              />
              <span className="text-sm text-dark-200 leading-relaxed">
                I confirm that the above information is correct to the best of my knowledge and I
                agree to the present and future terms &amp; conditions of Jnani Study Centre.
              </span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SignaturePad ref={studentSigRef} label="Student's signature *" hint="Sign with finger or stylus" />
              <SignaturePad ref={parentSigRef} label="Parent's signature *" hint="Sign with finger or stylus" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0 || submitting}
          className="btn-outline flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary flex items-center gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              'Submitting…'
            ) : (
              <>
                <FileCheck2 className="w-4 h-4" /> Submit admission
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
