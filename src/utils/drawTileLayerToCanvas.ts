import type { TileLayerType } from '@/types/layer'

function draw({
  image,
  context,
  x,
  y,
  tileWidth,
  tileHeight,
}: {
  image: HTMLImageElement
  context: CanvasRenderingContext2D
  x: number
  y: number
  tileWidth?: number
  tileHeight?: number
}) {
  return new Promise<void>((resolve) => {
    image.onload = () => {
      context.drawImage(image, x * (tileWidth ?? 0), y * (tileHeight ?? 0))
      resolve()
    }
  })
}

export async function drawTileLayerToCanvas({
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

  for (let y = 0; y < layer.data.length; y++) {
    for (let x = 0; x < layer.data[y].length; x++) {
      const tile = layer.data[y][x]

      if (!tile) continue

      const image = new Image()

      image.src = tile.tileData ?? ''

      await draw({ image, x, y, context, tileWidth, tileHeight })
    }
  }
}
