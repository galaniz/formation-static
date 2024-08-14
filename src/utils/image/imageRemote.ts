/**
 * Utils - Image Remote
 */

/* Imports */

import type { Images } from './imageTypes.js'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { config } from '../../config/config.js'
import { isStringStrict } from '../string/string.js'
import { isArrayStrict } from '../array/array.js'
import { print } from '../print/print.js'

/**
 * Promisify write function
 *
 * @private
 * @param {string} path
 * @param {Buffer} buffer
 * @return {Promise<void>}
 */
const _createFile = async (path: string, buffer: Buffer): Promise<void> => {
  return await new Promise((resolve, reject) => {
    createWriteStream(path).write(buffer, (error) => {
      if (error !== null && error !== undefined) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

/**
 * Download remote images to static images directory
 *
 * @param {Images[]} images
 * @return {Promise<PromiseSettledResult<void>[]>}
 */
const getRemoteImages = async (images: Images[]): Promise<Array<PromiseSettledResult<void>>> => {
  try {
    const inputDir = config.static.image.inputDir

    /* Input directory required */

    if (!isStringStrict(inputDir)) {
      throw new Error('No input directory')
    }

    /* Array of image objects required */

    if (!isArrayStrict(images)) {
      throw new Error('No images array')
    }

    /* Fetch and write images */

    return await Promise.allSettled(
      images.map(async (image) => {
        const { path, url, ext = 'jpg' } = image

        if (!isStringStrict(path) || !isStringStrict(url) || !isStringStrict(ext)) {
          return
        }

        const resp = await fetch(url)

        if (resp.ok) {
          const buffer = await resp.arrayBuffer()
          const fullPath = `${inputDir}/${path}.${ext}`
          const folders = fullPath.split('/')

          folders.pop()

          await mkdir(resolve(folders.join('/')), { recursive: true })

          return await _createFile(
            resolve(fullPath),
            Buffer.from(buffer)
          )
        }
      })
    )
  } catch (error) {
    print('[SSF] Error downloading remote images', error)
  }

  return []
}

/* Exports */

export { getRemoteImages }
