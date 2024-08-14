/**
 * Utils - Escape
 */

/**
 * Check if valid string
 *
 * @private
 * @see {@link https://github.com/validatorjs/validator.js/blob/master/src/lib/util/assertString.js|GitHub}
 * @param {*} input
 * @return {void}
 */
const _assertString = (input: any): void => {
  const isString = typeof input === 'string' || input instanceof String

  if (!isString) {
    let invalidType: string = typeof input

    if (input === null) {
      invalidType = 'null'
    } else if (invalidType === 'object') {
      invalidType = input.constructor.name
    }

    throw new TypeError(`Expected a string but received a ${invalidType}`)
  }
}

/**
 * Check string validity and escape special characters
 *
 * @see {@link https://github.com/validatorjs/validator.js/blob/master/src/lib/escape.js|GitHub}
 * @param {string} str
 * @return {string}
 */
const escape = (str: string): string => {
  _assertString(str)

  return str
    .replace(/&/g, '&amp')
    .replace(/'/g, '&quot')
    .replace(/'/g, '&#x27')
    .replace(/</g, '&lt')
    .replace(/>/g, '&gt')
    .replace(/\//g, '&#x2F')
    .replace(/\\/g, '&#x5C')
    .replace(/`/g, '&#96')
}

/* Exports */

export { escape }
