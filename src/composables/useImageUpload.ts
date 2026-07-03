import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useEditorStore } from '@/stores/editor'

export function useImageUpload() {
  const store = useEditorStore()
  const dropZoneRef = useTemplateRef<HTMLElement>('dropZone')
  const isDragOver = ref(false)

  function clearDragOver() {
    isDragOver.value = false
  }

  function isStillInside(relatedTarget: EventTarget | null) {
    const zone = dropZoneRef.value
    if (!zone) return false
    return relatedTarget instanceof Node && zone.contains(relatedTarget)
  }

  async function handleFile(file: File | undefined) {
    if (!file || store.isLoading) return
    await store.loadImage(file)
  }

  function onDragEnter(event: DragEvent) {
    if (store.isLoading || isStillInside(event.relatedTarget)) return
    isDragOver.value = true
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault()
  }

  function onDragLeave(event: DragEvent) {
    if (isStillInside(event.relatedTarget)) return
    clearDragOver()
  }

  async function onDrop(event: DragEvent) {
    clearDragOver()
    await handleFile(event.dataTransfer?.files[0])
  }

  onMounted(() => window.addEventListener('dragend', clearDragOver))
  onUnmounted(() => window.removeEventListener('dragend', clearDragOver))

  return {
    isDragOver,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
