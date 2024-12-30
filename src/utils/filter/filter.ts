/**
 * Utils - Filter
 */

/* Imports */

import type { Filters, FilterMap, FilterReturnType } from './filterTypes.js'
import { isSet, isSetStrict } from '../set/set.js'
import { isStringStrict } from '../string/string.js'
import { isObjectStrict } from '../object/object.js'
import { isFunction } from '../function/function.js'

/**
 * Store filter callbacks by name
 *
 * @type {FilterMap}
 */
let filters: FilterMap = new Map([
  ['columnProps', new Set()],
  ['containerProps', new Set()],
  ['fieldProps', new Set()],
  ['formProps', new Set()],
  ['richTextProps', new Set()],
  ['richTextOutput', new Set()],
  ['richTextContentItem', new Set()],
  ['richTextContent', new Set()],
  ['richTextContentOutput', new Set()],
  ['renderItem', new Set()],
  ['renderContent', new Set()],
  ['ajaxResult', new Set()],
  ['cacheData', new Set()],
  ['storeData', new Set()],
  ['contentfulData', new Set()],
  ['wordpressData', new Set()],
  ['localData', new Set()],
  ['allData', new Set()],
  ['slugParts', new Set()],
  ['slug', new Set()]
])

/**
 * Add filter to filters map
 *
 * @param {string} name
 * @param {function} filter
 * @return {boolean}
 */
const addFilter = <T extends keyof Filters>(name: T, filter: Filters[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(filter)) {
    return false
  }

  if (!isSet(filters.get(name))) {
    filters.set(name, new Set())
  }

  const filterSet = filters.get(name)

  if (isSet(filterSet)) {
    filterSet.add(filter)
  }

  return true
}

/**
 * Remove filter from filters map
 *
 * @param {string} name
 * @param {function} filter
 * @return {boolean}
 */
const removeFilter = <T extends keyof Filters>(name: T, filter: Filters[T]): boolean => {
  if (!isStringStrict(name) || !isFunction(filter)) {
    return false
  }

  const filterSet = filters.get(name)

  if (!isSet(filterSet)) {
    return false
  }

  return filterSet.delete(filter)
}

/**
 * Call asynchronous functions sequentially
 *
 * @private
 * @param {function[]} callbacks
 * @param {*} value
 * @param {*} [args]
 * @return {*}
 */
const applySequentially = async <T, U>(callbacks: Function[], value: T, args: U): Promise<T> => {
  for (const callback of callbacks) {
    value = await callback(value, args)
  }

  return value
}

/**
 * Update value from callback return values
 *
 * @param {string} name
 * @param {*} value
 * @param {*} [args]
 * @param {boolean} [isAwait]
 * @return {*}
 */
const applyFilters = <T, U, V extends boolean = false>(
  name: string,
  value: T,
  args?: U,
  isAwait: V = false as V
): FilterReturnType<T, V> => {
  const filterSet = filters.get(name)

  if (!isSetStrict(filterSet)) {
    return value as FilterReturnType<T, V>
  }

  const callbacks: Function[] = []

  for (const callback of filterSet.values()) {
    if (isAwait) {
      callbacks.push(callback)
    } else {
      value = callback(value, args)
    }
  }

  if (isAwait) {
    return applySequentially(callbacks, value, args)
      .then(newValue => newValue)
      .catch(() => value) as FilterReturnType<T, V>
  }

  return value as FilterReturnType<T, V>
}

/**
 * Empty filters map
 *
 * @return {void}
 */
const resetFilters = (): void => {
  filters = new Map([
    ['columnProps', new Set()],
    ['containerProps', new Set()],
    ['fieldProps', new Set()],
    ['formProps', new Set()],
    ['richTextProps', new Set()],
    ['richTextOutput', new Set()],
    ['richTextContentItem', new Set()],
    ['richTextContent', new Set()],
    ['richTextContentOutput', new Set()],
    ['renderItem', new Set()],
    ['renderContent', new Set()],
    ['ajaxResult', new Set()],
    ['cacheData', new Set()],
    ['storeData', new Set()],
    ['contentfulData', new Set()],
    ['wordpressData', new Set()],
    ['localData', new Set()],
    ['allData', new Set()],
    ['slugParts', new Set()],
    ['slug', new Set()]
  ])
}

/**
 * Fill filters map
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
    if (filter == null) {
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
  resetFilters,
  setFilters
}
