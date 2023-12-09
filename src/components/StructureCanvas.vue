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
const currentHoveredStructures = ref<string[]>([])
const previousHoveredStructures = ref<string[]>([])

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

    const width = structureFile.width * structureFile.tileWidth
    const height = structureFile.height * structureFile.tileHeight

    const context = canvas.value.getContext('2d')

    if (!context) return

    context.clearRect(structure.x, structure.y, width, height)
    store.removeStructure(structure.id)

    // Now get all the tile positions of the structure and redraw any tiles that overlap this structure
    const tiles = []
    for (let i = 0; i < structureFile.width; i++) {
      for (let j = 0; j < structureFile.height; j++) {
        tiles.push({
          x: structure.x + i * structureFile.tileWidth,
          y: structure.y + j * structureFile.tileHeight,
        })
      }
    }

    for (const tile of tiles) {
      const tileStructure = getExistingStructuresAtPosition({ x: tile.x, y: tile.y })

      for (const structure of tileStructure) {
        const structureFile = store.files.find((file) => file.id === structure.fileId)

        if (structureFile && !clickedStructures.includes(structure)) {
          drawStructureFromFile({
            x: structure.x,
            y: structure.y,
            structureFile,
            canvas: canvas.value,
          })
        }
      }
    }
  }
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
    const clickedStructures = getExistingStructuresAtPosition({ x: offsetX, y: offsetY })

    if (clickedStructures.length > 0) return

    const structureFile = store.files.find((file) => file.id === store.selectedStructureId)

    if (!structureFile) return

    drawStructureFromFile({
      x: tileX * tileWidth,
      y: tileY * tileHeight,
      structureFile,
      canvas: canvas.value,
    })

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
    // redrawOtherStructures()
  }
}

function drawHoverRectangles() {
  const newHoveredStructures = getExistingStructuresAtPosition({
    x: canvasMouse.state.value.offsetX,
    y: canvasMouse.state.value.offsetY,
  }).map((structure) => structure.id)

  const previousHoveredStructures: string[] = []

  for (const hoveredStructure of currentHoveredStructures.value) {
    if (!newHoveredStructures.includes(hoveredStructure)) {
      previousHoveredStructures.push(hoveredStructure)
    }
  }

  // draw hover rectangle on all new hovered structures and remove hover rectangle from all previous hovered structures (redrawing the structure)
  for (const hoveredStructure of newHoveredStructures.filter(
    (hoveredStructure) => !currentHoveredStructures.value.includes(hoveredStructure),
  )) {
    if (!previousHoveredStructures.includes(hoveredStructure)) {
      if (store.selectedLayer?.type !== 'structure') continue
      const structure = store.selectedLayer.data.find(
        (structure) => structure.id === hoveredStructure,
      )

      if (!structure) continue

      const structureFile = store.files.find((file) => file.id === structure.fileId)

      if (!structureFile) continue

      window.requestAnimationFrame(() => {
        const context = canvas.value?.getContext('2d')

        if (!context) return

        // translucent blue if tool is selectStructure, translucent red if tool is removeStructure
        context.fillStyle =
          store.selectedTool === 'selectStructure' ? 'rgba(0, 0, 255,0.3)' : 'rgba(255, 0, 0,0.3)'
        context.fillRect(
          structure.x,
          structure.y,
          structureFile.width * structureFile.tileWidth,
          structureFile.height * structureFile.tileHeight,
        )
      })
    }
  }

  for (const hoveredStructure of previousHoveredStructures.filter(
    (hoveredStructure) => !newHoveredStructures.includes(hoveredStructure),
  )) {
    if (!canvas.value) continue

    if (!newHoveredStructures.includes(hoveredStructure)) {
      if (store.selectedLayer?.type !== 'structure') continue
      const structure = store.selectedLayer.data.find(
        (structure) => structure.id === hoveredStructure,
      )

      if (!structure) continue

      const structureFile = store.files.find((file) => file.id === structure.fileId)

      if (!structureFile) continue

      window.requestAnimationFrame(() => {
        if (!canvas.value) return

        const context = canvas.value.getContext('2d')

        if (!context) return

        context.clearRect(
          structure.x,
          structure.y,
          structureFile.width * structureFile.tileWidth,
          structureFile.height * structureFile.tileHeight,
        )

        drawStructureFromFile({
          x: structure.x,
          y: structure.y,
          structureFile,
          canvas: canvas.value,
        })
      })
    }
  }

  currentHoveredStructures.value = newHoveredStructures
}

function onCanvasMouseMove(event: Event) {
  if (!(event instanceof MouseEvent)) return
  const leftMouseDown = event.buttons === 1

  if (store.selectedTool !== 'addStructure') {
    drawHoverRectangles()
  }

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
    @mouseleave="drawFullCanvas"
  ></canvas>
</template>
