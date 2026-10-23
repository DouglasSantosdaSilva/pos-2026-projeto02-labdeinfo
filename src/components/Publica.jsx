import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Card, Container } from 'react-bootstrap'
import { useAuth } from '../AuthContext'
import { Carregando } from './Carregando'

export function Publica({ titulo, subTitulo, children }) {
  const { usuario, carregando, inicio } = useAuth()

  // 1. Exibe indicador de carregamento durante verificação da sessão
  if (carregando) {
    return <Carregando />
  }

  // 2. Se o usuário já está logado, redireciona para a página inicial correspondente
  if (usuario) {
    return <Navigate to={inicio || '/inicio'} replace />
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <Container style={{ maxWidth: '480px' }}>
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="p-4 p-md-5">
            {/* Título opcional caso a página passe como prop */}
            {titulo && (
              <div className="text-center mb-4">
                <h2 className="fw-bold h4 mb-1">{titulo}</h2>
                {subTitulo && <p className="text-muted small mb-0">{subTitulo}</p>}
              </div>
            )}

            {/* Suporta tanto o uso como Rota Pai (<Outlet />) quanto Componente Envelope ({children}) */}
            {children || <Outlet />}
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}