import { defineStore } from 'pinia'
import { ref } from 'vue'
import { z } from 'zod'

export const RenderedStructureSchema = z.object({
  id: z.string(),
  data: z.string(),
})
export type RenderedStructure = z.infer<typeof RenderedStructureSchema>

export const RenderedStructureImageSchema = z.object({
  id: z.string(),
  image: z.instanceof(Image),
})
export type RenderedStructureImage = z.infer<typeof RenderedStructureImageSchema>

export const usePerformanceStore = defineStore('performance', () => {
  const renderedStructureData = ref<RenderedStructure[]>([])
  const renderedStructureImages = ref<RenderedStructureImage[]>([])

  const addRenderedStructureData = (data: RenderedStructure) => {
    renderedStructureData.value.push(data)
  }

  const setRenderedStructureData = (data: RenderedStructure[]) => {
    renderedStructureData.value = data
  }

  const addRenderedStructureImage = (data: RenderedStructureImage) => {
    renderedStructureImages.value.push(data)
  }

  const setRenderedStructureImage = (data: RenderedStructureImage[]) => {
    renderedStructureImages.value = data
  }

  return {
    renderedStructureData,
    addRenderedStructureData,
    setRenderedStructureData,

    renderedStructureImages,
    addRenderedStructureImage,
    setRenderedStructureImage,
  }
})
