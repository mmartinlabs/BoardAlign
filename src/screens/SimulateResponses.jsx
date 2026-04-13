import React, { useState, useEffect, useMemo } from 'react'
import { getMeetingById, saveMeeting } from '../utils/localStorage'
import DecisionCard from '../components/DecisionCard'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'

function buildResponseMap(meeting) {
  const map = {}
  if (!meeting) return map
  meeting.decisions.forEach(decision => {
    (decision.responses || []).forEach(response => {
      map[`${response.boardMemberId}-${decision.id}`] = response
    })
  })
  return map
}

export default function SimulateResponses({ navigate, activeMeetingId, activeTab, setActiveTab }) {
  const [meeting, setMeeting] = useState(null)
  const [responses, setResponses] = useState({})
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
    setResponses(buildResponseMap(m))
    setLoaded(true)

    // Initialize activeTab to first member if not set or invalid
    if (!activeTab || !m.boardMembers.some(mb => mb.id === activeTab)) {
      setActiveTab(m.boardMembers[0]?.id || null)
    }
  }, [activeMeetingId])

  function updateResponse(boardMemberId, decisionId, field, value) {
    const key = `${boardMemberId}-${decisionId}`
    const updated = {
      ...responses,
      [key]: {
        boardMemberId,
        ...responses[key],
        [field]: value,
      },
    }
    setResponses(updated)

    // Persist to localStorage
    const m = getMeetingById(activeMeetingId)
    if (!m) return
    const updatedMeeting = {
      ...m,
      decisions: m.decisions.map(d => {
        if (d.id !== decisionId) return d
        const others = (d.responses || []).filter(r => r.boardMemberId !== boardMemberId)
        return { ...d, responses: [...others, updated[key]] }
      }),
    }
    saveMeeting(updatedMeeting)
    setMeeting(updatedMeeting)
  }

  const total = useMemo(() => {
    if (!meeting) return 0
    return meeting.boardMembers.length * meeting.decisions.length
  }, [meeting])

  const completedCount = useMemo(() => {
    return Object.values(responses).filter(r => r.stance && r.confidence).length
  }, [responses])

  const isAllComplete = useMemo(() => {
    if (!meeting) return false
    return meeting.boardMembers.every(member =>
      meeting.decisions.every(decision => {
        const r = responses[`${member.id}-${decision.id}`]
        return r && r.stance && r.confidence
      })
    )
  }, [responses, meeting])

  function getTabStatus(memberId) {
    if (!meeting) return ''
    const done = meeting.decisions.filter(d => {
      const r = responses[`${memberId}-${d.id}`]
      return r && r.stance && r.confidence
    }).length
    return `${done}/${meeting.decisions.length}`
  }

  function handleViewReport() {
    if (!meeting) return
    // Update status to 'ready' before navigating
    const updated = { ...meeting, status: 'ready' }
    saveMeeting(updated)
    navigate('alignment-report', activeMeetingId)
  }

  if (!loaded || !meeting) return null

  const selectedMember = meeting.boardMembers.find(m => m.id === activeTab)

  return (
    <div className="screen">
      <header className="topbar">
        <span className="app-name">BoardAlign</span>
        <span className="app-subtitle">Pre-Meeting Alignment Checker</span>
      </header>
      <main className="main-content" style={{ maxWidth: 800 }}>
        <button className="back-nav" onClick={() => navigate('define-decisions')}>
          ← Back
        </button>
        <div className="breadcrumb">{meeting.name}</div>
        <h1 className="page-title" style={{ fontSize: 22 }}>Simulate Board Responses</h1>
        <p className="screen-subtitle-sm">
          For each board member, model how they would respond to each decision if asked privately and without group pressure.
        </p>

        <div className="callout-box">
          "This simulates what your board members would say one-on-one — before the social dynamics of the room
          change their stated positions. The gap between these private views and public votes is where groupthink lives."
        </div>

        <ProgressBar completed={completedCount} total={total} />

        <div className="simulate-layout">
          <nav className="member-tabs" aria-label="Board members">
            <div className="member-tabs-label">Board Members</div>
            {meeting.boardMembers.map(member => (
              <button
                key={member.id}
                type="button"
                className={`member-tab${activeTab === member.id ? ' active' : ''}`}
                onClick={() => setActiveTab(member.id)}
              >
                <span className="member-tab-name">{member.name}</span>
                <span className="member-tab-status">{getTabStatus(member.id)} complete</span>
              </button>
            ))}
          </nav>

          <div className="simulate-content">
            {selectedMember ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {selectedMember.name}
                  </div>
                  {(selectedMember.role || selectedMember.firm) && (
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {[selectedMember.role, selectedMember.firm].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
                {meeting.decisions.map(decision => (
                  <DecisionCard
                    key={decision.id}
                    mode="entry"
                    decision={decision}
                    response={responses[`${selectedMember.id}-${decision.id}`] || {}}
                    onResponseChange={(field, value) =>
                      updateResponse(selectedMember.id, decision.id, field, value)
                    }
                  />
                ))}
              </>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 14, padding: 24 }}>
                Select a board member to begin.
              </div>
            )}
          </div>
        </div>

        <div className="form-footer">
          <span className="form-footer-info">
            {isAllComplete
              ? 'All responses complete — ready to view the report.'
              : `${completedCount} of ${total} responses complete`}
          </span>
          <Button onClick={handleViewReport} disabled={!isAllComplete}>
            View Alignment Report →
          </Button>
        </div>
      </main>
    </div>
  )
}
