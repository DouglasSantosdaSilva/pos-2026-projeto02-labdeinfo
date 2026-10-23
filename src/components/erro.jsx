import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { mensagemDeErro } from '../api/client'

export function Erro({ erro, tentarDeNovo }) {
  const navigate = useNavigate()

  return (
    <Alert variant="danger" className="d-flex align-items-center">
      <i className="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
      <span className="me-auto">{mensagemDeErro(erro)}</span>
      {erro?.status === 404 ? (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
      ) : (
        tentarDeNovo && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={tentarDeNovo}
          >
            Tentar de novo
          </Button>
        )
      )}
    </Alert>
  )
}