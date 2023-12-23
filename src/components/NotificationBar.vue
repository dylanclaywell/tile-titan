<script lang="ts" setup>
import { eventEmitter } from '@/events'
import { onMounted, ref } from 'vue'

// I could just use the value of notification to determine if the notification is visible or not, but I want to be able to animate the notification bar in and out
// and the animation looks weird if the notification is empty since it changes the height and width of the notification bar
const notification = ref<string>('placeholder')
const isVisible = ref(false)

onMounted(() => {
  eventEmitter.on('notification', (message: string) => {
    notification.value = message
    isVisible.value = true

    setTimeout(() => {
      isVisible.value = false
    }, 5000)
  })
})
</script>

<template>
  <div class="fixed top-2 left-1/2 -translate-x-1/2">
    <div
      :class="{
        'rounded p-2 shadow-lg bg-blue-300 transition-all whitespace-pre': true,
        '-translate-y-[calc(100%_+_1rem)]': !isVisible,
        'translate-y-0': isVisible,
      }"
    >
      {{ notification }}
    </div>
  </div>
</template>
