/**
 * Layouts - Container
 */

/* Imports */

import type { ContainerProps, ContainerReturn } from './ContainerTypes.js'
import { applyFilters } from '../../utils/filter/filter.js'
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
    layoutClasses = '',
    classes = '',
    style = '',
    attr = '',
    nest = false
  } = args

  /* Tag required */

  if (!isStringStrict(tag)) {
    return fallback
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

  if (isNested && hasLayoutClasses) {
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

  if (outerClassesArr.length > 0) {
    attrs.push(`class="${outerClassesArr.join(' ')}"`)
  }

  if (innerClassesArr.length > 0) {
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
