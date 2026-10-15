import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Publica } from '../../components/Publica'
import { redefinirSenha, mensagemDeErro } from '../../services/api'
import { Erro } from '../components/Erro'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erroMsg, setErroMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErroMsg('')

    try {
      await redefinirSenha(email)
      setEnviado(true)
    } catch (err) {
      setErroMsg(mensagemDeErro(err))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Publica titulo="Esqueci minha senha" subTitulo="Digite seu e-mail cadastrado">
      {erroMsg && <Erro mensagem={erroMsg} />}

      {enviado ? (
        <Alert variant="info" className="small">
          Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 py-2 mb-3" disabled={carregando}>
            {carregando ? 'Enviando...' : 'Enviar link'}
          </Button>
        </Form>
      )}

      <div className="text-center small mt-3">
        <Link to="/login">Voltar para o login</Link>
      </div>
    </Publica>
  )
}