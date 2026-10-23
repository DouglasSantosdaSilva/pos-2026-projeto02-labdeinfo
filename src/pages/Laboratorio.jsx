import React from 'react'
import { Card, Badge, Button, ListGroup } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { buscarTodas } from '../api/client'
import { useAuth } from '../AuthContext'
import { Avaliacao } from '../components/Avaliacao'
import { Carregando } from '../components/Carregando'
import { CarregarMais } from '../components/CarregarMais'
import { Erro } from '../components/Erro'
import { Foto } from '../components/Foto'
import { useApi, usePaginado } from '../hooks/useApi'

export function Laboratorio() {
  const { id } = useParams()
  const { pode } = useAuth()
  const recurso = useApi(`/recursos/${id}/`)
  const servicos = useApi(`/servicos/?recursos=${id}`, buscarTodas)
  const avaliacoes = usePaginado(`/avaliacoes/?recurso=${id}`)

  if (recurso.erro) return <Erro erro={recurso.erro} tentarDeNovo={recurso.recarregar} />
  if (servicos.erro) return <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />
  if (recurso.carregando || servicos.carregando) return <Carregando />

  const { nome, bio, foto } = recurso.dados

  return (
    <>
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="d-flex flex-column flex-sm-row gap-3 align-items-center align-items-sm-start p-4">
          <Foto src={foto} tamanho={120} />
          <div className="flex-grow-1 text-center text-sm-start">
            <h2 className="fw-bold mb-1">{nome}</h2>
            <p className="text-muted mb-2">{bio}</p>
            <div className="d-flex flex-wrap gap-1 mb-3 justify-content-center justify-content-sm-start">
              {servicos.dados.map((servico) => (
                <Badge key={servico.id} bg="secondary" className="fw-normal px-2 py-1">
                  {servico.nome}
                </Badge>
              ))}
            </div>
            {pode && pode('api.add_agendamento') && (
              <Button as={Link} to={`/agendar?recurso=${id}`} variant="success">
                <i className="bi bi-calendar-plus me-1"></i> Reservar neste laboratório
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <h4 className="fw-bold mb-3">Avaliações</h4>
      {avaliacoes.erro && <Erro erro={avaliacoes.erro} tentarDeNovo={avaliacoes.recarregar} />}
      {!avaliacoes.carregando && !avaliacoes.erro && avaliacoes.itens.length === 0 && (
        <p className="text-muted">Ainda sem avaliações.</p>
      )}

      <ListGroup className="shadow-sm mb-3">
        {avaliacoes.itens.map((avaliacao) => (
          <ListGroup.Item key={avaliacao.id} className="p-0 border-0">
            <Avaliacao avaliacao={avaliacao} />
          </ListGroup.Item>
        ))}
      </ListGroup>

      {avaliacoes.carregando ? <Carregando /> : <CarregarMais lista={avaliacoes} />}
    </>
  )
}