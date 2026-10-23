import React, { useState } from 'react'
import { Alert, Badge, Button, Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { FiltroAtivo } from '../../components/FiltroAtivo'
import { formatarPreco } from '../../formatos'
import { usePaginado } from '../../hooks/useApi'

export function Servicos() {
  const [ativo, setAtivo] = useState('')
  const servicos = usePaginado(ativo ? `/servicos/?ativo=${ativo}` : '/servicos/')

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <h2 className="fw-bold mb-0 me-auto">Serviços e Softwares</h2>
        <FiltroAtivo valor={ativo} onChange={setAtivo} />
        <Button as={Link} to="/admin/servicos/novo" variant="primary">
          <i className="bi bi-plus-lg me-1"></i> Novo serviço
        </Button>
      </div>

      {servicos.erro && <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />}

      {!servicos.carregando && !servicos.erro && servicos.itens.length === 0 && (
        <Alert variant="info">Cadastre o primeiro serviço ou software.</Alert>
      )}

      {servicos.itens.length > 0 && (
        <Card className="shadow-sm border-0 mb-3">
          <ListGroup variant="flush">
            {servicos.itens.map((servico) => (
              <ListGroup.Item
                key={servico.id}
                action
                as={Link}
                to={`/admin/servicos/${servico.id}`}
                className="d-flex align-items-center gap-3 p-3 text-decoration-none"
              >
                {servico.imagem ? (
                  <img
                    src={servico.imagem}
                    alt={servico.nome}
                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    className="rounded"
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light rounded"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <i className="bi bi-pc-display fs-3 text-secondary"></i>
                  </div>
                )}
                <div className="me-auto">
                  <div className="fw-semibold text-dark">{servico.nome}</div>
                  <small className="text-muted">
                    {servico.duracao_min} min · {formatarPreco(servico.preco)}
                  </small>
                </div>
                {servico.ativo ? (
                  <Badge bg="success" className="px-2 py-1">
                    Ativo
                  </Badge>
                ) : (
                  <Badge bg="secondary" className="px-2 py-1">
                    Inativo
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}

      {servicos.carregando ? <Carregando /> : <CarregarMais lista={servicos} />}
    </>
  )
}