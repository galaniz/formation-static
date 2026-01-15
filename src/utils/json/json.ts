/**
 * Utils - Json
 */

/* Imports */

import { isObject } from '../object/object.js'
import { getPath } from '../path/path.js'
import { applyFilters } from '../../filters/filters.js'

/**
 * Check and return valid JSON or fallback.
 *
 * @param {string} value
 * @return {object|undefined}
 */
const getJson = <T extends object>(value: string): T | undefined => { // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
  const val: unknown = JSON.parse(value)

  if (isObject(val)) {
    return val as T
  }

  throw new Error('Parsed value is not an object')
}

/**
 * Import JSON file and return contents if object.
 *
 * @param {string} path
 * @param {boolean} [store=false]
 * @return {Promise<object|undefined>}
 */
const getJsonFile = async <T>(path: string, store: boolean = false): Promise<object & T | undefined> => {
  const newPath = store ? getPath(path, 'store') : path
  const { default: obj } = await import(newPath) as { default: object & T } // Removed assert json as not all exports are esnext

  if (isObject(obj)) {
    return store ? await applyFilters('storeData', obj, newPath, true) : obj
  }

  throw new Error('No object in JSON file')
}

/* Exports */

export {
  getJson,
  getJsonFile
}
