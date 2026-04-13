import React from 'react'

export default function Button({ children, variant = 'primary', onClick, disabled, type = 'button', style }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}
