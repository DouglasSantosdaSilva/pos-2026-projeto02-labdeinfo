import React from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'

export function Filtro({ valor, onChange }) {
  return (
    <ButtonGroup className="mb-3">
      <Button
        variant={valor === 'true' ? 'primary' : 'outline-primary'}
        onClick={() => onChange('true')}
        size="sm"
      >
        Ativos
      </Button>
      <Button
        variant={valor === 'false' ? 'primary' : 'outline-primary'}
        onClick={() => onChange('false')}
        size="sm"
      >
        Inativos
      </Button>
      <Button
        variant={valor === '' ? 'primary' : 'outline-primary'}
        onClick={() => onChange('')}
        size="sm"
      >
        Todos
      </Button>
    </ButtonGroup>
  )
}