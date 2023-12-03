import type { FileType } from '@/types/file'
import type { LayerType, TileLayerType } from '@/types/layer'

export function drawTileLayerToCanvas({
  canvas,
  layer,
  tileWidth,
  tileHeight,
}: {
  canvas: HTMLCanvasElement
  layer: TileLayerType
  tileWidth: number
  tileHeight: number
}) {
  const context = canvas.getContext('2d')

  if (!context) return

  layer.data.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (!tile) return

      const image = new Image()

      image.src = tile.tileData ?? ''

      image.onload = () => {
        context.drawImage(image, x * (tileWidth ?? 0), y * (tileHeight ?? 0))
      }
    })
  })
}
