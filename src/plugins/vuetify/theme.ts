import type { ThemeDefinition } from 'vuetify'

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#fcfcfc',
    surface: '#ffffff',
    'surface-variant': '#f9fafb',
    'surface-bright': '#ffffff',
    'on-surface': '#151515',
    primary: '#29CC97',
    'on-primary': '#ffffff',
    secondary: '#6c757d',
    'on-secondary': '#ffffff',
    success: '#29CC97',
    error: '#ff4040',
    info: '#0172ff',
    warning: '#FFAF14',
  },
  variables: {
    'border-color': '#e5e7eb',
  },
}

export const vuetifyTheme = {
  defaultTheme: 'light' as const,
  themes: { light },
}
