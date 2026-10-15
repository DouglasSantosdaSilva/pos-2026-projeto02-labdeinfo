import React from 'react'
import { Badge } from 'react-bootstrap'

export function StatusReserva({ status }) {
  const getVariant = (st) => {
    switch (st?.toLowerCase()) {
      case 'confirmada':
      case 'ativa':
      case 'aprovada':
        return 'success'
      case 'pendente':
        return 'warning'
      case 'cancelada':
      case 'rejeitada':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <Badge bg={getVariant(status)}>
      {status || 'Pendente'}
    </Badge>
  )
}

export default StatusReserva