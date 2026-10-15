import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { Publica } from '../../components/Publica'
import { cadastrar, login, mensagemDeErro } from '../../services/api'
import { Erro } from '../../components/Erro'

export default function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erroMsg, setErroMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErroMsg('')

    try {
      await cadastrar(nome, email, senha)
      // Login automático pós-cadastro
      const tokenRes = await login(email, senha)
      localStorage.setItem('access', tokenRes.access)
      localStorage.setItem('refresh', tokenRes.refresh)
      window.location.href = '/'
    } catch (err) {
      setErroMsg(mensagemDeErro(err))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Publica titulo="Criar Conta" subTitulo="Preencha seus dados para começar">
      {erroMsg && <Erro mensagem={erroMsg} />}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome Completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>

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

        <Form.Group className="mb-4">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100 py-2 mb-3" disabled={carregando}>
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </Button>

        <div className="text-center small">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </div>
      </Form>
    </Publica>
  )
}