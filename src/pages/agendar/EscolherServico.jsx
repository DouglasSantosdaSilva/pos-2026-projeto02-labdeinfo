import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'

export default function EscolherServico() {
  const navigate = useNavigate()
  const { dados, carregando, erro, recarregar } = useApi('/servicos/')

  if (carregando) return <Carregando mensagem="Carregando serviços disponíveis..." />
  if (erro) return <Erro mensagem="Erro ao carregar os serviços." onTentarDeNovo={recarregar} />

  const servicos = dados?.results || (Array.isArray(dados) ? dados : [])

  const handleSelecionar = (servico) => {
    // Passa o parâmetro 'servico' com o ID exato que o EscolherLaboratorio exige
    navigate(`/agendar/laboratorio?servico=${servico.id}`)
  }

  return (
    <div>
      <h3 className="mb-1">Passo 1: Escolher Serviço</h3>
      <p className="text-muted mb-4">Selecione o tipo de uso do laboratório de informática.</p>

      {servicos.length === 0 ? (
        <p className="text-muted">Nenhum serviço disponível no momento.</p>
      ) : (
        <Row className="g-3">
          {servicos.map((servico) => (
            <Col md={6} key={servico.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column justify-content-between py-4">
                  <div>
                    <Card.Title className="h5 fw-bold">{servico.nome}</Card.Title>
                    {servico.descricao && (
                      <Card.Text className="text-secondary mt-2 small">
                        {servico.descricao}
                      </Card.Text>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    className="mt-3 w-100 fw-semibold"
                    onClick={() => handleSelecionar(servico)}
                  >
                    Selecionar
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