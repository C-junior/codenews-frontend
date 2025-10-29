/**
 * Composable para monitoramento de performance
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function usePerformance() {
  const metrics = ref({
    loadTime: 0,
    renderTime: 0,
    chunkLoadTimes: [],
    memoryUsage: null
  })

  let performanceObserver = null
  let startTime = performance.now()

  // Monitora carregamento de chunks
  const trackChunkLoading = () => {
    if ('PerformanceObserver' in window) {
      performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name.includes('.js') && entry.name.includes('assets')) {
            metrics.value.chunkLoadTimes.push({
              name: entry.name.split('/').pop(),
              duration: entry.duration,
              size: entry.transferSize || 0
            })
          }
        })
      })
      
      performanceObserver.observe({ entryTypes: ['resource'] })
    }
  }

  // Monitora uso de memória
  const trackMemoryUsage = () => {
    if ('memory' in performance) {
      metrics.value.memoryUsage = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
  }

  // Marca o tempo de renderização do componente
  const markRenderComplete = () => {
    metrics.value.renderTime = performance.now() - startTime
  }

  // Monitora Core Web Vitals
  const trackWebVitals = () => {
    if (import.meta.env.PROD && 'PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`)
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          const fid = entry.processingStart - entry.startTime
          console.log(`📊 FID: ${fid.toFixed(2)}ms`)
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
        console.log(`📊 CLS: ${clsValue.toFixed(4)}`)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }

  // Relatório de performance
  const getPerformanceReport = () => {
    const report = {
      ...metrics.value,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    }

    if (import.meta.env.DEV) {
      console.table(report.chunkLoadTimes)
      console.log('📊 Performance Report:', report)
    }

    return report
  }

  onMounted(() => {
    metrics.value.loadTime = performance.now()
    trackChunkLoading()
    trackMemoryUsage()
    trackWebVitals()
    
    // Atualiza métricas de memória periodicamente em desenvolvimento
    if (import.meta.env.DEV) {
      const memoryInterval = setInterval(trackMemoryUsage, 5000)
      onUnmounted(() => clearInterval(memoryInterval))
    }
  })

  onUnmounted(() => {
    if (performanceObserver) {
      performanceObserver.disconnect()
    }
  })

  return {
    metrics,
    markRenderComplete,
    getPerformanceReport,
    trackMemoryUsage
  }
}

// Utilitário para lazy loading otimizado
export function useLazyLoading() {
  const loadComponent = async (importFn, fallback = null) => {
    try {
      const startTime = performance.now()
      const component = await importFn()
      const loadTime = performance.now() - startTime
      
      if (import.meta.env.DEV) {
        console.log(`🔄 Component loaded in ${loadTime.toFixed(2)}ms`)
      }
      
      return component
    } catch (error) {
      console.error('❌ Failed to load component:', error)
      return fallback || { template: '<div>Erro ao carregar componente</div>' }
    }
  }

  const preloadRoute = async (routeComponent) => {
    if (typeof routeComponent === 'function') {
      try {
        await routeComponent()
        if (import.meta.env.DEV) {
          console.log('✅ Route preloaded successfully')
        }
      } catch (error) {
        console.warn('⚠️ Failed to preload route:', error)
      }
    }
  }

  return {
    loadComponent,
    preloadRoute
  }
}

// Utilitário para otimização de imagens
export function useImageOptimization() {
  const createOptimizedImageUrl = (src, width, height, format = 'webp') => {
    // Em produção, poderia integrar com um serviço de otimização de imagens
    if (import.meta.env.PROD) {
      // Exemplo: return `${src}?w=${width}&h=${height}&f=${format}`
      return src
    }
    return src
  }

  const lazyLoadImage = (img, src, options = {}) => {
    const {
      threshold = 0.1,
      rootMargin = '50px',
      placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGM0Y3RkEiLz48L3N2Zz4='
    } = options

    // Define placeholder inicial
    img.src = placeholder
    img.classList.add('lazy-loading')

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const targetImg = entry.target
            targetImg.src = src
            targetImg.classList.remove('lazy-loading')
            targetImg.classList.add('lazy-loaded')
            observer.unobserve(targetImg)
          }
        })
      }, { threshold, rootMargin })
      
      observer.observe(img)
    } else {
      // Fallback para browsers sem IntersectionObserver
      img.src = src
      img.classList.remove('lazy-loading')
      img.classList.add('lazy-loaded')
    }
  }

  return {
    createOptimizedImageUrl,
    lazyLoadImage
  }
}