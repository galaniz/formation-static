/**
 * Store - Test
 */

/* Imports */

import { it, expect, describe, vi, afterEach, beforeEach, beforeAll } from 'vitest'
import { readFile } from 'node:fs/promises'
import { testDefaultStore, testResetStore } from '../../../tests/utils.js'
import { config } from '../../config/config.js'
import { createStoreFiles } from '../storeFiles.js'
import {
  store,
  storeDir,
  setStore,
  setStoreData,
  setStoreItem,
  getStoreItem
} from '../store.js'

/* Test setStore */

describe('setStore()', () => {
  afterEach(() => {
    testResetStore()
  })

  it('should return default store object if no args', () => {
    // @ts-expect-error - test undefined args
    const result = setStore()
    const expectedResult = testDefaultStore()
    const expectedStoreDir = 'lib/store'

    expect(result).toEqual(expectedResult)
    expect(storeDir).toBe(expectedStoreDir)
  })

  it('should return default store object if empty args', () => {
    const result = setStore({})
    const expectedResult = testDefaultStore()
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
      taxonomies: {},
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
    testResetStore()
  })

  it('should return false if no params', () => {
    // @ts-expect-error - test empty params
    const result = setStoreItem()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if no value is not an object', () => {
    // @ts-expect-error - test invalid value
    const resultOne = setStoreItem('slugs', '')
    // @ts-expect-error - test invalid value
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
    }, '/test/')

    const resultStore = store.slugs['/test/']
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
  beforeEach(() => {
    setStoreItem('parents ', {
      page: {
        1: {
          id: '3',
          title: 'Parent',
          slug: 'parent'
        }
      }
    })

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
    testResetStore()
    config.normalTypes = {}
    config.hierarchicalTypes = []
    config.partialTypes = []
  })

  it('should return false if no data', () => {
    // @ts-expect-error - test undefined data
    const result = setStoreData()
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true but not set any store items', () => {
    // @ts-expect-error - test empty data
    const result = setStoreData({})
    const expectedResult = true
    const expectedStore = testDefaultStore()

    expect(result).toBe(expectedResult)
    expect(store).toEqual(expectedStore)
  })

  it('should set navigation, parent and archive meta items', () => {
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

    const result = setStoreData({
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
      imageMeta: {},
      taxonomies: {}
    }

    expect(result).toBe(expectedResult)
    expect(store).toEqual(expectedStore)
  })
})

/* Test getStoreItem */

describe('getStoreItem()', () => {
  afterEach(() => {
    testResetStore()
  })

  it('should return undefined if no prop', () => {
    // @ts-expect-error - test undefined prop
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

  afterEach(() => {
    testResetStore()
  })

  it('should throw error if data is invalid json', async () => {
    setStore({ test: { bigInt: 123n } }, '/files')
    await expect(async () => { await createStoreFiles() }).rejects.toThrowError()
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
    const taxonomies = await readFile('/files/taxonomies.json', { encoding: 'utf8' })
    const test = await readFile('/files/test.json', { encoding: 'utf8' })

    expect(JSON.parse(slugs)).toEqual({})
    expect(JSON.parse(parents)).toEqual(parentsData)
    expect(JSON.parse(navigations)).toEqual([])
    expect(JSON.parse(navigationItems)).toEqual([])
    expect(JSON.parse(formMeta)).toEqual({})
    expect(JSON.parse(archiveMeta)).toEqual({})
    expect(JSON.parse(imageMeta)).toEqual({})
    expect(JSON.parse(taxonomies)).toEqual({})
    expect(JSON.parse(test)).toEqual(testData)
  })
})
