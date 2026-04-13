import React from 'react'

const BADGE_CONFIG = {
  green:    { label: 'Aligned',      bg: 'var(--color-green-light)',  color: 'var(--color-green)' },
  aligned:  { label: 'Board Aligned', bg: 'var(--color-green-light)', color: 'var(--color-green)' },
  yellow:   { label: 'Mixed',         bg: 'var(--color-amber-light)', color: 'var(--color-amber)' },
  mixed:    { label: 'Mixed Views',   bg: 'var(--color-amber-light)', color: 'var(--color-amber)' },
  red:      { label: 'At Risk',       bg: 'var(--color-red-light)',   color: 'var(--color-red)' },
  'at-risk':{ label: 'At Risk',       bg: 'var(--color-red-light)',   color: 'var(--color-red)' },
  unknown:  { label: 'Pending',       bg: 'var(--color-gray-light)',  color: 'var(--color-text-muted)' },
}

export default function RiskBadge({ flag, large = false }) {
  const config = BADGE_CONFIG[flag] || BADGE_CONFIG.unknown
  return (
    <span
      className={`risk-badge${large ? ' risk-badge-lg' : ''}`}
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  )
}
