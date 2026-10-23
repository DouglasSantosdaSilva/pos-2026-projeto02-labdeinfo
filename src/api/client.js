const API = import.meta.env.VITE_API_URL
export const ORGANIZACAO = import.meta.env.VITE_ORGANIZACAO

function enviar(caminho, { method = 'GET', body } = {}) {
  const url = caminho.startsWith('http') ? caminho : API + caminho
  const headers = {}

  const access = localStorage.getItem('access')
  if (access) {
    headers.Authorization = `Bearer ${access}`
  }

  // FormData (envio de imagens e arquivos) vai direto; o navegador monta o Content-Type com boundary
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  return fetch(url, { method, headers, body })
}

async function renovarToken() {
  const resposta = await fetch(`${API}/auth/renovar/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: localStorage.getItem('refresh') }),
  })

  if (!resposta.ok) {
    return false
  }

  const { access } = await resposta.json()
  localStorage.setItem('access', access)
  return true
}

export async function api(caminho, opcoes) {
  let resposta = await enviar(caminho, opcoes)

  if (resposta.status === 401 && localStorage.getItem('refresh')) {
    if (await renovarToken()) {
      resposta = await enviar(caminho, opcoes)
    } else {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      window.location.href = '/'
    }
  }

  const dados = resposta.status === 204 ? null : await resposta.json()
  if (!resposta.ok) {
    throw { status: resposta.status, dados }
  }
  return dados
}

// Junta os resultados de todas as páginas em buscas paginadas do DRF
export async function buscarTodas(caminho) {
  let itens = []
  let proxima = caminho
  while (proxima) {
    const dados = await api(proxima)
    itens = [...itens, ...(dados.results || [])]
    proxima = dados.next
  }
  return itens
}

export function mensagemDeErro(erro) {
  const dados = erro?.dados
  if (!erro?.status) return 'Não foi possível se comunicar com o servidor.'
  if (erro.status === 403) return 'Você não tem permissão para realizar esta ação.'
  if (erro.status === 404) return 'Recurso não encontrado.'
  if (erro.status === 429) return 'Muitas tentativas. Aguarde um momento.'
  if (Array.isArray(dados)) return dados.join(' ')
  if (typeof dados === 'string') return dados
  if (dados?.detail) return dados.detail
  if (dados?.non_field_errors) return dados.non_field_errors.join(' ')

  // Formata erros de validação por campo vindos do DRF: { "campo": ["Erro 1"] }
  if (dados && typeof dados === 'object') {
    const mensagens = Object.values(dados).flat()
    if (mensagens.length > 0) return mensagens.join(' ')
  }

  return 'Verifique os dados informados e tente novamente.'
}

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