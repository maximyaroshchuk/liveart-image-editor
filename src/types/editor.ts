export interface ImageSourceMeta {
  name: string
  width: number
  height: number
}

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface Adjustments {
  brightness: number
  contrast: number
  saturation: number
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
}

export type FilterName = 'grayscale' | 'sepia'
export type FilterValue = FilterName | null

export type EditOperation =
  | ({ type: 'crop' } & CropRect)
  | ({ type: 'adjust' } & Adjustments)
  | { type: 'filter'; name: FilterName }

export interface EditDocument {
  version: 1
  source: ImageSourceMeta
  operations: EditOperation[]
}
