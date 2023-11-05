import z from 'zod'

export const Tileset = z.object({
  id: z.string(),
  name: z.string(),
  blob: z.string(),
})

export type TilesetType = z.infer<typeof Tileset>
