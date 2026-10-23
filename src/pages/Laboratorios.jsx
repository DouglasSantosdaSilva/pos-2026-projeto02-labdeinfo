import React from 'react'
import { Alert, Card, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Carregando } from '../components/Carregando'
import { CarregarMais } from '../components/CarregarMais'
import { Erro } from '../components/Erro'
import { Foto } from '../components/Foto'
import { usePaginado } from '../hooks/useApi'

export function Laboratorios() {
  const recursos = usePaginado('/recursos/')

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />

  return (
    <>
      <h2 className="fw-bold mb-4">Laboratórios</h2>

      {!recursos.carregando && recursos.itens.length === 0 && (
        <Alert variant="info">Nenhum laboratório cadastrado.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4 mb-4">
        {recursos.itens.map((recurso) => (
          <Col key={recurso.id}>
            <Link to={`/laboratorios/${recurso.id}`} className="text-decoration-none text-dark">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex gap-3 align-items-start">
                  <Foto src={recurso.foto} tamanho={64} />
                  <div>
                    <Card.Title className="fw-bold h5 mb-1">{recurso.nome}</Card.Title>
                    <Card.Text className="text-muted small mb-0">
                      {recurso.bio}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}

export default Laboratorios