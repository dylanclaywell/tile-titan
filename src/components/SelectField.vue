<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import TextField from './TextField.vue'

export type Props = {
  options: {
    value: string
    label: string
  }[]
  onChange: (value: string) => void
  value: string
  placeholder?: string
  label?: string
  noResultsMessage?: string
}

const props = defineProps<Props>()

const isOpen = ref(false)
const root = ref<HTMLDivElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.value)
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function onClick(event: MouseEvent) {
  if (event.target instanceof HTMLElement && !root.value?.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onClick)
})
</script>

<template>
  <div ref="root" class="relative">
    <TextField
      :class="`
      '[&_i]:transition-all [&_i]:duration-300 [&_i]:ease-in-out min-w-[10rem]'
      ${
        isOpen
          ? '[&_i]:-rotate-180'
          : '[&_i]:rotate-0 [&_label]:border-b-0 [&_label]:rounded-bl-none [&_label]:rounded-br-none'
      }
    `"
      :label="props.label ?? ''"
      :readonly="true"
      :placeholder="props.placeholder"
      @click="toggleOpen"
      :value="selectedOption?.label"
      rightIcon="chevron-down"
    />
    <menu
      v-if="isOpen"
      className="absolute border border-gray-400 rounded-md bg-white z-50 top-full w-full flex flex-col rotate overflow-y-auto"
    >
      <div v-if="!options.length" class="p-4 text-gray-400">
        {{ props.noResultsMessage ?? 'No results' }}
      </div>
      <button
        v-for="option in options"
        v-bind:key="option.value"
        :class="`
          text-left p-4 first:rounded-t-md last:rounded-b-md transition-all
          ${
            option.value === value
              ? 'bg-blue-500 hover:bg-blue-400 text-white'
              : 'hover:bg-gray-200'
          }
          `"
        @click="
          () => {
            onChange(option.value)
            toggleOpen()
          }
        "
      >
        {{ option.label }}
      </button>
    </menu>
  </div>
</template>
