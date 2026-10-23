import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { ListaReservas } from '../components/ListaReservas'
import { hoje, somarDias } from '../formatos'

export function MinhasReservas() {
  const [key, setKey] = useState('proximos')

  return (
    <>
      <h2 className="fw-bold mb-4">Minhas Reservas</h2>

      <Tabs
        id="minhas-reservas-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 border-bottom"
      >
        <Tab eventKey="proximos" title="Próximas">
          <div className="pt-2">
            <ListaReservas caminho={`/agendamentos/?data_inicio=${hoje()}`} />
          </div>
        </Tab>
        
        <Tab eventKey="historico" title="Histórico">
          <div className="pt-2">
            <ListaReservas caminho={`/agendamentos/?data_fim=${somarDias(hoje(), -1)}&ordering=-inicio`} />
          </div>
        </Tab>
      </Tabs>
    </>
  )
}