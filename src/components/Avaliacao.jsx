import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Estrelas } from './Estrelas'
import { formatarData } from '../formatos'

export function Avaliacao({ avaliacao }) {
  if (!avaliacao) return null

  const { cliente_nome, nota, comentario, criado_em, servico_nome } = avaliacao

  return (
    <ListGroup.Item className="py-3 px-3 border-bottom">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <strong className="d-block text-dark mb-1">
            {cliente_nome || 'Aluno'}
          </strong>
          {servico_nome && (
            <span className="badge bg-light text-secondary border me-2">
              {servico_nome}
            </span>
          )}
        </div>
        <small className="text-muted">
          {criado_em ? formatarData(criado_em) : ''}
        </small>
      </div>

      <div className="mb-2">
        <Estrelas nota={nota} />
      </div>

      {comentario ? (
        <p className="mb-0 text-secondary small bg-light p-2 rounded">
          "{comentario}"
        </p>
      ) : (
        <span className="text-muted small fst-italic">Sem comentário.</span>
      )}
    </ListGroup.Item>
  )
}

export default Avaliacao