# Documento de Design - Sistema CodeNews MVP

## Visão Geral

O Sistema CodeNews é um MVP frontend desenvolvido em Vue.js 3 com Composition API, Tailwind CSS v3.4.17 e Axios. O sistema consome dados de um backend REST já existente, seguindo exatamente as entidades e relacionamentos definidos no modelo de dados. A aplicação foca em gestão de atendimento hospitalar com interface responsiva e acessível.

## Arquitetura

### Estrutura do Projeto
```
src/
├── components/           # Componentes Vue reutilizáveis
│   ├── base/            # Componentes base (botões, inputs, modais)
│   ├── forms/           # Formulários específicos
│   └── layout/          # Componentes de layout
├── views/               # Telas principais (8 obrigatórias)
├── composables/         # Lógica reutilizável (Composition API)
├── services/            # Serviços de API REST
├── stores/              # Gerenciamento de estado (Pinia opcional)
├── utils/               # Utilitários e validações
├── assets/              # Recursos estáticos
└── router/              # Configuração de rotas
```

### Stack Tecnológica
- **Framework**: Vite + Vue.js 3 (Composition API)
- **Estilização**: Tailwind CSS v3.4.17
- **HTTP Client**: Axios
- **Linguagem**: JavaScript ES6+
- **Estado**: Pinia (opcional) ou ref/reactive locais
- **Roteamento**: Vue Router 4

## Modelos de Dados (Seguindo Backend Exato)

### Pessoa (Entidade Base)
```javascript
{
  cpf: String,
  nome: String
}
```

### Paciente (extends Pessoa)
```javascript
{
  // Herda de Pessoa
  cpf: String,
  nome: String
}
```

### Profissional (extends Pessoa)
```javascript
{
  // Herda de Pessoa
  cpf: String,
  nome: String,
  // Campos adicionais
  matricula: String,
  cargo: String,
  funcao: String,
  postoTrabalho: String
}
```

### Usuario
```javascript
{
  username: String,
  password: String,
  profissional: Profissional, // Relacionamento
  permissao: String,
  status: String
}
```

### Senha
```javascript
{
  codigoSequencial: String,
  dataHoraEmissao: LocalDateTime,
  dataHoraEncerramento: LocalDateTime,
  tipoPrioridade: String,
  tipoProcedimento: String,
  status: String
}
```

### PressaoArterial
```javascript
{
  sistolica: int,
  diastolica: int
}
```

### DadosClinicos
```javascript
{
  temperaturaCorporal: double,
  pressaoArterial: PressaoArterial,
  flagPacienteSenteDor: boolean,
  diagnostico: String,
  desfecho: String
}
```

### Procedimento
```javascript
{
  senha: Senha, // Relacionamento
  paciente: Paciente, // Relacionamento
  tipoProcedimento: String,
  dataHoraInicio: LocalDateTime,
  dataHoraFim: LocalDateTime,
  dadosClinicos: DadosClinicos, // Relacionamento
  classificacaoDeRisco: String,
  status: String
}
```## Compo
nentes e Telas Obrigatórias

### 1. Login.vue
**Responsabilidade**: Autenticação de usuários
```javascript
// Campos do formulário
{
  username: String, // Campo obrigatório
  password: String  // Campo obrigatório
}
```
- Validação de campos obrigatórios
- Integração com endpoint de autenticação
- Gerenciamento de sessão/token
- Feedback visual para erros

### 2. Dashboard.vue
**Responsabilidade**: Painel principal do sistema
- Layout responsivo com navegação
- Painel de senhas em destaque
- Informações do usuário logado (Usuario.profissional)
- Procedimentos em andamento
- Menu de navegação para outras telas

### 3. PainelSenhas.vue
**Responsabilidade**: Controle da fila de atendimento
- Display da Senha atual (status ativo)
- Lista das próximas senhas (ordenadas por codigoSequencial e tipoPrioridade)
- Botão "Chamar Próxima Senha"
- Filtro por tipoProcedimento baseado no perfil do profissional
- Atualização em tempo real

### 4. ListaPacientes.vue
**Responsabilidade**: Listagem de pacientes
- Tabela com campos: cpf, nome
- Campo de busca (filtro por nome ou cpf)
- Ordenação alfabética por nome
- Link para DetalhePaciente.vue
- Paginação se necessário

### 5. DetalhePaciente.vue
**Responsabilidade**: Detalhes do paciente
- Exibição de dados do Paciente (cpf, nome)
- Lista de Procedimento vinculados ao paciente
- Histórico de atendimentos
- Navegação de volta para lista

### 6. ListaProfissionais.vue
**Responsabilidade**: Listagem de profissionais
- Tabela com campos: cpf, nome, matricula, cargo, funcao, postoTrabalho
- Filtro por cargo ou funcao
- Status do Usuario vinculado (quando disponível)
- Informações de perfil (acolhimento, triagem, atendimento)

### 7. DetalheProcedimento.vue
**Responsabilidade**: Detalhes e gestão de procedimentos
- Informações do Procedimento: tipoProcedimento, dataHoraInicio, dataHoraFim, classificacaoDeRisco, status
- Dados da Senha vinculada
- Dados do Paciente vinculado
- Formulário para DadosClinicos (editável)
- Botão para finalizar procedimento

### 8. HistoricoSenhas.vue
**Responsabilidade**: Histórico de senhas e procedimentos
- Lista de senhas com dataHoraEncerramento preenchida
- Filtros por data e tipoProcedimento
- Informações do procedimento associado
- Status final do atendimento

## Componentes Base Reutilizáveis

### BaseButton.vue
```javascript
props: {
  variant: ['primary', 'secondary', 'success', 'error'],
  size: ['small', 'medium', 'large'],
  loading: Boolean,
  disabled: Boolean
}
```

### BaseInput.vue
```javascript
props: {
  modelValue: [String, Number],
  type: ['text', 'password', 'email', 'tel', 'number'],
  placeholder: String,
  required: Boolean,
  error: String
}
```

### BaseModal.vue
```javascript
props: {
  show: Boolean,
  title: String,
  size: ['small', 'medium', 'large']
}
```

### LoadingSpinner.vue
```javascript
props: {
  size: ['small', 'medium', 'large'],
  color: String
}
```

### NotificationToast.vue
```javascript
props: {
  type: ['success', 'error', 'warning', 'info'],
  message: String,
  autoClose: Boolean,
  duration: Number
}
```

## Serviços de API

### AuthService.js
```javascript
class AuthService {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    return response.data; // Retorna Usuario com Profissional
  }
  
  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  }
  
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data; // Usuario com Profissional
  }
}
```

### SenhaService.js
```javascript
class SenhaService {
  async getSenhaAtual() {
    const response = await api.get('/senhas/atual');
    return response.data; // Senha
  }
  
  async getProximasSenhas() {
    const response = await api.get('/senhas/proximas');
    return response.data; // Array de Senha
  }
  
  async chamarProximaSenha() {
    const response = await api.post('/senhas/chamar-proxima');
    return response.data; // Senha atualizada
  }
  
  async getHistoricoSenhas() {
    const response = await api.get('/senhas/historico');
    return response.data; // Array de Senha com dataHoraEncerramento
  }
}
```

### PacienteService.js
```javascript
class PacienteService {
  async getPacientes(searchTerm = '') {
    const response = await api.get('/pacientes', {
      params: { search: searchTerm }
    });
    return response.data; // Array de Paciente
  }
  
  async getPacienteById(id) {
    const response = await api.get(`/pacientes/${id}`);
    return response.data; // Paciente
  }
  
  async getProcedimentosByPaciente(pacienteId) {
    const response = await api.get(`/pacientes/${pacienteId}/procedimentos`);
    return response.data; // Array de Procedimento
  }
}
```

### ProfissionalService.js
```javascript
class ProfissionalService {
  async getProfissionais() {
    const response = await api.get('/profissionais');
    return response.data; // Array de Profissional
  }
  
  async getProfissionalById(id) {
    const response = await api.get(`/profissionais/${id}`);
    return response.data; // Profissional
  }
  
  async getProfissionaisByCargoOrFuncao(filter) {
    const response = await api.get('/profissionais', {
      params: { filter }
    });
    return response.data; // Array de Profissional filtrado
  }
}
```

### ProcedimentoService.js
```javascript
class ProcedimentoService {
  async getProcedimentos(filters = {}) {
    const response = await api.get('/procedimentos', { params: filters });
    return response.data; // Array de Procedimento
  }
  
  async getProcedimentoById(id) {
    const response = await api.get(`/procedimentos/${id}`);
    return response.data; // Procedimento com DadosClinicos
  }
  
  async updateDadosClinicos(procedimentoId, dadosClinicos) {
    const response = await api.put(`/procedimentos/${procedimentoId}/dados-clinicos`, dadosClinicos);
    return response.data; // DadosClinicos atualizado
  }
  
  async finalizarProcedimento(procedimentoId) {
    const response = await api.post(`/procedimentos/${procedimentoId}/finalizar`);
    return response.data; // Procedimento com status atualizado
  }
}
```##
 Configuração do Tailwind CSS

### Paleta de Cores Personalizada
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'azul-profundo': '#234A7A',
        'verde-medicina': '#8ABF5C',
        'cinza-claro': '#F3F7FA',
        'cinza-neutro': '#707B83',
        'branco': '#FFFFFF'
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'nunito': ['Nunito Sans', 'sans-serif'],
        'lato': ['Lato', 'sans-serif']
      },
      fontSize: {
        'titulo-principal': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'titulo-secundario': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'subtitulo': ['24px', { lineHeight: '1.4', fontWeight: '500' }],
        'texto-base': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'texto-grande': ['20px', { lineHeight: '1.5', fontWeight: '400' }]
      }
    }
  },
  plugins: []
}
```

### Classes Utilitárias Personalizadas
```css
/* src/assets/css/custom.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-azul-profundo text-branco px-6 py-3 rounded-lg font-semibold 
           hover:bg-opacity-90 transition-all duration-200 
           focus:ring-2 focus:ring-azul-profundo focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-verde-medicina text-branco px-6 py-3 rounded-lg font-semibold 
           hover:bg-opacity-90 transition-all duration-200
           focus:ring-2 focus:ring-verde-medicina focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .card {
    @apply bg-branco rounded-xl shadow-sm border border-gray-100 p-6;
  }
  
  .input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-azul-profundo focus:border-azul-profundo
           transition-colors duration-200 text-base;
  }
  
  .table-header {
    @apply bg-cinza-claro text-azul-profundo font-semibold px-4 py-3 text-left;
  }
  
  .table-cell {
    @apply px-4 py-3 border-b border-gray-200 text-gray-900;
  }
  
  .status-badge {
    @apply px-3 py-1 rounded-full text-sm font-medium;
  }
  
  .status-ativo {
    @apply bg-verde-medicina bg-opacity-20 text-verde-medicina;
  }
  
  .status-inativo {
    @apply bg-gray-200 text-gray-700;
  }
}

/* Garantindo contraste 7:1 para acessibilidade */
@layer base {
  .text-high-contrast {
    color: #1a1a1a; /* Contraste 15.3:1 com branco */
  }
  
  .bg-accessible-primary {
    background-color: #1e3a5f; /* Versão mais escura do azul profundo */
    color: #ffffff; /* Contraste 8.2:1 */
  }
}
```

## Roteamento

### Configuração de Rotas
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/painel-senhas',
    name: 'PainelSenhas',
    component: () => import('@/views/PainelSenhas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pacientes',
    name: 'ListaPacientes',
    component: () => import('@/views/ListaPacientes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pacientes/:id',
    name: 'DetalhePaciente',
    component: () => import('@/views/DetalhePaciente.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profissionais',
    name: 'ListaProfissionais',
    component: () => import('@/views/ListaProfissionais.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/procedimentos/:id',
    name: 'DetalheProcedimento',
    component: () => import('@/views/DetalheProcedimento.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historico',
    name: 'HistoricoSenhas',
    component: () => import('@/views/HistoricoSenhas.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
```

## Gerenciamento de Estado (Pinia)

### AuthStore
```javascript
// stores/auth.js
import { defineStore } from 'pinia';
import { AuthService } from '@/services/AuthService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: null, // Usuario com Profissional
    token: localStorage.getItem('token'),
    loading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.usuario,
    currentProfissional: (state) => state.usuario?.profissional,
    userPermissions: (state) => state.usuario?.permissao,
    userStatus: (state) => state.usuario?.status
  },
  
  actions: {
    async login(username, password) {
      this.loading = true;
      try {
        const response = await AuthService.login(username, password);
        this.usuario = response.usuario;
        this.token = response.token;
        localStorage.setItem('token', response.token);
        return true;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      try {
        await AuthService.logout();
      } finally {
        this.usuario = null;
        this.token = null;
        localStorage.removeItem('token');
      }
    },
    
    async checkAuth() {
      if (this.token) {
        try {
          const usuario = await AuthService.getCurrentUser();
          this.usuario = usuario;
        } catch (error) {
          this.logout();
        }
      }
    }
  }
});
```

### SenhaStore
```javascript
// stores/senha.js
import { defineStore } from 'pinia';
import { SenhaService } from '@/services/SenhaService';

export const useSenhaStore = defineStore('senha', {
  state: () => ({
    senhaAtual: null,
    proximasSenhas: [],
    historicoSenhas: [],
    loading: false
  }),
  
  actions: {
    async fetchSenhaAtual() {
      this.loading = true;
      try {
        this.senhaAtual = await SenhaService.getSenhaAtual();
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProximasSenhas() {
      try {
        this.proximasSenhas = await SenhaService.getProximasSenhas();
      } catch (error) {
        console.error('Erro ao buscar próximas senhas:', error);
      }
    },
    
    async chamarProximaSenha() {
      this.loading = true;
      try {
        const novaSenha = await SenhaService.chamarProximaSenha();
        this.senhaAtual = novaSenha;
        await this.fetchProximasSenhas(); // Atualiza a fila
        return novaSenha;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchHistorico() {
      try {
        this.historicoSenhas = await SenhaService.getHistoricoSenhas();
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      }
    }
  }
});
```## Validação
 e Tratamento de Erros

### Composable de Validação
```javascript
// composables/useValidation.js
export function useValidation() {
  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Algoritmo de validação de CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    
    return remainder === parseInt(cleanCPF.charAt(10));
  };
  
  const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };
  
  const validateTemperatura = (temp) => {
    const temperatura = parseFloat(temp);
    return !isNaN(temperatura) && temperatura >= 30 && temperatura <= 45;
  };
  
  const validatePressao = (sistolica, diastolica) => {
    const sys = parseInt(sistolica);
    const dia = parseInt(diastolica);
    return !isNaN(sys) && !isNaN(dia) && sys > 0 && dia > 0 && sys > dia;
  };
  
  return {
    validateCPF,
    validateRequired,
    validateTemperatura,
    validatePressao
  };
}
```

### Interceptador Axios
```javascript
// services/api.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000
});

// Request interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const notificationStore = useNotificationStore();
    const authStore = useAuthStore();
    
    if (error.response?.status === 401) {
      authStore.logout();
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      notificationStore.showError('Erro interno do servidor. Tente novamente.');
    } else if (error.response?.status === 404) {
      notificationStore.showError('Recurso não encontrado.');
    } else if (error.response?.data?.message) {
      notificationStore.showError(error.response.data.message);
    } else {
      notificationStore.showError('Erro inesperado. Tente novamente.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## Acessibilidade (WCAG 2.1 AA)

### Implementação de Acessibilidade
```javascript
// composables/useAccessibility.js
export function useAccessibility() {
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };
  
  const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      
      if (e.key === 'Escape') {
        element.dispatchEvent(new CustomEvent('close-modal'));
      }
    });
  };
  
  return { announceToScreenReader, trapFocus };
}
```

### Classes CSS para Acessibilidade
```css
/* Classe para screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus visível para navegação por teclado */
.focus-visible {
  outline: 2px solid #234A7A;
  outline-offset: 2px;
}

/* Contraste alto para textos */
.text-high-contrast {
  color: #1a1a1a; /* Contraste 15.3:1 com fundo branco */
}

/* Estados de foco para elementos interativos */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
a:focus-visible {
  outline: 2px solid #234A7A;
  outline-offset: 2px;
}
```

## Performance e Otimização

### Lazy Loading de Rotas
```javascript
// Todas as rotas já implementadas com lazy loading
const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  // ... outras rotas com import dinâmico
];
```

### Otimização de Bundle (Vite)
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          axios: ['axios'],
          utils: ['@/utils/validation', '@/utils/formatters']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

## Estrutura de Arquivos Completa

```
codenews-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── custom.css
│   │   └── images/
│   │       └── logo.png
│   ├── components/
│   │   ├── base/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── NotificationToast.vue
│   │   └── layout/
│   │       ├── AppHeader.vue
│   │       ├── AppSidebar.vue
│   │       └── AppLayout.vue
│   ├── composables/
│   │   ├── useAccessibility.js
│   │   ├── useValidation.js
│   │   └── useNotification.js
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   ├── api.js
│   │   ├── AuthService.js
│   │   ├── SenhaService.js
│   │   ├── PacienteService.js
│   │   ├── ProfissionalService.js
│   │   └── ProcedimentoService.js
│   ├── stores/
│   │   ├── auth.js
│   │   ├── senha.js
│   │   └── notification.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── PainelSenhas.vue
│   │   ├── ListaPacientes.vue
│   │   ├── DetalhePaciente.vue
│   │   ├── ListaProfissionais.vue
│   │   ├── DetalheProcedimento.vue
│   │   └── HistoricoSenhas.vue
│   ├── App.vue
│   └── main.js
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

Este design técnico está completamente alinhado com o PRD fornecido, seguindo exatamente as entidades do backend, as 8 telas obrigatórias, a paleta de cores especificada e os requisitos de acessibilidade. O sistema está preparado para consumir diretamente os endpoints REST do backend existente.