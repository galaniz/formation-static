/**
 * Utils - Get Slug
 */

/* Imports */

import type { SlugArgs, SlugReturn } from './getSlugTypes'
import type { ConfigParent } from '../../config/configTypes'
import { config } from '../../config/config'
import { getArchiveInfo } from '../getArchiveInfo/getArchiveInfo'
import { getTaxonomyInfo } from '../getTaxonomyInfo/getTaxonomyInfo'
import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'

/**
 * Function - recurse to get ascendents
 *
 * @private
 * @param {string} id
 * @param {import('../../config/configTypes').ConfigParent[]} parents
 * @return {void}
 */
const _getParentSlug = (id: string = '', parents: ConfigParent[] = []): void => {
  if (config.parents[id] !== undefined && id !== '') {
    parents.unshift(config.parents[id])

    _getParentSlug(config.parents[id].id, parents)
  }
}

/**
 * Function - get slug with archive/taxonomy base and parents
 *
 * @param {import('./getSlugTypes').SlugArgs} args
 * @return {string|import('./getSlugTypes').SlugReturn}
 */
const getSlug = (args: SlugArgs): string | SlugReturn => {
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

/* Exports */

export { getSlug }
