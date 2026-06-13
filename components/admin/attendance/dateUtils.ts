// Lightweight date helpers for the attendance calendar (no external deps).

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEKDAY_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Format a Date as a local YYYY-MM-DD string (no UTC shift). */
export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

/** Weekday name (e.g. "Monday") for a YYYY-MM-DD string, parsed as a local date. */
export function weekdayName(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return WEEKDAY_LONG[new Date(y, m - 1, d).getDay()]
}

/** Human-friendly date, e.g. "11 Jun 2026". */
export function prettyDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`
}

export interface CalendarCell {
  iso: string | null // null for padding cells outside the month
  day: number
  isToday: boolean
}

/**
 * Build a 7-column calendar grid for the given month (month is 1-12),
 * padded with nulls so weeks line up under Sun..Sat.
 */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const today = todayISO()
  const firstDow = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: CalendarCell[] = []
  for (let i = 0; i < firstDow; i++) {
    cells.push({ iso: null, day: 0, isToday: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({ iso, day, isToday: iso === today })
  }
  // Pad the final week.
  while (cells.length % 7 !== 0) {
    cells.push({ iso: null, day: 0, isToday: false })
  }
  return cells
}
