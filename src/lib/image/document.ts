import { downloadBlob } from '@/lib/image/downloadFile'
import type { EditDocument, EditOperation, ImageSourceMeta } from '@/types/editor'

export function buildEditDocument(source: ImageSourceMeta, operations: EditOperation[]): EditDocument {
  return { version: 1, source, operations }
}

export function getExportDocumentFilename(sourceName: string): string {
  const dot = sourceName.lastIndexOf('.')
  const base = dot === -1 ? sourceName : sourceName.slice(0, dot)
  return `${base || 'image'}-operations.json`
}

export function downloadEditDocument(document: EditDocument, sourceName: string) {
  const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' })
  downloadBlob(blob, getExportDocumentFilename(sourceName))
}
