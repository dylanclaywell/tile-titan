<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, defineProps } from 'vue'

import { useEditorStore } from '@/stores/editor'
import { useMouse } from '@/hooks/useMouse'
import colors from '@/colors'

export type Props = {
  containerViewMouse: ReturnType<typeof useMouse>
}

const props = defineProps<Props>()

const store = useEditorStore()

const canvas = ref<HTMLCanvasElement | null>(null)

const canvasMouse = useMouse({
  ref: canvas,
})

const canvasTop = computed(() => {
  const oldTop = Number(canvas.value?.style?.top.split('px')[0]) || 0

  const newTop =
    oldTop + props.containerViewMouse.state.value.y - props.containerViewMouse.state.value.previousY

  return props.containerViewMouse.state.value.buttons.middle ? newTop : oldTop
})
const canvasLeft = computed(() => {
  const oldLeft = Number(canvas.value?.style?.left.split('px')[0]) || 0
  const newLeft =
    oldLeft +
    props.containerViewMouse.state.value.x -
    props.containerViewMouse.state.value.previousX

  return props.containerViewMouse.state.value.buttons.middle ? newLeft : oldLeft
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

onMounted(() => {
  drawCanvas()

  canvasMouse.register()
})

onUnmounted(() => {
  canvasMouse.unregister()
})
</script>

<template>
  <canvas
    v-if="store.selectedFileId"
    @click="drawCanvas"
    ref="canvas"
    class="border-r border-b border-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    :style="`top: ${canvasTop}px; left: ${canvasLeft}px;`"
  ></canvas>
</template>
