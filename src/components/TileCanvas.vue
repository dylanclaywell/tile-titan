<script lang="ts" setup>
import { useMouse } from '@/hooks/useMouse'
import { useEditorStore } from '@/stores/editor'
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
  if (!layer) return

  if (layer.type === 'tile') {
    layer.data.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (!tile) return

        const image = new Image()

        image.src = tile.tileData ?? ''

        image.onload = () => {
          context.drawImage(
            image,
            x * (store.selectedFile?.tileWidth ?? 0),
            y * (store.selectedFile?.tileHeight ?? 0),
          )
        }
      })
    })
  }
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

function onCanvasClick() {
  if (!store.selectedFile) return

  const tileHeight = store.selectedFile?.tileHeight ?? 0
  const tileWidth = store.selectedFile?.tileWidth ?? 0

  const { offsetX, offsetY } = canvasMouse.state.value

  const tileX = Math.floor(offsetX / tileWidth)
  const tileY = Math.floor(offsetY / tileHeight)

  if (store.selectedLayer?.type === 'tile') {
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
  ></canvas>
</template>
