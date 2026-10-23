import React from 'react'

export function Foto({ src, icone = 'bi-person-circle', tamanho = 48 }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="rounded-circle"
        style={{ width: tamanho, height: tamanho, objectFit: 'cover' }}
      />
    )
  }

  return (
    <i
      className={`bi ${icone} text-secondary align-middle`}
      style={{ fontSize: tamanho, lineHeight: 1 }}
    ></i>
  )
}