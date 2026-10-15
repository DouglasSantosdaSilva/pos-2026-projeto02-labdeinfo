/**
 * Formata uma string ISO ou objeto Date para o formato de data brasileiro (DD/MM/AAAA).
 * Exemplo: "2026-10-15T14:30:00Z" -> "15/10/2026"
 */
export function formatarData(dataIso) {
  if (!dataIso) return ''
  const data = new Date(dataIso)
  if (isNaN(data.getTime())) return dataIso
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC', // Mantém a data exata vinda da API sem desvio de fuso
  })
}

/**
 * Formata o horário no padrão de 24h (HH:mm).
 * Exemplo: "2026-10-15T14:30:00Z" -> "14:30" ou "08:00:00" -> "08:00"
 */
export function formatarHora(horaOuIso) {
  if (!horaOuIso) return ''
  
  // Se for apenas uma string de hora (ex: "08:00:00")
  if (typeof horaOuIso === 'string' && horaOuIso.includes(':') && !horaOuIso.includes('T')) {
    return horaOuIso.substring(0, 5)
  }

  const data = new Date(horaOuIso)
  if (isNaN(data.getTime())) return horaOuIso
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Retorna o nome do dia da semana a partir do índice (0 a 6).
 */
export function nomeDiaSemana(diaIndice) {
  const dias = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ]
  return dias[diaIndice] ?? 'Dia inválido'
}

/**
 * Retorna a data atual no formato YYYY-MM-DD para inicializar inputs do tipo <input type="date" />.
 */
export function dataHojeISO() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}