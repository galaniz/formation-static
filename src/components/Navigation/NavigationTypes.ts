/**
 * Components - Navigation Types
 */

/* Imports */

import type { InternalLink, Generic, HtmlString } from '../../global/globalTypes.js'

/**
 * @typedef {object} NavigationProps
 * @prop {NavigationList[]} navigations
 * @prop {NavigationItem[]} items
 * @prop {string} [currentLink]
 * @prop {string|string[]} [currentType]
 */
export interface NavigationProps {
  navigations: NavigationList[]
  items: NavigationItem[]
  currentLink?: string
  currentType?: string | string[]
}

/**
 * @typedef {object} NavigationList
 * @extends {Generic}
 * @prop {string} title
 * @prop {string|string[]} location
 * @prop {NavigationItem[]} items
 */
export interface NavigationList extends Generic {
  title: string
  location: string | string[]
  items: NavigationItem[]
}

/**
 * @typedef {object} NavigationByLocationItem
 * @prop {string} title
 * @prop {NavigationItem[]} items
 */
export interface NavigationByLocationItem {
  title: string
  items: NavigationItem[]
}

/**
 * @typedef {Map<string, NavigationInfo>} NavigationByLocation
 */
export type NavigationByLocation<L extends string = string> = Map<L, NavigationByLocationItem>

/**
 * @typedef {object} NavigationItem
 * @extends {Generic}
 * @prop {string} id
 * @prop {string} title
 * @prop {string} [link]
 * @prop {InternalLink} [internalLink]
 * @prop {string} [externalLink]
 * @prop {NavigationItem[]} [children]
 * @prop {boolean} [current]
 * @prop {boolean} [external]
 * @prop {boolean} [descendentCurrent]
 * @prop {boolean} [archiveCurrent]
 */
export interface NavigationItem extends Generic {
  id: string
  title: string
  link?: string
  internalLink?: InternalLink
  externalLink?: string
  children?: NavigationItem[]
  current?: boolean
  external?: boolean
  descendentCurrent?: boolean
  archiveCurrent?: boolean
}

/**
 * @typedef {Map<string, NavigationItem>} NavigationItemsById
 */
export type NavigationItemsById = Map<string, NavigationItem>

/**
 * @typedef {object} NavigationBreadcrumbItem
 * @extends {NavigationItem}
 * @prop {string} slug
 * @prop {string} contentType
 */
export interface NavigationBreadcrumbItem extends NavigationItem {
  slug: string
  contentType: string
}

/**
 * @typedef {object} NavigationOutputBaseArgs
 * @prop {string} [listClass]
 * @prop {string} [listAttr]
 * @prop {string} [itemClass]
 * @prop {string} [itemAttr]
 * @prop {string} [linkClass]
 * @prop {string} [internalLinkClass]
 * @prop {string} [linkAttr]
 * @prop {boolean} [depthAttr]
 * @prop {string} [dataAttr]
 */
export interface NavigationOutputBaseArgs {
  listClass?: string
  listAttr?: string
  itemClass?: string
  itemAttr?: string
  linkClass?: string
  internalLinkClass?: string
  linkAttr?: string
  depthAttr?: boolean
  dataAttr?: string
}

/**
 * @typedef {object} NavigationOutputListFilterArgs
 * @prop {NavigationOutputArgs} args
 * @prop {HtmlString} output
 * @prop {NavigationItem[]} items
 * @prop {number} depth
 */
export interface NavigationOutputListFilterArgs {
  args: NavigationOutputArgs
  output: HtmlString
  items: NavigationItem[]
  depth: number
}

/**
 * @typedef {object} NavigationOutputFilterArgs
 * @prop {NavigationOutputArgs} args
 * @prop {NavigationItem} item
 * @prop {HtmlString} output
 * @prop {number} index
 * @prop {NavigationItem[]} items
 * @prop {number} depth
 */
export interface NavigationOutputFilterArgs {
  args: NavigationOutputArgs
  item: NavigationItem
  output: HtmlString
  index: number
  items: NavigationItem[]
  depth: number
}

/**
 * @typedef {function} NavigationOutputListFilter
 * @param {NavigationOutputListFilterArgs} args
 * @return {void}
 */
export type NavigationOutputListFilter = (args: NavigationOutputListFilterArgs) => void

/**
 * @typedef {function} NavigationFilter
 * @param {NavigationOutputFilterArgs} args
 * @return {void}
 */
export type NavigationFilter = (args: NavigationOutputFilterArgs) => void

/**
 * @typedef {object} NavigationOutputArgs
 * @extends {NavigationOutputBaseArgs}
 * @prop {string} [listTag]
 * @prop {string} [itemTag]
 * @prop {NavigationOutputListFilter} [filterBeforeList]
 * @prop {NavigationOutputListFilter} [filterAfterList]
 * @prop {NavigationFilter} [filterBeforeItem]
 * @prop {NavigationFilter} [filterAfterItem]
 * @prop {NavigationFilter} [filterBeforeLink]
 * @prop {NavigationFilter} [filterAfterLink]
 * @prop {NavigationFilter} [filterBeforeLinkText]
 * @prop {NavigationFilter} [filterAfterLinkText]
 */
export interface NavigationOutputArgs extends NavigationOutputBaseArgs {
  listTag?: string
  itemTag?: string
  filterBeforeList?: NavigationOutputListFilter
  filterAfterList?: NavigationOutputListFilter
  filterBeforeItem?: NavigationFilter
  filterAfterItem?: NavigationFilter
  filterBeforeLink?: NavigationFilter
  filterAfterLink?: NavigationFilter
  filterBeforeLinkText?: NavigationFilter
  filterAfterLinkText?: NavigationFilter
}

/**
 * @typedef {object} NavigationBreadcrumbOutputFilterArgs
 * @prop {HtmlString} output
 * @prop {boolean} lastLevel
 */
export interface NavigationBreadcrumbOutputFilterArgs {
  output: HtmlString
  lastLevel: boolean
}

/**
 * @typedef {function} NavigationBreadcrumbOutputFilter
 * @param {NavigationBreadcrumbOutputFilterArgs} args
 * @return {void}
 */
export type NavigationBreadcrumbOutputFilter = (args: NavigationBreadcrumbOutputFilterArgs) => void

/**
 * @typedef {object} NavigationBreadcrumbOutputArgs
 * @extends {NavigationOutputBaseArgs}
 * @prop {string} [currentClass]
 * @prop {string} [currentLabel]
 * @prop {string} [a11yClass]
 * @prop {NavigationBreadcrumbOutputFilter} [filterBeforeLink]
 * @prop {NavigationBreadcrumbOutputFilter} [filterAfterLink]
 */
export interface NavigationBreadcrumbOutputArgs extends NavigationOutputBaseArgs {
  currentClass?: string
  currentLabel?: string
  a11yClass?: string
  filterBeforeLink?: NavigationBreadcrumbOutputFilter
  filterAfterLink?: NavigationBreadcrumbOutputFilter
}
