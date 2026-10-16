
import React from 'react'
import { Nav, Navbar, Container, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

export function Menu({ usuario, onLogout }) {
  const location = useLocation()

  const permissoes = usuario?.permissoes || []
  const grupos = usuario?.grupos || []

  // Identifica usuários com permissões administrativas
  const isCoordenador =
    permissoes.includes('api.change_organizacao') ||
    usuario?.is_staff === true ||
    usuario?.is_superuser === true ||
    grupos.some((grupo) =>
      ['Administrador', 'Administradores', 'Coordenador', 'Coordenadores'].includes(
        typeof grupo === 'string' ? grupo : grupo?.name
      )
    )

  const podeAgendar = permissoes.includes('api.add_agendamento')

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isCoordenador ? '/admin/ocupacao' : '/'}>
          💻 LabAgenda
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-navegacao" />

        <Navbar.Collapse id="menu-navegacao">
          <Nav className="me-auto">
            {/* Páginas comuns: alunos e administradores */}
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              Início
            </Nav.Link>

            {podeAgendar && (
              <Nav.Link
                as={Link}
                to="/agendar"
                active={location.pathname.startsWith('/agendar')}
              >
                Agendar
              </Nav.Link>
            )}

            <Nav.Link
              as={Link}
              to="/minhas-reservas"
              active={location.pathname.startsWith('/minhas-reservas')}
            >
              Minhas Reservas
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/laboratorios"
              active={
                location.pathname === '/laboratorios' ||
                /^\/laboratorios\/[^/]+$/.test(location.pathname)
              }
            >
              Laboratórios
            </Nav.Link>

            {/* Páginas exclusivas de administração */}
            {isCoordenador && (
              <>
                <Nav.Link
                  as={Link}
                  to="/admin/ocupacao"
                  active={location.pathname === '/admin/ocupacao'}
                >
                  Ocupação do Dia
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/admin/aconfirmar"
                  active={location.pathname === '/admin/aconfirmar'}
                >
                  A Confirmar
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/admin/negocio"
                  active={location.pathname === '/admin/negocio'}
                >
                  Organização
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/admin/laboratorios"
                  active={location.pathname.startsWith('/admin/laboratorios')}
                >
                  Gerenciar Laboratórios
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/admin/servicos"
                  active={location.pathname.startsWith('/admin/servicos')}
                >
                  Gerenciar Serviços
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/admin/avaliacoes"
                  active={location.pathname === '/admin/avaliacoes'}
                >
                  Avaliações
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Perfil e saída */}
          <Nav className="align-items-center gap-2">
            <Nav.Link
              as={Link}
              to="/perfil"
              className="d-flex align-items-center gap-2"
            >
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
