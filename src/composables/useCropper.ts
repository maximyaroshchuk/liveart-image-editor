import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { onUnmounted, type Ref } from 'vue'
import { roundCropRect } from '@/lib/image/cropRect'
import type { CropRect } from '@/types/editor'

export interface UseCropperOptions {
  getInitialCrop?: () => CropRect | null
  onCrop?: (rect: CropRect) => void
}

export function useCropper(imageRef: Ref<HTMLImageElement | null>, options: UseCropperOptions = {}) {
  let cropper: Cropper | null = null
  let pendingFrame: number | null = null

  function destroy() {
    if (pendingFrame !== null) {
      cancelAnimationFrame(pendingFrame)
      pendingFrame = null
    }
    cropper?.destroy()
    cropper = null
  }

  function emitCropNow() {
    if (!cropper || !options.onCrop) return
    const data = cropper.getData(true)
    options.onCrop(roundCropRect({ x: data.x, y: data.y, width: data.width, height: data.height }))
  }

  function emitCrop() {
    if (pendingFrame !== null) return
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = null
      emitCropNow()
    })
  }

  function init() {
    const image = imageRef.value
    if (!image?.src) return

    destroy()

    cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'crop',
      autoCropArea: 1,
      background: false,
      guides: true,
      center: true,
      highlight: false,
      responsive: true,
      restore: false,
      ready() {
        const initial = options.getInitialCrop?.()
        if (initial) cropper?.setData(initial)
        emitCrop()
      },
      crop() {
        emitCrop()
      },
    })
  }

  onUnmounted(destroy)

  return { init, destroy }
}
