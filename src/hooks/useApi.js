import { useEffect, useState } from 'react'
import { api } from '../api/client'

// Custom hook para requisições simples à API
export function useApi(caminho, buscar = api) {
  const [resposta, setResposta] = useState({ caminho: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
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
    setTentativa((t) => t + 1)
  }

  const atual = resposta.caminho === caminho
  return {
    dados: atual ? resposta.dados : null,
    erro: atual ? resposta.erro : null,
    carregando: !atual,
    recarregar,
  }
}

// Custom hook para requisições paginadas da API DRF: { count, next, previous, results }
export function usePaginado(caminho) {
  const [lista, setLista] = useState({ caminho: null, itens: [], proxima: null })
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)
  const [carregandoMais, setCarregandoMais] = useState(false)

  useEffect(() => {
    let ignore = false
    api(caminho)
      .then((dados) => {
        if (ignore) return
        setErro(null)
        setLista({ caminho, itens: dados.results, proxima: dados.next })
      })
      .catch((err) => {
        if (!ignore) setErro(err)
      })
    return () => {
      ignore = true
    }
  }, [caminho, tentativa])

  async function carregarMais() {
    setCarregandoMais(true)
    try {
      const dados = await api(lista.proxima)
      setLista({
        caminho,
        itens: [...lista.itens, ...dados.results],
        proxima: dados.next,
      })
    } catch (err) {
      setErro(err)
    }
    setCarregandoMais(false)
  }

  function recarregar() {
    setErro(null)
    setLista({ caminho: null, itens: [], proxima: null })
    setTentativa((t) => t + 1)
  }

  const atual = lista.caminho === caminho
  return {
    itens: atual ? lista.itens : [],
    erro,
    carregando: (!atual && !erro) || carregandoMais,
    temMais: atual && lista.proxima !== null,
    carregarMais,
    recarregar,
  }
}