/**
 * Utils - Get Archive Link
 */

/* Imports */

import type { ArchiveLinkReturn } from './getArchiveLinkTypes'
import type { RenderItem } from '../../render/renderTypes'
import { config } from '../../config/config'
import { normalizeContentType } from '../normalizeContentType/normalizeContentType'
import { isStringStrict } from '../isString/isString'
import { getArchiveInfo } from '../getArchiveInfo/getArchiveInfo'
import { getTaxonomyInfo } from '../getTaxonomyInfo/getTaxonomyInfo'
import { getPermalink } from '../getPermalink/getPermalink'
import { getSlug } from '../getSlug/getSlug'

/**
 * Function - get archive link by content type or taxonomy
 *
 * @param {string} contentType
 * @param {import('../../render/renderTypes').RenderItem} [pageData]
 * @return {import('./getArchiveLinkTypes').ArchiveLinkReturn}
 */
const getArchiveLink = (contentType: string = '', pageData?: RenderItem): ArchiveLinkReturn => {
  /* Defaults */

  let title = ''
  let slug

  /* Normalize */

  contentType = normalizeContentType(contentType)

  /* Taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, pageData)

  const {
    title: taxonomyTitle,
    isPage: taxonomyIsPage,
    contentType: taxonomyType,
    useContentTypeSlug: taxonomyUseTypeSlug
  } = taxonomyInfo

  if (contentType === 'term' && taxonomyIsPage) {
    slug = getSlug({
      slug: '',
      contentType,
      pageData
    })

    title = taxonomyTitle
  }

  const useArchiveType = taxonomyUseTypeSlug && taxonomyType !== ''

  if (contentType === 'taxonomy' && useArchiveType) {
    contentType = taxonomyType
  }

  if (contentType === 'term' && !taxonomyIsPage && useArchiveType) {
    contentType = taxonomyType
  }

  /* Archive */

  const archiveInfo = getArchiveInfo(contentType)

  const {
    id: archiveId,
    slug: archiveSlug,
    title: archiveTitle
  } = archiveInfo

  if (archiveSlug !== '' && archiveId !== '') {
    slug = getSlug({
      id: archiveId,
      slug: archiveSlug,
      contentType: 'page'
    })

    const plural = config.archiveMeta[contentType].plural

    title = isStringStrict(plural) ? plural : archiveTitle
  }

  /* Output */

  return {
    title,
    link: isStringStrict(slug) ? getPermalink(slug) : ''
  }
}

/* Exports */

export { getArchiveLink }
