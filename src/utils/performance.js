/**
 * Utilitários para monitoramento e otimização de performance
 */

// Métricas de performance
export const performanceMetrics = {
  // Marca o início de uma operação
  mark(name) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`)
    }
  },

  // Marca o fim de uma operação e calcula a duração
  measure(name) {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
      
      const measure = performance.getEntriesByName(name)[0]
      if (measure && import.meta.env.DEV) {
        console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`)
      }
      
      return measure?.duration
    }
    return 0
  },

  // Limpa métricas antigas
  clear(name) {
    if (typeof performance !== 'undefined') {
      performance.clearMarks(`${name}-start`)
      performance.clearMarks(`${name}-end`)
      performance.clearMeasures(name)
    }
  }
}

// Lazy loading de imagens
export function lazyLoadImage(img, src) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = src
          entry.target.classList.remove('lazy')
          observer.unobserve(entry.target)
        }
      })
    })
    
    observer.observe(img)
  } else {
    // Fallback para browsers sem IntersectionObserver
    img.src = src
  }
}

// Debounce para otimizar eventos frequentes
export function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle para limitar execução de funções
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Preload de recursos críticos
export function preloadResource(href, as = 'script', crossorigin = null) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (crossorigin) link.crossOrigin = crossorigin
  
  document.head.appendChild(link)
  
  return new Promise((resolve, reject) => {
    link.onload = resolve
    link.onerror = reject
  })
}

// Monitora Core Web Vitals
export function observeWebVitals() {
  if (import.meta.env.PROD && 'PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      console.log('CLS:', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Otimização de bundle size
export function analyzeBundle() {
  if (import.meta.env.DEV) {
    // Analisa o tamanho dos chunks carregados
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          console.log(`📦 ${entry.name}: ${(entry.transferSize / 1024).toFixed(2)}KB`)
        }
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }
}

// Cache de recursos com Service Worker (se disponível)
export function enableResourceCache() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado:', registration)
        })
        .catch(error => {
          console.log('SW falhou:', error)
        })
    })
  }
}