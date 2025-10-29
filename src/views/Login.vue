<template>
  <div class="min-h-screen bg-cinza-claro flex items-center justify-center py-6 xs:py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-xs xs:max-w-md w-full space-y-6 xs:space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-3 xs:mb-4">
          <img src="/logo-codenews.png" alt="CodeNews Logo" class="h-12 xs:h-16 w-auto">
        </div>
        <h1 class="text-titulo-principal font-montserrat text-azul-profundo mb-2">
          Sistema Code<span class="text-verde-medicina">News</span>
        </h1>
        <p class="text-texto-grande font-nunito text-cinza-neutro">
          Faça login para acessar o sistema
        </p>
      </div>

      <!-- Formulário de Login -->
      <div class="bg-branco rounded-xl shadow-lg p-6 xs:p-8">
        <form @submit.prevent="handleLogin" class="space-y-4 xs:space-y-6">
          <!-- Campo Username -->
          <BaseInput
            v-model="form.username"
            type="text"
            label="Nome de usuário"
            placeholder="Digite seu nome de usuário"
            :required="true"
            :error="errors.username"
            @blur="validateUsername"
          />

          <!-- Campo Password -->
          <BaseInput
            v-model="form.password"
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            :required="true"
            :error="errors.password"
            @blur="validatePassword"
          />

          <!-- Mensagem de erro geral -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ generalError }}</p>
              </div>
            </div>
          </div>

          <!-- Botão de Login -->
          <BaseButton
            type="submit"
            variant="primary"
            size="large"
            :loading="isLoading"
            :disabled="!isFormValid || isLoading"
            loading-text="Entrando..."
            class="w-full"
          >
            Entrar
          </BaseButton>
        </form>

        <!-- Informações de teste -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Usuários de teste:</h3>
          <div class="space-y-2 text-xs text-gray-600">
            <div class="flex justify-between">
              <span>Médico:</span>
              <span class="font-mono">medico1 / 123456</span>
            </div>
            <div class="flex justify-between">
              <span>Enfermeiro:</span>
              <span class="font-mono">enfermeiro1 / 123456</span>
            </div>
            <div class="flex justify-between">
              <span>Recepcionista:</span>
              <span class="font-mono">recepcionista1 / 123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

// Estado do formulário
const form = ref({
  username: '',
  password: ''
})

// Estado de erros
const errors = ref({
  username: '',
  password: ''
})

const generalError = ref('')
const isLoading = computed(() => authStore.isLoading)

// Validações
const validateUsername = () => {
  if (!form.value.username.trim()) {
    errors.value.username = 'Nome de usuário é obrigatório'
    return false
  }
  errors.value.username = ''
  return true
}

const validatePassword = () => {
  if (!form.value.password.trim()) {
    errors.value.password = 'Senha é obrigatória'
    return false
  }
  if (form.value.password.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
    return false
  }
  errors.value.password = ''
  return true
}

const isFormValid = computed(() => {
  return form.value.username.trim() && 
         form.value.password.trim() && 
         !errors.value.username && 
         !errors.value.password
})

// Manipulador de login
const handleLogin = async () => {
  // Limpa erros anteriores
  generalError.value = ''
  authStore.clearError()

  // Valida campos
  const isUsernameValid = validateUsername()
  const isPasswordValid = validatePassword()

  if (!isUsernameValid || !isPasswordValid) {
    return
  }

  try {
    await authStore.login(form.value.username, form.value.password)
    
    // Redireciona para a página original ou dashboard após login bem-sucedido
    const redirectPath = router.currentRoute.value.query.redirect || '/'
    router.push(redirectPath)
  } catch (error) {
    generalError.value = error.message || 'Erro ao fazer login. Tente novamente.'
  }
}

// Verifica se já está autenticado ao montar o componente
onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
/* Estilos específicos do componente se necessário */
</style>