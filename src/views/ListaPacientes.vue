<template>
  <AppLayout>
    <!-- Breadcrumb -->
    <Breadcrumb />
      <!-- Search Section -->
      <div class="card mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="flex-1 max-w-md">
            <label for="search" class="sr-only">Buscar pacientes</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-cinza-neutro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                v-model="searchTerm"
                type="text"
                class="input-field pl-10"
                placeholder="Buscar por nome ou CPF..."
                @input="handleSearch"
              />
            </div>
          </div>
          <div class="text-sm text-cinza-neutro">
            {{ filteredPacientes.length }} paciente(s) encontrado(s)
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="card">
        <div class="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
          <span class="ml-3 text-texto-base text-cinza-neutro">Carregando pacientes...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPacientes.length === 0 && !loading" class="card">
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-cinza-neutro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-4 text-subtitulo font-nunito font-medium text-cinza-neutro">
            {{ searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado' }}
          </h3>
          <p class="mt-2 text-texto-base text-cinza-neutro">
            {{ searchTerm ? 'Tente ajustar os termos de busca.' : 'Não há pacientes cadastrados no sistema.' }}
          </p>
        </div>
      </div>

      <!-- Patients Table -->
      <div v-else class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-cinza-claro">
              <tr>
                <th class="table-header">
                  <button 
                    @click="toggleSort"
                    class="flex items-center space-x-1 hover:text-azul-profundo focus:outline-none focus:text-azul-profundo"
                    :aria-label="sortOrder === 'asc' ? 'Ordenar por nome decrescente' : 'Ordenar por nome crescente'"
                  >
                    <span>Nome</span>
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        :d="sortOrder === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" 
                      />
                    </svg>
                  </button>
                </th>
                <th class="table-header">CPF</th>
                <th class="table-header">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-branco divide-y divide-gray-200">
              <tr 
                v-for="paciente in filteredPacientes" 
                :key="paciente.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="table-cell">
                  <div class="font-medium text-gray-900">
                    {{ paciente.nome }}
                  </div>
                </td>
                <td class="table-cell">
                  <span class="text-cinza-neutro font-mono">
                    {{ paciente.cpf }}
                  </span>
                </td>
                <td class="table-cell">
                  <router-link
                    :to="`/pacientes/${paciente.id}`"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-azul-profundo bg-azul-profundo bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-profundo transition-colors duration-200"
                    :aria-label="`Ver detalhes de ${paciente.nome}`"
                  >
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Detalhes
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import PacienteService from '@/services/PacienteService.js';
import LoadingSpinner from '@/components/base/LoadingSpinner.vue';
import NotificationToast from '@/components/base/NotificationToast.vue';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import AppLayout from '@/components/layout/AppLayout.vue';

export default {
  name: 'ListaPacientes',
  components: {
    LoadingSpinner,
    NotificationToast,
    Breadcrumb,
    AppLayout
  },
  setup() {
    const router = useRouter();
    
    // Estado reativo
    const pacientes = ref([]);
    const searchTerm = ref('');
    const loading = ref(false);
    const sortOrder = ref('asc');
    const notification = ref({
      show: false,
      type: 'success',
      message: ''
    });

    // Computed para pacientes filtrados e ordenados
    const filteredPacientes = computed(() => {
      let filtered = [...pacientes.value];
      
      // Aplica filtro de busca
      if (searchTerm.value.trim()) {
        const termo = searchTerm.value.toLowerCase().trim();
        filtered = filtered.filter(paciente => 
          paciente.nome.toLowerCase().includes(termo) ||
          paciente.cpf.replace(/\D/g, '').includes(termo.replace(/\D/g, ''))
        );
      }
      
      // Aplica ordenação
      filtered.sort((a, b) => {
        const comparison = a.nome.localeCompare(b.nome);
        return sortOrder.value === 'asc' ? comparison : -comparison;
      });
      
      return filtered;
    });

    // Métodos
    const fetchPacientes = async () => {
      loading.value = true;
      try {
        pacientes.value = await PacienteService.getPacientes();
      } catch (error) {
        showNotification('error', error.message || 'Erro ao carregar pacientes');
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = () => {
      // A busca é reativa através do computed filteredPacientes
      // Este método pode ser usado para adicionar debounce se necessário
    };

    const toggleSort = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
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
      fetchPacientes();
    });

    return {
      pacientes,
      filteredPacientes,
      searchTerm,
      loading,
      sortOrder,
      notification,
      handleSearch,
      toggleSort,
      closeNotification
    };
  }
};
</script>