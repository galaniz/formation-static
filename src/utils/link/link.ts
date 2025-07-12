/**
 * Utils - Link
 */

/* Imports */

import type { LinkSlugArgs, LinkSlugReturnType } from './linkTypes.js'
import type { InternalLink, Taxonomy } from '../../global/globalTypes.js'
import { isObjectStrict } from '../object/object.js'
import { isString, isStringStrict } from '../string/string.js'
import { applyFilters } from '../filter/filter.js'
import { getArchiveInfo, getTaxonomyInfo } from '../archive/archive.js'
import { getStoreItem } from '../../store/store.js'
import { config } from '../../config/config.js'

/**
 * Recurse to get ascendents.
 *
 * @private
 * @param {string} id
 * @param {string} contentType
 * @param {InternalLink[]} parents
 * @param {Taxonomy} [taxonomy]
 * @param {string} [locale]
 * @return {void}
 */
const getParentSlug = (
  id: string,
  contentType: string,
  parents: InternalLink[],
  taxonomy?: Taxonomy,
  locale?: string
): void => {
  const storeParents = getStoreItem('parents')
  const parent = storeParents[contentType]?.[id]

  if (parent) {
    const [parentId, parentSlug, parentTitle] = parent

    const newParent: InternalLink = {
      id: parentId,
      slug: parentSlug,
      title: parentTitle,
      contentType,
      locale
    }

    if (contentType === 'term') {
      newParent.taxonomy = taxonomy
    }

    parents.unshift(newParent)
    getParentSlug(parentId, contentType, parents, taxonomy, locale)
  }
}

/**
 * Slug with archive/taxonomy base and parents.
 *
 * @param {LinkSlugArgs} args
 * @param {boolean} [returnParents]
 * @return {LinkSlugReturnType}
 */
const getSlug = <T extends boolean = false>(
  args: LinkSlugArgs,
  returnParents: T = false as T
): LinkSlugReturnType<T> => {
  const {
    id = '',
    slug: initSlug = '',
    contentType = 'page',
    itemData,
    params
  } = isObjectStrict(args) ? args : {}

  let slug = initSlug

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
    localeInSlug,
    taxonomyInSlug
  } = config

  /* Locale */

  const itemLocale = isStringStrict(itemData?.locale) ? itemData.locale : undefined
  const hasItemLocale = itemLocale != null
  const locale = hasItemLocale ? localeInSlug[itemLocale] : ''
  const hasLocale = isStringStrict(locale)

  /* Term/taxonomy */

  const taxonomyInfo = getTaxonomyInfo(contentType, itemData)
  const isTaxonomy = contentType === 'taxonomy'
  const isTerm = contentType === 'term'

  const {
    id: taxonomyId,
    slug: taxonomySlug,
    primaryContentType: taxonomyType,
    usePrimaryContentTypeSlug: taxonomyUseTypeSlug,
    isPage: taxonomyIsPage
  } = taxonomyInfo

  /* Archive */

  const archiveType = isStringStrict(taxonomyType) ? taxonomyType : contentType
  const archiveInfo = getArchiveInfo(archiveType, itemLocale)

  const {
    id: archiveId,
    slug: archiveSlug,
    title: archiveTitle,
    contentType: archiveContentType
  } = archiveInfo

  /* Archive and/or taxonomy parent */

  const archiveParents: InternalLink[] = []

  if (archiveSlug && archiveId) {
    typeSlug = archiveSlug

    archiveParents.push({
      contentType: archiveContentType,
      title: archiveTitle,
      slug: archiveSlug,
      id: archiveId,
      locale: itemLocale
    })
  }

  if ((isTaxonomy || isTerm) && !taxonomyUseTypeSlug) {
    typeSlug = ''
  }

  if (isTerm && taxonomySlug && taxonomyId) {
    taxSlug = taxonomySlug

    const taxInSlug = taxonomyInSlug[taxSlug]

    if (isString(taxInSlug)) {
      taxSlug = taxInSlug
    }

    if (isObjectStrict(taxInSlug) && hasItemLocale) {
      const localizedTaxSlug = taxInSlug[itemLocale]

      if (isString(localizedTaxSlug)) {
        taxSlug = localizedTaxSlug
      }
    }

    if (taxonomyIsPage) {
      archiveParents.push({
        contentType: 'taxonomy',
        locale: itemLocale,
        ...taxonomyInfo
      })
    }
  }

  /* Content type */

  const contentTypeInSlug = typeInSlug[archiveType]

  if (isString(contentTypeInSlug)) {
    typeSlug = contentTypeInSlug
  }

  if (isObjectStrict(contentTypeInSlug) && hasItemLocale) {
    const localizedTypeSlug = contentTypeInSlug[itemLocale]

    if (isString(localizedTypeSlug)) {
      typeSlug = localizedTypeSlug
    }
  }

  /* Item parents */

  const isHierarchical = hierarchicalTypes.includes(contentType)
  let parents: InternalLink[] = []
  let hasParents = false

  getParentSlug(
    isHierarchical ? id : archiveId,
    isHierarchical ? contentType : archiveContentType,
    parents,
    taxonomyInfo,
    itemLocale
  )

  if (parents.length) {
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

  if (isIndex && !returnParents) {
    slug = ''
  }

  /* Filter parts */

  if (hasLocale) {
    parts.push(locale)
  }

  if (hasParents && !isHierarchical) {
    parts.push(parentSlugs)
  }

  if (typeSlug) {
    parts.push(typeSlug)
  }

  if (taxSlug) {
    parts.push(taxSlug)
  }

  if (hasParents && isHierarchical) {
    parts.push(parentSlugs)
  }

  if (isStringStrict(slug) && !isIndex) {
    parts.push(slug)
  }

  parts = applyFilters('slugParts', parts, args)

  /* Params */

  if (params) {
    const paramsStr = new URLSearchParams(params).toString()

    if (paramsStr) {
      parts.push(`?${paramsStr}`)
    }
  }

  /* Slug */

  let fullSlug = parts.length ? parts.join('/') : ''
  fullSlug = applyFilters('slug', fullSlug, args)

  /* Parents and slug return */

  if (returnParents) {
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
 * Absolute or relative url.
 *
 * @param {string} [slug]
 * @param {boolean} [trailingSlash]
 * @return {string}
 */
const getPermalink = (slug: string = '', trailingSlash: boolean = true): string => {
  let url = ''

  if (config.env.prod) {
    url = config.env.prodUrl
  }

  if (!isStringStrict(slug) || slug === '/') {
    return `${url}/`
  }

  const hasStartSlash = slug.startsWith('/')
  const hasEndSlash = slug.endsWith('/')

  if (!hasStartSlash) {
    slug = `/${slug}`
  }

  if (!hasEndSlash && trailingSlash) {
    slug = `${slug}/`
  }

  return `${url}${slug}`
}

/**
 * Permalink from external or internal source.
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
      itemData: internalLink,
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
