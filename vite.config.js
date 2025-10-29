import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const isDevelopment = mode === 'development'
  
  return {
    plugins: [
      vue({
        // Otimizações para produção
        template: {
          compilerOptions: {
            // Remove comentários em produção
            comments: !isProduction,
            // Otimiza whitespace em produção
            whitespace: isProduction ? 'condense' : 'preserve'
          }
        }
      }),
      // Só inclui devtools em desenvolvimento
      ...(isDevelopment ? [vueDevTools()] : []),
    ],
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    
    // Configurações de build otimizadas
    build: {
      // Tamanho máximo de chunk em KB (500KB)
      chunkSizeWarningLimit: 500,
      
      // Otimizações de minificação
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          // Remove console.log em produção
          drop_console: env.VITE_DROP_CONSOLE === 'true',
          drop_debugger: true,
          // Remove código morto
          dead_code: true,
          // Otimiza condicionais
          conditionals: true,
          // Remove funções não utilizadas
          unused: true,
          // Otimiza loops
          loops: true,
          // Otimiza comparações
          comparisons: true,
          // Inline funções pequenas
          inline: 2
        },
        mangle: {
          // Preserva nomes de classes para debugging se necessário
          keep_classnames: false,
          // Preserva nomes de funções se necessário para debugging
          keep_fnames: false
        },
        format: {
          // Remove comentários
          comments: false
        }
      } : {},
      
      // Configurações do Rollup para code splitting otimizado
      rollupOptions: {
        // Otimizações de input
        treeshake: {
          // Remove código não utilizado mais agressivamente
          moduleSideEffects: (id) => {
            // Preserva side effects para CSS e arquivos de estilo
            return id.includes('.css') || id.includes('.scss') || id.includes('.sass') || id.includes('.less')
          },
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        },
        
        output: {
          // Estratégia de chunking manual para melhor cache
          manualChunks: (id) => {
            // Vendor chunks - bibliotecas principais
            if (id.includes('node_modules')) {
              // Vue ecosystem (chunk principal)
              if (id.includes('vue') && !id.includes('vue-router') && !id.includes('vue-devtools')) {
                return 'vue-core'
              }
              // Vue Router (separado para lazy loading)
              if (id.includes('vue-router')) {
                return 'vue-router'
              }
              // Pinia (gerenciamento de estado)
              if (id.includes('pinia')) {
                return 'pinia'
              }
              // HTTP client
              if (id.includes('axios')) {
                return 'axios'
              }
              // CSS frameworks
              if (id.includes('tailwindcss') || id.includes('postcss') || id.includes('autoprefixer')) {
                return 'css-vendor'
              }
              // Outras dependências pequenas
              return 'vendor'
            }
            
            // App chunks - código da aplicação
            // Services (API calls)
            if (id.includes('/services/')) {
              return 'services'
            }
            // Stores (estado da aplicação)
            if (id.includes('/stores/')) {
              return 'stores'
            }
            // Composables (lógica reutilizável)
            if (id.includes('/composables/')) {
              return 'composables'
            }
            // Components base (reutilizáveis)
            if (id.includes('/components/base/')) {
              return 'base-components'
            }
            // Outros components
            if (id.includes('/components/')) {
              return 'components'
            }
            // Utils (utilitários)
            if (id.includes('/utils/')) {
              return 'utils'
            }
          },
          
          // Nomeação de arquivos para melhor cache busting
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId && facadeModuleId.includes('/views/')) {
              // Views mantêm nomes específicos para debugging
              return 'assets/views/[name]-[hash].js'
            }
            return 'assets/js/[name]-[hash].js'
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // Organiza assets por tipo
            if (/\.(css)$/.test(assetInfo.name)) {
              return 'assets/css/[name]-[hash].[ext]'
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return 'assets/images/[name]-[hash].[ext]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return 'assets/fonts/[name]-[hash].[ext]'
            }
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(assetInfo.name)) {
              return 'assets/media/[name]-[hash].[ext]'
            }
            return 'assets/[name]-[hash].[ext]'
          },
          
          // Configurações de compressão
          compact: isProduction,
          
          // Configurações de sourcemap
          sourcemap: env.VITE_SOURCE_MAPS === 'true'
        }
      },
      
      // Configurações de sourcemap
      sourcemap: env.VITE_SOURCE_MAPS === 'true',
      
      // Otimizações de CSS
      cssCodeSplit: isProduction, // Só faz code splitting em produção
      cssMinify: isProduction,
      
      // Configurações de assets
      assetsInlineLimit: 4096, // 4KB - inline assets menores
      
      // Configurações de output
      outDir: 'dist',
      emptyOutDir: true,
      
      // Configurações de target
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      
      // Configurações de polyfills
      polyfillModulePreload: true
    },
    
    // Configurações de desenvolvimento
    server: {
      port: 3000,
      host: true, // Permite acesso externo
      open: false, // Não abre automaticamente o browser
      strictPort: true, // Falha se a porta estiver ocupada
      
      // Proxy para API
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          // Logs de proxy em desenvolvimento
          configure: (proxy) => {
            if (isDevelopment) {
              proxy.on('error', (err) => {
                console.log('Proxy error:', err.message)
              })
              proxy.on('proxyReq', (proxyReq, req) => {
                console.log('Proxying request:', req.method, req.url)
              })
            }
          }
        }
      },
      
      // Configurações de HMR
      hmr: {
        overlay: true, // Mostra erros na tela
        port: 24678 // Porta específica para HMR
      },
      
      // Configurações de headers de segurança para desenvolvimento
      headers: {}
    },
    
    // Configurações de preview (produção local)
    preview: {
      port: 4173,
      host: true,
      open: false
    },
    
    // Otimizações de dependências
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios'
      ],
      exclude: [
        // Exclui dependências que não precisam de pré-bundling
        'vue-devtools'
      ],
      // Força re-otimização em mudanças apenas se necessário
      force: false
    },
    
    // Configurações de CSS
    css: {
      devSourcemap: isDevelopment,
      preprocessorOptions: {
        // Configurações para preprocessadores se necessário
      }
      // PostCSS é carregado automaticamente do postcss.config.js
    },
    
    // Configurações de definições globais
    define: {
      __VUE_OPTIONS_API__: false, // Desabilita Options API se não usado
      __VUE_PROD_DEVTOOLS__: !isProduction, // DevTools apenas em dev
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: !isProduction,
      // Variáveis globais da aplicação
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV__: isDevelopment,
      __PROD__: isProduction
    },
    
    // Configurações de worker
    worker: {
      format: 'es'
    },
    
    // Configurações de experimentais (removidas para evitar problemas)
    // experimental: {},
    
    // Configurações de logging
    logLevel: env.VITE_LOG_LEVEL || (isDevelopment ? 'info' : 'warn'),
    
    // Configurações de clear screen
    clearScreen: isDevelopment
  }
})
