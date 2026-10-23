import React from 'react'
import { Spinner } from 'react-bootstrap'

export function Carregando() {
  return (
    <div className="text-center my-5">
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </Spinner>
    </div>
  )
}