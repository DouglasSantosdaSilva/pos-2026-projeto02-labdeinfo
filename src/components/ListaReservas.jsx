import React from 'react'
import ReservaItem from './ReservarItem'
import Carregando from './Carregando'
import Erro from './Erro'
import CarregarMais from './CarregarMais'

export default function ListaReservas({ 
  reservas, 
  carregando, 
  erro, 
  onRecarregar, 
  temMais, 
  onCarregarMais,
  onSelectReserva,
  mensagemVazia = "Nenhuma reserva encontrada." 
}) {
  if (carregando && reservas.length === 0) {
    return <Carregando />
  }

  if (erro && reservas.length === 0) {
    return <Erro mensagem={erro} onTentarDeNovo={onRecarregar} />
  }

  if (reservas.length === 0) {
    return <p className="lista-vazia">{mensagemVazia}</p>
  }

  return (
    <div className="lista-reservas-container">
      <div className="lista-reservas-grid">
        {reservas.map((reserva) => (
          <ReservaItem 
            key={reserva.id} 
            agendamento={reserva} 
            onClick={onSelectReserva} 
          />
        ))}
      </div>

      {temMais && (
        <CarregarMais onClick={onCarregarMais} carregando={carregando} />
      )}
    </div>
  )
}