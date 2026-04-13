import React from 'react'

export default function Input({ label, value, onChange, placeholder, required, type = 'text', id, style }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className="field-group" style={style}>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
          {required && <span className="required-marker">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className="field-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}
