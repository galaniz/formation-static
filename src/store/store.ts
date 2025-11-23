/**
 * Store
 */

/* Imports */

import type { Store } from './storeTypes.js'
import type { ArchiveMeta } from '../utils/archive/archiveTypes.js'
import type { RenderAllData, RenderItem } from '../render/renderTypes.js'
import { normalizeContentType } from '../utils/contentType/contentType.js'
import { isObject, isObjectStrict } from '../utils/object/object.js'
import { isStringStrict } from '../utils/string/string.js'
import { isArrayStrict } from '../utils/array/array.js'
import { getArchiveMeta } from '../utils/archive/archive.js'
import { config } from '../config/config.js'

/**
 * Directory to write store files to.
 *
 * @type {string}
 */
let storeDir: string = 'lib/store'

/**
 * Default store object.
 *
 * @type {Store}
 */
const defaultStore: Store = {
  slugs: {},
  parents: {},
  navigations: [],
  navigationItems: [],
  formMeta: {},
  archiveMeta: {},
  imageMeta: {},
  taxonomies: {},
  serverless: {}
}

/**
 * Store options.
 *
 * @type {Store}
 */
let store: Store = {
  ...defaultStore
}

/**
 * Update default store with user options.
 *
 * @param {Store} args
 * @param {string} [dir]
 * @return {Store}
 */
const setStore = <T extends object>(
  args: T,
  dir: string = 'lib/store'
): Store & T => {
  if (!isObjectStrict(args)) {
    return store as Store & T
  }

  store = { ...defaultStore, ...args }

  if (isStringStrict(dir)) {
    storeDir = dir
  }

  return store as Store & T
}

/**
 * Update individual store property.
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
    // @ts-expect-error - store prop checked above
    store[prop][subProp] = value
  } else {
    store[prop] = value
  }

  return true
}

/**
 * Build time data (navigations, archive meta, parents).
 *
 * @param {RenderAllData} allData
 * @return {boolean}
 */
const setStoreData = (allData: RenderAllData): boolean => {
  /* Data must be object */

  if (!isObjectStrict(allData)) {
    return false
  }

  const {
    navigation,
    navigationItem,
    content
  } = allData

  /* Build time navigation data */

  store.navigations = isArrayStrict(navigation) ? navigation : []
  store.navigationItems = isArrayStrict(navigationItem) ? navigationItem : []

  /* Build time archive meta and parent data */

  const data = {
    ...allData,
    ...content
  }

  config.hierarchicalTypes.forEach(type => {
    const items = data[type]

    if (!isArrayStrict(items)) {
      return
    }

    items.forEach(item => {
      if (!isObjectStrict(item)) {
        return
      }

      /* Props */

      const {
        id,
        parent,
        archive,
        slug,
        title,
        locale
      } = item as RenderItem

      /* Id required */

      if (!isStringStrict(id)) {
        return
      }

      /* Archive */

      const archiveType = normalizeContentType(archive)

      if (isStringStrict(archiveType)) {
        const hasLocale = isStringStrict(locale)
        const archiveMeta = getArchiveMeta(archiveType)
        const newArchive = {
          id,
          slug,
          title,
          contentType: type,
          ...(hasLocale ? (archiveMeta as Record<string, ArchiveMeta>)[locale] : archiveMeta)
        }

        if (hasLocale) {
          if (!store.archiveMeta[archiveType]) {
            store.archiveMeta[archiveType] = {}
          }

          (store.archiveMeta[archiveType] as Record<string, ArchiveMeta>)[locale] = newArchive
        } else {
          store.archiveMeta[archiveType] = newArchive
        }
      }

      /* Parent */

      if (isObjectStrict(parent)) {
        const parentSlug = parent.slug
        const parentTitle = parent.title
        const parentId = parent.id

        if (isStringStrict(parentSlug) && isStringStrict(parentTitle) && isStringStrict(parentId)) {
          if (store.parents[type] == null) {
            store.parents[type] = {}
          }

          store.parents[type][id] = [parentId, parentSlug, parentTitle]
        }
      }
    })
  })

  return true
}

/**
 * Individual store property.
 *
 * @param {string} prop
 * @return {object}
 */
const getStoreItem = <T extends Store, K extends keyof T>(prop: K): T[K] => {
  return store[prop as keyof Store] as T[K]
}

/* Exports */

export {
  store,
  storeDir,
  setStore,
  setStoreData,
  setStoreItem,
  getStoreItem
}
