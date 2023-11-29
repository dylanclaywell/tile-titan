<script lang="ts" setup>
export type Props = {
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})
</script>

<template>
  <div>
    <div class="fixed top-0 left-0 w-screen h-screen blur"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Hello world</div>
  </div>
</template>
