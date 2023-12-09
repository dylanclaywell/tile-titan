import type { FileType } from '@/types/file'
import { drawTileLayerToCanvas } from './drawTileLayerToCanvas'

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
  const image = new Image()
  const structureCanvas = document.createElement('canvas')
  const canvasContext = canvas?.getContext('2d')
  const structureCanvasContext = structureCanvas?.getContext('2d')

  if (!canvasContext || !structureCanvasContext) return

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

  image.src = structureCanvas.toDataURL() ?? ''

  image.onload = () => {
    canvasContext.drawImage(image, x, y)
  }
}
