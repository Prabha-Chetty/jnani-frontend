'use client'

import { useState } from 'react'
import { X, Trash2, Lock } from 'lucide-react'
import { Attendance } from '@/types'
import { prettyDate, weekdayName } from './dateUtils'

export type DayModalPayload = { minutes_taken: number; notes?: string }

type Props = {
  iso: string
  entry: Attendance | null
  canEdit: boolean      // admins can edit existing entries
  canDelete: boolean    // admins can delete existing entries
  facultyLabel?: string // shown for context (admin view)
  classLength: number   // minutes per class
  ratePerClass: number  // Rs per completed class
  saving?: boolean
  onClose: () => void
  onSave: (payload: DayModalPayload, entryId: string | null) => void
  onDelete?: (entryId: string) => void
}

export default function AttendanceDayModal({
  iso,
  entry,
  canEdit,
  canDelete,
  facultyLabel,
  classLength,
  ratePerClass,
  saving = false,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [minutes, setMinutes] = useState<string>(
    entry ? String(entry.minutes_taken) : '',
  )
  const [notes, setNotes] = useState<string>(entry?.notes ?? '')
  const [error, setError] = useState<string | null>(null)

  // Existing entry that the current user cannot edit -> read-only view.
  const readOnly = !!entry && !canEdit

  // Live preview of classes + amount for the entered minutes.
  const parsedMinutes = Number(minutes)
  const previewClasses =
    Number.isInteger(parsedMinutes) && parsedMinutes > 0 && classLength > 0
      ? Math.floor(parsedMinutes / classLength)
      : 0
  const previewAmount = previewClasses * ratePerClass

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(minutes)
    // Whole minutes only — reject blanks, decimals, zero/negatives and absurd values.
    if (minutes.trim() === '' || !Number.isInteger(value) || value <= 0 || value > 1440) {
      setError('Enter the time taught in whole minutes (1–1440).')
      return
    }
    setError(null)
    onSave({ minutes_taken: value, notes: notes.trim() || undefined }, entry?.id ?? null)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-dark-900 border border-dark-700 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-dark-50">
              {entry ? (readOnly ? 'Attendance' : 'Edit Attendance') : 'Mark Attendance'}
            </h2>
            <p className="text-sm text-dark-300 mt-0.5">
              {weekdayName(iso)}, {prettyDate(iso)}
            </p>
            {facultyLabel && (
              <p className="text-xs text-secondary-400 mt-0.5">{facultyLabel}</p>
            )}
          </div>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {readOnly ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-dark-400">Time Taught</p>
              <p className="text-lg font-semibold text-dark-50">
                {entry!.minutes_taken} min · {entry!.classes} class
                {entry!.classes === 1 ? '' : 'es'} · ₹{entry!.amount}
              </p>
            </div>
            {entry!.notes && (
              <div>
                <p className="text-sm text-dark-400">Notes</p>
                <p className="text-dark-100">{entry!.notes}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-dark-400 bg-dark-800 rounded-md p-3">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Already recorded. Please contact an administrator to make changes.</span>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-dark-700 hover:bg-dark-600 text-dark-100 font-semibold py-2 px-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">
                Time Taught (minutes)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="1440"
                value={minutes}
                autoFocus
                onChange={(e) => setMinutes(e.target.value)}
                onKeyDown={(e) => {
                  // Block decimal/exponent characters — whole minutes only.
                  if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                }}
                className="block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                placeholder="e.g. 90"
              />
              <p className="text-xs text-dark-400 mt-1">
                {classLength} min = 1 class @ ₹{ratePerClass}.{' '}
                {previewClasses > 0 ? (
                  <span className="text-secondary-400">
                    {previewClasses} class{previewClasses === 1 ? '' : 'es'} → ₹{previewAmount}
                  </span>
                ) : (
                  'Enter whole minutes.'
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">
                Notes <span className="text-dark-500">(optional)</span>
              </label>
              <textarea
                value={notes}
                rows={2}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full px-3 py-2 bg-dark-900 text-dark-100 placeholder-dark-400 border border-dark-700 rounded-md focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
                placeholder="Subject / class details"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-between items-center pt-2">
              {entry && canDelete && onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  disabled={saving}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-dark-700 hover:bg-dark-600 text-dark-100 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-60"
                >
                  {saving ? 'Saving...' : entry ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
