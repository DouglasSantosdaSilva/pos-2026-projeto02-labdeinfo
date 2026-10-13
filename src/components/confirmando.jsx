import React from 'react'
import { Card, ListGroup, Badge } from 'react-bootstrap'

export function confirmando({ servico, recurso, data, horario, observacoes }) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Header as="h5" className="bg-primary text-white py-3">
        Resumo da Reserva
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <span className="text-muted">Serviço:</span>
          <strong>{servico?.nome || 'Uso de Laboratório'}</strong>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <span className="text-muted">Laboratório:</span>
          <strong>{recurso?.nome || 'Qualquer laboratório disponível'}</strong>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <span className="text-muted">Data e Horário:</span>
          <strong>
            {data} às {horario}
          </strong>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <span className="text-muted">Duração:</span>
          <span>{servico?.duracao_minutos || 60} minutos</span>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
          <span className="text-muted">Preço:</span>
          <Badge bg="success" className="fs-6">
            {servico?.preco ? `R$ ${servico.preco}` : 'Gratuito (R$ 0,00)'}
          </Badge>
        </ListGroup.Item>
        {observacoes && (
          <ListGroup.Item>
            <span className="text-muted d-block mb-1">Observações:</span>
            <span className="fw-medium text-dark">{observacoes}</span>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  )
}