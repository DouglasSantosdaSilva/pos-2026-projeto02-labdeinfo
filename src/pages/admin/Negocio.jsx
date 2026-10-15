import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { useApi } from '../../hooks/useApi'
import { atualizarOrganizacao, mensagemDeErro } from '../../services/api'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'

export default function Negocio() {
  const { dados, carregando, erro, recarregar } = useApi('/organizacao/')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [logo, setLogo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroForm, setErroForm] = useState('')

  useEffect(() => {
    if (dados) {
      setNome(dados.nome || '')
      setDescricao(dados.descricao || '')
      setPreview(dados.logo || null)
    }
  }, [dados])

  if (carregando) return <Carregando mensagem="Carregando dados da instituição..." />
  if (erro) return <Erro mensagem="Erro ao carregar dados do negócio." onTentarDeNovo={recarregar} />

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSalvando(true)
    setErroForm('')
    setSucesso(false)

    const formData = new FormData()
    formData.append('nome', nome)
    formData.append('descricao', descricao)
    if (logo) formData.append('logo', logo)

    try {
      await atualizarOrganizacao(formData)
      setSucesso(true)
      recarregar()
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 max-w-2xl mx-auto">
      <Card.Body className="p-4">
        <h3 className="mb-4">Dados da Instituição</h3>

        {sucesso && <div className="alert alert-success">Dados atualizados com sucesso!</div>}
        {erroForm && <Erro mensagem={erroForm} />}

        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <Foto src={preview} alt={nome} tamanho={100} className="mb-3 shadow-sm" />
            <div>
              <Form.Group controlId="logoFile">
                <Form.Label className="btn btn-outline-primary size-sm cursor-pointer">
                  Alterar Logo
                </Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleLogoChange} className="d-none" />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Nome da Instituição/Departamento</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 py-2" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}