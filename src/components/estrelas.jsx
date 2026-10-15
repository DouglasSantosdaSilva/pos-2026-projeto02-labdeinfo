import React from 'react'

export function Estrelas({ nota = 0, onChange }) {
  const totalestrelas = 5

  const handleClick = (valor) => {
    if (onChange) {
      onChange(valor)
    }
  }

  return (
    <div className="d-inline-flex align-items-center gap-1" role="img" aria-label={`Nota: ${nota} de 5`}>
      {Array.from({ length: totalestrelas }, (_, index) => {
        const valorestrela = index + 1
        const preenchida = valorestrela <= nota

        return (
          <span
            key={valorestrela}
            onClick={() => handleClick(valorestrela)}
            style={{
              cursor: onChange ? 'pointer' : 'default',
              fontSize: '1.25rem',
              color: preenchida ? '#ffc107' : '#e4e5e9',
              userSelect: 'none',
              transition: 'color 0.15s ease-in-out',
            }}
            title={onChange ? `Nota ${valorestrela}` : undefined}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}