<template>
  <nav class="flex mb-6" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <router-link
          to="/"
          class="inline-flex items-center text-sm font-medium text-cinza-neutro hover:text-azul-profundo transition-colors"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          Dashboard
        </router-link>
      </li>
      
      <li v-for="(item, index) in breadcrumbItems" :key="index">
        <div class="flex items-center">
          <svg
            class="w-6 h-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          
          <router-link
            v-if="item.to && index < breadcrumbItems.length - 1"
            :to="item.to"
            class="ml-1 text-sm font-medium text-cinza-neutro hover:text-azul-profundo transition-colors md:ml-2"
          >
            {{ item.text }}
          </router-link>
          
          <span
            v-else
            class="ml-1 text-sm font-medium text-azul-profundo md:ml-2"
            aria-current="page"
          >
            {{ item.text }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'Breadcrumb',
  props: {
    customItems: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const route = useRoute();

    const breadcrumbItems = computed(() => {
      // Se há itens customizados, usa eles
      if (props.customItems.length > 0) {
        return props.customItems;
      }

      // Gera breadcrumbs automaticamente baseado na rota
      const items = [];
      
      // Mapeia rotas para breadcrumbs
      const routeBreadcrumbs = {
        'PainelSenhas': [{ text: 'Painel de Senhas' }],
        'ListaPacientes': [{ text: 'Pacientes' }],
        'DetalhePaciente': [
          { text: 'Pacientes', to: '/pacientes' },
          { text: 'Detalhes do Paciente' }
        ],
        'ListaProfissionais': [{ text: 'Profissionais' }],
        'DetalheProcedimento': [
          { text: 'Procedimentos', to: '/procedimentos' },
          { text: 'Detalhes do Procedimento' }
        ],
        'HistoricoSenhas': [{ text: 'Histórico de Senhas' }]
      };

      // Adiciona breadcrumbs específicos da rota atual
      if (routeBreadcrumbs[route.name]) {
        items.push(...routeBreadcrumbs[route.name]);
      }

      return items;
    });

    return {
      breadcrumbItems
    };
  }
};
</script>

<style scoped>
/* Estilos específicos para breadcrumb se necessário */
</style>