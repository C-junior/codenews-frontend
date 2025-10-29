import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Importação dinâmica para evitar dependência circular
    const { useNotification } = await import('@/composables/useNotification')
    const { showError } = useNotification()
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      showError('Sessão expirada. Faça login novamente.')
      window.location.href = '/login'
    } else if (error.response?.status >= 500) {
      showError('Erro interno do servidor. Tente novamente.')
    } else if (error.response?.status === 404) {
      showError('Recurso não encontrado.')
    } else if (error.response?.status === 400) {
      const message = error.response?.data?.message || 'Dados inválidos fornecidos.'
      showError(message)
    } else if (error.response?.status === 403) {
      showError('Acesso negado. Você não tem permissão para esta operação.')
    } else if (error.code === 'ECONNABORTED') {
      showError('Tempo limite da requisição excedido. Verifique sua conexão.')
    } else if (error.response?.data?.message) {
      showError(error.response.data.message)
    } else if (error.message) {
      showError(error.message)
    } else {
      showError('Erro inesperado. Tente novamente.')
    }
    
    return Promise.reject(error)
  }
)

export default api