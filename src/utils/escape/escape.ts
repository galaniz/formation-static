/**
 * Utils - Escape
 */

/* Imports */

import { isString } from '../string/string.js'

/**
 * Check string validity and escape special characters.
 *
 * @see {@link https://github.com/validatorjs/validator.js/blob/master/src/lib/escape.js|Validator} for source.
 * @param {string} value
 * @return {string}
 */
const escape = (value: string): string => {
  if (!isString(value)) {
    throw new TypeError('Value is not a string')
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#96;')
}

/* Exports */

export { escape }
