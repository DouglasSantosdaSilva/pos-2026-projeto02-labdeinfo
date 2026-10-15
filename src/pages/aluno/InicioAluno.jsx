import React from 'react'
import { Card, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { ReservaItem } from '../../components/ReservaItem'
import { Foto } from '../../components/Foto'

export default function InicioAluno() {
  const navigate = useNavigate()
  const hoje = new Date().toISOString().split('T')[0]

  const { dados: org, carregando: cOrg } = useApi('/organizacao/')
  const { dados: agendamentos, carregando: cAgend, erro, recarregar } = useApi(`/agendamentos/?data_inicio=${hoje}`)

  if (cOrg || cAgend) return <Carregando mensagem="Carregando..." />
  if (erro) return <Erro mensagem="Erro ao carregar seu painel." onTentarDeNovo={recarregar} />

  const lista = agendamentos?.results || agendamentos || []
  // Filtra o primeiro agendamento solicitado/confirmado que ainda não passou
  const proximaReserva = lista.find(a => a.status === 'solicitado' || a.status === 'confirmado')

  return (
    <div>
      {/* Branding da Instituição */}
      <div className="d-flex align-items-center gap-3 mb-4 bg-white p-4 rounded shadow-sm">
        <Foto src={org?.logo} alt={org?.nome} tamanho={64} arredondado={true} />
        <div>
          <h2 className="mb-0 fw-bold">{org?.nome || 'Laboratório de Informática'}</h2>
          <p className="text-muted mb-0 small">{org?.descricao || 'Painel do Aluno'}</p>
        </div>
      </div>

      <Row className="g-4">
        <Col md={8}>
          <h4 className="mb-3">Sua Próxima Reserva</h4>
          {proximaReserva ? (
            <ReservaItem agendamento={proximaReserva} onClick={(id) => navigate(`/reservas/${id}`)} />
          ) : (
            <Card className="p-4 text-center border-0 shadow-sm">
              <p className="text-muted mb-3">Você não tem reservas agendadas no momento.</p>
              <div>
                <Button variant="primary" onClick={() => navigate('/agendar')}>
                  Agendar agora
                </Button>
              </div>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm bg-primary text-white p-3">
            <Card.Body>
              <h5>Precisa usar um computador?</h5>
              <p className="small text-white-50">
                Escolha o serviço, selecione o laboratório e marque seu horário com facilidade.
              </p>
              <Button variant="light" className="fw-bold w-100" onClick={() => navigate('/agendar')}>
                Agendar Horário
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}