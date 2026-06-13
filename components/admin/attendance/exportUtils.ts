import { Attendance } from '@/types'
import { prettyDate } from './dateUtils'

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
  // Escape quotes and wrap if it contains a comma, quote or newline.
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/** Export attendance rows to a CSV file (opens in Excel / Sheets). */
export function exportAttendanceCSV(
  rows: Attendance[],
  filename: string,
  includeFaculty = false,
) {
  const headers = includeFaculty
    ? ['Faculty', 'Date', 'Day', 'Minutes', 'Amount (Rs)', 'Notes']
    : ['Date', 'Day', 'Minutes', 'Amount (Rs)', 'Notes']

  const lines = [headers.join(',')]
  rows.forEach((r) => {
    const cells = includeFaculty
      ? [r.faculty_name ?? '', r.date, r.day, r.minutes_taken, r.amount, r.notes ?? '']
      : [r.date, r.day, r.minutes_taken, r.amount, r.notes ?? '']
    lines.push(cells.map(csvCell).join(','))
  })

  const totalMinutes = rows.reduce((sum, r) => sum + (r.minutes_taken || 0), 0)
  const totalAmount = rows.reduce((sum, r) => sum + (r.amount || 0), 0)
  const totalRow = includeFaculty
    ? ['', '', 'Total', totalMinutes, totalAmount, '']
    : ['', 'Total', totalMinutes, totalAmount, '']
  lines.push(totalRow.map(csvCell).join(','))

  downloadBlob(lines.join('\n'), filename, 'text/csv;charset=utf-8;')
}

/**
 * Open a print-friendly window with the attendance table so the user can
 * print or "Save as PDF" from the browser dialog.
 */
export function printAttendance(
  title: string,
  subtitle: string,
  rows: Attendance[],
  includeFaculty = false,
) {
  const totalMinutes = rows.reduce((sum, r) => sum + (r.minutes_taken || 0), 0)
  const totalAmount = rows.reduce((sum, r) => sum + (r.amount || 0), 0)

  const head = includeFaculty
    ? '<th>Faculty</th><th>Date</th><th>Day</th><th>Minutes</th><th>Amount (Rs)</th><th>Signature</th>'
    : '<th>Date</th><th>Day</th><th>Minutes</th><th>Amount (Rs)</th><th>Signature</th>'

  const body = rows
    .map((r) => {
      const cols = includeFaculty
        ? `<td>${r.faculty_name ?? ''}</td><td>${prettyDate(r.date)}</td><td>${r.day}</td><td>${r.minutes_taken}</td><td>${r.amount}</td><td></td>`
        : `<td>${prettyDate(r.date)}</td><td>${r.day}</td><td>${r.minutes_taken}</td><td>${r.amount}</td><td></td>`
      return `<tr>${cols}</tr>`
    })
    .join('')

  // Columns before the "Minutes" total cell.
  const labelSpan = includeFaculty ? 3 : 2
  const totalRow = `<tr class="total"><td colspan="${labelSpan}">Total</td><td>${totalMinutes}</td><td>${totalAmount}</td><td></td></tr>`
  const totalCols = (includeFaculty ? 6 : 5)

  const html = `<!DOCTYPE html>
<html>
<head>
<title>${title}</title>
<meta charset="utf-8" />
<style>
  body { font-family: Arial, sans-serif; color: #111; padding: 24px; }
  h1 { text-align: center; font-size: 20px; margin-bottom: 4px; }
  p.subtitle { text-align: center; margin-top: 0; color: #444; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { border: 1px solid #333; padding: 8px 10px; text-align: left; font-size: 13px; }
  th { background: #f0f0f0; }
  tr.total td { font-weight: bold; background: #fafafa; }
  @media print { button { display: none; } }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p class="subtitle">${subtitle}</p>
  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body || `<tr><td colspan="${totalCols}" style="text-align:center">No records</td></tr>`}${rows.length ? totalRow : ''}</tbody>
  </table>
  <script>window.onload = function () { window.print(); }</script>
</body>
</html>`

  const w = window.open('', '_blank')
  if (!w) {
    alert('Please allow pop-ups to print/export the attendance sheet.')
    return
  }
  w.document.write(html)
  w.document.close()
}
