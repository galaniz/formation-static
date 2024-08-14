/**
 * Utils - Link
 */

/* Imports */

import type { LinkSlugArgs, LinkSlugReturn } from './linkTypes.js'
import type { ConfigParent } from '../../config/configTypes.js'
import type { InternalLink } from '../../global/globalTypes.js'
import { config } from '../../config/config.js'
import { isObjectStrict } from '../object/object.js'
import { isString, isStringStrict } from '../string/string.js'
import { getArchiveInfo, getTaxonomyInfo } from '../archive/archive.js'

/**
 * Recurse to get ascendents
 *
 * @private
 * @param {string} id
 * @param {ConfigParent[]} parents
 * @return {void}
 */
const _getParentSlug = (id: string = '', parents: ConfigParent[] = []): void => {
  if (config.parents[id] !== undefined && id !== '') {
    parents.unshift(config.parents[id])

    _getParentSlug(config.parents[id].id, parents)
  }
}

/**
 * Get slug with archive/taxonomy base and parents
 *
 * @param {LinkSlugArgs} args
 * @return {string|LinkSlugReturn}
 */
const getSlug = (args: LinkSlugArgs): string | LinkSlugReturn => {
  const {
    id = '',
    slug = '',
    page = 0,
    contentType = 'page',
    pageData = undefined,
    returnParents = false
  } = isObjectStrict(args) ? args : {}

  /* Index */

  if (slug === 'index') {
    return ''
  }

  /* Parts */

  let parts: string[] = []

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

  if (archiveSlug !== '' && archiveId !== '') {
    parts.push(archiveSlug)

    archiveParent = {
      contentType: 'page',
      title: archiveTitle,
      slug: archiveSlug,
      id: archiveId
    }
  }

  if (contentType === 'taxonomy' && !taxonomyUseTypeSlug) {
    parts = []
    archiveParent = undefined
  }

  if (contentType === 'term' && taxonomySlug !== '' && taxonomyId !== '') {
    if (taxonomyUseTypeSlug) {
      parts.push(taxonomySlug)
    } else {
      parts = [taxonomySlug]
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

  /* Page parents */

  const parents: ConfigParent[] = []

  _getParentSlug(contentType === 'page' ? id : archiveId, parents)

  if (parents.length > 0) {
    parts.push(`${parents.map(({ slug }) => slug).join('/')}`)
  }

  /* Slug */

  if (isStringStrict(slug)) {
    parts.push(slug)
  }

  const s = `${parts.length > 0 ? parts.join('/') : ''}${page !== 0 ? `/?page=${page}` : ''}`

  /* Parents and slug return */

  if (returnParents) {
    if (archiveParent !== undefined) {
      parents.unshift(archiveParent)
    }

    return {
      slug: s,
      parents
    }
  }

  /* Slug return */

  return s
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
    url = config.env.urls.prod
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

    if (isString(res)) {
      return getPermalink(res)
    }

    return ''
  }

  return isStringStrict(externalLink) ? externalLink : ''
}

/* Exports */

export {
  getSlug,
  getLink,
  getPermalink
}
