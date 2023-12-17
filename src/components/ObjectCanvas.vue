<script lang="ts" setup>
import { eventEmitter } from '@/events'
import { useMouse } from '@/hooks/useMouse'
import { useEditorStore } from '@/stores/editor'
import type { ObjectType } from '@/types/object'
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

const objectBeingCreated = ref<ObjectType>()

function drawObject(object: ObjectType) {
  const { x, y, width, height, color } = object

  const context = canvas.value?.getContext('2d')
  if (!context) return

  context.strokeStyle = color ?? '#000000'
  context.strokeRect(x, y, width, height)
}

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
    if (!layer || layer.type !== 'object') return

    layer.data.forEach((object) => {
      if (!canvas.value) return

      drawObject(object)
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

function onCanvasClick(event: Event) {
  if (!(event instanceof MouseEvent)) return

  const leftMouseDown = event.buttons === 1

  if (!leftMouseDown) return

  if (!canvas.value) return

  // This component only supports tile clicking - if the selected layer
  // isn't a tile layer, something has gone wrong.
  if (store.selectedLayer?.type !== 'object') return

  if (!store.selectedFile) return

  const { offsetX, offsetY } = canvasMouse.state.value

  if (store.selectedTool === 'addObject') {
    objectBeingCreated.value = store.addObject({
      x: offsetX,
      y: offsetY,
      width: 1,
      height: 1,
    })
    drawFullCanvas()
  } else if (store.selectedTool === 'removeObject') {
    const clickedObjects = store.selectedFile.layers
      .filter((layer) => layer.type === 'object')
      .flatMap((layer) => {
        if (layer.type !== 'object') return []

        return layer.data.filter((object) => {
          return (
            offsetX >= object.x &&
            offsetY >= object.y &&
            offsetX < object.x + object.width &&
            offsetY < object.y + object.height
          )
        })
      })

    for (const object of clickedObjects) {
      store.removeObject(object.id)
    }

    if (clickedObjects.length > 0) drawFullCanvas()
  }
}

function onCanvasMouseMove(event: Event) {
  if (!(event instanceof MouseEvent)) return
  const leftMouseDown = canvasMouse.state.value.buttons.left

  if (!leftMouseDown) return

  if (store.selectedTool === 'addObject') {
    if (!objectBeingCreated.value) return

    const { offsetX, offsetY } = canvasMouse.state.value

    objectBeingCreated.value.width = Math.floor(offsetX - objectBeingCreated.value.x)
    objectBeingCreated.value.height = Math.floor(offsetY - objectBeingCreated.value.y)

    drawFullCanvas()
  }
}

function onCanvasMouseUp() {
  if (store.selectedTool === 'addObject') {
    if (!objectBeingCreated.value) return

    // Fix negative widths and heights of objectBeingCreated
    const width =
      objectBeingCreated.value.width < 0
        ? objectBeingCreated.value.width * -1
        : objectBeingCreated.value.width
    const height =
      objectBeingCreated.value.height < 0
        ? objectBeingCreated.value.height * -1
        : objectBeingCreated.value.height
    const x =
      objectBeingCreated.value.width < 0
        ? objectBeingCreated.value.x - width
        : objectBeingCreated.value.x
    const y =
      objectBeingCreated.value.height < 0
        ? objectBeingCreated.value.y - height
        : objectBeingCreated.value.y

    store.updateObject(objectBeingCreated.value.id, {
      x,
      y,
      width,
      height,
    })

    objectBeingCreated.value = undefined
  }
}

watch(
  () => store.selectedFile?.width,
  () => drawFullCanvas(),
)
watch(
  () => store.selectedFile?.height,
  () => drawFullCanvas(),
)

eventEmitter.on('redraw-layer', (id) => {
  if (props.id === id) {
    drawFullCanvas()
  }
})

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
    :class="`absolute top-0 left-0 z-0 ${
      store.selectedLayerId !== props.id ? 'pointer-events-none' : 'pointer-events-auto'
    }`"
    :width="store.widthPx"
    :height="store.heightPx"
    ref="canvas"
    :id="props.id"
    @mousedown="onCanvasClick"
    @mouseup="onCanvasMouseUp"
    @mousemove="onCanvasMouseMove"
    @mouseleave="drawFullCanvas"
  ></canvas>
</template>
