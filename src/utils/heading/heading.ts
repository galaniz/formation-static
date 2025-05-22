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
  return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
}

/* Exports */

export { isHeading }
