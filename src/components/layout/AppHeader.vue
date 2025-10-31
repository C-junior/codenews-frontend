<template>
  <header class="bg-branco shadow-sm border-b border-gray-200">
    <div class="container-responsive py-4">
      <div class="header-responsive">
        <div class="flex items-center space-x-2 xs:space-x-4">
          <img src="/logo-codenews.png" alt="CodeNews Logo" class="h-6 xs:h-8 w-auto">
          <h1 class="text-responsive-title text-azul-profundo">Sistema Code<span class="text-verde-medicina">News</span></h1>
          <span class="text-cinza-neutro hidden xs:inline">|</span>
          <span class="text-responsive-subtitle text-cinza-neutro hidden sm:inline">{{ pageTitle }}</span>
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