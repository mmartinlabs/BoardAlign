import React from 'react'

const SEGMENTS = [
  { key: 'support',   color: 'var(--color-green)' },
  { key: 'neutral',   color: '#d1d0c8' },
  { key: 'concerned', color: 'var(--color-amber)' },
  { key: 'oppose',    color: 'var(--color-red)' },
]

export default function StanceBar({ responses }) {
  if (!responses) return null

  const total = responses.length

  const counts = {
    support:   responses.filter(r => r.stance === 'support').length,
    neutral:   responses.filter(r => r.stance === 'neutral').length,
    concerned: responses.filter(r => r.stance === 'concerned').length,
    oppose:    responses.filter(r => r.stance === 'oppose').length,
  }

  return (
    <div className="stance-bar-container">
      <div className="stance-bar">
        {SEGMENTS.map(seg => {
          const count = counts[seg.key]
          const widthStr = total > 0
            ? `max(4px, ${(count / total) * 100}%)`
            : '25%'
          return (
            <div
              key={seg.key}
              className="stance-bar-segment"
              style={{ width: widthStr, background: seg.color }}
              title={`${seg.key}: ${count}`}
            />
          )
        })}
      </div>
      <div className="stance-bar-legend">
        {counts.support} Support · {counts.neutral} Neutral · {counts.concerned} Concerned · {counts.oppose} Oppose
      </div>
    </div>
  )
}
