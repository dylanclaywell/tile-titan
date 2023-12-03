<script lang="ts" setup>
import { useMouse } from '@/hooks/useMouse'
import { useEditorStore } from '@/stores/editor'
import { drawTileLayerToCanvas } from '@/utils/drawTileLayerToCanvas'
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
    const image = new Image()

    const structureFile = store.files.find((file) => file.id === structure.fileId)

    const canvas = document.createElement('canvas')
    canvas.width = structureFile?.width ?? 0
    canvas.height = structureFile?.height ?? 0

    for (const layer of structureFile?.layers ?? []) {
      if (layer.type !== 'tile') continue
      drawTileLayerToCanvas({
        layer,
        canvas,
        tileWidth: structureFile?.tileWidth ?? 0,
        tileHeight: structureFile?.tileHeight ?? 0,
      })
    }

    image.src = canvas.toDataURL() ?? ''

    image.onload = () => {
      context.drawImage(image, structure.x, structure.y)
    }
  })
}

function drawTile({ x, y, blob }: { x: number; y: number; blob: string }) {
  if (!store.selectedTile) return
  if (!canvas.value) return

  const tileHeight = store.selectedTile.width
  const tileWidth = store.selectedTile.height

  const context = canvas.value.getContext('2d')

  if (!context) return

  context.clearRect(x, y, tileWidth, tileHeight)

  const image = new Image()

  image.src = blob

  image.onload = () => context.drawImage(image, x, y)
}

function clearTile({ x, y }: { x: number; y: number }) {
  // If there is no selected file, something has gone wrong.
  if (!store.selectedFile) return

  if (!canvas.value) return

  const tileHeight = store.selectedFile.tileHeight
  const tileWidth = store.selectedFile.tileWidth

  const context = canvas.value.getContext('2d')

  if (!context) return

  context.clearRect(x, y, tileWidth, tileHeight)
}

function onCanvasClick() {
  // This component only supports tile clicking - if the selected layer
  // isn't a tile layer, something has gone wrong.
  if (store.selectedLayer?.type !== 'tile') return

  if (!store.selectedFile) return

  const tileHeight = store.selectedFile?.tileHeight ?? 0
  const tileWidth = store.selectedFile?.tileWidth ?? 0

  const { offsetX, offsetY } = canvasMouse.state.value

  const tileX = Math.floor(offsetX / tileWidth)
  const tileY = Math.floor(offsetY / tileHeight)

  if (store.selectedTool === 'addTile') {
    store.selectedLayer.data[tileY][tileX] = {
      tilesetId: store.selectedTileset?.id ?? '',
      tilesetName: store.selectedTileset?.name ?? '',
      tilesetX: store.selectedTile?.tilesetX ?? 0,
      tilesetY: store.selectedTile?.tilesetY ?? 0,
      tileData: store.selectedTile?.blob ?? '',
    }

    drawTile({
      x: tileX * tileWidth,
      y: tileY * tileHeight,
      blob: store.selectedTile?.blob ?? '',
    })
  } else if (store.selectedTool === 'removeTile') {
    store.selectedLayer.data[tileY][tileX] = {
      tilesetId: '',
      tilesetName: '',
      tilesetX: -1,
      tilesetY: -1,
      tileData: '',
    }

    clearTile({
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
    :class="`absolute top-0 left-0 z-0 ${
      store.selectedLayerId !== props.id ? 'pointer-events-none' : 'pointer-events-auto'
    }`"
    :width="store.widthPx"
    :height="store.heightPx"
    ref="canvas"
    :id="props.id"
    @click="onCanvasClick"
    @mousemove="onCanvasMouseMove"
  ></canvas>
</template>
