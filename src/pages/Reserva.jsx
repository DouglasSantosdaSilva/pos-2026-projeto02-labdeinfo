import { useState } from 'react'
import { Alert, Button, Card, ListGroup } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'
import { Carregando } from '../components/Carregando'
import { ConfirmarAcao } from '../components/ConfirmarAcao'
import { Erro } from '../components/Erro'
import { Estrelas } from '../components/Estrelas'
import { StatusReserva } from '../components/StatusReserva'
import { formatarData, formatarHora } from '../formatos'
import { useApi } from '../hooks/useApi'

export function Reserva() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pode } = useAuth()
  const { dados: agendamento, erro, carregando, recarregar } = useApi(`/agendamentos/${id}/`)
  const [erroAcao, setErroAcao] = useState(null)
  const [acao, setAcao] = useState(null)

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />
  if (carregando) return <Carregando />

  const ativa = ['solicitado', 'confirmado'].includes(agendamento.status)
  const duracao = (new Date(agendamento.fim) - new Date(agendamento.inicio)) / 60000

  async function executar(acao) {
    setErroAcao(null)
    try {
      await api(`/agendamentos/${id}/${acao}/`, { method: 'POST' })
      recarregar()
    } catch (erro) {
      setErroAcao(mensagemDeErro(erro))
    }
  }

  function confirmarAcao() {
    executar(acao)
    setAcao(null)
  }

  return (
    <div className="py-2">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
          <h4 className="mb-0">{agendamento.servico_nome}</h4>
          <StatusReserva status={agendamento.status} />
        </Card.Header>

        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Laboratório / Recurso:</strong> {agendamento.recurso_nome}
          </ListGroup.Item>
          {pode('api.view_agendamento') && (
            <ListGroup.Item>
              <strong>Solicitante:</strong> {agendamento.cliente_nome}
            </ListGroup.Item>
          )}
          <ListGroup.Item>
            <strong>Dia:</strong> {formatarData(agendamento.inicio)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Horário:</strong> {formatarHora(agendamento.inicio)} às {formatarHora(agendamento.fim)} ({duracao} min)
          </ListGroup.Item>
          {agendamento.observacoes && (
            <ListGroup.Item>
              <strong>Observações:</strong> {agendamento.observacoes}
            </ListGroup.Item>
          )}
          {agendamento.nota && (
            <ListGroup.Item>
              <strong>Avaliação:</strong> <Estrelas nota={agendamento.nota} />
              {agendamento.comentario && <p className="mb-0 mt-1">{agendamento.comentario}</p>}
            </ListGroup.Item>
          )}
        </ListGroup>

        <Card.Body className="p-3">
          {erroAcao && <Alert variant="danger">{erroAcao}</Alert>}

          <div className="d-flex flex-wrap gap-2">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>

            {pode('api.avaliar_agendamento') && agendamento.status === 'concluido' && !agendamento.nota && (
              <Link to={`/reservas/${id}/avaliar`} className="btn btn-primary">
                <i className="bi bi-star me-1"></i> Avaliar
              </Link>
            )}

            {pode('api.confirmar_agendamento') && agendamento.status === 'solicitado' && (
              <Button variant="primary" onClick={() => setAcao('confirmar')}>
                <i className="bi bi-check-lg me-1"></i> Confirmar
              </Button>
            )}

            {pode('api.concluir_agendamento') && agendamento.status === 'confirmado' && (
              <Button variant="primary" onClick={() => setAcao('concluir')}>
                <i className="bi bi-check2-all me-1"></i> Concluir
              </Button>
            )}

            {pode('api.cancelar_agendamento') && ativa && (
              <Button variant="outline-danger" className="ms-auto" onClick={() => setAcao('cancelar')}>
                Cancelar
              </Button>
            )}
          </div>
        </Card.Body>

        <ConfirmarAcao acao={acao} onConfirmar={confirmarAcao} onFechar={() => setAcao(null)} />
      </Card>
    </div>
  )
}

export default Reserva