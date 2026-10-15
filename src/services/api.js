import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://agendamentos.spaincentral.cloudapp.azure.com/api'
const ORGANIZACAO = import.meta.env.VITE_ORGANIZACAO || 'lab-informatica'

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token JWT em cada requisição
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (!config.headers['X-Organizacao']) {
    config.headers['X-Organizacao'] = ORGANIZACAO
  }
  return config
})

// Função genérica de chamadas
export async function api(endpoint, options = {}) {
  const response = await client({
    url: endpoint,
    method: options.method || 'GET',
    data: options.body,
    params: options.params,
    headers: options.headers,
  })
  return response.data
}

// Funções de agendamento usadas no AConfirmar.jsx
export async function confirmarAgendamento(id) {
  return api(`/agendamentos/${id}/confirmar/`, { method: 'POST' })
}

export async function cancelarAgendamento(id, motivo = '') {
  return api(`/agendamentos/${id}/cancelar/`, {
    method: 'POST',
    body: { motivo },
  })
}

// Helper para extrair mensagens de erro de requisições Axios
export function mensagemDeErro(erro, mensagemPadrao = 'Ocorreu um erro ao processar a requisição.') {
  if (erro?.response?.data?.detail) {
    return erro.response.data.detail
  }
  if (erro?.response?.data?.message) {
    return erro.response.data.message
  }
  return mensagemPadrao
}
