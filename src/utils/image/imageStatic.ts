/**
 * Utils - Image Static
 */

/* Imports */

import type { ImagesStore, ImagesSharp } from './imageTypes.js'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { extname, resolve, basename, dirname } from 'node:path'
import { config } from '../../config/config.js'
import { getFilePaths } from '../file/filePaths.js'
import { isStringStrict } from '../string/string.js'
import { print } from '../print/print.js'

/**
 * Get and transform static images (quality and sizes)
 *
 * @return {Promise<PromiseSettledResult<sharp.OutputInfo>[]>}
 */
const setStaticImages = async (): Promise<Array<PromiseSettledResult<sharp.OutputInfo>>> => {
  const store: ImagesStore = {}

  try {
    const inputDir = config.image.inputDir
    const outputDir = config.image.outputDir
    const dataFile = config.image.dataFile

    if (!isStringStrict(inputDir) || !isStringStrict(outputDir)) {
      throw new Error('No input or output directories')
    }

    await mkdir(resolve(outputDir), { recursive: true })
    await mkdir(resolve(dirname(dataFile)), { recursive: true })

    const sharpImages: ImagesSharp[] = []

    for await (const path of getFilePaths(inputDir)) {
      if (path.includes('.DS_Store')) {
        continue
      }

      const ext = extname(path)
      const baseName = basename(path)
      const [base] = baseName.split(ext)

      /* Base required */

      if (base === undefined) {
        continue
      }

      /* Nested files */

      let [, folders] = dirname(path).split(`${inputDir}/`)

      if (folders !== undefined && folders !== baseName) {
        await mkdir(resolve(outputDir, folders), { recursive: true })
      } else {
        folders = ''
      }

      /* Store meta data */

      const metadata = await sharp(path).metadata()
      const id = `${folders !== '' ? `${folders}/` : ''}${base}`
      const [, format] = ext.split('.')

      if (format === undefined) {
        continue
      }

      const {
        width = 0,
        height = 0,
        size: fileSize = 0,
        format: fileFormat = 'jpeg'
      } = metadata

      store[id] = {
        path: id,
        name: baseName,
        size: fileSize,
        type: `image/${fileFormat}`,
        format,
        width,
        height
      }

      /* Sizes */

      let sizes = [...config.image.sizes]

      sizes.push(width)

      sizes = sizes.filter(s => s <= width)

      sizes.forEach((size) => {
        sharpImages.push({
          size,
          ext: format,
          path: resolve(path),
          newPath: resolve(outputDir, folders, `${base}${size !== width ? `@${size}` : ''}`)
        })
      })
    }

    if (sharpImages.length === 0) {
      throw new Error('No static images to transform')
    }

    if (isStringStrict(dataFile)) {
      await writeFile(resolve(dataFile), JSON.stringify(store))
    }

    return await Promise.allSettled(
      sharpImages.map(async (c) => {
        const { size, path, newPath, ext } = c

        await sharp(path)
          .resize(size)
          .toFile(`${newPath}.${ext}`)

        const create = await sharp(path)
          .webp({ quality: config.image.quality })
          .resize(size)
          .toFile(`${newPath}.webp`)

        return create
      })
    )
  } catch (error) {
    print('[SSF] Error transforming static images', error)
  }

  return []
}

/* Exports */

export { setStaticImages }
