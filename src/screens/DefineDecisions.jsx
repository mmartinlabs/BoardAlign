import React, { useState, useEffect, useRef } from 'react'
import { getMeetingById, saveMeeting } from '../utils/localStorage'
import { newId } from '../utils/helpers'
import Input from '../components/Input'
import TextArea from '../components/TextArea'
import Button from '../components/Button'

const MAX_DECISIONS = 5

function emptyDecision() {
  return {
    id: newId(),
    title: '',
    description: '',
    ceoPosition: '',
    context: '',
    responses: [],
  }
}

function isDecisionComplete(d) {
  return d.title.trim() && d.description.trim() && d.ceoPosition.trim()
}

export default function DefineDecisions({ navigate, activeMeetingId }) {
  const [meeting, setMeeting] = useState(null)
  const [decisions, setDecisions] = useState([emptyDecision()])
  const [loaded, setLoaded] = useState(false)
  const saveTimerRef = useRef(null)

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
    setDecisions(m.decisions.length > 0 ? m.decisions : [emptyDecision()])
    setLoaded(true)
  }, [activeMeetingId])

  // Auto-save decisions with debounce
  useEffect(() => {
    if (!loaded || !meeting) return
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveMeeting({ ...meeting, decisions })
    }, 400)
    return () => clearTimeout(saveTimerRef.current)
  }, [decisions, loaded, meeting])

  function updateDecision(index, field, value) {
    setDecisions(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  function addDecision() {
    if (decisions.length < MAX_DECISIONS) {
      setDecisions(prev => [...prev, emptyDecision()])
    }
  }

  function removeDecision(index) {
    if (decisions.length > 1) {
      setDecisions(prev => prev.filter((_, i) => i !== index))
    }
  }

  function handleSimulate() {
    if (!meeting) return
    // Force-save before navigating
    saveMeeting({ ...meeting, decisions })
    navigate('simulate-responses', activeMeetingId)
  }

  const completeCount = decisions.filter(isDecisionComplete).length
  const canSimulate = completeCount >= 1

  if (!loaded) return null

  return (
    <div className="screen">
      <header className="topbar">
        <span className="app-name">BoardAlign</span>
        <span className="app-subtitle">Pre-Meeting Alignment Checker</span>
      </header>
      <main className="main-content" style={{ maxWidth: 680 }}>
        <button className="back-nav" onClick={() => navigate('meeting-setup')}>
          ← Back
        </button>
        <div className="breadcrumb">{meeting?.name}</div>
        <h1 className="page-title" style={{ fontSize: 22 }}>Define the Decisions</h1>
        <p className="screen-subtitle-sm">
          For each item that requires deliberation, write what it is and state your own tentative position first.
        </p>

        <div className="callout-box">
          "Committing to your own position before simulating your board's responses is not optional.
          It prevents you from unconsciously reverse-engineering your stance from what you expect
          your board to want — the exact pattern Seth Levine identifies as 'managing the board.'"
        </div>

        <div>
          {decisions.map((decision, index) => (
            <div key={decision.id} className="decision-setup-card">
              <div className="decision-setup-card-header">
                <span className="decision-number">Decision {index + 1}</span>
                {decisions.length > 1 && (
                  <button
                    type="button"
                    className="decision-remove-btn"
                    onClick={() => removeDecision(index)}
                    title="Remove this decision"
                    aria-label="Remove decision"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="form-grid">
                <Input
                  label="Decision Title"
                  required
                  value={decision.title}
                  onChange={e => updateDecision(index, 'title', e.target.value)}
                  placeholder="e.g. Approve Series A term sheet from Foundry Group"
                  id={`decision-title-${decision.id}`}
                />
                <TextArea
                  label="Description"
                  value={decision.description}
                  onChange={e => updateDecision(index, 'description', e.target.value)}
                  placeholder="1–2 sentences describing what needs to be decided and why it matters."
                  rows={2}
                  id={`decision-desc-${decision.id}`}
                />
                <TextArea
                  label="Your Position — commit before simulating others"
                  labelClassName="warning"
                  value={decision.ceoPosition}
                  onChange={e => updateDecision(index, 'ceoPosition', e.target.value)}
                  placeholder="State clearly what you currently think should happen and why."
                  rows={2}
                  id={`decision-ceo-${decision.id}`}
                />
                <TextArea
                  label="Context / Key Data (optional)"
                  value={decision.context}
                  onChange={e => updateDecision(index, 'context', e.target.value)}
                  placeholder="Any data, constraint, or background a board member would need to know."
                  rows={2}
                  id={`decision-context-${decision.id}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          {decisions.length < MAX_DECISIONS ? (
            <button type="button" className="add-btn" onClick={addDecision}>
              + Add Decision
            </button>
          ) : (
            <span className="add-btn-note">Maximum 5 decisions per meeting.</span>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          {decisions.length === 0 && (
            <p className="text-muted" style={{ fontSize: 13, fontStyle: 'italic' }}>
              No decisions defined yet. Only add items that require genuine deliberation — routine updates belong in the board package, not here.
            </p>
          )}
        </div>

        <div className="form-footer">
          <span className="form-footer-info">
            {completeCount} of {decisions.length} decision{decisions.length !== 1 ? 's' : ''} complete
          </span>
          <Button onClick={handleSimulate} disabled={!canSimulate}>
            Simulate Board Responses →
          </Button>
        </div>
      </main>
    </div>
  )
}
