/**
 * Utils - Print
 */

/* Imports */

import { isArray } from '../array/array.js'
import { isString } from '../string/string.js'

/**
 * Output console message
 *
 * @param {string} pre
 * @param {string|string[]|*} message
 * @param {string} [type=error] - error | warning | success | info
 * @return {void}
 */
const print = (
  pre: string,
  message: string | string[] | unknown,
  type: 'error' | 'warning' | 'success' | 'info' = 'error'
): void => {
  const red = '\x1b[31m'
  const green = '\x1b[32m'
  const yellow = '\x1b[33m'
  const blue = '\x1b[36m'
  const reset = '\x1b[0m'
  const bold = '\x1b[1m'

  let msg = isArray(message) ? message : [message]

  if (msg.length > 0) {
    const lastIndex = msg.length - 1

    msg = msg.map((m, i) => {
      if (isString(m) && i < lastIndex) {
        return `${m}\n`
      }

      return m
    })
  }

  if (type === 'error') {
    console.error(`${bold}${red}${pre}: ${reset}\n`, ...msg)
  }

  if (type === 'warning') {
    console.warn(`${bold}${yellow}${pre}: ${reset}\n`, ...msg)
  }

  if (type === 'success') {
    console.info(`${bold}${green}${pre}: ${reset}\n`, ...msg)
  }

  if (type === 'info') {
    console.info(`${bold}${blue}${pre}: ${reset}\n`, ...msg)
  }
}

/* Exports */

export { print }
