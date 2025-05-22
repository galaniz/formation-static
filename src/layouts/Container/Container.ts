/**
 * Layouts - Container
 */

/* Imports */

import type { ContainerProps } from './ContainerTypes.js'
import { applyFilters } from '../../utils/filter/filter.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isStringStrict } from '../../utils/string/string.js'

/**
 * Output container wrapper.
 *
 * @param {ContainerProps} props
 * @return {string[]}
 */
const Container = (props: ContainerProps): string[] => {
  /* Props required */

  if (!isObjectStrict(props)) {
    return []
  }

  props = applyFilters('containerProps', props)

  /* Filtered props required */

  if (!isObjectStrict(props)) {
    return []
  }

  const { args } = props
  const {
    tag = 'div',
    layoutClasses,
    classes,
    style,
    attr,
    nest = false
  } = isObjectStrict(args) ? args : {}

  /* Tag required */

  if (!isStringStrict(tag)) {
    return []
  }

  /* Semantically specific */

  const isSemanticParent = ['ul', 'ol', 'dl', 'figure'].includes(tag)

  /* Classes */

  const hasLayoutClasses = isStringStrict(layoutClasses)
  const hasClasses = isStringStrict(classes)

  /* Attributes */

  const attrs: string[] = []
  const innerAttrs: string[] = []

  /* Nest check */

  const isNested = nest && hasLayoutClasses
  const isNestedSemanticParent = isSemanticParent && isNested

  /* Classes */

  const innerClassesArr = []

  if (isNested && hasLayoutClasses) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    innerClassesArr.push(layoutClasses)
  }

  const outerClassesArr = []

  if (isNested && hasClasses) {
    outerClassesArr.push(classes)
  }

  if (!isNested && hasClasses) {
    outerClassesArr.push(classes)
  }

  if (!isNested && hasLayoutClasses) {
    outerClassesArr.push(layoutClasses)
  }

  if (outerClassesArr.length) {
    attrs.push(`class="${outerClassesArr.join(' ')}"`)
  }

  if (innerClassesArr.length) {
    innerAttrs.push(`class="${innerClassesArr.join(' ')}"`)
  }

  /* Style and more attributes */

  const att = isNestedSemanticParent ? innerAttrs : attrs

  if (isStringStrict(attr)) {
    att.push(attr)
  }

  if (isStringStrict(style)) {
    att.push(`style="${style}"`)
  }

  /* Output */

  let outerTag = tag
  let innerTag = ''

  if (isNested) {
    outerTag = isSemanticParent ? 'div' : tag
    innerTag = isSemanticParent ? tag : 'div'
  }

  let start = `<${outerTag}${attrs.length ? ` ${attrs.join(' ')}` : ''}>`
  let end = `</${outerTag}>`

  if (innerTag) {
    start = `${start}<${innerTag}${innerAttrs.length ? ` ${innerAttrs.join(' ')}` : ''}>`
    end = `</${innerTag}>${end}`
  }

  return [start, end]
}

/* Exports */

export { Container }
