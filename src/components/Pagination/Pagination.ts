/**
 * Components - Pagination
 */

/* Imports */

import type { PaginationProps, PaginationData, PaginationReturn } from './PaginationTypes.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'

/**
 * Output pagination navigation.
 *
 * @param {PaginationProps} props
 * @return {PaginationReturn}
 */
const Pagination = (props: PaginationProps): PaginationReturn => {
  /* Fallback output */

  const fallback = {
    output: '',
    data: {}
  }

  /* Props required */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const {
    total = 1,
    display = 5,
    current = 1,
    filters,
    url,
    ellipsis,
    prev = '',
    next = '',
    prevLabel = 'Previous page',
    nextLabel = 'Next page',
    currentLabel = 'Current page',
    pageLabel = 'Page',
    titleTemplate = 'Page %current of %total',
    args
  } = props

  const {
    listClass,
    listAttr,
    itemClass,
    itemAttr,
    linkClass,
    linkAttr,
    currentClass,
    a11yClass = 'a-hide-vis',
    prevSpanClass,
    prevLinkClass,
    nextSpanClass,
    nextLinkClass
  } = isObjectStrict(args) ? args : {}

  /* Total must be greater than 1 and base link required */

  if (total <= 1 || !isStringStrict(url)) {
    return fallback
  }

  /* Items output */

  let output = ''

  /* URL params */

  const hasFilters = isObjectStrict(filters)
  
  let prevParams: Record<string, string> = {}
  let nextParams: Record<string, string> = {}
  let currentParams: Record<string, string> = {}

  const prevPage = current - 1
  const nextPage = current + 1 <= total ? current + 1 : 0

  if (current > 1) {
    currentParams.page = current.toString()
  }

  if (prevPage > 1) {
    prevParams.page = prevPage.toString()
  }

  if (nextPage) {
    nextParams.page = nextPage.toString()
  }

  if (hasFilters) {
    currentParams = {
      ...currentParams,
      ...filters
    }

    prevParams = {
      ...prevParams,
      ...filters
    }

    if (current < total) {
      nextParams = {
        ...nextParams,
        ...filters
      }
    }
  }

  let prevParamsStr = new URLSearchParams(prevParams).toString()
  let nextParamsStr = new URLSearchParams(nextParams).toString()
  let currentParamsStr = new URLSearchParams(currentParams).toString()

  if (prevParamsStr) {
    prevParamsStr = `?${prevParamsStr}`
  }

  if (nextParamsStr) {
    nextParamsStr = `?${nextParamsStr}`
  }

  if (currentParamsStr) {
    currentParamsStr = `?${currentParamsStr}`
  }

  /* Meta data for head tags and urls */

  const data: PaginationData = {
    current,
    total
  }

  if (nextPage) {
    data.next = nextPage
  }

  if (prevPage) {
    data.prev = prevPage
  }

  if (currentParamsStr) {
    data.currentParams = currentParams
  }

  if (nextParamsStr) {
    data.nextParams = nextParams
  }

  if (prevParamsStr) {
    data.prevParams = prevParams
  }

  if (current > 1) {
    data.title = titleTemplate.replace('%current', current.toString()).replace('%total', total.toString())
  }

  /* Determine number of items to display */

  const max = display - 1
  const half = Math.ceil(display / 2)
  const maxHalf = max / 2
  const center = total > max
  const limit = center ? max : total - 1

  let start = 1

  if (center) {
    start = current < max ? 1 : current - maxHalf
  }

  if (start > total - limit) {
    start = total - limit
  }

  const totalPagesItems = start + limit

  /* List attributes */

  const listAttrs: string[] = []

  if (isStringStrict(listClass)) {
    listAttrs.push(`class="${listClass}"`)
  }

  if (isStringStrict(listAttr)) {
    listAttrs.push(listAttr)
  }

  /* Check if ellipsis exists */

  const hasEllipsis = isStringStrict(ellipsis)

  /* Item attributes */

  const itemAttrs = `${isStringStrict(itemClass) ? ` class="${itemClass}"` : ''}${isStringStrict(itemAttr) ? ` ${itemAttr}` : ''}`

  /* Previous item */

  let prevItem = `<span${isStringStrict(prevSpanClass) ? ` class="${prevSpanClass}"` : ''}>${prev}</span>`
  let isPrevLink = false

  if (current > 1) {
    isPrevLink = true
    prevItem = `
      <a
        href="${url}${prevParamsStr}"
        aria-label="${prevLabel}"${isStringStrict(prevLinkClass) ? ` class="${prevLinkClass}"` : ''}
      >
        ${prev}
      </a>
    `
  }

  output += `<li${itemAttrs} data-pag-prev="${isPrevLink ? 'link' : 'text'}">${prevItem}</li>`

  /* Ellipsis */

  let ellipsisOutput = ''

  if (hasEllipsis) {
    ellipsisOutput = `<li${itemAttrs} aria-hidden="true" data-pag-ellipsis>${ellipsis}</li>`
  }

  if (center && current >= limit && current > half) {
    output += ellipsisOutput
  }

  /* Items loop */

  for (let i = start; i <= totalPagesItems; i += 1) {
    const isCurrent = i === current

    let content = ''

    if (isCurrent) {
      content = `
        <span${isStringStrict(currentClass) ? ` class="${currentClass}"` : ''}>
          <span class="${a11yClass}">${currentLabel} </span>
          ${i}
        </span>
      `
    } else {
      let params: Record<string, string> = {}

      if (i > 1) {
        params.page = i.toString()
      }

      if (hasFilters) {
        params = {
          ...params,
          ...filters
        }
      }

      let paramsStr = new URLSearchParams(params).toString()

      if (paramsStr) {
        paramsStr = `?${paramsStr}`
      }

      content = `
        <a href="${url}${paramsStr}"${isStringStrict(linkClass) ? ` class="${linkClass}"` : ''}${isStringStrict(linkAttr) ? ` ${linkAttr}` : ''}>
          <span class="${a11yClass}">${pageLabel} </span>
          ${i}
        </a>
      `
    }

    output += `<li${itemAttrs}${isCurrent ? ' data-pag-current' : ''}>${content}</li>`
  }

  /* Ellipsis */

  if (center && current < total - maxHalf) {
    output += ellipsisOutput
  }

  /* Next item */

  let nextItem = `<span${isStringStrict(nextSpanClass) ? ` class="${nextSpanClass}"` : ''}>${next}</span>`
  let nextLink = false

  if (current < total) {
    nextLink = true
    nextItem = `
      <a
        href="${url}${nextParamsStr}"
        aria-label="${nextLabel}"${isStringStrict(nextLinkClass) ? ` class="${nextLinkClass}"` : ''}
      >
        ${next}
      </a>
    `
  }

  output += `<li${itemAttrs} data-pag-next="${nextLink ? 'link' : 'text'}">${nextItem}</li>`

  /* Output */

  return {
    output: `
      <ol${listAttrs.length ? ` ${listAttrs.join(' ')}` : ''}>
        ${output}
      </ol>
    `,
    data
  }
}

/* Exports */

export { Pagination }
