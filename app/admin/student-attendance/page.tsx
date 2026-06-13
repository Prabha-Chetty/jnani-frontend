'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Download, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Student, StudentAttendance } from '@/types'
import { MONTHS, todayISO, prettyDate, weekdayName } from '@/components/admin/attendance/dateUtils'
import { exportStudentAttendanceCSV } from '@/components/admin/student-attendance/exportUtils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Status = 'present' | 'absent'

export default function StudentAttendancePage() {
  const { getAuthToken } = useAuth()

  const [students, setStudents] = useState<Student[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [date, setDate] = useState<string>(todayISO())
  const [statuses, setStatuses] = useState<Record<string, Status>>({})
  const [loading, setLoading] = useState(true)
  const [loadingRoster, setLoadingRoster] = useState(false)
  const [saving, setSaving] = useState(false)

  const now = new Date()
  const [csvYear, setCsvYear] = useState(now.getFullYear())
  const [csvMonth, setCsvMonth] = useState(now.getMonth() + 1)
  const [exporting, setExporting] = useState(false)

  const authHeader = () => ({ Authorization: `Bearer ${getAuthToken()}` })

  // Load students once (normalise _id -> id; backend serializes via alias).
  useEffect(() => {
    const token = getAuthToken()
    if (!token) return
    axios
      .get(`${API_URL}/students/`, { headers: authHeader() })
      .then(({ data }) => {
        const list = (data as any[]).map((s) => ({ ...s, id: s.id ?? s._id }))
        setStudents(list)
      })
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAuthToken])

  // Load the saved roster whenever the marking date changes.
  const fetchRoster = useCallback(async () => {
    const token = getAuthToken()
    if (!token) return
    setLoadingRoster(true)
    try {
      const { data } = await axios.get(`${API_URL}/admin/student-attendance/`, {
        params: { date },
        headers: authHeader(),
      })
      const map: Record<string, Status> = {}
      ;(data as StudentAttendance[]).forEach((r) => {
        map[r.student_id] = r.status
      })
      setStatuses(map)
    } catch {
      toast.error('Failed to load attendance for this date')
    } finally {
      setLoadingRoster(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAuthToken, date])

  useEffect(() => {
    fetchRoster()
  }, [fetchRoster])

  const classes = useMemo(
    () =>
      Array.from(new Set(students.map((s) => s.class_name).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [students],
  )

  const visibleStudents = useMemo(() => {
    const list = selectedClass
      ? students.filter((s) => s.class_name === selectedClass)
      : students
    return [...list].sort((a, b) => {
      const c = (a.class_name || '').localeCompare(b.class_name || '')
      return c !== 0 ? c : (a.name || '').localeCompare(b.name || '')
    })
  }, [students, selectedClass])

  const setStatus = (studentId: string, status: Status) =>
    setStatuses((prev) => ({ ...prev, [studentId]: status }))

  const bulkSet = (status: Status) =>
    setStatuses((prev) => {
      const next = { ...prev }
      visibleStudents.forEach((s) => {
        next[s.id] = status
      })
      return next
    })

  // Counts for the currently visible roster.
  const counts = useMemo(() => {
    let present = 0
    let absent = 0
    visibleStudents.forEach((s) => {
      if (statuses[s.id] === 'present') present += 1
      else if (statuses[s.id] === 'absent') absent += 1
    })
    return { present, absent, unmarked: visibleStudents.length - present - absent }
  }, [visibleStudents, statuses])

  const handleSave = async () => {
    const token = getAuthToken()
    if (!token) return
    // Persist every marked student across all classes (not just the filter).
    const entries = Object.entries(statuses)
      .filter(([, v]) => v === 'present' || v === 'absent')
      .map(([student_id, status]) => ({ student_id, status }))

    if (!entries.length) {
      toast.error('Mark at least one student before saving.')
      return
    }
    setSaving(true)
    try {
      await axios.post(
        `${API_URL}/admin/student-attendance/`,
        { date, entries },
        { headers: authHeader() },
      )
      toast.success(`Attendance saved (${entries.length} student${entries.length === 1 ? '' : 's'})`)
      fetchRoster()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const csvPrev = () => {
    if (csvMonth === 1) { setCsvMonth(12); setCsvYear((y) => y - 1) }
    else setCsvMonth((m) => m - 1)
  }
  const csvNext = () => {
    if (csvMonth === 12) { setCsvMonth(1); setCsvYear((y) => y + 1) }
    else setCsvMonth((m) => m + 1)
  }

  const handleExport = async () => {
    const token = getAuthToken()
    if (!token) return
    setExporting(true)
    try {
      const { data } = await axios.get(`${API_URL}/admin/student-attendance/`, {
        params: { month: csvMonth, year: csvYear },
        headers: authHeader(),
      })
      const exportStudents = selectedClass
        ? students.filter((s) => s.class_name === selectedClass)
        : students
      const classTag = selectedClass ? `-${selectedClass}` : ''
      exportStudentAttendanceCSV(
        exportStudents,
        data as StudentAttendance[],
        csvYear,
        csvMonth,
        `student-attendance${classTag}-${csvYear}-${String(csvMonth).padStart(2, '0')}.csv`,
      )
    } catch {
      toast.error('Failed to export attendance')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-dark-50 mb-6">Student Attendance</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">Date</label>
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 bg-dark-900 text-dark-100 border border-dark-700 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-dark-900 text-dark-100 border border-dark-700 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 min-w-[160px]"
          >
            <option value="">All classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-dark-400 mb-3">
        Marking <span className="text-dark-200 font-medium">{weekdayName(date)}, {prettyDate(date)}</span>.
        Mark each student Present or Absent, then Save. One record per student per day.
      </p>

      {/* Roster */}
      <div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-dark-700">
          <div className="text-sm text-dark-300">
            <span className="text-green-400 font-medium">{counts.present} present</span>
            {' · '}
            <span className="text-red-400 font-medium">{counts.absent} absent</span>
            {' · '}
            <span className="text-dark-400">{counts.unmarked} unmarked</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => bulkSet('present')}
              className="text-xs font-medium text-green-300 hover:text-green-200 border border-green-800 rounded px-2 py-1"
            >
              All present
            </button>
            <button
              onClick={() => bulkSet('absent')}
              className="text-xs font-medium text-red-300 hover:text-red-200 border border-red-800 rounded px-2 py-1"
            >
              All absent
            </button>
          </div>
        </div>

        {loadingRoster ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-500" />
          </div>
        ) : visibleStudents.length === 0 ? (
          <div className="py-10 text-center text-dark-500">No students found.</div>
        ) : (
          <ul className="divide-y divide-dark-800">
            {visibleStudents.map((s) => {
              const status = statuses[s.id]
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-dark-100 font-medium truncate">{s.name}</p>
                    <p className="text-xs text-dark-400 truncate">{s.class_name}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setStatus(s.id, 'present')}
                      className={[
                        'flex items-center gap-1 text-sm font-medium py-1.5 px-3 rounded-md border transition-colors',
                        status === 'present'
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-dark-800 border-dark-700 text-dark-300 hover:bg-dark-700',
                      ].join(' ')}
                    >
                      <Check className="w-4 h-4" /> Present
                    </button>
                    <button
                      onClick={() => setStatus(s.id, 'absent')}
                      className={[
                        'flex items-center gap-1 text-sm font-medium py-1.5 px-3 rounded-md border transition-colors',
                        status === 'absent'
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-dark-800 border-dark-700 text-dark-300 hover:bg-dark-700',
                      ].join(' ')}
                    >
                      <X className="w-4 h-4" /> Absent
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="flex justify-end mb-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save attendance'}
        </button>
      </div>

      {/* CSV export */}
      <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 max-w-xl">
        <h2 className="text-lg font-semibold text-dark-100 mb-1">Download CSV</h2>
        <p className="text-sm text-dark-400 mb-3">
          Monthly attendance matrix (P / A per day, with totals)
          {selectedClass ? <> for class <span className="text-dark-200">{selectedClass}</span></> : ' for all classes'}.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={csvPrev} className="p-2 rounded-md hover:bg-dark-700 text-dark-200" aria-label="Previous month">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-dark-100 font-medium min-w-[130px] text-center">
              {MONTHS[csvMonth - 1]} {csvYear}
            </span>
            <button onClick={csvNext} className="p-2 rounded-md hover:bg-dark-700 text-dark-200" aria-label="Next month">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 text-dark-100 text-sm font-medium py-2 px-3 rounded-lg"
          >
            <Download className="w-4 h-4" /> {exporting ? 'Preparing...' : 'Download CSV'}
          </button>
        </div>
      </div>
    </div>
  )
}
