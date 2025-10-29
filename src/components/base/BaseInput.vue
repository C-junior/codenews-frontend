<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="inputId" 
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" aria-label="campo obrigatório">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="displayValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :step="step"
        :class="inputClasses"
        :maxlength="mask === 'cpf' ? 14 : undefined"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="!!error"
        :aria-required="required"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <!-- Ícone de erro -->
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg 
          class="h-5 w-5 text-red-500" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <!-- Mensagem de erro -->
    <p 
      v-if="error" 
      :id="errorId"
      class="mt-2 text-sm text-red-600 error-message"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
    
    <!-- Texto de ajuda -->
    <p 
      v-else-if="helpText" 
      :id="helpId"
      class="mt-2 text-sm text-gray-500"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility.js'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'password', 'email', 'tel', 'number'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  mask: {
    type: String,
    default: '',
    validator: (value) => ['', 'cpf'].includes(value)
  },
  step: {
    type: [String, Number],
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const { generateAriaId } = useAccessibility()

// Gera IDs únicos para acessibilidade
const inputId = ref(generateAriaId('input'))
const errorId = ref(generateAriaId('error'))
const helpId = ref(generateAriaId('help'))

// Função para aplicar máscara de CPF
const applyCpfMask = (value) => {
  const cleanValue = value.replace(/\D/g, '')
  
  if (cleanValue.length <= 3) {
    return cleanValue
  } else if (cleanValue.length <= 6) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`
  } else if (cleanValue.length <= 9) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`
  } else {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`
  }
}

// Valor exibido com máscara aplicada
const displayValue = computed(() => {
  if (props.mask === 'cpf' && props.modelValue) {
    return applyCpfMask(props.modelValue.toString())
  }
  return props.modelValue
})

// Manipula entrada do usuário
const handleInput = (event) => {
  let value = event.target.value
  
  if (props.mask === 'cpf') {
    // Remove formatação e mantém apenas números
    const cleanValue = value.replace(/\D/g, '')
    emit('update:modelValue', cleanValue)
  } else {
    emit('update:modelValue', value)
  }
}

// Classes do input com acessibilidade aprimorada
const inputClasses = computed(() => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-colors duration-200 text-base focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]'
  
  if (props.error) {
    return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`
  }
  
  return `${baseClasses} border-gray-300 focus:ring-azul-profundo focus:border-azul-profundo`
})

// Classes do label com contraste acessível
const labelClasses = computed(() => {
  const baseClasses = 'block text-sm font-medium mb-2'
  
  if (props.required) {
    return `${baseClasses} text-accessible-primary required-field`
  }
  
  return `${baseClasses} text-accessible-primary`
})

// Atributo aria-describedby para associar mensagens de ajuda/erro
const ariaDescribedBy = computed(() => {
  const ids = []
  
  if (props.error) {
    ids.push(errorId.value)
  } else if (props.helpText) {
    ids.push(helpId.value)
  }
  
  return ids.length > 0 ? ids.join(' ') : undefined
})
</script>