/**
 * Components - Pagination Types
 */

/**
 * @typedef {object} PaginationProps
 * @prop {number} [total]
 * @prop {number} [display]
 * @prop {number} [current]
 * @prop {string} [filters]
 * @prop {string} [basePermaLink]
 * @prop {string} [ellipsis]
 * @prop {string} [prev]
 * @prop {string} [next]
 * @prop {PaginationArgs} [args]
 */
export interface PaginationProps {
  total?: number
  display?: number
  current?: number
  filters?: string
  basePermaLink?: string
  ellipsis?: string
  prev?: string
  next?: string
  args?: PaginationArgs
}

/**
 * @typedef {object} PaginationArgs
 * @prop {string} [listClass]
 * @prop {string} [listAttr]
 * @prop {string} [itemClass]
 * @prop {string} [itemAttr]
 * @prop {boolean} [itemMaxWidth] - Set list item max width
 * @prop {string} [linkClass]
 * @prop {string} [linkAttr]
 * @prop {string} [currentClass]
 * @prop {string} [a11yClass]
 * @prop {string} [prevSpanClass]
 * @prop {string} [prevLinkClass]
 * @prop {string} [nextSpanClass]
 * @prop {string} [nextLinkClass]
 */
export interface PaginationArgs {
  listClass?: string
  listAttr?: string
  itemClass?: string
  itemAttr?: string
  itemMaxWidth?: boolean
  linkClass?: string
  linkAttr?: string
  currentClass?: string
  a11yClass?: string
  prevSpanClass?: string
  prevLinkClass?: string
  nextSpanClass?: string
  nextLinkClass?: string
}

/**
 * @typedef {object} PaginationData
 * @prop {number} [current]
 * @prop {number} [total]
 * @prop {string} [title]
 * @prop {number} [next]
 * @prop {number} [prev]
 * @prop {string} [nextFilters]
 * @prop {string} [prevFilters]
 * @prop {string} [currentFilters]
 */
export interface PaginationData {
  current?: number
  total?: number
  title?: string
  next?: number
  prev?: number
  nextFilters?: string
  prevFilters?: string
  currentFilters?: string
}

/**
 * @typedef {object} PaginationReturn
 * @prop {string} output
 * @prop {PaginationData} data
 */
export interface PaginationReturn {
  output: string
  data: PaginationData
}
