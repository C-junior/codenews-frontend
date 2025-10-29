<template>
  <div :class="containerClasses" role="status" :aria-label="ariaLabel">
    <svg
      :class="spinnerClasses"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    
    <span v-if="showText" :class="textClasses">
      {{ text }}
    </span>
    
    <!-- Screen reader text -->
    <span class="sr-only">{{ ariaLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'gray'].includes(value)
  },
  text: {
    type: String,
    default: 'Carregando...'
  },
  showText: {
    type: Boolean,
    default: false
  },
  centered: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const ariaLabel = computed(() => {
  return props.text || 'Carregando conteúdo'
})

const containerClasses = computed(() => {
  const baseClasses = 'flex items-center'
  
  let classes = [baseClasses]
  
  if (props.centered) {
    classes.push('justify-center')
  }
  
  if (props.showText) {
    classes.push('gap-3')
  }
  
  if (props.overlay) {
    classes.push('fixed inset-0 bg-white bg-opacity-75 z-50 flex-col')
  }
  
  return classes.join(' ')
})

const spinnerClasses = computed(() => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  }
  
  const colorClasses = {
    primary: 'text-azul-profundo',
    secondary: 'text-verde-medicina',
    white: 'text-white',
    gray: 'text-gray-500'
  }
  
  return `animate-spin ${sizeClasses[props.size]} ${colorClasses[props.color]}`
})

const textClasses = computed(() => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }
  
  const colorClasses = {
    primary: 'text-azul-profundo',
    secondary: 'text-verde-medicina',
    white: 'text-white',
    gray: 'text-gray-600'
  }
  
  return `font-medium ${sizeClasses[props.size]} ${colorClasses[props.color]}`
})
</script>