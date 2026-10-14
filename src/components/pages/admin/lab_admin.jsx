import React, { useState } from 'react'
import { Card, Button, Row, Col, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { FiltroAtivo } from '../../components/FiltroAtivo'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'

export default function lab_admin  () {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('true')

  const { dados, carregando, erro, recarregar } = useApi(`/recursos/${filtro ? `?ativo=${filtro}` : ''}`)

  if (carregando) return <Carregando mensagem="Carregando laboratórios..." />
  if (erro) return <Erro mensagem="Erro ao carregar laboratórios." onTentarDeNovo={recarregar} />

  const laboratorios = dados?.results || dados || []

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestão de Laboratórios</h2>
        <Button variant="primary" onClick={() => navigate('/admin/laboratorios/novo')}>
          + Novo Laboratório
        </Button>
      </div>

      <FiltroAtivo valor={filtro} onChange={setFiltro} />

      {laboratorios.length === 0 ? (
        <p className="text-muted">Cadastre o primeiro laboratório.</p>
      ) : (
        <Row className="g-4 mt-1">
          {laboratorios.map((lab) => (
            <Col md={6} lg={4} key={lab.id}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Foto src={lab.foto} alt={lab.nome} tamanho={60} arredondado={false} />
                    <div>
                      <h5 className="mb-1">{lab.nome}</h5>
                      <Badge bg={lab.ativo ? 'success' : 'secondary'}>
                        {lab.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted small mb-2">{lab.bio || 'Sem descrição.'}</p>
                  <p className="fw-semibold text-primary mb-3">
                    💻 Capacidade: {lab.capacidade} computadores
                  </p>
                  <div className="mt-auto d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="w-100" onClick={() => navigate(`/admin/laboratorios/${lab.id}`)}>
                      Editar
                    </Button>
                    <Button variant="outline-secondary" size="sm" className="w-100" onClick={() => navigate(`/admin/laboratorios/${lab.id}/horarios`)}>
                      Horários
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}