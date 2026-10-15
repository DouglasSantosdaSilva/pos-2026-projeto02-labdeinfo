import React from 'react'
import { Alert, Button } from 'react-bootstrap'

export function Erro({ mensagem = 'Não foi possível carregar os dados.', onTentarDeNovo }) {
  return (
    <Alert variant="danger" className="my-4 text-center">
      <Alert.Heading className="fs-6 fw-bold mb-2">Ocorreu um erro</Alert.Heading>
      <p className="mb-3 text-break">{mensagem}</p>
      {onTentarDeNovo && (
        <Button variant="outline-danger" size="sm" onClick={onTentarDeNovo}>
          Tentar de novo
        </Button>
      )}
    </Alert>
  )
}