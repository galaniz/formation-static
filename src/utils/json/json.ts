/**
 * Utils - Json
 */

/* Imports */

import { isObject } from '../object/object.js'
import { getPath } from '../path/path.js'
import { applyFilters } from '../filters/filters.js'

/**
 * Check and return valid JSON or fallback
 *
 * @param {string} value
 * @return {object|undefined}
 */
const getJson = <T>(value: string): object & T | undefined => {
  try {
    const obj = JSON.parse(value)

    if (isObject(obj)) {
      return obj
    }
  } catch {
    return undefined
  }

  return undefined
}

/**
 * Import json file and return contents if object
 *
 * @param {string} path
 * @param {boolean} store
 * @return {Promise<object|undefined>}
 */
const getJsonFile = async <T>(path: string, store: boolean = true): Promise<object & T | undefined> => {
  try {
    const newPath = store ? getPath(path, 'store') : path

    const { default: obj } = await import(newPath) // Removed assert json as not all exports are esnext

    if (isObject(obj)) {
      return obj
    }

    throw new Error('No object in json file')
  } catch {
    if (!store) {
      return undefined
    }

    return await applyFilters('storeData', undefined, path)
  }
}

/* Exports */

export { getJson, getJsonFile }
