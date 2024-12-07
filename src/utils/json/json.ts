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
const getJson = <T>(value: string): object & T | undefined => {
  try {
    const obj = JSON.parse(value)

    if (isObject(obj)) {
      return obj
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
 * @param {boolean} isStore
 * @return {Promise<object|undefined>}
 */
const getJsonFile = async <T>(path: string, isStore: boolean = true): Promise<object & T | undefined> => {
  let res: object & T | undefined

  try {
    const newPath = isStore ? getPath(path, 'store') : path
    const { default: obj } = await import(newPath) // Removed assert json as not all exports are esnext

    if (isObject(obj)) {
      res = obj
    } else {
      throw new Error('No object in json file')
    }
  } catch (err) {
    res = undefined
  }

  return isStore ? await applyFilters('storeData', res, path, true) : res
}

/* Exports */

export {
  getJson,
  getJsonFile
}
