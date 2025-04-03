/**
 * Utils - Image Local
 */

/* Imports */

import type { ImageLocal, ImageProps } from './imageTypes.js'
import { extname, resolve, basename, dirname } from 'node:path'
import { mkdir, stat } from 'node:fs/promises'
import sharp from 'sharp'
import { getFilePaths } from '../file/filePath.js'
import { isStringStrict } from '../string/string.js'
import { setStoreItem } from '../../store/store.js'
import { config } from '../../config/config.js'

/**
 * Transform local images (quality and sizes)
 *
 * @return {Promise<sharp.OutputInfo[]>}
 */
const setLocalImages = async (): Promise<sharp.OutputInfo[]> => {
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
    const baseName = basename(path)
    const ext = extname(baseName)

    /* Extension required */

    if (!isStringStrict(ext)) {
      continue
    }

    /* Base required */

    const [base] = baseName.split(ext)

    if (!isStringStrict(base?.trim())) {
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

    const instance = sharp(path)

    /* Meta data */

    const metadata = await sharp(path).metadata()
    const stats = await stat(path)

    const {
      width = 0,
      height = 0,
      format: fileFormat = 'jpeg'
    } = metadata

    const id = `${folders ? `${folders}/` : ''}${base}`
    const format = ext.replace('.', '')

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

    if (!sizes.includes(width)) {
      sizes.push(width)
    }

    sizes = sizes.filter(s => s <= width)

    sizes.forEach(size => {
      images.push({
        size,
        format,
        path: resolve(path),
        newPath: resolve(outputDir, folders, `${base}${size !== width ? `@${size}` : ''}`),
        instance
      })
    })
  }

  if (!images.length) {
    throw new Error('No local images to transform')
  }

  setStoreItem('imageMeta', meta)

  /* Result */

  return await Promise.all(
    images.map(async (image) => {
      const { size, instance, newPath, format } = image

      await instance
        .clone()
        .resize(size)
        .toFile(`${newPath}.${format}`)

      return await instance
        .clone()
        .resize(size)
        .webp({ quality: config.image.quality })
        .toFile(`${newPath}.webp`)
    })
  )
}

/* Exports */

export { setLocalImages }
