import React from 'react'

export function Estrelas({ nota }) {
  return (
    <span className="text-warning">
      {[1, 2, 3, 4, 5].map((n) => (
        <i
          key={n}
          className={n <= nota ? 'bi bi-star-fill me-1' : 'bi bi-star me-1'}
        ></i>
      ))}
    </span>
  )
}