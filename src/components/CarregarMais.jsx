import React from 'react'
import { Button, Spinner } from 'react-bootstrap'

export function CarregarMais({ onClick, carregando = false }) {
  return (
    <div className="d-flex justify-content-center my-4">
      <Button
        variant="outline-primary"
        onClick={onClick}
        disabled={carregando}
        className="px-4 py-2"
      >
        {carregando ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Carregando...
          </>
        ) : (
          'Carregar mais'
        )}
      </Button>
    </div>
  )
}