import React from 'react'
import { formatarData } from '../formatos'
import { Estrelas } from './Estrelas'

export function Avaliacao({ avaliacao }) {
  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <Estrelas nota={avaliacao.nota} />
        <small className="text-muted">{formatarData(avaliacao.inicio)}</small>
      </div>

      {avaliacao.comentario && <p className="my-2">{avaliacao.comentario}</p>}

      <small className="text-muted d-block">
        {avaliacao.cliente_nome} · {avaliacao.servico_nome} · {avaliacao.recurso_nome}
      </small>
    </div>
  )
}