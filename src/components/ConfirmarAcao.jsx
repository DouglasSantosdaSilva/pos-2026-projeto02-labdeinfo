import React from 'react'
import { Confirmacao } from './Confirmacao'

const ACOES = {
  confirmar: {
    titulo: 'Confirmar reserva',
    mensagem: 'Deseja confirmar esta reserva?',
    variante: 'success',
  },
  concluir: {
    titulo: 'Concluir reserva',
    mensagem: 'Deseja marcar esta reserva como concluída?',
    variante: 'success',
  },
  cancelar: {
    titulo: 'Cancelar reserva',
    mensagem: 'Deseja mesmo cancelar esta reserva?',
    variante: 'danger',
  },
}

export function ConfirmarAcao({ acao, onConfirmar, onFechar }) {
  if (!acao) return null

  const { titulo, mensagem, variante } = ACOES[acao] ?? ACOES.confirmar

  return (
    <Confirmacao
      show={acao !== null}
      titulo={titulo}
      mensagem={mensagem}
      textoConfirmar={titulo}
      variante={variante}
      onConfirmar={onConfirmar}
      onFechar={onFechar}
    />
  )
}