/**
 * Store - Test
 */

/* Imports */

import type { Store } from '../storeTypes.js'
import { it, expect, describe, afterEach } from 'vitest'
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
 * Reset store to default properties
 *
 * @return {void}
 */
const resetStore = (): void => {
  store.slugs = {}
  store.parents = {}
  store.navigations = []
  store.navigationItems = []
  store.formMeta = {}
  store.archiveMeta = {}
  store.imageMeta = {}

  setStore({}, 'lib/store')
}

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
    expect(storeDir).toEqual(expectedStoreDir)
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
    expect(storeDir).toEqual(expectedStoreDir)
  })
})

/* Test setStoreItem */

describe('setStoreItem()', () => {
  afterEach(() => {
    resetStore()
  })

  it('should return false if no arguments are provided', () => {
    // @ts-expect-error
    const result = setStoreItem()
    const expectedResult = false

    expect(result).toEqual(expectedResult)
  })
})
