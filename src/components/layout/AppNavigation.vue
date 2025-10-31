<template>
  <nav class="bg-azul-profundo text-branco relative">
    <div class="container-responsive">
      <div class="flex justify-between items-center py-4">
        <!-- Logo or menu button for mobile -->
        <div class="flex items-center">
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden text-white focus:outline-none mr-4"
            aria-label="Abrir menu de navegação"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <span class="text-lg font-semibold hidden md:block">Sistema</span>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex nav-responsive">
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
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <span class="text-sm font-medium">Menu</span>
        </div>
      </div>
      
      <!-- Mobile Navigation Menu -->
      <div 
        v-if="mobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-azul-profundo z-50 shadow-lg"
      >
        <div class="container-responsive py-4 flex flex-col space-y-3">
          <router-link 
            to="/" 
            class="nav-item py-3 px-4 block"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'Dashboard' }"
            @click="closeMobileMenu"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/painel-senhas" 
            class="nav-item py-3 px-4 block"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'PainelSenhas' }"
            @click="closeMobileMenu"
          >
            Painel de Senhas
          </router-link>
          <router-link 
            to="/pacientes" 
            class="nav-item py-3 px-4 block"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'ListaPacientes' }"
            @click="closeMobileMenu"
          >
            Pacientes
          </router-link>
          <router-link 
            to="/profissionais" 
            class="nav-item py-3 px-4 block"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'ListaProfissionais' }"
            @click="closeMobileMenu"
          >
            Profissionais
          </router-link>
          <router-link 
            to="/historico" 
            class="nav-item py-3 px-4 block"
            :class="{ 'bg-white bg-opacity-20': $route.name === 'HistoricoSenhas' }"
            @click="closeMobileMenu"
          >
            Histórico
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AppNavigation',
  setup() {
    const mobileMenuOpen = ref(false)
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }
    
    return {
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>