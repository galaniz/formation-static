/**
 * Utils - Get Taxonomy Info
 */

/* Imports */

import type { Taxonomy } from '../../global/globalTypes'
import type { RenderItem } from '../../render/renderTypes'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isBoolean } from '../isBoolean/isBoolean'
import { normalizeContentType } from '../normalizeContentType/normalizeContentType'

/**
 * Function - get taxonomy attributes
 *
 * @param {string} contentType
 * @param {import('../../render/renderTypes').RenderItem} pageData
 * @return {import('../../global/globalTypes').Taxonomy}
 */
const getTaxonomyInfo = (contentType: string, pageData: RenderItem | undefined): Required<Taxonomy> => {
  const value = {
    id: '',
    slug: '',
    title: '',
    contentType: '',
    useContentTypeSlug: true,
    isPage: false
  }

  const taxObj = contentType === 'taxonomy' ? pageData : pageData?.taxonomy

  if (!isObjectStrict(taxObj)) {
    return value
  }

  const {
    id,
    slug,
    title,
    contentType: type,
    useContentTypeSlug,
    isPage
  } = taxObj

  value.id = isStringStrict(id) ? id : ''
  value.slug = isStringStrict(slug) ? slug : ''
  value.title = isStringStrict(title) ? title : ''
  value.contentType = isStringStrict(type) ? normalizeContentType(type) : ''
  value.useContentTypeSlug = isBoolean(useContentTypeSlug) ? useContentTypeSlug : true
  value.isPage = isBoolean(isPage) ? isPage : false

  return value
}

/* Exports */

export { getTaxonomyInfo }
