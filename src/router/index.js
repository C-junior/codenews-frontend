import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Login.vue'),
    meta: { 
      requiresAuth: false,
      title: 'Login - Sistema CodeNews',
      preload: false // Não precarrega pois é página inicial
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Dashboard - Sistema CodeNews',
      preload: true // Precarrega pois é página principal
    }
  },
  {
    path: '/painel-senhas',
    name: 'PainelSenhas',
    component: () => import(/* webpackChunkName: "senhas" */ '@/views/PainelSenhas.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Painel de Senhas - Sistema CodeNews',
      preload: true // Funcionalidade crítica
    }
  },
  {
    path: '/pacientes',
    name: 'ListaPacientes',
    component: () => import(/* webpackChunkName: "pacientes" */ '@/views/ListaPacientes.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Pacientes - Sistema CodeNews',
      preload: true // Funcionalidade frequente
    }
  },
  {
    path: '/pacientes/:id',
    name: 'DetalhePaciente',
    component: () => import(/* webpackChunkName: "pacientes" */ '@/views/DetalhePaciente.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Detalhes do Paciente - Sistema CodeNews',
      preload: false // Carrega sob demanda
    }
  },
  {
    path: '/profissionais',
    name: 'ListaProfissionais',
    component: () => import(/* webpackChunkName: "profissionais" */ '@/views/ListaProfissionais.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Profissionais - Sistema CodeNews',
      preload: false // Menos frequente
    }
  },
  {
    path: '/procedimentos/:id',
    name: 'DetalheProcedimento',
    component: () => import(/* webpackChunkName: "procedimentos" */ '@/views/DetalheProcedimento.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Detalhes do Procedimento - Sistema CodeNews',
      preload: false // Carrega sob demanda
    }
  },
  {
    path: '/historico',
    name: 'HistoricoSenhas',
    component: () => import(/* webpackChunkName: "historico" */ '@/views/HistoricoSenhas.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Histórico de Senhas - Sistema CodeNews',
      preload: false // Menos frequente
    }
  },
  // Rota de fallback para páginas não encontradas
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Atualiza o título da página
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Se a rota não requer autenticação, permite acesso
  if (!to.meta.requiresAuth) {
    // Se já está autenticado e tenta acessar login, redireciona para dashboard
    if (to.name === 'Login' && authStore.isAuthenticated) {
      next('/')
      return
    }
    next()
    return
  }
  
  // Para rotas que requerem autenticação, verifica se está autenticado
  try {
    // Verifica autenticação (pode carregar do localStorage ou validar token)
    const isAuthenticated = await authStore.checkAuth()
    
    if (isAuthenticated) {
      next()
    } else {
      // Não autenticado, redireciona para login
      next({
        name: 'Login',
        query: { redirect: to.fullPath } // Salva a rota de destino para redirecionar após login
      })
    }
  } catch (error) {
    console.error('Erro na verificação de autenticação:', error)
    // Em caso de erro, redireciona para login
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  }
})

// Guard após navegação para limpar loading states e precarregar rotas
router.afterEach((to) => {
  // Pode ser usado para analytics, limpar estados de loading, etc.
  const authStore = useAuthStore()
  if (authStore.loading) {
    // Força limpeza de loading se ainda estiver ativo
    setTimeout(() => {
      authStore.loading = false
    }, 100)
  }
  
  // Precarrega rotas críticas após navegação bem-sucedida
  if (import.meta.env.VITE_PRELOAD_CHUNKS !== 'false') {
    preloadCriticalRoutes()
  }
  
  // Analytics de navegação (se necessário)
  if (import.meta.env.PROD && to.name) {
    console.log(`Navegação para: ${to.name}`)
  }
})

// Função para precarregar rotas críticas
function preloadCriticalRoutes() {
  const criticalRoutes = routes.filter(route => route.meta?.preload)
  
  criticalRoutes.forEach(route => {
    if (typeof route.component === 'function') {
      // Precarrega o componente em background
      route.component().catch(error => {
        console.warn('Falha ao precarregar rota:', route.name, error)
      })
    }
  })
}

export default router
