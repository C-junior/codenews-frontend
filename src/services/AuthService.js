import api from './api.js'

// Dados mockados para desenvolvimento
const MOCK_USERS = [
  {
    id: 1,
    username: 'medico1',
    password: '123456',
    permissao: 'MEDICO',
    status: 'ATIVO',
    profissional: {
      id: 1,
      cpf: '12345678901',
      nome: 'Dr. João Silva',
      matricula: 'MED001',
      cargo: 'Médico',
      funcao: 'Clínico Geral',
      postoTrabalho: 'Consultório 1'
    }
  },
  {
    id: 2,
    username: 'enfermeiro1',
    password: '123456',
    permissao: 'ENFERMEIRO',
    status: 'ATIVO',
    profissional: {
      id: 2,
      cpf: '98765432109',
      nome: 'Maria Santos',
      matricula: 'ENF001',
      cargo: 'Enfermeiro',
      funcao: 'Triagem',
      postoTrabalho: 'Sala de Triagem'
    }
  },
  {
    id: 3,
    username: 'recepcionista1',
    password: '123456',
    permissao: 'RECEPCIONISTA',
    status: 'ATIVO',
    profissional: {
      id: 3,
      cpf: '11122233344',
      nome: 'Ana Costa',
      matricula: 'REC001',
      cargo: 'Recepcionista',
      funcao: 'Acolhimento',
      postoTrabalho: 'Recepção'
    }
  }
]

class AuthService {
  /**
   * Realiza login com dados mockados
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   * @returns {Promise<Object>} Dados do usuário autenticado com token
   */
  async login(username, password) {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simula cenários de erro para demonstração
    if (username === 'error_test') {
      throw new Error('Erro simulado de servidor')
    }
    
    if (username === 'timeout_test') {
      await new Promise(resolve => setTimeout(resolve, 15000)) // Simula timeout
    }
    
    // Validação de campos obrigatórios
    if (!username || !password) {
      throw new Error('Username e password são obrigatórios')
    }
    
    if (username.length < 3) {
      throw new Error('Username deve ter pelo menos 3 caracteres')
    }
    
    if (password.length < 6) {
      throw new Error('Password deve ter pelo menos 6 caracteres')
    }
    
    // Busca usuário nos dados mockados
    const user = MOCK_USERS.find(u => 
      u.username === username && u.password === password
    )
    
    if (!user) {
      throw new Error('Credenciais inválidas')
    }
    
    if (user.status !== 'ATIVO') {
      throw new Error('Usuário inativo. Entre em contato com o administrador.')
    }
    
    // Gera token mockado
    const token = `mock_token_${user.id}_${Date.now()}`
    
    // Remove senha do retorno por segurança
    const { password: _, ...userWithoutPassword } = user
    
    return {
      usuario: userWithoutPassword,
      token
    }
  }
  
  /**
   * Realiza logout
   * @returns {Promise<void>}
   */
  async logout() {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Remove token do localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    return Promise.resolve()
  }
  
  /**
   * Obtém dados do usuário atual baseado no token
   * @returns {Promise<Object>} Dados do usuário atual
   */
  async getCurrentUser() {
    const token = localStorage.getItem('token')
    
    if (!token) {
      const error = new Error('Token não encontrado')
      error.status = 401
      throw error
    }
    
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Simula erro de servidor ocasional (5% de chance)
    if (Math.random() < 0.05) {
      const error = new Error('Erro interno do servidor')
      error.status = 500
      throw error
    }
    
    // Extrai ID do usuário do token mockado
    const tokenParts = token.split('_')
    if (tokenParts.length < 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'token') {
      const error = new Error('Token inválido')
      error.status = 401
      throw error
    }
    
    const userId = parseInt(tokenParts[2])
    const user = MOCK_USERS.find(u => u.id === userId)
    
    if (!user) {
      const error = new Error('Usuário não encontrado')
      error.status = 404
      throw error
    }
    
    if (user.status !== 'ATIVO') {
      const error = new Error('Usuário inativo')
      error.status = 403
      throw error
    }
    
    // Remove senha do retorno por segurança
    const { password: _, ...userWithoutPassword } = user
    
    return userWithoutPassword
  }
  
  /**
   * Verifica se o token atual é válido
   * @returns {boolean} True se o token é válido
   */
  isTokenValid() {
    const token = localStorage.getItem('token')
    
    if (!token) {
      return false
    }
    
    // Verifica formato do token mockado
    const tokenParts = token.split('_')
    if (tokenParts.length < 4 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'token') {
      return false
    }
    
    const userId = parseInt(tokenParts[2])
    const timestamp = parseInt(tokenParts[3])
    
    // Verifica se o usuário existe
    const user = MOCK_USERS.find(u => u.id === userId)
    if (!user || user.status !== 'ATIVO') {
      return false
    }
    
    // Token expira em 8 horas (simulação)
    const tokenAge = Date.now() - timestamp
    const eightHours = 8 * 60 * 60 * 1000
    
    return tokenAge < eightHours
  }
}

export default new AuthService()