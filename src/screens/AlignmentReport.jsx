import React, { useState, useEffect } from 'react'
import { getMeetingById, saveMeeting, markComplete } from '../utils/localStorage'
import {
  getMeetingStatus,
  getRiskFlag,
  getSuggestedTime,
  getKeyObjectors,
  getMemberRiskProfile,
} from '../utils/scoringLogic'
import { formatDate } from '../utils/helpers'
import RiskBadge from '../components/RiskBadge'
import DecisionCard from '../components/DecisionCard'
import TopBar from '../components/TopBar'
import Button from '../components/Button'

const STANCE_COLORS = {
  support:   '#16a34a',
  neutral:   '#d4d2cb',
  concerned: '#d97706',
  oppose:    '#dc2626',
}

function getPrepNote(decision, boardMembers) {
  const flag = getRiskFlag(decision.responses)
  const objectors = getKeyObjectors(decision, boardMembers)

  if (flag === 'green') {
    return 'Full alignment expected. Brief confirmation sufficient.'
  }

  const firstObjector = objectors[0]
  const firstName = firstObjector?.member?.name || 'Unknown'

  if (flag === 'yellow') {
    const concern = firstObjector?.reasoning || 'concern not specified'
    return `Partial resistance. Prepare to address ${firstName}'s concern: ${concern}.`
  }

  if (flag === 'red') {
    return `Significant resistance. Lead with ${firstName}'s objection. Have your evidence ready. Do not force consensus.`
  }

  return ''
}

function getMemberNote(memberId, decisions) {
  if (!decisions.length) return ''
  const stances = decisions.flatMap(d =>
    (d.responses || []).filter(r => r.boardMemberId === memberId).map(r => r.stance)
  )
  if (!stances.length) return ''

  const negativeCount = stances.filter(s => ['concerned', 'oppose'].includes(s)).length
  const total = stances.length

  if (negativeCount === 0) return 'Champion — likely ally in the room.'
  if (negativeCount > total / 2) return 'Structural friction — address directly, not performatively.'
  return 'Constructive — watch for group influence.'
}

export default function AlignmentReport({ navigate, activeMeetingId }) {
  const [meeting, setMeeting] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!activeMeetingId) {
      navigate('dashboard')
      return
    }
    const m = getMeetingById(activeMeetingId)
    if (!m) {
      navigate('dashboard')
      return
    }
    setMeeting(m)
    setLoaded(true)
  }, [activeMeetingId])

  function handleMarkComplete() {
    markComplete(activeMeetingId)
    const m = getMeetingById(activeMeetingId)
    setMeeting(m)
  }

  if (!loaded || !meeting) return null

  const overallStatus = getMeetingStatus(meeting)
  const isComplete = meeting.status === 'complete'
  const isDraft = meeting.status === 'draft'

  const totalTime = meeting.decisions.reduce(
    (sum, d) => sum + getSuggestedTime(d.responses || []),
    0
  )

  return (
    <div className="screen">
      <TopBar />
      <main className="main-content" style={{ maxWidth: 760 }}>
        <button className="back-nav" onClick={() => navigate('dashboard')}>
          ← Back to Your Meetings
        </button>

        {/* Header */}
        <div className="report-header">
          <div className="report-meeting-name">{meeting.name}</div>
          <div className="report-meeting-date">{formatDate(meeting.date)}</div>

          <div className="report-status-row" data-tour="report-status-badge">
            <RiskBadge flag={overallStatus} large />
          </div>

          {isDraft && (
            <div className="report-banner" style={{ marginTop: 16 }}>
              Responses not yet complete — complete the simulation to see full insights.
            </div>
          )}
          {isComplete && (
            <div className="report-banner complete" style={{ marginTop: 16 }}>
              This meeting has been marked complete. Report is read-only.
            </div>
          )}

          <div className="report-header-actions">
            <Button
              variant="secondary"
              disabled={isComplete}
              onClick={() => navigate('simulate-responses', activeMeetingId)}
            >
              Edit Responses
            </Button>
            {!isComplete && (
              <Button onClick={handleMarkComplete}>
                Mark as Complete
              </Button>
            )}
          </div>
        </div>

        {/* Section 1: Decision Risk Overview */}
        <div className="report-section">
          <h2 className="section-title">Decision Risk Overview</h2>
          <p className="section-subtitle">
            Each decision scored by the alignment of simulated board responses. Red flags require explicit meeting time.
          </p>
          {meeting.decisions.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              No decisions have been defined for this meeting.
            </p>
          ) : (
            meeting.decisions.map((decision, index) => (
              <DecisionCard
                key={decision.id}
                mode="report"
                decision={decision}
                boardMembers={meeting.boardMembers}
                cardTourTarget={`decision-card-report-${index}`}
                objectorsTourTarget={index === 2 ? 'decision-card-2-objectors' : undefined}
              />
            ))
          )}
        </div>

        {/* Section 2: Meeting Prep Brief */}
        {meeting.decisions.length > 0 && (
          <div className="report-section" data-tour="prep-brief-section">
            <h2 className="section-title">Meeting Prep Brief</h2>
            <p className="section-subtitle">
              Suggested time allocation and preparation priorities based on alignment risk.
              Your board exists to give you high-level air cover — but only if you walk in
              knowing where the resistance is.
            </p>
            <div className="prep-list">
              {meeting.decisions.map(decision => {
                const flag = getRiskFlag(decision.responses || [])
                const time = getSuggestedTime(decision.responses || [])
                const note = getPrepNote(decision, meeting.boardMembers)
                return (
                  <div key={decision.id} className="prep-row">
                    <div className="prep-row-top">
                      <div className="prep-row-left">
                        <div className="prep-row-title">{decision.title}</div>
                        <RiskBadge flag={flag} />
                      </div>
                      <div className="prep-time">~{time} min</div>
                    </div>
                    {note && <div className="prep-row-note">{note}</div>}
                  </div>
                )
              })}
            </div>
            <div className="prep-total">
              Estimated deliberation time: ~{totalTime} minutes
            </div>
          </div>
        )}

        {/* Section 3: Board Member Risk Profile */}
        {meeting.boardMembers.length > 0 && meeting.decisions.length > 0 && (
          <div className="report-section">
            <h2 className="section-title">Board Member Risk Profile</h2>
            <p className="section-subtitle">
              Which members show the most resistance across all decisions.
            </p>
            <p className="section-helper">
              A board member who opposes multiple decisions is not necessarily wrong.
              But you need to know before the meeting whether their resistance reflects a
              principled view or a structural misalignment — so you can address it rather
              than be ambushed by it.
            </p>
            <div className="member-profile-list">
              {meeting.boardMembers.map(member => {
                const profile = getMemberRiskProfile(member.id, meeting.decisions)
                const note = getMemberNote(member.id, meeting.decisions)

                return (
                  <div key={member.id} className="member-profile-row">
                    <div className="member-profile-top">
                      <div>
                        <div className="member-profile-name">{member.name}</div>
                        {(member.role || member.firm) && (
                          <div className="member-profile-role">
                            {[member.role, member.firm].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </div>
                      {profile.flagged && (
                        <span className="member-flag">⚠ Requires extended engagement</span>
                      )}
                    </div>

                    <div className="member-profile-dots">
                      {meeting.decisions.map(decision => {
                        const response = (decision.responses || []).find(
                          r => r.boardMemberId === member.id
                        )
                        const color = response?.stance
                          ? STANCE_COLORS[response.stance]
                          : 'var(--color-border)'
                        return (
                          <span
                            key={decision.id}
                            className="stance-dot"
                            style={{ background: color }}
                            title={`${decision.title}: ${response?.stance || 'no response'}`}
                          />
                        )
                      })}
                    </div>

                    {note && <div className="member-profile-note">{note}</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section 4: Philosophy Note */}
        <div className="philosophy-note" data-tour="philosophy-note">
          "These responses simulate what your board members would say privately — before social pressure,
          groupthink, sequential speaking order, and reciprocity between co-investors shape what they say
          in the room. The gap between these private views and the meeting outcome is your real board
          intelligence. If a member who appeared Opposed here votes yes in the meeting without argument,
          ask yourself why."
        </div>
      </main>
    </div>
  )
}
