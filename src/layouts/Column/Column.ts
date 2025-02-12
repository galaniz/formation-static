/**
 * Layouts - Column
 */

/* Imports */

import type { ColumnProps } from './ColumnTypes.js'
import { applyFilters } from '../../utils/filter/filter.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'

/**
 * Output column wrapper
 *
 * @param {ColumnProps} props
 * @return {string[]}
 */
const Column = (props: ColumnProps): string[] => {
  /* Fallback output */

  const fallback: string[] = []

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = applyFilters('columnProps', props, { renderType: 'column' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const { args } = props
  const newArgs = isObjectStrict(args) ? args : {}

  const {
    tag = 'div',
    classes,
    style,
    attr
  } = newArgs

  /* Tag required */

  if (!isStringStrict(tag)) {
    return fallback
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
