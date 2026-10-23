import React from 'react'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { formatarPreco } from '../../formatos'
import { usePaginado } from '../../hooks/useApi'

export function EscolherServico() {
  const [params] = useSearchParams()
  const recurso = params.get('recurso')
  const servicos = usePaginado(recurso ? `/servicos/?recursos=${recurso}` : '/servicos/')

  if (servicos.erro) return <Erro erro={servicos.erro} tentarDeNovo={servicos.recarregar} />

  function proximoPasso(servico) {
    if (recurso) {
      return `/agendar/horario?servico=${servico.id}&recurso=${recurso}`
    }
    return `/agendar/laboratorio?servico=${servico.id}`
  }

  return (
    <>
      <small className="text-muted d-block mb-1">Passo 1 de 4</small>
      <h2 className="fw-bold mb-4">Qual serviço ou software?</h2>

      {!servicos.carregando && servicos.itens.length === 0 && (
        <Alert variant="info">Nenhum serviço disponível.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4 mb-4">
        {servicos.itens.map((servico) => (
          <Col key={servico.id}>
            <Link to={proximoPasso(servico)} className="text-decoration-none text-dark">
              <Card className="h-100 shadow-sm border-0">
                {servico.imagem ? (
                  <Card.Img
                    variant="top"
                    src={servico.imagem}
                    alt={servico.nome}
                    style={{ height: '160px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="text-center bg-light py-4 border-bottom">
                    <i className="bi bi-pc-display display-4 text-secondary"></i>
                  </div>
                )}
                <Card.Body>
                  <Card.Title className="fw-bold h5 mb-2">{servico.nome}</Card.Title>
                  <Card.Text className="text-muted small">
                    {servico.descricao}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center pt-0 pb-3">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i> {servico.duracao_min} min
                  </small>
                  <strong className="text-success">{formatarPreco(servico.preco)}</strong>
                </Card.Footer>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {servicos.carregando ? <Carregando /> : <CarregarMais lista={servicos} />}
    </>
  )
}