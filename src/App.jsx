import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'
import { Layout } from './components/Layout'
import { Publica } from './components/Publica'

// Painel Administrativo
import { AConfirmar } from './pages/admin/AConfirmar'
import { Agenda } from './pages/admin/Agenda'
import { Avaliacoes } from './pages/admin/Avaliacoes'
import { Horarios } from './pages/admin/Horarios'
import { Negocio } from './pages/admin/Negocio'
import { EditarRecurso, NovoRecurso } from './pages/admin/Recurso'
import { Recursos } from './pages/admin/Recursos'
import { EditarServico, NovoServico } from './pages/admin/Servico'
import { Servicos } from './pages/admin/Servicos'

// Fluxo de Agendamento
import { Confirmar } from './pages/agendar/Confirmar'
import { EscolherHorario } from './pages/agendar/EscolherHorario'
import { EscolherLaboratorio } from './pages/agendar/EscolherLaboratorio'
import { EscolherServico } from './pages/agendar/EscolherServico'
import { Enviado } from './pages/agendar/Enviado'

// Páginas de Usuário e Reservas
import { AlterarSenha } from './pages/AlterarSenha'
import { Avaliar } from './pages/Avaliar'
import { Cadastro } from './pages/Cadastro'
import { Entrada } from './pages/Entrada'
import { EsqueciSenha } from './pages/EsqueciSenha'
import { Inicio } from './pages/Inicio'
import { Laboratorio } from './pages/Laboratorio'
import { Laboratorios } from './pages/Laboratorios'
import { Login } from './pages/Login'
import { MinhasReservas } from './pages/MinhasReservas'
import { NaoEncontrado } from './pages/NaoEncontrado'
import { Perfil } from './pages/Perfil'
import { Reserva } from './pages/Reserva'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route element={<Publica />}>
            <Route index element={<Entrada />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          </Route>

          {/* Rotas com Layout Principal */}
          <Route element={<Layout />}>
            <Route path="/inicio" element={<Inicio />} />

            {/* Agendamento */}
            <Route path="/agendar" element={<EscolherServico />} />
            <Route path="/agendar/laboratorio" element={<EscolherLaboratorio />} />
            <Route path="/agendar/horario" element={<EscolherHorario />} />
            <Route path="/agendar/confirmar" element={<Confirmar />} />
            <Route path="/agendar/enviado" element={<Enviado />} />

            {/* Minhas Reservas */}
            <Route path="/reservas" element={<MinhasReservas />} />
            <Route path="/reservas/:id" element={<Reserva />} />
            <Route path="/reservas/:id/avaliar" element={<Avaliar />} />

            {/* Perfil do Usuário */}
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/senha" element={<AlterarSenha />} />

            {/* Visualização de Laboratórios */}
            <Route path="/laboratorios" element={<Laboratorios />} />
            <Route path="/laboratorios/:id" element={<Laboratorio />} />

            {/* Administração */}
            <Route path="/admin/agenda" element={<Agenda />} />
            <Route path="/admin/confirmar" element={<AConfirmar />} />
            <Route path="/admin/negocio" element={<Negocio />} />
            <Route path="/admin/recursos" element={<Recursos />} />
            <Route path="/admin/recursos/novo" element={<NovoRecurso />} />
            <Route path="/admin/recursos/:id" element={<EditarRecurso />} />
            <Route path="/admin/recursos/:id/horarios" element={<Horarios />} />
            <Route path="/admin/servicos" element={<Servicos />} />
            <Route path="/admin/servicos/novo" element={<NovoServico />} />
            <Route path="/admin/servicos/:id" element={<EditarServico />} />
            <Route path="/admin/avaliacoes" element={<Avaliacoes />} />

            {/* Rota 404 */}
            <Route path="*" element={<NaoEncontrado />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App