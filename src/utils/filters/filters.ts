/**
 * Utils - Filters
 */

/* Imports */

import type { Filters, FiltersFunctions } from './filtersTypes'
import { isArrayStrict } from '../isArray/isArray'
import { isStringStrict } from '../isString/isString'
import { isObjectStrict } from '../isObject/isObject'
import { isFunction } from '../isFunction/isFunction'

/**
 * Store filter callbacks by name
 *
 * @type {import('./filtersTypes').FiltersFunctions}
 */
let filters: FiltersFunctions = {
  columnProps: [],
  containerProps: [],
  fieldProps: [],
  formProps: [],
  richTextProps: [],
  richTextOutput: [],
  richTextContentItem: [],
  richTextContent: [],
  richTextContentOutput: [],
  renderItem: [],
  renderContent: [],
  renderContentStart: [],
  renderContentEnd: [],
  ajaxRes: [],
  cacheData: [],
  storeData: []
}

/**
 * Function - add filter to filters object
 *
 * @param {string} name
 * @param {function} filter
 * @return {boolean}
 */
const addFilter = <T extends keyof Filters>(name: T, filter: Filters[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(filter)) {
    return false
  }

  if (filters[name] === undefined) {
    filters[name] = []
  }

  filters[name].push(filter)

  return true
}

/**
 * Function - remove filter from filters object
 *
 * @param {string} name
 * @param {function} filter
 * @return {boolean}
 */
const removeFilter = <T extends keyof Filters>(name: T, filter: Filters[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(filter)) {
    return false
  }

  const callbacks = filters[name]

  if (isArrayStrict(callbacks)) {
    const index = callbacks.indexOf(filter)

    if (index > -1) {
      filters[name].splice(index, 1)

      return true
    }
  }

  return false
}

/**
 * Function - update value from callback return values
 *
 * @param {string} name
 * @param {*} value
 * @param {*} [args]
 * @return {Promise<*>}
 */
const applyFilters = async <T, U>(name: string, value: T, args?: U): Promise<T> => {
  const callbacks = filters[name]

  if (isArrayStrict(callbacks)) {
    for (let i = 0; i < callbacks.length; i += 1) {
      const callback = callbacks[i]

      if (isFunction(callback)) {
        value = await callback(value, args)
      }
    }
  }

  return value
}

/**
 * Function - empty filters object
 *
 * @return {void}
 */
const resetFilters = (): void => {
  filters = {
    columnProps: [],
    containerProps: [],
    fieldProps: [],
    formProps: [],
    richTextProps: [],
    richTextOutput: [],
    richTextContentItem: [],
    richTextContent: [],
    richTextContentOutput: [],
    renderItem: [],
    renderContent: [],
    renderContentStart: [],
    renderContentEnd: [],
    ajaxRes: [],
    cacheData: [],
    storeData: []
  }
}

/**
 * Function - fill filters object
 *
 * @param {import('./filtersTypes').Filters} args
 * @return {boolean}
 */
const setFilters = (args: Partial<Filters>): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  if (Object.keys(args).length === 0) {
    return false
  }

  resetFilters()

  Object.keys(args).forEach((a) => {
    const arg = args[a]

    if (arg === undefined) {
      return
    }

    addFilter(a, arg)
  })

  return true
}

/* Exports */

export {
  filters,
  addFilter,
  removeFilter,
  applyFilters,
  resetFilters,
  setFilters
}
