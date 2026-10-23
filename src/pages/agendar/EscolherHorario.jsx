import React from 'react'
import { Alert, Button, Card } from 'react-bootstrap'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { SeletorData } from '../../components/SeletorData'
import { formatarHora, hoje, somarDias } from '../../formatos'
import { useApi } from '../../hooks/useApi'

export function EscolherHorario() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const servico = params.get('servico')
  const recurso = params.get('recurso')
  const data = params.get('data') ?? hoje()

  let caminho = `/horarios-livres/?servico=${servico}&data=${data}`
  if (recurso) {
    caminho += `&recurso=${recurso}`
  }
  const { dados, erro, carregando, recarregar } = useApi(caminho)

  function mudarData(novaData) {
    const novos = new URLSearchParams(params)
    novos.set('data', novaData)
    setParams(novos, { replace: true })
  }

  function escolher(recursoId, inicio) {
    const escolha = new URLSearchParams({ servico, recurso: recursoId, inicio })
    navigate(`/agendar/confirmar?${escolha}`, {
      state: { voltar: location.pathname + location.search },
    })
  }

  const comHorarios = dados ? dados.filter((item) => item.horarios.length > 0) : []

  return (
    <>
      <small className="text-muted d-block mb-1">Passo 3 de 4</small>
      <h2 className="fw-bold mb-4">Escolha o Horário</h2>

      {location.state?.erro && (
        <Alert variant="warning" className="mb-3">
          {location.state.erro}
        </Alert>
      )}

      <div className="mb-3">
        <SeletorData data={data} onChange={mudarData} min={hoje()} />
      </div>

      {erro && <Erro erro={erro} tentarDeNovo={recarregar} />}
      {carregando && <Carregando />}

      {dados && comHorarios.length === 0 && (
        <Alert variant="info" className="d-flex align-items-center justify-content-between flex-wrap gap-2 my-3">
          <span>Sem horários livres neste dia.</span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => mudarData(somarDias(data, 1))}
          >
            Ver o dia seguinte
          </Button>
        </Alert>
      )}

      {comHorarios.map((item) => (
        <Card key={item.recurso.id} className="mb-3 shadow-sm border-0">
          <Card.Header className="bg-white d-flex align-items-center gap-2 py-3 border-0">
            <Foto src={item.recurso.foto} tamanho={32} />
            <span className="fw-bold">{item.recurso.nome}</span>
          </Card.Header>
          <Card.Body className="pt-0 d-flex flex-wrap gap-2">
            {item.horarios.map((horario) => (
              <Button
                key={horario}
                variant="outline-primary"
                onClick={() => escolher(item.recurso.id, horario)}
              >
                {formatarHora(horario)}
              </Button>
            ))}
          </Card.Body>
        </Card>
      ))}
    </>
  )
}