import React from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export function NaoEncontrado() {
  const { inicio } = useAuth()

  return (
    <Alert variant="warning" className="my-4 shadow-sm">
      Página não encontrada.{' '}
      <Link to={inicio || '/inicio'} className="alert-link fw-semibold">
        Voltar para o início
      </Link>
    </Alert>
  )
}