/**
 * Utils - Archive
 */

/* Imports */

import type { ArchiveInfo, ArchiveTaxonomy, ArchiveLink, ArchiveLabels } from './archiveTypes.js'
import type { RenderItem } from '../../render/renderTypes.js'
import { getStoreItem } from '../../store/store.js'
import { isObjectStrict } from '../object/object.js'
import { isArrayStrict } from '../array/array.js'
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
const getArchiveInfo = (contentType: string): ArchiveInfo => {
  const value = {
    id: '',
    slug: '',
    title: '',
    contentType: ''
  }

  contentType = normalizeContentType(contentType)

  if (contentType === 'page') {
    return value
  }

  const info = getStoreItem('archiveMeta')[contentType]

  if (!isObjectStrict(info)) {
    return value
  }

  const { id, slug, title, contentType: type } = info

  value.id = isStringStrict(id) ? id : ''
  value.slug = isStringStrict(slug) ? slug : ''
  value.title = isStringStrict(title) ? title : ''
  value.contentType = isStringStrict(type) ? type : ''

  return value
}

/**
 * Get taxonomy attributes
 *
 * @param {string} contentType
 * @param {RenderItem} [pageData]
 * @return {ArchiveTaxonomy}
 */
const getTaxonomyInfo = (contentType: string, pageData?: RenderItem): ArchiveTaxonomy => {
  const value: ArchiveTaxonomy = {
    id: '',
    slug: '',
    title: '',
    contentTypes: [],
    primaryContentType: '',
    usePrimaryContentTypeSlug: true,
    isPage: false
  }

  contentType = normalizeContentType(contentType)

  const taxObj = contentType === 'taxonomy' ? pageData : pageData?.taxonomy

  if (!isObjectStrict(taxObj)) {
    return value
  }

  const {
    id,
    slug,
    title,
    contentTypes,
    usePrimaryContentTypeSlug,
    isPage
  } = taxObj

  const taxonomyTypes = isArrayStrict(contentTypes) ? contentTypes.map(type => normalizeContentType(type)) : []
  const primaryTaxonomyType = taxonomyTypes[0]

  value.id = isStringStrict(id) ? id : ''
  value.slug = isStringStrict(slug) ? slug : ''
  value.title = isStringStrict(title) ? title : ''
  value.contentTypes = taxonomyTypes
  value.primaryContentType = isStringStrict(primaryTaxonomyType) ? primaryTaxonomyType : ''
  value.usePrimaryContentTypeSlug = isBoolean(usePrimaryContentTypeSlug) ? usePrimaryContentTypeSlug : true
  value.isPage = isBoolean(isPage) ? isPage : false

  return value
}

/**
 * Get archive link by content type or taxonomy
 *
 * @param {string} contentType
 * @param {RenderItem} [pageData]
 * @return {ArchiveLink}
 */
const getArchiveLink = (contentType: string, pageData?: RenderItem): ArchiveLink => {
  /* Defaults */

  let title = ''
  let slug

  /* Taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, pageData)

  const {
    title: taxonomyTitle,
    isPage: taxonomyIsPage,
    contentTypes: taxonomyTypes,
    usePrimaryContentTypeSlug: taxonomyUseTypeSlug
  } = taxonomyInfo

  if (contentType === 'term' && taxonomyIsPage) {
    slug = getSlug({
      slug: '',
      contentType,
      pageData
    })

    title = taxonomyTitle
  }

  const taxonomyType = taxonomyTypes[0]
  const useArchiveType = taxonomyUseTypeSlug && isStringStrict(taxonomyType)

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
    title: archiveTitle,
    contentType: archiveType
  } = archiveInfo

  if (archiveSlug !== '' && archiveId !== '') {
    slug = getSlug({
      id: archiveId,
      slug: archiveSlug,
      contentType: archiveType
    })

    const plural = getStoreItem('archiveMeta')[contentType]?.plural

    title = isStringStrict(plural) ? plural : archiveTitle
  }

  /* Output */

  return {
    title,
    link: isStringStrict(slug) ? getPermalink(slug) : ''
  }
}

/**
 * Singular and plural labels by content/taxonomy type
 *
 * @param {string} contentType
 * @param {RenderItem} [pageData]
 * @return {ArchiveLabels}
 */
const getArchiveLabels = (contentType: string, pageData?: RenderItem): ArchiveLabels => {
  /* Defaults */

  let singular = 'Post'
  let plural = 'Posts'

  /* Taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, pageData)

  const {
    title: taxonomyTitle,
    isPage: taxonomyIsPage,
    primaryContentType: taxonomyType,
    usePrimaryContentTypeSlug: taxonomyUseTypeSlug
  } = taxonomyInfo

  if (contentType === 'term' && taxonomyIsPage) {
    singular = taxonomyTitle
    plural = taxonomyTitle
  }

  const useArchiveType = taxonomyUseTypeSlug && isStringStrict(taxonomyType)

  if (contentType === 'taxonomy' && useArchiveType) {
    contentType = taxonomyType
  }

  if (contentType === 'term' && !taxonomyIsPage && useArchiveType) {
    contentType = taxonomyType
  }

  if (isStringStrict(contentType)) {
    contentType = normalizeContentType(contentType)

    const archiveType = getStoreItem('archiveMeta')[contentType]
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
  getArchiveInfo,
  getTaxonomyInfo,
  getArchiveLink,
  getArchiveLabels
}
