/**
 * Store - Types
 */

/* Imports */

import type { NavigationList, NavigationItem } from '../components/Navigation/NavigationTypes.js'
import type { ImageProps } from '../utils/image/imageTypes.js'
import type { FormMeta } from '../objects/Form/FormTypes.js'
import type { Generic, Taxonomy } from '../global/globalTypes.js'

/**
 * @typedef {object} StoreSlug
 * @prop {string} contentType
 * @prop {string} id
 */
export interface StoreSlug {
  contentType: string
  id: string
}

/**
 * @typedef {Object<string, StoreSlug>} StoreSlugs
 */
export type StoreSlugs = Record<string, StoreSlug>

/**
 * @typedef {object} StoreParent
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} title
 */
export interface StoreParent {
  id: string
  slug: string
  title: string
}

/**
 * @typedef {Object<string, Object<string, StoreParent>>} StoreParents
 */
export type StoreParents = Record<string, Record<string, StoreParent>>

/**
 * @typedef {object} StoreArchiveMetaItem
 * @prop {string} [id]
 * @prop {string} [slug]
 * @prop {string} [title]
 * @prop {string} [contentType]
 * @prop {string|Object<string, string>} [singular]
 * @prop {string|Object<string, string>} [plural]
 * @prop {string} [layout]
 * @prop {string} [order]
 * @prop {number} [display]
 */
export interface StoreArchiveMetaItem {
  id?: string
  slug?: string
  title?: string
  contentType?: string
  singular?: string | Record<string, string>
  plural?: string | Record<string, string>
  layout?: string
  order?: string
  display?: number
}

/**
 * @typedef {Object<string, StoreArchiveMetaItem>} StoreArchiveMeta
 */
export type StoreArchiveMeta = Record<string, StoreArchiveMetaItem>

/**
 * @typedef {Object<string, FormMeta>} StoreFormMeta
 */
export type StoreFormMeta = Record<string, FormMeta>

/**
 * @typedef {Object<string, ImageProps>} StoreImageMeta
 */
export type StoreImageMeta = Record<string, ImageProps>

/**
 * @typedef {Object<string, Taxonomy>} StoreTaxonomies
 */
export type StoreTaxonomies = Record<string, Taxonomy>

/**
 * @typedef {object} Store
 * @extends {Generic}
 * @prop {StoreSlugs} slugs
 * @prop {StoreParents} parents
 * @prop {StoreArchiveMeta} archiveMeta
 * @prop {StoreFormMeta} formMeta
 * @prop {StoreImageMeta} imageMeta
 * @prop {NavigationList[]} navigations
 * @prop {NavigationItem[]} navigationItems
 * @prop {StoreTaxonomies} taxonomies
 */
export interface Store extends Generic {
  slugs: StoreSlugs
  parents: StoreParents
  archiveMeta: StoreArchiveMeta
  formMeta: StoreFormMeta
  imageMeta: StoreImageMeta
  navigations: NavigationList[]
  navigationItems: NavigationItem[]
  taxonomies: StoreTaxonomies
}
