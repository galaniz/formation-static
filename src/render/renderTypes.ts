/**
 * Render - Types
 */

/* Imports */

import type {
  Generic,
  GenericStrings,
  InternalLink,
  Taxonomy,
  Parent,
  ParentArgs
} from '../global/globalTypes.js'
import type {
  NavigationList,
  NavigationItem,
  NavigationProps
} from '../components/Navigation/NavigationTypes.js'
import type { Navigation } from '../components/Navigation/Navigation.js'
import type { RichTextHeading } from '../text/RichText/RichTextTypes.js'
import type { PaginationData } from '../components/Pagination/PaginationTypes.js'

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
 * @typedef {object} RenderBase
 * @prop {RenderItem} itemData
 * @prop {string[]} itemContains
 * @prop {Array<RichTextHeading[]>} itemHeadings
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 */
export interface RenderBase {
  itemData: RenderItem
  itemHeadings: RichTextHeading[][]
  itemContains: string[]
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
}

/**
 * @typedef {object} RenderServerlessData
 * @prop {string} path
 * @prop {Generic} [query]
 */
export interface RenderServerlessData {
  path: string
  query?: Generic
}

/**
 * @typedef {object} RenderPreviewData
 * @prop {string} id
 * @prop {string} contentType
 * @prop {string} [locale]
 */
export interface RenderPreviewData {
  id: string
  contentType: string
  locale?: string
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
 */
export interface RenderTag {
  id: string
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
 * @prop {string|GenericStrings} [attr]
 */
export interface RenderRichText {
  tag?: string
  link?: string
  internalLink?: InternalLink
  content?: RenderItem[] | string
  attr?: string | GenericStrings
}

/**
 * @typedef {object} RenderTemplate
 * @prop {RenderItem[]} content
 * @prop {Object<string, RenderItem>} namedContent
 * @prop {RenderItem[]} templates
 */
export interface RenderTemplate {
  content: RenderItem[]
  namedContent: Record<string, RenderItem>
  templates: RenderItem[]
}

/**
 * @typedef {object} RenderNavigationsArgs
 * @extends {NavigationProps}
 * @prop {string} [title]
 * @prop {Parent[]} parents
 */
export interface RenderNavigationsArgs extends NavigationProps {
  title?: string
  parents: Parent[]
}

/**
 * @typedef {function} RenderNavigations
 * @param {RenderNavigationsArgs} args
 * @return {Navigation|undefined|Promise<Navigation|undefined>}
 */
export type RenderNavigations = (args: RenderNavigationsArgs) => Navigation | undefined | Promise<Navigation | undefined>

/**
 * @typedef {object} RenderHttpErrorArgs
 * @extends {Generic}
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
 * @prop {RenderItem} [itemData]
 * @prop {string[]} [itemContains]
 * @prop {Navigation} [navigations]
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 * @prop {RichTextHeading[]} [headings]
 * @prop {RenderItem[]} [children]
 */
export interface RenderFunctionArgs<T = any, R = RenderItem, P = ParentArgs> { // eslint-disable-line @typescript-eslint/no-explicit-any
  args: 0 extends (1 & T) ? any : T // eslint-disable-line @typescript-eslint/no-explicit-any
  parents?: P[]
  itemData?: R
  itemContains?: string[]
  navigations?: Navigation
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
  headings?: RichTextHeading[]
  children?: R[]
}

/**
 * @typedef {function} RenderFunction
 * @param {RenderFunctionArgs} props
 * @return {string|string[]|Promise<string|string[]>}
 */
export type RenderFunction<T = any, R = RenderItem, P = ParentArgs> = ( // eslint-disable-line @typescript-eslint/no-explicit-any
  props: RenderFunctionArgs<T, R, P>
) => string | string[] | Promise<string | string[]>

/**
 * @typedef {Object<string, RenderFunction>} RenderFunctions
 */
export type RenderFunctions<T = any, R = RenderItem, P = ParentArgs> = // eslint-disable-line @typescript-eslint/no-explicit-any
  Record<string, RenderFunction<T, R, P>>

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
 * @typedef {object} RenderContentArgs
 * @extends {RenderBase}
 * @prop {RenderItem[]} content
 * @prop {ParentArgs[]} parents
 * @prop {Navigation} [navigations]
 * @prop {number} [headingsIndex]
 * @prop {number} [depth]
 */
export interface RenderContentArgs extends RenderBase {
  content: RenderItem[]
  parents: ParentArgs[]
  navigations?: Navigation
  headingsIndex?: number
  depth?: number
}

/**
 * @typedef {object} RenderItem
 * @extends {Generic}
 * @extends {Taxonomy}
 * @prop {string} [id]
 * @prop {string} [contentType]
 * @prop {string} [renderType]
 * @prop {string} [slug]
 * @prop {string} [title]
 * @prop {RenderItem|RenderItem[]} [content]
 * @prop {RenderMeta} [meta]
 * @prop {string} [baseUrl]
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
  baseUrl?: string
  archive?: string
  parent?: RenderItem
  taxonomy?: Taxonomy
  metadata?: RenderMetaTags
  pagination?: PaginationData
}

/**
 * @typedef {object} RenderItemArgs
 * @prop {RenderItem} item
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 */
export interface RenderItemArgs {
  item: RenderItem
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
}

/**
 * @typedef {object} RenderItemReturn
 * @prop {boolean} [serverlessRender]
 * @prop {RenderItem} [itemData]
 * @prop {object} [data]
 * @prop {string} data.slug
 * @prop {string} data.output
 */
export interface RenderItemReturn {
  serverlessRender?: boolean
  itemData?: RenderItem
  data?: {
    slug: string
    output: string
  }
}

/**
 * @typedef {object} RenderInlineItem
 * @extends {RenderItem}
 */
export interface RenderInlineItem extends Omit<RenderItem, 'id' | 'slug' | 'contentType' | 'content'> {
  id: string
  slug: string
  contentType: string
  content: RenderItem[] | string
}

/**
 * @typedef {object} RenderItemStartActionArgs
 * @extends {RenderBase}
 * @prop {string} id
 * @prop {string} contentType
 */
export interface RenderItemStartActionArgs extends RenderBase {
  id: string
  contentType: string
}

/**
 * @typedef {object} RenderItemActionArgs
 * @extends {RenderBase}
 * @prop {string} id
 * @prop {string} contentType
 * @prop {string} slug
 * @prop {string} output
 */
export interface RenderItemActionArgs extends RenderBase {
  id: string
  contentType: string
  slug: string
  output: string
}

/**
 * @typedef {object} RenderLayoutArgs
 * @prop {string} id
 * @prop {RenderMeta} meta
 * @prop {Navigation} [navigations]
 * @prop {string} contentType
 * @prop {string} content
 * @prop {string} slug
 * @prop {RenderItem} itemData
 * @prop {string[]} [itemContains]
 * @prop {Array<RichTextHeading[]>} [itemHeadings]
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 */
export interface RenderLayoutArgs {
  id: string
  meta: RenderMeta
  navigations?: Navigation
  contentType: string
  content: string
  slug: string
  itemData: RenderItem
  itemHeadings?: RichTextHeading[][]
  itemContains?: string[]
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
}

/**
 * @typedef {function} RenderLayout
 * @param {RenderLayoutArgs} args
 * @return {string|Promise<string>}
 */
export type RenderLayout = (args: RenderLayoutArgs) => string | Promise<string>

/**
 * @typedef {object} RenderAllData
 * @extends {Generic}
 * @prop {NavigationList[]} [navigation]
 * @prop {NavigationItem[]} [navigationItem]
 * @prop {RenderRedirect[]} [redirect]
 * @prop {Object<string, RenderItem[]>} content
 * @prop {RenderItem[]} content.page
 */
export interface RenderAllData extends Generic {
  navigation?: NavigationList[]
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
 * @param {ParentArgs} args
 * @return {Promise<string[]>|string[]}
 */
export type RenderContentFilter = <T>(content: string[], args: ParentArgs<T>) => Promise<string[]> | string[]

/**
 * @typedef {function} RenderItemFilter
 * @param {string} output
 * @param {RenderItemActionArgs} args
 * @return {Promise<string>|string}
 */
export type RenderItemFilter = (output: string, args: RenderItemActionArgs) => Promise<string> | string

/**
 * @typedef {function} RenderItemDataFilter
 * @param {RenderItem} item
 * @param {object} args
 * @param {string} args.contentType
 * @return {Promise<RenderItem>|RenderItem}
 */
export type RenderItemDataFilter = (
  item: RenderItem,
  args: { contentType: string }
) => Promise<RenderItem> | RenderItem

/**
 * @typedef {function} RenderStartAction
 * @param {RenderArgs} args
 * @return {Promise<void>|void}
 */
export type RenderStartAction = (args: RenderArgs) => Promise<void> | void

/**
 * @typedef {object} RenderEndActionArgs
 * @extends {RenderArgs}
 * @prop {RenderReturn[]|RenderReturn} data
 */
export interface RenderEndActionArgs extends RenderArgs {
  data: RenderReturn[] | RenderReturn
}

/**
 * @typedef {function} RenderEndAction
 * @param {RenderEndActionArgs} args
 * @return {Promise<void>|void}
 */
export type RenderEndAction = (args: RenderEndActionArgs) => Promise<void> | void

/**
 * @typedef {function} RenderItemStartAction
 * @param {RenderItemStartActionArgs} args
 * @return {Promise<void>|void}
 */
export type RenderItemStartAction = (args: RenderItemStartActionArgs) => Promise<void> | void

/**
 * @typedef {function} RenderItemEndAction
 * @param {RenderItemActionArgs} args
 * @return {Promise<void>|void}
 */
export type RenderItemEndAction = (args: RenderItemActionArgs) => Promise<void> | void

/**
 * @typedef {object} RenderDataMeta
 * @prop {number} [total]
 * @prop {number} [pages]
 * @prop {number} [skip]
 * @prop {number} [limit]
 */
export interface RenderDataMeta {
  total?: number
  pages?: number
  skip?: number
  limit?: number
}
