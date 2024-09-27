/**
 * Utils - Object
 */

/**
 * Check if value is an object
 *
 * @param {*} value
 * @return {boolean}
 */
const isObject = <T>(value: T): value is object & T => {
  return typeof value === 'object' && value !== null && value !== undefined
}

/**
 * Check if value is an object and not array
 *
 * @param {*} value
 * @return {boolean}
 */
const isObjectStrict = <T>(value: T): value is object & Exclude<T, string | number | boolean | Function | null | undefined | unknown[] | string[] | number[] | boolean[] | Function[]> => {
  if (Array.isArray(value)) {
    return false
  }

  return isObject(value)
}

/* Exports */

export {
  isObject,
  isObjectStrict
}
