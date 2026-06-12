import { Student, StudentAttendance } from '@/types'

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/**
 * Export a monthly attendance matrix: rows = students, columns = each day of
 * the month (P / A / blank), plus Present/Absent totals per student.
 */
export function exportStudentAttendanceCSV(
  students: Student[],
  records: StudentAttendance[],
  year: number,
  month: number, // 1-12
  filename: string,
) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dayCols = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // status by `${student_id}|${YYYY-MM-DD}`
  const byKey = new Map<string, 'present' | 'absent'>()
  records.forEach((r) => byKey.set(`${r.student_id}|${r.date}`, r.status))

  const dateFor = (day: number) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const headers = [
    'Student',
    'Class',
    ...dayCols.map((d) => String(d).padStart(2, '0')),
    'Present',
    'Absent',
  ]
  const lines = [headers.map(csvCell).join(',')]

  // Stable order: by class, then name.
  const sorted = [...students].sort((a, b) => {
    const c = (a.class_name || '').localeCompare(b.class_name || '')
    return c !== 0 ? c : (a.name || '').localeCompare(b.name || '')
  })

  sorted.forEach((s) => {
    let present = 0
    let absent = 0
    const cells = dayCols.map((d) => {
      const status = byKey.get(`${s.id}|${dateFor(d)}`)
      if (status === 'present') {
        present += 1
        return 'P'
      }
      if (status === 'absent') {
        absent += 1
        return 'A'
      }
      return ''
    })
    lines.push(
      [s.name, s.class_name, ...cells, present, absent].map(csvCell).join(','),
    )
  })

  downloadBlob(lines.join('\n'), filename, 'text/csv;charset=utf-8;')
}
