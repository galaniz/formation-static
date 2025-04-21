/**
 * Utils - Archive Types
 */

/* Imports */

import type { Taxonomy } from '../../global/globalTypes.js'

/**
 * @typedef {object} ArchiveMeta
 * @prop {string} [id]
 * @prop {string} [slug]
 * @prop {string} [title]
 * @prop {string} [singular]
 * @prop {string} [plural]
 * @prop {string} [contentType]
 * @prop {string} [layout]
 * @prop {string} [order]
 * @prop {number} [display]
 */
export interface ArchiveMeta {
  id?: string
  slug?: string
  title?: string
  singular?: string
  plural?: string
  contentType?: string
  layout?: string
  order?: string
  display?: number
}

/**
 * @typedef {object} ArchiveInfo
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} title
 * @prop {string} contentType
 */
export interface ArchiveInfo {
  id: string
  slug: string
  title: string
  contentType: string
}

/**
 * @typedef {object} ArchiveTaxonomy
 * @extends {Taxonomy}
 * @prop {string} primaryContentType
 */
export interface ArchiveTaxonomy extends Omit<Required<Taxonomy>, 'link'>, Pick<Taxonomy, 'link'> {
  primaryContentType: string
}

/**
 * @typedef {object} ArchiveLink
 * @prop {string} title
 * @prop {string} link
 */
export interface ArchiveLink {
  title: string
  link: string
}

/**
 * @typedef {object} ArchiveLabels
 * @prop {string} singular
 * @prop {string} plural
 */
export interface ArchiveLabels {
  singular: string
  plural: string
}
