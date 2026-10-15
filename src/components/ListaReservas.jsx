import React from "react";
import { ReservaItem } from "./ReservaItem";
import { Carregando } from "./Carregando";
import { Erro } from "./Erro";

export function ListaReservas({ reservas, carregando, erro, onCancelar }) {
  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} />;

  if (!reservas || reservas.length === 0) {
    return <p className="text-muted text-center my-4">Nenhuma reserva encontrada.</p>;
  }

  return (
    <div className="lista-reservas">
      {reservas.map((reserva) => (
        <ReservaItem key={reserva.id} reserva={reserva} onCancelar={onCancelar} />
      ))}
    </div>
  );
}

export default ListaReservas;