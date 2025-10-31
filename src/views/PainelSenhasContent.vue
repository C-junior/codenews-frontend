<template>
  <div class="painel-senhas">
    <!-- Breadcrumb -->
    <Breadcrumb />
    
    <!-- Cabeçalho do painel -->
    <div class="bg-branco rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-azul-profundo">Painel de Senhas</h2>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-cinza-neutro">
            Última atualização: {{ ultimaAtualizacao }}
          </div>
          <BaseButton
            variant="secondary"
            size="small"
            @click="atualizarDados"
            :loading="senhaStore.loading"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Atualizar
          </BaseButton>
        </div>
      </div>

      <!-- Filtro por perfil profissional -->
      <div v-if="perfilProfissional" class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm text-blue-800">
            Exibindo senhas filtradas para: <strong>{{ perfilProfissional }}</strong>
          </span>
        </div>
      </div>
    </div>

    <!-- Senha atual em destaque -->
    <div class="bg-branco rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
      <h3 class="text-xl font-semibold text-azul-profundo mb-6 text-center">Senha Atual</h3>
      
      <div v-if="senhaAtual" class="text-center">
        <!-- Display da senha atual -->
        <div class="bg-verde-medicina bg-opacity-10 border-2 border-verde-medicina rounded-xl p-8 mb-6">
          <div class="text-6xl font-bold text-verde-medicina mb-2">
            {{ senhaAtual.codigoSequencial }}
          </div>
          <div class="text-lg text-azul-profundo mb-2">
            {{ formatarTipoProcedimento(senhaAtual.tipoProcedimento) }}
          </div>
          <div class="text-sm text-cinza-neutro">
            Prioridade: {{ formatarPrioridade(senhaAtual.tipoPrioridade) }}
          </div>
          <div class="text-sm text-cinza-neutro">
            Emitida às: {{ formatarHora(senhaAtual.dataHoraEmissao) }}
          </div>
        </div>

        <!-- Botão para finalizar senha atual -->
        <BaseButton
          variant="secondary"
          @click="finalizarSenhaAtual"
          :loading="senhaStore.loading"
          class="mr-4"
        >
          Finalizar Atendimento
        </BaseButton>
      </div>

      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1H4a1 1 0 00-1 1v1z"></path>
        </svg>
        <p class="text-xl text-cinza-neutro mb-2">Nenhuma senha sendo chamada</p>
        <p class="text-sm text-cinza-neutro">Clique em "Chamar Próxima Senha" para iniciar</p>
      </div>
    </div>

    <!-- Controles e próximas senhas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Controle de chamada -->
      <div class="bg-branco rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-azul-profundo mb-4">Controle de Chamada</h3>
        
        <div class="space-y-4">
          <BaseButton
            variant="primary"
            size="large"
            @click="chamarProximaSenha"
            :loading="senhaStore.loading"
            :disabled="proximasSenhasFiltradas.length === 0"
            class="w-full"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
            </svg>
            Chamar Próxima Senha
          </BaseButton>

          <!-- Estatísticas rápidas -->
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div class="text-center">
              <div class="text-2xl font-bold text-azul-profundo">{{ proximasSenhasFiltradas.length }}</div>
              <div class="text-sm text-cinza-neutro">Na Fila</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-verde-medicina">{{ senhasUrgentes }}</div>
              <div class="text-sm text-cinza-neutro">Urgentes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximas senhas -->
      <div class="bg-branco rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-azul-profundo mb-4">Próximas Senhas</h3>
        
        <div v-if="proximasSenhasFiltradas.length > 0" class="space-y-3">
          <div
            v-for="(senha, index) in proximasSenhasFiltradas.slice(0, 5)"
            :key="senha.id"
            class="flex items-center justify-between p-3 rounded-lg border"
            :class="getPrioridadeClass(senha.tipoPrioridade)"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <span class="text-lg font-bold text-azul-profundo">
                  {{ senha.codigoSequencial }}
                </span>
              </div>
              <div>
                <div class="text-sm font-medium text-azul-profundo">
                  {{ formatarTipoProcedimento(senha.tipoProcedimento) }}
                </div>
                <div class="text-xs text-cinza-neutro">
                  {{ formatarHora(senha.dataHoraEmissao) }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs px-2 py-1 rounded-full font-medium"
                    :class="getPrioridadeBadgeClass(senha.tipoPrioridade)">
                {{ formatarPrioridade(senha.tipoPrioridade) }}
              </span>
              <span class="text-xs text-cinza-neutro">
                #{{ index + 1 }}
              </span>
            </div>
          </div>

          <!-- Indicador de mais senhas -->
          <div v-if="proximasSenhasFiltradas.length > 5" class="text-center pt-3 border-t border-gray-200">
            <span class="text-sm text-cinza-neutro">
              + {{ proximasSenhasFiltradas.length - 5 }} senhas na fila
            </span>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-sm text-cinza-neutro">Nenhuma senha na fila</p>
        </div>
      </div>
    </div>

    <!-- Notificações de erro -->
    <div v-if="senhaStore.error" class="mt-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="text-sm font-medium text-red-800">Erro</h3>
            <p class="text-sm text-red-700 mt-1">{{ senhaStore.error }}</p>
            <BaseButton
              variant="secondary"
              size="small"
              @click="senhaStore.clearError"
              class="mt-2"
            >
              Dispensar
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useSenhaStore } from '@/stores/senha.js';
import BaseButton from '@/components/base/BaseButton.vue';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';

export default {
  name: 'PainelSenhasContent',
  components: {
    BaseButton,
    Breadcrumb
  },
  setup() {
    const authStore = useAuthStore();
    const senhaStore = useSenhaStore();
    
    let updateInterval = null;

    // Computed properties
    const senhaAtual = computed(() => senhaStore.senhaAtual);
    
    const perfilProfissional = computed(() => {
      return authStore.currentProfissional?.funcao || authStore.currentProfissional?.cargo;
    });
    
    const proximasSenhasFiltradas = computed(() => senhaStore.senhasFiltradas);
    
    const senhasUrgentes = computed(() => {
      return proximasSenhasFiltradas.value.filter(senha => senha.tipoPrioridade === 'urgente').length;
    });
    
    const ultimaAtualizacao = computed(() => {
      if (!senhaStore.lastUpdate) return 'Nunca';
      
      const now = new Date();
      const diff = Math.floor((now - new Date(senhaStore.lastUpdate)) / 1000);
      
      if (diff < 60) return 'Agora mesmo';
      if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
      return `${Math.floor(diff / 3600)}h atrás`;
    });

    // Métodos de formatação
    const formatarTipoProcedimento = (tipo) => {
      const tipos = {
        'acolhimento': 'Acolhimento',
        'triagem': 'Triagem',
        'atendimento': 'Atendimento Médico'
      };
      return tipos[tipo] || tipo;
    };

    const formatarPrioridade = (prioridade) => {
      const prioridades = {
        'normal': 'Normal',
        'prioritario': 'Prioritário',
        'urgente': 'Urgente'
      };
      return prioridades[prioridade] || prioridade;
    };

    const formatarHora = (dataHora) => {
      if (!dataHora) return '';
      const data = new Date(dataHora);
      return data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const getPrioridadeClass = (prioridade) => {
      const classes = {
        'normal': 'border-gray-200 bg-gray-50',
        'prioritario': 'border-yellow-300 bg-yellow-50',
        'urgente': 'border-red-300 bg-red-50'
      };
      return classes[prioridade] || classes.normal;
    };

    const getPrioridadeBadgeClass = (prioridade) => {
      const classes = {
        'normal': 'bg-gray-200 text-gray-800',
        'prioritario': 'bg-yellow-200 text-yellow-800',
        'urgente': 'bg-red-200 text-red-800'
      };
      return classes[prioridade] || classes.normal;
    };

    // Métodos de ação
    const chamarProximaSenha = async () => {
      try {
        const novaSenha = await senhaStore.chamarProximaSenha();
        
        if (novaSenha) {
          // Feedback visual/sonoro pode ser adicionado aqui
          console.log('Nova senha chamada:', novaSenha.codigoSequencial);
        } else {
          console.log('Não há mais senhas na fila');
        }
      } catch (error) {
        console.error('Erro ao chamar próxima senha:', error);
      }
    };

    const finalizarSenhaAtual = async () => {
      try {
        await senhaStore.finalizarSenhaAtual();
        console.log('Senha atual finalizada');
      } catch (error) {
        console.error('Erro ao finalizar senha:', error);
      }
    };

    const atualizarDados = async () => {
      try {
        await senhaStore.atualizarTodosDados();
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    };

    // Lifecycle
    onMounted(async () => {
      // Carrega dados iniciais
      await senhaStore.atualizarTodosDados();
      
      // Configura atualização automática a cada 15 segundos
      updateInterval = setInterval(() => {
        senhaStore.atualizarTodosDados();
      }, 15000);
    });

    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    });

    return {
      senhaStore,
      senhaAtual,
      perfilProfissional,
      proximasSenhasFiltradas,
      senhasUrgentes,
      ultimaAtualizacao,
      formatarTipoProcedimento,
      formatarPrioridade,
      formatarHora,
      getPrioridadeClass,
      getPrioridadeBadgeClass,
      chamarProximaSenha,
      finalizarSenhaAtual,
      atualizarDados
    };
  }
}
</script>

<style scoped>
.painel-senhas {
  @apply max-w-7xl mx-auto;
}

/* Animações para transições suaves */
.senha-atual-enter-active,
.senha-atual-leave-active {
  transition: all 0.3s ease;
}

.senha-atual-enter-from,
.senha-atual-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Efeito de pulsação para senha urgente */
.urgente-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>