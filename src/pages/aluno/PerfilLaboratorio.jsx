import React from 'react'
import { Card, Button, ListGroup, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi, usePaginado } from '../../hooks/useApi'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { Avaliacao } from '../../components/Avaliacao'
import { CarregarMais } from '../../components/CarregarMais'

export default function PerfilLaboratorio() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { dados: lab, carregando: cLab, erro: eLab } = useApi(`/recursos/${id}/`)
  const { itens: avaliacoes, carregando: cAv, erro: eAv, temMais, carregarMais } = usePaginado(`/avaliacoes/?recurso=${id}`)

  if (cLab) return <Carregando mensagem="Carregando laboratório..." />
  if (eLab) return <Erro mensagem="Não foi possível carregar este laboratório." />

  return (
    <div>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <Row className="align-items-center g-3">
            <Col md="auto">
              <Foto src={lab.foto} alt={lab.nome} tamanho={96} arredondado={false} />
            </Col>
            <Col md>
              <h3 className="mb-1">{lab.nome}</h3>
              <p className="text-primary fw-semibold mb-2">💻 Capacidade: {lab.capacidade} computadores</p>
              <p className="text-muted mb-0">{lab.bio || 'Sem descrição cadastrada.'}</p>
            </Col>
            <Col md="auto">
              <Button variant="primary" size="lg" onClick={() => navigate(`/agendar`)}>
                Agendar com este laboratório
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h4 className="mb-3">Avaliações dos Alunos</h4>

      {cAv && avaliacoes.length === 0 && <Carregando />}
      {eAv && <Erro mensagem="Não foi possível carregar as avaliações." />}

      {!cAv && avaliacoes.length === 0 ? (
        <p className="text-muted">Ainda sem avaliações.</p>
      ) : (
        <ListGroup className="shadow-sm border-0 rounded mb-3">
          {avaliacoes.map((av) => (
            <Avaliacao key={av.id} avaliacao={av} />
          ))}
        </ListGroup>
      )}

      {temMais && <CarregarMais onClick={carregarMais} carregando={cAv} />}
    </div>
  )
}