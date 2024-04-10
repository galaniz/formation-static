/**
 * Render - Types
 */

/* Imports */

import type {
  Generic,
  GenericFunctions,
  GenericStrings,
  HtmlString,
  InternalLink,
  ParentArgs
} from '../global/globalTypes'
import type { Navigation, NavigationItem } from '../components/Navigation/NavigationTypes'
import type { RichTextHeading } from '../text/RichText/RichTextTypes'

/**
 * @typedef {object} RenderSlug
 * @prop {string} contentType
 * @prop {string} id
 */
export interface RenderSlug {
  contentType: string
  id: string
}

/**
 * @typedef {Object.<string, RenderSlug>} RenderSlugs
 */
export interface RenderSlugs {
  [key: string]: RenderSlug
}

/**
 * @typedef RenderMetaArgs
 * @type {import('../global/globalTypes').Generic}
 * @prop {RenderMetaReturn} [meta]
 * @prop {string} [metaTitle]
 * @prop {string} [metaDescription]
 * @prop {import('../global/globalTypes').Generic} [metaImage]
 */
export interface RenderMetaArgs extends Generic {
  meta?: RenderMetaReturn
  metaTitle?: string
  metaDescription?: string
  metaImage?: Generic
}

/**
 * @typedef {object} RenderMetaReturn
 * @prop {string} [title]
 * @prop {string} [paginationTitle]
 * @prop {string} [description]
 * @prop {string} [url]
 * @prop {string} [image]
 * @prop {string} [canonical]
 * @prop {string} [prev]
 * @prop {string} [next]
 * @prop {boolean} [noIndex]
 * @prop {boolean} [isIndex]
 */
export interface RenderMetaReturn {
  title?: string
  paginationTitle?: string
  description?: string
  url?: string
  image?: string
  canonical?: string
  prev?: string
  next?: string
  noIndex?: boolean
  isIndex?: boolean
}

/**
 * @typedef {object} RenderCommon
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {Array.<import('../text/RichText/RichTextTypes').RichTextHeading[]>} pageHeadings
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
 * @prop {import('../global/globalTypes').Generic} query
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
 * @typedef {object} RenderRedirectItem
 * @prop {string[]} redirect
 */
export interface RenderRedirectItem {
  redirect: string[]
}

/**
 * @typedef {Object.<string, RenderRedirectItem>} RenderRedirect
 */
export interface RenderRedirect {
  [key: string]: RenderRedirectItem
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
}

/**
 * @typedef {object} RenderRichText
 * @prop {string} [tag]
 * @prop {string} [link]
 * @prop {import('../global/globalTypes').InternalLink} [internalLink]
 * @prop {RenderItem[]|string} [content]
 */
export interface RenderRichText {
  tag?: string
  link?: string
  internalLink?: InternalLink
  content?: RenderItem[] | string
}

/**
 * @typedef RenderContentTemplate
 * @prop {RenderItem[]} content
 * @prop {RenderItem[]} templates
 */
export interface RenderContentTemplate {
  content: RenderItem[]
  templates: RenderItem[]
}

/**
 * @typedef {object} RenderFunctionArgs
 * @prop {RenderItem} args
 * @prop {import('../global/globalTypes').ParentArgs[]} parents
 * @prop {RenderItem} pageData
 * @prop {string[]} pageContains
 * @prop {import('../global/globalTypes').GenericStrings} navigations
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {import('../text/RichText/RichTextTypes').RichTextHeading[]} [headings]
 */
export interface RenderFunctionArgs {
  args: RenderItem
  parents: ParentArgs[]
  pageData: RenderItem
  pageContains: string[]
  navigations: GenericStrings
  serverlessData?: RenderServerlessData
  headings?: RichTextHeading[]
}

/**
 * @typedef RenderContentArgs
 * @type {RenderCommon}
 * @prop {RenderItem[]} content
 * @prop {import('../global/globalTypes').ParentArgs[]} parents
 * @prop {import('../global/globalTypes').GenericStrings} navigations
 * @prop {import('../global/globalTypes').GenericFunctions} renderFunctions
 * @prop {number} [headingsIndex]
 * @prop {number} [depth]
 * @prop {import('../global/globalTypes').HtmlString} output
 */
export interface RenderContentArgs extends RenderCommon {
  content: RenderItem[]
  parents: ParentArgs[]
  navigations: GenericStrings
  renderFunctions: GenericFunctions
  headingsIndex?: number
  depth?: number
  output: HtmlString
}

/**
 * @typedef RenderItem
 * @type {import('../global/globalTypes').Generic}
 * @prop {string} id
 * @prop {string} slug
 * @prop {string} [title]
 * @prop {RenderItem|RenderItem[]} [content]
 * @prop {RenderMetaReturn} [meta]
 * @prop {string} [basePermalink]
 * @prop {string} [linkContentType]
 */
export interface RenderItem extends Generic {
  id?: string
  contentType?: string
  renderType?: string
  tag?: string
  link?: string
  internalLink?: InternalLink
  slug?: string
  title?: string
  content?: RenderItem[] | string
  repeat?: RenderItem
  templates?: RenderItem[]
  meta?: RenderMetaReturn
  basePermalink?: string
  archive?: string
  linkContentType?: string
  parent?: RenderItem
  metadata?: {
    tags?: RenderTag[]
  }
}

/**
 * @typedef {object} RenderItemArgs
 * @prop {RenderItem} item
 * @prop {string} contentType
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderFunctions} renderFunctions
 */
export interface RenderItemArgs {
  item: RenderItem
  contentType: string
  serverlessData?: RenderServerlessData
  renderFunctions: GenericFunctions
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
 * @prop {RenderMetaReturn} meta
 * @prop {import('../global/globalTypes').GenericStrings} [navigations]
 * @prop {string} contentType
 * @prop {string} content
 * @prop {string} slug
 * @prop {RenderItem} pageData
 * @prop {string[]} [pageContains]
 * @prop {Array.<import('../text/RichText/RichTextTypes').RichTextHeading[]>} [pageHeadings]
 * @prop {RenderServerlessData} [serverlessData]
 */
export interface RenderLayoutArgs {
  id: string
  meta: RenderMetaReturn
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
 * @typedef RenderAllData
 * @type {import('../global/globalTypes').Generic}
 * @prop {import('../components/Navigation/NavigationTypes').Navigation[]} [navigation]
 * @prop {import('../components/Navigation/NavigationTypes').NavigationItem[]} [navigationItem]
 * @prop {RenderRedirect[]} [redirect]
 * @prop {Object.<string, RenderItem[]>} content
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
 * @param {string} content
 * @param {import('../global/globalTypes').ParentArgs}
 * @return {Promise<string>}
 */
export type RenderContentFilter = (content: string, args: ParentArgs) => Promise<string>

/**
 * @typedef {function} RenderItemFilter
 * @param {string} output
 * @param {RenderItemActionArgs} args
 * @return {Promise<string>}
 */
export type RenderItemFilter = (output: string, args: RenderItemActionArgs) => Promise<string>

/**
 * @typedef {function} RenderNameFilter
 * @param {string} name
 * @return {Promise<string>}
 */
export type RenderNameFilter = (name: string) => Promise<string>

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
