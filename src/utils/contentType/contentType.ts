/**
 * Utils - Content Type
 */

/* Imports */

import { isStringStrict } from '../string/string.js'
import { config } from '../../config/config.js'

/**
 * Convert to normal content type if available.
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
