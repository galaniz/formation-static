/**
 * Utils - Json Test
 */

/* Imports */

import { it, expect, describe, afterEach } from 'vitest'
import { resolve } from 'node:path'
import { getJson, getJsonFile } from '../json.js'
import { setStore } from '../../../store/store.js'

/* Test getJson */

describe('getJson()', () => {
  it('should return undefined if value is null', () => {
    const value = null
    // @ts-expect-error
    const result = getJson(value)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if value is not a json string', () => {
    const value = '123'
    const result = getJson(value)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return object if value is a valid json string', () => {
    const value = '{"test": "test"}'
    const result = getJson(value)
    const expectedResult = { test: 'test' }

    expect(result).toEqual(expectedResult)
  })

  it('should return array if value is a valid json string', () => {
    const value = '[{"test": "test"}]'
    const result = getJson(value)
    const expectedResult = [{ test: 'test' }]

    expect(result).toEqual(expectedResult)
  })
})

/* Test getJsonFile */

describe('getJsonFile()', () => {
  afterEach(() => {
    setStore({})
  })

  it('should return undefined if path is null', async () => {
    const path = null
    // @ts-expect-error
    const result = await getJsonFile(path)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if file is a text file', async () => {
    const path = resolve(__dirname, './files/invalid.txt')
    const result = await getJsonFile(path, false)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if file contains invalid json', async () => {
    const path = resolve(__dirname, './files/invalid.json')
    const result = await getJsonFile(path, false)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return object if file contains valid json', async () => {
    const path = resolve(__dirname, './files/valid.json')
    const result = await getJsonFile(path, false)
    const expectedResult = [{ test: 'test' }]

    expect(result).toEqual(expectedResult)
  })

  it('should return object if store file contains valid json', async () => {
    setStore({}, 'src/utils/json/__tests__/files')

    const path = resolve(__dirname, './files/slugs.json')
    const result = await getJsonFile(path, false)
    const expectedResult = {
      slug: {
        contentType: 'page',
        id: '123'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  // TODO: Test filter
})
