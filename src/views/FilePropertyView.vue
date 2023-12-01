<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import z from 'zod'

import TextField from '@/components/TextField.vue'
import { useEditorStore } from '@/stores/editor'
import { zodCheckboxValueToBoolean, zodStringToNumber } from '@/utils/zod'

const Form = z.object({
  name: z.string().min(1),
  width: z.string().transform(zodStringToNumber),
  height: z.string().transform(zodStringToNumber),
  tileWidth: z.string().transform(zodStringToNumber),
  tileHeight: z.string().transform(zodStringToNumber),
  isStructure: z.string().optional().transform(zodCheckboxValueToBoolean),
})

type FormType = z.infer<typeof Form>
type Errors = {
  [key in keyof FormType]?: string
}

const store = useEditorStore()

const errors = ref<Errors>({})

function submit(event: Event) {
  event.preventDefault()

  if (!(event.target instanceof HTMLFormElement)) return

  const formData = new FormData(event.target)
  const rawValues = Object.fromEntries(formData.entries())
  try {
    const values = Form.parse(rawValues)
    errors.value = {}

    store.updateFile(store.selectedFile?.id ?? '', values as any)
  } catch (error) {
    console.error(error)

    if (error instanceof z.ZodError) {
      const newErrors: Errors = {}

      error.issues.forEach((issue) => {
        newErrors[issue.path[0] as keyof FormType] = issue.message
      })

      errors.value = newErrors
    }
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    const form = document.activeElement?.closest('form')

    if (form instanceof HTMLFormElement && form.id === 'file-properties') {
      form.requestSubmit()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <form id="file-properties" class="space-y-4 p-4 border-t" @submit="submit">
    <TextField
      :value="store.selectedFile?.name"
      name="name"
      label="File Name"
      :has-error="Boolean(errors.name)"
      :helper-text="errors.name"
    />
    <TextField
      :value="store.selectedFile?.width.toString()"
      name="width"
      label="Width (in tiles)"
      :has-error="Boolean(errors.width)"
      :helper-text="errors.width"
    />
    <TextField
      :value="store.selectedFile?.height.toString()"
      name="height"
      label="Height (in tiles)"
      :has-error="Boolean(errors.height)"
      :helper-text="errors.height"
    />
    <TextField
      :value="store.selectedFile?.tileWidth.toString()"
      name="tileWidth"
      label="Tile Width (in pixels)"
      :has-error="Boolean(errors.tileWidth)"
      :helper-text="errors.tileWidth"
    />
    <TextField
      :value="store.selectedFile?.tileHeight.toString()"
      name="tileHeight"
      label="Tile Height (in pixels)"
      :has-error="Boolean(errors.tileHeight)"
      :helper-text="errors.tileHeight"
    />
    <label class="flex items-center gap-2">
      <input type="checkbox" />
      <span class="text-gray-700">Is Structure</span>
    </label>
  </form>
</template>

<style scoped></style>
