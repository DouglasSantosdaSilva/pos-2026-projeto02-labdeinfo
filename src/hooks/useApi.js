import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

// Hook simples para requisições GET
export function useApi(endpoint, options = {}) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const res = await api(endpoint, options)
      setDados(res)
    } catch (err) {
      setErro(err)
    } finally {
      setCarregando(false)
    }
  }, [endpoint])

  useEffect(() => {
    if (endpoint) {
      recarregar()
    }
  }, [recarregar])

  return { dados, carregando, erro, recarregar }
}

// Hook para requisições paginadas (usado em MinhasReservas)
export function usePaginado(endpoint) {
  const [dados, setDados] = useState([])
  const [pagina, setPagina] = useState(1)
  const [temMais, setTemMais] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const carregarPagina = useCallback(async (p = 1) => {
    setCarregando(true)
    try {
      const res = await api(`${endpoint}?page=${p}`)
      const lista = res.results || res
      setDados((prev) => (p === 1 ? lista : [...prev, ...lista]))
      setTemMais(Boolean(res.next))
      setPagina(p)
    } catch (err) {
      setErro(err)
    } finally {
      setCarregando(false)
    }
  }, [endpoint])

  useEffect(() => {
    carregarPagina(1)
  }, [carregarPagina])

  const carregarMais = () => {
    if (temMais && !carregando) {
      carregarPagina(pagina + 1)
    }
  }

  return { dados, carregando, erro, temMais, carregarMais, recarregar: () => carregarPagina(1) }
}