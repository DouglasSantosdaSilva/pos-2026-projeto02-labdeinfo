import React, { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'
import { useApi } from '../../hooks/useApi'

const NOVO = { nome: '', bio: '', foto: null, capacidade: 1, ativo: true }

export function NovoRecurso() {
  return <FormRecurso recurso={NOVO} />
}

export function EditarRecurso() {
  const { id } = useParams()
  const { dados, erro, carregando, recarregar } = useApi(`/recursos/${id}/`)

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />
  if (carregando) return <Carregando />

  return <FormRecurso recurso={dados} />
}

function FormRecurso({ recurso }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(recurso.nome || '')
  const [bio, setBio] = useState(recurso.bio || '')
  const [capacidade, setCapacidade] = useState(recurso.capacidade ?? 1)
  const [ativo, setAtivo] = useState(recurso.ativo ?? true)
  const [foto, setFoto] = useState(recurso.foto || null)
  const [arquivo, setArquivo] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})

    const formulario = new FormData()
    formulario.append('nome', nome)
    formulario.append('bio', bio)
    formulario.append('capacidade', capacidade)
    formulario.append('ativo', ativo)
    if (arquivo) {
      formulario.append('foto', arquivo)
    }

    try {
      if (recurso.id) {
        await api(`/recursos/${recurso.id}/`, { method: 'PATCH', body: formulario })
      } else {
        await api('/recursos/', { method: 'POST', body: formulario })
      }
      navigate('/admin/laboratorios')
    } catch (err) {
      setErro(mensagemDeErro(err))
      setErros(err.dados ?? {})
    }
  }

  async function removerFoto() {
    try {
      await api(`/recursos/${recurso.id}/`, { method: 'PATCH', body: { foto: null } })
      setFoto(null)
    } catch (err) {
      setErro(mensagemDeErro(err))
    }
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold mb-0">
            {recurso.id ? 'Editar Laboratório' : 'Novo Laboratório'}
          </h2>
          {recurso.id && (
            <Button
              as={Link}
              to={`/admin/laboratorios/${recurso.id}/horarios`}
              variant="outline-secondary"
            >
              <i className="bi bi-clock me-1"></i> Horários
            </Button>
          )}
        </div>

        {erro && <Alert variant="danger">{erro}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nomeLaboratorio">
            <Form.Label className="fw-medium">Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              isInvalid={!!erros.nome}
              required
            />
            <Form.Control.Feedback type="invalid">
              {erros.nome?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="bioLaboratorio">
            <Form.Label className="fw-medium">Descrição / Informações</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              isInvalid={!!erros.bio}
            />
            <Form.Control.Feedback type="invalid">
              {erros.bio?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="capacidadeLaboratorio">
            <Form.Label className="fw-medium">Capacidade</Form.Label>
            <Form.Control
              type="number"
              value={capacidade}
              onChange={(e) => setCapacidade(Number(e.target.value))}
              isInvalid={!!erros.capacidade}
            />
            <Form.Text className="text-muted">
              Capacidade máxima de pessoas ou agendamentos simultâneos no laboratório.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {erros.capacidade?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="fotoLaboratorio">
            <Form.Label className="fw-medium">Foto / Imagem do Laboratório</Form.Label>
            <div className="d-flex align-items-center gap-3 mb-2">
              <Foto src={foto} tamanho={64} />
              {foto && (
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={removerFoto}
                >
                  Remover foto
                </Button>
              )}
            </div>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setArquivo(e.target.files[0])}
              isInvalid={!!erros.foto}
            />
            <Form.Control.Feedback type="invalid">
              {erros.foto?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="ativoLaboratorio">
            <Form.Check
              type="switch"
              label="Ativo (inativos não ficam disponíveis para reservas de alunos)"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => navigate('/admin/laboratorios')}
            >
              Voltar
            </Button>
            <Button type="submit" variant="primary">
              Salvar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}