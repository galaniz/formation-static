/**
 * Global - Types
 */

/**
 * @typedef {object} Taxonomy
 * @prop {string} id
 * @prop {string} title
 * @prop {string} contentType
 * @prop {string} [slug]
 * @prop {boolean} [isPage]
 * @prop {boolean} [useContentTypeSlug]
 */
export interface Taxonomy {
  id: string
  title: string
  contentType: string
  slug?: string
  isPage?: boolean
  useContentTypeSlug?: boolean
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
 * @type {InternalLinkBase|Generic}
 */
export interface InternalLink extends InternalLinkBase {
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
 * @typedef {Object.<string, *>} Generic
 */
export interface Generic {
  [key: string]: unknown
}

/**
 * @typedef {Object.<string, function>} GenericFunctions
 */
export interface GenericFunctions {
  [key: string]: Function
}

/**
 * @typedef {Object.<string, string>} GenericStrings
 */
export interface GenericStrings {
  [key: string]: string
}

/**
 * @typedef {Object.<string, number>} GenericNumbers
 */
export interface GenericNumbers {
  [key: string]: number
}
