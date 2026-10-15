import React from 'react'
import { Modal, Button } from 'react-bootstrap'

// Adicione o 'export' na função:
export function Confirmacao({ show, onHide, onConfirm, titulo, mensagem, textoBotao = 'Confirmar', variant = 'primary' }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo || 'Confirmação'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{mensagem || 'Tem certeza de que deseja prosseguir?'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {textoBotao}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Confirmacao