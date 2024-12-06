/**
 * Store
 */

/* Imports */

import type { Store, StoreDataArgs } from './storeTypes.js'
import { normalizeContentType } from '../utils/contentType/contentType.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isStringStrict } from '../utils/string/string.js'
import { isArrayStrict } from '../utils/array/array.js'
import { getJsonFile } from '../utils/json/json.js'
import { config } from '../config/config.js'

/**
 * Directory to write store files to
 *
 * @type {string}
 */
let storeDir: string = 'lib/store'

/**
 * Store options
 *
 * @type {Store}
 */
let store: Store = {
  slugs: {},
  parents: {},
  navigations: [],
  navigationItems: [],
  formMeta: {},
  archiveMeta: {},
  imageMeta: {}
}

/**
 * Update default store with user options
 *
 * @param {Store} args
 * @param {string} [dir]
 * @return {Store}
 */
const setStore = <T extends object>(
  args: T,
  dir: string = 'lib/store'
): Store & T => {
  store = Object.assign(store, args)

  if (isStringStrict(dir)) {
    storeDir = dir
  }

  return store as Store & T
}

/**
 * Update individual store property
 *
 * @param {string} prop
 * @param {object} value
 * @param {string} [subProp]
 * @return {boolean}
 */
const setStoreItem = <T extends Store, K extends keyof T, V extends keyof T[K] | undefined = undefined>(
  prop: K,
  value: V extends keyof T[K] ? T[K][V] : T[K],
  subProp?: V
): boolean => {
  if (!isStringStrict(prop) || !isObject(value) || store[prop] == null) {
    return false
  }

  if (isStringStrict(subProp)) {
    (store[prop] as any)[subProp] = value
  } else {
    store[prop] = value
  }

  return true
}

/**
 * Set serverless or build time data (navigations, archive meta, parents)
 *
 * @param {StoreDataArgs} args
 * @return {Promise<boolean>}
 */
const setStoreData = async (args: StoreDataArgs): Promise<boolean> => {
  /* Args must be object */

  if (!isObjectStrict(args)) {
    return false
  }

  const {
    navigation,
    navigationItem,
    content,
    serverless
  } = args

  /* Serverless all data */

  if (serverless) {
    for (const key of Object.keys(store)) {
      if (key === 'slugs') { // Skip slugs as set in data fetch
        continue
      }

      const data = await getJsonFile(key)

      if (data != null) {
        store[key] = data
      }
    }

    return true
  }

  /* Build time navigation data */

  store.navigations = isArrayStrict(navigation) ? navigation : []
  store.navigationItems = isArrayStrict(navigationItem) ? navigationItem : []

  /* Build time archive meta and parent data */

  config.hierarchicalTypes.forEach(type => {
    const items = content?.[type]

    if (!isArrayStrict(items)) {
      return
    }

    items.forEach(item => {
      if (!isObjectStrict(item)) {
        return
      }

      /* Id required */

      const id = item.id

      if (!isStringStrict(id)) {
        return
      }

      /* Parent and archive */

      const { parent, archive } = item

      /* Archive */

      const archiveType = normalizeContentType(archive)

      if (isStringStrict(archiveType)) {
        const archiveSlug = item.slug
        const archiveTitle = item.title
        const archiveObj =
          isObjectStrict(store.archiveMeta[archiveType]) ? store.archiveMeta[archiveType] : {}

        store.archiveMeta[archiveType] = {
          id,
          slug: archiveSlug,
          title: archiveTitle,
          ...archiveObj
        }
      }

      /* Parent */

      if (isObjectStrict(parent)) {
        const parentSlug = parent.slug
        const parentTitle = parent.title
        const parentId = parent.id

        if (isStringStrict(parentSlug) && isStringStrict(parentTitle) && isStringStrict(parentId)) {
          store.parents[id] = {
            id: parentId,
            slug: parentSlug,
            title: parentTitle,
            contentType: type
          }
        }
      }
    })
  })

  return true
}

/**
 * Get individual store property
 *
 * @param {string} prop
 * @return {object}
 */
const getStoreItem = <T extends Store, K extends keyof T>(prop: K): T[K] => {
  return store[prop as keyof Store] as T[K]
}

/**
 * Set and get serverless store property
 *
 * @param {string} prop
 * @return {object}
 */
const fetchStoreItem = async<T extends Store, K extends keyof T>(
  prop: K
): Promise<T[K]> => {
  const data = await getJsonFile(prop as string)

  if (data != null) {
    store[prop as keyof Store] = data
  }

  return store[prop as keyof Store] as T[K]
}

/* Exports */

export {
  store,
  storeDir,
  setStore,
  setStoreData,
  fetchStoreItem,
  setStoreItem,
  getStoreItem
}
