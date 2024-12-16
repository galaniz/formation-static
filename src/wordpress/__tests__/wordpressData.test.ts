/**
 * WordPress - Data Test
 */

/* Imports */

import { it, expect, describe, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import { getWordPressData, getAllWordPressData } from '../wordpressData.js'
import { mockFetchErrorMessage } from '../../../tests/types.js'
import { mockWordPressFetch } from './wordpressMock.js'
import { posts } from './data/posts.js'
import { inspect } from 'node:util'
import { pages } from './data/pages.js'
import { config } from '../../config/config.js'

/* Test getWordPressData */

describe('getWordPressData()', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', mockWordPressFetch)
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    config.renderTypes = {}
    config.cms = {
      name: 'wordpress',
      devUser: 'user',
      devCredential: 'pass',
      devHost: 'wp.com',
      space: 'space',
      prodUser: 'user',
      prodCredential: 'pass',
      prodHost: 'wp.com'
    }
  })

  it('should throw an error if no arguments are provided', async () => {
    // @ts-expect-error
    await expect(async () => await getWordPressData()).rejects.toThrowError('No key')
  })

  it('should throw an error only key is provided', async () => {
    // @ts-expect-error
    await expect(async () => await getWordPressData('key')).rejects.toThrowError('No route')
  })

  it('should throw an error if no config credentials', async () => {
    config.cms = {
      name: 'wordpress',
      devUser: '',
      devCredential: '',
      devHost: '',
      space: '',
      prodUser: '',
      prodCredential: '',
      prodHost: ''
    }

    await expect(async () => await getWordPressData('key', 'route')).rejects.toThrowError('No credentials')
  })

  it('should throw an error if host is invalid', async () => {
    config.cms.devHost = 'wp'

    await expect(async () => await getWordPressData('key', 'route')).rejects.toThrowError(mockFetchErrorMessage.url)
  })

  it('should throw an error if invalid credentials', async () => {
    config.cms.devUser = 'user1'
    config.cms.devCredential = 'pass1'

    await expect(async () => await getWordPressData('key', 'route')).rejects.toThrowError(mockFetchErrorMessage.auth)
  })

  it('should throw an error if route does not exist', async () => {
    await expect(async () => await getWordPressData('key', 'does-not-exist')).rejects.toThrowError(mockFetchErrorMessage.route)
  })

  it('should return empty array if data is empty array', async () => {
    const result = await getWordPressData('empty', 'empty')
    const expectedResult = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if data is array of null', async () => {
    const result = await getWordPressData('null', 'null')
    const expectedResult = []

    expect(result).toEqual(expectedResult)
  })

  it('should return array of posts', async () => {
    const result = await getWordPressData('posts', 'posts')

    expect(result).toEqual(posts)
  })

  it('should return array of pages', async () => {
    config.renderTypes = {
      page: 'p',
      'core/paragraph': 'richText',
      'frm/custom': 'custom'
    }

    const result = await getWordPressData('pages', 'pages')

    expect(result).toEqual(pages)
  })
})
