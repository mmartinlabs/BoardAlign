import React from 'react'

const LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function ConfidenceSelector({ value, onChange }) {
  return (
    <div className="response-field-section">
      <div className="field-label muted">How firmly would they hold this view?</div>
      <div className="confidence-selector">
        {LEVELS.map(level => (
          <button
            key={level.value}
            type="button"
            className={`confidence-pill${value === level.value ? ' selected' : ''}`}
            onClick={() => onChange(level.value)}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  )
}
