import React from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { status_reserva } from '../../components/status_reserva'

export default function Enviado() {
  const navigate = useNavigate()
  const location = useLocation()
  const agendamento = location.state?.agendamento

  if (!agendamento) {
    navigate('/')
    return null
  }

  const { id, servico_nome, recurso_nome, inicio, fim, status } = agendamento

  return (
    <div className="max-w-lg mx-auto py-4">
      <Card className="shadow-sm border-0 text-center p-4">
        <div className="display-4 text-success mb-3">✅</div>
        <h3 className="fw-bold mb-2">Agendamento Enviado!</h3>
        <p className="text-muted mb-4">Seu pedido foi registrado com sucesso.</p>

        <Alert variant="warning" className="text-start mb-4 small">
          ℹ️ Sua reserva está com status <strong>solicitada</strong>. O coordenador do laboratório irá avaliar e confirmar seu horário em breve.
        </Alert>

        <Card className="bg-light border-0 mb-4 text-start">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">{servico_nome}</h5>
              <StatusReserva status={status} />
            </div>
            <p className="mb-1 text-muted">📍 {recurso_nome}</p>
            <p className="mb-0 small text-secondary">
              📅 {new Date(inicio).toLocaleDateString('pt-BR')} das {new Date(inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} às {new Date(fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </Card.Body>
        </Card>

        <div className="d-flex gap-2">
          <Button variant="outline-primary" className="w-100" onClick={() => navigate('/')}>
            Início
          </Button>
          <Button variant="primary" className="w-100" onClick={() => navigate(`/reservas/${id}`)}>
            Ver Reserva
          </Button>
        </div>
      </Card>
    </div>
  )
}