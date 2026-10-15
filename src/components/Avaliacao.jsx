import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Estrelas } from './Estrelas'
import { formatarData } from '../utils/formatos' // Ajuste do caminho do utilitário

export function Avaliacao({ avaliacoes }) {
  return (
    <ListGroup.Item>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <Estrelas nota={avaliacoes.nota} />
        {avaliacoes.inicio && (
          <small className="text-secondary">{formatarData(avaliacoes.inicio)}</small>
        )}
      </div>
      
      {avaliacoes.comentario && <p className="my-1">{avaliacoes.comentario}</p>}
      
      <small className="text-secondary d-block mt-1">
        {avaliacoes.cliente_nome} · {avaliacoes.servico_nome} · {avaliacoes.recurso_nome}
      </small>
    </ListGroup.Item>
  )
}