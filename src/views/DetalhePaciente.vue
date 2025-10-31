<template>
  <AppLayout>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <Breadcrumb />
      <div class="card">
        <div class="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
          <span class="ml-3 text-texto-base text-cinza-neutro">Carregando dados do paciente...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="card">
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="mt-4 text-subtitulo font-nunito font-medium text-gray-900">
            Erro ao carregar dados
          </h3>
          <p class="mt-2 text-texto-base text-cinza-neutro">
            {{ error }}
          </p>
          <div class="mt-6">
            <button 
              @click="fetchPacienteData"
              class="btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <Breadcrumb />
      <!-- Patient Info Card -->
      <div class="card mb-8">
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h2 class="text-subtitulo font-montserrat font-semibold text-azul-profundo mb-4">
            Informações do Paciente
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-cinza-neutro mb-2">
                Nome Completo
              </label>
              <div class="input-field bg-gray-50 cursor-not-allowed">
                {{ paciente.nome }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-cinza-neutro mb-2">
                CPF
              </label>
              <div class="input-field bg-gray-50 cursor-not-allowed font-mono">
                {{ paciente.cpf }}
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-azul-profundo bg-opacity-10 rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-azul-profundo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-cinza-neutro">Total de Procedimentos</p>
                <p class="text-lg font-semibold text-azul-profundo">{{ procedimentos.length }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-verde-medicina bg-opacity-10 rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-verde-medicina" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-cinza-neutro">Finalizados</p>
                <p class="text-lg font-semibold text-verde-medicina">{{ procedimentosFinalizados }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-100 rounded-lg p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-cinza-neutro">Em Andamento</p>
                <p class="text-lg font-semibold text-yellow-600">{{ procedimentosEmAndamento }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Procedures History -->
      <div class="card">
        <div class="border-b border-gray-200 pb-4 mb-6">
          <h2 class="text-subtitulo font-montserrat font-semibold text-azul-profundo">
            Histórico de Procedimentos
          </h2>
          <p class="text-texto-base text-cinza-neutro mt-1">
            Lista completa de procedimentos realizados
          </p>
        </div>

        <!-- Empty State -->
        <div v-if="procedimentos.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-cinza-neutro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 class="mt-4 text-subtitulo font-nunito font-medium text-cinza-neutro">
            Nenhum procedimento encontrado
          </h3>
          <p class="mt-2 text-texto-base text-cinza-neutro">
            Este paciente ainda não possui procedimentos registrados.
          </p>
        </div>

        <!-- Procedures List -->
        <div v-else class="space-y-4">
          <div 
            v-for="procedimento in procedimentos" 
            :key="procedimento.id"
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusBadgeClass(procedimento.status)">
                    {{ getStatusLabel(procedimento.status) }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getTipoProcedimentoBadgeClass(procedimento.tipoProcedimento)">
                    {{ getTipoProcedimentoLabel(procedimento.tipoProcedimento) }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getRiscoBadgeClass(procedimento.classificacaoDeRisco)">
                    {{ getRiscoLabel(procedimento.classificacaoDeRisco) }}
                  </span>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-cinza-neutro">Senha:</span>
                    <span class="ml-2 font-mono">{{ procedimento.senha.codigoSequencial }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-cinza-neutro">Prioridade:</span>
                    <span class="ml-2">{{ getPrioridadeLabel(procedimento.senha.tipoPrioridade) }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-cinza-neutro">Início:</span>
                    <span class="ml-2">{{ formatDateTime(procedimento.dataHoraInicio) }}</span>
                  </div>
                  <div v-if="procedimento.dataHoraFim">
                    <span class="font-medium text-cinza-neutro">Fim:</span>
                    <span class="ml-2">{{ formatDateTime(procedimento.dataHoraFim) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 sm:mt-0 sm:ml-6">
                <router-link
                  :to="`/procedimentos/${procedimento.id}`"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-azul-profundo bg-azul-profundo bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-profundo transition-colors duration-200"
                  :aria-label="`Ver detalhes do procedimento ${procedimento.tipoProcedimento}`"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver Detalhes
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <NotificationToast 
      v-if="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="closeNotification"
    />
  </AppLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PacienteService from '@/services/PacienteService.js';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import NotificationToast from '@/components/base/NotificationToast.vue';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import AppLayout from '@/components/layout/AppLayout.vue';

export default {
  name: 'DetalhePaciente',
  components: {
    LoadingSpinner,
    NotificationToast,
    Breadcrumb,
    AppLayout
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // Estado reativo
    const paciente = ref(null);
    const procedimentos = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const notification = ref({
      show: false,
      type: 'success',
      message: ''
    });

    // Computed properties
    const procedimentosFinalizados = computed(() => 
      procedimentos.value.filter(p => p.status === 'finalizado').length
    );

    const procedimentosEmAndamento = computed(() => 
      procedimentos.value.filter(p => p.status === 'em_andamento').length
    );

    // Métodos
    const fetchPacienteData = async () => {
      const pacienteId = route.params.id;
      
      if (!pacienteId) {
        error.value = 'ID do paciente não fornecido';
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        // Busca dados do paciente e procedimentos em paralelo
        const [pacienteData, procedimentosData] = await Promise.all([
          PacienteService.getPacienteById(pacienteId),
          PacienteService.getProcedimentosByPaciente(pacienteId)
        ]);

        paciente.value = pacienteData;
        procedimentos.value = procedimentosData;
      } catch (err) {
        error.value = err.message || 'Erro ao carregar dados do paciente';
        
        // Se paciente não encontrado, redireciona após um tempo
        if (err.message === 'Paciente não encontrado') {
          setTimeout(() => {
            router.push('/pacientes');
          }, 3000);
        }
      } finally {
        loading.value = false;
      }
    };

    // Métodos de formatação e estilização
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return '-';
      
      const date = new Date(dateTimeString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getStatusLabel = (status) => {
      const labels = {
        'em_andamento': 'Em Andamento',
        'finalizado': 'Finalizado',
        'cancelado': 'Cancelado'
      };
      return labels[status] || status;
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        'em_andamento': 'bg-yellow-100 text-yellow-800',
        'finalizado': 'bg-green-100 text-green-800',
        'cancelado': 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const getTipoProcedimentoLabel = (tipo) => {
      const labels = {
        'acolhimento': 'Acolhimento',
        'triagem': 'Triagem',
        'atendimento': 'Atendimento'
      };
      return labels[tipo] || tipo;
    };

    const getTipoProcedimentoBadgeClass = (tipo) => {
      const classes = {
        'acolhimento': 'bg-blue-100 text-blue-800',
        'triagem': 'bg-purple-100 text-purple-800',
        'atendimento': 'bg-indigo-100 text-indigo-800'
      };
      return classes[tipo] || 'bg-gray-100 text-gray-800';
    };

    const getRiscoLabel = (risco) => {
      const labels = {
        'verde': 'Baixo Risco',
        'amarelo': 'Médio Risco',
        'vermelho': 'Alto Risco'
      };
      return labels[risco] || risco;
    };

    const getRiscoBadgeClass = (risco) => {
      const classes = {
        'verde': 'bg-green-100 text-green-800',
        'amarelo': 'bg-yellow-100 text-yellow-800',
        'vermelho': 'bg-red-100 text-red-800'
      };
      return classes[risco] || 'bg-gray-100 text-gray-800';
    };

    const getPrioridadeLabel = (prioridade) => {
      const labels = {
        'normal': 'Normal',
        'urgente': 'Urgente',
        'emergencia': 'Emergência'
      };
      return labels[prioridade] || prioridade;
    };

    const showNotification = (type, message) => {
      notification.value = {
        show: true,
        type,
        message
      };
    };

    const closeNotification = () => {
      notification.value.show = false;
    };

    // Lifecycle
    onMounted(() => {
      fetchPacienteData();
    });

    return {
      paciente,
      procedimentos,
      procedimentosFinalizados,
      procedimentosEmAndamento,
      loading,
      error,
      notification,
      fetchPacienteData,
      formatDateTime,
      getStatusLabel,
      getStatusBadgeClass,
      getTipoProcedimentoLabel,
      getTipoProcedimentoBadgeClass,
      getRiscoLabel,
      getRiscoBadgeClass,
      getPrioridadeLabel,
      closeNotification
    };
  }
};
</script>