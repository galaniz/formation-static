/**
 * Utils - Image Local Test
 */

/* Use temporary fs instead of memfs */

vi.unmock('node:fs')
vi.unmock('node:fs/promises')

/* Imports */

import { it, expect, describe, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { rm, mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { setLocalImages } from '../imageLocal.js'
import { config } from '../../../config/config.js'
import { store } from '../../../store/store.js'

/* Tests */

describe('setLocalImages()', () => {
  let tempDir: string
  let inputDir: string
  let outputDir: string

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'image-local-test-'))
    inputDir = join(tempDir, 'input')
    outputDir = join(tempDir, 'output')

    const sharpArgs = {
      create: {
        width: 8,
        height: 8,
        channels: 3 as const,
        background: { r: 255, g: 255, b: 255 }
      }
    }

    await mkdir(`${inputDir}/test`, { recursive: true })
    await writeFile(join(inputDir, 'test.jpg'), await sharp(sharpArgs).jpeg().toBuffer())
    await writeFile(join(inputDir, 'test', 'test.png'), await sharp(sharpArgs).png().toBuffer())

    config.image.inputDir = inputDir
    config.image.outputDir = outputDir
  })

  afterAll(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  beforeEach(() => {
    config.image.inputDir = inputDir
    config.image.outputDir = outputDir
    store.imageMeta = {}
  })

  it('should throw anerror if no input or output directories', async () => {
    config.image.inputDir = ''
    config.image.outputDir = ''

    await expect(async () => await setLocalImages()).rejects.toThrowError('No input or output directories')
  })

  it('should return an array of fulfilled promises', async () => {
    const result = await setLocalImages()
    const expectedResult = [
      {
        status: 'fulfilled',
        value: {
          format: 'webp',
          width: 8,
          height: 8,
          channels: 3,
          premultiplied: false,
          size: 44
        }
      },
      {
        status: 'fulfilled',
        value: {
          format: 'webp',
          width: 8,
          height: 8,
          channels: 3,
          premultiplied: false,
          size: 44
        }
      }
    ]

    const meta = store.imageMeta
    const expectedMeta = {
      test: {
        path: 'test',
        name: 'test.jpg',
        type: 'image/jpeg',
        format: 'jpg',
        size: 267,
        width: 8,
        height: 8
      },
      'test/test': {
        path: 'test/test',
        name: 'test.png',
        type: 'image/png',
        format: 'png',
        size: 93,
        width: 8,
        height: 8
      }
    }

    expect(result).toEqual(expectedResult)
    expect(meta).toEqual(expectedMeta)
  })
})
