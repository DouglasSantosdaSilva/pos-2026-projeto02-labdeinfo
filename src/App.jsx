import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './routes/ProtectedRoute'

// Páginas Autenticação & Perfil
import Entrada from './pages/auth/Entrada'
import Cadastro from './pages/auth/Cadastro'
import Login from './pages/auth/Login'
import EsqueciSenha from './pages/auth/EsqueciSenha'
import MeuPerfil from './pages/auth/MeuPerfil'
import AlterarSenha from './pages/auth/AlterarSenha'

// Páginas Aluno
import InicioAluno from './pages/aluno/InicioAluno'
import MinhasReservas from './pages/aluno/MinhasReservas'
import DetalheReserva from './pages/aluno/DetalheReserva'
import Avaliar from './pages/aluno/Avaliar'
import Laboratorios from './pages/aluno/Laboratorios'
import PerfilLaboratorio from './pages/aluno/PerfilLaboratorio'

// Fluxo Agendamento
import EscolherServico from './pages/agendar/EscolherServico'
import EscolherLaboratorio from './pages/agendar/EscolherLaboratorio'
import EscolherHorario from './pages/agendar/EscolherHorario'
import Confirmar from './pages/agendar/Confirmar'
import Enviado from './pages/agendar/Enviado'

import OcupacaoDia from './pages/admin/OcupacaoDia'
import AConfirmar from './pages/admin/AConfirmar'
import Negocio from './pages/admin/Negocio'
import LaboratoriosAdmin from './pages/admin/LaboratoriosAdmin'
import FormLaboratorio from './pages/admin/FormLaboratorio'
import Horarios from './pages/admin/Horarios'
import Servicos from './pages/admin/Servicos'
import FormServico from './pages/admin/FormServico'
import Avaliacoes from './pages/admin/Avaliacoes'

import NaoEncontrado from './pages/NaoEncontrado'

export default function App() {
  const { usuario, logout } = useAuth()

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/entrada" element={<Entrada />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />

      {/* Rotas Protegidas (Aluno & Coordenador) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout usuario={usuario} onLogout={logout} />}>
        <Route path="/" element={<InicioAluno />} />
          <Route path="/minhas-reservas" element={<MinhasReservas />} />
          <Route path="/reservas/:id" element={<DetalheReserva usuario={usuario} />} />
          <Route path="/reservas/:id/avaliar" element={<Avaliar />} />
          <Route path="/laboratorios" element={<Laboratorios />} />
          <Route path="/laboratorios/:id" element={<PerfilLaboratorio />} />

          {/* Agendamento */}
          <Route path="/agendar" element={<EscolherServico />} />
          <Route path="/agendar/laboratorio" element={<EscolherLaboratorio />} />
          <Route path="/agendar/horario" element={<EscolherHorario />} />
          <Route path="/agendar/confirmar" element={<Confirmar />} />
          <Route path="/agendar/enviado" element={<Enviado />} />

          {/* Perfil */}
          <Route path="/perfil" element={<MeuPerfil onLogout={logout} />} />
          <Route path="/alterar-senha" element={<AlterarSenha />} />
        </Route>
      </Route>

      {/* Rotas do Coordenador */}
      <Route element={<ProtectedRoute requerCoordenador={true} />}>
        <Route element={<Layout usuario={usuario} onLogout={logout} />}>
          <Route path="/admin/ocupacao" element={<OcupacaoDia />} />
          <Route path="/admin/aconfirmar" element={<AConfirmar />} />
          <Route path="/admin/negocio" element={<Negocio />} />
          <Route path="/admin/laboratorios" element={<LaboratoriosAdmin />} />
          <Route path="/admin/laboratorios/novo" element={<FormLaboratorio />} />
          <Route path="/admin/laboratorios/:id" element={<FormLaboratorio />} />
          <Route path="/admin/laboratorios/:id/horarios" element={<Horarios />} />
          <Route path="/admin/servicos" element={<Servicos />} />
          <Route path="/admin/servicos/novo" element={<FormServico />} />
          <Route path="/admin/servicos/:id" element={<FormServico />} />
          <Route path="/admin/avaliacoes" element={<Avaliacoes />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NaoEncontrado />} />
    </Routes>
  )
}