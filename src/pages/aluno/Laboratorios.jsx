import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'

export default function Laboratorios() {
  const navigate = useNavigate()
  const { dados, carregando, erro, recarregar } = useApi('/recursos/?ativo=true')

  if (carregando) return <Carregando mensagem="Buscando laboratórios..." />
  if (erro) return <Erro mensagem="Não foi possível carregar os laboratórios." onTentarDeNovo={recarregar} />

  const lista = dados?.results || dados || []

  return (
    <div>
      <h2 className="mb-1">Laboratórios de Informática</h2>
      <p className="text-muted mb-4">Conheça nossos laboratórios e infraestrutura.</p>

      {lista.length === 0 ? (
        <p className="text-muted">Nenhum laboratório cadastrado.</p>
      ) : (
        <Row className="g-4">
          {lista.map((lab) => (
            <Col md={6} lg={4} key={lab.id}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Foto src={lab.foto} alt={lab.nome} tamanho={64} arredondado={false} />
                    <div>
                      <h5 className="mb-1">{lab.nome}</h5>
                      <span className="small text-muted">💻 {lab.capacidade} computadores</span>
                    </div>
                  </div>
                  <p className="text-muted small mb-3">{lab.bio || 'Sem descrição.'}</p>
                  <Button
                    variant="outline-primary"
                    className="mt-auto w-100"
                    onClick={() => navigate(`/laboratorios/${lab.id}`)}
                  >
                    Ver perfil e horários
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}