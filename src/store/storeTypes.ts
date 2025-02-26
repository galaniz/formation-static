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
 * @typedef {object} StoreArchiveMeta
 * @prop {string} [id]
 * @prop {string} [slug]
 * @prop {string} [title]
 * @prop {string} [contentType]
 * @prop {string} [singular]
 * @prop {string} [plural]
 * @prop {string} [layout]
 * @prop {string} [order]
 * @prop {number} [display]
 */
export interface StoreArchiveMeta {
  id?: string
  slug?: string
  title?: string
  contentType?: string
  singular?: string
  plural?: string
  layout?: string
  order?: string
  display?: number
}

/**
 * @typedef Store
 * @type {Generic}
 * @prop {Object<string, RenderSlug>} slugs
 * @prop {Object<string, Object<string, StoreParent>>} parents
 * @prop {Object<string, StoreArchiveMeta>} archiveMeta
 * @prop {Object<string, FormMeta>} formMeta
 * @prop {Object<string, ImageProps>} imageMeta
 * @prop {NavigationList[]} navigations
 * @prop {NavigationItem[]} navigationItems
 * @prop {Object<string, Taxonomy>} taxonomies
 */
export interface Store extends Generic {
  slugs: Record<string, StoreSlug>
  parents: Record<string, Record<string, StoreParent>>
  archiveMeta: Record<string, StoreArchiveMeta>
  formMeta: Record<string, FormMeta>
  imageMeta: Record<string, ImageProps>
  navigations: NavigationList[]
  navigationItems: NavigationItem[]
  taxonomies: Record<string, Taxonomy>
}
