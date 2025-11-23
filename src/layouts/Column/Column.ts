/**
 * Layouts - Column
 */

/* Imports */

import type { ColumnProps } from './ColumnTypes.js'
import { applyFilters } from '../../filters/filters.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'

/**
 * Output column wrapper.
 *
 * @param {ColumnProps} props
 * @return {string[]}
 */
const Column = (props: ColumnProps): string[] => {
  /* Props required */

  if (!isObjectStrict(props)) {
    return []
  }

  props = applyFilters('columnProps', props)

  const { args } = props
  const {
    tag = 'div', // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    classes,
    style,
    attr
  } = isObjectStrict(args) ? args : {}

  /* Tag required */

  if (!isStringStrict(tag)) {
    return []
  }

  /* Style */

  let styles = ''

  if (isStringStrict(style)) {
    styles = ` style="${style}"`
  }

  /* Attributes */

  let attrs = ''

  if (isStringStrict(classes)) {
    attrs += ` class="${classes}"`
  }

  if (isStringStrict(attr)) {
    attrs += ` ${attr}`
  }

  /* Output */

  return [
    `<${tag}${attrs}${styles}>`,
    `</${tag}>`
  ]
}

/* Exports */

export { Column }
