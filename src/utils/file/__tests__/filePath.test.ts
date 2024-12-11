/**
 * Utils - File Path Test
 */

/* Imports */

import { it, expect, describe, afterAll, beforeAll } from 'vitest'
import { resolve } from 'node:path'
import { vol } from 'memfs'
import { getFilePaths } from '../filePath.js'

/* Tests */

describe('getFilePaths()', () => {
  beforeAll(() => {
    vol.mkdirSync(resolve(__dirname, 'files/test'), { recursive: true })
    vol.writeFileSync(resolve(__dirname, 'files/test/test.json'), '')
    vol.writeFileSync(resolve(__dirname, 'files/test/test.md'), '')
    vol.writeFileSync(resolve(__dirname, 'files/test.js'), '')
    vol.writeFileSync(resolve(__dirname, 'files/test.txt'), '')
  })

  afterAll(() => {
    vol.reset()
  })

  it('should throw an error if no directory is provided', async () => {
    await expect(async () => {
      const result: string[] = []
      // @ts-expect-error
      for await (const path of getFilePaths()) {
        result.push(path)
      }
    }).rejects.toThrowError()
  })

  it('should return all file paths in specified directory', async () => {
    const result: string[] = []

    for await (const path of getFilePaths(resolve(__dirname, 'files/test'))) {
      result.push(path)
    }

    const expectedResult = [
      resolve(__dirname, 'files/test/test.json'),
      resolve(__dirname, 'files/test/test.md')
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return all file paths in the specified directory and nested directories', async () => {
    const result: string[] = []

    for await (const path of getFilePaths(resolve(__dirname, 'files'))) {
      result.push(path)
    }

    const expectedResult = [
      resolve(__dirname, 'files/test/test.json'),
      resolve(__dirname, 'files/test/test.md'),
      resolve(__dirname, 'files/test.js'),
      resolve(__dirname, 'files/test.txt')
    ]

    expect(result).toEqual(expectedResult)
  })
})
