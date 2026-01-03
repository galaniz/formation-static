/**
 * Utils - Proto
 */

/**
 * Check if value is a prototype key.
 *
 * @param {*} value
 * @return {boolean}
 */
const isProto = (value: string): boolean => {
  const protoKeys = new Set([
    '__proto__',
    'constructor',
    'prototype'
  ])

  return protoKeys.has(value)
}

/* Exports */

export { isProto }
