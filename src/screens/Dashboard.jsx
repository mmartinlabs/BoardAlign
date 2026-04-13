import React, { useState, useEffect } from 'react'
import { getMeetings } from '../utils/localStorage'
import { getMeetingStatus } from '../utils/scoringLogic'
import { formatDate } from '../utils/helpers'
import RiskBadge from '../components/RiskBadge'
import TopBar from '../components/TopBar'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'

const TOUR_KEY = 'boardalign_tour_seen'

export default function Dashboard({ navigate }) {
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    const all = getMeetings()
    setMeetings(all.filter(m => m.status !== 'complete'))
  }, [])

  const completedMeetings = getMeetings().filter(m => m.status === 'complete')

  function handleMeetingClick(meeting) {
    if (meeting.status === 'draft') {
      navigate('define-decisions', meeting.id)
    } else {
      navigate('alignment-report', meeting.id)
    }
  }

  function restartTour() {
    localStorage.removeItem(TOUR_KEY)
    window.location.reload()
  }

  return (
    <div className="screen">
      <TopBar
        rightAction={
          <Button onClick={() => navigate('meeting-setup', null)}>
            + New Meeting
          </Button>
        }
      />
      <main className="main-content" style={{ maxWidth: 720 }}>
        <h1 className="page-title">Your Board Meetings</h1>
        <p className="page-subtitle">
          Understand where your board stands before you walk into the room.
        </p>

        {meetings.length === 0 ? (
          <EmptyState
            title="No meetings yet"
            description="Create your first meeting to start mapping your board's alignment before every session."
            action={
              <Button onClick={() => navigate('meeting-setup', null)}>
                + New Meeting
              </Button>
            }
          />
        ) : (
          <div className="meeting-list">
            {meetings.map(meeting => (
              <button
                key={meeting.id}
                className="meeting-card"
                data-tour={`meeting-card-${meeting.id}`}
                onClick={() => handleMeetingClick(meeting)}
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
                </div>
                <div
                  className="meeting-card-right"
                  data-tour={`risk-badge-${meeting.id}`}
                >
                  <RiskBadge flag={getMeetingStatus(meeting)} />
                </div>
              </button>
            ))}
            <button
              className="new-meeting-card"
              onClick={() => navigate('meeting-setup', null)}
            >
              + New Meeting
            </button>
          </div>
        )}

        {completedMeetings.length > 0 && (
          <div className="archive-link">
            <Button variant="text" onClick={() => navigate('archive')}>
              View Archive ({completedMeetings.length} completed meeting{completedMeetings.length !== 1 ? 's' : ''}) →
            </Button>
          </div>
        )}

        <div className="dashboard-footer">
          <p className="dashboard-attribution">
            Built as an academic project inspired by{' '}
            <em>Startup Boards</em> by Brad Feld &amp; Mahendra Ramsinghani (2nd&nbsp;ed., 2022).
            Board dynamics concepts drawn from Chapters 11 and 13. Not a commercial product.
          </p>
          <button className="restart-tour-btn" onClick={restartTour}>
            Restart the guided tour
          </button>
        </div>
      </main>
    </div>
  )
}
