import React from 'react'
import { Spinner } from 'react-bootstrap'

export function Carregando({ mensagem = 'Carregando...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-3 text-secondary">
      <Spinner animation="border" role="status" variant="primary" className="mb-2">
        <span className="visually-hidden">{mensagem}</span>
      </Spinner>
      <small className="fw-medium">{mensagem}</small>
    </div>
  )
}