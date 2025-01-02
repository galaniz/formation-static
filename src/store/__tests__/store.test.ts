/**
 * Store - Test
 */

/* Imports */

import type { Store } from '../storeTypes.js'
import { it, expect, describe, vi, afterEach, afterAll, beforeEach, beforeAll } from 'vitest'
import { vol } from 'memfs'
import { readFile } from 'node:fs/promises'
import { config } from '../../config/config.js'
import { createStoreFiles } from '../storeFiles.js'
import {
  store,
  storeDir,
  setStore,
  setStoreData,
  fetchStoreItem,
  setStoreItem,
  getStoreItem
} from '../store.js'

/**
 * Get default store object
 *
 * @return {Store}
 */
const getDefaultStore = (): Store => {
  return {
    slugs: {},
    parents: {},
    navigations: [],
    navigationItems: [],
    formMeta: {},
    archiveMeta: {},
    imageMeta: {}
  }
}

/**
 * Reset store to default properties
 *
 * @return {void}
 */
const resetStore = (): void => {
  for (const [key] of Object.entries(store)) {
    delete store[key] // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }

  setStore(getDefaultStore(), 'lib/store')
}

/* Test setStore */

describe('setStore()', () => {
  afterEach(() => {
    resetStore()
  })

  it('should return default store object', () => {
    const result = setStore({})
    const expectedResult = getDefaultStore()
    const expectedStoreDir = 'lib/store'

    expect(result).toEqual(expectedResult)
    expect(storeDir).toBe(expectedStoreDir)
  })

  it('should append test array to store object and update directory', () => {
    const result = setStore({ test: [] }, 'test/store')
    const expectedResult = {
      slugs: {},
      parents: {},
      navigations: [],
      navigationItems: [],
      formMeta: {},
      archiveMeta: {},
      imageMeta: {},
      test: []
    }

    const expectedStoreDir = 'test/store'

    expect(result).toEqual(expectedResult)
    expect(storeDir).toBe(expectedStoreDir)
  })
})

/* Test setStoreItem */

describe('setStoreItem()', () => {
  afterEach(() => {
    resetStore()
  })

  it('should return false if no params', () => {
    // @ts-expect-error
    const result = setStoreItem()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if no value is not an object', () => {
    // @ts-expect-error
    const resultOne = setStoreItem('slugs', '')
    // @ts-expect-error
    const resultTwo = setStoreItem('slugs', null)
    const expectedResult = false

    expect(resultOne).toBe(expectedResult)
    expect(resultTwo).toBe(expectedResult)
  })

  it('should return false if prop does not exist in store', () => {
    const result = setStoreItem('doesNotExist', { test: 'test' })
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true and set slug prop', () => {
    const result = setStoreItem('slugs', {
      contentType: 'page',
      id: ''
    }, 'test')

    const resultStore = store.slugs.test
    const expectedResult = true
    const expectedResultStore = {
      contentType: 'page',
      id: ''
    }

    expect(result).toBe(expectedResult)
    expect(resultStore).toEqual(expectedResultStore)
  })

  it('should return true and set navigations prop', () => {
    const result = setStoreItem('navigations', [
      {
        id: '1',
        title: 'Primary',
        location: 'primary',
        items: []
      }
    ])

    const resultStore = store.navigations
    const expectedResult = true
    const expectedResultStore = [
      {
        id: '1',
        title: 'Primary',
        location: 'primary',
        items: []
      }
    ]

    expect(result).toBe(expectedResult)
    expect(resultStore).toEqual(expectedResultStore)
  })
})

/* Test setStoreData */

describe('setStoreData()', () => {
  beforeAll(() => {
    vol.fromJSON({
      '/files/parents.json': JSON.stringify([{
        page: {
          1: {
            id: '3',
            title: 'Parent',
            slug: 'parent'
          }
        }
      }])
    })
  
    vi.mock('/files/parents.json', () => ({
      default: {
        page: {
          1: {
            id: '3',
            title: 'Parent',
            slug: 'parent'
          }
        }
      }
    }))
  })

  afterAll(() => {
    vol.reset()
  })

  beforeEach(() => {
    config.partialTypes = [
      'navigationItem',
      'navigation',
      'term'
    ]

    config.hierarchicalTypes = [
      'page',
      'term'
    ]

    config.normalTypes = {
      Post: 'post'
    }
  })

  afterEach(() => {
    resetStore()
    config.env.dir = ''
    config.normalTypes = {}
    config.hierarchicalTypes = ['page']
    config.partialTypes = [
      'navigationItem',
      'navigation'
    ]
  })

  it('should return false if no data', async () => {
    // @ts-expect-error
    const result = await setStoreData()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true but not set any store items', async () => {
    // @ts-expect-error
    const result = await setStoreData({})
    const expectedResult = true
    const expectedStore = getDefaultStore()

    expect(result).toBe(expectedResult)
    expect(store).toEqual(expectedStore)
  })

  it('should set navigation, parent and archive meta items', async () => {
    setStore({
      archiveMeta: {
        term: {
          singular: 'Category',
          plural: 'Categories'
        }
      }
    })

    const navigations = [
      {
        id: '1',
        title: 'Primary',
        location: 'primary',
        items: [
          {
            id: '1',
            title: 'Home',
            menuOrder: 1
          },
          {
            id: '2',
            title: 'Example',
            menuOrder: 2
          }
        ]
      }
    ]

    const navigationItems = [
      {
        id: '1',
        title: 'Home',
        link: '/home/',
        contentType: 'navigationItem',
        internalLink: {
          contentType: 'page',
          slug: 'home',
          id: '7'
        }
      },
      {
        id: '2',
        title: 'Example',
        externalLink: 'http://example.com',
        contentType: 'navigationItem'
      }
    ]

    const termParent = {
      id: '7',
      title: 'Term Parent',
      slug: 'term-parent'
    }

    const pageParent = {
      id: '3',
      title: 'Parent',
      slug: 'parent'
    }

    const result = await setStoreData({
      navigation: navigations,
      navigationItem: navigationItems,
      term: [
        {
          id: '5',
          title: 'Term',
          contentType: 'term',
          slug: 'term',
          parent: {
            ...termParent,
            contentType: 'term'
          },
          taxonomy: {
            id: '11',
            title: 'Category',
            contentTypes: ['post'],
            slug: 'categories'
          }
        },
        {
          id: '7',
          title: 'Term Parent',
          contentType: 'term',
          slug: 'term-parent',
          taxonomy: {
            id: '11',
            title: 'Category',
            contentTypes: ['post'],
            slug: 'categories'
          }
        }
      ],
      content: {
        page: [
          {
            id: '3',
            slug: 'parent',
            title: 'Parent',
            contentType: 'page',
            content: 'test'
          },
          {
            id: '1',
            title: 'Child',
            contentType: 'page',
            slug: 'child',
            content: 'test',
            parent: {
              ...pageParent,
              contentType: 'page'
            }
          },
          { // Test empty parent
            id: '1',
            title: 'Child',
            contentType: 'page',
            slug: 'child',
            content: 'test',
            parent: {}
          },
          {
            id: '10',
            title: 'Blog',
            contentType: 'page',
            slug: 'blog',
            content: 'archive',
            archive: 'Post'
          },
          {
            id: '4',
            title: 'Categories',
            contentType: 'page',
            slug: 'categories',
            content: 'archive',
            archive: 'term'
          },
          { // Test no id
            title: 'Services',
            contentType: 'page',
            slug: 'services',
            content: 'archive',
            archive: 'service'
          },
          // @ts-expect-error - test invalid object
          null
        ],
        post: [
          {
            id: '9',
            slug: 'post',
            title: 'Post',
            contentType: 'Post',
            content: 'post'
          }
        ]
      }
    })

    const expectedResult = true
    const expectedStore = {
      slugs: {},
      parents: {
        page: {
          1: pageParent
        },
        term: {
          5: termParent
        }
      },
      navigations,
      navigationItems,
      formMeta: {},
      archiveMeta: {
        post: {
          id: '10',
          title: 'Blog',
          contentType: 'page',
          slug: 'blog'
        },
        term: {
          id: '4',
          title: 'Categories',
          contentType: 'page',
          slug: 'categories',
          singular: 'Category',
          plural: 'Categories'
        }
      },
      imageMeta: {}
    }

    expect(result).toBe(expectedResult)
    expect(store).toEqual(expectedStore)
  })

  it('should return true and set serverless parents data', async () => {
    config.env.dir = '/'
    setStore({}, 'files')

    const result = await setStoreData({
      content: {
        page: []
      }
    }, true)

    const expectedResult = true
    const expectedStore = {
      slugs: {},
      parents: {
        page: {
          1: {
            id: '3',
            title: 'Parent',
            slug: 'parent'
          }
        }
      },
      navigations: [],
      navigationItems: [],
      formMeta: {},
      archiveMeta: {},
      imageMeta: {}
    }

    expect(result).toBe(expectedResult)
    expect(store).toEqual(expectedStore)
  })
})

/* Test fetchStoreItem */

describe('fetchStoreItem()', () => {
  beforeAll(() => {
    vol.fromJSON({
      '/files/parents.json': JSON.stringify([{
        page: {
          1: {
            id: '3',
            title: 'Parent',
            slug: 'parent'
          }
        }
      }])
    })
  
    vi.mock('/files/parents.json', () => ({
      default: {
        page: {
          1: {
            id: '3',
            title: 'Parent',
            slug: 'parent'
          }
        }
      }
    }))
  })

  afterAll(() => {
    vol.reset()
  })

  afterEach(() => {
    resetStore()
    config.env.dir = ''
  })

  it('should return undefined if no prop', async () => {
    // @ts-expect-error
    const result = await fetchStoreItem()
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return undefined if prop does not exist', async () => {
    const result = await fetchStoreItem('doesNotExist')
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return parents data', async () => {
    config.env.dir = '/'
    setStore({}, 'files')

    const result = await fetchStoreItem('parents')
    const expectedResult = {
      page: {
        1: {
          id: '3',
          title: 'Parent',
          slug: 'parent'
        }
      }
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test getStoreItem */

describe('getStoreItem()', () => {
  afterEach(() => {
    resetStore()
  })

  it('should return undefined if no prop', () => {
    // @ts-expect-error
    const result = getStoreItem()
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return undefined if prop does not exist', () => {
    const result = getStoreItem('doesNotExist')
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return form meta', () => {
    const data = {
      subject: 'test',
      toEmail: 'test@test.com',
      senderEmail: 'test2@test2.com'
    }

    setStoreItem('formMeta', data, '123')

    const result = getStoreItem('formMeta')
    const expectedResult = { 123: data }

    expect(result).toEqual(expectedResult)
  })
})

/* Test createStoreFiles */

describe('createStoreFiles()', () => {
  beforeAll(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    resetStore()
    vol.reset()
  })

  it('should throw error if data is invalid json', async () => {
    setStore({ test: { bigInt: 123n } }, '/files')
    await expect(async () => await createStoreFiles()).rejects.toThrowError()
  })

  it('should write json files from store object', async () => {
    const parentsData = {
      page: {
        1: {
          id: '3',
          title: 'Parent',
          slug: 'parent'
        }
      }
    }

    const testData = {
      id: '123',
      title: 'Test'
    }

    setStore({
      parents: parentsData,
      test: testData
    }, '/files')

    await createStoreFiles()

    const slugs = await readFile('/files/slugs.json', { encoding: 'utf8' })
    const parents = await readFile('/files/parents.json', { encoding: 'utf8' })
    const navigations = await readFile('/files/navigations.json', { encoding: 'utf8' })
    const navigationItems = await readFile('/files/navigationItems.json', { encoding: 'utf8' })
    const formMeta = await readFile('/files/formMeta.json', { encoding: 'utf8' })
    const archiveMeta = await readFile('/files/archiveMeta.json', { encoding: 'utf8' })
    const imageMeta = await readFile('/files/imageMeta.json', { encoding: 'utf8' })
    const test = await readFile('/files/test.json', { encoding: 'utf8' })

    expect(JSON.parse(slugs)).toEqual({})
    expect(JSON.parse(parents)).toEqual(parentsData)
    expect(JSON.parse(navigations)).toEqual([])
    expect(JSON.parse(navigationItems)).toEqual([])
    expect(JSON.parse(formMeta)).toEqual({})
    expect(JSON.parse(archiveMeta)).toEqual({})
    expect(JSON.parse(imageMeta)).toEqual({})
    expect(JSON.parse(test)).toEqual(testData)
  })
})
