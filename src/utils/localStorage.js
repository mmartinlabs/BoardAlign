const STORAGE_KEY = 'boardalign_meetings'

export function getMeetings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveMeeting(meeting) {
  const meetings = getMeetings()
  const idx = meetings.findIndex(m => m.id === meeting.id)
  if (idx >= 0) {
    meetings[idx] = meeting
  } else {
    meetings.push(meeting)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
}

export function getMeetingById(id) {
  return getMeetings().find(m => m.id === id) || null
}

export function deleteMeeting(id) {
  const meetings = getMeetings().filter(m => m.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
}

export function markComplete(id) {
  const meeting = getMeetingById(id)
  if (meeting) {
    meeting.status = 'complete'
    meeting.completedAt = new Date().toISOString()
    saveMeeting(meeting)
  }
}
