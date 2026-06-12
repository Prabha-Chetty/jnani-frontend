'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Attendance } from '@/types'
import { buildMonthGrid, MONTHS, WEEKDAY_SHORT, todayISO } from './dateUtils'

type Props = {
  year: number
  month: number // 1-12
  entries: Attendance[]
  onPrevMonth: () => void
  onNextMonth: () => void
  onDayClick: (iso: string, entry: Attendance | null) => void
}

export default function AttendanceCalendar({
  year,
  month,
  entries,
  onPrevMonth,
  onNextMonth,
  onDayClick,
}: Props) {
  const byDate = new Map<string, Attendance>()
  entries.forEach((e) => byDate.set(e.date, e))

  const cells = buildMonthGrid(year, month)
  const today = todayISO()

  return (
    <div className="bg-dark-900 border border-dark-700 rounded-lg p-4">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-md hover:bg-dark-700 text-dark-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-dark-50">
          {MONTHS[month - 1]} {year}
        </h3>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-md hover:bg-dark-700 text-dark-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_SHORT.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-dark-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (!cell.iso) {
            return <div key={`pad-${idx}`} className="h-20 rounded-md" />
          }
          const entry = byDate.get(cell.iso) || null
          const isFuture = cell.iso > today
          const recorded = !!entry

          return (
            <button
              key={cell.iso}
              type="button"
              disabled={isFuture && !recorded}
              onClick={() => onDayClick(cell.iso!, entry)}
              className={[
                'h-20 rounded-md border p-1.5 text-left flex flex-col transition-colors',
                cell.isToday ? 'border-secondary-500' : 'border-dark-700',
                recorded
                  ? 'bg-green-900/40 hover:bg-green-900/60'
                  : isFuture
                  ? 'bg-dark-800/40 opacity-50 cursor-not-allowed'
                  : 'bg-dark-800 hover:bg-dark-700',
              ].join(' ')}
            >
              <span
                className={`text-xs font-semibold ${
                  cell.isToday ? 'text-secondary-400' : 'text-dark-200'
                }`}
              >
                {cell.day}
              </span>
              {recorded && (
                <span className="mt-auto text-[11px] font-medium text-green-300 leading-tight">
                  {entry!.minutes_taken}m
                  <span className="block text-[10px] text-green-400/90">
                    {entry!.classes} cls · ₹{entry!.amount}
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-dark-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-900/60 border border-dark-700 inline-block" />
          Recorded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-dark-800 border border-dark-700 inline-block" />
          Not recorded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-secondary-500 inline-block" />
          Today
        </span>
      </div>
    </div>
  )
}
