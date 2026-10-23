import React from 'react'
import { Badge } from 'react-bootstrap'

const STATUS = {
  solicitado: { bg: 'warning', text: 'dark', rotulo: 'Solicitada' },
  confirmado: { bg: 'primary', text: 'white', rotulo: 'Confirmada' },
  concluido: { bg: 'success', text: 'white', rotulo: 'Concluída' },
  cancelado: { bg: 'secondary', text: 'white', rotulo: 'Cancelada' },
}

export function StatusReserva({ status }) {
  const config = STATUS[status] || { bg: 'secondary', text: 'white', rotulo: status }

  return (
    <Badge bg={config.bg} text={config.text} pill className="px-2 py-1">
      {config.rotulo}
    </Badge>
  )
}

// Export para retrocompatibilidade
export const StatusConsulta = StatusReserva