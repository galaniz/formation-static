/**
 * Utils - Image Local Test
 */

/* Imports */

import { it, expect, describe, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { rm, mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { setLocalImages } from '../imageLocal.js'
import { setStoreItem, getStoreItem } from '../../../store/store.js'
import { config } from '../../../config/config.js'

/* Use temporary fs instead of memfs */

vi.unmock('node:fs')
vi.unmock('node:fs/promises')

/* Tests */

describe('setLocalImages()', () => {
  let tempDir: string
  let inputDir: string
  let outputDir: string
  let tempEmptyDir: string
  let emptyInputDir: string
  let emptyOutputDir: string

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'image-local-test-'))
    inputDir = join(tempDir, 'input')
    outputDir = join(tempDir, 'output')
    tempEmptyDir = await mkdtemp(join(tmpdir(), 'image-local-test-empty-'))
    emptyInputDir = join(tempEmptyDir, 'input')
    emptyOutputDir = join(tempEmptyDir, 'output')

    const sharpArgs = {
      create: {
        width: 8,
        height: 8,
        channels: 3 as const,
        background: { r: 255, g: 255, b: 255 }
      }
    }

    await mkdir(`${inputDir}/test`, { recursive: true })
    await mkdir(emptyInputDir, { recursive: true })
    await writeFile(join(inputDir, ' .png'), await sharp(sharpArgs).png().toBuffer()) // Test skipping file with empty name
    await writeFile(join(inputDir, '.png'), await sharp(sharpArgs).png().toBuffer()) // Test skipping file without name
    await writeFile(join(inputDir, 'test.jpg'), await sharp(sharpArgs).jpeg().toBuffer())
    await writeFile(join(inputDir, 'test', 'test.png'), await sharp(sharpArgs).png().toBuffer())

    config.image.inputDir = inputDir
    config.image.outputDir = outputDir
  })

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true })
    await rm(tempEmptyDir, { recursive: true, force: true })
  })

  beforeEach(() => {
    config.image.inputDir = inputDir
    config.image.outputDir = outputDir
  })

  afterEach(() => {
    setStoreItem('imageMeta', {})
    config.image.inputDir = ''
    config.image.outputDir = ''
    config.image.sizes = [
      200, 400, 600, 800, 1000, 1200, 1600, 2000
    ]
  })

  it('should throw an error if no input or output directories', async () => {
    config.image.inputDir = ''
    config.image.outputDir = ''

    await expect(async () => await setLocalImages()).rejects.toThrowError('No input or output directories')
  })

  it('should throw an error if empty input directory', async () => {
    config.image.inputDir = emptyInputDir
    config.image.outputDir = emptyOutputDir

    await expect(async () => await setLocalImages()).rejects.toThrowError('No local images to transform')
  })

  it('should return an array of fulfilled promises and store image meta', async () => {
    config.image.sizes = [4, 8, 12]

    const result = await setLocalImages()
    const expectedResult = [
      {
        format: 'webp',
        width: 4,
        height: 4,
        channels: 3,
        premultiplied: false,
        size: 44
      },
      {
        format: 'webp',
        width: 8,
        height: 8,
        channels: 3,
        premultiplied: false,
        size: 44
      },
      {
        format: 'webp',
        width: 4,
        height: 4,
        channels: 3,
        premultiplied: false,
        size: 44
      },
      {
        format: 'webp',
        width: 8,
        height: 8,
        channels: 3,
        premultiplied: false,
        size: 44
      }
    ]

    const meta = getStoreItem('imageMeta')
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

  it('should return an array of fulfilled promises, store image meta and include natural width size', async () => {
    config.image.sizes = [4]

    const result = await setLocalImages()
    const expectedResult = [
      {
        format: 'webp',
        width: 4,
        height: 4,
        channels: 3,
        premultiplied: false,
        size: 44
      },
      {
        format: 'webp',
        width: 8,
        height: 8,
        channels: 3,
        premultiplied: false,
        size: 44
      },
      {
        format: 'webp',
        width: 4,
        height: 4,
        channels: 3,
        premultiplied: false,
        size: 44
      },
      {
        format: 'webp',
        width: 8,
        height: 8,
        channels: 3,
        premultiplied: false,
        size: 44
      }
    ]

    const meta = getStoreItem('imageMeta')
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
