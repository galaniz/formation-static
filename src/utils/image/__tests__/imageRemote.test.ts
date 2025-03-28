/**
 * Utils - Image Remote Test
 */

/* Imports */

import { it, expect, describe, afterEach, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import { rm, mkdtemp, mkdir, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mockImageRemoteFetch } from './imageRemoteMock.js'
import { getRemoteImages } from '../imageRemote.js'
import { config } from '../../../config/config.js'

/* Use temporary fs instead of memfs */

vi.unmock('node:fs')
vi.unmock('node:fs/promises')

/* Mock fetch */

beforeAll(() => {
  vi.stubGlobal('fetch', mockImageRemoteFetch)
})

/* Tests */

describe('getRemoteImages()', () => {
  let tempDir: string
  let inputDir: string

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'image-remote-test-'))
    inputDir = join(tempDir, 'input')

    await mkdir(inputDir, { recursive: true })

    config.image.inputDir = inputDir
  })

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  beforeEach(() => {
    config.image.inputDir = inputDir
  })

  afterEach(() => {
    config.image.inputDir = ''
  })

  it('should throw an error if no input directory', async () => {
    config.image.inputDir = ''

    await expect(async () => await getRemoteImages([])).rejects.toThrowError('No input directory')
  })

  it('should throw an error if no image data', async () => {
    await expect(async () => await getRemoteImages([])).rejects.toThrowError('No images array')
  })

  it('should throw an error if empty path, url or format', async () => {
    await expect(async () => await getRemoteImages([
      {
        // @ts-expect-error - test undefined path
        path: undefined,
        url: '',
        // @ts-expect-error - test null format
        format: null
      }
    ])).rejects.toThrowError('No path, url or format')
  })

  it('should throw an error if image does not exist', async () => {
    await expect(async () => await getRemoteImages([
      {
        path: 'test',
        url: 'https://test.com/404.png',
        format: 'png'
      }
    ])).rejects.toThrowError('Failed to fetch image')
  })

  it('should download image and return test image path', async () => {
    const images = await getRemoteImages([
      {
        path: 'test/test',
        url: 'https://test.com/test.jpg',
        format: 'jpg'
      }
    ])

    const expectedPath = join(inputDir, 'test', 'test.jpg')
    const testImage = await readFile(expectedPath)

    expect(images).toEqual([expectedPath])
    expect(testImage).toBeInstanceOf(Buffer)
    expect(testImage.length).toBeGreaterThan(0)
  })
})
