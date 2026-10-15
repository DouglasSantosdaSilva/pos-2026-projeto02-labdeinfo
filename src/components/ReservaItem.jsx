import React from 'react'
import { Card, Badge, Button } from 'react-bootstrap'
import { formatarData } from '../utils/formatos'

// Garanta o 'export' diretamente na função:
export function ReservaItem({ reserva, onCancelar }) {
  if (!reserva) return null

  const { id, laboratorio_nome, data, horario, status } = reserva

  const getBadgeVariant = (st) => {
    switch (st?.toLowerCase()) {
      case 'confirmada':
      case 'ativa':
        return 'success'
      case 'pendente':
        return 'warning'
      case 'cancelada':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="h6 mb-1">
            {laboratorio_nome || `Reserva #${id}`}
          </Card.Title>
          <Card.Text className="text-muted small mb-0">
            <strong>Data:</strong> {data ? formatarData(data) : 'N/A'} | <strong>Horário:</strong> {horario || 'N/A'}
          </Card.Text>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg={getBadgeVariant(status)}>
            {status || 'Pendente'}
          </Badge>
          {onCancelar && status !== 'cancelada' && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => onCancelar(id)}
            >
              Cancelar
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ReservaItem // Mantém a default export como fallback