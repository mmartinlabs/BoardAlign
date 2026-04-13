import React from 'react'

const STANCES = [
  {
    value: 'support',
    label: 'Support',
    selectedStyle: {
      background: 'var(--green-bg)',
      color: 'var(--green)',
      borderColor: 'var(--green-border)',
    },
  },
  {
    value: 'neutral',
    label: 'Neutral',
    selectedStyle: {
      background: 'var(--gray-bg)',
      color: 'var(--text-muted)',
      borderColor: 'var(--gray-border)',
    },
  },
  {
    value: 'concerned',
    label: 'Concerned',
    selectedStyle: {
      background: 'var(--amber-bg)',
      color: 'var(--amber)',
      borderColor: 'var(--amber-border)',
    },
  },
  {
    value: 'oppose',
    label: 'Oppose',
    selectedStyle: {
      background: 'var(--red-bg)',
      color: 'var(--red)',
      borderColor: 'var(--red-border)',
    },
  },
]

export default function StanceSelector({ value, onChange }) {
  return (
    <div className="stance-selector">
      {STANCES.map(stance => {
        const isSelected = value === stance.value
        return (
          <button
            key={stance.value}
            type="button"
            className={`stance-pill${isSelected ? ' selected' : ''}`}
            style={isSelected ? {
              background: stance.selectedStyle.background,
              color: stance.selectedStyle.color,
              borderColor: stance.selectedStyle.borderColor,
            } : undefined}
            onClick={() => onChange(stance.value)}
          >
            {stance.label}
          </button>
        )
      })}
    </div>
  )
}
