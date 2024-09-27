/**
 * Utils - Filter
 */

/* Imports */

import type { Filters, FiltersFunctions } from './filterTypes.js'
import { isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { isObjectStrict } from '../object/object.js'
import { isFunction } from '../function/function.js'

/**
 * Store filter callbacks by name
 *
 * @type {FiltersFunctions}
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
 * Add filter to filters object
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
 * Remove filter from filters object
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
      callbacks.splice(index, 1)

      return true
    }
  }

  return false
}

/**
 * Update value from callback return values
 *
 * @param {string} name
 * @param {*} value
 * @param {*} [args]
 * @return {Promise<*>}
 */
const applyFilters = async<T, U>(name: string, value: T, args?: U): Promise<T> => {
  const callbacks = filters[name]

  if (isArrayStrict(callbacks)) {
    for (const callback of callbacks) {
      value = await callback(value, args)
    }
  }

  return value
}

/**
 * Synchronously update value from callback return values
 *
 * @param {string} name
 * @param {*} value
 * @param {*} [args]
 * @return {*}
 */
const applyFiltersSync = <T, U>(name: string, value: T, args?: U): T => {
  const callbacks = filters[name]

  if (isArrayStrict(callbacks)) {
    for (const callback of callbacks) {
      value = callback(value, args)
    }
  }

  return value
}

/**
 * Empty filters object
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
 * Fill filters object
 *
 * @param {Filters} args
 * @return {boolean}
 */
const setFilters = (args: Partial<Filters>): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  const newFilters = Object.entries(args)

  if (newFilters.length === 0) {
    return false
  }

  resetFilters()

  newFilters.forEach(([name, filter]) => {
    if (filter === undefined) {
      return
    }

    addFilter(name, filter)
  })

  return true
}

/* Exports */

export {
  filters,
  addFilter,
  removeFilter,
  applyFilters,
  applyFiltersSync,
  resetFilters,
  setFilters
}
