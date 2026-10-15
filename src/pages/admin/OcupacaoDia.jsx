import React, { useState } from 'react'
import { Card, Row, Col, Badge, ListGroup, Form } from 'react-bootstrap'
import { useApi } from '../../hooks/useApi'
import { SeletorData } from '../../components/SeletorData'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { StatusReserva } from '../../components/StatusReserva'
import { useNavigate } from 'react-router-dom'

export default function OcupacaoDia() {
  const navigate = useNavigate()
  const hoje = new Date().toISOString().split('T')[0]
  const [data, setData] = useState(hoje)
  const [labSelecionado, setLabSelecionado] = useState('')

  const { dados: labs, Carregando: cLabs, erro: eLabs } = useApi('/recursos/')
  
  let urlAgendamentos = `/agendamentos/?data_inicio=${data}&data_fim=${data}`
  if (labSelecionado) urlAgendamentos += `&recurso=${labSelecionado}`
  
  const { dados: resAgendamentos, carregando: cAgend, erro: eAgend, recarregar } = useApi(urlAgendamentos)

  if (cLabs || cAgend) return <carregando mensagem="Buscando ocupação do dia..." />
  if (eLabs || eAgend) return <erro mensagem="Erro ao carregar dados de ocupação." onTentarDeNovo={recarregar} />

  const laboratorios = labs?.results || labs || []
  const agendamentos = resAgendamentos?.results || resAgendamentos || []

  // Agrupa os agendamentos ativos por laboratório
  const agendamentosAtivos = agendamentos.filter(a => a.status === 'solicitado' || a.status === 'confirmado')

  return (
    <div>
      <h2 className="mb-4">Ocupação do Dia</h2>

      <Row className="mb-4 align-items-center">
        <Col md={4}>
          <selecionar_data data={data} onChange={setData} label="Data" />
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-secondary">Filtrar por Laboratório:</Form.Label>
            <Form.Select value={labSelecionado} onChange={(e) => setLabSelecionado(e.target.value)}>
              <Option value="">Todos os Laboratórios</Option>
              {laboratorios.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {laboratorios.length === 0 ? (
        <p className="text-muted">Nenhum laboratório cadastrado.</p>
      ) : (
        <Row className="g-4">
          {laboratorios
            .filter(lab => !labSelecionado || lab.id === Number(labSelecionado))
            .map((lab) => {
              const reservarlab = agendamentosAtivos.filter(a => a.recurso === lab.id)
              const capacidade = lab.capacidade || 1

              return (
                <Col md={6} key={lab.id}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                      <h5 className="mb-0">{lab.nome}</h5>
                      <Badge bg="light" text="dark" className="fs-6">
                        Ocupação: {reservarlab.length} / {capacidade} computadores
                      </Badge>
                    </Card.Header>
                    <ListGroup variant="flush">
                      {reservarlab.length === 0 ? (
                        <ListGroup.Item className="text-muted py-3">
                          Nenhuma reserva neste dia.
                        </ListGroup.Item>
                      ) : (
                        reservarlab.map((item) => (
                          <ListGroup.Item
                            key={item.id}
                            action
                            onClick={() => navigate(`/admin/reserva/${item.id}`)}
                            className="d-flex justify-content-between align-items-center py-3"
                          >
                            <div>
                              <strong>
                                {new Date(item.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} às {new Date(item.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </strong>
                              <div className="small text-muted">{item.cliente_nome} · {item.servico_nome}</div>
                            </div>
                            <StatusReserva status={item.status} />
                          </ListGroup.Item>
                        ))
                      )}
                    </ListGroup>
                  </Card>
                </Col>
              )
            })}
        </Row>
      )}
    </div>
  )
}