/**
 * Redirects - Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach, beforeAll } from 'vitest'
import { readFile } from 'fs/promises'
import { redirects, setRedirects } from '../redirects.js'
import { createRedirectsFile } from '../redirectsFile.js'

/* Test setRedirects */

describe('setRedirects()', () => {
  afterEach(() => {
    redirects.length = 0
  })

  it('should return false and not set redirects if no data', () => {
    const result = setRedirects()
    const expectedResult = false
    const expectedRedirects: string[] = []

    expect(result).toBe(expectedResult)
    expect(redirects).toEqual(expectedRedirects)
  })

  it('should return false and not set redirects if invalid data', () => {
    // @ts-expect-error - test invalid data
    const result = setRedirects(['', { redirect: 'test' }])
    const expectedResult = false
    const expectedRedirects: string[] = []

    expect(result).toBe(expectedResult)
    expect(redirects).toEqual(expectedRedirects)
  })

  it('should return true and set redirects', () => {
    const result = setRedirects([
      {
        redirect: [
          '/trailing /trailing/ 301'
        ]
      },
      {
        redirect: [
          '/test /test/ 302'
        ]
      }
    ])

    const expectedResult = true
    const expectedRedirects = [
      '/trailing /trailing/ 301',
      '/test /test/ 302'
    ]

    expect(result).toBe(expectedResult)
    expect(redirects).toEqual(expectedRedirects)
  })
})

/* Test createRedirectsFile */

describe('createRedirectsFile()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    redirects.length = 0
  })

  it('should throw error if path is null', async () => {
    // @ts-expect-error - test null path
    await expect(async () => { await createRedirectsFile(null) }).rejects.toThrowError()
  })

  it('should create redirects file', async () => {
    await createRedirectsFile('/files/redirects')

    const file = await readFile('/files/redirects', { encoding: 'utf8' })
    const expectedFile = ''

    expect(file).toBe(expectedFile)
  })

  it('should create redirects file with data', async () => {
    setRedirects([
      {
        redirect: [
          '/trailing /trailing/ 301 '
        ]
      },
      {
        redirect: [
          '/test /test/ 302 '
        ]
      }
    ])

    await createRedirectsFile('/files/folder/redirects')

    const file = await readFile('/files/folder/redirects', { encoding: 'utf8' })
    const expectedFile = '/trailing /trailing/ 301 \n/test /test/ 302'

    expect(file).toBe(expectedFile)
  })
})
