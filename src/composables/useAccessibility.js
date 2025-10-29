import { nextTick, onMounted, onUnmounted, ref } from 'vue'

/**
 * Composable para funcionalidades de acessibilidade WCAG 2.1 AA
 * Implementa anúncios para screen readers e trap de foco para modais
 */
export function useAccessibility() {
  const announcements = ref([])
  const focusHistory = ref([])

  /**
   * Anuncia uma mensagem para screen readers
   * @param {string} message - Mensagem a ser anunciada
   * @param {string} priority - Prioridade do anúncio ('polite' ou 'assertive')
   * @param {number} delay - Delay antes de remover o anúncio (ms)
   */
  const announceToScreenReader = (message, priority = 'polite', delay = 1000) => {
    if (!message || typeof message !== 'string') {
      console.warn('useAccessibility: Mensagem inválida para anúncio')
      return
    }

    // Cria elemento de anúncio
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    // Adiciona ao DOM
    document.body.appendChild(announcement)

    // Remove após o delay especificado
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, delay)

    // Adiciona ao histórico de anúncios
    announcements.value.push({
      message,
      priority,
      timestamp: new Date()
    })

    // Mantém apenas os últimos 10 anúncios
    if (announcements.value.length > 10) {
      announcements.value.shift()
    }
  }

  /**
   * Anuncia uma mensagem de sucesso
   * @param {string} message - Mensagem de sucesso
   */
  const announceSuccess = (message) => {
    announceToScreenReader(`Sucesso: ${message}`, 'polite')
  }

  /**
   * Anuncia uma mensagem de erro
   * @param {string} message - Mensagem de erro
   */
  const announceError = (message) => {
    announceToScreenReader(`Erro: ${message}`, 'assertive')
  }

  /**
   * Anuncia uma mudança de página/rota
   * @param {string} pageName - Nome da página
   */
  const announcePageChange = (pageName) => {
    announceToScreenReader(`Navegou para ${pageName}`, 'polite')
  }

  /**
   * Anuncia carregamento de dados
   */
  const announceLoading = () => {
    announceToScreenReader('Carregando dados, aguarde...', 'polite')
  }

  /**
   * Anuncia conclusão de carregamento
   */
  const announceLoadingComplete = () => {
    announceToScreenReader('Dados carregados com sucesso', 'polite')
  }

  /**
   * Obtém todos os elementos focáveis dentro de um container
   * @param {HTMLElement} container - Container para buscar elementos focáveis
   * @returns {HTMLElement[]} Array de elementos focáveis
   */
  const getFocusableElements = (container = document) => {
    const focusableSelectors = [
      'button:not([disabled]):not([aria-hidden="true"])',
      '[href]:not([disabled]):not([aria-hidden="true"])',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
      'select:not([disabled]):not([aria-hidden="true"])',
      'textarea:not([disabled]):not([aria-hidden="true"])',
      '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])',
      '[contenteditable]:not([disabled]):not([aria-hidden="true"])'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        // Verifica se o elemento está visível
        const style = window.getComputedStyle(element)
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               element.offsetParent !== null
      })
  }

  /**
   * Implementa trap de foco para modais e outros containers
   * @param {HTMLElement} container - Container para aplicar o trap de foco
   * @returns {Function} Função para remover o trap de foco
   */
  const trapFocus = (container) => {
    if (!container) {
      console.warn('useAccessibility: Container inválido para trap de foco')
      return () => {}
    }

    const focusableElements = getFocusableElements(container)
    
    if (focusableElements.length === 0) {
      console.warn('useAccessibility: Nenhum elemento focável encontrado no container')
      return () => {}
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Salva o elemento ativo antes do trap
    const previousActiveElement = document.activeElement
    focusHistory.value.push(previousActiveElement)

    // Foca no primeiro elemento
    firstElement.focus()

    // Handler para trap de foco
    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab - foco para trás
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab - foco para frente
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      } else if (event.key === 'Escape') {
        // ESC - sai do trap e dispara evento customizado
        event.preventDefault()
        container.dispatchEvent(new CustomEvent('escape-pressed', {
          bubbles: true,
          detail: { originalEvent: event }
        }))
      }
    }

    // Adiciona listener
    container.addEventListener('keydown', handleKeyDown)

    // Função para remover o trap
    const removeTrap = () => {
      container.removeEventListener('keydown', handleKeyDown)
      
      // Restaura o foco anterior
      const previousElement = focusHistory.value.pop()
      if (previousElement && typeof previousElement.focus === 'function') {
        try {
          previousElement.focus()
        } catch (error) {
          console.warn('useAccessibility: Erro ao restaurar foco:', error)
        }
      }
    }

    return removeTrap
  }

  /**
   * Foca no primeiro elemento focável de um container
   * @param {HTMLElement} container - Container para buscar o primeiro elemento focável
   * @param {number} delay - Delay antes de focar (ms)
   */
  const focusFirstElement = async (container = document, delay = 0) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    await nextTick()

    const focusableElements = getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }

  /**
   * Foca em um elemento específico com tratamento de erro
   * @param {HTMLElement|string} elementOrSelector - Elemento ou seletor CSS
   * @param {number} delay - Delay antes de focar (ms)
   */
  const focusElement = async (elementOrSelector, delay = 0) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    await nextTick()

    let element
    if (typeof elementOrSelector === 'string') {
      element = document.querySelector(elementOrSelector)
    } else {
      element = elementOrSelector
    }

    if (element && typeof element.focus === 'function') {
      try {
        element.focus()
      } catch (error) {
        console.warn('useAccessibility: Erro ao focar elemento:', error)
      }
    } else {
      console.warn('useAccessibility: Elemento não encontrado ou não focável:', elementOrSelector)
    }
  }

  /**
   * Adiciona atributos ARIA a um elemento
   * @param {HTMLElement} element - Elemento para adicionar atributos
   * @param {Object} attributes - Objeto com atributos ARIA
   */
  const setAriaAttributes = (element, attributes) => {
    if (!element || !attributes) {
      console.warn('useAccessibility: Elemento ou atributos inválidos')
      return
    }

    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`
      element.setAttribute(ariaKey, value)
    })
  }

  /**
   * Cria um ID único para associações ARIA
   * @param {string} prefix - Prefixo para o ID
   * @returns {string} ID único
   */
  const generateAriaId = (prefix = 'aria') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Verifica se o usuário prefere movimento reduzido
   * @returns {boolean} True se prefere movimento reduzido
   */
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Verifica se o usuário prefere alto contraste
   * @returns {boolean} True se prefere alto contraste
   */
  const prefersHighContrast = () => {
    return window.matchMedia('(prefers-contrast: high)').matches
  }

  /**
   * Adiciona skip link para navegação por teclado
   * @param {string} targetSelector - Seletor do elemento de destino
   * @param {string} text - Texto do skip link
   */
  const addSkipLink = (targetSelector, text = 'Pular para o conteúdo principal') => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetSelector.replace('#', '')}`
    skipLink.textContent = text
    skipLink.className = 'sr-only sr-only-focusable'
    skipLink.style.position = 'absolute'
    skipLink.style.top = '0'
    skipLink.style.left = '0'
    skipLink.style.zIndex = '9999'

    skipLink.addEventListener('click', (event) => {
      event.preventDefault()
      const target = document.querySelector(targetSelector)
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })

    document.body.insertBefore(skipLink, document.body.firstChild)
  }

  // Cleanup ao desmontar
  onUnmounted(() => {
    // Remove todos os anúncios pendentes
    const ariaLiveElements = document.querySelectorAll('.sr-only[aria-live]')
    ariaLiveElements.forEach(element => {
      if (document.body.contains(element)) {
        document.body.removeChild(element)
      }
    })
  })

  return {
    // Anúncios para screen readers
    announceToScreenReader,
    announceSuccess,
    announceError,
    announcePageChange,
    announceLoading,
    announceLoadingComplete,
    
    // Gerenciamento de foco
    trapFocus,
    focusFirstElement,
    focusElement,
    getFocusableElements,
    
    // Utilitários ARIA
    setAriaAttributes,
    generateAriaId,
    
    // Preferências do usuário
    prefersReducedMotion,
    prefersHighContrast,
    
    // Navegação
    addSkipLink,
    
    // Estado
    announcements: announcements.value,
    focusHistory: focusHistory.value
  }
}