/**
 * Utils - Json
 */

/* Imports */

import { isObject } from '../object/object.js'
import { getPath } from '../path/path.js'
import { applyFilters } from '../filter/filter.js'

/**
 * Check and return valid JSON or fallback
 *
 * @param {string} value
 * @return {object|undefined}
 */
const getJson = <T extends object>(value: string): T | undefined => { // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
  try {
    const obj: unknown = JSON.parse(value)

    if (isObject(obj)) {
      return obj as T
    }

    throw new Error('Parsed value is not an object')
  } catch {
    return undefined
  }
}

/**
 * Import json file and return contents if object
 *
 * @param {string} path
 * @param {boolean} [store=false]
 * @return {Promise<object|undefined>}
 */
const getJsonFile = async <T>(path: string, store: boolean = false): Promise<object & T | undefined> => {
  let res: object & T | undefined
  let newPath = path

  try {
    newPath = store ? getPath(path, 'store') : path
    const { default: obj } = await import(newPath) as { default: object & T } // Removed assert json as not all exports are esnext

    if (isObject(obj)) {
      res = obj
    } else {
      throw new Error('No object in json file')
    }
  } catch {
    res = undefined
  }

  return store ? await applyFilters('storeData', res, newPath, true) : res
}

/* Exports */

export {
  getJson,
  getJsonFile
}
