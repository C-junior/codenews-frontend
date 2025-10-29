import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/css/custom.css'

// Performance monitoring
if (typeof performance !== 'undefined' && performance.mark) {
  performance.mark('vue-app-start')
}

// Create Vue app
const app = createApp(App)

// Configure Pinia
const pinia = createPinia()

// Development plugins
if (import.meta.env.DEV) {
  // Add development-only plugins here if needed
}

// Use plugins
app.use(pinia)
app.use(router)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
  
  // In production, you might want to send errors to a logging service
  if (import.meta.env.PROD) {
    // Example: sendErrorToLoggingService(err, info)
  }
}

// Global warning handler (development only)
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Vue warning:', msg, trace)
  }
}

// Mount app
const mountedApp = app.mount('#app')

// Performance tracking
if (typeof performance !== 'undefined' && performance.mark) {
  performance.mark('vue-app-mounted')
  performance.measure('vue-app-init', 'vue-app-start', 'vue-app-mounted')
  
  // Log performance in development
  if (import.meta.env.DEV) {
    const measure = performance.getEntriesByName('vue-app-init')[0]
    if (measure) {
      console.log(`🚀 Vue app initialized in ${measure.duration.toFixed(2)}ms`)
    }
  }
}

// Remove loading screen
setTimeout(() => {
  document.body.classList.add('app-ready')
}, 100)

// Enable performance monitoring
if (import.meta.env.PROD) {
  import('./utils/performance.js').then(({ observeWebVitals, enableResourceCache }) => {
    observeWebVitals()
    enableResourceCache()
  })
}

export default mountedApp
