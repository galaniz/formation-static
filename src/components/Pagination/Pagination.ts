/**
 * Components - Pagination
 */

/* Imports */

import type { PaginationProps, PaginationData, PaginationReturn } from './PaginationTypes.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'

/**
 * Output pagination navigation
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

  /* Url param filters */

  const hasFilters = isStringStrict(filters)

  let prevFilters = ''
  let nextFilters = ''
  let currentFilters = ''

  if (hasFilters) {
    if (current > 2) {
      prevFilters = `&${filters}`
    } else {
      prevFilters = `?${filters}`
    }

    if (current === 1) {
      currentFilters = `?${filters}`
    } else {
      currentFilters = `&${filters}`
    }

    if (current < total) {
      nextFilters = `&${filters}`
    }
  }

  /* Meta data for head tags and urls */

  const data: PaginationData = {
    current,
    total,
    nextFilters,
    currentFilters
  }

  if (current === 1) {
    data.next = current + 1
  } else {
    data.title = titleTemplate.replace('%current', current.toString()).replace('%total', total.toString())
    data.next = current + 1 <= total ? current + 1 : 0
    data.prev = current - 1
    data.prevFilters = prevFilters
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
        href="${url}${current > 2 ? `?page=${current - 1}` : ''}${prevFilters}"
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
      const link = i === 1 ? url : `${url}?page=${i}`
      const linkFilters = hasFilters ? i === 1 ? `?${filters}` : `&${filters}` : ''

      content = `
        <a href="${link}${linkFilters}"${isStringStrict(linkClass) ? ` class="${linkClass}"` : ''}${isStringStrict(linkAttr) ? ` ${linkAttr}` : ''}>
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
        href="${url}?page=${current + 1}${nextFilters}"
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
      <ol${listAttrs.length > 0 ? ` ${listAttrs.join(' ')}` : ''}>
        ${output}
      </ol>
    `,
    data
  }
}

/* Exports */

export { Pagination }
