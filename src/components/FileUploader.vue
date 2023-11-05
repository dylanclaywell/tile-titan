<script lang="ts" setup>
export type Props = {
  onChange: (e: Event) => void
  name: string
}

const props = defineProps<Props>()
</script>

<template>
  <label :title="props.name" className="relative bg-blue inline-block">
    <slot></slot>
    <input type="file" className="hidden" @change="props.onChange" />
  </label>
</template>
