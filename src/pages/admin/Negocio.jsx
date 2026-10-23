import React, { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { api, mensagemDeErro } from '../../api/client'
import { useAuth } from '../../AuthContext'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { useApi } from '../../hooks/useApi'

export function Negocio() {
  const { dados, erro, carregando, recarregar } = useApi('/organizacao/')

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />
  if (carregando) return <Carregando />

  return <FormNegocio organizacao={dados} />
}

function FormNegocio({ organizacao }) {
  const { usuario, setUsuario } = useAuth()
  const [nome, setNome] = useState(organizacao?.nome || '')
  const [descricao, setDescricao] = useState(organizacao?.descricao || '')
  const [logo, setLogo] = useState(organizacao?.logo || null)
  const [arquivo, setArquivo] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [salvo, setSalvo] = useState(false)

  async function salvar(corpo) {
    setErro(null)
    setErros({})
    setSalvo(false)
    try {
      const nova = await api('/organizacao/', { method: 'PATCH', body: corpo })
      setLogo(nova.logo)
      setUsuario({ ...usuario, organizacao: nova })
      setSalvo(true)
    } catch (err) {
      setErro(mensagemDeErro(err))
      setErros(err.dados ?? {})
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formulario = new FormData()
    formulario.append('nome', nome)
    formulario.append('descricao', descricao)
    if (arquivo) {
      formulario.append('logo', arquivo)
    }
    salvar(formulario)
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        <h2 className="fw-bold mb-4">Dados da Instituição / Laboratório</h2>

        {erro && <Alert variant="danger">{erro}</Alert>}
        {salvo && <Alert variant="success">Dados salvos com sucesso.</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nomeOrganizacao">
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

          <Form.Group className="mb-3" controlId="descricaoOrganizacao">
            <Form.Label className="fw-medium">Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              isInvalid={!!erros.descricao}
            />
            <Form.Control.Feedback type="invalid">
              {erros.descricao?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="logoOrganizacao">
            <Form.Label className="fw-medium">Logotipo</Form.Label>
            {logo && (
              <div className="mb-2">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ maxWidth: '200px' }}
                  className="rounded border p-1"
                />
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setArquivo(e.target.files[0])}
              isInvalid={!!erros.logo}
            />
            <Form.Control.Feedback type="invalid">
              {erros.logo?.join(' ')}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">
              Salvar
            </Button>
            {logo && (
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => salvar({ logo: null })}
              >
                Remover logotipo
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}