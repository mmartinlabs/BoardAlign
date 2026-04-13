import React from 'react'

const BADGE_CONFIG = {
  green:    { label: 'Aligned',       bg: 'var(--green-bg)',  color: 'var(--green)',      border: '1px solid var(--green-border)' },
  aligned:  { label: 'Board Aligned', bg: 'var(--green-bg)',  color: 'var(--green)',      border: '1px solid var(--green-border)' },
  yellow:   { label: 'Mixed',         bg: 'var(--amber-bg)',  color: 'var(--amber)',      border: '1px solid var(--amber-border)' },
  mixed:    { label: 'Mixed Views',   bg: 'var(--amber-bg)',  color: 'var(--amber)',      border: '1px solid var(--amber-border)' },
  red:      { label: 'At Risk',       bg: 'var(--red-bg)',    color: 'var(--red)',        border: '1px solid var(--red-border)' },
  'at-risk':{ label: 'At Risk',       bg: 'var(--red-bg)',    color: 'var(--red)',        border: '1px solid var(--red-border)' },
  unknown:  { label: 'Pending',       bg: 'var(--gray-bg)',   color: 'var(--text-muted)', border: '1px solid var(--gray-border)' },
}

export default function RiskBadge({ flag, large = false }) {
  const config = BADGE_CONFIG[flag] || BADGE_CONFIG.unknown
  return (
    <span
      className={`risk-badge${large ? ' risk-badge-lg' : ''}`}
      style={{ background: config.bg, color: config.color, border: config.border }}
    >
      {config.label}
    </span>
  )
}
