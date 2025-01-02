/**
 * Render - Types
 */

/* Imports */

import type {
  Generic,
  GenericStrings,
  InternalLink,
  Taxonomy,
  ParentArgs
} from '../global/globalTypes.js'
import type {
  Navigation,
  NavigationItem,
  NavigationProps
} from '../components/Navigation/NavigationTypes.js'
import type { RichTextHeading } from '../text/RichText/RichTextTypes.js'
import type { StoreParent } from '../store/storeTypes.js'
import { PaginationData } from '../components/Pagination/PaginationTypes.js'

/**
 * @typedef {object} RenderMeta
 * @prop {string} [title]
 * @prop {string} [paginationTitle]
 * @prop {string} [description]
 * @prop {string} [url]
 * @prop {string} [image]
 * @prop {string} [canonical]
 * @prop {string} [canonicalParams]
 * @prop {string} [prev]
 * @prop {string} [next]
 * @prop {boolean} [noIndex]
 * @prop {boolean} [isIndex]
 */
export interface RenderMeta {
  title?: string
  paginationTitle?: string
  description?: string
  url?: string
  image?: string
  canonical?: string
  canonicalParams?: string
  prev?: string
  next?: string
  noIndex?: boolean
  isIndex?: boolean
}

/**
 * @typedef {object} RenderCommon
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {Array.<RichTextHeading[]>} pageHeadings
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderCommon {
  pageData: RenderItem
  pageHeadings: RichTextHeading[][]
  pageContains: string[]
  serverlessData?: RenderServerlessData
}

/**
 * @typedef {object} RenderServerlessData
 * @prop {string} path
 * @prop {Generic} query
 */
export interface RenderServerlessData {
  path: string
  query: Generic
}

/**
 * @typedef {object} RenderPreviewData
 * @prop {string} id
 * @prop {string} contentType
 */
export interface RenderPreviewData {
  id: string
  contentType: string
}

/**
 * @typedef {object} RenderRedirect
 * @prop {string[]} redirect
 */
export interface RenderRedirect {
  redirect: string[]
}

/**
 * @typedef {object} RenderTag
 * @prop {string} id
 * @prop {string} name
 */
export interface RenderTag {
  id: string
  name: string
}

/**
 * @typedef {object} RenderMetaTags
 * @prop {RenderTag[]} [tags]
 */
export interface RenderMetaTags {
  tags?: RenderTag[]
}

/**
 * @typedef {object} RenderFile
 * @prop {string} [path]
 * @prop {string} [url]
 * @prop {string} [name]
 * @prop {string} [alt]
 * @prop {number} [width]
 * @prop {number} [height]
 * @prop {number} [size]
 * @prop {string} [format]
 * @prop {string} [type]
 * @prop {Object<number, string>} [sizes]
 */
export interface RenderFile {
  path?: string
  url?: string
  name?: string
  alt?: string
  width?: number
  height?: number
  size?: number
  format?: string
  type?: string
  sizes?: Record<number, string>
}

/**
 * @typedef {object} RenderRichText
 * @prop {string} [tag]
 * @prop {string} [link]
 * @prop {InternalLink} [internalLink]
 * @prop {RenderItem[]|string} [content]
 * @prop {string} [attr]
 */
export interface RenderRichText {
  tag?: string
  link?: string
  internalLink?: InternalLink
  content?: RenderItem[] | string
  attr?: string
}

/**
 * @typedef {object} RenderTemplate
 * @prop {RenderItem[]} content
 * @prop {RenderItem[]} templates
 */
export interface RenderTemplate {
  content: RenderItem[]
  templates: RenderItem[]
}

/**
 * @typedef RenderNavigationsArgs
 * @type {NavigationProps}
 * @prop {string} [title]
 * @prop {StoreParent[]} parents
 */
export interface RenderNavigationsArgs extends NavigationProps {
  title?: string
  parents: StoreParent[]
}

/**
 * @typedef {function} RenderNavigations
 * @param {RenderNavigationsArgs} args
 * @return {GenericStrings|Promise<GenericStrings>}
 */
export type RenderNavigations = (args: RenderNavigationsArgs) => GenericStrings | Promise<GenericStrings>

/**
 * @typedef {object} RenderHttpErrorArgs
 * @type {Generic}
 * @prop {number} code
 */
export interface RenderHttpErrorArgs extends Generic {
  code: number
}

/**
 * @typedef {function} RenderHttpError
 * @param {RenderHttpErrorArgs} args
 * @return {string|Promise<string>}
 */
export type RenderHttpError = (args: RenderHttpErrorArgs) => string | Promise<string>

/**
 * @typedef {object} RenderFunctionArgs
 * @prop {object} args
 * @prop {ParentArgs[]} [parents]
 * @prop {RenderItem} [pageData]
 * @prop {string[]} [pageContains]
 * @prop {GenericStrings} [navigations]
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RichTextHeading[]} [headings]
 * @prop {RenderItem[]} [children]
 */
export interface RenderFunctionArgs<T = any, R = RenderItem> {
  args: 0 extends (1 & T) ? any : T
  parents?: ParentArgs[]
  pageData?: R
  pageContains?: string[]
  navigations?: GenericStrings
  serverlessData?: RenderServerlessData
  headings?: RichTextHeading[]
  children?: R[]
}

/**
 * @typedef {function} RenderFunction
 * @param {RenderFunctionArgs} props
 * @return {string|string[]|Promise<string|string[]>}
 */
export type RenderFunction<T = any, R = RenderItem> = (
  props: RenderFunctionArgs<T, R>
) => string | string[] | Promise<string | string[]>

/**
 * @typedef {Object<string, RenderFunction>} RenderFunctions
 */
export type RenderFunctions<T = any, R = RenderItem> = Record<string, RenderFunction<T, R>>

/**
 * @typedef {object} RenderFunctionsArgs
 * @prop {RenderFunctions} functions
 * @prop {RenderLayout} layout
 * @prop {RenderNavigations} [navigations]
 * @prop {RenderHttpError} [httpError]
 */
export interface RenderFunctionsArgs {
  functions: RenderFunctions
  layout: RenderLayout
  navigations?: RenderNavigations
  httpError?: RenderHttpError
}

/**
 * @typedef RenderContentArgs
 * @type {RenderCommon}
 * @prop {RenderItem[]} content
 * @prop {ParentArgs[]} parents
 * @prop {GenericStrings} navigations
 * @prop {number} [headingsIndex]
 * @prop {number} [depth]
 */
export interface RenderContentArgs extends RenderCommon {
  content: RenderItem[]
  parents: ParentArgs[]
  navigations: GenericStrings
  headingsIndex?: number
  depth?: number
}

/**
 * @typedef RenderItem
 * @type {Generic|Taxonomy}
 * @prop {string} [id]
 * @prop {string} [contentType]
 * @prop {string} [renderType]
 * @prop {string} [slug]
 * @prop {string} [title]
 * @prop {RenderItem|RenderItem[]} [content]
 * @prop {RenderMeta} [meta]
 * @prop {string} [basePermalink]
 * @prop {string} [archive]
 * @prop {RenderItem} [parent]
 * @prop {Taxonomy} [taxonomy]
 * @prop {RenderMetaTags} [metadata]
 * @prop {PaginationData} [pagination]
 */
export interface RenderItem extends Generic, Partial<Taxonomy> {
  id?: string
  contentType?: string
  renderType?: string
  tag?: string
  link?: string
  internalLink?: InternalLink
  slug?: string
  title?: string
  content?: RenderItem[] | string
  meta?: RenderMeta
  basePermalink?: string
  archive?: string
  parent?: RenderItem
  taxonomy?: Taxonomy
  metadata?: RenderMetaTags
  pagination?: PaginationData
}

/**
 * @typedef {object} RenderItemArgs
 * @prop {RenderItem} item
 * @prop {string} contentType
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderItemArgs {
  item: RenderItem
  contentType: string
  serverlessData?: RenderServerlessData
}

/**
 * @typedef {object} RenderItemReturn
 * @prop {boolean} [serverlessRender]
 * @prop {RenderItem} [pageData]
 * @prop {object} [data]
 * @prop {string} data.slug
 * @prop {string} data.output
 */
export interface RenderItemReturn {
  serverlessRender?: boolean
  pageData?: RenderItem
  data?: {
    slug: string
    output: string
  }
}

/**
 * @typedef RenderInlineItemArgs
 * @type {RenderItem}
 */
export interface RenderInlineItemArgs extends Omit<RenderItem, 'id' | 'slug' | 'contentType' | 'content'> {
  id: string
  slug: string
  contentType: string
  content: RenderItem[] | string
}

/**
 * @typedef RenderItemStartActionArgs
 * @type {RenderCommon}
 * @prop {string} id
 * @prop {string} contentType
 */
export interface RenderItemStartActionArgs extends RenderCommon {
  id: string
  contentType: string
}

/**
 * @typedef RenderItemActionArgs
 * @type {RenderCommon}
 * @prop {string} id
 * @prop {string} contentType
 * @prop {string} slug
 * @prop {string} output
 */
export interface RenderItemActionArgs extends RenderCommon {
  id: string
  contentType: string
  slug: string
  output: string
}

/**
 * @typedef {object} RenderLayoutArgs
 * @prop {string} id
 * @prop {RenderMeta} meta
 * @prop {GenericStrings} [navigations]
 * @prop {string} contentType
 * @prop {string} content
 * @prop {string} slug
 * @prop {RenderItem} pageData
 * @prop {string[]} [pageContains]
 * @prop {Array.<RichTextHeading[]>} [pageHeadings]
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderLayoutArgs {
  id: string
  meta: RenderMeta
  navigations?: GenericStrings
  contentType: string
  content: string
  slug: string
  pageData: RenderItem
  pageHeadings?: RichTextHeading[][]
  pageContains?: string[]
  serverlessData?: RenderServerlessData
}

/**
 * @typedef {function} RenderLayout
 * @param {RenderLayoutArgs} args
 * @return {string|Promise<string>}
 */
export type RenderLayout = (args: RenderLayoutArgs) => string | Promise<string>

/**
 * @typedef RenderAllData
 * @type {Generic}
 * @prop {Navigation[]} [navigation]
 * @prop {NavigationItem[]} [navigationItem]
 * @prop {RenderRedirect[]} [redirect]
 * @prop {Object<string, RenderItem[]>} content
 * @prop {RenderItem[]} content.page
 */
export interface RenderAllData extends Generic {
  navigation?: Navigation[]
  navigationItem?: NavigationItem[]
  redirect?: RenderRedirect[]
  content: {
    page: RenderItem[]
    [key: string]: RenderItem[]
  }
}

/**
 * @typedef {object} RenderArgs
 * @prop {RenderAllData} [allData]
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 */
export interface RenderArgs {
  allData?: RenderAllData
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
}

/**
 * @typedef {object} RenderReturn
 * @prop {string} slug
 * @prop {string} output
 */
export interface RenderReturn {
  slug: string
  output: string
}

/**
 * @typedef {function} RenderContentFilter
 * @param {string[]} content
 * @param {ParentArgs}
 * @return {Promise<string[]>}
 */
export type RenderContentFilter = (content: string[], args: ParentArgs) => Promise<string[]>

/**
 * @typedef {function} RenderItemFilter
 * @param {string} output
 * @param {RenderItemActionArgs} args
 * @return {Promise<string>}
 */
export type RenderItemFilter = (output: string, args: RenderItemActionArgs) => Promise<string>

/**
 * @typedef {function} RenderStartAction
 * @param {RenderArgs} args
 * @return {Promise<void>}
 */
export type RenderStartAction = (args: RenderArgs) => Promise<void>

/**
 * @typedef RenderEndActionArgs
 * @type {RenderArgs}
 * @prop {RenderReturn[]|RenderReturn} data
 */
export interface RenderEndActionArgs extends RenderArgs {
  data: RenderReturn[] | RenderReturn
}

/**
 * @typedef {function} RenderEndAction
 * @param {RenderEndActionArgs} args
 * @return {Promise<void>}
 */
export type RenderEndAction = (args: RenderEndActionArgs) => Promise<void>

/**
 * @typedef {function} RenderItemStartAction
 * @param {RenderItemStartActionArgs} args
 * @return {Promise<void>}
 */
export type RenderItemStartAction = (args: RenderItemStartActionArgs) => Promise<void>

/**
 * @typedef {function} RenderItemEndAction
 * @param {RenderItemActionArgs} args
 * @return {Promise<void>}
 */
export type RenderItemEndAction = (args: RenderItemActionArgs) => Promise<void>
