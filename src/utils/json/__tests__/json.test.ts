/**
 * Utils - Json Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach, beforeEach } from 'vitest'
import { vol } from 'memfs'
import { getJson, getJsonFile } from '../json.js'
import { setStore } from '../../../store/store.js'
import { config } from '../../../config/config.js'

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
  beforeEach(() => {
    vol.fromJSON({
      '/files/invalid.json': 'false',
      '/files/invalid.txt': 'Test text',
      '/files/valid.json': JSON.stringify([{
        test: 'test'
      }]),
      '/files/slugs.json': JSON.stringify([{
        slug: {
          contentType: 'page',
          id: '123'
        }
      }])
    })

    vi.mock('/files/invalid.json', () => ({
      default: 'false'
    }))

    vi.mock('/files/invalid.txt', () => ({
      default: 'Test text'
    }))

    vi.mock('/files/valid.json', () => ({
      default: [{
        test: 'test',
      }]
    }))

    vi.mock('/files/slugs.json', () => ({
      default: {
        slug: {
          contentType: 'page',
          id: '123'
        }
      }
    }))
  })

  afterEach(() => {
    vol.reset()
    setStore({})
    config.env.dir = ''
  })

  it('should return undefined if path is null', async () => {
    const path = null
    // @ts-expect-error
    const result = await getJsonFile(path)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if file is a text file', async () => {
    const path = '/files/invalid.txt'
    const result = await getJsonFile(path, false)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if file contains invalid json', async () => {
    const path = '/files/invalid.json'
    const result = await getJsonFile(path, false)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return object if file contains valid json', async () => {
    const path = '/files/valid.json'
    const result = await getJsonFile(path, false)
    const expectedResult = [{
      test: 'test'
    }]

    expect(result).toEqual(expectedResult)
  })

  it('should return object if store file contains valid json', async () => {
    config.env.dir = '/'
    setStore({}, 'files')

    const result = await getJsonFile('slugs')
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
