import React, { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../api/client'
import { Carregando } from '../components/Carregando'
import { Erro } from '../components/Erro'
import { formatarData } from '../formatos'
import { useApi } from '../hooks/useApi'

export function Avaliar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reserva = useApi(`/agendamentos/${id}/`)
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (reserva.erro) return <Erro erro={reserva.erro} tentarDeNovo={reserva.recarregar} />
  if (reserva.carregando) return <Carregando />

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)

    try {
      await api(`/agendamentos/${id}/avaliar/`, {
        method: 'POST',
        body: { nota, comentario },
      })
      navigate(`/reservas/${id}`)
    } catch (err) {
      setErro(mensagemDeErro(err))
      setEnviando(false)
    }
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        <h2 className="fw-bold mb-1">Avaliar Reserva</h2>
        <p className="text-muted small mb-4">
          {reserva.dados.servico_nome || 'Serviço'} com {reserva.dados.recurso_nome}, {formatarData(reserva.dados.inicio)}
        </p>

        {erro && <Alert variant="danger">{erro}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="avaliacaoNota">
            <Form.Label className="fw-medium d-block">Sua nota (1 a 5 estrelas)</Form.Label>
            <div className="d-flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant="link"
                  className="p-1 text-warning fs-3 text-decoration-none shadow-none"
                  onClick={() => setNota(n)}
                >
                  <i className={n <= nota ? 'bi bi-star-fill' : 'bi bi-star'}></i>
                </Button>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-4" controlId="avaliacaoComentario">
            <Form.Label className="fw-medium">Comentário / Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descreva como foi o uso do laboratório ou do equipamento..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={nota === 0 || enviando}
            >
              {enviando ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}