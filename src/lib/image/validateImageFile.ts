export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ACCEPTED_FILE_ACCEPT = ACCEPTED_MIME_TYPES.join(',')
export const ACCEPTED_FORMATS_LABEL = 'JPG, PNG or WebP'
export const READ_IMAGE_ERROR = 'Failed to read the image'

export interface ValidationResult {
  ok: boolean
  message?: string
}

export function validateImageFile(file: File): ValidationResult {
  if (!ACCEPTED_MIME_TYPES.includes(file.type as (typeof ACCEPTED_MIME_TYPES)[number])) {
    return { ok: false, message: `Unsupported file format. Allowed: ${ACCEPTED_FORMATS_LABEL}.` }
  }
  return { ok: true }
}
