import React, { useState } from 'react'
import { Card, Button, Form, Row, Col, Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { criarDisponibilidade, excluirDisponibilidade, mensagemDeErro } from '../../services/api'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'

const DIAS = [
  { id: 0, nome: 'Segunda-feira' },
  { id: 1, nome: 'Terça-feira' },
  { id: 2, nome: 'Quarta-feira' },
  { id: 3, nome: 'Quinta-feira' },
  { id: 4, nome: 'Sexta-feira' },
  { id: 5, nome: 'Sábado' },
  { id: 6, nome: 'Domingo' },
]

export default function horarios() {
  const { id } = useParams()
  const { dados: lab } = useApi(`/recursos/${id}/`)
  const { dados: disponibilidades, carregando, erro, recarregar } = useApi(`/disponibilidades/?recurso=${id}`)

  const [dia, setDia] = useState(0)
  const [inicio, setInicio] = useState('08:00')
  const [fim, setFim] = useState('12:00')
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  if (carregando) return <Carregando mensagem="Carregando horários..." />
  if (erro) return <Erro mensagem="Erro ao buscar disponibilidades." onTentarDeNovo={recarregar} />

  const lista = disponibilidades?.results || disponibilidades || []

  const handleAdicionar = async (e) => {
    e.preventDefault()
    setSalvando(true)
    setErroForm('')

    try {
      await criarDisponibilidade({
        recurso: Number(id),
        dia_semana: Number(dia),
        inicio,
        fim,
      })
      recarregar()
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async (dispId) => {
    try {
      await excluirDisponibilidade(dispId)
      recarregar()
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    }
  }

  return (
    <div>
      <h2 className="mb-1">Horários do Laboratório</h2>
      <p className="text-muted mb-4">{lab?.nome || 'Laboratório'}</p>

      {erroForm && <Erro mensagem={erroForm} />}

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="card-title mb-3">Adicionar Faixa de Horário</h5>
          <Form onSubmit={handleAdicionar}>
            <Row className="g-3 align-items-end">
              <Col md={4}>
                <Form.Label>Dia da Semana</Form.Label>
                <Form.Select value={dia} onChange={(e) => setDia(e.target.value)}>
                  {DIAS.map((d) => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Horário Início</Form.Label>
                <Form.Control type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
              </Col>
              <Col md={3}>
                <Form.Label>Horário Fim</Form.Label>
                <Form.Control type="time" value={fim} onChange={(e) => setFim(e.target.value)} required />
              </Col>
              <Col md={2}>
                <Button type="submit" variant="primary" className="w-100" disabled={salvando}>
                  Adicionar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {lista.length === 0 ? (
            <p className="text-muted text-center my-3">
              Sem horários: ninguém consegue agendar neste laboratório.
            </p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Dia da Semana</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((item) => (
                  <tr key={item.id}>
                    <td>{DIAS.find((d) => d.id === item.dia_semana)?.nome || item.dia_semana}</td>
                    <td>{item.inicio}</td>
                    <td>{item.fim}</td>
                    <td className="text-end">
                      <Button variant="outline-danger" size="sm" onClick={() => handleExcluir(item.id)}>
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}