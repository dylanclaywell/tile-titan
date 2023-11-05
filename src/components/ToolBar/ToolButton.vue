<script lang="ts" setup>
type Props = {
  isDisabled: boolean
  isSelected: boolean
  icon: string
  name: string
  onClick?: () => void
}

const props = defineProps<Props>()
</script>

<template>
  <button
    :title="name"
    :class="`w-10 h-10 cursor-default hover:bg-gray-200 hover:border hover:border-gray-300 rounded-md disabled:text-gray-400 disabled:border-0 disabled:bg-transparent ${
      props.isSelected ? 'bg-gray-300 border border-gray-400' : 'bg-white border border-transparent'
    }`"
    @click="props.onClick"
    :disabled="props.isDisabled"
  >
    <i :class="`fa-solid fa-${props.icon}`"></i>
  </button>
</template>

<style scoped>
/* Your component styles here */
</style>
