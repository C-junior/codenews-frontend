<template>
  <div class="min-h-screen bg-cinza-claro">
    <!-- Header -->
    <div class="bg-branco shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-titulo-secundario font-montserrat font-bold text-azul-profundo">
              Lista de Profissionais
            </h1>
            <p class="text-texto-base text-cinza-neutro mt-1">
              Gerencie e visualize informações dos profissionais de saúde
            </p>
          </div>
          <router-link 
            to="/" 
            class="btn-secondary"
          >
            Voltar ao Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <Breadcrumb />
      <!-- Filtros -->
      <div class="card mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="filtro" class="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Cargo ou Função
            </label>
            <BaseInput
              id="filtro"
              v-model="filtro"
              type="text"
              placeholder="Digite o cargo ou função para filtrar..."
              @input="aplicarFiltro"
            />
          </div>
          <div class="flex items-end">
            <BaseButton
              variant="secondary"
              @click="limparFiltro"
              :disabled="!filtro"
            >
              Limpar Filtro
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>

      <!-- Tabela de Profissionais -->
      <div v-else class="card">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-cinza-claro">
              <tr>
                <th class="table-header">CPF</th>
                <th class="table-header">Nome</th>
                <th class="table-header">Matrícula</th>
                <th class="table-header">Cargo</th>
                <th class="table-header">Função</th>
                <th class="table-header">Posto de Trabalho</th>
                <th class="table-header">Status do Usuário</th>
              </tr>
            </thead>
            <tbody class="bg-branco divide-y divide-gray-200">
              <tr 
                v-for="profissional in profissionaisFiltrados" 
                :key="profissional.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="table-cell font-mono text-sm">
                  {{ profissional.cpf }}
                </td>
                <td class="table-cell font-semibold">
                  {{ profissional.nome }}
                </td>
                <td class="table-cell font-mono text-sm">
                  {{ profissional.matricula }}
                </td>
                <td class="table-cell">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-azul-profundo bg-opacity-10 text-azul-profundo">
                    {{ profissional.cargo }}
                  </span>
                </td>
                <td class="table-cell">
                  {{ profissional.funcao }}
                </td>
                <td class="table-cell">
                  {{ profissional.postoTrabalho }}
                </td>
                <td class="table-cell">
                  <div v-if="profissional.usuario" class="flex items-center space-x-2">
                    <span 
                      :class="[
                        'status-badge',
                        profissional.usuario.status === 'ATIVO' ? 'status-ativo' : 'status-inativo'
                      ]"
                    >
                      {{ profissional.usuario.status }}
                    </span>
                    <span class="text-xs text-cinza-neutro">
                      ({{ profissional.usuario.username }})
                    </span>
                  </div>
                  <span v-else class="text-sm text-cinza-neutro italic">
                    Sem usuário vinculado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div 
          v-if="!loading && profissionaisFiltrados.length === 0" 
          class="text-center py-12"
        >
          <div class="text-cinza-neutro">
            <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ filtro ? 'Nenhum profissional encontrado' : 'Nenhum profissional cadastrado' }}
            </h3>
            <p class="text-sm">
              {{ filtro ? 'Tente ajustar os filtros de busca.' : 'Não há profissionais cadastrados no sistema.' }}
            </p>
          </div>
        </div>

        <!-- Resumo -->
        <div 
          v-if="!loading && profissionaisFiltrados.length > 0" 
          class="bg-gray-50 px-6 py-3 border-t border-gray-200"
        >
          <p class="text-sm text-cinza-neutro">
            Exibindo {{ profissionaisFiltrados.length }} 
            {{ profissionaisFiltrados.length === 1 ? 'profissional' : 'profissionais' }}
            {{ filtro ? `filtrado(s) por "${filtro}"` : 'no total' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Notificações -->
    <NotificationToast
      v-if="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="notification.show = false"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import NotificationToast from '@/components/base/NotificationToast.vue';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import ProfissionalService from '@/services/ProfissionalService.js';

export default {
  name: 'ListaProfissionais',
  components: {
    BaseInput,
    BaseButton,
    LoadingSpinner,
    NotificationToast,
    Breadcrumb
  },
  setup() {
    // Estado reativo
    const profissionais = ref([]);
    const filtro = ref('');
    const loading = ref(false);
    const notification = ref({
      show: false,
      type: 'success',
      message: ''
    });

    // Computed para profissionais filtrados
    const profissionaisFiltrados = computed(() => {
      if (!filtro.value.trim()) {
        return profissionais.value;
      }

      const filtroLower = filtro.value.toLowerCase().trim();
      return profissionais.value.filter(prof => 
        prof.cargo.toLowerCase().includes(filtroLower) ||
        prof.funcao.toLowerCase().includes(filtroLower)
      );
    });

    // Métodos
    const carregarProfissionais = async () => {
      loading.value = true;
      try {
        profissionais.value = await ProfissionalService.getProfissionais();
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
        showNotification('error', 'Erro ao carregar lista de profissionais. Tente novamente.');
      } finally {
        loading.value = false;
      }
    };

    const aplicarFiltro = () => {
      // O filtro é aplicado automaticamente via computed property
      // Este método pode ser usado para lógica adicional se necessário
    };

    const limparFiltro = () => {
      filtro.value = '';
    };

    const showNotification = (type, message) => {
      notification.value = {
        show: true,
        type,
        message
      };

      if (type === 'success') {
        setTimeout(() => {
          notification.value.show = false;
        }, 3000);
      }
    };

    // Lifecycle
    onMounted(() => {
      carregarProfissionais();
    });

    return {
      profissionais,
      profissionaisFiltrados,
      filtro,
      loading,
      notification,
      aplicarFiltro,
      limparFiltro,
      carregarProfissionais
    };
  }
};
</script>

<style scoped>
/* Estilos específicos do componente se necessário */
</style>