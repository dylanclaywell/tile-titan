<script setup lang="ts">
import { defineProps } from 'vue'

export type Props = {
  name: string
}

const props = defineProps<Props>()
</script>

<template>
  <h1 class="p-2 text-lg text-gray-400">{{ props.name }}</h1>
  <div class="flex flex-col">
    <slot></slot>
  </div>
</template>

<style></style>
