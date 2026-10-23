import React from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { usePaginado } from '../../hooks/useApi'

export function EscolherLaboratorio() {
  const [params] = useSearchParams()
  const servico = params.get('servico')
  const recursos = usePaginado(`/recursos/?servicos=${servico}`)

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />
  if (recursos.carregando && recursos.itens.length === 0) return <Carregando />

  return (
    <>
      <small className="text-muted d-block mb-1">Passo 2 de 4</small>
      <h2 className="fw-bold mb-4">Em qual laboratório?</h2>

      {recursos.itens.length === 0 ? (
        <Alert variant="info">Nenhum laboratório oferece este serviço ou software.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4 mb-4">
          <Col>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex gap-3 align-items-start">
                <i className="bi bi-pc-display-horizontal display-5 text-secondary"></i>
                <div>
                  <Card.Title className="fw-bold h5 mb-1">Qualquer laboratório</Card.Title>
                  <Card.Text className="text-muted small mb-3">
                    Mostra os horários livres disponíveis em todos os laboratórios.
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/agendar/horario?servico=${servico}`}
                    variant="success"
                    size="sm"
                  >
                    Escolher
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {recursos.itens.map((recurso) => (
            <Col key={recurso.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex gap-3 align-items-start">
                  <Foto src={recurso.foto} tamanho={64} />
                  <div>
                    <Card.Title className="fw-bold h5 mb-1">{recurso.nome}</Card.Title>
                    <Card.Text className="text-muted small mb-3">{recurso.bio}</Card.Text>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        as={Link}
                        to={`/agendar/horario?servico=${servico}&recurso=${recurso.id}`}
                        variant="success"
                        size="sm"
                      >
                        Escolher
                      </Button>
                      <Button
                        as={Link}
                        to={`/laboratorios/${recurso.id}`}
                        variant="outline-secondary"
                        size="sm"
                      >
                        Ver avaliações
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}