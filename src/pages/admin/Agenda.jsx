import React from 'react'
import { Alert, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { buscarTodas } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { ReservaItem } from '../../components/ReservaItem'
import { SeletorData } from '../../components/SeletorData'
import { hoje } from '../../formatos'
import { useApi } from '../../hooks/useApi'

export function Agenda() {
  const [params, setParams] = useSearchParams()
  const data = params.get('data') ?? hoje()
  const recurso = params.get('recurso') ?? ''

  let caminho = `/agendamentos/?data_inicio=${data}&data_fim=${data}`
  if (recurso) {
    caminho += `&recurso=${recurso}`
  }
  const reservas = useApi(caminho, buscarTodas)
  const recursos = useApi('/recursos/', buscarTodas)

  function mudar(nome, valor) {
    const novos = new URLSearchParams(params)
    if (valor) {
      novos.set(nome, valor)
    } else {
      novos.delete(nome)
    }
    setParams(novos, { replace: true })
  }

  return (
    <>
      <h2 className="fw-bold mb-4">Agenda do Dia</h2>

      <Row className="mb-4 g-3">
        <Col md={6}>
          <Form.Group controlId="seletorDataAgenda">
            <Form.Label className="fw-medium">Data</Form.Label>
            <SeletorData data={data} onChange={(valor) => mudar('data', valor)} />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="seletorLaboratorioAgenda">
            <Form.Label className="fw-medium">Laboratório / Recurso</Form.Label>
            <Form.Select
              value={recurso}
              onChange={(e) => mudar('recurso', e.target.value)}
            >
              <option value="">Todos os laboratórios</option>
              {recursos.dados?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {reservas.erro && <Erro erro={reservas.erro} tentarDeNovo={reservas.recarregar} />}
      {reservas.carregando && <Carregando />}

      {!reservas.carregando && reservas.dados?.length === 0 && (
        <Alert variant="info">Nenhuma reserva para este dia.</Alert>
      )}

      {reservas.dados && reservas.dados.length > 0 && (
        <Card className="shadow-sm border-0">
          <ListGroup variant="flush">
            {reservas.dados.map((reserva) => (
              <ListGroup.Item key={reserva.id} className="p-0 border-0">
                <ReservaItem reserva={reserva} mostrarAluno />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </>
  )
}