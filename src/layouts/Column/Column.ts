/**
 * Layouts - Column
 */

/* Imports */

import type { ColumnProps, ColumnReturn } from './ColumnTypes.js'
import { applyFilters } from '../../utils/filters/filters.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'

/**
 * Output column wrapper
 *
 * @param {ColumnProps} props
 * @return {Promise<ColumnReturn>}
 */
const Column = async (props: ColumnProps): Promise<ColumnReturn> => {
  /* Fallback output */

  const fallback = {
    start: '',
    end: ''
  }

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = await applyFilters('columnProps', props, { renderType: 'column' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const { args } = props

  const {
    tag = 'div',
    classes = '',
    style = '',
    attr = ''
  } = isObjectStrict(args) ? args : {}

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

  return {
    start: `<${tag}${attrs}${styles}>`,
    end: `</${tag}>`
  }
}

/* Exports */

export { Column }
