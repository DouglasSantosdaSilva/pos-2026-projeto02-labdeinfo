import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { cadastrar, login } from '../../services/api' 

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()

  // Adicionada a palavra-chave 'async' aqui na função do submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
    // ENVIE COMO UM OBJETO COM CHAVES {}:
    await cadastrar({ 
      nome, 
      email, 
      senha 
    })

      // 2. Efectua o login automático
      const tokenRes = await login(email, senha)
      if (tokenRes && tokenRes.token) {
        localStorage.setItem('token', tokenRes.token)
      }

      // Redireciona para o dashboard/início
      navigate('/')
    } catch (err) {
      setErro(err.message || 'Erro ao realizar o cadastro.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Laboratório de Informática</h2>
      <div className="auth-card">
        <h3>Criar Conta</h3>
        <p>Preencha seus dados para começar</p>

        {erro && <div className="error-message">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? 'A processar...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}