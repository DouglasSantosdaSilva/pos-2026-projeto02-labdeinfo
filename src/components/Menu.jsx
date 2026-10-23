import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Foto } from './Foto'

export function Menu() {
  const { usuario, pode, inicio, sair } = useAuth()
  const organizacao = usuario?.organizacao

  const itensPrincipais = pode('api.change_organizacao')
    ? [
        { para: '/admin/agenda', rotulo: 'Agenda' },
        { para: '/admin/confirmar', rotulo: 'A confirmar' },
        { para: '/admin/avaliacoes', rotulo: 'Avaliações' },
      ]
    : [
        { para: '/inicio', rotulo: 'Início' },
        ...(pode('api.add_agendamento') ? [{ para: '/agendar', rotulo: 'Reservar' }] : []),
        { para: '/reservas', rotulo: 'Minhas reservas' },
        { para: '/recursos', rotulo: 'Recursos' },
      ]

  const itensCadastros = [
    { para: '/admin/negocio', rotulo: 'Dados do Laboratório' },
    { para: '/admin/recursos', rotulo: 'Recursos' },
    { para: '/admin/servicos', rotulo: 'Serviços / Softwares' },
  ]

  return (
    <Navbar bg="light" expand="md" className="border-bottom mb-4 shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to={inicio} className="d-flex align-items-center fw-bold text-primary">
          <img
            src="/favicon.png"
            alt="Logo"
            width={32}
            height={32}
            className="me-2 rounded"
          />
          {organizacao?.nome || 'Lab Info'}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-navegacao" />

        <Navbar.Collapse id="menu-navegacao">
          <Nav className="me-auto my-2 my-md-0">
            {itensPrincipais.map((item) => (
              <Nav.Link
                key={item.para}
                as={NavLink}
                to={item.para}
                className="px-3"
              >
                {item.rotulo}
              </Nav.Link>
            ))}

            {pode('api.change_organizacao') && (
              <NavDropdown title="Cadastros" id="dropdown-cadastros" className="px-2">
                {itensCadastros.map((item) => (
                  <NavDropdown.Item
                    key={item.para}
                    as={Link}
                    to={item.para}
                  >
                    {item.rotulo}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            )}
          </Nav>

          <Nav className="ms-auto align-items-md-center">
            <NavDropdown
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold text-dark">
                  <Foto src={usuario?.foto} tamanho={28} />
                  <span>{usuario?.nome}</span>
                </span>
              }
              id="dropdown-usuario"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/perfil">
                <i className="bi bi-person me-2"></i>Meu perfil
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={sair} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i>Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}