/**
 * Utils - Image Remote
 */

/* Imports */

import type { ImageRemote } from './imageTypes.js'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { config } from '../../config/config.js'
import { isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'

/**
 * Download remote images to local images directory
 *
 * @param {ImageRemote[]} images
 * @return {Promise<string[]>}
 */
const getRemoteImages = async (images: ImageRemote[]): Promise<string[]> => {
  /* Input directory required */

  const inputDir = config.image.inputDir

  if (!isStringStrict(inputDir)) {
    throw new Error('No input directory')
  }

  /* Array of image objects required */

  if (!isArrayStrict(images)) {
    throw new Error('No images array')
  }

  /* Fetch and write images */

  return await Promise.all(
    images.map(async (image) => {
      const { path, url, format = 'jpg' } = image

      if (!isStringStrict(path) || !isStringStrict(url) || !isStringStrict(format)) {
        throw new Error('No path, url or format')
      }

      const resp = await fetch(url)

      if (!resp.ok) {
        throw new Error('Failed to fetch image')
      }

      const buffer = await resp.arrayBuffer()
      const fullPath = `${inputDir}/${path}.${format}`
      const folders = fullPath.split('/')

      folders.pop()

      await mkdir(resolve(folders.join('/')), { recursive: true })
      await writeFile(resolve(fullPath), Buffer.from(buffer))

      return fullPath
    })
  )
}

/* Exports */

export { getRemoteImages }
