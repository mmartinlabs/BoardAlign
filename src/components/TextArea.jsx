import React from 'react'

export default function TextArea({ label, value, onChange, placeholder, rows = 2, id, labelClassName }) {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) : undefined)
  return (
    <div className="field-group">
      {label && (
        <label className={`field-label${labelClassName ? ' ' + labelClassName : ''}`} htmlFor={inputId}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className="field-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{ minHeight: rows * 24 + 20 }}
      />
    </div>
  )
}
