import React from 'react'
import StatusReserva from './status_reserva'

export default function reservarlab({ agendamento, onClick }) {
  const { id, servico_nome, recurso_nome, inicio, fim, status } = agendamento

  const dataFormatada = new Date(inicio).toLocaleDateString('pt-BR')
  const horaInicio = new Date(inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const horaFim = new Date(fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="reserva-lab-card" onClick={() => onClick && onClick(id)}>
      <div className="reserva-info">
        <h3>{servico_nome || 'Uso de Laboratório'}</h3>
        <p className="lab-nome">{recurso_nome || 'Laboratório'}</p>
        <p className="data-hora">
          📅 {dataFormatada} das {horaInicio} às {horaFim}
        </p>
      </div>
      <StatusReserva status={status} />
    </div>
  )
}