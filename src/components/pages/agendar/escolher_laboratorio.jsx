import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'

export default function escolher_laboratorio() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const servicoId = searchParams.get('servico')

  const { dados, carregando, erro, recarregar } = useApi(
    servicoId ? `/recursos/?servicos=${servicoId}&ativo=true` : null
  )

  if (!servicoId) {
    navigate('/agendar')
    return null
  }

  if (carregando) return <Carregando mensagem="Buscando laboratórios..." />
  if (erro) return <Erro mensagem="Erro ao carregar laboratórios para este serviço." onTentarDeNovo={recarregar} />

  const laboratorios = dados?.results || dados || []

  const selecionarLab = (labId = '') => {
    let url = `/agendar/horario?servico=${servicoId}`
    if (labId) url += `&recurso=${labId}`
    navigate(url)
  }

  return (
    <div>
      <h2 className="mb-1">Passo 2: Escolher Laboratório</h2>
      <p className="text-muted mb-4">Selecione um laboratório específico ou deixe o sistema escolher qualquer um disponível.</p>

      {/* Opção Qualquer um */}
      <Card className="shadow-sm border-primary mb-4 bg-light">
        <Card.Body className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 py-3">
          <div>
            <h5 className="mb-1 text-primary">Qualquer Laboratório</h5>
            <p className="mb-0 text-muted small">
              Busca automaticamente vagas em qualquer laboratório que ofereça este serviço.
            </p>
          </div>
          <Button variant="primary" onClick={() => selecionarLab('')}>
            Escolher Qualquer Um
          </Button>
        </Card.Body>
      </Card>

      {laboratorios.length === 0 ? (
        <p className="text-muted">Nenhum laboratório realiza este serviço no momento.</p>
      ) : (
        <Row className="g-4">
          {laboratorios.map((lab) => (
            <Col md={6} lg={4} key={lab.id}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Foto src={lab.foto} alt={lab.nome} tamanho={60} arredondado={false} />
                    <div>
                      <h5 className="mb-1">{lab.nome}</h5>
                      <span className="small text-muted">💻 {lab.capacidade} computadores</span>
                    </div>
                  </div>
                  <p className="text-muted small mb-3">{lab.bio || 'Sem descrição.'}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate(`/laboratorios/${lab.id}`)}
                    >
                      Ver Perfil e Notas
                    </Button>
                    <Button variant="outline-primary" onClick={() => selecionarLab(lab.id)}>
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