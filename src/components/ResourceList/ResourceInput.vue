<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { z } from 'zod'

export type Props = {
  name: string
  onChange: (name: string) => void
}

const props = defineProps<Props>()

const input = ref<HTMLInputElement>()

function changeName() {
  if (!input.value?.value) return

  const valid = z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_\- ]+$/)
    .safeParse(input.value?.value)

  if (!valid.success) {
    input.value.value = props.name
    return
  }

  props.onChange(valid.data)
}

function onEnter(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    input.value?.blur()
  }
}

onMounted(() => {
  input.value?.focus()

  input.value?.addEventListener('keydown', onEnter)
})

onUnmounted(() => {
  input.value?.removeEventListener('keydown', onEnter)
})
</script>

<template>
  <input class="text-black grow max-w-full" ref="input" :value="props.name" @blur="changeName" />
</template>
