/**
 * Utils - Minify
 */

/**
 * Remove extra spaces from a string
 *
 * @param {string} value
 * @return {string}
 */
const minify = (value: string): string => {
  return value.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim()
}

/* Exports */

export { minify }
