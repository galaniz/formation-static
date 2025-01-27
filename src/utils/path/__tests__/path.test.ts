/**
 * Utils - Path Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach } from 'vitest'
import { getPath, getPathDepth } from '../path.js'
import { config } from '../../../config/config.js'

/* Test getPath */

describe('getPath()', () => {
  beforeEach(() => {
    config.env.dir = '/root'
  })

  afterEach(() => {
    config.env.dir = ''
  })

  it('should return empty string if file is null', () => {
    const file = null
    // @ts-expect-error - test null file
    const result = getPath(file)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if file is an empty string', () => {
    const file = ''
    const result = getPath(file)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if root is not a string', () => {
    config.env.dir = ''

    const file = 'file'
    const result = getPath(file)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return path with root without adding a slash', () => {
    config.env.dir = '/root/'

    const file = 'file'
    const result = getPath(file)
    const expectedResult = '/root/file'

    expect(result).toBe(expectedResult)
  })

  it('should return path with root if file is a string', () => {
    const file = 'file'
    const result = getPath(file)
    const expectedResult = '/root/file'

    expect(result).toBe(expectedResult)
  })

  it('should return path with store dir if type is store', () => {
    const file = 'file'
    const result = getPath(file, 'store')
    const expectedResult = '/root/lib/store/file.json'

    expect(result).toBe(expectedResult)
  })

  it('should return path with serverless dir if type is serverless', () => {
    const file = 'file'
    const result = getPath(file, 'serverless')
    const expectedResult = '/root/functions/file.js'

    expect(result).toBe(expectedResult)
  })
})

/* Test getPathDepth */

describe('getPathDepth()', () => {
  it('should return empty string if path is not a string', () => {
    const path = null
    // @ts-expect-error - test null path
    const result = getPathDepth(path)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if path is an empty string', () => {
    const path = ''
    const result = getPathDepth(path)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return one folder path depth string', () => {
    const path = 'lib/folder'
    const result = getPathDepth(path)
    const expectedResult = '../'

    expect(result).toBe(expectedResult)
  })

  it('should return two folder path depth string', () => {
    const path = 'lib/folder/file'
    const result = getPathDepth(path)
    const expectedResult = '../../'

    expect(result).toBe(expectedResult)
  })
})
