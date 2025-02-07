/**
 * Local - Data Normal
 */

/* Imports */

import { isArray } from '../utils/array/array.js'
import { isString } from '../utils/string/string.js'
import { isObject } from '../utils/object/object.js'
import { getObjectKeys } from '../utils/object/objectUtils.js'
import { isFunction } from '../utils/function/function.js'

/**
 * Recursively set internal props from outer data
 *
 * @param {object} data
 * @param {object} currentData
 * @param {string[]} [props]
 * @param {function} [filterValue]
 * @return {void}
 */
const resolveInternalLinks = <T, U>( // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
  data: T,
  currentData: U,
  props: string[] = ['internalLink'],
  filterValue?: (prop: string | number | symbol, value: unknown) => T
): void => {
  if (!isObject(data) || !isObject(currentData) || !isArray(props)) {
    return
  }

  getObjectKeys(currentData).forEach(prop => {
    const value = currentData[prop]

    if (props.includes(prop.toString())) {
      let v

      if (isArray(value)) {
        v = value.map(k => data[k as keyof T])
      }

      if (isString(value)) {
        v = data[value as keyof T]
      }

      if (isFunction(filterValue)) {
        v = filterValue(prop, v)
      }

      // @ts-expect-error - type 'undefined' is not assignable to type '(object & U)[keyof U]'
      currentData[prop] = v
    } else if (isObject(value)) {
      resolveInternalLinks(data, value, props, filterValue)
    }
  })
}

/**
 * Set property in object or array of objects to undefined
 *
 * @param {object|object[]} obj
 * @param {string[]} props
 * @return {object|object[]}
 */
const undefineProps = <T>(obj: T, props: string[] = []): T => {
  if (!isObject(obj)) {
    return obj
  }

  const clone = structuredClone(obj)

  getObjectKeys(clone).forEach(prop => {
    const value = clone[prop]

    if (props.includes(prop.toString())) {
      // @ts-expect-error - type 'undefined' is not assignable to type 'T[keyof T]'
      clone[prop] = undefined
    } else if (isObject(value)) {
      undefineProps(value, props)
    }
  })

  return clone
}

/* Exports */

export {
  resolveInternalLinks,
  undefineProps
}
