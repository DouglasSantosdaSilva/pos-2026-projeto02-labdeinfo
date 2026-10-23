import React from 'react'
import { Form } from 'react-bootstrap'

export function FiltroAtivo({ valor, onChange }) {
  return (
    <Form.Select
      size="sm"
      style={{ width: 'auto' }}
      value={valor === '' ? 'todos' : String(valor)}
      onChange={(e) => {
        const val = e.target.value
        onChange(val === 'todos' ? '' : val)
      }}
    >
      <option value="todos">Todos</option>
      <option value="true">Ativos</option>
      <option value="false">Inativos</option>
    </Form.Select>
  )
}