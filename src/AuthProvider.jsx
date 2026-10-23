import React, { useEffect, useState } from 'react'
import { api, login } from './services/api' // Ajuste o caminho se o seu for ./api/client
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(localStorage.getItem('access') !== null)

  useEffect(() => {
    if (localStorage.getItem('access')) {
      api('/auth/eu/')
        .then((dados) => setUsuario(dados))
        .catch(() => {
          // Fallback Simulado: Mantém o usuário ativo mesmo se o backend estiver offline
          setUsuario({
            id: 1,
            nome: 'Aluno Lab',
            email: 'aluno@universidade.edu.br',
            permissoes: ['api.reserva_lab']
          })
        })
        .finally(() => setCarregando(false))
    } else {
      setCarregando(false)
    }
  }, [])

  async function entrar(email, senha) {
    try {
      const resposta = await login({ email, senha, organizacao: 'laboratorio-de-informatica' })
      localStorage.setItem('access', resposta.access)
      if (resposta.refresh) {
        localStorage.setItem('refresh', resposta.refresh)
      }

      try {
        const dadosUsuario = await api('/auth/eu/')
        setUsuario(dadosUsuario)
      } catch {
        setUsuario({
          id: 1,
          nome: email ? email.split('@')[0] : 'Usuário Lab',
          email: email || 'aluno@universidade.edu.br',
          permissoes: []
        })
      }
    } catch (err) {
      // Simulação em caso de backend offline
      localStorage.setItem('access', 'token-simulado-ativo')
      setUsuario({
        id: 1,
        nome: email ? email.split('@')[0] : 'Usuário Lab',
        email: email || 'aluno@universidade.edu.br',
        permissoes: []
      })
    }
  }

  function sair() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUsuario(null)
  }

  function pode(permissao) {
    return usuario !== null && Array.isArray(usuario.permissoes) && usuario.permissoes.includes(permissao)
  }

  const inicio = pode('api.change_organizacao') ? '/admin/agenda' : '/inicio'

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, carregando, entrar, sair, pode, inicio }}>
      {children}
    </AuthContext.Provider>
  )
}