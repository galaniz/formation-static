/**
 * Utils - Get Link
 */

/* Imports */

import type { InternalLink } from '../../global/globalTypes'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'
import { isObjectStrict } from '../isObject/isObject'
import { isString, isStringStrict } from '../isString/isString'

/**
 * Function - get permalink from external or internal source
 *
 * @param {import('../../global/globalTypes').InternalLink} [internalLink]
 * @param {string} [externalLink]
 * @return {string}
 */
const getLink = (internalLink?: InternalLink, externalLink?: string): string => {
  if (isObjectStrict(internalLink)) {
    const slug = internalLink.slug

    const res = getSlug({
      id: internalLink.id,
      contentType: internalLink.contentType,
      pageData: internalLink,
      slug: isString(slug) ? slug : ''
    })

    if (isString(res)) {
      return getPermalink(res)
    }

    return ''
  }

  return isStringStrict(externalLink) ? externalLink : ''
}

/* Exports */

export { getLink }
