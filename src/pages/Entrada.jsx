import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export function Entrada() {
  return (
    <div className="text-center py-2">
      <img
        src="/logo.png"
        alt="Laboratório de Informática"
        className="mb-3 img-fluid"
        style={{ maxHeight: '100px', objectFit: 'contain' }}
        onError={(e) => {
          e.target.src = '/favicon.png'
        }}
      />
      
      <h3 className="fw-bold mb-2">Lab Info</h3>
      <p className="text-muted small mb-4">
        Plataforma unificada para reserva de computadores e agendamento de laboratórios.
      </p>

      <div className="d-grid gap-2">
        <Button
          as={Link}
          to="/login"
          variant="success"
          size="lg"
          className="fw-semibold py-2"
        >
          Entrar
        </Button>
        <Button
          as={Link}
          to="/cadastro"
          variant="outline-secondary"
          size="lg"
          className="fw-medium py-2"
        >
          Criar conta
        </Button>
      </div>
    </div>
  )
}