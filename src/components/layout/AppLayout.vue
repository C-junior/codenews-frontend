<template>
  <div class="min-h-screen bg-cinza-claro">
    <!-- Header com informações do usuário -->
    <AppHeader />

    <!-- Navegação principal -->
    <AppNavigation />

    <!-- Conteúdo principal -->
    <main class="container-responsive spacing-responsive-section pt-2">
      <slot />
    </main>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue';
import AppNavigation from './AppNavigation.vue';

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    AppNavigation
  }
}
</script>