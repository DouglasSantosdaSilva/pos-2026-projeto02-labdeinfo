import React, { useState, useEffect } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { atualizarPerfil, mensagemDeErro } from '../services/api'
import { Carregando } from '../components/Carregando'
import { Erro } from '../components/Erro'
import { Foto } from '../components/Foto'

export default function MeuPerfil({ onLogout }) {
  const navigate = useNavigate()
  const { dados, carregando, erro, recarregar } = useApi('/auth/eu/')

  const [nome, setNome] = useState('')
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroForm, setErroForm] = useState('')

  useEffect(() => {
    if (dados) {
      setNome(dados.nome || '')
      setPreview(dados.foto || null)
    }
  }, [dados])

  if (carregando) return <Carregando mensagem="Carregando perfil..." />
  if (erro) return <Erro mensagem="Não foi possível carregar o perfil." onTentarDeNovo={recarregar} />

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
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
    if (foto) formData.append('foto', foto)

    try {
      await atualizarPerfil(formData)
      setSucesso(true)
      recarregar()
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 max-w-md mx-auto">
      <Card.Body className="p-4">
        <h3 className="mb-4">Meu Perfil</h3>

        {sucesso && <div className="alert alert-success">Perfil atualizado com sucesso!</div>}
        {erroForm && <Erro mensagem={erroForm} />}

        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <Foto src={preview} alt={nome} tamanho={96} className="mb-3 shadow-sm" />
            <div>
              <Form.Group controlId="fotoPerfil">
                <Form.Label className="btn btn-outline-primary size-sm cursor-pointer mb-0">
                  Trocar foto
                </Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFotoChange} className="d-none" />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="email" value={dados?.email || ''} disabled readOnly className="bg-light" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 py-2 mb-3" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </Button>

          <div className="d-flex justify-content-between pt-2 border-top">
            <Button variant="outline-secondary" size="sm" onClick={() => navigate('/alterar-senha')}>
              Alterar Senha
            </Button>
            <Button variant="outline-danger" size="sm" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}