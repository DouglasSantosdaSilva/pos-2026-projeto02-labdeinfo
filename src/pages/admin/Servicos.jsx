import React, { useState } from 'react'
import { Card, Button, Row, Col, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { FiltroAtivo } from '../../components/FiltroAtivo'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'

export default function Servicos() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('true')

  const { dados, carregando, erro, recarregar } = useApi(`/servicos/${filtro ? `?ativo=${filtro}` : ''}`)

  if (Carregando) return <Carregando mensagem="Carregando serviços..." />
  if (Erro) return <Erro mensagem="Erro ao carregar serviços." onTentarDeNovo={recarregar} />

  const lista = dados?.results || dados || []

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestão de Serviços</h2>
        <Button variant="primary" onClick={() => navigate('/admin/servicos/novo')}>
          + Novo Serviço
        </Button>
      </div>

      <FiltroAtivo valor={filtro} onChange={setFiltro} />

      {lista.length === 0 ? (
        <p className="text-muted">Cadastre o primeiro serviço.</p>
      ) : (
        <Row className="g-4 mt-1">
          {lista.map((s) => (
            <Col md={6} lg={4} key={s.id}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Foto src={s.imagem} alt={s.nome} tamanho={60} arredondado={false} />
                    <div>
                      <h5 className="mb-1">{s.nome}</h5>
                      <Badge bg={s.ativo ? 'success' : 'secondary'}>
                        {s.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted small mb-2">{s.descricao || 'Sem descrição.'}</p>
                  <p className="mb-1"><strong>Duração:</strong> {s.duracao_minutos} min</p>
                  <p className="fw-semibold text-success mb-3">
                    {s.preco ? `R$ ${s.preco}` : 'Gratuito (R$ 0,00)'}
                  </p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-auto w-100"
                    onClick={() => navigate(`/admin/servicos/${s.id}`)}
                  >
                    Editar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}