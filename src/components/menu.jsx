import React from 'react'
import { Nav, Navbar, Container, Button } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export function Menu({ usuario, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Extrai o array de permissões retornado da API
  const permissoes = usuario?.permissoes || []

  // Regra da Seção 7/9: É coordenador se possuir permissão de alterar a organização
  const isCoordenador = permissoes.includes('api.change_organizacao')
  const podeAgendar = permissoes.includes('api.add_agendamento')

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isCoordenador ? '/ocupacao' : '/'}>
          💻 LabAgenda
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-navegacao" />
        <Navbar.Collapse id="menu-navegacao">
          <Nav className="me-auto">
            {/* Menu Aluno */}
            {!isCoordenador && (
              <>
                <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
                  Início
                </Nav.Link>
                {podeAgendar && (
                  <Nav.Link as={Link} to="/agendar" active={location.pathname.startsWith('/agendar')}>
                    Agendar
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/minhas-reservas" active={location.pathname === '/minhas-reservas'}>
                  Minhas Reservas
                </Nav.Link>
                <Nav.Link as={Link} to="/laboratorios" active={location.pathname.startsWith('/laboratorios')}>
                  Laboratórios
                </Nav.Link>
              </>
            )}

            {/* Menu Coordenador */}
            {isCoordenador && (
              <>
                <Nav.Link as={Link} to="/ocupacao" active={location.pathname === '/ocupacao'}>
                  Ocupação do Dia
                </Nav.Link>
                <Nav.Link as={Link} to="/a-confirmar" active={location.pathname === '/a-confirmar'}>
                  A Confirmar
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/negocio" active={location.pathname === '/admin/negocio'}>
                  Negócio
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/laboratorios" active={location.pathname.startsWith('/admin/laboratorios')}>
                  Laboratórios
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/servicos" active={location.pathname.startsWith('/admin/servicos')}>
                  Serviços
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/avaliacoes" active={location.pathname === '/admin/avaliacoes'}>
                  Avaliações
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Atalho de Perfil e Logout */}
          <Nav className="align-items-center gap-2">
            <Nav.Link as={Link} to="/perfil" className="d-flex align-items-center gap-2">
              <span className="text-light small">{usuario?.nome}</span>
            </Nav.Link>
            <Button variant="outline-light" size="sm" onClick={onLogout}>
              Sair
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}