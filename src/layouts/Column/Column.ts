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
    width = '',
    widthSmall = '',
    widthMedium = '',
    widthLarge = '',
    widthCustom = null,
    justify = '',
    align = '',
    classes = '',
    style = '',
    attr = ''
  } = isObjectStrict(args) ? args : {}

  /* Classes */

  const classesArr: string[] = []

  if (isStringStrict(classes)) {
    classesArr.push(classes)
  }

  /* Width */

  if (isStringStrict(width)) {
    classesArr.push(width)
  }

  if (isStringStrict(widthSmall) && widthSmall !== width) {
    classesArr.push(widthSmall)
  }

  if (isStringStrict(widthMedium) && widthMedium !== widthSmall) {
    classesArr.push(widthMedium)
  }

  if (isStringStrict(widthLarge) && widthLarge !== widthMedium) {
    classesArr.push(widthLarge)
  }

  /* Justify */

  if (isStringStrict(justify)) {
    classesArr.push(justify)
  }

  /* Align */

  if (isStringStrict(align)) {
    classesArr.push(align)
  }

  /* Style */

  const stylesArr: string[] = []

  if (isStringStrict(style)) {
    stylesArr.push(style)
  }

  if (isObjectStrict(widthCustom)) {
    if (isStringStrict(widthCustom.class)) {
      classesArr.push(widthCustom.class)
    }

    const styleArr = [
      `--width:${isStringStrict(widthCustom.default) ? widthCustom.default : '100%'}`,
      `--width-small:${isStringStrict(widthCustom.small) ? widthCustom.small : '100%'}`,
      `--width-medium:${isStringStrict(widthCustom.medium) ? widthCustom.medium : '100%'}`,
      `--width-large:${isStringStrict(widthCustom.large) ? widthCustom.large : '100%'}`
    ]

    stylesArr.push(styleArr.join(';'))
  }

  const styles = (stylesArr.length > 0) ? ` style="${stylesArr.join(';')}"` : ''

  /* Attributes */

  let attrs = ''

  if (isStringStrict(attr)) {
    attrs = ` ${attr}`
  }

  if (classesArr.length > 0) {
    attrs += ` class="${classesArr.join(' ')}"`
  }

  /* Output */

  return {
    start: `<${tag}${attrs}${styles}>`,
    end: `</${tag}>`
  }
}

/* Exports */

export { Column }
