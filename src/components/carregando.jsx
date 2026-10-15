import React from 'react'
import { Spinner } from 'react-bootstrap'

export function Carregando({ mensagem = 'A carregar...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <Spinner animation="border" role="status" variant="primary" className="me-2" />
      <span>{mensagem}</span>
    </div>
  )
}

export default Carregando