<script setup lang="ts">
import { v4 as generateId } from 'uuid'

export type Props = {
  value?: string
  name?: string
  label: string
  hasError?: boolean
  helperText?: string
}

const props = defineProps<Props>()

const id = `textfield-${generateId()}`
const helperTextClass = `${props.hasError ? 'text-red-600' : 'text-gray-500'} text-xs`
</script>

<template>
  <div>
    <label class="uppercase text-sm tracking-widest text-gray-400" :for="id">
      {{ props.label }}
    </label>
    <input :value="props.value" :name="props.name" class="border rounded-md p-2 w-full" :id="id" />
    <span v-if="props.helperText" :class="helperTextClass">{{ props.helperText }}</span>
  </div>
</template>

<style scoped></style>
