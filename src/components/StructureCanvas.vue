<script lang="ts" setup>
import { useMouse } from '@/hooks/useMouse'
import { useEditorStore } from '@/stores/editor'
import { drawStructureFromFile } from '@/utils/drawStructureFromFile'
import { onMounted, onUnmounted, ref, watch } from 'vue'

export type Props = {
  id: string
}

const props = defineProps<Props>()

const store = useEditorStore()
const canvas = ref<HTMLCanvasElement | null>(null)
const canvasMouse = useMouse({
  ref: canvas,
})

function drawFullCanvas() {
  window.requestAnimationFrame(() => {
    const context = canvas.value?.getContext('2d')

    if (!context) return

    // Changing the width or height of a canvas clears the canvas.
    // To avoid race conditions, we'll set that property using the ref
    // before we draw anything.
    if (canvas.value) {
      canvas.value.width = store.widthPx
      canvas.value.height = store.heightPx
    }

    context.clearRect(0, 0, store.widthPx, store.heightPx)

    const layer = store.selectedFile?.layers.find((layer) => layer.id === props.id)
    if (!layer || layer.type !== 'structure') return

    layer.data.forEach((structure) => {
      if (!canvas.value) return

      const structureFile = store.files.find((file) => file.id === structure.fileId)

      if (!structureFile) {
        console.error(`Could not find structure file ${structure.fileId}`)
        return
      }

      drawStructureFromFile({
        x: structure.x,
        y: structure.y,
        structureFile,
        canvas: canvas.value,
      })
    })
  })
}

function getExistingStructuresAtPosition({ x, y }: { x: number; y: number }) {
  const selectedFile = store.selectedFile
  if (!selectedFile) return []

  if (!canvas.value) return []

  const layer = selectedFile.layers.find((layer) => layer.id === props.id)

  if (!layer) return []

  if (layer.type !== 'structure') return []

  const clickedStructures = layer.data.filter((structure) => {
    const file = store.files.find((file) => file.id === structure.fileId)

    return (
      file &&
      x >= structure.x &&
      y >= structure.y &&
      x < structure.x + file.width * file.tileWidth &&
      y < structure.y + file.height * file.tileHeight
    )
  })

  return clickedStructures
}

function clearStructure({ x, y }: { x: number; y: number }) {
  const selectedFile = store.selectedFile
  if (!selectedFile) return

  if (!canvas.value) return

  const layer = selectedFile.layers.find((layer) => layer.id === props.id)

  if (layer?.type !== 'structure') return

  const clickedStructures = getExistingStructuresAtPosition({ x, y })

  for (const structure of clickedStructures) {
    const structureFile = store.files.find((file) => file.id === structure.fileId)

    if (!structureFile) return

    const context = canvas.value.getContext('2d')

    if (!context) return

    store.removeStructure(structure.id)
  }

  if (clickedStructures.length > 0) drawFullCanvas()
}

function onCanvasClick() {
  if (!canvas.value) return

  // This component only supports tile clicking - if the selected layer
  // isn't a tile layer, something has gone wrong.
  if (store.selectedLayer?.type !== 'structure') return

  if (!store.selectedFile) return

  const tileHeight = store.selectedFile?.tileHeight ?? 0
  const tileWidth = store.selectedFile?.tileWidth ?? 0

  const { offsetX, offsetY } = canvasMouse.state.value

  const tileX = Math.floor(offsetX / tileWidth)
  const tileY = Math.floor(offsetY / tileHeight)

  if (store.selectedTool === 'addStructure') {
    const structureFile = store.files.find((file) => file.id === store.selectedStructureId)
    if (!structureFile) return

    for (
      let y = offsetY;
      y < offsetY + structureFile.height * structureFile.tileHeight;
      y += structureFile.tileHeight
    ) {
      for (
        let x = offsetX;
        x < offsetX + structureFile.width * structureFile.tileWidth;
        x += structureFile.tileWidth
      ) {
        const existingStructures = getExistingStructuresAtPosition({ x, y })

        if (existingStructures.length > 0) return
      }
    }

    drawFullCanvas()

    store.addStructure({
      x: tileX * tileWidth,
      y: tileY * tileHeight,
      id: structureFile.id,
    })
  } else if (store.selectedTool === 'removeStructure') {
    clearStructure({
      x: tileX * tileWidth,
      y: tileY * tileHeight,
    })
  }
}

function onCanvasMouseMove(event: Event) {
  if (!(event instanceof MouseEvent)) return
  const leftMouseDown = event.buttons === 1

  if (!leftMouseDown) return

  onCanvasClick()
}

watch(
  () => store.selectedFile?.width,
  () => drawFullCanvas(),
)
watch(
  () => store.selectedFile?.height,
  () => drawFullCanvas(),
)

onMounted(() => {
  drawFullCanvas()

  canvasMouse.register()
})

onUnmounted(() => {
  canvasMouse.unregister()
})
</script>

<template>
  <canvas
    :class="`image-rendering-pixelated absolute top-0 left-0 z-0 ${
      store.selectedLayerId !== props.id ? 'pointer-events-none' : 'pointer-events-auto'
    }`"
    :width="store.widthPx"
    :height="store.heightPx"
    ref="canvas"
    :id="props.id"
    @click="onCanvasClick"
    @mousemove="onCanvasMouseMove"
    @mouseleave="drawFullCanvas"
  ></canvas>
</template>
