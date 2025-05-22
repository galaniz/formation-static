/**
 * Utils - Year
 */

/**
 * Current year as YYYY.
 *
 * @return {number}
 */
const getYear = (): number => {
  const date = new Date()

  return date.getFullYear()
}

/* Exports */

export { getYear }
