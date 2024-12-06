/**
 * Utils - Print
 */

/* Imports */

import { isArray } from '../array/array.js'

/**
 * Output console message
 *
 * @param {string} pre
 * @param {string|string[]|*} message
 * @param {string} [type=error] - error | warning | success | info
 * @return {void}
 */
const print = (
  pre: string = 'Log',
  message: string | string[] | unknown,
  type: 'error' | 'warning' | 'success' | 'info' = 'error'
): void => {
  const red = '\x1b[31m'
  const green = '\x1b[32m'
  const yellow = '\x1b[33m'
  const blue = '\x1b[36m'
  const reset = '\x1b[0m'
  const bold = '\x1b[1m'
  const messageArr = isArray(message) ? message : [message]
  const messageStr = messageArr.join('\n').trim()
  const output = `${bold}${pre}: ${reset}\n${messageStr}`

  if (type === 'error') {
    console.error(`${red}${output}`)
  }

  if (type === 'warning') {
    console.warn(`${yellow}${output}`)
  }

  if (type === 'success') {
    console.info(`${green}${output}`)
  }

  if (type === 'info') {
    console.info(`${blue}${output}`)
  }
}

/* Exports */

export { print }
