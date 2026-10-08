const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** Formats YYYY, YYYY-MM or YYYY-MM-DD for display */
export function formatDate(d: string): string {
  const [y, m, day] = d.split('-')
  if (!m) return y
  const month = MONTHS[Number(m) - 1]
  return day ? `${Number(day)} ${month} ${y}` : `${month} ${y}`
}

/** Months since year 0 for a YYYY-MM(-DD) string, for comparing periods */
export function monthIndex(d: string): number {
  const [y, m] = d.split('-')
  return Number(y) * 12 + (m ? Number(m) - 1 : 0)
}

export function monthLabel(idx: number): string {
  return `${MONTHS[idx % 12]} ${Math.floor(idx / 12)}`
}
