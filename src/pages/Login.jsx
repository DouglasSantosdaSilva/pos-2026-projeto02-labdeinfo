import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'

export function Login() {
  const { entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      await entrar(email, senha)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Acessar Lab Info</h2>
        <p className="text-muted small">Informe suas credenciais para gerenciar suas reservas</p>
      </div>

      {erro && <Alert variant="danger">{erro}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label className="fw-medium">E-mail institucional</Form.Label>
          <Form.Control
            type="email"
            placeholder="aluno@universidade.edu.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="loginSenha">
          <Form.Label className="fw-medium">Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          type="submit"
          variant="success"
          className="w-100 py-2 fw-semibold"
          disabled={enviando}
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </Button>
      </Form>

      <div className="mt-4 d-flex justify-content-between align-items-center small">
        <Link to="/cadastro" className="text-success text-decoration-none fw-medium">
          Criar conta
        </Link>
        <Link to="/esqueci-senha" className="text-muted text-decoration-none">
          Esqueci minha senha
        </Link>
      </div>
    </>
  )
}