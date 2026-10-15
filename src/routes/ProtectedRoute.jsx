import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Carregando } from '../components/Carregando'

export function ProtectedRoute({ requerCoordenador = false }) {
  const { usuario, carregando } = useAuth()

  // Enquanto verifica se o token existe / carrega o perfil na API
  if (carregando) {
    return <Carregando mensagem="A verificar autenticação..." />
  }

  // Se não estiver autenticado, redireciona para a página pública de boas-vindas/login
  if (!usuario) {
    return <Navigate to="/entrada" replace />
  }

  // Se a rota for exclusiva para coordenadores/admin, verifica as permissões
  if (requerCoordenador) {
    const permissoes = usuario?.permissoes || []
    const isCoordenador = permissoes.includes('api.change_organizacao') || usuario?.is_staff

    if (!isCoordenador) {
      return <Navigate to="/" replace />
    }
  }

  // Se passar por todas as verificações, renderiza a página solicitada
  return <Outlet />
}