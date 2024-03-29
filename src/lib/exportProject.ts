import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import type { FileType } from '../types/file'

// TODO need to type tilesets
export async function exportProject(files: FileType[], tilesets: any[]) {
  const zip = new JSZip()

  const tilesetFolders = zip.folder('tilesets')

  if (!tilesetFolders) {
    return
  }

  for (const tileset of tilesets) {
    if (!tileset.blob) {
      continue
    }
    const blob = await (await fetch(tileset.blob)).blob()
    const tilesetFolder = tilesetFolders.folder(tileset.name)

    if (!tilesetFolder) {
      continue
    }

    tilesetFolder.file(`${tileset.name}.png`, blob, {
      base64: true,
    })
    tilesetFolder.file(
      'metadata.json',
      JSON.stringify(
        {
          name: tileset.name,
          id: tileset.id,
        },
        null,
        2,
      ),
    )
  }

  for (const file of files) {
    const modifiedLayers = file.layers.map((layer) => ({
      ...layer,
      data:
        layer.type === 'tile'
          ? layer.data.map((row) =>
              row.map((tile) => ({
                tilesetId: tile.tilesetId,
                // Specifically exclude tileData since it's not needed in the exported file
                tilesetName: tile.tilesetName,
                tilesetX: tile.tilesetX,
                tilesetY: tile.tilesetY,
              })),
            )
          : layer.data,
    }))
    const modifiedFile = {
      ...file,
      layers: modifiedLayers,
    }

    zip.file(`${file.name}.json`, JSON.stringify(modifiedFile, null, 2))
  }

  zip.file(
    'filemap.json',
    JSON.stringify(
      files.reduce(
        (acc, file) => ({
          ...acc,
          [file.id]: file.name,
        }),
        {},
      ),
      null,
      2,
    ),
  )

  const zipFile = await zip.generateAsync({ type: 'blob' })

  saveAs(zipFile, 'tilemaps.zip')
}
