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

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const {
    total = 1,
    display = 5,
    current = 1,
    filters = '',
    basePermaLink = '',
    ellipsis = '',
    prev = '',
    next = '',
    args = {}
  } = props

  const {
    listClass = '',
    listAttr = '',
    itemClass = '',
    itemAttr = '',
    itemMaxWidth = false,
    linkClass = '',
    linkAttr = '',
    currentClass = '',
    a11yClass = 'a-hide-vis',
    prevSpanClass = '',
    prevLinkClass = '',
    nextSpanClass = '',
    nextLinkClass = ''
  } = isObjectStrict(args) ? args : {}

  /* Total must be greater than 1 and base link required */

  if (total <= 1 || !isStringStrict(basePermaLink)) {
    return fallback
  }

  /* Store items output */

  let output = ''

  /* Url param filters */

  let prevFilters = filters
  let nextFilters = filters
  let currentFilters = filters

  if (isStringStrict(filters)) {
    if (current > 2) {
      prevFilters = `&${prevFilters}`
    } else {
      prevFilters = `?${prevFilters}`
    }

    nextFilters = `&${nextFilters}`

    if (current === 1) {
      currentFilters = `?${currentFilters}`
    } else {
      currentFilters = `&${currentFilters}`
    }
  }

  /* Meta data for head tags and urls */

  const data: PaginationData = {
    current,
    nextFilters,
    currentFilters
  }

  if (current === 1) {
    data.next = current + 1
  } else {
    data.title = `Page ${current} of ${total}`
    data.next = current + 1 <= total ? current + 1 : 0
    data.prev = current - 1
    data.prevFilters = prevFilters
  }

  /* Determine number of items to display */

  const max = display - 1
  const halff = Math.ceil(display / 2)
  const half = max / 2
  const center = total > max
  const limit = center ? max : total - 1

  let start = 1

  if (center) {
    start = current < max ? 1 : current - half
  }

  if (start > total - limit) {
    start = total - limit
  }

  let totalPagesItems = start + limit

  if (totalPagesItems > total) {
    totalPagesItems = total
  }

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

  /* Max width */

  let maxWidth = ''

  if (itemMaxWidth) {
    let totalListItems = totalPagesItems + 2 // 2 for prev and next buttons

    if (center && hasEllipsis && current >= limit && current > halff) {
      totalListItems += 1
    }

    if (center && hasEllipsis && current < total - half) {
      totalListItems += 1
    }

    maxWidth = ` style="max-width:${100 / totalListItems}%"`
  }

  /* Item attributes */

  const itemAttrs = `${isStringStrict(itemClass) ? ` class="${itemClass}"` : ''}${isStringStrict(itemAttr) ? ` ${itemAttr}` : ''}${maxWidth}`

  /* Previous item */

  let prevItem = `<span${isStringStrict(prevSpanClass) ? ` class="${prevSpanClass}"` : ''}>${prev}</span>`
  let isPrevLink = false

  if (current > 1) {
    isPrevLink = true
    prevItem = `
      <a${isStringStrict(prevLinkClass) ? ` class="${prevLinkClass}"` : ''}
        href="${basePermaLink}${current > 2 ? `?page=${current - 1}` : ''}${prevFilters}"
        aria-label="Previous page"
      >
        ${prev}
      </a>
    `
  }

  output += `<li${itemAttrs} data-prev="${isPrevLink ? 'link' : 'text'}">${prevItem}</li>`

  /* Ellipsis */

  let ellipsisOutput = ''

  if (hasEllipsis) {
    ellipsisOutput = `<li${itemAttrs} aria-hidden="true" data-ellipsis>${ellipsis}</li>`
  }

  if (center && current >= limit && current > halff) {
    output += ellipsisOutput
  }

  /* Items loop */

  for (let i = start; i <= totalPagesItems; i += 1) {
    const isCurrent = i === current

    let content = ''

    if (isCurrent) {
      content = `
        <span${isStringStrict(currentClass) ? ` class="${currentClass}"` : ''}>
          <span class="${a11yClass}">Current page </span>
          ${i}
        </span>
      `
    } else {
      const link = i === 1 ? basePermaLink : `${basePermaLink}?page=${i}`

      content = `
        <a${isStringStrict(linkClass) ? ` class="${linkClass}"` : ''}${isStringStrict(linkAttr) ? ` ${linkAttr}` : ''}href="${link}${currentFilters}">
          <span class="${a11yClass}">Page </span>
          ${i}
        </a>
      `
    }

    output += `<li${itemAttrs}${isCurrent ? ' data-current="true"' : ''}>${content}</li>`
  }

  /* Ellipsis */

  if (center && current < total - half) {
    output += ellipsisOutput
  }

  /* Next item */

  let nextItem = `<span${isStringStrict(nextSpanClass) ? ` class="${nextSpanClass}"` : ''}>${next}</span>`
  let nextLink = false

  if (current < total) {
    nextLink = true
    nextItem = `
      <a${isStringStrict(nextLinkClass) ? ` class="${nextLinkClass}"` : ''}
        href="${basePermaLink}?page=${current + 1}${nextFilters}"
        aria-label="Next page"
      >
        ${next}
      </a>
    `
  }

  output += `<li${itemAttrs} data-next="${nextLink ? 'link' : 'text'}">${nextItem}</li>`

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
