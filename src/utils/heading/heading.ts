/**
 * Utils - Heading
 */

/**
 * Check if tag is a heading.
 *
 * @param {string} tag
 * @return {boolean}
 */
const isHeading = (tag: string): boolean => {
  return new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).has(tag)
}

/* Exports */

export { isHeading }
