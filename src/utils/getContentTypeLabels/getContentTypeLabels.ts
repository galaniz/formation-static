/**
 * Utils - Get Content Type Labels
 */

/* Imports */

import type { ContentTypeLabels } from './getContentTypeLabelsTypes'
import type { Taxonomy } from '../../global/globalTypes'
import { config } from '../../config/config'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { normalizeContentType } from '../normalizeContentType/normalizeContentType'

/**
 * Function - singular and plural labels by content/taxonomy type
 *
 * @param {string} contentType
 * @param {string} [casing]
 * @param {import('../../global/globalTypes').Taxonomy} [taxonomy]
 * @return {import('./getContentTypeLabelsTypes').ContentTypeLabels}
 */
const getContentTypeLabels = (
  contentType: string = '',
  casing: string = '',
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

    const s = config.archiveMeta[type].singular
    const p = config.archiveMeta[type].plural

    singular = isStringStrict(s) ? s : ''
    plural = isStringStrict(p) ? p : ''
  }

  if (casing === 'lower') {
    singular = singular.toLowerCase()
    plural = plural.toLowerCase()
  }

  if (casing === 'upper') {
    singular = singular.toUpperCase()
    plural = plural.toUpperCase()
  }

  return {
    singular,
    plural
  }
}

/* Exports */

export { getContentTypeLabels }
