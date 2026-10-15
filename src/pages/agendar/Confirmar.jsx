import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { criarAgendamento, mensagemDeErro } from '../../services/api'
import { Confirmacao } from '../../components/Confirmacao'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'

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
  const [erroEnvio, setErroEnvio] = useState('')

  if (cServ || cRec) return <Carregando mensagem="Carregando dados da reserva..." />

  const horaFormatada = inicioParam ? inicioParam.split('T')[1]?.substring(0, 5) : ''

  const handleConfirmar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setErroEnvio('')

    const payload = {
      servico: Number(servicoId),
      inicio: inicioParam.includes(':00:00') ? inicioParam : `${inicioParam}:00`,
      observacoes,
    }

    if (recursoId) {
      payload.recurso = Number(recursoId)
    }

    try {
      const resposta = await criarAgendamento(payload)
      // Vai para a tela C6 levando a resposta da reserva criada
      navigate('/agendar/enviado', { state: { agendamento: resposta } })
    } catch (err) {
      const msg = mensagemDeErro(err)
      setErroEnvio(msg)
      // Tratamento da regra 400 em inicio: Vaga acabou ou sobreposição
      if (err.status === 400 && err.dados?.inicio) {
        setTimeout(() => {
          navigate(`/agendar/horario?servico=${servicoId}${recursoId ? `&recurso=${recursoId}` : ''}`)
        }, 3000)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="mb-1">Passo 4: Confirmar Agendamento</h2>
      <p className="text-muted mb-4">Revise os detalhes abaixo antes de enviar seu pedido.</p>

      {erroEnvio && <Erro mensagem={erroEnvio} />}

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