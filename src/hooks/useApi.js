import { useEffect, useState } from 'react'
import { api } from '../services/api'

// Custom Hook para chamadas simples de API
export function useApi(caminho, buscar = api) {
  const [resposta, setResposta] = useState({ caminho: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    if (!caminho) return

    let ignore = false
    buscar(caminho)
      .then((dados) => {
        if (!ignore) setResposta({ caminho, dados })
      })
      .catch((erro) => {
        if (!ignore) setResposta({ caminho, erro })
      })

    return () => {
      ignore = true
    }
  }, [caminho, buscar, tentativa])

  function recarregar() {
    setResposta({ caminho: null })
    setTentativa((prev) => prev + 1)
  }

  // Enquanto a resposta for de outro caminho ou nula, indica carregamento
  const atual = resposta.caminho === caminho
  return {
    dados: atual ? resposta.dados : null,
    erro: atual ? resposta.erro : null,
    carregando: caminho ? !atual : false,
    recarregar,
  }
}

// Custom Hook para chamadas paginadas da API (listas com count, next, previous, results)
export function usePaginado(caminho) {
  const [lista, setLista] = useState({ caminho: null, itens: [], proxima: null })
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)
  const [carregandoMais, setCarregandoMais] = useState(false)

  useEffect(() => {
    if (!caminho) return

    let ignore = false
    api(caminho)
      .then((dados) => {
        if (ignore) return
        setErro(null)
        setLista({
          caminho,
          itens: dados.results || [],
          proxima: dados.next || null,
        })
      })
      .catch((err) => {
        if (!ignore) setErro(err)
      })

    return () => {
      ignore = true
    }
  }, [caminho, tentativa])

  async function carregarMais() {
    if (!lista.proxima) return
    setCarregandoMais(true)

    try {
      const dados = await api(lista.proxima)
      setLista((prev) => ({
        caminho,
        itens: [...prev.itens, ...(dados.results || [])],
        proxima: dados.next || null,
      }))
    } catch (err) {
      setErro(err)
    } finally {
      setCarregandoMais(false)
    }
  }

  function recarregar() {
    setErro(null)
    setLista({ caminho: null, itens: [], proxima: null })
    setTentativa((prev) => prev + 1)
  }

  const atual = lista.caminho === caminho
  return {
    itens: atual ? lista.itens : [],
    erro,
    carregando: caminho ? (!atual && !erro) || carregandoMais : false,
    temMais: atual && lista.proxima !== null,
    carregarMais,
    recarregar,
  }
}