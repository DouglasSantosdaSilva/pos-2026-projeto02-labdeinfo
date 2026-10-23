import React, { useState } from 'react'
import { Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import { buscarTodas } from '../../api/client'
import { Avaliacao } from '../../components/Avaliacao'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { useApi, usePaginado } from '../../hooks/useApi'

export function Avaliacoes() {
  const [recurso, setRecurso] = useState('')
  const [nota, setNota] = useState('')
  const recursos = useApi('/recursos/', buscarTodas)

  const filtros = new URLSearchParams()
  if (recurso) filtros.set('recurso', recurso)
  if (nota) filtros.set('nota', nota)
  const avaliacoes = usePaginado(`/avaliacoes/?${filtros}`)

  return (
    <>
      <h2 className="fw-bold mb-4">Avaliações</h2>

      <Row className="mb-4 g-3">
        <Col md={8}>
          <Form.Group controlId="filtroLaboratorio">
            <Form.Label className="fw-medium">Laboratório / Recurso</Form.Label>
            <Form.Select
              value={recurso}
              onChange={(e) => setRecurso(e.target.value)}
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

        <Col md={4}>
          <Form.Group controlId="filtroNota">
            <Form.Label className="fw-medium">Nota</Form.Label>
            <Form.Select
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            >
              <option value="">Todas as notas</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'estrela' : 'estrelas'}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {avaliacoes.erro && <Erro erro={avaliacoes.erro} tentarDeNovo={avaliacoes.recarregar} />}

      {!avaliacoes.carregando && !avaliacoes.erro && avaliacoes.itens.length === 0 && (
        <p className="text-muted">Ainda sem avaliações.</p>
      )}

      {avaliacoes.itens.length > 0 && (
        <Card className="shadow-sm border-0 mb-3">
          <ListGroup variant="flush">
            {avaliacoes.itens.map((avaliacao) => (
              <ListGroup.Item key={avaliacao.id} className="p-0 border-0">
                <Avaliacao avaliacao={avaliacao} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}

      {avaliacoes.carregando ? <Carregando /> : <CarregarMais lista={avaliacoes} />}
    </>
  )
}