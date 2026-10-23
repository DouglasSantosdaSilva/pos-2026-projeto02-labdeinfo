import React, { useState } from 'react'
import { Alert, Badge, Button, Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { FiltroAtivo } from '../../components/FiltroAtivo'
import { Foto } from '../../components/Foto'
import { usePaginado } from '../../hooks/useApi'

export function Recursos() {
  const [ativo, setAtivo] = useState('')
  const recursos = usePaginado(ativo ? `/recursos/?ativo=${ativo}` : '/recursos/')

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        <h2 className="fw-bold mb-0 me-auto">Laboratórios</h2>
        <FiltroAtivo valor={ativo} onChange={setAtivo} />
        <Button as={Link} to="/admin/laboratorios/novo" variant="primary">
          <i className="bi bi-plus-lg me-1"></i> Novo Laboratório
        </Button>
      </div>

      {recursos.erro && <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />}

      {!recursos.carregando && !recursos.erro && recursos.itens.length === 0 && (
        <Alert variant="info">Cadastre o primeiro laboratório.</Alert>
      )}

      {recursos.itens.length > 0 && (
        <Card className="shadow-sm border-0 mb-3">
          <ListGroup variant="flush">
            {recursos.itens.map((recurso) => (
              <ListGroup.Item
                key={recurso.id}
                action
                as={Link}
                to={`/admin/laboratorios/${recurso.id}`}
                className="d-flex align-items-center gap-3 p-3 text-decoration-none"
              >
                <Foto src={recurso.foto} tamanho={48} />
                <div className="me-auto">
                  <div className="fw-semibold text-dark">{recurso.nome}</div>
                  <small className="text-muted">Capacidade: {recurso.capacidade}</small>
                </div>
                {recurso.ativo ? (
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

      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}