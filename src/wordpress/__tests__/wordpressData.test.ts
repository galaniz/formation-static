/**
 * WordPress - Data Test
 */

/* Imports */

import { inspect } from 'node:util'
import type { RenderItem } from '../../render/renderTypes.js'
import { it, expect, describe, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { getWordPressData, getAllWordPressData } from '../wordpressData.js'
import { mockFetchErrorMessage } from '../../../tests/types.js'
import { mockWordPressFetch } from './wordpressDataMock.js'
import { filters, addFilter } from '../../utils/filter/filter.js'
import { config } from '../../config/config.js'
import { posts } from '../../../tests/data/wordpress/posts.js'
import { pages } from '../../../tests/data/wordpress/pages.js'
import { menus } from '../../../tests/data/wordpress/menus.js'
import { menuItems } from '../../../tests/data/wordpress/menu-items.js'

/* Mock fetch */

beforeAll(() => {
  vi.stubGlobal('fetch', mockWordPressFetch)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

/* Test getWordPressData */

describe('getWordPressData()', () => {
  beforeEach(() => {
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

  afterEach(() => {
    filters.set('cacheData', new Set())
    config.renderTypes = {}
    config.env.prod = false
    config.env.cache = false
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

  it('should throw an error if id does not exist', async () => {
    await expect(async () => await getWordPressData('posts', 'posts/0')).rejects.toThrowError(mockFetchErrorMessage.data)
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

  it('should return array of posts and run cache filter', async () => {
    config.env.cache = true
    const cacheSet = vi.fn()

    addFilter('cacheData', async (data, args): Promise<undefined> => {
      const { key, type } = args

      if (key === 'posts' && type === 'set') {
        cacheSet(data)
      }
    })

    const result = await getWordPressData('posts', 'posts')

    expect(cacheSet).toHaveBeenCalledTimes(1)
    expect(cacheSet).toHaveBeenCalledWith(posts)
    expect(result).toEqual(posts)
  })

  it('should return array of posts from cache', async () => {
    config.env.cache = true
    const cacheGet = vi.fn()

    addFilter('cacheData', async (data, args): Promise<RenderItem[] | undefined> => {
      const { key, type } = args

      if (key === 'posts' && type === 'get') {
        cacheGet(data)
        return posts as RenderItem[]
      }

      return data
    })

    const result = await getWordPressData('posts', 'posts')

    expect(cacheGet).toHaveBeenCalledTimes(1)
    expect(cacheGet).toHaveBeenCalledWith([])
    expect(result).toEqual(posts)
  })

  it('should return array of pages with production credentials', async () => {
    config.env.prod = true
    config.renderTypes = {
      page: 'p',
      'core/paragraph': 'richText',
      'frm/custom': 'custom'
    }

    const result = await getWordPressData('pages', 'pages')

    expect(result).toEqual(pages)
  })

  it('should return post object with id 1', async () => {
    const result = await getWordPressData('posts', 'posts/1')

    expect(result).toEqual([posts.find((post) => post.id === '1')])
  })
})

/* Test getAllWordPressData */

describe('getAllWordPressData()', () => {
  afterEach(() => {
    config.renderTypes = {}
    config.partialTypes = [
      'navigationItem',
      'navigation'
    ]
  })

  it('should return throw an error if route does not exist', async () => {
    config.partialTypes = [
      'navigationItem',
      'navigation',
      'does-not-exist'
    ]

    await expect(async () => await getAllWordPressData()).rejects.toThrowError(mockFetchErrorMessage.route)
  })

  it('should return navigation items, navigation and content', async () => {
    config.renderTypes = {
      page: 'p',
      'core/paragraph': 'richText',
      'frm/custom': 'custom'
    }

    const result = await getAllWordPressData()
    const expectedResult = {
      navigationItem: menuItems,
      navigation: menus,
      content: {
        page: pages
      }
    }

    expect(result).toEqual(expectedResult)
  })
})
