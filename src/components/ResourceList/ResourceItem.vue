<script setup lang="ts">
export type Props = {
  id: string
  name: string
  icon?: string
  onDelete?: () => void
  onEdit?: () => void
  onShow?: () => void
  onUp?: () => void
  onDown?: () => void
  isVisible?: boolean
  isSelected?: boolean
}

const props = defineProps<Props>()

function del(event: Event) {
  props.onDelete?.()
  event.stopPropagation()
}

function edit(event: Event) {
  props.onEdit?.()
  event.stopPropagation()
}

function show(event: Event) {
  props.onShow?.()
  event.stopPropagation()
}

function up(event: Event) {
  props.onUp?.()
  event.stopPropagation()
}

function down(event: Event) {
  props.onDown?.()
  event.stopPropagation()
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
        v-if="props.onUp"
        :class="{
          'group-hover:visible invisible': true,
          'hover:text-cyan-800': isSelected,
          'hover:text-cyan-700': !isSelected,
        }"
        @click="up"
        title="Move up"
      >
        <i class="fa-solid fa-arrow-up"></i>
      </button>
      <button
        v-if="props.onDown"
        :class="{
          'group-hover:visible invisible': true,
          'hover:text-cyan-800': isSelected,
          'hover:text-cyan-700': !isSelected,
        }"
        @click="down"
        title="Move down"
      >
        <i class="fa-solid fa-arrow-down"></i>
      </button>
      <button
        v-if="props.onEdit"
        class="group-hover:visible invisible hover:text-green-600"
        @click="edit"
        title="Edit"
      >
        <i class="fa-solid fa-pencil"></i>
      </button>
      <button
        v-if="props.onShow"
        class="group-hover:visible invisible hover:text-yellow-600"
        @click="show"
        :title="props.isVisible ? 'Hide' : 'Show'"
      >
        <i :class="`fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`"></i>
      </button>
      <button
        v-if="props.onDelete"
        class="group-hover:visible invisible hover:text-red-600"
        @click="del"
        title="Delete"
      >
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  </button>
</template>

<style></style>
