<template>
  <header class="bg-branco shadow-sm border-b border-gray-200">
    <div class="container-responsive py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2 xs:space-x-4 overflow-hidden">
          <img src="/logo-codenews.png" alt="CodeNews Logo" class="h-6 xs:h-8 w-auto flex-shrink-0">
          <div class="min-w-0">
            <h1 class="text-responsive-title text-azul-profundo truncate">
              Sistema Code<span class="text-verde-medicina">News</span>
            </h1>
            <div class="hidden sm:block">
              <span class="text-responsive-subtitle text-cinza-neutro truncate">{{ pageTitle }}</span>
            </div>
          </div>
        </div>
        
        <!-- Informações do usuário logado -->
        <div class="flex items-center space-x-2 xs:space-x-4">
          <div class="text-right hidden xs:block max-w-[120px] sm:max-w-[180px]">
            <p class="text-sm font-medium text-azul-profundo truncate" :title="currentUser?.profissional?.nome || 'Usuário'">
              {{ currentUser?.profissional?.nome || 'Usuário' }}
            </p>
            <p class="text-xs text-cinza-neutro truncate" :title="currentUser?.profissional?.cargo || currentUser?.profissional?.funcao || 'Profissional'">
              <span class="hidden sm:inline">
                {{ currentUser?.profissional?.cargo || currentUser?.profissional?.funcao || 'Profissional' }}
              </span>
              <span class="inline sm:hidden">
                {{ (currentUser?.profissional?.cargo || currentUser?.profissional?.funcao || 'Prof').substring(0, 8) }}...
              </span>
            </p>
          </div>
          <BaseButton 
            variant="secondary" 
            size="small" 
            @click="logout"
            :loading="authStore.loading"
          >
            <span class="hidden sm:inline">Sair</span>
            <span class="sm:hidden">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
          </BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import BaseButton from '@/components/base/BaseButton.vue';

export default {
  name: 'AppHeader',
  components: {
    BaseButton
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    const currentUser = computed(() => authStore.usuario);
    
    const pageTitle = computed(() => {
      const titles = {
        'Dashboard': 'Dashboard',
        'PainelSenhas': 'Painel de Senhas',
        'ListaPacientes': 'Pacientes',
        'DetalhePaciente': 'Detalhes do Paciente',
        'ListaProfissionais': 'Profissionais',
        'HistoricoSenhas': 'Histórico'
      };
      return titles[route.name] || 'Sistema';
    });

    const logout = async () => {
      try {
        await authStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    };

    return {
      authStore,
      currentUser,
      pageTitle,
      logout
    };
  }
}
</script>