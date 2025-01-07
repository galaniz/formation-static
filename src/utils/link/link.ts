/**
 * Utils - Link
 */

/* Imports */

import type { LinkSlugArgs, LinkSlugParent, LinkSlugReturnType } from './linkTypes.js'
import type { InternalLink } from '../../global/globalTypes.js'
import { isNumber } from '../number/number.js'
import { isObjectStrict } from '../object/object.js'
import { isString, isStringStrict } from '../string/string.js'
import { applyFilters } from '../filter/filter.js'
import { getArchiveInfo, getTaxonomyInfo } from '../archive/archive.js'
import { getStoreItem } from '../../store/store.js'
import { config } from '../../config/config.js'

/**
 * Recurse to get ascendents
 *
 * @private
 * @param {string} id
 * @param {string} contentType
 * @param {LinkSlugParent[]} parents
 * @return {void}
 */
const getParentSlug = (id: string, contentType: string, parents: LinkSlugParent[]): void => {
  const storeParents = getStoreItem('parents')
  const parent = storeParents[contentType]?.[id]

  if (parent != null) {
    parents.unshift({ ...parent, contentType })
    getParentSlug(parent.id, contentType, parents)
  }
}

/**
 * Get slug with archive/taxonomy base and parents
 *
 * @param {LinkSlugArgs} args
 * @return {LinkSlugReturnType}
 */
const getSlug = <T extends boolean = false>(
  args: LinkSlugArgs,
  returnParents = false as T
): LinkSlugReturnType<T> => {
  let {
    id = '',
    slug = '',
    page = 0,
    contentType = 'page',
    pageData = undefined
  } = isObjectStrict(args) ? args : {}

  /* Types slugs */

  let typeSlug = ''
  let taxSlug = ''
  let parentSlugs = ''

  /* Parts */

  let parts: string[] = []

  /* Config types */

  const {
    hierarchicalTypes,
    typeInSlug,
    localeInSlug
  } = config

  /* Locale */

  const pageLocale = pageData?.locale
  const hasPageLocale = isStringStrict(pageLocale)
  const locale = hasPageLocale ? localeInSlug[pageLocale] : ''
  const hasLocale = isStringStrict(locale)

  /* Term/taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, pageData)
  const isTaxonomy = contentType === 'taxonomy'
  const isTerm = contentType === 'term'

  const {
    id: taxonomyId,
    slug: taxonomySlug,
    title: taxonomyTitle,
    primaryContentType: taxonomyType,
    usePrimaryContentTypeSlug: taxonomyUseTypeSlug,
    isPage: taxonomyIsPage
  } = taxonomyInfo

  /* Archive */

  const archiveType = isStringStrict(taxonomyType) ? taxonomyType : contentType
  const archiveInfo = getArchiveInfo(archiveType)

  const {
    id: archiveId,
    slug: archiveSlug,
    title: archiveTitle,
    contentType: archiveContentType
  } = archiveInfo

  /* Archive and/or taxonomy parent */

  const archiveParents: LinkSlugParent[] = []

  if (archiveSlug !== '' && archiveId !== '') {
    typeSlug = archiveSlug

    archiveParents.push({
      contentType: archiveContentType,
      title: archiveTitle,
      slug: archiveSlug,
      id: archiveId
    })
  }

  if ((isTaxonomy || isTerm) && !taxonomyUseTypeSlug) {
    typeSlug = ''
  }

  if (isTerm && taxonomySlug !== '' && taxonomyId !== '') {
    taxSlug = taxonomySlug

    if (taxonomyIsPage) {
      archiveParents.push({
        contentType: 'taxonomy',
        title: taxonomyTitle,
        slug: taxonomySlug,
        id: taxonomyId
      })
    }
  }

  /* Content type */

  const contentTypeInSlug = typeInSlug[archiveType]

  if (isString(contentTypeInSlug)) {
    typeSlug = contentTypeInSlug
  }

  if (isObjectStrict(contentTypeInSlug) && hasPageLocale) {
    const localizedTypeSlug = contentTypeInSlug[pageLocale]

    if (isString(localizedTypeSlug)) {
      typeSlug = localizedTypeSlug
    }
  }

  /* Page parents */

  const isHierarchical = hierarchicalTypes.includes(contentType)
  let parents: LinkSlugParent[] = []
  let hasParents = false

  getParentSlug(
    isHierarchical ? id : archiveId,
    isHierarchical ? contentType : archiveContentType,
    parents
  )

  if (parents.length > 0) {
    parentSlugs = parents.map(({ slug }) => slug).join('/')
    hasParents = true
  }

  if (isHierarchical) {
    parents = [...archiveParents, ...parents]
  } else {
    parents = [...parents, ...archiveParents]
  }

  /* Index */

  const isIndex = slug === 'index'

  if (isIndex && returnParents === false) {
    slug = ''
  }

  /* Filter parts */

  if (hasLocale) {
    parts.push(locale)
  }

  if (hasParents && !isHierarchical) {
    parts.push(parentSlugs)
  }

  if (typeSlug !== '') {
    parts.push(typeSlug)
  }

  if (taxSlug !== '') {
    parts.push(taxSlug)
  }

  if (hasParents && isHierarchical) {
    parts.push(parentSlugs)
  }

  if (isStringStrict(slug) && !isIndex) {
    parts.push(slug)
  }

  parts = applyFilters('slugParts', parts, args)

  /* Slug */

  let fullSlug = `${parts.length > 0 ? parts.join('/') : ''}${isNumber(page) && page > 1 ? `/?page=${page}` : ''}`
  fullSlug = applyFilters('slug', fullSlug, args)

  /* Parents and slug return */

  if (returnParents === true) {
    const res = {
      slug: fullSlug,
      parents
    }

    return res as LinkSlugReturnType<T>
  }

  /* Slug return */

  return fullSlug as LinkSlugReturnType<T>
}

/**
 * Get absolute or relative url
 *
 * @param {string} slug
 * @param {boolean} trailingSlash
 * @return {string}
 */
const getPermalink = (slug: string = '', trailingSlash: boolean = true): string => {
  let url = '/'

  if (config.env.prod) {
    url = config.env.prodUrl
  }

  if (slug === '/') {
    return url
  }

  return `${url}${slug}${slug !== '' && trailingSlash ? '/' : ''}`
}

/**
 * Get permalink from external or internal source
 *
 * @param {InternalLink} [internalLink]
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

    return getPermalink(res)
  }

  return isStringStrict(externalLink) ? externalLink : ''
}

/* Exports */

export {
  getSlug,
  getLink,
  getPermalink
}
