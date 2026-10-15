import React from 'react'

const MAPA_STATUS = {
  solicitado: { texto: 'Solicitado', classe: 'status-solicitado' },
  confirmado: { texto: 'Confirmado', classe: 'status-confirmado' },
  concluido: { texto: 'Concluído', classe: 'status-concluido' },
  cancelado: { texto: 'Cancelado', classe: 'status-cancelado' },
}

export default function StatusReserva({ status }) {
  const info = MAPA_STATUS[status] || { texto: status, classe: '' }

  return (
    <span className={`status-badge ${info.classe}`}>
      {info.texto}
    </span>
  )
}