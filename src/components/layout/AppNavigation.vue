<template>
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
</template>

<script>
export default {
  name: 'AppNavigation'
}
</script>