import React from 'react'
import { Link } from 'react-router-dom'
import { formatarData, formatarHora } from '../formatos'
import { StatusReserva } from './StatusReserva'

export function ReservaItem({ reserva, mostrarUsuario = false }) {
  return (
    <Link
      to={`/reservas/${reserva.id}`}
      className="d-flex align-items-center gap-3 p-3 text-dark text-decoration-none list-group-item-action"
    >
      <div className="text-center" style={{ minWidth: '75px' }}>
        <div className="fw-bold text-primary">{formatarHora(reserva.inicio)}</div>
        <small className="text-muted d-block">{formatarData(reserva.inicio)}</small>
      </div>

      <div className="me-auto">
        <div className="fw-semibold text-dark">{reserva.servico_nome}</div>
        <small className="text-muted">
          {reserva.recurso_nome}
          {mostrarUsuario && reserva.cliente_nome && ` · ${reserva.cliente_nome}`}
        </small>
        {mostrarUsuario && reserva.observacoes && (
          <div>
            <small className="fst-italic text-secondary">{reserva.observacoes}</small>
          </div>
        )}
      </div>

      <StatusReserva status={reserva.status} />
    </Link>
  )
}