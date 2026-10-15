import React from 'react'
import { Container, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NaoEncontrado() {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Card className="text-center p-4 p-md-5 shadow-sm border-0" style={{ maxWidth: '480px', width: '100%' }}>
        <Card.Body>
          <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
          <h2 className="h4 text-dark mb-3">Página não encontrada</h2>
          <p className="text-muted mb-4">
            A página que está a tentar navegar não existe, foi movida ou o endereço inserido está incorreto.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg" className="w-100">
            Voltar ao Início
          </Button>
        </Card.Body>
      </Card>
    </Container>
  )
}