import React, { useState } from 'react'
import { Alert, Button, Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { api, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { ConfirmarAcao } from '../../components/ConfirmarAcao'
import { Erro } from '../../components/Erro'
import { formatarData, formatarHora } from '../../formatos'
import { usePaginado } from '../../hooks/useApi'

export function AConfirmar() {
  const pedidos = usePaginado('/agendamentos/?status=solicitado')
  const [pendente, setPendente] = useState(null)
  const [erroAcao, setErroAcao] = useState(null)

  async function executar(id, acao) {
    setErroAcao(null)
    try {
      await api(`/agendamentos/${id}/${acao}/`, { method: 'POST' })
      pedidos.recarregar()
    } catch (erro) {
      setErroAcao(mensagemDeErro(erro))
    }
  }

  function confirmarAcao() {
    executar(pendente.id, pendente.acao)
    setPendente(null)
  }

  if (pedidos.erro) return <Erro erro={pedidos.erro} tentarDeNovo={pedidos.recarregar} />

  return (
    <>
      <h2 className="fw-bold mb-4">Reservas a Confirmar</h2>

      {erroAcao && <Alert variant="danger">{erroAcao}</Alert>}

      {!pedidos.carregando && pedidos.itens.length === 0 && (
        <Alert variant="success">Nenhuma reserva pendente para confirmação.</Alert>
      )}

      {pedidos.itens.length > 0 && (
        <Card className="shadow-sm border-0 mb-3">
          <ListGroup variant="flush">
            {pedidos.itens.map((reserva) => (
              <ListGroup.Item key={reserva.id} className="p-3">
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div className="text-center">
                    <div className="fw-bold">{formatarHora(reserva.inicio)}</div>
                    <small className="text-muted">{formatarData(reserva.inicio)}</small>
                  </div>

                  <div className="me-auto">
                    <Link
                      to={`/reservas/${reserva.id}`}
                      className="fw-semibold text-decoration-none text-dark d-block"
                    >
                      {reserva.servico_nome}
                    </Link>
                    <div>
                      <small className="text-muted">
                        {reserva.recurso_nome} · {reserva.cliente_nome}
                      </small>
                    </div>
                    {reserva.observacoes && (
                      <div>
                        <small className="fst-italic text-secondary">{reserva.observacoes}</small>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setPendente({ id: reserva.id, acao: 'confirmar' })}
                    >
                      <i className="bi bi-check-lg me-1"></i> Confirmar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setPendente({ id: reserva.id, acao: 'cancelar' })}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}

      {pedidos.carregando ? <Carregando /> : <CarregarMais lista={pedidos} />}

      <ConfirmarAcao
        acao={pendente?.acao ?? null}
        onConfirmar={confirmarAcao}
        onFechar={() => setPendente(null)}
      />
    </>
  )
}