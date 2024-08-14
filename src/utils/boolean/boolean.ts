/**
 * Utils - Boolean
 */

/**
 * Check if value is boolean
 *
 * @param {*} value
 * @return {boolean}
 */
const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

/* Exports */

export { isBoolean }
