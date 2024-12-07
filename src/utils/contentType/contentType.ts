/**
 * Utils - Content Type
 */

/* Imports */

import type { ContentTypeLabels } from './contentTypeTypes.js'
import type { Taxonomy } from '../../global/globalTypes.js'
import { isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { getStoreItem } from '../../store/store.js'
import { config } from '../../config/config.js'

/**
 * Convert to normal content type if available
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

/**
 * Singular and plural labels by content/taxonomy type
 *
 * @param {string} contentType
 * @param {Taxonomy} [taxonomy]
 * @return {ContentTypeLabels}
 */
const getContentTypeLabels = (
  contentType: string,
  taxonomy?: Taxonomy
): ContentTypeLabels => {
  let singular = 'Post'
  let plural = 'Posts'
  let type = contentType

  if (isObjectStrict(taxonomy)) {
    type = taxonomy.contentType
  }

  if (isStringStrict(type)) {
    type = normalizeContentType(type)

    const archiveType = getStoreItem('archiveMeta')[type]
    const s = archiveType?.singular
    const p = archiveType?.plural

    singular = isStringStrict(s) ? s : 'Post'
    plural = isStringStrict(p) ? p : 'Posts'
  }

  return {
    singular,
    plural
  }
}

/* Exports */

export {
  normalizeContentType,
  getContentTypeLabels
}
