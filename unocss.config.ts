import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      // Surface
      surface: '#0b1326',
      'surface-dim': '#0b1326',
      'surface-bright': '#31394d',
      'surface-container-lowest': '#060e20',
      'surface-container-low': '#131b2e',
      'surface-container': '#171f33',
      'surface-container-high': '#222a3d',
      'surface-container-highest': '#2d3449',
      'surface-tint': '#3cddc7',
      'surface-variant': '#2d3449',

      // On Surface
      'on-surface': '#dae2fd',
      'on-surface-variant': '#bacac5',

      // Inverse
      'inverse-surface': '#dae2fd',
      'inverse-on-surface': '#283044',
      'inverse-primary': '#006b5f',

      // Outline
      outline: '#859490',
      'outline-variant': '#3c4a46',

      // Primary
      primary: '#57f1db',
      'on-primary': '#003731',
      'primary-container': '#2dd4bf',
      'on-primary-container': '#00574d',
      'primary-fixed': '#62fae3',
      'primary-fixed-dim': '#3cddc7',
      'on-primary-fixed': '#00201c',
      'on-primary-fixed-variant': '#005047',

      // Secondary
      secondary: '#a4c9ff',
      'on-secondary': '#00315d',
      'secondary-container': '#0267b8',
      'on-secondary-container': '#d6e5ff',
      'secondary-fixed': '#d4e3ff',
      'secondary-fixed-dim': '#a4c9ff',
      'on-secondary-fixed': '#001c39',
      'on-secondary-fixed-variant': '#004883',

      // Tertiary
      tertiary: '#ffd1aa',
      'on-tertiary': '#4b2800',
      'tertiary-container': '#ffac5a',
      'on-tertiary-container': '#744000',
      'tertiary-fixed': '#ffdcc0',
      'tertiary-fixed-dim': '#ffb875',
      'on-tertiary-fixed': '#2d1600',
      'on-tertiary-fixed-variant': '#6b3b00',

      // Error
      error: '#ffb4ab',
      'on-error': '#690005',
      'error-container': '#93000a',
      'on-error-container': '#ffdad6',

      // Background
      background: '#0b1326',
      'on-background': '#dae2fd',
    },
    borderRadius: {
      DEFAULT: '0.25rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px',
    },
    spacing: {
      'item-padding': '0.875rem',
      'stack-gap': '0.75rem',
      'container-padding': '1rem',
      'inner-gap': '0.5rem',
    },
    fontFamily: {
      'body-sm': ['Inter', 'system-ui', 'sans-serif'],
      'body-md': ['Inter', 'system-ui', 'sans-serif'],
      'label-sm': ['Inter', 'system-ui', 'sans-serif'],
      'label-lg': ['Inter', 'system-ui', 'sans-serif'],
      'headline-md': ['Inter', 'system-ui', 'sans-serif'],
      'mono-sm': ['JetBrains Mono', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
      'mono-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      'label-sm': ['11px', { lineHeight: '14px', fontWeight: '500' }],
      'label-lg': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
      'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
      'headline-md': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '600' }],
    },
  },
  preflights: [
    {
      getCSS: () => `
        /* Глобальний ресет для Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #3c4a46 transparent;
        }

        /* Жорстка стилізація для Chromium (Chrome Extensions) */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #2d3449;
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #3c4a46;
        }
        ::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }

        /* Точечний форс для твого тегу <main> та контейнерів з класом custom-scrollbar */
        main.custom-scrollbar::-webkit-scrollbar,
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px !important;
        }
        main.custom-scrollbar::-webkit-scrollbar-thumb,
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3c4a46 !important;
          border-radius: 4px !important;
        }
        main.custom-scrollbar::-webkit-scrollbar-thumb:hover,
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #57f1db !important; /* Твій бірюзовий primary колір */
        }
      `
    }
  ]
})
