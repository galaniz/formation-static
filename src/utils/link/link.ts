/**
 * Utils - Link
 */

/* Imports */

import type { LinkSlugArgs, LinkSlugReturnType } from './linkTypes.js'
import type { InternalLink } from '../../global/globalTypes.js'
import type { StoreParent } from '../../store/storeTypes.js'
import { config } from '../../config/config.js'
import { isObjectStrict } from '../object/object.js'
import { isString, isStringStrict } from '../string/string.js'
import { applyFilters } from '../filter/filter.js'
import { getArchiveInfo, getTaxonomyInfo } from '../archive/archive.js'
import { getStoreItem } from '../../store/store.js'

/**
 * Recurse to get ascendents
 *
 * @private
 * @param {string} id
 * @param {StoreParent[]} parents
 * @return {void}
 */
const getParentSlug = (id: string = '', parents: StoreParent[] = []): void => {
  const storeParents = getStoreItem('parents')

  if (storeParents[id] != null) {
    parents.unshift(storeParents[id])

    getParentSlug(storeParents[id].id, parents)
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
  const {
    id = '',
    slug = '',
    page = 0,
    contentType = 'page',
    pageData = undefined
  } = isObjectStrict(args) ? args : {}

  /* Index */

  const isIndex = slug === 'index'

  if (isIndex && returnParents === false) {
    return '' as LinkSlugReturnType<T>
  }

  /* Parts */

  let parts: string[] = []

  /* Config types */

  const {
    hierarchicalTypes,
    typesInSlug,
    localesInSlug
  } = config

  /* Locale */

  const locale = pageData?.locale
  const hasLocale = isStringStrict(locale)

  if (hasLocale && localesInSlug.includes(locale)) {
    parts.push(locale)
  }

  /* Term/taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, pageData)

  const {
    id: taxonomyId,
    slug: taxonomySlug,
    title: taxonomyTitle,
    contentType: taxonomyType,
    useContentTypeSlug: taxonomyUseTypeSlug,
    isPage: taxonomyIsPage
  } = taxonomyInfo

  /* Archive */

  const archiveType = isStringStrict(taxonomyType) ? taxonomyType : contentType
  const archiveInfo = getArchiveInfo(archiveType)

  const {
    id: archiveId,
    slug: archiveSlug,
    title: archiveTitle
  } = archiveInfo

  /* Archive and/or taxonomy parent */

  let archiveParent
  let archiveParts: string[] = []

  if (archiveSlug !== '' && archiveId !== '') {
    archiveParts.push(archiveSlug)

    archiveParent = {
      contentType: 'page',
      title: archiveTitle,
      slug: archiveSlug,
      id: archiveId
    }
  }

  if (contentType === 'taxonomy' && !taxonomyUseTypeSlug) {
    archiveParts = []
    archiveParent = undefined
  }

  if (contentType === 'term' && taxonomySlug !== '' && taxonomyId !== '') {
    if (taxonomyUseTypeSlug) {
      archiveParts.push(taxonomySlug)
    } else {
      archiveParts = [taxonomySlug]
    }

    if (taxonomyIsPage) {
      archiveParent = {
        contentType: 'taxonomy',
        title: taxonomyTitle,
        slug: taxonomySlug,
        id: taxonomyId
      }
    }
  }

  parts = [...parts, ...archiveParts]

  /* Content type */

  const typeInSlug = typesInSlug[contentType]

  if (isString(typeInSlug)) {
    parts.push(typeInSlug)
  }

  if (isObjectStrict(typeInSlug) && hasLocale) {
    const localizedTypeSlug = typeInSlug[locale]

    if (isString(localizedTypeSlug)) {
      parts.push(localizedTypeSlug)
    }
  }

  /* Page parents */

  const isHierarchical = hierarchicalTypes.includes(contentType)
  const parents: StoreParent[] = []

  getParentSlug(isHierarchical ? id : archiveId, parents)

  if (parents.length > 0) {
    parts.push(`${parents.map(({ slug }) => slug).join('/')}`)
  }

  /* Filter parts */

  parts = applyFilters('slugParts', parts, args)

  /* Slug */

  if (isStringStrict(slug) && !isIndex) {
    parts.push(slug)
  }

  let s = `${parts.length > 0 ? parts.join('/') : ''}${page !== 0 ? `/?page=${page}` : ''}`

  s = applyFilters('slug', s, args)

  /* Parents and slug return */

  if (returnParents === true) {
    if (archiveParent != null) {
      parents.unshift(archiveParent)
    }

    const res = {
      slug: s,
      parents
    }

    return res as LinkSlugReturnType<T>
  }

  /* Slug return */

  return s as LinkSlugReturnType<T>
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
