<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, defineProps } from 'vue'

import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'
import colors from '@/colors'

export type Props = {
  containerViewMouse: ReturnType<typeof useMouse>
  containerRef: HTMLDivElement | null
}

const props = defineProps<Props>()

const store = useEditorStore()

const container = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const canvasCursor = ref<HTMLDivElement | null>(null)
const canvasMouse = useMouse({
  ref: canvas,
})

const canvasTop = computed(() => {
  const oldTop =
    Number(container.value?.style?.top.split('px')[0]) ||
    (props.containerRef?.clientHeight ?? 0) / 2

  const newTop =
    oldTop + props.containerViewMouse.state.value.y - props.containerViewMouse.state.value.previousY

  const value = props.containerViewMouse.state.value.buttons.middle ? newTop : oldTop

  return `${value}px`
})
const canvasLeftPx = computed(() => {
  const oldLeft =
    Number(container.value?.style?.left.split('px')[0]) ||
    (props.containerRef?.clientWidth ?? 0) / 2
  const newLeft =
    oldLeft +
    props.containerViewMouse.state.value.x -
    props.containerViewMouse.state.value.previousX

  const value = props.containerViewMouse.state.value.buttons.middle ? newLeft : oldLeft

  return `${value}px`
})

function drawCanvas() {
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

  context.fillStyle = colors.gray[50]
  context.fillRect(0, 0, store.widthPx, store.heightPx)

  context.fillStyle = colors.gray[300]

  for (let i = 0; i < store.widthPx; i += store.tileWidthPx) {
    context.fillRect(i, 0, 1, store.heightPx)
  }

  for (let i = 0; i < store.heightPx; i += store.tileHeightPx) {
    context.fillRect(0, i, store.widthPx, 1)
  }
}

watch(
  store,
  () => {
    drawCanvas()
  },
  { deep: true },
)

watch(canvasMouse.state.value, () => {
  if (!canvasCursor.value) return

  const tileHeight = store.selectedFile?.tileHeight ?? 0
  const tileWidth = store.selectedFile?.tileWidth ?? 0

  const { absoluteX: x, absoluteY: y } = canvasMouse.state.value
  const { x: offsetX, y: offsetY } = canvas.value?.getBoundingClientRect() ?? { x: 0, y: 0 }

  canvasCursor.value.style.top = `${Math.floor((y - offsetY) / tileHeight) * tileHeight}px`
  canvasCursor.value.style.left = `${Math.floor((x - offsetX) / tileWidth) * tileWidth}px`
})

onMounted(() => {
  drawCanvas()

  canvasMouse.register()
})

onUnmounted(() => {
  canvasMouse.unregister()
})
</script>

<template>
  <div
    ref="container"
    class="border-r border-b border-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    :style="`top: ${canvasTop}; left: ${canvasLeftPx};`"
  >
    <div ref="canvasCursor" class="absolute top-0 left-0 z-50">
      <img
        :src="store.selectedTile?.blob ?? ''"
        :width="store.selectedFile?.tileWidth"
        :height="store.selectedFile?.tileHeight"
      />
    </div>
    <canvas v-if="store.selectedFileId" @click="drawCanvas" ref="canvas"> </canvas>
  </div>
</template>
