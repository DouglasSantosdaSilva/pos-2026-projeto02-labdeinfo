import React, { useState } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { alterarSenha, mensagemDeErro } from '../../services/api'
import { Erro } from '../../components/Erro'

export default function AlterarSenha() {
  const navigate = useNavigate()
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erroMsg, setErroMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErroMsg('')

    if (novaSenha !== confirmacao) {
      setErroMsg('A confirmação não confere com a nova senha.')
      return
    }

    setSalvando(true)
    try {
      await alterarSenha(senhaAtual, novaSenha)
      navigate('/perfil', { state: { mensagem: 'Senha alterada com sucesso!' } })
    } catch (err) {
      setErroMsg(mensagemDeErro(err))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 max-w-md mx-auto">
      <Card.Body className="p-4">
        <h3 className="mb-4">Alterar Senha</h3>

        {erroMsg && <Erro mensagem={erroMsg} />}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Senha Atual</Form.Label>
            <Form.Control
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nova Senha</Form.Label>
            <Form.Control
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirmar Nova Senha</Form.Label>
            <Form.Control
              type="password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" className="w-100" onClick={() => navigate('/perfil')}>
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