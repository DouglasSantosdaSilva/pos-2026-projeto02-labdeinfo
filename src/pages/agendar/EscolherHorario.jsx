import React, { useState } from 'react'
import { Card, Button, Row, Col, Badge } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { SeletorData } from '../../components/SeletorData'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'

export default function EscolherHorario() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const servicoId = searchParams.get('servico')
  const recursoId = searchParams.get('recurso')

  const hoje = new Date().toISOString().split('T')[0]
  const [data, setData] = useState(hoje)

  let url = `/horarios-livres/?servico=${servicoId}&data=${data}`
  if (recursoId) url += `&recurso=${recursoId}`

  const { dados, carregando, erro, recarregar } = useApi(servicoId ? url : null)

  if (!servicoId) {
    navigate('/agendar')
    return null
  }

  const horariosPorRecurso = Array.isArray(dados) 
  ? dados 
  : (dados?.results || [])

  // Regra da Seção 6: O app filtra e mostra apenas os horários de hora cheia (:00)
  const filtrarHoraCheia = (horarios) => {
    if (!Array.isArray(horarios)) return []
    return horarios.filter((item) => {
      const horaInicio = item.inicio || item
      return horaInicio.endsWith(':00') || horaInicio.endsWith(':00:00')
    })
  }

  const selecionarHorario = (labId, horaInicio) => {
    let proximaUrl = `/agendar/confirmar?servico=${servicoId}&data=${data}&inicio=${data}T${horaInicio}`
    if (labId) proximaUrl += `&recurso=${labId}`
    navigate(proximaUrl)
  }

  return (
    <div>
      <h2 className="mb-1">Passo 3: Escolher Data e Horário</h2>
      <p className="text-muted mb-4">Selecione o dia e um horário livre de hora cheia para sua reserva.</p>

      <Row className="mb-4">
        <Col md={4}>
          <SeletorData data={data} onChange={setData} label="Data da Reserva" />
        </Col>
      </Row>

      {carregando && <Carregando mensagem="Buscando horários livres..." />}
      {erro && <Erro mensagem="Não foi possível buscar os horários livres." onTentarDeNovo={recarregar} />}

      {!carregando && !erro && horariosPorRecurso.length === 0 ? (
        <Card className="p-4 text-center border-0 shadow-sm">
          <p className="text-muted mb-0">
            Sem horários livres neste dia. Tente escolher outra data no seletor acima.
          </p>
        </Card>
      ) : (
        !carregando &&
        !erro && (
          <div className="d-flex flex-column gap-4">
            {horariosPorRecurso.map((item, idx) => {
              const labNome = item.recurso_nome || 'Laboratório'
              const labId = item.recurso || recursoId
              const horasCheias = filtrarHoraCheia(item.horarios || [])

              return (
                <Card key={idx} className="shadow-sm border-0">
                  <Card.Header className="bg-white py-3 fw-bold border-bottom">
                    📍 {labNome}
                  </Card.Header>
                  <Card.Body>
                    {horasCheias.length === 0 ? (
                      <span className="text-muted small">Sem horários de hora cheia para esta data.</span>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {horasCheias.map((h, hIdx) => {
                          const horaFormatada = typeof h === 'string' ? h.substring(0, 5) : h.inicio.substring(0, 5)
                          return (
                            <Button
                              key={hIdx}
                              variant="outline-primary"
                              onClick={() => selecionarHorario(labId, horaFormatada)}
                            >
                              🕒 {horaFormatada}
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}