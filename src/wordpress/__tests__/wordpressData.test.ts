/**
 * WordPress - Data Test
 */

/* Imports */

import type { RenderItem } from '../../render/renderTypes.js'
import { it, expect, describe, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { getWordPressData, getAllWordPressData } from '../wordpressData.js'
import { taxonomiesById } from '../wordpressDataNormal.js'
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
    config.renderTypes = {}
    config.env.prod = false
    config.env.cache = false
    taxonomiesById.clear()
    resetFilters()
  })

  it('should throw an error if no arguments are provided', async () => {
    // @ts-expect-error
    await expect(async () => await getWordPressData()).rejects.toThrowError('No key')
  })

  it('should throw an error only key is provided', async () => {
    // @ts-expect-error
    await expect(async () => await getWordPressData('key1')).rejects.toThrowError('No route')
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

    await expect(async () => await getWordPressData('key2', 'route')).rejects.toThrowError('No credentials')
  })

  it('should throw an error if host is invalid', async () => {
    config.cms.devHost = 'wp'

    await expect(async () => await getWordPressData('key3', 'route')).rejects.toThrowError(mockFetchErrorMessage.url)
  })

  it('should throw an error if invalid credentials', async () => {
    config.cms.devUser = 'user1'
    config.cms.devCredential = 'pass1'

    await expect(async () => await getWordPressData('key4', 'route')).rejects.toThrowError(mockFetchErrorMessage.auth)
  })

  it('should throw an error if route does not exist', async () => {
    await expect(async () => await getWordPressData('key5', 'does-not-exist')).rejects.toThrowError(mockFetchErrorMessage.route)
  })

  it('should throw an error if id does not exist', async () => {
    await expect(async () => await getWordPressData('postsKey1', 'posts/0')).rejects.toThrowError(mockFetchErrorMessage.data)
  })

  it('should return empty array if data is empty array', async () => {
    const result = await getWordPressData('emptyKey', 'empty')
    const expectedResult: RenderItem[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if data is array of null', async () => {
    const result = await getWordPressData('nullKey', 'null')
    const expectedResult: RenderItem[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return array of posts and run cache filter', async () => {
    config.env.cache = true
    const cacheSet = vi.fn()

    addFilter('cacheData', async (data, args): Promise<undefined> => {
      const { key, type } = args

      if (key === 'postsKey2' && type === 'set') {
        cacheSet(data)
      }
    })

    const result = await getWordPressData('postsKey2', 'posts')

    expect(cacheSet).toHaveBeenCalledTimes(1)
    expect(cacheSet).toHaveBeenCalledWith(posts)
    expect(result).toEqual(posts)
  })

  it('should return array of posts from cache', async () => {
    config.env.cache = true
    const cacheGet = vi.fn()

    addFilter('cacheData', async (data, args): Promise<RenderItem[] | undefined> => {
      const { key, type } = args

      if (key === 'postsKey3' && type === 'get') {
        cacheGet(data)
        return posts as RenderItem[]
      }

      return data
    })

    const result = await getWordPressData('postsKey3', 'posts')

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

    const result = await getWordPressData('pagesKey', 'pages')

    expect(result).toEqual(pages)
  })

  it('should return array of one post with id 1', async () => {
    const result = await getWordPressData('postsKey4', 'posts/1')

    expect(result).toEqual([posts.find((post) => post.id === '1')])
  })

  it('should return array of categories', async () => {
    const result = await getWordPressData('categoriesKey1', 'categories')

    expect(result).toEqual(categories)
  })

  it('should return array of tags', async () => {
    const result = await getWordPressData('tagsKey', 'tags')

    expect(result).toEqual(tags)
  })

  it('should return array of media', async () => {
    const result = await getWordPressData('mediaKey', 'media')

    expect(result).toEqual(media)
  })

  it('should return array of taxonomies', async () => {
    const result = await getWordPressData('taxonomiesKey1', 'taxonomies')

    expect(result).toEqual(taxonomies)
  })

  it('should return categories and posts with taxonomies linked', async () => {
    await getWordPressData('taxonomiesKey2', 'taxonomies')

    const categoriesResult = await getWordPressData('categoriesKey2', 'categories')
    const postsResult = await getWordPressData('postsKey5', 'posts')
    const uncategorized = {
      id: 'category',
      title: 'Categories',
      slug: 'category',
      contentTypes: [
        'post'
      ]
    }

    expect(categoriesResult).toEqual(categories.map(category => {
      return {
        ...category,
        taxonomy: uncategorized
      }
    }))

    expect(postsResult).toEqual(posts.map(post => {
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
    }))
  })
})

/* Test getAllWordPressData */

describe('getAllWordPressData()', () => {
  beforeEach(() => {
    config.renderTypes = {
      page: 'p',
      'core/paragraph': 'richText',
      'frm/custom': 'custom'
    }
  })

  afterEach(() => {
    resetFilters()
    taxonomiesById.clear()
    setStoreItem('slugs', {})
    config.cms.ssl = true
    config.cms.prodHost = ''
    config.env.prod = false
    config.renderTypes = {}
    config.wholeTypes = ['page']
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

    expect(result?.navigationItem).toEqual(expectedResult.navigationItem)
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
    setStoreItem('slugs', {
      id: '1',
      contentType: 'post'
    }, '/posts/1/')

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

  it('should return menu items, menus and skip serverless data with all posts', async () => {
    config.wholeTypes = ['post']

    setStoreItem('slugs', {
      // @ts-expect-error
      id: null,
      // @ts-expect-error
      contentType: null
    }, '/posts/5/')

    const result = await getAllWordPressData({
      serverlessData: {
        path: '/posts/5/',
        query: {}
      }
    })

    const expectedResult = {
      navigationItem: menuItems,
      navigation: menus,
      content: {
        page: [],
        post: posts
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should run filter on data to include test attribute', async () => {
    addFilter('wordpressData', (data) => {
      return data.map((item) => {
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

  it('should run filter on all data to include test array', async () => {
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
