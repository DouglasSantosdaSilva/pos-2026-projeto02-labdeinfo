import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { Confirmacao } from '../../components/Confirmacao'
import { Carregando } from '../../components/Carregando'

export default function Confirmar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const servicoId = searchParams.get('servico')
  const recursoId = searchParams.get('recurso')
  const inicioParam = searchParams.get('inicio')
  const dataParam = searchParams.get('data')

  const { dados: servico, carregando: cServ } = useApi(servicoId ? `/servicos/${servicoId}/` : null)
  const { dados: recurso, carregando: cRec } = useApi(recursoId ? `/recursos/${recursoId}/` : null)

  const [observacoes, setObservacoes] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (cServ || cRec) return <Carregando mensagem="Carregando dados da reserva..." />

  const horaFormatada = inicioParam ? (inicioParam.includes('T') ? inicioParam.split('T')[1]?.substring(0, 5) : inicioParam) : '08:00'

  const handleConfirmar = (e) => {
    e.preventDefault()
    setEnviando(true)

    // Simula a resposta do servidor enviando para a tela final de sucesso (Enviado)
    setTimeout(() => {
      const respostaSimulada = {
        id: Math.floor(Math.random() * 8000) + 1000,
        servico: servico?.nome || 'Uso Livre de Computadores',
        recurso: recurso?.nome || 'Laboratório de Informática 01',
        data: dataParam || '2026-10-31',
        horario: horaFormatada,
        observacoes,
        status: 'CONFIRMADA'
      }

      setEnviando(false)
      navigate('/agendar/enviado', { state: { agendamento: respostaSimulada } })
    }, 600)
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="mb-1">Passo 4: Confirmar Agendamento</h2>
      <p className="text-muted mb-4">Revise os detalhes abaixo antes de enviar seu pedido.</p>

      <Confirmacao
        servico={servico}
        recurso={recurso}
        data={dataParam}
        horario={horaFormatada}
        observacoes={observacoes}
      />

      <Form onSubmit={handleConfirmar}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Observações (opcional):</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ex: Vou utilizar softwares de modelagem 3D ou ambiente Linux."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="secondary" className="w-100" onClick={() => navigate(-1)} disabled={enviando}>
            Voltar
          </Button>
          <Button type="submit" variant="success" className="w-100" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Confirmar Reserva'}
          </Button>
        </div>
      </Form>
    </div>
  )
}