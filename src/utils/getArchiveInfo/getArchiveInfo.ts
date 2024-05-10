/**
 * Utils - Get Archive Info
 */

/* Imports */

import type { ArchiveInfo } from './getArchiveInfoTypes'
import { config } from '../../config/config'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { normalizeContentType } from '../normalizeContentType/normalizeContentType'

/**
 * Function - get archive id, slug and title
 *
 * @param {string} contentType
 * @return {import('./getArchiveInfoTypes').ArchiveInfo}
 */
const getArchiveInfo = (contentType: string = ''): ArchiveInfo => {
  const value = {
    id: '',
    slug: '',
    title: ''
  }

  contentType = normalizeContentType(contentType)

  if (contentType === 'page') {
    return value
  }

  const info = config.archiveMeta[contentType]

  if (!isObjectStrict(info)) {
    return value
  }

  const { id, slug, title } = info

  value.id = isStringStrict(id) ? id : ''
  value.slug = isStringStrict(slug) ? slug : ''
  value.title = isStringStrict(title) ? title : ''

  return value
}

/* Exports */

export { getArchiveInfo }
