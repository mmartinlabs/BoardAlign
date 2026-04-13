import React, { useState, useEffect } from 'react'
import { getMeetingById, saveMeeting } from '../utils/localStorage'
import { newId } from '../utils/helpers'
import BoardMemberRow from '../components/BoardMemberRow'
import TopBar from '../components/TopBar'
import Button from '../components/Button'
import Input from '../components/Input'

function emptyMember() {
  return { id: newId(), name: '', role: '', firm: '' }
}

export default function MeetingSetup({ navigate, activeMeetingId }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [boardMembers, setBoardMembers] = useState([emptyMember(), emptyMember()])

  useEffect(() => {
    if (activeMeetingId) {
      const meeting = getMeetingById(activeMeetingId)
      if (meeting) {
        setName(meeting.name)
        setDate(meeting.date)
        setBoardMembers(
          meeting.boardMembers.length >= 2
            ? meeting.boardMembers
            : [...meeting.boardMembers, ...Array(2 - meeting.boardMembers.length).fill(null).map(emptyMember)]
        )
        return
      }
    }
    // New meeting — reset form
    setName('')
    setDate('')
    setBoardMembers([emptyMember(), emptyMember()])
  }, [activeMeetingId])

  const filledMembers = boardMembers.filter(m => m.name.trim())
  const canContinue = name.trim() && date && filledMembers.length >= 2

  function handleMemberChange(index, field, value) {
    setBoardMembers(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))
  }

  function addMember() {
    if (boardMembers.length < 6) {
      setBoardMembers(prev => [...prev, emptyMember()])
    }
  }

  function removeMember(index) {
    if (boardMembers.length > 2) {
      setBoardMembers(prev => prev.filter((_, i) => i !== index))
    }
  }

  function handleContinue() {
    const savedMembers = boardMembers.filter(m => m.name.trim())
    if (savedMembers.length < 2) return

    const meetingId = activeMeetingId || newId()
    const existing = activeMeetingId ? getMeetingById(activeMeetingId) : null

    const meeting = {
      id: meetingId,
      name: name.trim(),
      date,
      status: 'draft',
      createdAt: existing?.createdAt || new Date().toISOString(),
      boardMembers: savedMembers,
      decisions: existing?.decisions || [],
    }

    saveMeeting(meeting)
    navigate('define-decisions', meetingId)
  }

  return (
    <div className="screen">
      <TopBar />
      <main className="main-content" style={{ maxWidth: 600 }}>
        <button className="back-nav" onClick={() => navigate('dashboard')}>
          ← Back
        </button>
        <h1 className="page-title" style={{ fontSize: 22 }}>New Board Meeting</h1>
        <p className="screen-subtitle-sm">
          Start by naming this meeting and adding your board members.
        </p>

        <div className="form-grid">
          <Input
            label="Meeting Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Q2 2025 Board Meeting"
            id="meeting-name"
          />
          <div className="field-group">
            <label className="field-label" htmlFor="meeting-date">
              Meeting Date<span className="required-marker">*</span>
            </label>
            <input
              id="meeting-date"
              type="date"
              className="field-input"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="board-members-section">
          <div className="board-members-header">Board Members</div>
          <div className="board-members-desc">
            Add each person who will vote or deliberate at this meeting.
          </div>
          <div className="board-members-list">
            {boardMembers.map((member, index) => (
              <BoardMemberRow
                key={member.id}
                member={member}
                onChange={(field, value) => handleMemberChange(index, field, value)}
                onRemove={() => removeMember(index)}
                canRemove={boardMembers.length > 2}
                showLabels={index === 0}
              />
            ))}
          </div>
          {boardMembers.length < 6 ? (
            <button type="button" className="add-btn" onClick={addMember}>
              + Add Board Member
            </button>
          ) : (
            <span className="add-btn-note">Maximum 6 board members.</span>
          )}
          {filledMembers.length < 2 && name.trim() && (
            <div className="validation-hint" style={{ marginTop: 12 }}>
              Board member name is required — you cannot model someone's position without naming them. Add at least 2.
            </div>
          )}
        </div>

        <div className="form-footer">
          <span className="form-footer-info">
            {filledMembers.length} of {boardMembers.length} members named
          </span>
          <Button onClick={handleContinue} disabled={!canContinue}>
            Continue to Decisions →
          </Button>
        </div>
      </main>
    </div>
  )
}
