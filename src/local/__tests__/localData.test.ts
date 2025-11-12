/**
 * Local - Data Test
 */

/* Imports */

import type { LocalData } from '../localDataTypes.js'
import type { CacheData } from '../../filters/filtersTypes.js'
import type { StoreImageMeta } from '../../store/storeTypes.js'
import { it, describe, beforeEach, afterEach, vi, expect } from 'vitest'
import { getLocalData, getAllLocalData } from '../localData.js'
import { config } from '../../config/config.js'
import { testResetStore } from '../../../tests/utils.js'
import { setStoreItem } from '../../store/store.js'
import { addFilter, resetFilters } from '../../filters/filters.js'
import { navigationPrimary } from '../../../tests/data/local/navigation--primary.js'
import { navigationItemOne } from '../../../tests/data/local/navigationItem--one.js'
import { navigationItemTwo } from '../../../tests/data/local/navigationItem--two.js'
import { navigationItemThree } from '../../../tests/data/local/navigationItem--three.js'
import { pageOne } from '../../../tests/data/local/page--one.js'
import { postOne } from '../../../tests/data/local/post--one.js'
import { taxonomyCategory } from '../../../tests/data/local/taxonomy--category.js'
import { termCategoryOne } from '../../../tests/data/local/term--category-one.js'
import { templateOne } from '../../../tests/data/local/template--one.js'

/* Use real fs instead of memfs */

vi.unmock('node:fs')
vi.unmock('node:fs/promises')

/**
 * Image data.
 *
 * @type {StoreImageMeta}
 */
const testImageMeta: StoreImageMeta = {
  '2025/04/hero': {
    path: '2025/04/hero',
    name: 'hero.png',
    type: 'image/png',
    format: 'png',
    size: 93,
    width: 8,
    height: 8
  },
  '2025/03/image': {
    path: '2025/03/image',
    name: 'image.jpg',
    type: 'image/jpeg',
    format: 'jpg',
    size: 267,
    width: 8,
    height: 8
  },
  '2025/03/test': {
    path: '2025/03/test',
    name: 'test.png',
    type: 'image/png',
    format: 'png',
    size: 93,
    width: 8,
    height: 8
  }
}

/* Test getLocalData */

describe('getLocalData()', () => {
  const testData = {
    'navigation--primary': navigationPrimary,
    'navigationItem--one': navigationItemOne,
    'navigationItem--two': navigationItemTwo,
    'navigationItem--three': navigationItemThree,
    'page--one': pageOne,
    'post--one': postOne,
    'taxonomy--category': taxonomyCategory,
    'term--category-one': termCategoryOne,
    'template--one': templateOne
  }

  beforeEach(() => {
    config.source = 'local'
    config.local.dir = 'tests/data/local'
  })

  afterEach(() => {
    config.source = 'cms'
    config.local.dir = 'json'
    config.env.cache = false
    testResetStore()
    resetFilters()
  })

  it('should throw an error if no args are provided', async () => {
    // @ts-expect-error - test undefined params
    await expect(async () => await getLocalData()).rejects.toThrowError('No args')
  })

  it('should throw an error if no key is provided', async () => {
    // @ts-expect-error - test undefined params
    await expect(async () => await getLocalData({})).rejects.toThrowError('No key')
  })

  it('should throw an error if no data is found', async () => {
    config.local.dir = 'tests/data/empty'

    await expect(async () => await getLocalData({
      key: 'no_data_key'
    })).rejects.toThrowError('No data')
  })

  it('should throw an error if props are not string arrays', async () => {
    config.local.dir = 'tests/data/empty'

    await expect(async () => await getLocalData({
      key: 'cache_key',
      // @ts-expect-error - test non-string props
      refProps: false,
      // @ts-expect-error - test non-string props
      imageProps: false,
      // @ts-expect-error - test non-string props
      unsetProps: false
    })).rejects.toThrowError()
  })

  it('should return linked data and set cache', async () => {
    config.env.cache = true
    const cacheSet = vi.fn((data) => new Promise(resolve => { resolve(data) }))

    addFilter('cacheData', async (data, args): Promise<undefined> => {
      const { key, type } = args

      if (key === 'cache_key' && type === 'set') {
        await cacheSet(data)
      }
    })

    setStoreItem('imageMeta', testImageMeta)

    const result = await getLocalData({
      key: 'cache_key',
      refProps: ['internalLink', 'term', 'taxonomy', 'ref'],
      imageProps: ['image', 'featuredMedia'],
      unsetProps: ['content', 'unset', 'ref']
    })

    expect(cacheSet).toHaveBeenCalledTimes(1)
    expect(cacheSet).toHaveBeenCalledWith({ data: testData })
    expect(result).toEqual(testData)
  })

  it('should return linked data from cache', async () => {
    config.env.cache = true
    const cacheGet = vi.fn((data) => new Promise(resolve => { resolve(data) }))

    addFilter('cacheData', async (data, args): Promise<CacheData | undefined> => {
      const { key, type } = args

      if (key === 'cache_key' && type === 'get') {
        await cacheGet(data)

        return {
          data: testData
        }
      }

      return data
    })

    const result = await getLocalData({
      key: 'cache_key'
    })

    expect(cacheGet).toHaveBeenCalledTimes(1)
    expect(cacheGet).toHaveBeenCalledWith(undefined)
    expect(result).toEqual(testData)
  })

  it('should return linked data', async () => {
    setStoreItem('imageMeta', testImageMeta)

    const data = await getLocalData({
      key: 'all_local_data',
      refProps: ['internalLink', 'term', 'taxonomy', 'ref'],
      imageProps: ['image', 'featuredMedia'],
      unsetProps: ['content', 'unset', 'ref']
    })

    expect(data).toEqual(testData)
  })
})

/* Test getAllLocalData */

describe('getAllLocalData()', () => {
  beforeEach(() => {
    config.source = 'local'
    config.local.dir = 'tests/data/local'
    config.partialTypes = ['navigationItem', 'navigation', 'taxonomy']
    config.wholeTypes = ['page', 'post', 'term']
  })

  afterEach(() => {
    config.source = 'cms'
    config.local.dir = 'json'
    config.partialTypes = []
    config.wholeTypes = []
    testResetStore()
    resetFilters()
  })

  it('should return navigation, post and page data', async () => {
    config.partialTypes = ['navigationItem', 'navigation']
    config.wholeTypes = ['page', 'post']

    setStoreItem('imageMeta', testImageMeta)

    const data = await getAllLocalData({
      refProps: ['internalLink', 'term', 'taxonomy', 'ref'],
      imageProps: ['image', 'featuredMedia'],
      unsetProps: ['content', 'unset', 'ref']
    })

    const expectedData = {
      navigationItem: [
        navigationItemOne,
        navigationItemThree,
        navigationItemTwo
      ],
      navigation: [
        navigationPrimary
      ],
      content: {
        page: [
          pageOne
        ],
        post: [
          postOne
        ]
      }
    }

    expect(data).toEqual(expectedData)
  })

  it('should return all data', async () => {
    setStoreItem('imageMeta', testImageMeta)

    const data = await getAllLocalData({
      refProps: ['internalLink', 'term', 'taxonomy', 'ref'],
      imageProps: ['image', 'featuredMedia'],
      unsetProps: ['content', 'unset', 'ref']
    })

    const expectedData = {
      navigationItem: [
        navigationItemOne,
        navigationItemThree,
        navigationItemTwo
      ],
      navigation: [
        navigationPrimary
      ],
      taxonomy: [
        taxonomyCategory
      ],
      content: {
        page: [
          pageOne
        ],
        post: [
          postOne
        ],
        term: [
          termCategoryOne
        ]
      }
    }

    expect(data).toEqual(expectedData)
  })

  it('should filter each data item', async () => {
    const filterData: LocalData = {}

    addFilter('localData', (data) => {
      filterData[data.id as string] = data

      return {
        id: 'test',
        title: 'test'
      }
    })

    setStoreItem('imageMeta', testImageMeta)

    const data = await getAllLocalData({
      refProps: ['internalLink', 'term', 'taxonomy', 'ref'],
      imageProps: ['image', 'featuredMedia'],
      unsetProps: ['content', 'unset', 'ref']
    })

    const expectedDataItem = {
      id: 'test',
      title: 'test'
    }

    const expectedData = {
      navigationItem: [
        expectedDataItem,
        expectedDataItem,
        expectedDataItem
      ],
      navigation: [
        expectedDataItem
      ],
      taxonomy: [
        expectedDataItem
      ],
      content: {
        page: [
          expectedDataItem
        ],
        post: [
          expectedDataItem
        ],
        term: [
          expectedDataItem
        ]
      }
    }

    const expectedFilterData = {
      'navigation--primary': navigationPrimary,
      'navigationItem--one': navigationItemOne,
      'navigationItem--two': navigationItemTwo,
      'navigationItem--three': navigationItemThree,
      'page--one': pageOne,
      'post--one': postOne,
      'taxonomy--category': taxonomyCategory,
      'term--category-one': termCategoryOne
    }

    expect(data).toEqual(expectedData)
    expect(filterData).toEqual(expectedFilterData)
  })

  it('should filter all data to include test array', async () => {
    addFilter('allData', (data, args) => {
      const { type } = args

      if (type !== 'local') {
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

    setStoreItem('imageMeta', testImageMeta)

    const data = await getAllLocalData({
      refProps: ['internalLink', 'term', 'taxonomy', 'ref'],
      imageProps: ['image', 'featuredMedia'],
      unsetProps: ['content', 'unset', 'ref']
    })

    const expectedData = {
      navigationItem: [
        navigationItemOne,
        navigationItemThree,
        navigationItemTwo
      ],
      navigation: [
        navigationPrimary
      ],
      taxonomy: [
        taxonomyCategory
      ],
      content: {
        page: [
          pageOne
        ],
        post: [
          postOne
        ],
        term: [
          termCategoryOne
        ],
        test: []
      }
    }

    expect(data).toEqual(expectedData)
  })
})
