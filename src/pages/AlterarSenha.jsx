import React, { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { api, mensagemDeErro } from '../api/client'

export function AlterarSenha() {
  const navigate = useNavigate()
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setErros({})

    if (novaSenha !== confirmacao) {
      setErros({ confirmacao: ['As senhas não conferem.'] })
      return
    }

    setEnviando(true)
    try {
      await api('/auth/alterar-senha/', {
        method: 'POST',
        body: { senha_atual: senhaAtual, nova_senha: novaSenha },
      })
      navigate('/perfil', { state: { mensagem: 'Senha alterada com sucesso.' } })
    } catch (err) {
      setErro(mensagemDeErro(err))
      setErros(err.dados ?? {})
      setEnviando(false)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '600px' }}>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h2 className="fw-bold mb-4">Alterar Senha</h2>

            {erro && <Alert variant="danger">{erro}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="senhaAtual">
                <Form.Label className="fw-medium">Senha atual</Form.Label>
                <Form.Control
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  isInvalid={!!erros.senha_atual}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erros.senha_atual?.join(' ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="novaSenha">
                <Form.Label className="fw-medium">Nova senha</Form.Label>
                <Form.Control
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  isInvalid={!!erros.nova_senha}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erros.nova_senha?.join(' ')}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmacao">
                <Form.Label className="fw-medium">Confirme a nova senha</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmacao}
                  onChange={(e) => setConfirmacao(e.target.value)}
                  isInvalid={!!erros.confirmacao}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {erros.confirmacao?.join(' ')}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => navigate('/perfil')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  disabled={enviando}
                >
                  {enviando ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}