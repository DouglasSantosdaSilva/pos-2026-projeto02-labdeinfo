import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { cadastrar, mensagemDeErro } from '../api/client'
import { useAuth } from '../AuthContext'

export function Cadastro() {
  const { entrar } = useAuth()
  const navegar = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)

    try {
      await cadastrar(nome, email, senha)
      // Faz o login automático após o cadastro
      await entrar(email, senha)
      navegar('/inicio')
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Criar Conta</h2>
        <p className="text-muted small">Cadastre-se para efetuar reservas de laboratório</p>
      </div>

      {erro && <Alert variant="danger">{erro}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="cadastroNome">
          <Form.Label className="fw-medium">Nome completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="cadastroEmail">
          <Form.Label className="fw-medium">E-mail institucional</Form.Label>
          <Form.Control
            type="email"
            placeholder="aluno@universidade.edu.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="cadastroSenha">
          <Form.Label className="fw-medium">Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Crie uma senha segura"
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
          {enviando ? 'Criando conta...' : 'Cadastrar'}
        </Button>
      </Form>

      <div className="mt-4 text-center small">
        <span className="text-muted">Já possui uma conta? </span>
        <Link to="/login" className="text-success text-decoration-none fw-medium">
          Fazer login
        </Link>
      </div>
    </>
  )
}