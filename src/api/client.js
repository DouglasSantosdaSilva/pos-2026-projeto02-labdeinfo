const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export const ORGANIZACAO = import.meta.env.VITE_ORGANIZACAO || 'laboratorio-de-informatica'

function enviar(caminho, { method = 'GET', body } = {}) {
  const url = caminho.startsWith('http') ? caminho : `${API}${caminho.startsWith('/') ? '' : '/'}${caminho}`
  const headers = {}

  const access = localStorage.getItem('access')
  if (access) {
    headers.Authorization = `Bearer ${access}`
  }

  // FormData (envio de arquivos/imagens) vai direto: o navegador monta o Content-Type
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  return fetch(url, { method, headers, body })
}

async function renovarToken() {
  try {
    const resposta = await fetch(`${API}/auth/renovar/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: localStorage.getItem('refresh') }),
    })
    if (!resposta.ok) return false
    const { access } = await resposta.json()
    localStorage.setItem('access', access)
    return true
  } catch {
    return false
  }
}

export async function api(caminho, opcoes) {
  try {
    let resposta = await enviar(caminho, opcoes)

    if (resposta.status === 401 && localStorage.getItem('refresh')) {
      if (await renovarToken()) {
        resposta = await enviar(caminho, opcoes)
      } else {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        window.location.href = '/login'
        return
      }
    }

    const dados = resposta.status === 204 ? null : await resposta.json().catch(() => null)
    if (!resposta.ok) {
      throw { status: resposta.status, dados }
    }
    return dados
  } catch (err) {
    if (err.status) throw err
    // Trata falha total de conexão (Backend offline)
    throw { status: 0, dados: null, message: 'Servidor indisponível no momento.' }
  }
}

// Junta os resultados de todas as páginas de uma lista (Paginação Django)
export async function buscarTodas(caminho) {
  let itens = []
  let proxima = caminho
  while (proxima) {
    const dados = await api(proxima)
    if (dados?.results) {
      itens = [...itens, ...dados.results]
      proxima = dados.next
    } else if (Array.isArray(dados)) {
      return dados
    } else {
      break
    }
  }
  return itens
}

export function mensagemDeErro(erro) {
  const dados = erro?.dados
  if (!erro?.status || erro?.status === 0) return 'Não foi possível se conectar ao servidor de laboratórios.'
  if (erro.status === 403) return 'Você não tem permissão para realizar esta ação.'
  if (erro.status === 404) return 'Recurso não encontrado.'
  if (erro.status === 429) return 'Muitas tentativas. Por favor, aguarde um minuto.'
  if (Array.isArray(dados)) return dados.join(' ')
  if (dados?.detail) return dados.detail
  if (dados?.non_field_errors) return dados.non_field_errors.join(' ')
  return 'Verifique os dados informados e tente novamente.'
}

// Autenticação
export function login(email, senha) {
  return api('/auth/login/', {
    method: 'POST',
    body: { organizacao: ORGANIZACAO, email, senha },
  })
}

export function cadastrar(nome, email, senha) {
  return api('/auth/cadastro/', {
    method: 'POST',
    body: { organizacao: ORGANIZACAO, nome, email, senha },
  })
}

export function redefinirSenha(email) {
  return api('/auth/redefinir-senha/', {
    method: 'POST',
    body: { organizacao: ORGANIZACAO, email },
  })
}

// Helpers específicos do Laboratório de Informática
export function buscarLaboratorios() {
  return api('/laboratorios/')
}

export function buscarReservas() {
  return api('/reservas/')
}

export function criarReserva(dadosReserva) {
  return api('/reservas/', {
    method: 'POST',
    body: dadosReserva,
  })
}

export function cancelarReserva(id) {
  return api(`/reservas/${id}/`, {
    method: 'DELETE',
  })
}