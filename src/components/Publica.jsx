import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Carregando } from './Carregando'

export function Publica() {
  const { usuario, carregando, inicio } = useAuth()

  if (carregando) {
    return <Carregando />
  }

  if (usuario) {
    return <Navigate to={inicio} />
  }

  return (
    <Container style={{ maxWidth: '576px' }} className="py-5">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Outlet />
        </Card.Body>
      </Card>
    </Container>
  )
}