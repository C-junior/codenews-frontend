import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import AuthService from '@/services/AuthService.js'

export const useAuthStore = defineStore('auth', () => {
  // Estado reativo
  const usuario = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

  // Getters computados
  const isAuthenticated = computed(() => {
    return !!token.value && !!usuario.value && AuthService.isTokenValid()
  })

  const currentProfissional = computed(() => {
    return usuario.value?.profissional || null
  })

  const userPermissions = computed(() => {
    return usuario.value?.permissao || null
  })

  const userStatus = computed(() => {
    return usuario.value?.status || null
  })

  const isLoading = computed(() => loading.value)

  const hasError = computed(() => !!error.value)

  // Actions
  const login = async (username, password) => {
    loading.value = true
    error.value = null

    try {
      const response = await AuthService.login(username, password)
      
      // Armazena dados no estado
      usuario.value = response.usuario
      token.value = response.token
      
      // Persiste no localStorage
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.usuario))
      
      return true
    } catch (err) {
      error.value = err.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await AuthService.logout()
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      // Limpa estado independente de erro
      usuario.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      loading.value = false
    }
  }

  const checkAuth = async () => {
    // Se não há token, não está autenticado
    if (!token.value) {
      usuario.value = null
      return false
    }

    // Verifica se o token ainda é válido
    if (!AuthService.isTokenValid()) {
      await logout()
      return false
    }

    // Se já tem usuário carregado e token é válido, não precisa recarregar
    if (usuario.value) {
      return true
    }

    // Tenta carregar usuário do localStorage primeiro
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        usuario.value = JSON.parse(storedUser)
        return true
      } catch (err) {
        console.error('Erro ao parsear usuário do localStorage:', err)
      }
    }

    // Se não conseguiu carregar do localStorage, busca do serviço
    loading.value = true
    error.value = null

    try {
      const user = await AuthService.getCurrentUser()
      usuario.value = user
      localStorage.setItem('user', JSON.stringify(user))
      return true
    } catch (err) {
      error.value = err.message || 'Erro ao verificar autenticação'
      await logout() // Limpa dados inválidos
      return false
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const updateUserProfile = (updatedProfissional) => {
    if (usuario.value) {
      usuario.value.profissional = { ...usuario.value.profissional, ...updatedProfissional }
      localStorage.setItem('user', JSON.stringify(usuario.value))
    }
  }

  // Inicialização - tenta carregar usuário do localStorage se há token
  const initialize = async () => {
    if (token.value) {
      await checkAuth()
    }
  }

  return {
    // Estado
    usuario,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    currentProfissional,
    userPermissions,
    userStatus,
    isLoading,
    hasError,
    
    // Actions
    login,
    logout,
    checkAuth,
    clearError,
    updateUserProfile,
    initialize
  }
})