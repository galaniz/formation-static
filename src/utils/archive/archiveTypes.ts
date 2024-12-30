/**
 * Utils - Archive Types
 */

/* Imports */

import type { Taxonomy } from '../../global/globalTypes.js'

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
 * @typedef ArchiveTaxonomy
 * @type {Taxonomy}
 * @prop {string} primaryContentType
 */
export interface ArchiveTaxonomy extends Required<Taxonomy> {
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
