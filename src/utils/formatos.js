// Formata datas para o padrão brasileiro (DD/MM/AAAA)
export function formatarData(dataIso) {
  if (!dataIso) return ''
  const data = new Date(dataIso)
  return data.toLocaleDateString('pt-BR')
}

// Formata horas (HH:MM)
export function formatarHora(hora) {
  if (!hora) return ''
  return hora.slice(0, 5)
}

// Formata moeda para Reais (R$)
export function formatarMoeda(valor) {
  if (valor === undefined || valor === null) return 'R$ 0,00'
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}