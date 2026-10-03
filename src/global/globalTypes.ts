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
 * @prop {boolean} [isPage=false]
 * @prop {boolean} [useContentTypeSlug=true]
 */
export interface Taxonomy {
  id: string
  title: string
  contentTypes: string[]
  slug?: string
  link?: string
  isPage?: boolean
  useContentTypeSlug?: boolean
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
 * @prop {string} renderType
 * @prop {object} args
 */
export interface Parent<A = Generic> {
  renderType: string
  args: A
}

/**
 * @typedef {object} RefString
 * @prop {string} ref
 */
export interface RefString {
  ref: string
}

/**
 * @typedef {'cms'|'local'} Source
 */
export type Source = 'cms' | 'local' | (string & Record<never, never>)

/**
 * @typedef {Object<string, *>} Generic
 */
export type Generic = Record<string, unknown>

/**
 * Written as a method so functions with more specific parameter types are accepted.
 *
 * @typedef {function} GenericFunction
 * @param {*} args
 * @return {*}
 */
export type GenericFunction<T extends (...args: any[]) => any = (...args: any[]) => any> = // eslint-disable-line @typescript-eslint/no-explicit-any
  { fn (...args: Parameters<T>): ReturnType<T> }['fn']

/**
 * @typedef {Object<string, string>} GenericStrings
 */
export type GenericStrings = Record<string, string>

/**
 * @typedef {Object<string, number>} GenericNumbers
 */
export type GenericNumbers = Record<string, number>
