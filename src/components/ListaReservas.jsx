import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { usePaginado } from '../hooks/useApi'
import { Carregando } from './Carregando'
import { CarregarMais } from './CarregarMais'
import { Erro } from './Erro'
import { ReservaItem } from './ReservaItem'

export function ListaReservas({
  caminho,
  vazio = 'Nenhuma reserva encontrada.',
  mostrarUsuario = false,
}) {
  const reservas = usePaginado(caminho)

  if (reservas.erro) {
    return <Erro erro={reservas.erro} tentarDeNovo={reservas.recarregar} />
  }

  return (
    <>
      {!reservas.carregando && reservas.itens.length === 0 && (
        <p className="text-muted my-3">{vazio}</p>
      )}

      {reservas.itens.length > 0 && (
        <ListGroup className="shadow-sm border rounded overflow-hidden mb-3">
          {reservas.itens.map((reserva) => (
            <ReservaItem
              key={reserva.id}
              reserva={reserva}
              mostrarUsuario={mostrarUsuario}
            />
          ))}
        </ListGroup>
      )}

      {reservas.carregando ? (
        <Carregando />
      ) : (
        <CarregarMais lista={reservas} />
      )}
    </>
  )
}