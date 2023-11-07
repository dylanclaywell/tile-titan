import { ref, type Ref } from 'vue'

export function useMouse({ ref: componentRef }: { ref: Ref<HTMLElement | null> }) {
  const state = ref({
    buttons: {
      left: false,
      middle: false,
      right: false,
    },
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    previousX: 0,
    previousY: 0,
  })

  function handleMouseMove(event: MouseEvent) {
    state.value.previousX = state.value.x
    state.value.previousY = state.value.y

    state.value.x = event.pageX - (componentRef.value?.offsetLeft ?? 0)
    state.value.y = event.pageY - (componentRef.value?.offsetTop ?? 0)

    state.value.offsetX = event.offsetX
    state.value.offsetY = event.offsetY
  }

  function handleMouseDown(event: MouseEvent) {
    state.value.buttons.left = event.buttons === 1
    state.value.buttons.middle = event.buttons === 4
    state.value.buttons.right = event.buttons === 2
  }

  function handleMouseUp(event: MouseEvent) {
    state.value.buttons.left = event.buttons === 1
    state.value.buttons.middle = event.buttons === 4
    state.value.buttons.right = event.buttons === 2
  }

  function handleMouseLeave() {
    state.value.buttons.left = false
    state.value.buttons.middle = false
    state.value.buttons.right = false
  }

  function register() {
    componentRef.value?.addEventListener('mousemove', handleMouseMove)
    componentRef.value?.addEventListener('mousedown', handleMouseDown)
    componentRef.value?.addEventListener('mouseup', handleMouseUp)
    componentRef.value?.addEventListener('mouseleave', handleMouseLeave)
  }

  function unregister() {
    componentRef.value?.removeEventListener('mousemove', handleMouseMove)
    componentRef.value?.removeEventListener('mousedown', handleMouseDown)
    componentRef.value?.removeEventListener('mouseup', handleMouseUp)
    componentRef.value?.removeEventListener('mouseleave', handleMouseLeave)
  }

  return { state, register, unregister }
}
