/**
 * Utils - Archive
 */

/* Imports */

import type { ArchiveInfo, ArchiveLinkReturn } from './archiveTypes.js'
import type { Taxonomy } from '../../global/globalTypes.js'
import type { RenderItem } from '../../render/renderTypes.js'
import { config } from '../../config/config.js'
import { isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { isBoolean } from '../boolean/boolean.js'
import { normalizeContentType } from '../contentType/contentType.js'
import { getSlug, getPermalink } from '../link/link.js'

/**
 * Get archive id, slug and title
 *
 * @param {string} contentType
 * @return {ArchiveInfo}
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

/**
 * Get taxonomy attributes
 *
 * @param {string} contentType
 * @param {RenderItem} pageData
 * @return {Taxonomy}
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

/**
 * Get archive link by content type or taxonomy
 *
 * @param {string} contentType
 * @param {RenderItem} [pageData]
 * @return {ArchiveLinkReturn}
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
    }, false)

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
    }, false)

    const plural = config?.archiveMeta?.[contentType]?.plural

    title = isStringStrict(plural) ? plural : archiveTitle
  }

  /* Output */

  return {
    title,
    link: isStringStrict(slug) ? getPermalink(slug) : ''
  }
}

/* Exports */

export {
  getArchiveInfo,
  getTaxonomyInfo,
  getArchiveLink
}
