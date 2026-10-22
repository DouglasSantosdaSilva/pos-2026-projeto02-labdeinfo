import React from 'react'
import { Container, Card, ListGroup } from 'react-bootstrap'
import { useApi } from '../../hooks/useApi'
import { Avaliacao } from '../../components/Avaliacao'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { formatarData } from '../../formatos' // <-- Nota o ../../ aqui

export default function Avaliacoes() {
  const { dados: avaliacoes, carregando, erro } = useApi('/avaliacoes/')

  if (carregando) return <Carregando mensagem="A carregar avaliações..." />
  if (erro) return <Erro mensagem="Erro ao carregar as avaliações do laboratório." />

  return (
    <Container className="py-4">
      <h2 className="mb-4">Avaliações do Laboratório</h2>
      
      {avaliacoes?.length === 0 ? (
        <p className="text-muted">Nenhuma avaliação registada até ao momento.</p>
      ) : (
        <Card className="shadow-sm">
          <ListGroup variant="flush">
            {avaliacoes?.map((item) => (
              <Avaliacao key={item.id} avaliacao={item} />
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  )
}