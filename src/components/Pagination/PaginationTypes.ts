/**
 * Components - Pagination Types
 */

/**
 * @typedef {object} PaginationProps
 * @prop {number} [total]
 * @prop {number} [display]
 * @prop {number} [current]
 * @prop {Record<string, string>} [filters]
 * @prop {string} [url]
 * @prop {string} [ellipsis]
 * @prop {string} [first]
 * @prop {string} [last]
 * @prop {string} [prev]
 * @prop {string} [next]
 * @prop {string} [firstLabel='First page']
 * @prop {string} [lastLabel='Last page']
 * @prop {string} [prevLabel='Previous page']
 * @prop {string} [nextLabel='Next page']
 * @prop {string} [currentLabel='Current page']
 * @prop {string} [pageLabel='Page']
 * @prop {string} [titleTemplate='Page %current of %total']
 * @prop {PaginationArgs} [args]
 */
export interface PaginationProps {
  total?: number
  display?: number
  current?: number
  filters?: Record<string, string>
  url?: string
  ellipsis?: string
  first?: string
  last?: string
  prev?: string
  next?: string
  firstLabel?: string
  lastLabel?: string
  prevLabel?: string
  nextLabel?: string
  currentLabel?: string
  pageLabel?: string
  titleTemplate?: string
  args?: PaginationArgs
}

/**
 * @typedef {object} PaginationArgs
 * @prop {string} [listClass]
 * @prop {string} [listAttr]
 * @prop {boolean} [itemsWrap=true] - Wrap items in <ol> tag.
 * @prop {string} [itemClass]
 * @prop {string} [itemAttr]
 * @prop {string} [linkClass]
 * @prop {string} [linkAttr]
 * @prop {string} [currentClass]
 * @prop {string} [a11yClass]
 * @prop {string} [firstClass]
 * @prop {string} [lastClass]
 * @prop {string} [prevSpanClass]
 * @prop {string} [prevLinkClass]
 * @prop {string} [nextSpanClass]
 * @prop {string} [nextLinkClass]
 */
export interface PaginationArgs {
  listClass?: string
  listAttr?: string
  itemsWrap?: boolean
  itemClass?: string
  itemAttr?: string
  linkClass?: string
  linkAttr?: string
  currentClass?: string
  a11yClass?: string
  firstClass?: string
  lastClass?: string
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
 * @prop {number} [first]
 * @prop {number} [last]
 * @prop {number} [next]
 * @prop {number} [prev]
 * @prop {Record<string, string>} [firstParams]
 * @prop {Record<string, string>} [lastParams]
 * @prop {Record<string, string>} [nextParams]
 * @prop {Record<string, string>} [prevParams]
 * @prop {Record<string, string>} [currentParams]
 */
export interface PaginationData {
  current?: number
  total?: number
  title?: string
  first?: number
  last?: number
  next?: number
  prev?: number
  firstParams?: Record<string, string>
  lastParams?: Record<string, string>
  nextParams?: Record<string, string>
  prevParams?: Record<string, string>
  currentParams?: Record<string, string>
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
