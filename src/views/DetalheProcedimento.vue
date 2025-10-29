<template>
  <div class="min-h-screen bg-cinza-claro p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-azul-profundo font-montserrat">
          Detalhes do Procedimento
        </h1>
        <BaseButton 
          variant="secondary" 
          size="small"
          @click="$router.go(-1)"
        >
          ← Voltar
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner size="large" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="procedimento" class="space-y-6">
      <!-- Breadcrumb -->
      <Breadcrumb :customItems="breadcrumbItems" />
      <!-- Informações do Procedimento -->
      <div class="card">
        <h2 class="text-xl font-semibold text-azul-profundo mb-4 font-montserrat">
          Informações do Procedimento
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Procedimento</label>
            <p class="text-gray-900 font-medium capitalize">{{ procedimento.tipoProcedimento }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data/Hora Início</label>
            <p class="text-gray-900">{{ formatDateTime(procedimento.dataHoraInicio) }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data/Hora Fim</label>
            <p class="text-gray-900">
              {{ procedimento.dataHoraFim ? formatDateTime(procedimento.dataHoraFim) : 'Em andamento' }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Classificação de Risco</label>
            <span :class="getRiskBadgeClass(procedimento.classificacaoDeRisco)" class="status-badge">
              {{ getRiskLabel(procedimento.classificacaoDeRisco) }}
            </span>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span :class="getStatusBadgeClass(procedimento.status)" class="status-badge">
              {{ getStatusLabel(procedimento.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Informações da Senha -->
      <div class="card" v-if="procedimento.senha">
        <h2 class="text-xl font-semibold text-azul-profundo mb-4 font-montserrat">
          Senha Vinculada
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
            <p class="text-gray-900 font-bold text-lg">{{ procedimento.senha.codigoSequencial }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Emissão</label>
            <p class="text-gray-900">{{ formatDateTime(procedimento.senha.dataHoraEmissao) }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <span :class="getPriorityBadgeClass(procedimento.senha.tipoPrioridade)" class="status-badge">
              {{ getPriorityLabel(procedimento.senha.tipoPrioridade) }}
            </span>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status da Senha</label>
            <span :class="getStatusBadgeClass(procedimento.senha.status)" class="status-badge">
              {{ getStatusLabel(procedimento.senha.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Informações do Paciente -->
      <div class="card" v-if="procedimento.paciente">
        <h2 class="text-xl font-semibold text-azul-profundo mb-4 font-montserrat">
          Paciente
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <p class="text-gray-900 font-medium">{{ procedimento.paciente.nome }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <p class="text-gray-900">{{ formatCPF(procedimento.paciente.cpf) }}</p>
          </div>
        </div>
      </div>

      <!-- Formulário de Dados Clínicos -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-azul-profundo font-montserrat">
            Dados Clínicos
          </h2>
          <div class="flex space-x-2">
            <BaseButton 
              v-if="isEditing"
              variant="secondary" 
              size="small"
              @click="cancelEdit"
            >
              Cancelar
            </BaseButton>
            <BaseButton 
              v-if="!isEditing && procedimento.status !== 'finalizado'"
              variant="primary" 
              size="small"
              @click="startEdit"
            >
              Editar
            </BaseButton>
          </div>
        </div>

        <form @submit.prevent="saveDadosClinicos" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Temperatura Corporal -->
            <div>
              <BaseInput
                v-model="formData.temperaturaCorporal"
                type="number"
                step="0.1"
                label="Temperatura Corporal (°C)"
                placeholder="36.5"
                :disabled="!isEditing"
                :error="validationErrors.temperaturaCorporal"
                help-text="Valor entre 30°C e 45°C"
                required
              />
            </div>

            <!-- Pressão Arterial Sistólica -->
            <div>
              <BaseInput
                v-model="formData.pressaoSistolica"
                type="number"
                label="Pressão Sistólica (mmHg)"
                placeholder="120"
                :disabled="!isEditing"
                :error="validationErrors.pressaoSistolica"
                required
              />
            </div>

            <!-- Pressão Arterial Diastólica -->
            <div>
              <BaseInput
                v-model="formData.pressaoDiastolica"
                type="number"
                label="Pressão Diastólica (mmHg)"
                placeholder="80"
                :disabled="!isEditing"
                :error="validationErrors.pressaoDiastolica"
                required
              />
            </div>

            <!-- Flag Paciente Sente Dor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Paciente sente dor?
              </label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="formData.flagPacienteSenteDor"
                    type="radio"
                    :value="true"
                    :disabled="!isEditing"
                    class="mr-2 text-azul-profundo focus:ring-azul-profundo"
                  />
                  Sim
                </label>
                <label class="flex items-center">
                  <input
                    v-model="formData.flagPacienteSenteDor"
                    type="radio"
                    :value="false"
                    :disabled="!isEditing"
                    class="mr-2 text-azul-profundo focus:ring-azul-profundo"
                  />
                  Não
                </label>
              </div>
            </div>
          </div>

          <!-- Diagnóstico -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Diagnóstico
            </label>
            <textarea
              v-model="formData.diagnostico"
              :disabled="!isEditing"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-profundo focus:border-azul-profundo transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Descreva o diagnóstico..."
            ></textarea>
          </div>

          <!-- Desfecho -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Desfecho
            </label>
            <textarea
              v-model="formData.desfecho"
              :disabled="!isEditing"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-profundo focus:border-azul-profundo transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Descreva o desfecho do atendimento..."
            ></textarea>
          </div>

          <!-- Botões de Ação -->
          <div v-if="isEditing" class="flex justify-end space-x-3 pt-4 border-t">
            <BaseButton
              type="button"
              variant="secondary"
              @click="cancelEdit"
            >
              Cancelar
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="saving"
            >
              Salvar Dados Clínicos
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- Ações do Procedimento -->
      <div v-if="procedimento.status !== 'finalizado'" class="card">
        <h2 class="text-xl font-semibold text-azul-profundo mb-4 font-montserrat">
          Ações
        </h2>
        
        <div class="flex justify-end">
          <BaseButton
            variant="success"
            :loading="finalizing"
            @click="showFinalizarModal = true"
          >
            Finalizar Procedimento
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação para Finalizar -->
    <BaseModal
      :show="showFinalizarModal"
      title="Finalizar Procedimento"
      @close="showFinalizarModal = false"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Tem certeza que deseja finalizar este procedimento? Esta ação não pode ser desfeita.
        </p>
        
        <div class="flex justify-end space-x-3">
          <BaseButton
            variant="secondary"
            @click="showFinalizarModal = false"
          >
            Cancelar
          </BaseButton>
          <BaseButton
            variant="success"
            :loading="finalizing"
            @click="finalizarProcedimento"
          >
            Confirmar Finalização
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import LoadingSpinner from '@/components/base/LoadingSpinner.vue'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
import ProcedimentoService from '@/services/ProcedimentoService.js'
import { useValidation } from '@/composables/useValidation.js'

const route = useRoute()
const router = useRouter()
const { validateRequired, validateTemperatura, validatePressao } = useValidation()

// Estado reativo
const procedimento = ref(null)
const loading = ref(false)
const error = ref('')
const isEditing = ref(false)
const saving = ref(false)
const finalizing = ref(false)
const showFinalizarModal = ref(false)

// Dados do formulário
const formData = reactive({
  temperaturaCorporal: '',
  pressaoSistolica: '',
  pressaoDiastolica: '',
  flagPacienteSenteDor: false,
  diagnostico: '',
  desfecho: ''
})

// Dados originais para cancelar edição
const originalData = reactive({})

// Erros de validação
const validationErrors = reactive({
  temperaturaCorporal: '',
  pressaoSistolica: '',
  pressaoDiastolica: ''
})

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { text: 'Procedimentos', to: '/procedimentos' },
  { text: 'Detalhes do Procedimento' }
])

// Carrega dados do procedimento
const loadProcedimento = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const id = route.params.id
    if (!id) {
      throw new Error('ID do procedimento não fornecido')
    }
    
    const data = await ProcedimentoService.getProcedimentoById(id)
    procedimento.value = data
    
    // Preenche o formulário com os dados clínicos
    if (data.dadosClinicos) {
      formData.temperaturaCorporal = data.dadosClinicos.temperaturaCorporal || ''
      formData.pressaoSistolica = data.dadosClinicos.pressaoArterial?.sistolica || ''
      formData.pressaoDiastolica = data.dadosClinicos.pressaoArterial?.diastolica || ''
      formData.flagPacienteSenteDor = data.dadosClinicos.flagPacienteSenteDor || false
      formData.diagnostico = data.dadosClinicos.diagnostico || ''
      formData.desfecho = data.dadosClinicos.desfecho || ''
    }
    
    // Salva dados originais
    Object.assign(originalData, { ...formData })
    
  } catch (err) {
    console.error('Erro ao carregar procedimento:', err)
    error.value = err.message || 'Erro ao carregar dados do procedimento'
  } finally {
    loading.value = false
  }
}

// Inicia edição
const startEdit = () => {
  isEditing.value = true
  clearValidationErrors()
}

// Cancela edição
const cancelEdit = () => {
  isEditing.value = false
  Object.assign(formData, { ...originalData })
  clearValidationErrors()
}

// Limpa erros de validação
const clearValidationErrors = () => {
  validationErrors.temperaturaCorporal = ''
  validationErrors.pressaoSistolica = ''
  validationErrors.pressaoDiastolica = ''
}

// Valida formulário
const validateForm = () => {
  clearValidationErrors()
  let isValid = true
  
  // Valida temperatura
  if (!validateRequired(formData.temperaturaCorporal)) {
    validationErrors.temperaturaCorporal = 'Temperatura é obrigatória'
    isValid = false
  } else if (!validateTemperatura(formData.temperaturaCorporal)) {
    validationErrors.temperaturaCorporal = 'Temperatura deve estar entre 30°C e 45°C'
    isValid = false
  }
  
  // Valida pressão arterial
  if (!validateRequired(formData.pressaoSistolica)) {
    validationErrors.pressaoSistolica = 'Pressão sistólica é obrigatória'
    isValid = false
  } else if (!validateRequired(formData.pressaoDiastolica)) {
    validationErrors.pressaoDiastolica = 'Pressão diastólica é obrigatória'
    isValid = false
  } else if (!validatePressao(formData.pressaoSistolica, formData.pressaoDiastolica)) {
    validationErrors.pressaoSistolica = 'Pressão arterial inválida'
    validationErrors.pressaoDiastolica = 'Sistólica deve ser maior que diastólica'
    isValid = false
  }
  
  return isValid
}

// Salva dados clínicos
const saveDadosClinicos = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    saving.value = true
    
    const dadosClinicos = {
      temperaturaCorporal: parseFloat(formData.temperaturaCorporal),
      pressaoArterial: {
        sistolica: parseInt(formData.pressaoSistolica),
        diastolica: parseInt(formData.pressaoDiastolica)
      },
      flagPacienteSenteDor: formData.flagPacienteSenteDor,
      diagnostico: formData.diagnostico,
      desfecho: formData.desfecho
    }
    
    const updatedData = await ProcedimentoService.updateDadosClinicos(
      procedimento.value.id,
      dadosClinicos
    )
    
    // Atualiza os dados do procedimento
    procedimento.value.dadosClinicos = updatedData
    
    // Atualiza dados originais
    Object.assign(originalData, { ...formData })
    
    isEditing.value = false
    
    // Mostra notificação de sucesso (se houver sistema de notificação)
    console.log('Dados clínicos salvos com sucesso')
    
  } catch (err) {
    console.error('Erro ao salvar dados clínicos:', err)
    error.value = err.message || 'Erro ao salvar dados clínicos'
  } finally {
    saving.value = false
  }
}

// Finaliza procedimento
const finalizarProcedimento = async () => {
  try {
    finalizing.value = true
    
    const updatedProcedimento = await ProcedimentoService.finalizarProcedimento(
      procedimento.value.id
    )
    
    procedimento.value = updatedProcedimento
    showFinalizarModal.value = false
    
    // Mostra notificação de sucesso
    console.log('Procedimento finalizado com sucesso')
    
  } catch (err) {
    console.error('Erro ao finalizar procedimento:', err)
    error.value = err.message || 'Erro ao finalizar procedimento'
    showFinalizarModal.value = false
  } finally {
    finalizing.value = false
  }
}

// Formatação de data/hora
const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  
  const date = new Date(dateTime)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatação de CPF
const formatCPF = (cpf) => {
  if (!cpf) return ''
  
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length === 11) {
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9, 11)}`
  }
  return cpf
}

// Classes CSS para badges de risco
const getRiskBadgeClass = (risk) => {
  const classes = {
    'verde': 'bg-green-100 text-green-800',
    'amarelo': 'bg-yellow-100 text-yellow-800',
    'laranja': 'bg-orange-100 text-orange-800',
    'vermelho': 'bg-red-100 text-red-800',
    'azul': 'bg-blue-100 text-blue-800'
  }
  return classes[risk] || 'bg-gray-100 text-gray-800'
}

// Labels para classificação de risco
const getRiskLabel = (risk) => {
  const labels = {
    'verde': 'Baixo Risco',
    'amarelo': 'Risco Moderado',
    'laranja': 'Alto Risco',
    'vermelho': 'Emergência',
    'azul': 'Sem Risco'
  }
  return labels[risk] || risk
}

// Classes CSS para badges de status
const getStatusBadgeClass = (status) => {
  const classes = {
    'em_andamento': 'bg-blue-100 text-blue-800',
    'finalizado': 'bg-green-100 text-green-800',
    'finalizada': 'bg-green-100 text-green-800',
    'chamada': 'bg-yellow-100 text-yellow-800',
    'aguardando': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Labels para status
const getStatusLabel = (status) => {
  const labels = {
    'em_andamento': 'Em Andamento',
    'finalizado': 'Finalizado',
    'finalizada': 'Finalizada',
    'chamada': 'Chamada',
    'aguardando': 'Aguardando'
  }
  return labels[status] || status
}

// Classes CSS para badges de prioridade
const getPriorityBadgeClass = (priority) => {
  const classes = {
    'emergencia': 'bg-red-100 text-red-800',
    'urgente': 'bg-orange-100 text-orange-800',
    'normal': 'bg-green-100 text-green-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

// Labels para prioridade
const getPriorityLabel = (priority) => {
  const labels = {
    'emergencia': 'Emergência',
    'urgente': 'Urgente',
    'normal': 'Normal'
  }
  return labels[priority] || priority
}

// Carrega dados ao montar o componente
onMounted(() => {
  loadProcedimento()
})
</script>