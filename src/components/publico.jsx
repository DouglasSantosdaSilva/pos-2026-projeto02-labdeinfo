import React from 'react'
import { Container, Card, Row, Col } from 'react-bootstrap'
import { Foto } from './foto'

export function publico({ children, titulo, subTitulo, logoUrl, nomeOrganizacao = 'Laboratório de Informática' }) {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5}>
            {/* Branding / Marca */}
            <div className="text-center mb-4">
              <Foto
                src={logoUrl}
                alt={nomeOrganizacao}
                tamanho={72}
                arredondado={true}
                className="mb-2 shadow-sm"
              />
              <h2 className="fw-bold text-dark fs-4 mt-2">{nomeOrganizacao}</h2>
            </div>

            {/* Cartão de Conteúdo da Tela (Login, Cadastro, etc.) */}
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body className="p-4">
                {titulo && <Card.Title as="h3" className="fs-5 fw-bold text-center mb-1">{titulo}</Card.Title>}
                {subTitulo && <p className="text-muted text-center small mb-4">{subTitulo}</p>}
                
                {children}
              </Card.Body>
            </Card>

            {/* Rodapé Simplificado */}
            <div className="text-center text-muted small mt-4">
              App de Agendamento do Laboratório de Informática
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}