import React from 'react'
import { Alert, Button, Card } from 'react-bootstrap'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ReservaItem } from '../../components/ReservaItem'

export function Enviado() {
  const location = useLocation()
  const agendamento = location.state?.agendamento

  if (!agendamento) {
    return <Navigate to="/reservas" replace />
  }

  return (
    <Card className="text-center shadow-sm border-0">
      <Card.Body className="p-4">
        <i className="bi bi-check-circle-fill text-success display-3 d-block mb-3"></i>
        
        <h2 className="fw-bold mb-3">Reserva solicitada com sucesso!</h2>

        <div className="border rounded text-start mb-3 overflow-hidden">
          <ReservaItem reserva={agendamento} />
        </div>

        <Alert variant="info" className="mb-4">
          O administrador do laboratório irá analisar e confirmar a sua reserva em breve.
        </Alert>

        <div className="d-flex justify-content-center gap-2">
          <Button as={Link} to={`/reservas/${agendamento.id}`} variant="success">
            Ver detalhes da reserva
          </Button>
          <Button as={Link} to="/inicio" variant="outline-secondary">
            Ir para o início
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}