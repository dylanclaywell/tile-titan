<script setup lang="ts">
export type Props = {
  id: string
  name: string
  icon?: string
  onDelete?: () => void
  onEdit?: () => void
  onShow?: () => void
  isVisible?: boolean
  isSelected?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <button
    :class="`group flex items-center p-2 gap-2 select-none  ${
      props.isSelected ? 'hover:bg-blue-400 bg-blue-500' : 'hover:bg-gray-200'
    }`"
  >
    <i v-if="props.icon" :class="`text-gray-500 fa-solid fa-${props.icon}`"></i>
    {{ props.name }}
    <div class="flex-grow flex justify-end space-x-2">
      <button
        v-if="props.onEdit"
        class="group-hover:visible invisible hover:text-green-600"
        @click="props.onEdit"
      >
        <i class="fa-solid fa-pencil"></i>
      </button>
      <button
        v-if="props.onShow"
        class="group-hover:visible invisible hover:text-yellow-600"
        @click="props.onShow"
      >
        <i :class="`fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`"></i>
      </button>
      <button
        v-if="props.onDelete"
        class="group-hover:visible invisible hover:text-red-600"
        @click="props.onDelete"
      >
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  </button>
</template>

<style></style>
