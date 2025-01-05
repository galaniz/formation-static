/**
 * Utils - File Path Test
 */

/* Imports */

import { it, expect, describe, beforeEach } from 'vitest'
import { vol } from 'memfs'
import { getFilePaths } from '../filePath.js'

/* Tests */

describe('getFilePaths()', () => {
  beforeEach(() => {
    vol.fromJSON({
      '/files/test/test.json': '',
      '/files/test/test.md': '',
      '/files/test.js': '',
      '/files/test.txt': ''
    })
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

    for await (const path of getFilePaths('/files/test')) {
      result.push(path)
    }

    const expectedResult = [
      '/files/test/test.json',
      '/files/test/test.md'
    ]

    expect(result).toEqual(expectedResult)
  })

  it('should return all file paths in the specified directory and nested directories', async () => {
    const result: string[] = []

    for await (const path of getFilePaths('/files')) {
      result.push(path)
    }

    const expectedResult = [
      '/files/test/test.json',
      '/files/test/test.md',
      '/files/test.js',
      '/files/test.txt'
    ]

    expect(result).toEqual(expectedResult)
  })
})
