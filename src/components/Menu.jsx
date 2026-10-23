import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../AuthContext'

function classeNav({ isActive }) {
  return `nav-link px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'active fw-bold text-success' : 'text-secondary'
  }`
}

export function Menu() {
  const { usuario, pode, inicio, sair } = useAuth()
  const meunome = usuario?.nome || usuario?.email || 'Usuário'
  const nomeOrganizacao = usuario?.organizacao?.nome || 'Lab Info'
  const navegar = useNavigate()
  const [aberto, setAberto] = useState(false)

  // Itens principais dinâmicos baseados na permissão do usuário
  const itensPrincipais = pode && pode('api.change_organizacao')
    ? [
        { para: '/admin/agenda', rotulo: 'Agenda Geral' },
        { para: '/admin/confirmar', rotulo: 'A confirmar' },
        { para: '/admin/avaliacoes', rotulo: 'Avaliações' },
      ]
    : [
        { para: '/inicio', rotulo: 'Início' },
        ...(pode && pode('api.add_agendamento') ? [{ para: '/agendar', rotulo: 'Agendar' }] : []),
        { para: '/reservas', rotulo: 'Minhas reservas' },
        { para: '/laboratorios', rotulo: 'Laboratórios' },
      ]

  // Menu de Cadastros para administradores/coordenadores
  const itensCadastros = [
    { para: '/admin/negocio', rotulo: 'Configurações do Lab' },
    { para: '/admin/recursos', rotulo: 'Laboratórios / Sala' },
    { para: '/admin/servicos', rotulo: 'Softwares / Serviços' },
  ]

  const handleLogout = () => {
    setAberto(false)
    sair()
    navegar('/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm py-2">
      <Container>
        {/* Logo / Nome da Organização */}
        <Navbar.Brand as={Link} to={inicio || '/inicio'} className="d-flex align-items-center gap-2 fw-bold">
          <span className="badge bg-success text-dark fs-6">&lt;/&gt;</span>
          <span>{nomeOrganizacao}</span>
        </Navbar.Brand>

        {/* Botão de Toggle para telas pequenas */}
        <Navbar.Toggle 
          aria-controls="navbar-labinfo-menu" 
          onClick={() => setAberto(!aberto)} 
        />

        {/* Links de Navegação */}
        <Navbar.Collapse id="navbar-labinfo-menu" in={aberto}>
          <Nav className="me-auto ms-md-3 gap-1">
            {itensPrincipais.map((item) => (
              <NavLink
                key={item.para}
                to={item.para}
                className={classeNav}
                onClick={() => setAberto(false)}
              >
                {item.rotulo}
              </NavLink>
            ))}

            {/* Menu Dropdown de Cadastros (Administração) */}
            {pode && pode('api.change_organizacao') && (
              <NavDropdown title="Cadastros" id="dropdown-cadastros-admin">
                {itensCadastros.map((item) => (
                  <NavDropdown.Item
                    key={item.para}
                    as={Link}
                    to={item.para}
                    onClick={() => setAberto(false)}
                  >
                    {item.rotulo}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            )}
          </Nav>

          {/* Área do Perfil do Usuário */}
          <Nav className="align-items-md-center gap-2 mt-3 mt-md-0">
            <NavDropdown
              title={`👤 ${meunome}`}
              id="dropdown-usuario-perfil"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/perfil" onClick={() => setAberto(false)}>
                <i className="bi bi-person me-2"></i> Meu perfil
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i> Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}