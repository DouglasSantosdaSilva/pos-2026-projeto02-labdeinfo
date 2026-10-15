import React from 'react'
import { Container } from 'react-bootstrap'
import { Menu } from './Menu'

export function Layout({ children, usuario, onLogout }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Menu usuario={usuario} onLogout={onLogout} />
      <Container className="flex-grow-1 pb-5">{children}</Container>
      <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
        <Container>
          &copy; {new Date().getFullYear()} Laboratório de Informática · Sistema de Reservas
        </Container>
      </footer>
    </div>
  )
}