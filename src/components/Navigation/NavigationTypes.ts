/**
 * Components - Navigation Types
 */

/* Imports */

import type { InternalLink, Generic, RefString } from '../../global/globalTypes.js'

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
 * @typedef {object} NavigationOutputBaseArgs
 * @prop {string} [listClass]
 * @prop {string} [listAttr]
 * @prop {string} [itemClass]
 * @prop {string} [itemAttr]
 * @prop {string} [linkClass]
 * @prop {string} [internalLinkClass]
 * @prop {string} [linkAttr]
 * @prop {boolean} [depthAttr=false]
 * @prop {string} [dataAttr='data-nav']
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
 * @prop {RefString} output
 * @prop {NavigationItem[]} items
 * @prop {number} depth
 */
export interface NavigationOutputListFilterArgs {
  args: NavigationOutputArgs
  output: RefString
  items: NavigationItem[]
  depth: number
}

/**
 * @typedef {object} NavigationOutputFilterArgs
 * @prop {NavigationOutputArgs} args
 * @prop {NavigationItem} item
 * @prop {RefString} output
 * @prop {number} index
 * @prop {NavigationItem[]} items
 * @prop {number} depth
 */
export interface NavigationOutputFilterArgs {
  args: NavigationOutputArgs
  item: NavigationItem
  output: RefString
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
 * @prop {string} [currentLink] - Current link to compare against.
 * @prop {string[]} [currentType] - Current content type(s) to compare against.
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
  currentLink?: string
  currentType?: string | string[]
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
