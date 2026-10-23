import React, { useState } from 'react'
import { Alert, Button, Card, Form, ListGroup, Modal } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { api, buscarTodas, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Confirmacao } from '../../components/Confirmacao'
import { Erro } from '../../components/Erro'
import { useApi } from '../../hooks/useApi'

const DIAS = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']

export function Horarios() {
  const { id } = useParams()
  const recurso = useApi(`/recursos/${id}/`)
  const horarios = useApi(`/disponibilidades/?recurso=${id}`, buscarTodas)
  const [editando, setEditando] = useState(null)
  const [removendo, setRemovendo] = useState(null)
  const [erro, setErro] = useState(null)

  if (recurso.erro) return <Erro erro={recurso.erro} tentarDeNovo={recurso.recarregar} />
  if (horarios.erro) return <Erro erro={horarios.erro} tentarDeNovo={horarios.recarregar} />
  if (recurso.carregando || horarios.carregando) return <Carregando />

  async function remover() {
    setErro(null)
    try {
      await api(`/disponibilidades/${removendo}/`, { method: 'DELETE' })
      horarios.recarregar()
    } catch (err) {
      setErro(mensagemDeErro(err))
    }
    setRemovendo(null)
  }

  function salvo() {
    setEditando(null)
    horarios.recarregar()
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-0">Horários de Funcionamento</h2>
          <span className="text-muted fs-6">{recurso.dados.nome}</span>
        </div>
        <Button as={Link} to={`/admin/laboratorios/${id}`} variant="outline-secondary">
          Voltar
        </Button>
      </div>

      {erro && <Alert variant="danger">{erro}</Alert>}
      {horarios.dados.length === 0 && (
        <Alert variant="warning">
          Sem horários definidos: ninguém conseguirá realizar reservas neste laboratório.
        </Alert>
      )}

      {DIAS.map((nome, dia) => (
        <Card key={dia} className="mb-3 shadow-sm border-0">
          <Card.Header className="bg-white d-flex align-items-center justify-content-between py-3">
            <span className="fw-bold">{nome}</span>
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => setEditando({ dia_semana: dia, hora_inicio: '', hora_fim: '' })}
            >
              <i className="bi bi-plus-lg me-1"></i> Adicionar Horário
            </Button>
          </Card.Header>
          <ListGroup variant="flush">
            {horarios.dados
              .filter((h) => h.dia_semana === dia)
              .map((h) => (
                <ListGroup.Item key={h.id} className="d-flex align-items-center justify-content-between p-3">
                  <span className="fw-medium">
                    {h.hora_inicio.slice(0, 5)} às {h.hora_fim.slice(0, 5)}
                  </span>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => setEditando(h)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => setRemovendo(h.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Card>
      ))}

      {editando && (
        <FormHorario
          recurso={id}
          horario={editando}
          onSalvo={salvo}
          onFechar={() => setEditando(null)}
        />
      )}

      <Confirmacao
        show={removendo !== null}
        titulo="Remover horário"
        mensagem="Deseja mesmo remover esta faixa de horário de funcionamento?"
        textoConfirmar="Remover"
        variante="danger"
        onConfirmar={remover}
        onFechar={() => setRemovendo(null)}
      />
    </>
  )
}

function FormHorario({ recurso, horario, onSalvo, onFechar }) {
  const [dia, setDia] = useState(horario.dia_semana)
  const [inicio, setInicio] = useState(horario.hora_inicio ? horario.hora_inicio.slice(0, 5) : '')
  const [fim, setFim] = useState(horario.hora_fim ? horario.hora_fim.slice(0, 5) : '')
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})
    const corpo = { recurso, dia_semana: dia, hora_inicio: inicio, hora_fim: fim }
    try {
      if (horario.id) {
        await api(`/disponibilidades/${horario.id}/`, { method: 'PATCH', body: corpo })
      } else {
        await api('/disponibilidades/', { method: 'POST', body: corpo })
      }
      onSalvo()
    } catch (err) {
      setErro(mensagemDeErro(err))
      setErros(err.dados ?? {})
    }
  }

  return (
    <Modal show onHide={onFechar} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            {horario.id ? 'Editar Horário' : 'Novo Horário'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          {erro && <Alert variant="danger">{erro}</Alert>}

          <Form.Group controlId="diaSemana">
            <Form.Label className="fw-medium">Dia da semana</Form.Label>
            <Form.Select
              value={String(dia)}
              onChange={(e) => setDia(Number(e.target.value))}
            >
              {DIAS.map((nome, i) => (
                <option key={i} value={i}>
                  {nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="horaInicio">
            <Form.Label className="fw-medium">Início</Form.Label>
            <Form.Control
              type="time"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              isInvalid={!!erros.hora_inicio}
              required
            />
            <Form.Control.Feedback type="invalid">
              {erros.hora_inicio?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="horaFim">
            <Form.Label className="fw-medium">Fim</Form.Label>
            <Form.Control
              type="time"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              isInvalid={!!erros.hora_fim}
              required
            />
            <Form.Control.Feedback type="invalid">
              {erros.hora_fim?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onFechar}>
            Voltar
          </Button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}