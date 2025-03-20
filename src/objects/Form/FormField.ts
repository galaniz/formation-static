/**
 * Objects - Form Field
 */

/* Imports */

import type { FormFieldProps } from './FormTypes.js'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filter/filter.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'

/**
 * Output form field
 *
 * @param {FormFieldProps} props
 * @return {string[]} HTMLDivElement
 */
const FormField = (props: FormFieldProps): string[] => {
  /* Props required */

  if (!isObjectStrict(props)) {
    return []
  }

  props = applyFilters('formFieldProps', props)

  /* Filtered props required */

  if (!isObjectStrict(props)) {
    return []
  }

  const { args } = props
  const {
    type = 'text',
    name,
    label,
    hint,
    value,
    required = false,
    attributes,
    emptyErrorMessage,
    invalidErrorMessage,
    fieldsetClasses,
    labelClasses,
    classes,
    radioIcon,
    checkboxIcon
  } = isObjectStrict(args) ? args : {}

  /* Label required */

  if (!isStringStrict(label)) {
    return []
  }

  /* Name required if not fieldset */

  let isFieldset = type === 'fieldset'

  if (!isFieldset && !isStringStrict(name)) {
    return []
  }

  /* Option types */

  const isOption = type === 'checkbox' || type === 'radio'
  const isOptionGroup = type === 'checkbox-group' || type === 'radio-group'

  if (isOptionGroup) {
    isFieldset = true
  }

  /* Id */

  const id: string = uuid()

  /* Field classes */

  const fieldClassesArr: string[] = []

  if (isStringStrict(args.fieldClasses)) {
    fieldClassesArr.push(args.fieldClasses)
  }

  /* Classes */

  const classesArr: string[] = []

  if (isStringStrict(classes)) {
    classesArr.push(classes)
  }

  /* Icons */

  let optionIcon = ''
  let selectIcon = ''

  if (type === 'radio' && isStringStrict(radioIcon)) {
    optionIcon = radioIcon
  }

  if (type === 'checkbox' && isStringStrict(checkboxIcon)) {
    optionIcon = checkboxIcon
  }

  if (type === 'select' && isStringStrict(args.selectIcon)) {
    selectIcon = args.selectIcon
  }

  const requiredIcon = required && isStringStrict(args.requiredIcon) ? args.requiredIcon : ''

  /* Attributes */

  const fieldAttrs: string[] = ['data-form-field']
  const fieldsetAttrs: string[] = []
  const attrs: string[] = ['data-form-input']

  if (isStringStrict(attributes)) {
    const attrsArr = attributes.split('\n')

    for (const attr of attrsArr) {
      const [attrName, attrValue] = attr.split(' : ')

      if (!isStringStrict(attrName) || !isStringStrict(attrValue)) {
        continue
      }

      attrs.push(`${attrName}="${attrValue}"`)
    }
  }

  if (isStringStrict(value)) {
    attrs.push(`value="${value}"`)
  }

  if (classesArr.length > 0) {
    attrs.push(`class="${classesArr.join(' ')}"`)
  }

  if (fieldClassesArr.length > 0) {
    fieldAttrs.push(`class="${fieldClassesArr.join(' ')}"`)
  }

  if (isStringStrict(fieldsetClasses)) {
    fieldsetAttrs.push(`class="${fieldsetClasses}"`)
  }

  if (isStringStrict(emptyErrorMessage)) {
    (isFieldset ? fieldsetAttrs : attrs).push(`data-form-empty="${emptyErrorMessage}"`)
  }

  if (isStringStrict(invalidErrorMessage)) {
    (isFieldset ? fieldsetAttrs : attrs).push(`data-form-invalid="${invalidErrorMessage}"`)
  }

  if (required) {
    (isFieldset ? fieldsetAttrs : attrs).push(isFieldset ? 'data-form-required' : 'required')
  }

  const fieldAttr = fieldAttrs.length > 0 ? ` ${fieldAttrs.join(' ')}` : ''
  const fieldsetAttr = fieldsetAttrs.length > 0 ? ` ${fieldsetAttrs.join(' ')}` : ''
  const attr = attrs.length > 0 ? ` ${attrs.join(' ')}` : ''

  /* Hint */

  let hintOutput = ''

  if (isStringStrict(hint)) {
    hintOutput = `<small data-form-hint>${hint}</small>`
  }

  /* Label */

  let labelBefore = ''
  let labelAfter = ''

  const labelClass = isStringStrict(labelClasses) ? ` class="${labelClasses}"` : ''

  if (isFieldset) {
    labelBefore = `
      <legend id="${uuid()}"${labelClass}>
        <span data-form-legend>
          <span data-form-legend-text>${label}</span>
          ${requiredIcon}
        </span>
        ${hintOutput}
      </legend>
    `
  } else if (isOption) {
    labelAfter = `
      <label for="${id}"${labelClass}>
        <span data-form-option>
          ${optionIcon}
          <span data-form-label>
            <span data-form-label-text>${label}</span>
            ${requiredIcon}
          </span>
        </span>
        ${hintOutput}
      </label>
    `
  } else {
    labelBefore = `
      <label for="${id}"${labelClass}>
        <span data-form-label>
          <span data-form-label-text>${label}</span>
          ${requiredIcon}
        </span>
        ${hintOutput}
      </label>
    `
  }

  /* Input */

  let beforeOutput = ''
  let afterOutput = ''

  switch (type) {
    case 'text':
    case 'email':
    case 'checkbox':
    case 'radio':
    case 'number':
    case 'password':
    case 'tel':
    case 'url': {
      beforeOutput = `<input type="${type}" name="${name}" id="${id}"${attr}>`
      break
    }
    case 'textarea': {
      beforeOutput = `<textarea name="${name}" id="${id}"${attr}></textarea>`
      break
    }
    case 'select': {
      beforeOutput = `
        <div data-form-select>
          <select name="${name}" id="${id}"${attr}>`

      afterOutput = `
          </select>
          ${selectIcon}
        </div>`

      break
    }
  }

  /* Output */

  return [`
    <div${fieldAttr}>
      ${isFieldset ? `<fieldset${fieldsetAttr}>` : ''}
      ${labelBefore}
      ${isFieldset ? '<div data-form-group>' : ''}
      ${beforeOutput}`,
      `${afterOutput}
      ${labelAfter}
      ${isFieldset ? '</div></fieldset>' : ''}
    </div>
  `]
}

/* Exports */

export { FormField }
