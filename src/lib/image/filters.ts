import type { FilterValue } from '@/types/editor'

export function filterToCssFilter(value: FilterValue): string | null {
  if (value === 'grayscale') return 'grayscale(1)'
  if (value === 'sepia') return 'sepia(1)'
  return null
}

export function combineCssFilters(...parts: Array<string | null | undefined>): string {
  const active = parts.filter((part): part is string => Boolean(part))
  return active.length ? active.join(' ') : 'none'
}
