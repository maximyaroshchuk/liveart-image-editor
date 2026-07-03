import { buildPreviewCssFilter, findCropOperation } from '@/lib/image/operations'
import type { EditOperation } from '@/types/editor'

function renderExportCanvas(image: HTMLImageElement, operations: EditOperation[]): HTMLCanvasElement {
  const crop = findCropOperation(operations)
  const region = crop ?? { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight }

  const canvas = document.createElement('canvas')
  canvas.width = region.width
  canvas.height = region.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas context unavailable')

  ctx.filter = buildPreviewCssFilter(operations)
  ctx.drawImage(image, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height)

  return canvas
}

export function exportImageBlob(image: HTMLImageElement, operations: EditOperation[]): Promise<Blob> {
  const canvas = renderExportCanvas(image, operations)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('failed to export canvas'))
    }, 'image/png')
  })
}

export function getExportImageFilename(sourceName: string): string {
  const dot = sourceName.lastIndexOf('.')
  const base = dot === -1 ? sourceName : sourceName.slice(0, dot)
  return `${base || 'image'}-edited.png`
}
