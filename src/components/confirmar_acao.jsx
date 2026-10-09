import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export function confirmar_acao({
  show,
  onHide,
  onConfirm,
  titulo = 'Confirmar Ação',
  mensagem = 'Tem certeza de que deseja realizar esta ação?',
  textoBotaoConfirmar = 'Confirmar',
  variantBotao = 'danger',
  carregando = false,
}) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0 text-secondary">{mensagem}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={carregando}>
          Cancelar
        </Button>
        <Button variant={variantBotao} onClick={onConfirm} disabled={carregando}>
          {carregando ? 'Aguarde...' : textoBotaoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}