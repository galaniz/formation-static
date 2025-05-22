/**
 * Utils - Object Utils
 */

/**
 * Preserve type in object keys.
 *
 * @param {object} obj
 * @return {string[]}
 */
const getObjectKeys = <T>(obj: T): Array<keyof T> => {
  return Object.keys(obj as object) as Array<keyof T>
}

/* Exports */

export { getObjectKeys }
