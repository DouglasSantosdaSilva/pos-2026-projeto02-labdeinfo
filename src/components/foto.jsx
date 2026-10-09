import React from 'react'

export function foto({ src, alt = 'Imagem', tamanho = 48, arredondado = true, className = '' }) {
  const estilo = {
    width: `${tamanho}px`,
    height: `${tamanho}px`,
    objectFit: 'cover',
    borderRadius: arredondado ? '50%' : '8px',
    backgroundColor: '#e9ecef',
  }

  if (!src) {
    return (
      <div
        style={estilo}
        className={`d-inline-flex align-items-center justify-content-center text-secondary fw-bold ${className}`}
      >
        {alt ? alt.charAt(0).toUpperCase() : '?'}
      </div>
    )
  }

  return <img src={src} alt={alt} style={estilo} className={className} />
}