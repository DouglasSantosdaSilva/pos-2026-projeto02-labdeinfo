import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { api, mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'
import { Foto } from '../components/Foto'

export function Perfil() {
  const { usuario, setUsuario, sair } = useAuth()
  const location = useLocation()
  const [nome, setNome] = useState(usuario?.nome || '')
  const [foto, setFoto] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [salvo, setSalvo] = useState(false)

  async function salvar(corpo) {
    setErro(null)
    setErros({})
    setSalvo(false)
    try {
      setUsuario(await api('/auth/eu/', { method: 'PATCH', body: corpo }))
      setSalvo(true)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formulario = new FormData()
    formulario.append('nome', nome)
    if (foto) {
      formulario.append('foto', foto)
    }
    salvar(formulario)
  }

  return (
    <div className="d-flex justify-content-center py-4">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <Card className="shadow-sm">
          <Card.Body className="p-4">
            <div className="mb-4 text-center">
              <div className="d-flex justify-content-center mb-2">
                <Foto src={usuario?.foto} tamanho={96} />
              </div>
              <h2 className="mt-2 mb-0">{usuario?.nome}</h2>
              <div className="text-muted">{usuario?.email}</div>
              <div className="text-muted">{usuario?.organizacao?.nome}</div>
            </div>

            {erro && <Alert variant="danger">{erro}</Alert>}
            {salvo && <Alert variant="success">Perfil atualizado.</Alert>}
            {location.state?.mensagem && <Alert variant="success">{location.state.mensagem}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="perfilNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  isInvalid={!!erros.nome}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erros.nome?.join(' ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="perfilFoto">
                <Form.Label>Foto</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={e => setFoto(e.target.files[0])}
                  isInvalid={!!erros.foto}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.foto?.join(' ')}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <Button type="submit" variant="primary">
                  Salvar
                </Button>
                {usuario?.foto && (
                  <Button variant="outline-secondary" onClick={() => salvar({ foto: null })}>
                    Remover foto
                  </Button>
                )}
                <Link to="/perfil/senha" className="btn btn-outline-secondary ms-auto">
                  <i className="bi bi-key me-1"></i> Alterar senha
                </Link>
                <Button variant="outline-danger" onClick={sair}>
                  <i className="bi bi-box-arrow-right me-1"></i> Sair
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Perfil