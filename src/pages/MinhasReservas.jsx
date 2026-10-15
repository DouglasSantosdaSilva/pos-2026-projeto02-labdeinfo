import React, { useState } from 'react'
import { Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { usePaginado } from '../hooks/useApi'
import { ListaReservas } from '../../components/ListaReservas'

export default function minhas_reservas() {
  const navigate = useNavigate()
  const [aba, setAba] = useState('proximos')

  const hoje = new Date().toISOString().split('T')[0]
  const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const url = aba === 'proximos' 
    ? `/agendamentos/?data_inicio=${hoje}` 
    : `/agendamentos/?data_fim=${ontem}&ordering=-inicio`

  const { itens, erro, carregando, temMais, carregarMais, recarregar } = usePaginado(url)

  return (
    <div>
      <h2 className="mb-4">Minhas Reservas</h2>

      <Nav variant="tabs" activeKey={aba} onSelect={(k) => setAba(k)} className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="proximos">Próximos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="historico">Histórico</Nav.Link>
        </Nav.Item>
      </Nav>

      <ListaReservas
        reservas={itens}
        carregando={carregando}
        erro={erro}
        temMais={temMais}
        onCarregarMais={carregarMais}
        onRecarregar={recarregar}
        onSelectReserva={(id) => navigate(`/reservas/${id}`)}
        mensagemVazia={aba === 'proximos' ? 'Nenhuma reserva agendada.' : 'Histórico de reservas vazio.'}
      />
    </div>
  )
}