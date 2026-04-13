import React, { useState, useEffect } from 'react'
import { getMeetings } from '../utils/localStorage'
import { getMeetingStatus } from '../utils/scoringLogic'
import { formatDate } from '../utils/helpers'
import RiskBadge from '../components/RiskBadge'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'

export default function Archive({ navigate }) {
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    const all = getMeetings()
    setMeetings(all.filter(m => m.status === 'complete'))
  }, [])

  return (
    <div className="screen">
      <header className="topbar">
        <span className="app-name">BoardAlign</span>
        <span className="app-subtitle">Pre-Meeting Alignment Checker</span>
      </header>
      <main className="main-content" style={{ maxWidth: 720 }}>
        <button className="back-nav" onClick={() => navigate('dashboard')}>
          ← Back
        </button>
        <h1 className="page-title">Archive</h1>
        <p className="page-subtitle">
          Completed meetings and their alignment reports. Read-only.
        </p>

        {meetings.length === 0 ? (
          <EmptyState
            title="No completed meetings"
            description="Meetings you mark as complete will appear here for future reference."
            action={
              <Button variant="secondary" onClick={() => navigate('dashboard')}>
                Back to Your Meetings
              </Button>
            }
          />
        ) : (
          <div className="meeting-list">
            {meetings.map(meeting => (
              <button
                key={meeting.id}
                className="meeting-card"
                onClick={() => navigate('alignment-report', meeting.id)}
              >
                <div className="meeting-card-left">
                  <div className="meeting-card-name">{meeting.name}</div>
                  <div className="meeting-card-meta">
                    {formatDate(meeting.date)}
                    {meeting.decisions.length > 0 && (
                      <> · {meeting.decisions.length} decision{meeting.decisions.length !== 1 ? 's' : ''}</>
                    )}
                    {meeting.boardMembers.length > 0 && (
                      <> · {meeting.boardMembers.length} board member{meeting.boardMembers.length !== 1 ? 's' : ''}</>
                    )}
                  </div>
                  {meeting.completedAt && (
                    <div className="meeting-card-completed-label">
                      Completed {formatDate(meeting.completedAt.slice(0, 10))}
                    </div>
                  )}
                </div>
                <div className="meeting-card-right">
                  <RiskBadge flag={getMeetingStatus(meeting)} />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
