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
  return typeof value === 'object' && value != null
}

/**
 * Non-object types
 */
type NotObject<T, K> = Exclude<T, string | number | boolean | Map<T, K> | Set<T> | FormData | null | undefined | unknown[] | string[] | number[] | boolean[]>

/**
 * Check if value is an object and not object-like (array, map, blob etc.)
 *
 * @param {*} value
 * @return {boolean}
 */
const isObjectStrict = <T, K>(value: T): value is object & NotObject<T, K> => {
  return isObject(value) && Object.prototype.toString.call(value) === '[object Object]'
}

/* Exports */

export {
  isObject,
  isObjectStrict
}
