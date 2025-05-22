/**
 * Global - Types
 */

/**
 * @typedef {object} Taxonomy
 * @prop {string} id
 * @prop {string} title
 * @prop {string[]} contentTypes
 * @prop {string} [slug]
 * @prop {string} [link]
 * @prop {boolean} [isPage]
 * @prop {boolean} [usePrimaryContentTypeSlug=true]
 */
export interface Taxonomy {
  id: string
  title: string
  contentTypes: string[]
  slug?: string
  link?: string
  isPage?: boolean
  usePrimaryContentTypeSlug?: boolean
}

/**
 * @typedef {object} InternalLink
 * @extends {Generic}
 * @prop {string} [id]
 * @prop {string} [contentType]
 * @prop {string} [slug]
 * @prop {string} [link]
 * @prop {string} [title]
 * @prop {Taxonomy} [taxonomy]
 */
export interface InternalLink extends Generic {
  id?: string
  contentType?: string
  slug?: string
  link?: string
  title?: string
  taxonomy?: Taxonomy
}

/**
 * @typedef {object} Parent
 * @extends {InternalLink}
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} title
 */
export interface Parent extends InternalLink {
  id: string
  slug: string
  title: string
}

/**
 * @typedef {object} ParentArgs
 * @prop {string} renderType
 * @prop {object} args
 */
export interface ParentArgs<T = Generic> {
  renderType: string
  args: T
}

/**
 * @typedef {object} RefString
 * @prop {string} ref
 */
export interface RefString {
  ref: string
}

/**
 * @typedef {string} Source - cms | local
 */
export type Source = 'cms' | 'local' | (string & Record<never, never>)

/**
 * @typedef {Object<string, *>} Generic
 */
export type Generic = Record<string, unknown>

/**
 * @typedef {function} GenericFunction
 * @param {*} args
 * @return {*}
 */
export type GenericFunction<T extends (...args: any[]) => any = (...args: any[]) => any> = T // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * @typedef {Object<string, string>} GenericStrings
 */
export type GenericStrings = Record<string, string>

/**
 * @typedef {Object<string, number>} GenericNumbers
 */
export type GenericNumbers = Record<string, number>
