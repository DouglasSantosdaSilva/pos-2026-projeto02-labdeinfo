const API = import.meta.env.VITE_API_URL || 'https://agendamentos.spaincentral.cloudapp.azure.com/api'
export const ORGANIZACAO = import.meta.env.VITE_ORGANIZACAO || 'laboratorio-de-informatica'

// --- MECÂNICA BASE DO REPOSITÓRIO DE REFERÊNCIA ---

function enviar(caminho, { method = 'GET', body } = {}) {
  const url = caminho.startsWith('http') ? caminho : API + caminho
  const headers = {}

  const access = localStorage.getItem('access')
  if (access) {
    headers.Authorization = `Bearer ${access}`
  }

  // FormData (envio de imagens) vai direto: o navegador monta o Content-Type
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  return fetch(url, { method, headers, body })
}

async function renovarToken() {
  const refresh = localStorage.getItem('refresh')
  if (!refresh) return false

  const resposta = await fetch(`${API}/auth/renovar/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
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
      window.location.href = '/login'
    }
  }

  const dados = resposta.status === 204 ? null : await resposta.json()
  if (!resposta.ok) {
    throw { status: resposta.status, dados }
  }
  return dados
}

// Junta os resultados de todas as páginas de uma lista
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
  if (!erro?.status) return 'Não foi possível falar com o servidor.'
  if (erro.status === 403) return 'Você não tem permissão para esta ação.'
  if (erro.status === 404) return 'Não encontrado.'
  if (erro.status === 429) return 'Muitas tentativas, aguarde um minuto.'
  if (Array.isArray(dados)) return dados.join(' ')
  if (dados?.detail) return dados.detail
  if (dados?.non_field_errors) return dados.non_field_errors.join(' ')
  return 'Verifique os campos destacados.'
}

// --- AUTENTICAÇÃO E PERFIL (E2, E3, E4, E5, E6) ---

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

export function buscarUsuarioAtual() {
  return api('/auth/eu/')
}

export function atualizarPerfil(formData) {
  return api('/auth/eu/', {
    method: 'PATCH',
    body: formData, // FormData (para envio de foto multipart)
  })
}

export function alterarSenha(senha_atual, nova_senha) {
  return api('/auth/alterar-senha/', {
    method: 'POST',
    body: { senha_atual, nova_senha },
  })
}

// --- ORGANIZAÇÃO / DADOS DO NEGÓCIO (A4) ---

export function buscarOrganizacao() {
  return api('/organizacao/')
}

export function atualizarOrganizacao(formData) {
  return api('/organizacao/', {
    method: 'PATCH',
    body: formData, // multipart para logo
  })
}

// --- LABORATÓRIOS / RECURSOS (C3, C10, C11, A5, A6) ---

export function buscarLaboratorios(params = '') {
  return api(`/recursos/${params ? `?${params}` : ''}`)
}

export function buscarLaboratorioPorId(id) {
  return api(`/recursos/${id}/`)
}

export function criarLaboratorio(formData) {
  return api('/recursos/', {
    method: 'POST',
    body: formData, // multipart para foto
  })
}

export function atualizarLaboratorio(id, formData) {
  return api(`/recursos/${id}/`, {
    method: 'PATCH',
    body: formData,
  })
}

// --- HORÁRIOS / DISPONIBILIDADES DO LAB (A7) ---

export function buscarDisponibilidades(recursoId) {
  return api(`/disponibilidades/?recurso=${recursoId}`)
}

export function criarDisponibilidade(dados) {
  return api('/disponibilidades/', {
    method: 'POST',
    body: dados,
  })
}

export function atualizarDisponibilidade(id, dados) {
  return api(`/disponibilidades/${id}/`, {
    method: 'PATCH',
    body: dados,
  })
}

export function excluirDisponibilidade(id) {
  return api(`/disponibilidades/${id}/`, {
    method: 'DELETE',
  })
}

// --- SERVIÇOS (C2, A8, A9) ---

export function buscarServicos(params = '') {
  return api(`/servicos/${params ? `?${params}` : ''}`)
}

export function criarServico(formData) {
  return api('/servicos/', {
    method: 'POST',
    body: formData, // multipart para imagem
  })
}

export function atualizarServico(id, formData) {
  return api(`/servicos/${id}/`, {
    method: 'PATCH',
    body: formData,
  })
}

// --- HORÁRIOS LIVRES (C4 - Filtro para hora cheia) ---

export function buscarHorariosLivres(servicoId, data, recursoId = null) {
  let url = `/horarios-livres/?servico=${servicoId}&data=${data}`
  if (recursoId) url += `&recurso=${recursoId}`
  return api(url)
}

// --- AGENDAMENTOS E RESERVAS (C1, C5, C7, C8, A1, A2, A3) ---

export function buscarAgendamentos(params = '') {
  return api(`/agendamentos/${params ? `?${params}` : ''}`)
}

export function buscarAgendamentoPorId(id) {
  return api(`/agendamentos/${id}/`)
}

export function criarAgendamento(dados) {
  return api('/agendamentos/', {
    method: 'POST',
    body: dados,
  })
}

export function confirmarAgendamento(id) {
  return api(`/agendamentos/${id}/confirmar/`, { method: 'POST' })
}

export function concluirAgendamento(id) {
  return api(`/agendamentos/${id}/concluir/`, { method: 'POST' })
}

export function cancelarAgendamento(id) {
  return api(`/agendamentos/${id}/cancelar/`, { method: 'POST' })
}

export function avaliarAgendamento(id, nota, comentario) {
  return api(`/agendamentos/${id}/avaliar/`, {
    method: 'POST',
    body: { nota, comentario },
  })
}

// --- AVALIAÇÕES (C11, A10) ---

export function buscarAvaliacoes(params = '') {
  return api(`/avaliacoes/${params ? `?${params}` : ''}`)
}