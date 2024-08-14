/**
 * Layouts - Container
 */

/* Imports */

import type { ContainerProps, ContainerReturn } from './ContainerTypes.js'
import { applyFilters } from '../../utils/filters/filters.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'

/**
 * Output container wrapper
 *
 * @param {ContainerProps} props
 * @return {Promise<ContainerReturn>}
 */
const Container = async (props: ContainerProps): Promise<ContainerReturn> => {
  /* Fallback output */

  const fallback = {
    start: '',
    end: ''
  }

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = await applyFilters('containerProps', props, { renderType: 'container' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  let { args } = props

  args = isObjectStrict(args) ? args : {}

  const {
    tag = 'div',
    layout = 'column',
    maxWidth = '',
    paddingTop = '',
    paddingTopLarge = '',
    paddingBottom = '',
    paddingBottomLarge = '',
    gap = '',
    gapLarge = '',
    justify = '',
    align = '',
    classes = '',
    style = '',
    attr = '',
    nest = false
  } = args

  /* Semantically specific */

  const isSemanticParent = ['ul', 'ol', 'dl', 'figure'].includes(tag)

  /* Classes */

  const classesArr: string[] = []
  const layoutClassesArr: string[] = []

  /* Attributes */

  const attrs: string[] = []
  const innerAttrs: string[] = []

  /* Max width */

  if (isStringStrict(maxWidth)) {
    classesArr.push(maxWidth)
  }

  /* Layout */

  if (isStringStrict(layout)) {
    layoutClassesArr.push(layout)
  }

  /* Gap */

  if (isStringStrict(gap)) {
    layoutClassesArr.push(gap)
  }

  if (isStringStrict(gapLarge) && gapLarge !== gap) {
    layoutClassesArr.push(gapLarge)
  }

  /* Justify */

  if (isStringStrict(justify)) {
    layoutClassesArr.push(justify)
  }

  /* Align */

  if (isStringStrict(align)) {
    layoutClassesArr.push(align)
  }

  /* Padding */

  if (isStringStrict(paddingTop)) {
    classesArr.push(paddingTop)
  }

  if (isStringStrict(paddingTopLarge) && paddingTopLarge !== paddingTop) {
    classesArr.push(paddingTopLarge)
  }

  if (isStringStrict(paddingBottom)) {
    classesArr.push(paddingBottom)
  }

  if (isStringStrict(paddingBottomLarge) && paddingBottomLarge !== paddingBottom) {
    classesArr.push(paddingBottomLarge)
  }

  /* Nest check */

  const isNested = nest && layoutClassesArr.length > 0
  const isNestedSemanticParent = isSemanticParent && isNested

  /* Classes */

  const hasClasses = isStringStrict(classes)
  const innerClassesArr = isNested ? layoutClassesArr : []
  const outerClassesArr = isNested ? classesArr : classesArr.concat(layoutClassesArr)

  if (hasClasses) {
    const arr = isNestedSemanticParent ? innerClassesArr : outerClassesArr

    arr.push(classes)
  }

  if (outerClassesArr.length > 0) {
    attrs.push(`class="${outerClassesArr.join(' ')}"`)
  }

  if (innerClassesArr.length > 0) {
    innerAttrs.push(`class="${innerClassesArr.join(' ')}"`)
  }

  /* Style and more attributes */

  const att = isNestedSemanticParent ? innerAttrs : attrs

  if (isStringStrict(style)) {
    att.push(`style="${style}"`)
  }

  if (isStringStrict(attr)) {
    att.push(attr)
  }

  /* Output */

  let outerTag = tag
  let innerTag = ''

  if (isNested) {
    outerTag = isSemanticParent ? 'div' : tag
    innerTag = isSemanticParent ? tag : 'div'
  }

  let start = `<${outerTag}${(attrs.length > 0) ? ` ${attrs.join(' ')}` : ''}>`
  let end = `</${outerTag}>`

  if (innerTag !== '') {
    start = `${start}<${innerTag}${(innerAttrs.length > 0) ? ` ${innerAttrs.join(' ')}` : ''}>`
    end = `</${innerTag}>${end}`
  }

  return {
    start,
    end
  }
}

/* Exports */

export { Container }
