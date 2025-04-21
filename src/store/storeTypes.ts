/**
 * Store - Types
 */

/* Imports */

import type { Generic, Parent, Taxonomy } from '../global/globalTypes.js'
import type { NavigationList, NavigationItem } from '../components/Navigation/NavigationTypes.js'
import type { ArchiveMeta } from '../utils/archive/archiveTypes.js'
import type { ImageProps } from '../utils/image/imageTypes.js'
import type { FormMeta } from '../objects/Form/FormTypes.js'

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
 * @typedef {Object<string, Object<string, Parent>>} StoreParents
 */
export type StoreParents = Record<string, Record<string, Parent>>

/**
 * @typedef {Object<string, ArchiveMeta|Object<string, ArchiveMeta>>} StoreArchiveMeta
 */
export type StoreArchiveMeta = Record<string, ArchiveMeta | Record<string, ArchiveMeta>>

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
