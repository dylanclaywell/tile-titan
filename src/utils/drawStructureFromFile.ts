import type { FileType } from '@/types/file'
import { drawTileLayerToCanvas } from './drawTileLayerToCanvas'
import { usePerformanceStore } from '@/stores/performance'

async function getStructureData(structureFile: FileType): Promise<string> {
  const performanceStore = usePerformanceStore()

  const data = performanceStore.renderedStructureData.find((s) => s.id === structureFile.id)

  if (data) {
    console.log('using cached data')
    return data.data
  }

  const structureCanvas = document.createElement('canvas')
  const structureCanvasContext = structureCanvas?.getContext('2d')

  if (!structureCanvasContext) return ''

  structureCanvas.width = structureFile?.width * structureFile.tileWidth ?? 0
  structureCanvas.height = structureFile?.height * structureFile.tileHeight ?? 0

  for (const layer of structureFile?.layers ?? []) {
    if (layer.type !== 'tile') continue
    await drawTileLayerToCanvas({
      layer,
      canvas: structureCanvas,
      tileWidth: structureFile?.tileWidth ?? 0,
      tileHeight: structureFile?.tileHeight ?? 0,
    })
  }

  const src = structureCanvas.toDataURL()

  performanceStore.addRenderedStructureData({
    id: structureFile.id,
    data: src,
  })

  return src
}

export async function drawStructureFromFile({
  canvas,
  structureFile,
  x,
  y,
}: {
  canvas: HTMLCanvasElement
  structureFile: FileType
  x: number
  y: number
}) {
  const canvasContext = canvas?.getContext('2d')
  if (!canvasContext) return

  const performanceStore = usePerformanceStore()

  const imageData = performanceStore.renderedStructureImages.find((s) => s.id === structureFile.id)

  if (imageData) canvasContext.drawImage(imageData.image, x, y)

  const image = new Image()

  image.src = await getStructureData(structureFile)

  image.onload = () => {
    canvasContext.drawImage(image, x, y)
    performanceStore.addRenderedStructureImage({
      id: structureFile.id,
      image,
    })
  }
}
