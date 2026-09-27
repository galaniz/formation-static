/**
 * Contentful - Data Test
 */

/* Imports */

import type { RenderItem } from '../../render/renderTypes.js'
import type { CacheData } from '../../filters/filtersTypes.js'
import { it, expect, describe, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { testResetStore } from '../../../tests/utils.js'
import { getContentfulData, getAllContentfulData } from '../contentfulData.js'
import { mockFetchErrorMessage } from '../../../tests/types.js'
import { mockContentfulFetch } from './contentfulDataMock.js'
import { addFilter, resetFilters } from '../../filters/filters.js'
import { setStoreItem } from '../../store/store.js'
import { config } from '../../config/config.js'
import { pages } from '../../../tests/data/contentful/page.js'
import { pagesFr } from '../../../tests/data/contentful/pageFr.js'
import { navigations } from '../../../tests/data/contentful/navigation.js'
import { navigationsFr } from '../../../tests/data/contentful/navigationFr.js'
import { navigationItems } from '../../../tests/data/contentful/navigationItem.js'
import { navigationItemsFr } from '../../../tests/data/contentful/navigationItemFr.js'
import { taxonomies } from '../../../tests/data/contentful/taxonomy.js'
import { terms } from '../../../tests/data/contentful/term.js'
import { posts } from '../../../tests/data/contentful/post.js'
import { postsFr } from '../../../tests/data/contentful/postFr.js'
import rawPosts from '../../../tests/data/contentful/post.json' with { type: 'json' }
import { normalJsonKeys } from '../contentfulDataNormal.js'

/* Mock fetch */

beforeAll(() => {
  vi.stubGlobal('fetch', mockContentfulFetch)
})

/* Test getContentfulData */

describe('getContentfulData()', () => {
  beforeEach(() => {
    config.cms.name = 'contentful'
    config.cms.space = 'abc123'
    config.cms.devCredential = 'lipsum'
    config.cms.devHost = 'preview.contentful.com'
    config.cms.prodCredential = 'lipsum'
    config.cms.prodHost = 'cdn.contentful.com'
    config.cms.env = 'master'
    config.wholeTypes = ['page', 'post']
    config.partialTypes = ['navigation', 'navigationItem']
    normalJsonKeys.add('json')
  })

  afterEach(() => {
    config.cms = {
      name: '',
      space: '',
      prodUser: '',
      prodCredential: '',
      prodHost: '',
      devUser: '',
      devCredential: '',
      devHost: ''
    }

    config.renderTypes = {
      button: 'btn'
    }

    config.env.prod = false
    config.env.cache = false
    config.wholeTypes = []
    config.partialTypes = []
    normalJsonKeys.clear()
    testResetStore()
    resetFilters()
  })

  it('should throw an error if key is empty', async () => {
    await expect(async () => await getContentfulData('')).rejects.toThrow('No key')
  })

  it('should throw an error if no config credentials', async () => {
    config.cms.space = ''
    config.cms.devCredential = ''
    config.cms.devHost = ''
    config.cms.prodCredential = ''
    config.cms.prodHost = ''

    await expect(async () => await getContentfulData('key_2')).rejects.toThrow('No credentials')
  })

  it('should throw an error if invalid credentials', async () => {
    config.cms.devCredential = 'xyz'

    await expect(async () => await getContentfulData('key_4')).rejects.toThrow(mockFetchErrorMessage.auth)
  })

  it('should throw an error if content type does not exist', async () => {
    await expect(async () => await getContentfulData('key_5', {
      content_type: 'none'
    })).rejects.toThrow(mockFetchErrorMessage.contentType)
  })

  it('should return empty array if items is empty', async () => {
    const result = await getContentfulData('key_6', {
      content_type: 'empty'
    })

    expect(result).toEqual({
      items: [],
      total: 0,
      limit: 0,
      skip: 0
    })
  })

  it('should return first set of posts if limit is not -1', async () => {
    const result = await getContentfulData('posts_key', {
      content_type: 'post'
    })

    expect(result).toEqual({
      ...posts,
      items: posts.items.slice(0, 1)
    })
  })

  it('should return all posts in order if limit is -1', async () => {
    const result = await getContentfulData('posts_key_2', {
      content_type: 'post',
      limit: -1
    })

    const skips = mockContentfulFetch.mock.calls.map(([url]) => new URL(url).searchParams.get('skip'))
    const limits = mockContentfulFetch.mock.calls.map(([url]) => new URL(url).searchParams.get('limit'))

    expect(skips).toEqual(['0', '1', '2'])
    expect(limits).toEqual(['100', '100', '100'])
    expect(result).toEqual(posts)
  })

  it('should return all posts from skip param if limit is -1', async () => {
    const result = await getContentfulData('posts_key_skip', {
      content_type: 'post',
      limit: -1,
      skip: 1
    })

    const skips = mockContentfulFetch.mock.calls.map(([url]) => new URL(url).searchParams.get('skip'))

    expect(skips).toEqual(['1', '2'])
    expect(result).toEqual({
      ...posts,
      skip: 1,
      items: posts.items.slice(1)
    })
  })

  it('should get and set cache once with all posts if limit is -1', async () => {
    config.env.cache = true
    const cacheGet = vi.fn()
    const cacheSet = vi.fn()

    addFilter('cacheData', async (data, args) => {
      const { key, type } = args

      if (key === 'posts_key_3' && type === 'get') {
        await cacheGet()
      }

      if (key === 'posts_key_3' && type === 'set') {
        await cacheSet(data, args.rawData)
      }
    })

    await getContentfulData('posts_key_3', {
      content_type: 'post',
      limit: -1
    })

    expect(cacheGet).toHaveBeenCalledTimes(1)
    expect(cacheSet).toHaveBeenCalledTimes(1)
    expect(cacheSet).toHaveBeenCalledWith(posts, rawPosts)
  })

  it('should return array of pages and set cache', async () => {
    config.env.cache = true
    const cacheSet = vi.fn((data) => new Promise(resolve => { resolve(data) }))

    addFilter('cacheData', async (data, args) => {
      const { key, type } = args

      if (key === 'pages_key_2' && type === 'set') {
        await cacheSet(data)
      }
    })

    const result = await getContentfulData('pages_key_2', {
      content_type: 'page'
    })

    expect(cacheSet).toHaveBeenCalledTimes(1)
    expect(cacheSet).toHaveBeenCalledWith({
      items: pages.items,
      total: 5,
      limit: 100,
      skip: 0
    })

    expect(result).toEqual({
      items: pages.items,
      total: 5,
      limit: 100,
      skip: 0
    })
  })

  it('should return array of pages from cache', async () => {
    config.env.cache = true
    const cacheGet = vi.fn((data) => new Promise(resolve => { resolve(data) }))

    addFilter('cacheData', async (data, args) => {
      const { key, type } = args

      if (key === 'pages_key_3' && type === 'get') {
        await cacheGet(data)
        return {
          items: pages.items as RenderItem[],
          total: 5,
          limit: 100,
          skip: 0
        }
      }

      return data
    })

    const result = await getContentfulData('pages_key_3', {
      content_type: 'page'
    })

    expect(cacheGet).toHaveBeenCalledTimes(1)
    expect(cacheGet).toHaveBeenCalledWith(undefined)
    expect(result).toEqual({
      items: pages.items,
      total: 5,
      limit: 100,
      skip: 0
    })
  })

  it('should return array of one page with specified ID and prod credentials', async () => {
    config.env.prod = true

    const result = await getContentfulData('page_key_1', {
      content_type: 'page',
      'sys.id': 'JH7SZfgxuZ2SQrLvQHjQg'
    })

    expect(result).toEqual({
      items: [pages.items[0]],
      total: 5,
      limit: 100,
      skip: 0
    })
  })

  it('should throw an error if entry not found', async () => {
    await expect(async () => await getContentfulData('page_key_none', {
      content_type: 'page',
      'sys.id': 'none'
    })).rejects.toThrow('Bad fetch response')
  })

  it('should return array of taxonomies', async () => {
    const result = await getContentfulData('taxonomies_key_1', {
      content_type: 'taxonomy'
    })

    expect(result).toEqual({
      items: taxonomies.items,
      total: 2,
      limit: 100,
      skip: 0
    })
  })

  it('should return array of terms', async () => {
    const result = await getContentfulData('terms_key_1', {
      content_type: 'term'
    })

    expect(result).toEqual({
      items: terms.items,
      total: 1,
      limit: 100,
      skip: 0
    })
  })
})

/* Test getAllContentfulData */

describe('getAllContentfulData()', () => {
  beforeEach(() => {
    config.cms.locales = ['en-CA', 'fr-CA']
    config.cms.name = 'contentful'
    config.cms.space = 'abc123'
    config.cms.devCredential = 'lipsum'
    config.cms.devHost = 'preview.contentful.com'
    config.cms.prodCredential = 'lipsum'
    config.cms.prodHost = 'cdn.contentful.com'
    config.cms.env = 'master'
    config.wholeTypes = ['page', 'post', 'noItem']
    config.partialTypes = ['navigation', 'navigationItem']
    normalJsonKeys.add('json')
  })

  afterEach(() => {
    config.cms = {
      name: '',
      space: '',
      prodUser: '',
      prodCredential: '',
      prodHost: '',
      devUser: '',
      devCredential: '',
      devHost: ''
    }

    config.renderTypes = {
      button: 'btn'
    }

    config.wholeTypes = []
    config.partialTypes = []
    normalJsonKeys.clear()
    testResetStore()
    resetFilters()
  })

  it('should return throw an error if content type does not exist', async () => {
    config.wholeTypes = ['none']

    await expect(async () => await getAllContentfulData()).rejects.toThrow(mockFetchErrorMessage.contentType)
  })

  it('should return navigation and page data in all locales', async () => {
    const result = await getAllContentfulData()
    const expectedResult = {
      navigationItem: [
        ...navigationItems.items,
        ...navigationItemsFr.items
      ],
      navigation: [
        ...navigations.items,
        ...navigationsFr.items
      ],
      content: {
        page: [
          ...pages.items,
          ...pagesFr.items
        ],
        post: [
          ...posts.items,
          ...postsFr.items
        ],
        noItem: []
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should cache data by locale', async () => {
    config.env.cache = true
    const cache = new Map<string, CacheData>()

    addFilter('cacheData', async (data, args) => {
      const { key, type } = args

      if (type === 'set') {
        cache.set(key, data)
      }

      return await Promise.resolve(type === 'get' ? cache.get(key) : data)
    })

    await getAllContentfulData()
    const result = await getAllContentfulData()

    config.env.cache = false

    expect([...cache.keys()]).toEqual([
      'all_navigation',
      'all_navigation_fr-CA',
      'all_navigationItem',
      'all_navigationItem_fr-CA',
      'all_page',
      'all_page_fr-CA',
      'all_post',
      'all_post_fr-CA',
      'all_noItem',
      'all_noItem_fr-CA'
    ])

    expect(result?.content.page).toEqual([
      ...pages.items,
      ...pagesFr.items
    ])
  })

  it('should loop through all entries for whole types', async () => {
    config.cms.locales = []
    config.wholeTypes = ['post']

    const result = await getAllContentfulData()

    expect(result?.content.post).toEqual(posts.items)
  })

  it('should return navigation and page data from preview data', async () => {
    const result = await getAllContentfulData({
      previewData: {
        id: 'JH7SZfgxuZ2SQrLvQHjQg',
        contentType: 'page',
        locale: 'en-CA'
      }
    })

    const expectedResult = {
      navigationItem: [
        ...navigationItems.items
      ],
      navigation: [
        ...navigations.items
      ],
      content: {
        page: [pages.items[0]]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return navigation and page data from serverless data', async () => {
    setStoreItem('slugs', ['JH7SZfgxuZ2SQrLvQHjQg', 'page', 'fr-CA'], '/fr/null/')

    const result = await getAllContentfulData({
      serverlessData: {
        path: '/fr/null/',
        query: {}
      }
    })

    const expectedResult = {
      navigationItem: [],
      navigation: [],
      content: {
        page: [pagesFr.items[0]]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty data if serverless data invalid', async () => {
    // @ts-expect-error - test null data
    setStoreItem('slugs', [null, null, null], '/null/')

    const result = await getAllContentfulData({
      serverlessData: {
        path: '/null/',
        query: {}
      }
    })

    const expectedResult = {
      navigationItem: [],
      navigation: [],
      content: {
        page: []
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty data if serverless data does not exist', async () => {
    const result = await getAllContentfulData({
      serverlessData: {
        path: '/test/',
        query: {}
      }
    })

    const expectedResult = {
      navigationItem: [],
      navigation: [],
      content: {
        page: []
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should filter data to include test attribute', async () => {
    config.cms.locales = undefined

    addFilter('contentfulData', (data) => {
      return data.map(item => {
        return {
          ...item,
          test: 'test'
        }
      })
    })

    const result = await getAllContentfulData()
    const expectedResult = {
      navigationItem: navigationItems.items.map(item => {
        return {
          ...item,
          test: 'test'
        }
      }),
      navigation: navigations.items.map(menu => {
        return {
          ...menu,
          test: 'test'
        }
      }),
      content: {
        page: pages.items.map(page => {
          return {
            ...page,
            test: 'test'
          }
        }),
        post: posts.items.map(post => {
          return {
            ...post,
            test: 'test'
          }
        }),
        noItem: []
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should filter all data to include test array', async () => {
    addFilter('allData', (data, args) => {
      const { type } = args

      if (type !== 'contentful') {
        return data
      }

      return {
        ...data,
        content: {
          ...data.content,
          test: []
        }
      }
    })

    const result = await getAllContentfulData()
    const expectedResult = {
      navigationItem: [
        ...navigationItems.items,
        ...navigationItemsFr.items
      ],
      navigation: [
        ...navigations.items,
        ...navigationsFr.items
      ],
      content: {
        page: [
          ...pages.items,
          ...pagesFr.items
        ],
        post: [
          ...posts.items,
          ...postsFr.items
        ],
        noItem: [],
        test: []
      }
    }

    expect(result).toEqual(expectedResult)
  })
})
