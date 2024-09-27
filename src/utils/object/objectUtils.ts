/**
 * Utils - Object Utils
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

/**
 * Preserve type in object entries
 *
 * @param {object} obj
 * @return {Array.<Array.<string, *>>}
 */
const getObjectEntries = <T extends object> (obj: T): Array<[keyof T, T[keyof T]]> => {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/* Exports */

export {
  getObjectKeys,
  getObjectEntries
}
