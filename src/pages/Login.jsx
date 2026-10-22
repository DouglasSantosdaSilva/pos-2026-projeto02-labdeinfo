import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { Publica } from '../components/Publica'
import { login, mensagemDeErro } from '../services/api'
import { Erro } from '../components/Erro'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erroMsg, setErroMsg] = useState('')

 
const handleSubmit = async (e) => {
  e.preventDefault()
  setCarregando(true)
  setErroMsg('')

  try {
    const resposta = await login({
    email,
    senha,
    organizacao: 'laboratorio-de-informatica'
    })

    localStorage.setItem('access', resposta.access)

    if (resposta.refresh) {
      localStorage.setItem('refresh', resposta.refresh)
    }

    window.location.href = '/'
  } catch (err) {
    console.error('Erro no login:', err)

    if (err.status === 400) {
      setErroMsg(err.message || 'Organização, e-mail ou senha inválidos.')
    } else {
      setErroMsg(err.message || mensagemDeErro(err))
    }
  } finally {
    setCarregando(false)
  }
}


  return (
    <Publica titulo="Entrar" subTitulo="Acesse sua conta para gerenciar reservas">
      {erroMsg && <Erro mensagem={erroMsg} />}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </Form.Group>

        <div className="text-end mb-4">
          <Link to="/esqueci-senha" className="small text-decoration-none">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-100 py-2 mb-3" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Button>

        <div className="text-center small">
          Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
        </div>
      </Form>
    </Publica>
  )
}