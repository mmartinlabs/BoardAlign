import React from 'react'

export default function ProgressBar({ completed, total, label }) {
  const pct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-bar-label">
        {label || `${completed} / ${total} responses complete`}
      </div>
    </div>
  )
}
