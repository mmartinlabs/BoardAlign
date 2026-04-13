import React from 'react'

export default function TopBar({ rightAction }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-wordmark-icon" aria-hidden="true" />
        <span className="app-name">BoardAlign</span>
      </div>
      {rightAction != null && (
        <div className="topbar-right">
          {rightAction}
        </div>
      )}
    </header>
  )
}
