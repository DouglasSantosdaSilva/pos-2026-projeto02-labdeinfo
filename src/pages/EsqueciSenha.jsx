import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Alert } from 'react-bootstrap'
import { redefinirSenha, mensagemDeErro } from '../api/client'

export function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    setSucesso(false)

    try {
      await redefinirSenha(email)
      setSucesso(true)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Recuperar Senha</h2>
        <p className="text-muted small">
          Informe seu e-mail institucional para receber as instruções de redefinição
        </p>
      </div>

      {erro && <Alert variant="danger">{erro}</Alert>}

      {sucesso ? (
        <Alert variant="success" className="text-center py-4">
          <i className="bi bi-check-circle-fill fs-2 d-block mb-2"></i>
          <h5 className="fw-bold">E-mail enviado!</h5>
          <p className="mb-0 small">
            Se o e-mail <strong>{email}</strong> estiver cadastrado em nosso sistema, você receberá um link com as instruções para redefinir sua senha.
          </p>
          <div className="mt-4">
            <Link to="/login" className="btn btn-outline-success btn-sm fw-medium">
              Voltar para o Login
            </Link>
          </div>
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="esqueciEmail">
            <Form.Label className="fw-medium">E-mail institucional</Form.Label>
            <Form.Control
              type="email"
              placeholder="aluno@universidade.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100 py-2 fw-semibold"
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Enviar instruções'}
          </Button>

          <div className="mt-4 text-center small">
            <Link to="/login" className="text-muted text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i> Voltar ao login
            </Link>
          </div>
        </Form>
      )}
    </>
  )
}