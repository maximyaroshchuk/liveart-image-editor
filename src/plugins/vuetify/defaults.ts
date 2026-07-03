import type { DefaultsInstance } from 'vuetify'

export const vuetifyDefaults: DefaultsInstance = {
  global: {
    ripple: true,
  },
  VBtn: {
    variant: 'flat',
  },
  VCard: {
    rounded: 'lg',
    elevation: 0,
  },
  VSlider: {
    color: 'primary',
    hideDetails: true,
    thumbSize: 16,
    trackSize: 4,
  },
  VFileInput: {
    variant: 'outlined',
    density: 'comfortable',
    hideDetails: true,
  },
  VChip: {
    size: 'small',
  },
  VTooltip: {
    location: 'bottom',
  },
  VAlert: {
    variant: 'tonal',
    density: 'compact',
  },
}
