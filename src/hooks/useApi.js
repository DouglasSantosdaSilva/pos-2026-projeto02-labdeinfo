// src/hooks/useApi.js
import { useState, useEffect } from 'react'

// Banco de dados simulado no React
const DADOS_SIMULADOS = {
  '/servicos/': {
    results: [
      { id: 1, nome: 'Uso Livre de Computadores', descricao: 'Estações com Linux, VS Code e Python.' },
      { id: 2, nome: 'Reserva para Aulas e Eventos', descricao: 'Laboratório reservado com projetor.' },
      { id: 3, nome: 'Apoio a Pesquisa & Projetos', descricao: 'Computadores de alto desempenho.' }
    ]
  },
  '/recursos/': {
    results: [
      { id: 1, nome: 'Laboratório de Informática 01', bio: '30 computadores com Linux.', capacidade: 30, ativo: true },
      { id: 2, nome: 'Laboratório de Redes', bio: '20 computadores com Cisco Packet Tracer.', capacidade: 20, ativo: true },
      { id: 3, nome: 'Laboratório de Hardware', bio: 'Bancadas equipadas para testes.', capacidade: 15, ativo: true }
    ]
  },
  '/reservas/': {
    results: [
      {
        id: 101,
        recurso_nome: 'Laboratório de Informática 01',
        servico_nome: 'Uso Livre de Computadores',
        data: '2026-10-25',
        horario_inicio: '08:00',
        horario_fim: '10:00',
        status: 'CONFIRMADA'
      }
    ]
  }
}

// Hook genérico useApi
export function useApi(endpoint) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const carregar = () => {
    if (!endpoint) {
      setCarregando(false)
      return
    }

    setCarregando(true)

    setTimeout(() => {
      const chave = Object.keys(DADOS_SIMULADOS).find((key) => endpoint.includes(key))

      if (chave) {
        setDados(DADOS_SIMULADOS[chave])
        setErro(null)
      } else {
        setDados({ results: [] })
      }
      setCarregando(false)
    }, 300)
  }

  useEffect(() => {
    carregar()
  }, [endpoint])

  return { dados, carregando, erro, recarregar: carregar }
}

// Hook de Paginação esperado por páginas como MinhasReservas.jsx
export function usePaginado(endpoint, params = {}) {
  const { dados, carregando, erro, recarregar } = useApi(endpoint)
  const [pagina, setPagina] = useState(1)

  return {
    dados: dados?.results || [],
    carregando,
    erro,
    recarregar,
    pagina,
    setPagina,
    totalPaginas: 1,
    count: dados?.results?.length || 0
  }
}