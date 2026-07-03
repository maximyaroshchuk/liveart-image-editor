import { adjustmentsToCssFilter } from '@/lib/image/adjustments'
import { combineCssFilters, filterToCssFilter } from '@/lib/image/filters'
import {
  DEFAULT_ADJUSTMENTS,
  type Adjustments,
  type CropRect,
  type EditOperation,
  type FilterValue,
} from '@/types/editor'

export function findCropOperation(operations: EditOperation[]): Extract<EditOperation, { type: 'crop' }> | null {
  const found = operations.find((op) => op.type === 'crop')
  return found?.type === 'crop' ? found : null
}

function findAdjustOperation(operations: EditOperation[]): Extract<EditOperation, { type: 'adjust' }> | null {
  const found = operations.find((op) => op.type === 'adjust')
  return found?.type === 'adjust' ? found : null
}

function findFilterOperation(operations: EditOperation[]): Extract<EditOperation, { type: 'filter' }> | null {
  const found = operations.find((op) => op.type === 'filter')
  return found?.type === 'filter' ? found : null
}

export function adjustmentsFromOperations(operations: EditOperation[]): Adjustments {
  const op = findAdjustOperation(operations)
  return op ? { brightness: op.brightness, contrast: op.contrast, saturation: op.saturation } : { ...DEFAULT_ADJUSTMENTS }
}

export function filterFromOperations(operations: EditOperation[]): FilterValue {
  return findFilterOperation(operations)?.name ?? null
}

export function upsertCropOperation(operations: EditOperation[], crop: CropRect): EditOperation[] {
  const next: EditOperation = { type: 'crop', ...crop }
  const withoutCrop = operations.filter((op) => op.type !== 'crop')
  return [next, ...withoutCrop]
}

export function removeCropOperation(operations: EditOperation[]): EditOperation[] {
  return operations.filter((op) => op.type !== 'crop')
}

export function upsertAdjustOperation(operations: EditOperation[], adjustments: Adjustments): EditOperation[] {
  const withoutAdjust = operations.filter((op) => op.type !== 'adjust')
  if (adjustments.brightness === DEFAULT_ADJUSTMENTS.brightness
    && adjustments.contrast === DEFAULT_ADJUSTMENTS.contrast
    && adjustments.saturation === DEFAULT_ADJUSTMENTS.saturation) {
    return withoutAdjust
  }
  return [...withoutAdjust, { type: 'adjust', ...adjustments }]
}

export function upsertFilterOperation(operations: EditOperation[], name: FilterValue): EditOperation[] {
  const withoutFilter = operations.filter((op) => op.type !== 'filter')
  if (!name) return withoutFilter
  return [...withoutFilter, { type: 'filter', name }]
}

export function buildPreviewCssFilter(operations: EditOperation[]): string {
  return combineCssFilters(
    adjustmentsToCssFilter(adjustmentsFromOperations(operations)),
    filterToCssFilter(filterFromOperations(operations)),
  )
}
