<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 translate-x-1/2"
      enter-to-class="opacity-100 translate-y-0 translate-x-1/2"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 translate-x-1/2"
      leave-to-class="opacity-0 translate-y-2 translate-x-1/2"
    >
      <div
        v-if="show"
        :class="toastClasses"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <!-- Ícone -->
        <div class="flex-shrink-0">
          <component :is="iconComponent" :class="iconClasses" />
        </div>
        
        <!-- Conteúdo -->
        <div class="flex-1 min-w-0">
          <p v-if="title" :class="titleClasses">
            {{ title }}
          </p>
          <p :class="messageClasses">
            {{ message }}
          </p>
        </div>
        
        <!-- Botão de fechar -->
        <div class="flex-shrink-0">
          <button
            type="button"
            :class="closeButtonClasses"
            @click="handleClose"
          >
            <span class="sr-only">Fechar notificação</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Barra de progresso para auto-dismiss -->
        <div
          v-if="autoClose && duration > 0"
          class="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all ease-linear"
          :style="{ width: progressWidth + '%', transitionDuration: duration + 'ms' }"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 3000
  },
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'].includes(value)
  }
})

const emit = defineEmits(['close'])

const progressWidth = ref(100)
let timer = null
let progressTimer = null

// Componentes de ícone baseados no tipo
const iconComponent = computed(() => {
  const icons = {
    success: 'CheckCircleIcon',
    error: 'XCircleIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon'
  }
  return icons[props.type]
})

// Classes do toast baseadas na posição
const toastClasses = computed(() => {
  const baseClasses = 'fixed z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
  
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
  }
  
  const typeClasses = {
    success: 'border-l-4 border-verde-medicina',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-azul-profundo'
  }
  
  return `${baseClasses} ${positionClasses[props.position]} ${typeClasses[props.type]} p-4 flex items-start gap-3 relative`
})

// Classes do ícone baseadas no tipo
const iconClasses = computed(() => {
  const colorClasses = {
    success: 'text-verde-medicina',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-azul-profundo'
  }
  
  return `h-6 w-6 ${colorClasses[props.type]}`
})

// Classes do título
const titleClasses = computed(() => {
  return 'text-sm font-semibold text-gray-900 mb-1'
})

// Classes da mensagem
const messageClasses = computed(() => {
  return 'text-sm text-gray-700'
})

// Classes do botão de fechar
const closeButtonClasses = computed(() => {
  return 'inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-azul-profundo focus:ring-offset-2 rounded-md p-1'
})

// Fecha o toast
const handleClose = () => {
  clearTimers()
  emit('close')
}

// Limpa os timers
const clearTimers = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

// Inicia o timer de auto-close
const startAutoClose = () => {
  if (!props.autoClose || props.duration <= 0) return
  
  // Timer para fechar automaticamente
  timer = setTimeout(() => {
    if (props.type === 'success') {
      handleClose()
    }
    // Erros requerem dispensação manual
  }, props.duration)
  
  // Timer para atualizar a barra de progresso
  const interval = 50
  const steps = props.duration / interval
  let currentStep = 0
  
  progressTimer = setInterval(() => {
    currentStep++
    progressWidth.value = 100 - (currentStep / steps) * 100
    
    if (currentStep >= steps) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }, interval)
}

// Observa mudanças na prop show
watch(() => props.show, (newValue) => {
  if (newValue) {
    progressWidth.value = 100
    startAutoClose()
  } else {
    clearTimers()
  }
})

// Cleanup ao desmontar
onUnmounted(() => {
  clearTimers()
})
</script>

<script>
// Componentes de ícone inline para evitar dependências externas
const CheckCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
  `
}

const XCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    </svg>
  `
}

const ExclamationTriangleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
  `
}

const InformationCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>
  `
}

export default {
  components: {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
  }
}
</script>