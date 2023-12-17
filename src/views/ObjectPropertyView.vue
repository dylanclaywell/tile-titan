<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import z from 'zod'

import TextField from '@/components/TextField.vue'
import { useEditorStore } from '@/stores/editor'
import { zodStringToNumber } from '@/utils/zod'

const Form = z.object({
  name: z.string().min(1),
  width: z.string().transform(zodStringToNumber),
  height: z.string().transform(zodStringToNumber),
  x: z.string().transform(zodStringToNumber),
  y: z.string().transform(zodStringToNumber),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Must be a six digit hex color code and include #'),
})

type FormType = z.infer<typeof Form>
type Errors = {
  [key in keyof FormType]?: string
}

const store = useEditorStore()

const selectedObject = computed(() => {
  if (!store.selectedObjectId || store.selectedLayer?.type !== 'object') return undefined

  return store.selectedLayer.data.find((o) => o.id === store.selectedObjectId)
})

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

function submitForm() {
  const form = document.activeElement?.closest('form')

  if (form instanceof HTMLFormElement && form.id === 'file-properties') {
    form.requestSubmit()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    submitForm()
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
  <form
    id="file-properties"
    class="space-y-4 p-4 basis-1/2 overflow-y-auto flex-shrink-0 flex-grow"
    @submit="submit"
  >
    <TextField
      :value="selectedObject?.name"
      name="name"
      label="Object Name"
      :has-error="Boolean(errors.name)"
      :helper-text="errors.name"
    />
    <TextField
      :value="selectedObject?.width.toString()"
      name="width"
      label="Width (in tiles)"
      :has-error="Boolean(errors.width)"
      :helper-text="errors.width"
    />
    <TextField
      :value="selectedObject?.height.toString()"
      name="height"
      label="Height (in tiles)"
      :has-error="Boolean(errors.height)"
      :helper-text="errors.height"
    />
    <TextField
      :value="selectedObject?.x.toString()"
      name="x"
      label="X Position"
      :has-error="Boolean(errors.x)"
      :helper-text="errors.x"
    />
    <TextField
      :value="selectedObject?.y.toString()"
      name="y"
      label="Y Position"
      :has-error="Boolean(errors.y)"
      :helper-text="errors.y"
    />
    <TextField
      :value="selectedObject?.color"
      name="color "
      label="Color"
      :has-error="Boolean(errors.color)"
      :helper-text="errors.color"
    />
  </form>
</template>

<style scoped></style>
