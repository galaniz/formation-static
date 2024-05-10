/**
 * Utils - Normalize Content Type
 */

/* Imports */

import { config } from '../../config/config'
import { isStringStrict } from '../isString/isString'

/**
 * Function - convert to normal content type if available
 *
 * @param {string} contentType
 * @return {string}
 */
const normalizeContentType = (contentType: string = ''): string => {
  if (!isStringStrict(contentType)) {
    return ''
  }

  const normalType = config.normalTypes[contentType]

  if (isStringStrict(normalType)) {
    return normalType
  }

  return contentType
}

/* Exports */

export { normalizeContentType }
