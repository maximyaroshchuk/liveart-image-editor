import { DEFAULT_ADJUSTMENTS, type Adjustments } from '@/types/editor'

const MIN = 0
const MAX = 200

export function clampAdjustment(value: number): number {
  return Math.min(MAX, Math.max(MIN, Math.round(value)))
}

export function isDefaultAdjustments(adjustments: Adjustments): boolean {
  return adjustments.brightness === DEFAULT_ADJUSTMENTS.brightness
    && adjustments.contrast === DEFAULT_ADJUSTMENTS.contrast
    && adjustments.saturation === DEFAULT_ADJUSTMENTS.saturation
}

export function mergeAdjustments(current: Adjustments, partial: Partial<Adjustments>): Adjustments {
  return {
    brightness: partial.brightness !== undefined ? clampAdjustment(partial.brightness) : current.brightness,
    contrast: partial.contrast !== undefined ? clampAdjustment(partial.contrast) : current.contrast,
    saturation: partial.saturation !== undefined ? clampAdjustment(partial.saturation) : current.saturation,
  }
}

export function adjustmentsToCssFilter(adjustments: Adjustments): string | null {
  if (isDefaultAdjustments(adjustments)) return null
  return `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`
}
