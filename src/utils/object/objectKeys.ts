/**
 * Utils - Object Keys
 */

/**
 * Get object keys cast as keyof object
 *
 * Workaround for index signature
 * Check if object with isObject or isObjectStrict beforehand
 *
 * @param {object} obj
 * @return {string[]}
 */
const getObjectKeys = <T>(obj: T): Array<keyof T> => {
  return Object.keys(obj as object) as Array<keyof T>
}

/* Exports */

export { getObjectKeys }
