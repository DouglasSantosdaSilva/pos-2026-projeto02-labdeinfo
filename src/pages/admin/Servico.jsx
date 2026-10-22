import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { criarServico, atualizarServico, mensagemDeErro } from '../../services/api'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { Foto } from '../../components/Foto'

export default function FormServico() {
  const { id } = useParams()
  const isEdicao = Boolean(id)
  const navigate = useNavigate()

  const { dados, carregando, erro } = useApi(isEdicao ? `/servicos/${id}/` : null)
  const { dados: resLabs } = useApi('/recursos/')

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [duracaoMinutos, setDuracaoMinutos] = useState(60)
  const [preco, setPreco] = useState('0.00')
  const [ativo, setAtivo] = useState(true)
  const [recursosSelecionados, setRecursosSelecionados] = useState([])
  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  useEffect(() => {
    if (dados && isEdicao) {
      setNome(dados.nome || '')
      setDescricao(dados.descricao || '')
      setDuracaoMinutos(dados.duracao_minutos || 60)
      setPreco(dados.preco || '0.00')
      setAtivo(dados.ativo ?? true)
      setRecursosSelecionados(dados.recursos || [])
      setPreview(dados.imagem || null)
    }
  }, [dados, isEdicao])

  if (isEdicao && carregando) return <Carregando mensagem="Carregando serviço..." />
  if (isEdicao && erro) return <Erro mensagem="Não foi possível carregar o serviço." />

  const laboratorios = resLabs?.results || resLabs || []

  const handleImagemChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagem(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleRecursoToggle = (labId) => {
    if (recursosSelecionados.includes(labId)) {
      setRecursosSelecionados(recursosSelecionados.filter((r) => r !== labId))
    } else {
      setRecursosSelecionados([...recursosSelecionados, labId])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSalvando(true)
    setErroForm('')

    const formData = new FormData()
    formData.append('nome', nome)
    formData.append('descricao', descricao)
    formData.append('duracao_minutos', duracaoMinutos)
    formData.append('preco', preco)
    formData.append('ativo', ativo)
    recursosSelecionados.forEach((rId) => formData.append('recursos', rId))
    if (imagem) formData.append('imagem', imagem)

    try {
      if (isEdicao) {
        await atualizarServico(id, formData)
      } else {
        await criarServico(formData)
      }
      navigate('/admin/servicos')
    } catch (err) {
      setErroForm(mensagemDeErro(err))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 max-w-xl mx-auto">
      <Card.Body className="p-4">
        <h3 className="mb-4">{isEdicao ? 'Editar Serviço' : 'Novo Serviço'}</h3>

        {erroForm && <Erro mensagem={erroForm} />}

        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <Foto src={preview} alt={nome} tamanho={100} arredondado={false} className="mb-2 shadow-sm rounded" />
            <div>
              <Form.Group controlId="imagemServico">
                <Form.Label className="btn btn-outline-primary size-sm cursor-pointer mb-0">
                  Imagem do Serviço
                </Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImagemChange} className="d-none" />
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Nome do Serviço</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex: Uso por 1 hora"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duração em Minutos</Form.Label>
            <Form.Control
              type="number"
              value={duracaoMinutos}
              onChange={(e) => setDuracaoMinutos(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Preço (R$)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Laboratórios que oferecem este serviço:</Form.Label>
            <div className="border rounded p-3 bg-light">
              {laboratorios.length === 0 ? (
                <p className="text-muted small mb-0">Nenhum laboratório cadastrado.</p>
              ) : (
                laboratorios.map((lab) => (
                  <Form.Check
                    key={lab.id}
                    type="checkbox"
                    id={`lab-${lab.id}`}
                    label={lab.nome}
                    checked={recursosSelecionados.includes(lab.id)}
                    onChange={() => handleRecursoToggle(lab.id)}
                  />
                ))
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="switch"
              id="ativo-servico-switch"
              label="Serviço Ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" className="w-100" onClick={() => navigate('/admin/servicos')}>
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