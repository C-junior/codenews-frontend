<template>
  <div class="min-h-screen bg-cinza-claro">
    <!-- Header com informações do usuário -->
    <header class="bg-branco shadow-sm border-b border-gray-200">
      <div class="container-responsive py-4">
        <div class="header-responsive">
          <div class="flex items-center space-x-2 xs:space-x-4">
            <img src="/logo-codenews.png" alt="CodeNews Logo" class="h-6 xs:h-8 w-auto">
            <h1 class="text-responsive-title text-azul-profundo">Sistema Code<span class="text-verde-medicina">News</span></h1>
            <span class="text-cinza-neutro hidden xs:inline">|</span>
            <span class="text-responsive-subtitle text-cinza-neutro hidden sm:inline">Dashboard</span>
          </div>
          
          <!-- Informações do usuário logado -->
          <div class="flex items-center space-x-2 xs:space-x-4">
            <div class="text-right hidden xs:block">
              <p class="text-sm font-medium text-azul-profundo">
                {{ currentUser?.profissional?.nome || 'Usuário' }}
              </p>
              <p class="text-xs text-cinza-neutro">
                {{ currentUser?.profissional?.cargo || currentUser?.profissional?.funcao || 'Profissional' }}
              </p>
              <p class="text-xs text-cinza-neutro hidden sm:block">
                {{ currentUser?.profissional?.postoTrabalho || 'Posto de Trabalho' }}
              </p>
            </div>
            <BaseButton 
              variant="secondary" 
              size="small" 
              @click="logout"
              :loading="authStore.loading"
            >
              Sair
            </BaseButton>
          </div>
        </div>
      </div>
    </header>

    <!-- Navegação principal -->
    <nav class="bg-azul-profundo text-branco">
      <div class="container-responsive">
        <div class="nav-responsive py-4">
          <router-link 
            to="/" 
            class="nav-item"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'Dashboard' }"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/painel-senhas" 
            class="nav-item"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'PainelSenhas' }"
          >
            Painel de Senhas
          </router-link>
          <router-link 
            to="/pacientes" 
            class="nav-item"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'ListaPacientes' }"
          >
            Pacientes
          </router-link>
          <router-link 
            to="/profissionais" 
            class="nav-item"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'ListaProfissionais' }"
          >
            Profissionais
          </router-link>
          <router-link 
            to="/historico" 
            class="nav-item"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'HistoricoSenhas' }"
          >
            Histórico
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <main class="container-responsive spacing-responsive-section">
      <!-- Painel de senhas em destaque -->
      <div class="spacing-responsive-element">
        <PainelSenhas />
      </div>

      <!-- Cards informativos -->
      <div class="grid-responsive-stats spacing-responsive-element">
        <!-- Estatísticas do dia -->
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-cinza-neutro">Senhas Atendidas Hoje</p>
              <p class="text-2xl font-bold text-azul-profundo">{{ estatisticas.totalAtendidas }}</p>
            </div>
            <div class="w-12 h-12 bg-verde-medicina bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-verde-medicina" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-cinza-neutro">Em Andamento</p>
              <p class="text-2xl font-bold text-azul-profundo">{{ estatisticas.emAndamento }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-cinza-neutro">Na Fila</p>
              <p class="text-2xl font-bold text-azul-profundo">{{ estatisticas.naFila }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-cinza-neutro">Última Atualização</p>
              <p class="text-sm font-medium text-azul-profundo">{{ ultimaAtualizacao }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações rápidas -->
      <div class="grid-responsive-cards">
        <div class="card">
          <h3 class="text-lg font-semibold text-azul-profundo mb-4">Ações Rápidas</h3>
          <div class="space-y-3">
            <BaseButton 
              variant="primary" 
              class="w-full justify-start"
              @click="$router.push('/painel-senhas')"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4z"></path>
              </svg>
              Gerenciar Senhas
            </BaseButton>
            
            <BaseButton 
              variant="secondary" 
              class="w-full justify-start"
              @click="$router.push('/pacientes')"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Ver Pacientes
            </BaseButton>
            
            <BaseButton 
              variant="secondary" 
              class="w-full justify-start"
              @click="atualizarDados"
              :loading="senhaStore.loading"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Atualizar Dados
            </BaseButton>
          </div>
        </div>

        <!-- Informações do profissional -->
        <div class="card">
          <h3 class="text-lg font-semibold text-azul-profundo mb-4">Meu Perfil</h3>
          <div class="space-y-2">
            <div>
              <p class="text-sm text-cinza-neutro">Nome</p>
              <p class="font-medium text-azul-profundo">{{ currentUser?.profissional?.nome || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-cinza-neutro">CPF</p>
              <p class="font-medium text-azul-profundo">{{ formatCPF(currentUser?.profissional?.cpf) || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-cinza-neutro">Matrícula</p>
              <p class="font-medium text-azul-profundo">{{ currentUser?.profissional?.matricula || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-cinza-neutro">Cargo/Função</p>
              <p class="font-medium text-azul-profundo">{{ currentUser?.profissional?.cargo || currentUser?.profissional?.funcao || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Resumo por tipo de procedimento -->
        <div class="card">
          <h3 class="text-lg font-semibold text-azul-profundo mb-4">Atendimentos por Tipo</h3>
          <div class="space-y-3">
            <div v-for="(count, tipo) in estatisticas.porTipo" :key="tipo" class="flex justify-between items-center">
              <span class="text-sm text-cinza-neutro capitalize">{{ tipo }}</span>
              <span class="font-semibold text-azul-profundo">{{ count }}</span>
            </div>
            <div v-if="Object.keys(estatisticas.porTipo).length === 0" class="text-center text-cinza-neutro text-sm">
              Nenhum atendimento hoje
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useSenhaStore } from '@/stores/senha.js';
import BaseButton from '@/components/base/BaseButton.vue';
import PainelSenhas from '@/views/PainelSenhas.vue';

export default {
  name: 'Dashboard',
  components: {
    BaseButton,
    PainelSenhas
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const senhaStore = useSenhaStore();

    // Estado reativo
    const currentTime = ref(new Date());

    // Computed properties
    const currentUser = computed(() => authStore.usuario);
    
    const estatisticas = computed(() => senhaStore.estatisticasDia);
    
    const ultimaAtualizacao = computed(() => {
      if (!senhaStore.lastUpdate) return 'Nunca';
      
      const now = new Date();
      const diff = Math.floor((now - new Date(senhaStore.lastUpdate)) / 1000);
      
      if (diff < 60) return 'Agora mesmo';
      if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
      return `${Math.floor(diff / 3600)}h atrás`;
    });

    // Métodos
    const formatCPF = (cpf) => {
      if (!cpf) return '';
      const cleaned = cpf.replace(/\D/g, '');
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const logout = async () => {
      try {
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    };

    const atualizarDados = async () => {
      try {
        await senhaStore.atualizarTodosDados();
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    };

    // Atualiza o horário a cada minuto
    const updateTime = () => {
      currentTime.value = new Date();
    };

    // Lifecycle
    onMounted(async () => {
      // Carrega dados iniciais
      await senhaStore.atualizarTodosDados();
      
      // Atualiza horário a cada minuto
      const timeInterval = setInterval(updateTime, 60000);
      
      // Atualiza dados a cada 30 segundos
      const dataInterval = setInterval(() => {
        senhaStore.atualizarTodosDados();
      }, 30000);
      
      // Cleanup dos intervals quando o componente for desmontado
      return () => {
        clearInterval(timeInterval);
        clearInterval(dataInterval);
      };
    });

    return {
      authStore,
      senhaStore,
      currentUser,
      estatisticas,
      ultimaAtualizacao,
      formatCPF,
      logout,
      atualizarDados
    };
  }
}
</script>