import React, { useState } from 'react'
import { Card, Button, ListGroup, Badge } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { cancelarAgendamento, confirmarAgendamento, concluirAgendamento, mensagemDeErro } from '../../services/api'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { StatusReserva } from '../../components/StatusReserva'
import { Estrelas } from '../../components/Estrelas'
import { ConfirmarAcao } from '../../components/ConfirmarAcao'

export default function DetalheReserva({ usuario }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dados: agendamento, carregando, erro, recarregar } = useApi(`/agendamentos/${id}/`)

  const [modalCancelar, setModalCancelar] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [erroAcao, setErroAcao] = useState('')

  if (carregando) return <Carregando mensagem="Buscando detalhes da reserva..." />
  if (erro) return <Erro mensagem="Não foi possível carregar esta reserva." onTentarDeNovo={recarregar} />

  const permissoes = usuario?.permissoes || []
  const isCoordenador = permissoes.includes('api.change_organizacao')

  const { servico_nome, recurso_nome, inicio, fim, status, observacoes, nota, comentario, cliente_nome } = agendamento

  const handleCancelar = async () => {
    setProcessando(true)
    setErroAcao('')
    try {
      await cancelarAgendamento(id)
      setModalCancelar(false)
      recarregar()
    } catch (err) {
      setErroAcao(mensagemDeErro(err))
    } finally {
      setProcessando(false)
    }
  }

  const handleConfirmarCoord = async () => {
    setProcessando(true)
    try {
      await confirmarAgendamento(id)
      recarregar()
    } catch (err) {
      setErroAcao(mensagemDeErro(err))
    } finally {
      setProcessando(false)
    }
  }

  const handleConcluirCoord = async () => {
    setProcessando(true)
    try {
      await concluirAgendamento(id)
      recarregar()
    } catch (err) {
      setErroAcao(mensagemDeErro(err))
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Button variant="outline-secondary" size="sm" className="mb-3" onClick={() => navigate(-1)}>
        &larr; Voltar
      </Button>

      {erroAcao && <Erro mensagem={erroAcao} />}

      <Card className="shadow-sm border-0 mb-4">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{servico_nome}</h5>
          <StatusReserva status={status} />
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <span className="text-muted d-block">Laboratório:</span>
            <strong>{recurso_nome}</strong>
          </ListGroup.Item>
          {isCoordenador && (
            <ListGroup.Item>
              <span className="text-muted d-block">Aluno:</span>
              <strong>{cliente_nome}</strong>
            </ListGroup.Item>
          )}
          <ListGroup.Item>
            <span className="text-muted d-block">Data e Horário:</span>
            <strong>
              {new Date(inicio).toLocaleDateString('pt-BR')} das {new Date(inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} às {new Date(fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </strong>
          </ListGroup.Item>
          {observacoes && (
            <ListGroup.Item>
              <span className="text-muted d-block">Observações:</span>
              <span>{observacoes}</span>
            </ListGroup.Item>
          )}
          {nota && (
            <ListGroup.Item>
              <span className="text-muted d-block mb-1">Avaliação:</span>
              <Estrelas nota={nota} />
              {comentario && <p className="mb-0 mt-1 small text-dark">{comentario}</p>}
            </ListGroup.Item>
          )}
        </ListGroup>

        <Card.Footer className="bg-white py-3 d-flex gap-2 justify-content-end">
          {/* Botões do Coordenador */}
          {isCoordenador && status === 'solicitado' && permissoes.includes('api.confirmar_agendamento') && (
            <Button variant="success" onClick={handleConfirmarCoord} disabled={processando}>
              Confirmar
            </Button>
          )}
          {isCoordenador && status === 'confirmado' && permissoes.includes('api.concluir_agendamento') && (
            <Button variant="primary" onClick={handleConcluirCoord} disabled={processando}>
              Concluir
            </Button>
          )}

          {/* Botão Avaliar para o Aluno */}
          {!isCoordenador && status === 'concluido' && !nota && permissoes.includes('api.avaliar_agendamento') && (
            <Button variant="warning" onClick={() => navigate(`/reservas/${id}/avaliar`)}>
              Avaliar
            </Button>
          )}

          {/* Botão Cancelar */}
          {(status === 'solicitado' || status === 'confirmado') && permissoes.includes('api.cancelar_agendamento') && (
            <Button variant="outline-danger" onClick={() => setModalCancelar(true)} disabled={processando}>
              Cancelar Reserva
            </Button>
          )}
        </Card.Footer>
      </Card>

      <ConfirmarAcao
        show={modalCancelar}
        onHide={() => setModalCancelar(false)}
        onConfirm={handleCancelar}
        titulo="Cancelar Reserva"
        mensagem="Tem certeza de que deseja cancelar esta reserva?"
        carregando={processando}
      />
    </div>
  )
}