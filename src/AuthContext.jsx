import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from './api/client' // Ou './services/api', conforme o nome no seu projeto

// 1. Adicionado 'export' aqui
export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarUsuario() {
      const token = localStorage.getItem('access')
      if (token) {
        try {
          const dados = await api('/auth/eu/')
          setUsuario(dados)
        } catch (erro) {
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
        }
      }
      setCarregando(false)
    }
    carregarUsuario()
  }, [])

  function logout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUsuario(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, carregando, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// 2. Adicionado 'export default' no final para compatibilidade total
export default AuthContext