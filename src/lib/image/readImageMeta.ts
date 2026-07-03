import type { ImageSourceMeta } from '@/types/editor'

export interface LoadedImage {
  image: HTMLImageElement
  objectUrl: string
  meta: ImageSourceMeta
}

export function loadImageFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      resolve({
        image,
        objectUrl,
        meta: { name: file.name, width: image.naturalWidth, height: image.naturalHeight },
      })
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('failed to decode image'))
    }
    image.src = objectUrl
  })
}
