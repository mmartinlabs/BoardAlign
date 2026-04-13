import React from 'react'

const STANCES = [
  {
    value: 'support',
    label: 'Support',
    selectedStyle: {
      background: 'var(--color-green-light)',
      color: 'var(--color-green)',
      borderColor: 'var(--color-green)',
    },
  },
  {
    value: 'neutral',
    label: 'Neutral',
    selectedStyle: {
      background: 'var(--color-gray-light)',
      color: 'var(--color-gray-neutral)',
      borderColor: 'var(--color-gray-neutral)',
    },
  },
  {
    value: 'concerned',
    label: 'Concerned',
    selectedStyle: {
      background: 'var(--color-amber-light)',
      color: 'var(--color-amber)',
      borderColor: 'var(--color-amber)',
    },
  },
  {
    value: 'oppose',
    label: 'Oppose',
    selectedStyle: {
      background: 'var(--color-red-light)',
      color: 'var(--color-red)',
      borderColor: 'var(--color-red)',
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
