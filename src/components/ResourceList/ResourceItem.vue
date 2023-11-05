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

function del(event: Event) {
  event.stopPropagation()
  props.onDelete?.()
}

function edit(event: Event) {
  event.stopPropagation()
  props.onEdit?.()
}

function show(event: Event) {
  event.stopPropagation()
  props.onShow?.()
}
</script>

<template>
  <button
    :class="`group flex items-center p-2 gap-2 select-none  ${
      props.isSelected ? 'text-white hover:bg-blue-500 bg-blue-600' : 'text-black hover:bg-gray-200'
    }`"
  >
    <i
      v-if="props.icon"
      :class="`fa-solid fa-${props.icon} ${props.isSelected ? 'text-white' : 'text-gray-500'}`"
    ></i>
    {{ props.name }}
    <div class="flex-grow flex justify-end space-x-2">
      <button
        v-if="props.onEdit"
        class="group-hover:visible invisible hover:text-green-600"
        @click="edit"
      >
        <i class="fa-solid fa-pencil"></i>
      </button>
      <button
        v-if="props.onShow"
        class="group-hover:visible invisible hover:text-yellow-600"
        @click="show"
      >
        <i :class="`fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`"></i>
      </button>
      <button
        v-if="props.onDelete"
        class="group-hover:visible invisible hover:text-red-600"
        @click="del"
      >
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  </button>
</template>

<style></style>
