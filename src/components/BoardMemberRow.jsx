import React from 'react'

export default function BoardMemberRow({ member, onChange, onRemove, canRemove, showLabels }) {
  return (
    <div className="board-member-row">
      <div className="board-member-fields">
        <div className="field-group">
          {showLabels && <label className="field-label">Name<span className="required-marker">*</span></label>}
          <input
            type="text"
            className="field-input"
            value={member.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="Board member name"
          />
        </div>
        <div className="field-group">
          {showLabels && <label className="field-label">Role</label>}
          <input
            type="text"
            className="field-input"
            value={member.role}
            onChange={e => onChange('role', e.target.value)}
            placeholder="e.g. Managing Director"
          />
        </div>
        <div className="field-group">
          {showLabels && <label className="field-label">Firm</label>}
          <input
            type="text"
            className="field-input"
            value={member.firm}
            onChange={e => onChange('firm', e.target.value)}
            placeholder="e.g. Foundry Group"
          />
        </div>
      </div>
      <button
        type="button"
        className="remove-btn"
        onClick={onRemove}
        disabled={!canRemove}
        style={!canRemove ? { visibility: 'hidden' } : undefined}
        title="Remove board member"
        aria-label="Remove board member"
      >
        ×
      </button>
    </div>
  )
}
