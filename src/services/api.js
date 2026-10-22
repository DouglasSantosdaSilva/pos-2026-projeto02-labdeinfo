const BASE_URL = 'https://agendamentos.spaincentral.cloudapp.azure.com/api'

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem('access') || localStorage.getItem('token')
  const organizacao = localStorage.getItem('organizacao')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (organizacao && !endpoint.includes('/auth/')) {
    headers['x-organizacao'] = organizacao
  }

  let body = options.body
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  })

  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    const mensagemDetalhada =
      typeof errorData === 'object' && errorData !== null
        ? Object.entries(errorData)
            .map(([chave, valor]) =>
              `${chave}: ${
                Array.isArray(valor)
                  ? valor.join(', ')
                  : typeof valor === 'object'
                    ? JSON.stringify(valor)
                    : valor
              }`
            )
            .join(' | ')
        : ''

    throw new Error(
      mensagemDetalhada ||
      errorData.detail ||
      errorData.message ||
      `Erro na requisição (${response.status})`
    )
  }

  if (response.status === 204) {
    return null
  }

  const texto = await response.text()

  if (!texto.trim()) {
    return null
  }

  try {
    return JSON.parse(texto)
  } catch {
    throw new Error(
      'A API retornou uma resposta em formato inesperado.'
    )
  }

}

export async function cadastrar(dados) {
  const payload = {
    nome: dados.nomeCompleto || dados.nome,
    email: dados.email,
    senha: dados.senha,
    organizacao: dados.organizacao || 'laboratorio-de-informatica',
  }

  return api('/auth/cadastro/', {
    method: 'POST',
    body: payload,
  })
}
export async function login(credenciais) {
  return api('/auth/login/', { method: 'POST', body: credenciais })
}

export async function redefinirSenha(email) {
  return api('/auth/esqueci-senha/', { method: 'POST', body: { email } })
}

export async function alterarSenha(dados) {
  return api('/auth/alterar-senha/', { method: 'POST', body: dados })
}

// Perfil
export async function atualizarPerfil(dados) {
  return api('/auth/meu-perfil/', { method: 'PUT', body: dados })
}

// Agendamentos / Reservas
export async function confirmarAgendamento(id) {
  return api(`/agendamentos/${id}/confirmar/`, { method: 'POST' })
}

export async function cancelarAgendamento(id, motivo = '') {
  return api(`/agendamentos/${id}/cancelar/`, {
    method: 'POST',
    body: { motivo },
  })
}

export async function concluirAgendamento(id) {
  return api(`/agendamentos/${id}/concluir/`, { method: 'POST' })
}

export async function avaliarAgendamento(id, dados) {
  return api(`/agendamentos/${id}/avaliar/`, {
    method: 'POST',
    body: dados,
  })
}

export async function criarAgendamento(dados) {
  return api('/agendamentos/', { method: 'POST', body: dados })
}

export async function criarReserva(dados) {
  return api('/agendamentos/', { method: 'POST', body: dados })
}

export function mensagemDeErro(erro, mensagemPadrao = 'Ocorreu um erro ao processar a requisição.') {
  if (erro?.response?.data?.detail) {
    return erro.response.data.detail
  }
  if (erro?.response?.data?.message) {
    return erro.response.data.message
  }
  return mensagemPadrao
}

export async function atualizarOrganizacao(dados) {
  return api('/organizacao/', {
    method: 'PUT',
    body: dados,
  })
}

export async function criarLaboratorio(formData) {
  console.log('Simulação: Laboratório criado com sucesso!', Object.fromEntries(formData))
  return new Promise((resolve) => setTimeout(resolve, 500))
}

export async function atualizarLaboratorio(id, formData) {
  console.log(`Simulação: Laboratório ${id} atualizado com sucesso!`)
  return new Promise((resolve) => setTimeout(resolve, 500))
}

export async function deletarLaboratorio(id) {
  return api(`/laboratorios/${id}/`, {
    method: 'DELETE',
  })
}

export async function obterLaboratorio(id) {
  return api(`/laboratorios/${id}/`, {
    method: 'GET',
  })
}

export async function criarDisponibilidade(dados) {
  return api('/disponibilidade/', {
    method: 'POST',
    body: dados,
  })
}

export async function listarDisponibilidade(params = {}) {
  const query = new URLSearchParams(params).toString()
  return api(`/disponibilidade/${query ? `?${query}` : ''}`, {
    method: 'GET',
  })
}

export async function deletarDisponibilidade(id) {
  return api(`/disponibilidade/${id}/`, {
    method: 'DELETE',
  })
}

export async function excluirDisponibilidade(id) {
  return api(`/disponibilidade/${id}/`, {
    method: 'DELETE',
  })
}

// Gestão de Serviços
export async function criarServico(dados) {
  return api('/servicos/', {
    method: 'POST',
    body: dados,
  })
}

export async function atualizarServico(id, dados) {
  return api(`/servicos/${id}/`, {
    method: 'PUT',
    body: dados,
  })
}

export async function deletarServico(id) {
  return api(`/servicos/${id}/`, {
    method: 'DELETE',
  })
}

export async function obterServico(id) {
  return api(`/servicos/${id}/`, {
    method: 'GET',
  })
}

export async function listarServicos(params = {}) {
  const query = new URLSearchParams(params).toString()
  return api(`/servicos/${query ? `?${query}` : ''}`, {
    method: 'GET',
  })
}