// Utility functions for formatting data

export const formatCPF = (cpf) => {
  if (!cpf) return ''
  const cleanCPF = cpf.replace(/\D/g, '')
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('pt-BR')
}

export const formatDate = (date) => {
  if (!date) return ''
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('pt-BR')
}

export const formatTime = (time) => {
  if (!time) return ''
  const timeObj = new Date(time)
  return timeObj.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}