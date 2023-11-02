<script setup lang="ts">
import { v4 as generateId } from 'uuid'

export type Props = {
  label: string
}

const props = defineProps<Props>()

const id = generateId()
</script>

<template>
  <div>
    <label :for="`textfield-${id}`">{{ props.label }}</label>
    <input :id="`tetfield-${id}`" />
  </div>
</template>

<style scoped></style>
