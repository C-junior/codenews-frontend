<template>
  <div class="historico-senhas">
    <!-- Breadcrumb -->
    <Breadcrumb />
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-titulo-secundario font-montserrat font-semibold text-azul-profundo">
        Histórico de Senhas
      </h1>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <h2 class="text-subtitulo font-montserrat font-medium text-azul-profundo mb-4">
        Filtros
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Filtro por Data Início -->
        <div>
          <label for="dataInicio" class="block text-sm font-medium text-gray-700 mb-2">
            Data Início
          </label>
          <BaseInput
            id="dataInicio"
            v-model="filtros.dataInicio"
            type="date"
            placeholder="Selecione a data inicial"
            @input="aplicarFiltros"
          />
        </div>

        <!-- Filtro por Data Fim -->
        <div>
          <label for="dataFim" class="block text-sm font-medium text-gray-700 mb-2">
            Data Fim
          </label>
          <BaseInput
            id="dataFim"
            v-model="filtros.dataFim"
            type="date"
            placeholder="Selecione a data final"
            @input="aplicarFiltros"
          />
        </div>

        <!-- Filtro por Tipo de Procedimento -->
        <div>
          <label for="tipoProcedimento" class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Procedimento
          </label>
          <select
            id="tipoProcedimento"
            v-model="filtros.tipoProcedimento"
            class="input-field"
            @change="aplicarFiltros"
          >
            <option value="">Todos os tipos</option>
            <option value="acolhimento">Acolhimento</option>
            <option value="triagem">Triagem</option>
            <option value="atendimento">Atendimento</option>
          </select>
        </div>
      </div>

      <!-- Botão Limpar Filtros -->
      <div class="mt-4">
        <BaseButton
          variant="secondary"
          size="small"
          @click="limparFiltros"
        >
          Limpar Filtros
        </BaseButton>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner size="large" />
    </div>

    <!-- Lista de Senhas -->
    <div v-else-if="senhasHistorico.length > 0" class="card">
      <h2 class="text-subtitulo font-montserrat font-medium text-azul-profundo mb-4">
        Senhas Finalizadas ({{ senhasHistorico.length }})
      </h2>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="table-header">Código</th>
              <th class="table-header">Tipo</th>
              <th class="table-header">Prioridade</th>
              <th class="table-header">Emissão</th>
              <th class="table-header">Encerramento</th>
              <th class="table-header">Duração</th>
              <th class="table-header">Procedimento</th>
              <th class="table-header">Paciente</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="senha in senhasHistorico"
              :key="senha.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- Código Sequencial -->
              <td class="table-cell">
                <span class="font-semibold text-azul-profundo">
                  {{ senha.codigoSequencial }}
                </span>
              </td>

              <!-- Tipo de Procedimento -->
              <td class="table-cell">
                <span
                  class="status-badge"
                  :class="getTipoProcedimentoClass(senha.tipoProcedimento)"
                >
                  {{ formatTipoProcedimento(senha.tipoProcedimento) }}
                </span>
              </td>

              <!-- Prioridade -->
              <td class="table-cell">
                <span
                  class="status-badge"
                  :class="getPrioridadeClass(senha.tipoPrioridade)"
                >
                  {{ formatPrioridade(senha.tipoPrioridade) }}
                </span>
              </td>

              <!-- Data/Hora Emissão -->
              <td class="table-cell">
                <div class="text-sm">
                  <div>{{ formatDate(senha.dataHoraEmissao) }}</div>
                  <div class="text-gray-500">{{ formatTime(senha.dataHoraEmissao) }}</div>
                </div>
              </td>

              <!-- Data/Hora Encerramento -->
              <td class="table-cell">
                <div class="text-sm">
                  <div>{{ formatDate(senha.dataHoraEncerramento) }}</div>
                  <div class="text-gray-500">{{ formatTime(senha.dataHoraEncerramento) }}</div>
                </div>
              </td>

              <!-- Duração -->
              <td class="table-cell">
                <span class="text-sm font-medium">
                  {{ calcularDuracao(senha.dataHoraEmissao, senha.dataHoraEncerramento) }}
                </span>
              </td>

              <!-- Informações do Procedimento -->
              <td class="table-cell">
                <div v-if="senha.procedimento" class="text-sm">
                  <div class="font-medium">{{ senha.procedimento.tipoProcedimento }}</div>
                  <div class="text-gray-500">
                    Risco: 
                    <span
                      class="inline-block px-2 py-1 rounded text-xs font-medium ml-1"
                      :class="getRiscoClass(senha.procedimento.classificacaoDeRisco)"
                    >
                      {{ formatRisco(senha.procedimento.classificacaoDeRisco) }}
                    </span>
                  </div>
                </div>
                <div v-else class="text-gray-400 text-sm">
                  Sem procedimento
                </div>
              </td>

              <!-- Paciente -->
              <td class="table-cell">
                <div v-if="senha.procedimento?.paciente" class="text-sm">
                  <div class="font-medium">{{ senha.procedimento.paciente.nome }}</div>
                  <div class="text-gray-500">{{ senha.procedimento.paciente.cpf }}</div>
                </div>
                <div v-else class="text-gray-400 text-sm">
                  Não informado
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div v-else class="card text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Nenhuma senha encontrada
      </h3>
      <p class="text-gray-500">
        {{ filtrosAplicados ? 'Tente ajustar os filtros para ver mais resultados.' : 'Não há senhas finalizadas no período selecionado.' }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import SenhaService from '@/services/SenhaService.js';
import ProcedimentoService from '@/services/ProcedimentoService.js';

export default {
  name: 'HistoricoSenhas',
  components: {
    BaseButton,
    BaseInput,
    LoadingSpinner,
    Breadcrumb
  },
  setup() {
    const senhasHistorico = ref([]);
    const loading = ref(false);
    const filtros = ref({
      dataInicio: '',
      dataFim: '',
      tipoProcedimento: ''
    });

    const senhaService = new SenhaService();
    const procedimentoService = new ProcedimentoService();

    // Computed para verificar se há filtros aplicados
    const filtrosAplicados = computed(() => {
      return filtros.value.dataInicio || 
             filtros.value.dataFim || 
             filtros.value.tipoProcedimento;
    });

    /**
     * Carrega o histórico de senhas
     */
    const carregarHistorico = async () => {
      loading.value = true;
      try {
        // Busca senhas do histórico
        const senhas = await senhaService.getHistoricoSenhas(filtros.value);
        
        // Busca procedimentos para enriquecer os dados
        const procedimentos = await procedimentoService.getProcedimentos();
        
        // Associa procedimentos às senhas
        senhasHistorico.value = senhas.map(senha => {
          const procedimento = procedimentos.find(proc => 
            proc.senha && proc.senha.codigoSequencial === senha.codigoSequencial
          );
          
          return {
            ...senha,
            procedimento
          };
        });
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        // TODO: Mostrar notificação de erro
      } finally {
        loading.value = false;
      }
    };

    /**
     * Aplica os filtros e recarrega os dados
     */
    const aplicarFiltros = () => {
      carregarHistorico();
    };

    /**
     * Limpa todos os filtros
     */
    const limparFiltros = () => {
      filtros.value = {
        dataInicio: '',
        dataFim: '',
        tipoProcedimento: ''
      };
      carregarHistorico();
    };

    /**
     * Formata data para exibição
     */
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };

    /**
     * Formata hora para exibição
     */
    const formatTime = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    /**
     * Calcula duração entre duas datas
     */
    const calcularDuracao = (inicio, fim) => {
      if (!inicio || !fim) return '-';
      
      const dataInicio = new Date(inicio);
      const dataFim = new Date(fim);
      const diffMs = dataFim - dataInicio;
      
      const diffMinutos = Math.floor(diffMs / (1000 * 60));
      const horas = Math.floor(diffMinutos / 60);
      const minutos = diffMinutos % 60;
      
      if (horas > 0) {
        return `${horas}h ${minutos}min`;
      }
      return `${minutos}min`;
    };

    /**
     * Formata tipo de procedimento
     */
    const formatTipoProcedimento = (tipo) => {
      const tipos = {
        'acolhimento': 'Acolhimento',
        'triagem': 'Triagem',
        'atendimento': 'Atendimento'
      };
      return tipos[tipo] || tipo;
    };

    /**
     * Formata prioridade
     */
    const formatPrioridade = (prioridade) => {
      const prioridades = {
        'normal': 'Normal',
        'prioritario': 'Prioritário',
        'urgente': 'Urgente',
        'emergencia': 'Emergência'
      };
      return prioridades[prioridade] || prioridade;
    };

    /**
     * Formata classificação de risco
     */
    const formatRisco = (risco) => {
      const riscos = {
        'verde': 'Verde',
        'amarelo': 'Amarelo',
        'vermelho': 'Vermelho',
        'azul': 'Azul'
      };
      return riscos[risco] || risco;
    };

    /**
     * Retorna classes CSS para tipo de procedimento
     */
    const getTipoProcedimentoClass = (tipo) => {
      const classes = {
        'acolhimento': 'bg-blue-100 text-blue-800',
        'triagem': 'bg-yellow-100 text-yellow-800',
        'atendimento': 'bg-green-100 text-green-800'
      };
      return classes[tipo] || 'bg-gray-100 text-gray-800';
    };

    /**
     * Retorna classes CSS para prioridade
     */
    const getPrioridadeClass = (prioridade) => {
      const classes = {
        'normal': 'bg-gray-100 text-gray-800',
        'prioritario': 'bg-yellow-100 text-yellow-800',
        'urgente': 'bg-orange-100 text-orange-800',
        'emergencia': 'bg-red-100 text-red-800'
      };
      return classes[prioridade] || 'bg-gray-100 text-gray-800';
    };

    /**
     * Retorna classes CSS para classificação de risco
     */
    const getRiscoClass = (risco) => {
      const classes = {
        'verde': 'bg-green-100 text-green-800',
        'amarelo': 'bg-yellow-100 text-yellow-800',
        'vermelho': 'bg-red-100 text-red-800',
        'azul': 'bg-blue-100 text-blue-800'
      };
      return classes[risco] || 'bg-gray-100 text-gray-800';
    };

    // Carrega dados ao montar o componente
    onMounted(() => {
      carregarHistorico();
    });

    return {
      senhasHistorico,
      loading,
      filtros,
      filtrosAplicados,
      carregarHistorico,
      aplicarFiltros,
      limparFiltros,
      formatDate,
      formatTime,
      calcularDuracao,
      formatTipoProcedimento,
      formatPrioridade,
      formatRisco,
      getTipoProcedimentoClass,
      getPrioridadeClass,
      getRiscoClass
    };
  }
};
</script>

<style scoped>
.historico-senhas {
  @apply p-6 max-w-7xl mx-auto;
}

/* Responsividade para tabela */
@media (max-width: 768px) {
  .overflow-x-auto {
    @apply -mx-4;
  }
  
  .table-cell {
    @apply px-2 py-3 text-sm;
  }
  
  .table-header {
    @apply px-2 py-3 text-sm;
  }
}
</style>