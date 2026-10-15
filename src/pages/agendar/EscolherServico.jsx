import React from 'react'
import { Card, Row, Col, Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'

export default function EscolherServico() {
  const navigate = useNavigate()
  const { dados, carregando, erro, recarregar } = useApi('/servicos/?ativo=true')

  if (carregando) return <Carregando mensagem="Buscando serviços disponíveis..." />
  if (erro) return <Erro mensagem="Não foi possível carregar os serviços." onTentarDeNovo={recarregar} />

  const servicos = dados?.results || dados || []

  return (
    <div>
      <h2 className="mb-1">Passo 1: Escolher Serviço</h2>
      <p className="text-muted mb-4">Selecione o tipo de uso do laboratório de informática.</p>

      {servicos.length === 0 ? (
        <p className="text-muted">Nenhum serviço disponível no momento.</p>
      ) : (
        <Row className="g-4">
          {servicos.map((servico) => (
            <Col md={6} lg={4} key={servico.id}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Foto src={servico.imagem} alt={servico.nome} tamanho={64} arredondado={false} />
                    <div>
                      <h5 className="mb-1">{servico.nome}</h5>
                      <Badge bg="info" text="dark">
                        ⏱ {servico.duracao_minutos} min
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted small mb-3">{servico.descricao || 'Sem descrição.'}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <span className="fw-bold text-success fs-5">
                      {servico.preco ? `R$ ${servico.preco}` : 'Gratuito'}
                    </span>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/agendar/laboratorio?servico=${servico.id}`)}
                    >
                      Selecionar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}