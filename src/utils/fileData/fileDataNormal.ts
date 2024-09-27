/**
 * Utils - File Data Normal
 */

/* Imports */

import { isArray } from '../array/array.js'
import { isString } from '../string/string.js'
import { isObject } from '../object/object.js'
import { getObjectKeys } from '../object/objectUtils.js'
import { isFunction } from '../function/function.js'

/**
 * Recursively set internal props from outer data
 *
 * @param {object} data
 * @param {object} currentData
 * @param {string[]} [props]
 * @param {function} [filterValue]
 * @return {void}
 */
const resolveInternalLinks = <T, U>(
  data: T,
  currentData: U,
  props: string[] = ['internalLink'],
  filterValue?: Function
): void => {
  if (!isObject(data) || !isObject(currentData) || !isArray(props)) {
    return
  }

  getObjectKeys(currentData).forEach((prop) => {
    const value = currentData[prop]

    if (props.includes(prop.toString())) {
      let v

      if (isArray(value)) {
        v = value.map((k) => data[k as keyof T])
      }

      if (isString(value)) {
        v = data[value as keyof T]
      }

      if (isFunction(filterValue)) {
        v = filterValue(prop, v)
      }

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

  getObjectKeys(clone).forEach((prop) => {
    const value = clone[prop]

    if (props.includes(prop.toString())) {
      // @ts-expect-error: Type 'undefined' is not assignable to type 'T[keyof T]'
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
