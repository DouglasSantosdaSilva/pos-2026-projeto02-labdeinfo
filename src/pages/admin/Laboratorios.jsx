import React from 'react'
import { Alert, Button, Card, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Carregando } from '../../components/Carregando'
import { CarregarMais } from '../../components/CarregarMais'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { usePaginado } from '../../hooks/useApi'

export function Laboratorios() {
  const recursos = usePaginado('/recursos/')

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Gerenciar Laboratórios</h2>
        <Link to="/admin/recursos/novo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Novo Laboratório
        </Link>
      </div>

      {!recursos.carregando && recursos.itens.length === 0 && (
        <Alert variant="info">Nenhum laboratório cadastrado no sistema.</Alert>
      )}

      <Card className="shadow-sm border-0 mb-4">
        <Table responsive hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Descrição / Detalhes</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {recursos.itens.map((recurso) => (
              <tr key={recurso.id}>
                <td style={{ width: '80px' }}>
                  <Foto src={recurso.foto} tamanho={48} />
                </td>
                <td className="fw-semibold">{recurso.nome}</td>
                <td className="text-muted small">{recurso.bio}</td>
                <td className="text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <Link
                      to={`/admin/recursos/${recurso.id}/horarios`}
                      className="btn btn-sm btn-outline-secondary"
                      title="Horários de Funcionamento"
                    >
                      <i className="bi bi-clock"></i> Horários
                    </Link>
                    <Link
                      to={`/admin/recursos/${recurso.id}`}
                      className="btn btn-sm btn-outline-primary"
                      title="Editar Laboratório"
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {recursos.carregando ? <Carregando /> : <CarregarMais lista={recursos} />}
    </>
  )
}

export default Laboratorios