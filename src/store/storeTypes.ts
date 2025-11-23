/**
 * Store - Types
 */

/* Imports */

import type { Generic, Taxonomy } from '../global/globalTypes.js'
import type { NavigationList, NavigationItem } from '../components/Navigation/NavigationTypes.js'
import type { ArchiveMeta } from '../utils/archive/archiveTypes.js'
import type { ImageProps } from '../utils/image/imageTypes.js'
import type { FormMeta } from '../objects/Form/FormTypes.js'

/**
 * @typedef {Object<string, string[]>} StoreSlugs - Expect ID, contentType and optional locale in array.
 */
export type StoreSlugs = Record<string, [string, string, string?]>

/**
 * @typedef {Object<string, Object<string, string[]>>} StoreParents - Expect ID, slug and title in array.
 */
export type StoreParents = Record<string, Record<string, [string, string, string]>>

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
 * @typedef {Object<string, StorePrimitive>} StorePrimitiveGeneric
 */
interface StorePrimitiveGeneric {
  [key: string]: StorePrimitive
}

/**
 * @typedef {string|number|boolean|null|undefined|StorePrimitive[]|StorePrimitiveGeneric} StorePrimitive
 */
export type StorePrimitive = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined
  | StorePrimitive[]
  | StorePrimitiveGeneric

/**
 * @typedef {Object<string, StorePrimitive[]>} StoreServerless
 */
export type StoreServerless<T extends StorePrimitive[]> = Record<string, T>

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
 * @prop {StoreServerless} serverless
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
  serverless: StoreServerless<StorePrimitive[]>
}
