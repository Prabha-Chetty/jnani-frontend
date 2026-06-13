'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Download, Printer } from 'lucide-react'
import { useAuth } from '@/components/admin/AuthProvider'
import { Attendance, AttendanceSummary, Faculty } from '@/types'
import AttendanceCalendar from '@/components/admin/attendance/AttendanceCalendar'
import AttendanceDayModal, { DayModalPayload } from '@/components/admin/attendance/AttendanceDayModal'
import { MONTHS } from '@/components/admin/attendance/dateUtils'
import { exportAttendanceCSV, printAttendance } from '@/components/admin/attendance/exportUtils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AdminAttendancePage() {
  const { getAuthToken } = useAuth()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [selectedFaculty, setSelectedFaculty] = useState<string>('')
  const [entries, setEntries] = useState<Attendance[]>([])
  const [summary, setSummary] = useState<AttendanceSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalDate, setModalDate] = useState<string | null>(null)
  const [modalEntry, setModalEntry] = useState<Attendance | null>(null)
  const [ratePerDay, setRatePerDay] = useState(500)

  const authHeader = () => ({ Authorization: `Bearer ${getAuthToken()}` })

  // Load faculties + remuneration config once.
  useEffect(() => {
    const token = getAuthToken()
    if (!token) return
    axios
      .get(`${API_URL}/admin/faculties/`, { headers: authHeader() })
      .then(({ data }) => {
        // Backend serializes _id via Pydantic alias; normalise to id for the UI.
        const list = (data as any[]).map((f) => ({ ...f, id: f.id ?? f._id }))
        setFaculties(list)
        if (list.length && !selectedFaculty) setSelectedFaculty(list[0].id)
      })
      .catch(() => toast.error('Failed to load faculties'))
    axios
      .get(`${API_URL}/admin/attendance/config`, { headers: authHeader() })
      .then(({ data }) => {
        setRatePerDay(data.rate_per_day)
      })
      .catch(() => {/* fall back to defaults */})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAuthToken])

  const fetchData = useCallback(async () => {
    const token = getAuthToken()
    if (!token) return
    setLoading(true)
    try {
      const [entriesRes, summaryRes] = await Promise.all([
        selectedFaculty
          ? axios.get(`${API_URL}/admin/attendance/`, {
              params: { faculty_id: selectedFaculty, month, year },
              headers: authHeader(),
            })
          : Promise.resolve({ data: [] }),
        axios.get(`${API_URL}/admin/attendance/summary`, {
          params: { month, year },
          headers: authHeader(),
        }),
      ])
      setEntries(entriesRes.data)
      setSummary(summaryRes.data)
    } catch (err) {
      console.error('Failed to load attendance', err)
      toast.error('Failed to load attendance')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAuthToken, selectedFaculty, month, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const goPrev = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  const goNext = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const handleDayClick = (iso: string, entry: Attendance | null) => {
    if (!selectedFaculty) {
      toast.error('Select a faculty first.')
      return
    }
    setModalDate(iso)
    setModalEntry(entry)
  }

  const closeModal = () => {
    setModalDate(null)
    setModalEntry(null)
  }

  const handleSave = async (payload: DayModalPayload, entryId: string | null) => {
    const token = getAuthToken()
    if (!token || !modalDate) return
    setSaving(true)
    try {
      if (entryId) {
        await axios.put(
          `${API_URL}/admin/attendance/${entryId}`,
          { minutes_taken: payload.minutes_taken, notes: payload.notes },
          { headers: authHeader() },
        )
        toast.success('Attendance updated')
      } else {
        await axios.post(
          `${API_URL}/admin/attendance/`,
          {
            date: modalDate,
            minutes_taken: payload.minutes_taken,
            notes: payload.notes,
            faculty_id: selectedFaculty,
          },
          { headers: authHeader() },
        )
        toast.success('Attendance recorded')
      }
      closeModal()
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (entryId: string) => {
    const token = getAuthToken()
    if (!token) return
    if (!window.confirm('Delete this attendance entry?')) return
    setSaving(true)
    try {
      await axios.delete(`${API_URL}/admin/attendance/${entryId}`, { headers: authHeader() })
      toast.success('Attendance deleted')
      closeModal()
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  const selectedFacultyName =
    faculties.find((f) => f.id === selectedFaculty)?.name || ''
  const periodLabel = `${MONTHS[month - 1]} ${year}`
  const totalMinutes = entries.reduce((sum, e) => sum + (e.minutes_taken || 0), 0)
  const totalAmount = entries.reduce((sum, e) => sum + (e.amount || 0), 0)

  const handleExportCSV = () =>
    exportAttendanceCSV(
      entries,
      `attendance-${selectedFacultyName || 'faculty'}-${year}-${String(month).padStart(2, '0')}.csv`,
    )
  const handlePrint = () =>
    printAttendance(
      `${selectedFacultyName} — Attendance`,
      periodLabel,
      entries,
    )

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-dark-50 mb-6">Staff Attendance</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1">Faculty</label>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="px-3 py-2 bg-dark-900 text-dark-100 border border-dark-700 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 min-w-[200px]"
          >
            {faculties.length === 0 && <option value="">No faculties</option>}
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            onClick={handleExportCSV}
            disabled={!entries.length}
            className="flex items-center gap-1.5 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 text-dark-100 text-sm font-medium py-2 px-3 rounded-lg"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
          <button
            onClick={handlePrint}
            disabled={!entries.length}
            className="flex items-center gap-1.5 bg-dark-700 hover:bg-dark-600 disabled:opacity-50 text-dark-100 text-sm font-medium py-2 px-3 rounded-lg"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <p className="text-sm text-dark-400 mb-3">
            Click a day to add, edit or delete attendance for{' '}
            <span className="text-dark-200 font-medium">
              {selectedFacultyName || 'the selected faculty'}
            </span>
            .
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary-500" />
            </div>
          ) : (
            <>
              <AttendanceCalendar
                year={year}
                month={month}
                entries={entries}
                onPrevMonth={goPrev}
                onNextMonth={goNext}
                onDayClick={handleDayClick}
              />
              <div className="mt-3 text-sm text-dark-300">
                Total this month:{' '}
                <span className="font-semibold text-secondary-400">{totalMinutes} min</span>{' · '}
                <span className="font-semibold text-secondary-400">₹{totalAmount}</span>{' '}
                over {entries.length} day{entries.length === 1 ? '' : 's'}
              </div>
            </>
          )}
        </div>

        {/* Monthly summary across all faculties */}
        <div>
          <h2 className="text-lg font-semibold text-dark-100 mb-3">
            {periodLabel} — All Staff
          </h2>
          <div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-dark-400 border-b border-dark-700">
                  <th className="py-2 px-3 font-medium">Faculty</th>
                  <th className="py-2 px-3 font-medium text-right">Days</th>
                  <th className="py-2 px-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {summary.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 px-3 text-center text-dark-500">
                      No records this month
                    </td>
                  </tr>
                ) : (
                  summary.map((s) => (
                    <tr
                      key={s.faculty_id}
                      className="border-b border-dark-800 last:border-0 hover:bg-dark-800 cursor-pointer"
                      onClick={() => setSelectedFaculty(s.faculty_id)}
                    >
                      <td className="py-2 px-3 text-dark-100">
                        {s.faculty_name || 'Unknown'}
                      </td>
                      <td className="py-2 px-3 text-right text-dark-300">{s.days}</td>
                      <td className="py-2 px-3 text-right text-secondary-400 font-medium">
                        ₹{s.total_amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalDate && (
        <AttendanceDayModal
          iso={modalDate}
          entry={modalEntry}
          canEdit
          canDelete
          facultyLabel={selectedFacultyName}
          ratePerDay={ratePerDay}
          saving={saving}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
