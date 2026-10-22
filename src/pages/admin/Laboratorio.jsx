import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { criarLaboratorio, atualizarLaboratorio, mensagemDeErro } from '../../services/api'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'   

export default function FormLaboratorio() {
  const { id } = useParams()
  const isEdicao = Boolean(id)
  const navigate = useNavigate()

  const { dados, carregando, erro } = useApi(isEdicao ? `/recursos/${id}/` : null)

  const [nome, setNome] = useState('')
  const [bio, setBio] = useState('')
  const [capacidade, setCapacidade] = useState(30)
  const [ativo, setAtivo] = useState(true)
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  useEffect(() => {
    if (dados && isEdicao) {
      setNome(dados.nome || '')
      setBio(dados.bio || '')
      setCapacidade(dados.capacidade || 1)
      setAtivo(dados.ativo ?? true)
      setPreview(dados.foto || null)
    }
  }, [dados, isEdicao])

  if (isEdicao && carregando) return <Carregando mensagem="Carregando laboratório..." />
  if (isEdicao && erro) return <Erro mensagem="Não foi possível carregar o laboratório." />

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

  const formData = new FormData()
  formData.append('nome', nome)
  // Envia ambos os nomes de campo para garantir que o Django receba a descrição
  formData.append('descricao', bio) 
  formData.append('bio', bio)
  formData.append('capacidade', Number(capacidade))
  formData.append('ativo', ativo ? 'true' : 'false')

  if (foto) {
    formData.append('foto', foto)
  }

  try {
    if (isEdicao) {
      await atualizarLaboratorio(id, formData)
    } else {
      await criarLaboratorio(formData)
    }
    navigate('/admin/laboratorios')
  } catch (err) {
    console.error("Erro no cadastro de laboratório:", err)
    setErroForm(mensagemDeErro(err))
  } finally {
    setSalvando(false)
  }
}

  return (
    <Card className="shadow-sm border-0 max-w-xl mx-auto">
      <Card.Body className="p-4">
        <h3 className="mb-4">{isEdicao ? 'Editar Laboratório' : 'Novo Laboratório'}</h3>

        {erroForm && <Erro mensagem={erroForm} />}

        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <Foto src={preview} alt={nome} tamanho={120} arredondado={false} className="mb-2 shadow-sm rounded" />
            <div>
              <Form.Group controlId="fotoLab">
                <Form.Label className="btn btn-outline-primary size-sm cursor-pointer mb-0">
                  Foto do Lab
                </Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFotoChange} className="d-none" />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Nome do Laboratório</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Laboratório 1"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacidade (nº de computadores)</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição / Configuração dos Computadores</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ex: 30 computadores com Linux e Python"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="switch"
              id="ativo-switch"
              label="Laboratório Ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" className="w-100" onClick={() => navigate('/admin/laboratorios')}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-100" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}