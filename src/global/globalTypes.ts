/**
 * Global - Types
 */

/**
 * @typedef {object} Taxonomy
 * @prop {string} id
 * @prop {string} title
 * @prop {string[]} contentTypes
 * @prop {string} [slug]
 * @prop {boolean} [isPage]
 * @prop {boolean} [usePrimaryContentTypeSlug=true]
 */
export interface Taxonomy {
  id: string
  title: string
  contentTypes: string[]
  slug?: string
  isPage?: boolean
  usePrimaryContentTypeSlug?: boolean
}

/**
 * @typedef {object} InternalLinkBase
 * @prop {string} [id]
 * @prop {string} [contentType]
 * @prop {string} [slug]
 * @prop {string} [title]
 * @prop {Taxonomy} [taxonomy]
 */
export interface InternalLinkBase {
  id?: string
  contentType?: string
  slug?: string
  title?: string
  taxonomy?: Taxonomy
}

/**
 * @typedef InternalLink
 * @type {InternalLinkBase|Taxonomy|Generic}
 */
export interface InternalLink extends InternalLinkBase, Partial<Taxonomy> {
  [key: string]: unknown
}

/**
 * @typedef {object} ParentArgs
 * @prop {string} renderType
 * @prop {Generic} args
 */
export interface ParentArgs {
  renderType: string
  args: Generic
}

/**
 * @typedef {object} HtmlString
 * @prop {string} html
 */
export interface HtmlString {
  html: string
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
 * @typedef {Object<string, function>} GenericFunctions
 */
export type GenericFunctions = Record<string, Function>

/**
 * @typedef {Object<string, string>} GenericStrings
 */
export type GenericStrings = Record<string, string>

/**
 * @typedef {Object<string, number>} GenericNumbers
 */
export type GenericNumbers = Record<string, number>
