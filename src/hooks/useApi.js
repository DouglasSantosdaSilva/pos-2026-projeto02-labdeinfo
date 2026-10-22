// src/hooks/useApi.js
import { useState, useEffect } from 'react'

const SERVICOS_MOCK = [
  { id: 1, nome: 'Uso Livre de Computadores', descricao: 'Estações com Linux, VS Code e Python.' },
  { id: 2, nome: 'Reserva para Aulas e Eventos', descricao: 'Laboratório reservado com projetor.' },
  { id: 3, nome: 'Apoio a Pesquisa & Projetos', descricao: 'Computadores de alto desempenho.' }
]

const RECURSOS_MOCK = [
  { id: 1, nome: 'Laboratório de Informática 01', bio: '30 computadores com Linux.', capacidade: 30, ativo: true },
  { id: 2, nome: 'Laboratório de Redes', bio: '20 computadores com Cisco Packet Tracer.', capacidade: 20, ativo: true },
  { id: 3, nome: 'Laboratório de Hardware', bio: 'Bancadas equipadas para testes.', capacidade: 15, ativo: true }
]

const HORARIOS_PADRAO = [
  { id: 1, hora: '08:00', inicio: '08:00', fim: '09:00', livre: true, disponivel: true },
  { id: 2, hora: '09:00', inicio: '09:00', fim: '10:00', livre: true, disponivel: true },
  { id: 3, hora: '10:00', inicio: '10:00', fim: '11:00', livre: true, disponivel: true }
]

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
      try {
        if (endpoint.includes('/servicos/')) {
          const match = endpoint.match(/\/servicos\/(\d+)/)
          if (match) {
            const item = SERVICOS_MOCK.find(s => s.id === Number(match[1])) || SERVICOS_MOCK[0]
            setDados(item)
          } else {
            setDados({ results: SERVICOS_MOCK })
          }
          setErro(null)
        } else if (endpoint.includes('/recursos/')) {
          const match = endpoint.match(/\/recursos\/(\d+)/)
          if (match) {
            const item = RECURSOS_MOCK.find(r => r.id === Number(match[1])) || RECURSOS_MOCK[0]
            setDados(item)
          } else {
            setDados({ results: RECURSOS_MOCK })
          }
          setErro(null)
        } else if (endpoint.includes('horario') || endpoint.includes('disponib')) {
          setDados({ results: RECURSOS_MOCK, laboratorios: RECURSOS_MOCK })
          setErro(null)
        } else {
          setDados({ results: [] })
          setErro(null)
        }
      } catch (e) {
        setErro(null)
        setDados({})
      } finally {
        setCarregando(false)
      }
    }, 300)
  }

  useEffect(() => {
    carregar()
  }, [endpoint])

  return { dados, carregando, erro, recarregar: carregar }
}

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