<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        @click="handleBackdropClick"
        @keydown.esc="handleEscape"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <!-- Modal container -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="show"
              ref="modalRef"
              :class="modalClasses"
              @click.stop
            >
              <!-- Header -->
              <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-200">
                <div class="flex items-center">
                  <h3 id="modal-title" class="text-lg font-semibold text-gray-900">
                    <slot name="header">{{ title }}</slot>
                  </h3>
                </div>
                <button
                  type="button"
                  class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-azul-profundo focus:ring-offset-2"
                  @click="handleClose"
                >
                  <span class="sr-only">Fechar modal</span>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Body -->
              <div class="p-6">
                <slot />
              </div>
              
              <!-- Footer -->
              <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'opened', 'closed'])

const modalRef = ref(null)
const { trapFocus, announceToScreenReader } = useAccessibility()
let removeFocusTrap = null

// Classes do modal baseadas no tamanho
const modalClasses = computed(() => {
  const baseClasses = 'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all'
  
  const sizeClasses = {
    small: 'sm:my-8 sm:w-full sm:max-w-sm',
    medium: 'sm:my-8 sm:w-full sm:max-w-lg',
    large: 'sm:my-8 sm:w-full sm:max-w-2xl',
    full: 'sm:my-8 sm:w-full sm:max-w-6xl'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]}`
})

// Manipula evento de escape do trap de foco
const handleEscapeFromTrap = () => {
  if (props.closeOnEscape && props.closable) {
    handleClose()
  }
}

// Manipula clique no backdrop
const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && props.closable && event.target === event.currentTarget) {
    handleClose()
  }
}

// Manipula tecla ESC
const handleEscape = () => {
  if (props.closeOnEscape && props.closable) {
    handleClose()
  }
}

// Fecha o modal
const handleClose = () => {
  if (props.closable) {
    emit('close')
  }
}

// Configura trap de foco quando o modal abre
const setupFocusTrap = async () => {
  await nextTick()
  if (modalRef.value) {
    // Adiciona listener para evento de escape
    modalRef.value.addEventListener('escape-pressed', handleEscapeFromTrap)
    
    // Configura trap de foco
    removeFocusTrap = trapFocus(modalRef.value)
    
    // Anuncia abertura do modal para screen readers
    if (props.title) {
      announceToScreenReader(`Modal aberto: ${props.title}`)
    } else {
      announceToScreenReader('Modal aberto')
    }
  }
}

// Remove trap de foco quando o modal fecha
const removeFocusTrapAndCleanup = () => {
  if (modalRef.value) {
    modalRef.value.removeEventListener('escape-pressed', handleEscapeFromTrap)
  }
  
  if (removeFocusTrap) {
    removeFocusTrap()
    removeFocusTrap = null
  }
  
  // Anuncia fechamento do modal para screen readers
  announceToScreenReader('Modal fechado')
}

// Observa mudanças na prop show
watch(() => props.show, async (newValue) => {
  if (newValue) {
    await setupFocusTrap()
    emit('opened')
  } else {
    removeFocusTrapAndCleanup()
    emit('closed')
  }
})

// Cleanup ao desmontar o componente
onUnmounted(() => {
  removeFocusTrapAndCleanup()
})
</script>