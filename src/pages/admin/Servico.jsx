import React, { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { api, buscarTodas, mensagemDeErro } from '../../api/client'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { useApi } from '../../hooks/useApi'

const NOVO = { nome: '', descricao: '', duracao_min: 50, preco: '0.00', imagem: null, recursos: [], ativo: true }

export function NovoServico() {
  const recursos = useApi('/recursos/', buscarTodas)

  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />
  if (recursos.carregando) return <Carregando />

  return <FormServico servico={NOVO} recursos={recursos.dados} />
}

export function EditarServico() {
  const { id } = useParams()
  const servico = useApi(`/servicos/${id}/`)
  const recursos = useApi('/recursos/', buscarTodas)

  if (servico.erro) return <Erro erro={servico.erro} tentarDeNovo={servico.recarregar} />
  if (recursos.erro) return <Erro erro={recursos.erro} tentarDeNovo={recursos.recarregar} />
  if (servico.carregando || recursos.carregando) return <Carregando />

  return <FormServico servico={servico.dados} recursos={recursos.dados} />
}

function FormServico({ servico, recursos }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(servico.nome || '')
  const [descricao, setDescricao] = useState(servico.descricao || '')
  const [duracao, setDuracao] = useState(servico.duracao_min ?? 50)
  const [preco, setPreco] = useState(servico.preco ?? '0.00')
  const [escolhidos, setEscolhidos] = useState(servico.recursos || [])
  const [ativo, setAtivo] = useState(servico.ativo ?? true)
  const [imagem, setImagem] = useState(servico.imagem || null)
  const [arquivo, setArquivo] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})

  function marcar(id, marcado) {
    if (marcado) {
      setEscolhidos([...escolhidos, id])
    } else {
      setEscolhidos(escolhidos.filter((r) => r !== id))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})
    const corpo = { nome, descricao, duracao_min: duracao, preco, recursos: escolhidos, ativo }

    try {
      const salvo = servico.id
        ? await api(`/servicos/${servico.id}/`, { method: 'PATCH', body: corpo })
        : await api('/servicos/', { method: 'POST', body: corpo })

      if (arquivo) {
        const formulario = new FormData()
        formulario.append('imagem', arquivo)
        await api(`/servicos/${salvo.id}/`, { method: 'PATCH', body: formulario })
      }
      navigate('/admin/servicos')
    } catch (err) {
      setErro(mensagemDeErro(err))
      setErros(err.dados ?? {})
    }
  }

  async function removerImagem() {
    try {
      await api(`/servicos/${servico.id}/`, { method: 'PATCH', body: { imagem: null } })
      setImagem(null)
    } catch (err) {
      setErro(mensagemDeErro(err))
    }
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        <h2 className="fw-bold mb-4">{servico.id ? 'Editar Serviço / Software' : 'Novo Serviço / Software'}</h2>

        {erro && <Alert variant="danger">{erro}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nomeServico">
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

          <Form.Group className="mb-3" controlId="descricaoServico">
            <Form.Label className="fw-medium">Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              isInvalid={!!erros.descricao}
            />
            <Form.Control.Feedback type="invalid">
              {erros.descricao?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3 g-3">
            <Col md={6}>
              <Form.Group controlId="duracaoServico">
                <Form.Label className="fw-medium">Duração (minutos)</Form.Label>
                <Form.Control
                  type="number"
                  value={duracao}
                  onChange={(e) => setDuracao(Number(e.target.value))}
                  isInvalid={!!erros.duracao_min}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.duracao_min?.join(' ')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="precoServico">
                <Form.Label className="fw-medium">Custo / Taxa (R$)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  isInvalid={!!erros.preco}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.preco?.join(' ')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="laboratoriosServico">
            <Form.Label className="fw-medium d-block">Laboratórios que disponibilizam</Form.Label>
            <div className="d-flex flex-column gap-2 p-3 bg-light rounded border">
              {recursos.map((recurso) => (
                <Form.Check
                  key={recurso.id}
                  type="checkbox"
                  id={`recurso-${recurso.id}`}
                  label={recurso.ativo ? recurso.nome : `${recurso.nome} (inativo)`}
                  checked={escolhidos.includes(recurso.id)}
                  onChange={(e) => marcar(recurso.id, e.target.checked)}
                  isInvalid={!!erros.recursos}
                />
              ))}
            </div>
            {erros.recursos && <div className="text-danger small mt-1">{erros.recursos.join(' ')}</div>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="imagemServico">
            <Form.Label className="fw-medium">Imagem</Form.Label>
            {imagem && (
              <div className="d-flex align-items-center gap-3 mb-2">
                <img
                  src={imagem}
                  alt="Serviço"
                  style={{ width: '160px' }}
                  className="rounded border p-1"
                />
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={removerImagem}
                >
                  Remover imagem
                </Button>
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setArquivo(e.target.files[0])}
              isInvalid={!!erros.imagem}
            />
            <Form.Control.Feedback type="invalid">
              {erros.imagem?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="ativoServico">
            <Form.Check
              type="switch"
              label="Ativo (inativos não aparecem para os alunos/usuários)"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => navigate('/admin/servicos')}
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