/**
 * WordPress - Data Test
 */

/* Imports */

import type { CacheData } from '../../utils/filter/filterTypes.js'
import { it, expect, describe, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { testResetStore } from '../../../tests/utils.js'
import { getWordPressData, getAllWordPressData } from '../wordpressData.js'
import { normalMetaKeys } from '../wordpressDataNormal.js'
import { mockFetchErrorMessage } from '../../../tests/types.js'
import { mockWordPressFetch } from './wordpressDataMock.js'
import { addFilter, resetFilters } from '../../utils/filter/filter.js'
import { setStoreItem } from '../../store/store.js'
import { config } from '../../config/config.js'
import { posts } from '../../../tests/data/wordpress/posts.js'
import { pages } from '../../../tests/data/wordpress/pages.js'
import { menus } from '../../../tests/data/wordpress/menus.js'
import { menuItems } from '../../../tests/data/wordpress/menu-items.js'
import { categories } from '../../../tests/data/wordpress/categories.js'
import { tags } from '../../../tests/data/wordpress/tags.js'
import { media } from '../../../tests/data/wordpress/media.js'
import { taxonomies } from '../../../tests/data/wordpress/taxonomies.js'

/* Mock fetch */

beforeAll(() => {
  vi.stubGlobal('fetch', mockWordPressFetch)
})

/* Test getWordPressData */

describe('getWordPressData()', () => {
  beforeEach(() => {
    config.cms.name = 'wordpress'
    config.cms.devUser = 'user'
    config.cms.devCredential = 'pass'
    config.cms.devHost = 'wp.com'
    config.cms.prodUser = 'user'
    config.cms.prodCredential = 'pass'
    config.cms.prodHost = 'wp.com'
    config.wholeTypes = ['page']
    config.partialTypes = [
      'nav_menu_item',
      'nav_menu'
    ]

    normalMetaKeys.set('customMeta', 'custom')
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

    config.renderTypes = {}
    config.env.prod = false
    config.env.cache = false
    config.wholeTypes = []
    config.partialTypes = []
    normalMetaKeys.set('customMeta', 'custom')
    testResetStore()
    resetFilters()
  })

  it('should throw an error if no args are provided', async () => {
    // @ts-expect-error - test undefined params
    await expect(async () => await getWordPressData()).rejects.toThrowError('No args')
  })

  it('should throw an error if no key is provided', async () => {
    // @ts-expect-error - test undefined params
    await expect(async () => await getWordPressData({})).rejects.toThrowError('No key')
  })

  it('should throw an error if only key is provided', async () => {
    // @ts-expect-error - test undefined params
    await expect(async () => await getWordPressData({
      key: 'key_1'
    })).rejects.toThrowError('No route')
  })

  it('should throw an error if no config credentials', async () => {
    config.cms.name = 'wordpress'
    config.cms.devUser = ''
    config.cms.devCredential = ''
    config.cms.devHost = ''
    config.cms.prodUser = ''
    config.cms.prodCredential = ''
    config.cms.prodHost = ''

    await expect(async () => await getWordPressData({
      key: 'key_2',
      route: 'route'
    })).rejects.toThrowError('No credentials')
  })

  it('should throw an error if invalid credentials', async () => {
    config.cms.devUser = 'user1'
    config.cms.devCredential = 'pass1'

    await expect(async () => await getWordPressData({
      key: 'key_4',
      route: 'route'
    })).rejects.toThrowError(mockFetchErrorMessage.auth)
  })

  it('should throw an error if route does not exist', async () => {
    await expect(async () => await getWordPressData({
      key: 'key_5',
      route: 'does_not_exist'
    })).rejects.toThrowError(mockFetchErrorMessage.route)
  })

  it('should throw an error if id does not exist', async () => {
    await expect(async () => await getWordPressData({
      key: 'posts_key_1',
      route: 'posts/0'
    })).rejects.toThrowError(mockFetchErrorMessage.data)
  })

  it('should return empty array if data is empty array', async () => {
    const result = await getWordPressData({
      key: 'empty_key',
      route: 'empty',
      params: {
        _embed: 'wp:term' // Embed param coverage
      }
    })

    expect(result).toEqual({
      items: [],
      total: 0,
      pages: 0
    })
  })

  it('should return empty array if data is array of null', async () => {
    const result = await getWordPressData({
      key: 'null_key',
      route: 'null'
    })

    expect(result).toEqual({
      items: [],
      total: 4,
      pages: 0
    })
  })

  it('should return array of posts and set cache', async () => {
    config.env.cache = true
    const cacheSet = vi.fn((data) => new Promise(resolve => { resolve(data) }))

    addFilter('cacheData', async (data, args): Promise<undefined> => {
      const { key, type } = args

      if (key === 'posts_key_2' && type === 'set') {
        await cacheSet(data)
      }
    })

    const result = await getWordPressData({
      key: 'posts_key_2',
      route: 'posts'
    })

    expect(cacheSet).toHaveBeenCalledTimes(1)
    expect(cacheSet).toHaveBeenCalledWith({
      items: posts,
      total: 2,
      pages: 0
    })

    expect(result).toEqual({
      items: posts,
      total: 2,
      pages: 0
    })
  })

  it('should return array of posts from cache', async () => {
    config.env.cache = true
    const cacheGet = vi.fn((data) => new Promise(resolve => { resolve(data) }))

    addFilter('cacheData', async (data, args): Promise<CacheData> => {
      const { key, type } = args

      if (key === 'posts_key_3' && type === 'get') {
        await cacheGet(data)
        return {
          items: posts,
          total: 2,
          pages: 0
        }
      }

      return data
    })

    const result = await getWordPressData({
      key: 'posts_key_3',
      route: 'posts'
    })

    expect(cacheGet).toHaveBeenCalledTimes(1)
    expect(cacheGet).toHaveBeenCalledWith(undefined)
    expect(result).toEqual({
      items: posts,
      total: 2,
      pages: 0
    })
  })

  it('should return array of pages with prod credentials', async () => {
    config.env.prod = true
    config.renderTypes = {
      page: 'p',
      'core/paragraph': 'richText',
      'frm/custom': 'custom'
    }

    const result = await getWordPressData({
      key: 'pages_key',
      route: 'pages'
    })

    expect(result).toEqual({
      items: pages,
      total: 2,
      pages: 0
    })
  })

  it('should return array of one post with specified id', async () => {
    const result = await getWordPressData({
      key: 'posts_key_4',
      route: 'posts/1'
    })

    expect(result).toEqual({
      items: [posts.find((post) => post.id === '1')],
      total: 1,
      pages: 0
    })
  })

  it('should return array of categories', async () => {
    const result = await getWordPressData({
      key: 'categories_key_1',
      route: 'categories'
    })

    expect(result).toEqual({
      items: categories,
      total: 2,
      pages: 0
    })
  })

  it('should return array of tags', async () => {
    const result = await getWordPressData({
      key: 'tags_key',
      route: 'tags'
    })

    expect(result).toEqual({
      items: tags,
      total: 1,
      pages: 0
    })
  })

  it('should return array of media', async () => {
    const result = await getWordPressData({
      key: 'media_key',
      route: 'media'
    })

    expect(result).toEqual({
      items: media,
      total: 2,
      pages: 0
    })
  })

  it('should return array of taxonomies', async () => {
    const result = await getWordPressData({
      key: 'taxonomies_key_1',
      route: 'taxonomies'
    })

    expect(result).toEqual({
      items: taxonomies,
      total: 4,
      pages: 0
    })
  })

  it('should return categories and posts with taxonomies linked', async () => {
    await getWordPressData({
      key: 'taxonomies_key_2',
      route: 'taxonomies'
    })

    const categoriesResult = await getWordPressData({
      key: 'categories_key_2',
      route: 'categories'
    })

    const postsResult = await getWordPressData({
      key: 'posts_key_5',
      route: 'posts'
    })

    const uncategorized = {
      id: 'category',
      title: 'Categories',
      slug: 'category',
      contentTypes: [
        'post'
      ]
    }

    expect(categoriesResult).toEqual({
      items: categories.map(category => {
        return {
          ...category,
          taxonomy: uncategorized
        }
      }),
      total: 2,
      pages: 0
    })

    expect(postsResult).toEqual({
      items: posts.map(post => {
        const postCategories: Array<number | object> = [
          {
            id: '1',
            link: 'http://wp.com/category/uncategorized/',
            title: 'Uncategorized',
            slug: 'uncategorized',
            contentType: 'term',
            taxonomy: uncategorized
          }
        ]
  
        const postTags: object[] = []
  
        if (post.id === '1') {
          postCategories.push(2)
          postTags.push({
            id: '4',
            link: 'http://wp.com/tag/sample/',
            title: 'Sample',
            slug: 'sample',
            contentType: 'term',
            taxonomy: {
              id: 'post_tag',
              title: 'Tags',
              slug: 'tag',
              contentTypes: ['post']
            }
          })
        }
  
        return {
          ...post,
          categories: postCategories,
          tags: postTags
        }
      }),
      total: 2,
      pages: 0
    })
  })
})

/* Test getAllWordPressData */

describe('getAllWordPressData()', () => {
  beforeEach(() => {
    config.cms.name = 'wordpress'
    config.cms.devUser = 'user'
    config.cms.devCredential = 'pass'
    config.cms.devHost = 'wp.com'
    config.cms.prodUser = 'user'
    config.cms.prodCredential = 'pass'
    config.cms.prodHost = 'wp.com'
    config.env.prodUrl = 'http://wp.com'
    config.wholeTypes = ['page']
    config.partialTypes = [
      'nav_menu_item',
      'nav_menu'
    ]

    config.renderTypes = {
      page: 'p',
      'core/paragraph': 'richText',
      'frm/custom': 'custom'
    }

    normalMetaKeys.set('customMeta', 'custom')
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

    config.env.prod = false
    config.env.prodUrl = ''
    config.renderTypes = {}
    config.wholeTypes = []
    config.partialTypes = []
    resetFilters()
    testResetStore()
    normalMetaKeys.clear()
  })

  it('should return throw an error if route does not exist', async () => {
    config.partialTypes = [
      'nav_menu_item',
      'nav_menu',
      'does_not_exist'
    ]

    await expect(async () => await getAllWordPressData()).rejects.toThrowError(mockFetchErrorMessage.route)
  })

  it('should return menu items, menus, pages and posts data', async () => {
    config.cms.ssl = false
    config.env.prod = true
    config.cms.prodHost = 'wp.com'
    config.wholeTypes = ['page', 'post']

    const result = await getAllWordPressData()
    const expectedResult = {
      navigationItem: menuItems,
      navigation: menus,
      content: {
        page: pages,
        post: posts
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return menu items, menus and one post with id 1 from preview data', async () => {
    const result = await getAllWordPressData({
      previewData: {
        id: '1',
        contentType: 'post'
      }
    })

    const expectedResult = {
      navigationItem: menuItems,
      navigation: menus,
      content: {
        page: [],
        post: [posts.find((post) => post.id === '1')]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return menu items, menus and one post with id 1 from serverless data', async () => {
    setStoreItem('slugs', ['1', 'post'], '/posts/1/')

    const result = await getAllWordPressData({
      serverlessData: {
        path: '/posts/1/',
        query: {}
      }
    })

    const expectedResult = {
      navigationItem: [],
      navigation: [],
      content: {
        page: [],
        post: [posts.find((post) => post.id === '1')]
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return empty data if serverless data invalid', async () => {
    config.wholeTypes = ['post']

    // @ts-expect-error - test null data
    setStoreItem('slugs', [null, null], '/posts/5/')

    const result = await getAllWordPressData({
      serverlessData: {
        path: '/posts/5/',
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
    addFilter('wordpressData', (data) => {
      return data.map(item => {
        return {
          ...item,
          test: 'test'
        }
      })
    })

    const result = await getAllWordPressData()
    const expectedResult = {
      navigationItem: menuItems.map(item => {
        return {
          ...item,
          test: 'test'
        }
      }),
      navigation: menus.map(menu => {
        return {
          ...menu,
          test: 'test'
        }
      }),
      content: {
        page: pages.map(page => {
          return {
            ...page,
            test: 'test'
          }
        })
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should filter all data to include test array', async () => {
    addFilter('allData', (data, args) => {
      const { type } = args

      if (type !== 'wordpress') {
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

    const result = await getAllWordPressData()
    const expectedResult = {
      navigationItem: menuItems,
      navigation: menus,
      content: {
        page: pages,
        test: []
      }
    }

    expect(result).toEqual(expectedResult)
  })
})
