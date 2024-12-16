/**
 * Utils - Image Local
 */

/* Imports */

import type { ImageLocal, ImageProps } from './imageTypes.js'
import { extname, resolve, basename, dirname } from 'node:path'
import { mkdir, stat } from 'node:fs/promises'
import sharp from 'sharp'
import { config } from '../../config/config.js'
import { getFilePaths } from '../file/filePath.js'
import { isStringStrict } from '../string/string.js'
import { setStoreItem } from '../../store/store.js'
import { print } from '../print/print.js'

/**
 * Get and transform local images (quality and sizes)
 *
 * @return {Promise<PromiseSettledResult<sharp.OutputInfo>[]>}
 */
const setLocalImages = async (): Promise<Array<PromiseSettledResult<sharp.OutputInfo>>> => {
  try {
    /* Directory paths required */

    const inputDir = config.image.inputDir
    const outputDir = config.image.outputDir

    if (!isStringStrict(inputDir) || !isStringStrict(outputDir)) {
      throw new Error('No input or output directories')
    }

    await mkdir(resolve(outputDir), { recursive: true })

    /* Process images in input directory */

    const images: ImageLocal[] = []
    const meta: Record<string, ImageProps> = {}

    for await (const path of getFilePaths(inputDir)) {
      const ext = extname(path)
      const baseName = basename(path)
      const [base] = baseName.split(ext)

      /* Base required */

      if (!isStringStrict(base)) {
        continue
      }

      /* Nested files */

      let [, folders] = dirname(path).split(`${inputDir}/`)

      if (isStringStrict(folders) && folders !== baseName) {
        await mkdir(resolve(outputDir, folders), { recursive: true })
      } else {
        folders = ''
      }

      /* Image instance */

      const instance = await sharp(path)

      /* Store meta data */

      const metadata = await sharp(path).metadata()
      const stats = await stat(path)

      const {
        width = 0,
        height = 0,
        format: fileFormat = 'jpeg'
      } = metadata

      const id = `${folders !== '' ? `${folders}/` : ''}${base}`
      const [, format] = ext.split('.')

      if (!isStringStrict(format)) {
        continue
      }

      meta[id] = {
        path: id,
        name: baseName,
        type: `image/${fileFormat}`,
        format,
        size: stats.size,
        width,
        height
      }

      /* Sizes */

      let sizes = [...config.image.sizes]

      sizes.push(width)
      sizes = sizes.filter(s => s <= width)
      sizes.forEach((size) => {
        images.push({
          size,
          ext: format,
          path: resolve(path),
          newPath: resolve(outputDir, folders, `${base}${size !== width ? `@${size}` : ''}`),
          instance
        })
      })
    }

    if (images.length === 0) {
      throw new Error('No local images to transform')
    }

    setStoreItem('imageMeta', meta)

    /* Result */

    return await Promise.allSettled(
      images.map(async (image) => {
        const { size, instance, newPath, ext } = image

        await instance
          .clone()
          .resize(size)
          .toFile(`${newPath}.${ext}`)

        return await instance
          .clone()
          .resize(size)
          .webp({ quality: config.image.quality })
          .toFile(`${newPath}.webp`)
      })
    )
  } catch (error) {
    if (config.throwError) {
      throw error
    }

    print('[SSF] Error transforming local images', error)
  }

  /* Fallback */

  return []
}

/* Exports */

export { setLocalImages }
