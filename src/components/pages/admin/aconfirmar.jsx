import React, { useState } from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import { useApi } from '../../hooks/useApi'
import { confirmarAgendamento, cancelarAgendamento, mensagemDeErro } from '../../services/api'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { confirmar_acao } from '../../components/confirmar_acao'

export default function AConfirmar() {
  const { dados, carregando, erro, recarregar } = useApi('/agendamentos/?status=solicitado')
  const [processandoId, setProcessandoId] = useState(null)
  const [modalCancelar, setModalCancelar] = useState({ aberto: false, id: null })
  const [erroAcao, setErroAcao] = useState('')

  if (carregando) return <Carregando mensagem="Buscando pedidos a confirmar..." />
  if (erro) return <Erro mensagem="Não foi possível carregar os pedidos." onTentarDeNovo={recarregar} />

  const solicitacoes = dados?.results || dados || []

  const handleConfirmar = async (id) => {
    setProcessandoId(id)
    setErroAcao('')
    try {
      await confirmarAgendamento(id)
      recarregar()
    } catch (err) {
      setErroAcao(mensagemDeErro(err))
    } finally {
      setProcessandoId(null)
    }
  }

  const handleCancelar = async () => {
    if (!modalCancelar.id) return
    setProcessandoId(modalCancelar.id)
    setErroAcao('')
    try {
      await cancelarAgendamento(modalCancelar.id)
      setModalCancelar({ aberto: false, id: null })
      recarregar()
    } catch (err) {
      setErroAcao(mensagemDeErro(err))
    } finally {
      setProcessandoId(null)
    }
  }

  return (
    <div>
      <h2 className="mb-4">Agendamentos A Confirmar</h2>

      {erroAcao && <erro mensagem={erroAcao} />}

      {solicitacoes.length === 0 ? (
        <p className="text-muted">Nenhum pedido para confirmar.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {solicitacoes.map((item) => (
            <Card key={item.id} className="shadow-sm border-0">
              <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="mb-0">{item.servico_nome}</h5>
                    <Badge bg="warning" text="dark">Solicitado</Badge>
                  </div>
                  <p className="mb-1 text-muted">
                    📍 <strong>{item.recurso_nome}</strong> · 👤 <strong>{item.cliente_nome}</strong>
                  </p>
                  <p className="mb-0 small text-secondary">
                    📅 {new Date(item.inicio).toLocaleDateString('pt-BR')} das {new Date(item.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} às {new Date(item.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {item.observacoes && (
                    <small className="d-block mt-2 text-dark bg-light p-2 rounded">
                      <strong>Obs:</strong> {item.observacoes}
                    </small>
                  )}
                </div>

                <div className="d-flex gap-2 align-self-end align-self-md-center">
                  <Button
                    variant="success"
                    size="sm"
                    disabled={processandoId === item.id}
                    onClick={() => handleConfirmar(item.id)}
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={processandoId === item.id}
                    onClick={() => setModalCancelar({ aberto: true, id: item.id })}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <confirmar_acao
        show={modalCancelar.aberto}
        onHide={() => setModalCancelar({ aberto: false, id: null })}
        onConfirm={handleCancelar}
        titulo="Cancelar Agendamento"
        mensagem="Tem certeza de que deseja rejeitar/cancelar este agendamento?"
        carregando={processandoId === modalCancelar.id}
      />
    </div>
  )
}