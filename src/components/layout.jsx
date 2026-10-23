import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Carregando } from './Carregando'
import { Menu } from './Menu'

export function Layout() {
  const { usuario, carregando } = useAuth()

  // 1. Enquanto o AuthProvider verifica o localStorage / API
  if (carregando) {
    return <Carregando />
  }

  // 2. Se o usuário não estiver autenticado, redireciona para a tela de entrada
  if (!usuario) {
    return <Navigate to="/" replace />
  }

  // 3. Renderiza a estrutura com Menu no topo e as páginas filhas no Outlet
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Menu />
      <main className="container my-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  )
}