import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

export function selecionar_data({ data, onChange, label = 'Selecionar data' }) {
  return (
    <Form.Group as={Row} className="align-items-center mb-3">
      {label && (
        <Form.Label column sm="auto" className="fw-semibold text-secondary">
          {label}:
        </Form.Label>
      )}
      <Col sm="auto">
        <Form.Control
          type="date"
          value={data}
          onChange={(e) => onChange(e.target.value)}
          className="shadow-sm"
        />
      </Col>
    </Form.Group>
  )
}