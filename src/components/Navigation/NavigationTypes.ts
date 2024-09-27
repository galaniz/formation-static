/**
 * Components - Navigation Types
 */

/* Imports */

import type { InternalLink, Generic, HtmlString } from '../../global/globalTypes.js'

/**
 * @typedef {object} NavigationProps
 * @prop {Navigation[]} navigations
 * @prop {NavigationItem[]} items
 * @prop {string} [currentLink]
 * @prop {string} [currentType]
 */
export interface NavigationProps {
  navigations: Navigation[]
  items: NavigationItem[]
  currentLink?: string
  currentType?: string
}

/**
 * @typedef Navigation
 * @type {Generic}
 * @prop {string} title
 * @prop {string} location
 * @prop {NavigationItem[]} items
 */
export interface Navigation extends Generic {
  title: string
  location: string
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
 * @typedef {Object.<string, NavigationInfo>} NavigationByLocation
 */
export type NavigationByLocation = Record<string, NavigationByLocationItem>

/**
 * @typedef NavigationItem
 * @type {Generic}
 * @prop {string} [id]
 * @prop {string} [title]
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
  id?: string
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
 * @typedef {Object.<string, NavigationItem>} NavigationItemsById
 */
export type NavigationItemsById = Record<string, NavigationItem>

/**
 * @typedef NavigationBreadcrumbItem
 * @type {NavigationItem}
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
 */
export interface NavigationOutputBaseArgs {
  listClass?: string
  listAttr?: string
  itemClass?: string
  itemAttr?: string
  linkClass?: string
  internalLinkClass?: string
  linkAttr?: string
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
 * @typedef NavigationOutputArgs
 * @type {NavigationOutputBaseArgs}
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
 * @prop {boolean} isLastLevel
 */
export interface NavigationBreadcrumbOutputFilterArgs {
  output: HtmlString
  isLastLevel: boolean
}

/**
 * @typedef {function} NavigationBreadcrumbOutputFilter
 * @param {NavigationBreadcrumbOutputFilterArgs} args
 * @return {void}
 */
export type NavigationBreadcrumbOutputFilter = (args: NavigationBreadcrumbOutputFilterArgs) => void

/**
 * @typedef NavigationBreadcrumbOutputArgs
 * @type {NavigationOutputBaseArgs}
 * @prop {string} [currentClass]
 * @prop {string} [a11yClass]
 * @prop {NavigationBreadcrumbOutputFilter} [filterBeforeLink]
 * @prop {NavigationBreadcrumbOutputFilter} [filterAfterLink]
 */
export interface NavigationBreadcrumbOutputArgs extends NavigationOutputBaseArgs {
  currentClass?: string
  a11yClass?: string
  filterBeforeLink?: NavigationBreadcrumbOutputFilter
  filterAfterLink?: NavigationBreadcrumbOutputFilter
}
