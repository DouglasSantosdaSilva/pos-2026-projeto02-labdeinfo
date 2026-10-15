import React, { useState } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { avaliarAgendamento, mensagemDeErro } from '../../services/api'
import { Estrelas } from '../../components/Estrelas'
import { Erro } from '../../components/Erro'

export default function Avaliar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erroMsg, setErroMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setErroMsg('')

    try {
      await avaliarAgendamento(id, nota, comentario)
      navigate(`/reservas/${id}`)
    } catch (err) {
      setErroMsg(mensagemDeErro(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 max-w-md mx-auto">
      <Card.Body className="p-4">
        <h3 className="mb-2">Avaliar Reserva</h3>
        <p className="text-muted small mb-4">Como foi sua experiência no laboratório?</p>

        {erroMsg && <Erro mensagem={erroMsg} />}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4 text-center">
            <Form.Label className="d-block fw-semibold mb-2">Sua Nota:</Form.Label>
            <Estrelas nota={nota} onChange={setNota} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Comentário (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ex: Computadores rápidos e ambiente limpo."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" className="w-100" onClick={() => navigate(-1)} disabled={enviando}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-100" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}