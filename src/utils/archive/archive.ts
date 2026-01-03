/**
 * Utils - Archive
 */

/* Imports */

import type { ArchiveInfo, ArchiveTaxonomy, ArchiveLink, ArchiveLabels, ArchiveMeta } from './archiveTypes.js'
import type { RenderItem } from '../../render/renderTypes.js'
import { getStoreItem } from '../../store/store.js'
import { isObjectStrict } from '../object/object.js'
import { isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { isBoolean } from '../boolean/boolean.js'
import { normalizeContentType } from '../contentType/contentType.js'
import { getSlug, getPermalink } from '../link/link.js'

/**
 * Check if item is given term.
 *
 * @param {string} contentType
 * @param {RenderItem} itemData
 * @return {boolean}
 */
const isTerm = (contentType: string, itemData: RenderItem): boolean => {
  if (!isObjectStrict(itemData)) {
    return false
  }

  const { contentType: type, taxonomy } = itemData

  if (type !== 'term' || !isObjectStrict(taxonomy)) {
    return false
  }

  return taxonomy.contentTypes.includes(contentType)
}

/**
 * Check if item is given archive or term.
 *
 * @param {string} contentType
 * @param {RenderItem} itemData
 * @return {boolean}
 */
const isArchive = (contentType: string, itemData: RenderItem): boolean => {
  if (!isObjectStrict(itemData)) {
    return false
  }

  const { archive } = itemData

  return archive === contentType || isTerm(contentType, itemData)
}

/**
 * Archive meta by content type and locale.
 *
 * @param {string} contentType
 * @param {string} [locale]
 * @return {ArchiveMeta}
 */
const getArchiveMeta = (contentType: string, locale?: string): ArchiveMeta => {
  const archiveMeta = getStoreItem('archiveMeta')[contentType]

  if (!isObjectStrict(archiveMeta)) {
    return {}
  }

  if (isStringStrict(locale) && isObjectStrict((archiveMeta as Record<string, ArchiveMeta>)[locale])) {
    return (archiveMeta as Record<string, ArchiveMeta>)[locale] as ArchiveMeta
  }

  return archiveMeta
}

/**
 * Archive ID, slug and title.
 *
 * @param {string} contentType
 * @param {string} [locale]
 * @return {ArchiveInfo}
 */
const getArchiveInfo = (contentType: string, locale?: string): ArchiveInfo => {
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

  const {
    id,
    slug,
    title,
    contentType: type
  } = getArchiveMeta(contentType, locale)

  value.id = isStringStrict(id) ? id : ''
  value.slug = isStringStrict(slug) ? slug : ''
  value.title = isStringStrict(title) ? title : ''
  value.contentType = isStringStrict(type) ? type : ''

  return value
}

/**
 * Taxonomy attributes.
 *
 * @param {string} contentType
 * @param {RenderItem} [itemData]
 * @return {ArchiveTaxonomy}
 */
const getTaxonomyInfo = (contentType: string, itemData?: RenderItem): ArchiveTaxonomy => {
  const value: ArchiveTaxonomy = {
    id: '',
    slug: '',
    title: '',
    contentTypes: [],
    primaryContentType: '',
    useContentTypeSlug: true,
    isPage: false
  }

  const taxObj = contentType === 'taxonomy' ? itemData : itemData?.taxonomy

  if (!isObjectStrict(taxObj)) {
    return value
  }

  const {
    id,
    slug,
    link,
    title,
    contentTypes,
    useContentTypeSlug,
    isPage
  } = taxObj

  const taxonomyTypes = isArrayStrict(contentTypes) ? contentTypes.map(type => normalizeContentType(type)) : []
  const primaryTaxonomyType = taxonomyTypes[0]

  value.id = isStringStrict(id) ? id : ''
  value.slug = isStringStrict(slug) ? slug : ''
  value.title = isStringStrict(title) ? title : ''
  value.contentTypes = taxonomyTypes
  value.primaryContentType = isStringStrict(primaryTaxonomyType) ? primaryTaxonomyType : ''
  value.useContentTypeSlug = isBoolean(useContentTypeSlug) ? useContentTypeSlug : true
  value.isPage = isBoolean(isPage) ? isPage : false

  if (isStringStrict(link)) {
    value.link = link
  }

  return value
}

/**
 * Archive link by content type or taxonomy.
 *
 * @param {string} contentType
 * @param {RenderItem} [itemData]
 * @return {ArchiveLink}
 */
const getArchiveLink = (contentType: string, itemData?: RenderItem): ArchiveLink => {
  /* Defaults */

  let title = ''
  let slug

  /* Locale */

  const locale = itemData?.locale as string

  /* Taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, itemData)

  const {
    title: taxonomyTitle,
    isPage: taxonomyIsPage,
    contentTypes: taxonomyTypes,
    useContentTypeSlug: taxonomyUseTypeSlug
  } = taxonomyInfo

  if (contentType === 'term' && taxonomyIsPage) {
    slug = getSlug({
      slug: '',
      contentType,
      itemData
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

  const archiveInfo = getArchiveInfo(contentType, locale)

  const {
    id: archiveId,
    slug: archiveSlug,
    title: archiveTitle,
    contentType: archiveType
  } = archiveInfo

  if (archiveSlug && archiveId) {
    slug = getSlug({
      id: archiveId,
      slug: archiveSlug,
      contentType: archiveType,
      itemData: {
        locale
      }
    })

    title = getArchiveLabel(contentType, itemData, 'plural', archiveTitle) 
  }

  /* Output */

  return {
    title,
    link: isStringStrict(slug) ? getPermalink(slug) : ''
  }
}

/**
 * Localized archive label.
 *
 * @param {string} contentType
 * @param {RenderItem} [itemData]
 * @param {string} [labelType='singular']
 * @param {string} [fallback]
 * @return {string}
 */
const getArchiveLabel = (
  contentType: string,
  itemData?: RenderItem,
  labelType: 'singular' | 'plural' = 'singular',
  fallback?: string
): string => {
  fallback = isStringStrict(fallback) ? fallback : (labelType === 'singular' ? 'Post' : 'Posts')

  const label = getArchiveMeta(contentType, itemData?.locale as string)[labelType]

  return isStringStrict(label) ? label : fallback
}

/**
 * Singular and plural labels by content/taxonomy type.
 *
 * @param {string} contentType
 * @param {RenderItem} [itemData]
 * @return {ArchiveLabels}
 */
const getArchiveLabels = (contentType: string, itemData?: RenderItem): ArchiveLabels => {
  /* Defaults */

  let singular = 'Post'
  let plural = 'Posts'

  /* Taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, itemData)

  const {
    title: taxonomyTitle,
    isPage: taxonomyIsPage,
    primaryContentType: taxonomyType,
    useContentTypeSlug: taxonomyUseTypeSlug
  } = taxonomyInfo

  if (contentType === 'term' && taxonomyIsPage && isStringStrict(taxonomyTitle)) {
    return {
      singular: taxonomyTitle,
      plural: taxonomyTitle
    }
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
    singular = getArchiveLabel(contentType, itemData)
    plural = getArchiveLabel(contentType, itemData, 'plural')
  }

  return {
    singular,
    plural
  }
}

/* Exports */

export {
  isTerm,
  isArchive,
  getArchiveMeta,
  getArchiveInfo,
  getTaxonomyInfo,
  getArchiveLink,
  getArchiveLabels
}
