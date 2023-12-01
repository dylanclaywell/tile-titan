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
    <div class="fixed top-0 left-0 w-screen h-screen z-50 bg-gray-800 opacity-50"></div>
    <div
      class="p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-md shadow-md space-y-4 max-w-md"
    >
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <p>{{ message }}</p>
      <div class="flex justify-end space-x-2">
        <button
          class="p-2 hover:bg-gray-200 rounded-md uppercase tracking-wide font-bold"
          @click="onCancel"
        >
          {{ cancelText }}
        </button>
        <button
          class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md tracking-wide uppercase font-bold"
          @click="onConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
