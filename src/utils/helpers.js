export function formatDate(dateString) {
  if (!dateString) return ''
  // Handle YYYY-MM-DD from date input without timezone shift
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function truncate(str, maxLength) {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function newId() {
  return crypto.randomUUID()
}
