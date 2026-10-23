import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Row, Col } from 'react-bootstrap'
import { api } from '../api/client'
import { useAuth } from '../AuthContext'
import { Carregando } from '../components/Carregando'
import { ReservaItem } from '../components/ReservaItem'
import { Erro } from '../components/Erro'
import { hoje } from '../formatos'
import { useApi } from '../hooks/useApi'

function ehProxima(reserva) {
  return ['solicitado', 'confirmado'].includes(reserva.status) && new Date(reserva.fim) > new Date()
}

// Percorre as páginas até achar a primeira reserva que ainda não passou
async function buscarProximaReserva(caminho) {
  let proxima = caminho
  while (proxima) {
    const dados = await api(proxima)
    if (!dados || !dados.results) break
    const reserva = dados.results.find(ehProxima)
    if (reserva) return reserva
    proxima = dados.next
  }
  return null
}

export function Inicio() {
  const { usuario } = useAuth()
  const organizacao = useApi('/organizacao/')
  const reserva = useApi(`/agendamentos/?data_inicio=${hoje()}`, buscarProximaReserva)

  if (organizacao.erro) return <Erro erro={organizacao.erro} tentarDeNovo={organizacao.recarregar} />
  if (reserva.erro) return <Erro erro={reserva.erro} tentarDeNovo={reserva.recarregar} />
  if (organizacao.carregando || reserva.carregando) return <Carregando />

  const { nome, descricao, logo } = organizacao.dados || {
    nome: 'Laboratório de Informática',
    descricao: 'Sistema de reserva de computadores e salas de laboratório.',
    logo: null,
  }

  return (
    <Row className="g-4 align-items-stretch">
      {/* Informações da Organização / Lab */}
      <Col md={5}>
        <Card className="text-center shadow-sm border-0 h-100">
          <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
            <img 
              src={logo ?? '/logo.png'} 
              alt={nome} 
              className="img-fluid mb-3 rounded" 
              style={{ maxHeight: '180px', objectFit: 'contain' }} 
              onError={(e) => { e.target.src = '/favicon.png' }}
            />
            <Card.Title className="fw-bold">{nome}</Card.Title>
            <Card.Text className="text-muted small mt-2">{descricao}</Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Painel de Próxima Reserva */}
      <Col md={7} className="d-flex flex-column justify-content-center">
        <h2 className="fw-bold text-dark mb-1">Olá, {usuario?.nome || 'Usuário'}! 👋</h2>
        <p className="text-muted mb-4">Bem-vindo ao sistema de agendamento do laboratório.</p>

        <h5 className="fw-semibold mb-3">Sua próxima reserva</h5>
        {reserva.dados ? (
          <div className="border rounded-3 p-3 bg-white shadow-sm mb-4">
            <ReservaItem reserva={reserva.dados} />
          </div>
        ) : (
          <div className="alert alert-light border text-muted mb-4 p-3 rounded-3">
            <i className="bi bi-info-circle me-2"></i>
            Você não possui reservas de laboratório agendadas no momento.
          </div>
        )}

        <div>
          <Button 
            as={Link} 
            to="/agendar" 
            variant="success" 
            size="lg" 
            className="d-inline-flex align-items-center gap-2 shadow-sm fw-medium"
          >
            <i className="bi bi-calendar-plus"></i> Reservar Computador
          </Button>
        </div>
      </Col>
    </Row>
  )
}