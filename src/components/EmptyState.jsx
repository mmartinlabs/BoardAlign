import React from 'react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="13" width="32" height="27" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="8" y1="21" x2="40" y2="21" stroke="currentColor" strokeWidth="1.5" />
          <line x1="17" y1="9" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="31" y1="9" x2="31" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="29" x2="23" y2="29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="34" x2="29" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  )
}
