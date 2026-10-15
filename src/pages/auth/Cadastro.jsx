import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { cadastrar, login } from '../../services/api'
import { Publica } from '../../components/Publica'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await cadastrar({
        nome,
        email,
        senha,
      })

      const tokenRes = await login(email, senha)

      if (tokenRes?.access) {
        localStorage.setItem('access', tokenRes.access)

        if (tokenRes.refresh) {
          localStorage.setItem('refresh', tokenRes.refresh)
        }
      } else if (tokenRes?.token) {
        localStorage.setItem('token', tokenRes.token)
      }

      navigate('/')
    } catch (err) {
      setErro(err.message || 'Erro ao realizar o cadastro.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Publica
      titulo="Criar conta"
      subTitulo="Preencha seus dados para começar."
    >
      {erro && (
        <Alert variant="danger" role="alert">
          {erro}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="cadastroNome">
          <Form.Label>Nome completo</Form.Label>
          <Form.Control
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome completo"
            autoComplete="name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="cadastroEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            autoComplete="email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="cadastroSenha">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Crie uma senha"
            autoComplete="new-password"
            required
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100"
          disabled={carregando}
        >
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </Form>

      <p className="text-center text-muted small mt-4 mb-0">
        Já tem uma conta? <Link to="/login">Entrar</Link>
      </p>
    </Publica>
  )
}