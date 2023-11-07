<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'

const store = useEditorStore()

const selectedTileset = computed(() => store.selectedTileset)

const tilesetCanvas = ref<HTMLCanvasElement | null>(null)
const canvasContainerRef = ref<HTMLDivElement | null>(null)
const canvasContainerMouse = useMouse({ ref: canvasContainerRef })

const cursorCanvas = ref<HTMLCanvasElement | null>(null)

const hiddenCanvas = ref<HTMLCanvasElement | null>(null)

const mouseX = computed(() => {
  const tileWidth = store.selectedFile?.tileWidth
  if (!tileWidth) return 0

  return Math.floor(canvasContainerMouse.state.value.offsetX / tileWidth) * tileWidth
})
const mouseY = computed(() => {
  const tileHeight = store.selectedFile?.tileHeight
  if (!tileHeight) return 0

  return Math.floor(canvasContainerMouse.state.value.offsetY / tileHeight) * tileHeight
})

function drawCanvas() {
  if (!tilesetCanvas.value) return

  const tilesetContext = tilesetCanvas.value.getContext('2d')
  const cursorContext = cursorCanvas.value?.getContext('2d')

  if (!tilesetContext || !cursorContext) return

  const image = new Image()
  image.src = store.selectedTileset?.blob ?? ''

  image.onload = () => {
    if (!tilesetCanvas.value || !cursorCanvas.value) return

    tilesetContext.clearRect(0, 0, tilesetCanvas.value.width, tilesetCanvas.value.height)
    cursorContext.clearRect(0, 0, cursorCanvas.value.width, cursorCanvas.value.height)

    tilesetContext.drawImage(image, 0, 0)

    cursorContext.fillStyle = 'rgba(58, 156, 255, 0.75)'

    const tileWidth = store.selectedFile?.tileWidth
    const tileHeight = store.selectedFile?.tileHeight

    if (!tileWidth || !tileHeight) return

    cursorContext.fillRect(mouseX.value, mouseY.value, tileWidth, tileHeight)
  }
}

function onCanvasClick() {
  if (!store.selectedFile) return

  if (!tilesetCanvas.value || !hiddenCanvas.value) return

  const context = hiddenCanvas.value?.getContext('2d')

  if (!context) return

  context.clearRect(0, 0, hiddenCanvas.value.width, hiddenCanvas.value.height)
  context.drawImage(
    tilesetCanvas.value,
    mouseX.value,
    mouseY.value,
    store.selectedFile.tileWidth,
    store.selectedFile.tileHeight,
    0,
    0,
    store.selectedFile.tileWidth,
    store.selectedFile.tileHeight,
  )

  store.setTile(hiddenCanvas.value?.toDataURL() ?? '')
}

watch(selectedTileset, () => {
  drawCanvas()
})

watch(canvasContainerMouse.state.value, () => {
  drawCanvas()
})

onMounted(() => {
  drawCanvas()

  canvasContainerMouse.register()
})

onUnmounted(() => {
  canvasContainerMouse.unregister()
})
</script>

<template>
  <div class="overflow-auto">
    <div class="relative" ref="canvasContainerRef">
      <canvas ref="hiddenCanvas" class="hidden"></canvas>
      <canvas
        @click="onCanvasClick"
        ref="tilesetCanvas"
        :width="store.selectedTilesetWidth"
        :height="store.selectedTilesetHeight"
      ></canvas>
      <canvas
        class="pointer-events-none absolute top-0 left-0"
        ref="cursorCanvas"
        :width="store.selectedTilesetWidth"
        :height="store.selectedTilesetHeight"
      ></canvas>
    </div>
  </div>
</template>
