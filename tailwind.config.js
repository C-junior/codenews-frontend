/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    // Breakpoints responsivos de 320px a 1920px
    screens: {
      'xs': '320px',   // Extra small devices
      'sm': '640px',   // Small devices
      'md': '768px',   // Medium devices
      'lg': '1024px',  // Large devices
      'xl': '1280px',  // Extra large devices
      '2xl': '1536px', // 2X large devices
      '3xl': '1920px'  // Ultra wide devices
    },
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
        // Tamanhos responsivos mobile-first
        'titulo-principal': ['clamp(24px, 5vw, 48px)', { lineHeight: '1.2', fontWeight: '700' }],
        'titulo-secundario': ['clamp(20px, 4vw, 32px)', { lineHeight: '1.3', fontWeight: '600' }],
        'subtitulo': ['clamp(18px, 3vw, 24px)', { lineHeight: '1.4', fontWeight: '500' }],
        'texto-base': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'texto-grande': ['clamp(16px, 2.5vw, 20px)', { lineHeight: '1.5', fontWeight: '400' }]
      },
      spacing: {
        // Espaçamentos responsivos
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)'
      },
      maxWidth: {
        // Larguras máximas para diferentes breakpoints
        'xs': '20rem',
        'container-xs': '100%',
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
        'container-3xl': '1920px'
      }
    }
  },
  plugins: []
}

