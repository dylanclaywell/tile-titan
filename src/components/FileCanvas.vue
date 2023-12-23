<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, defineProps } from 'vue'

import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'
import colors from '@/colors'
import { eventEmitter } from '@/events'
import TileCanvas from './TileCanvas.vue'
import StructureCanvas from './StructureCanvas.vue'
import ObjectCanvas from './ObjectCanvas.vue'
import { usePerformanceStore } from '@/stores/performance'

export type Props = {
  containerViewMouse: ReturnType<typeof useMouse>
  containerRef: HTMLDivElement | null
}

const props = defineProps<Props>()

const store = useEditorStore()

const layerComponents = {
  tile: TileCanvas,
  object: ObjectCanvas,
  structure: StructureCanvas,
}

const grid = ref<HTMLCanvasElement | null>(null)
const background = ref<HTMLCanvasElement | null>(null)
const root = ref<HTMLDivElement | null>(null)
const canvasesContainer = ref<HTMLDivElement | null>(null)
const canvasCursor = ref<HTMLDivElement | null>(null)
const canvasMouse = useMouse({
  ref: canvasesContainer,
})

const performanceStore = usePerformanceStore()

const selectedStructure = computed(() =>
  store.files.find((s) => s.id === store.selectedStructureId),
)

const canvasTop = computed(() => {
  const oldTop =
    Number(root.value?.style?.top.split('px')[0]) || (props.containerRef?.clientHeight ?? 0) / 2

  const newTop =
    oldTop + props.containerViewMouse.state.value.y - props.containerViewMouse.state.value.previousY

  const value = props.containerViewMouse.state.value.buttons.middle ? newTop : oldTop

  return `${value}px`
})
const canvasLeft = computed(() => {
  const oldLeft =
    Number(root.value?.style?.left.split('px')[0]) || (props.containerRef?.clientWidth ?? 0) / 2
  const newLeft =
    oldLeft +
    props.containerViewMouse.state.value.x -
    props.containerViewMouse.state.value.previousX

  const value = props.containerViewMouse.state.value.buttons.middle ? newLeft : oldLeft

  return `${value}px`
})

// This function is intended to only be used when the canvas data is first loaded
// or when the canvas is resized. This is because changing the size of the canvas
// clears the canvas.
function drawFullCanvas() {
  if (grid.value) {
    grid.value.width = store.widthPx
    grid.value.height = store.heightPx
  }

  if (background.value) {
    background.value.width = store.widthPx
    background.value.height = store.heightPx
  }

  const backgroundContext = background.value?.getContext('2d')
  if (!backgroundContext) return

  backgroundContext.fillStyle = colors.gray[50]
  backgroundContext.fillRect(0, 0, store.widthPx, store.heightPx)

  const gridContext = grid.value?.getContext('2d')
  if (!gridContext) return

  gridContext.fillStyle = colors.gray[300]

  for (let i = store.tileWidthPx; i < store.widthPx; i += store.tileWidthPx) {
    gridContext.fillRect(i, 0, 1, store.heightPx)
  }

  for (let i = store.tileHeightPx; i < store.heightPx; i += store.tileHeightPx) {
    gridContext.fillRect(0, i, store.widthPx, 1)
  }
}

function drawFullCanvases() {
  drawFullCanvas()
}

watch(
  () => store.selectedFile?.width,
  () => drawFullCanvases(),
)
watch(
  () => store.selectedFile?.height,
  () => drawFullCanvases(),
)

watch(canvasMouse.state.value, () => {
  if (!canvasCursor.value) return

  const tileHeight = store.selectedFile?.tileHeight ?? 0
  const tileWidth = store.selectedFile?.tileWidth ?? 0

  const { absoluteX: x, absoluteY: y } = canvasMouse.state.value
  const { x: offsetX, y: offsetY } = canvasesContainer.value?.getBoundingClientRect() ?? {
    x: 0,
    y: 0,
  }

  canvasCursor.value.style.top = `${
    Math.floor((y - offsetY) / store.zoom / tileHeight) * tileHeight
  }px`
  canvasCursor.value.style.left = `${
    Math.floor((x - offsetX) / store.zoom / tileWidth) * tileWidth
  }px`
})

onMounted(() => {
  drawFullCanvases()

  canvasMouse.register()
})

onUnmounted(() => {
  canvasMouse.unregister()
})

eventEmitter.on('reset-view', () => {
  if (!root.value) return

  root.value.style.top = ''
  root.value.style.left = ''
})
</script>

<template>
  <div
    ref="root"
    class="border-r border-b border-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    :style="`top: ${canvasTop}; left: ${canvasLeft}; width: ${store.widthPx}px; height: ${store.heightPx}px; transform: scale(${store.zoom})`"
  >
    <div ref="canvasCursor" class="absolute top-0 left-0 z-50 pointer-events-none">
      <img
        v-if="store.selectedLayer?.type === 'tile' && store.selectedTile"
        :src="store.selectedTile?.blob ?? ''"
        :width="store.selectedFile?.tileWidth"
        :height="store.selectedFile?.tileHeight"
        :class="{
          'bg-blue-400': store.selectedTool === 'addTile',
          'bg-red-400': store.selectedTool === 'removeTile',
          'z-50 opacity-50': true,
        }"
      />
      <img
        v-if="store.selectedLayer?.type === 'structure'"
        :src="
          store.selectedTool === 'addStructure'
            ? performanceStore.renderedStructureData.find((r) => r.id === store.selectedStructureId)
                ?.data ?? ''
            : ''
        "
        :width="
          selectedStructure && store.selectedTool === 'addStructure'
            ? selectedStructure.width * selectedStructure.tileWidth
            : store.selectedFile?.tileWidth
        "
        :height="
          selectedStructure && store.selectedTool === 'addStructure'
            ? selectedStructure?.height * selectedStructure?.tileHeight
            : store.selectedFile?.tileHeight
        "
        :class="{
          'bg-blue-400': store.selectedTool === 'addStructure',
          'bg-red-400': store.selectedTool === 'removeStructure',
          'z-50 opacity-50': true,
        }"
      />
    </div>
    <div
      ref="canvasesContainer"
      :class="{
        'image-rendering-pixelated absolute pointer-events-none': true,
        'cursor-crosshair':
          store.selectedLayer?.type === 'object' && store.selectedTool === 'addObject',
      }"
      :style="`width: ${store.widthPx}px; height: ${store.heightPx}px;}`"
    >
      <canvas
        class="image-rendering-pixelated absolute top-0 left-0 z-50"
        ref="grid"
        v-show="store.showGrid"
      ></canvas>
      <component
        v-for="layer in store.selectedFile?.layers.filter((l) => l.isVisible) ?? []"
        :key="layer.id"
        :is="layerComponents[layer.type]"
        :id="layer.id"
      ></component>
      <canvas
        class="image-rendering-pixelated absolute top-0 left-0 -z-10 shadow"
        ref="background"
      ></canvas>
    </div>
  </div>
</template>
