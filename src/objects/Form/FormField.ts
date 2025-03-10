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
    fieldset = false,
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

  if (!fieldset && !isStringStrict(name)) {
    return []
  }

  /* Id */

  const id: string = uuid()

  /* Field classes */

  const fieldClassesArr: string[] = []

  if (isStringStrict(args.fieldClasses)) {
    fieldClassesArr.push(args.fieldClasses)
  }

  const fieldClasses = fieldClassesArr.length > 0 ? ` class="${fieldClassesArr.join(' ')}"` : ''

  /* Classes */

  const classesArr: string[] = []

  if (isStringStrict(classes)) {
    classesArr.push(classes)
  }

  /* Checkbox or radio */

  const isControl = type === 'checkbox' || type === 'radio'

  /* Icons */

  let controlIcon = ''
  let selectIcon = ''

  if (type === 'radio' && isStringStrict(radioIcon)) {
    controlIcon = radioIcon
  }

  if (type === 'checkbox' && isStringStrict(checkboxIcon)) {
    controlIcon = checkboxIcon
  }

  if (type === 'select' && isStringStrict(args.selectIcon)) {
    selectIcon = args.selectIcon
  }

  const requiredIcon = required && isStringStrict(args.requiredIcon) ? args.requiredIcon : ''

  /* Attributes */

  const attrs: string[] = []

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

  if (required) {
    attrs.push(fieldset ? 'data-aria-required="true"' : 'aria-required="true"')
  }

  if (isStringStrict(value)) {
    attrs.push(`value="${value}"`)
  }

  if (isStringStrict(emptyErrorMessage)) {
    attrs.push(`data-form-empty="${emptyErrorMessage}"`)
  }

  if (isStringStrict(invalidErrorMessage)) {
    attrs.push(`data-form-invalid="${invalidErrorMessage}"`)
  }

  if (classesArr.length > 0) {
    attrs.push(`class="${classesArr.join(' ')}"`)
  }

  const attr = attrs.length > 0 ? ` ${attrs.join(' ')}` : ''

  /* Hint */

  let hintOutput = ''

  if (isStringStrict(hint)) {
    hintOutput = `<span data-form-hint>${hint}</span>`
  }

  /* Label */

  let labelBefore = ''
  let labelAfter = ''

  const labelRequired = required ? ' data-form-required' : ''
  const labelClass = isStringStrict(labelClasses) ? ` class="${labelClasses}"` : ''

  if (fieldset) {
    labelBefore = `
      <legend id="${uuid()}"${labelClass}>
        <span data-form-legend${labelRequired}>
          <span data-form-legend-text>${label}</span>
          ${requiredIcon}
        </span>
        ${hintOutput}
      </legend>
    `
  } else if (isControl) {
    labelAfter = `
      <label for="${id}"${labelClass}>
        <span data-form-control>
          ${controlIcon}
          <span data-form-label${labelRequired}>
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
        <span data-form-label${labelRequired}>
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
    <div${fieldClasses} data-form-field="${type}">
      ${fieldset ? `<fieldset${isStringStrict(fieldsetClasses) ? ` class="${fieldsetClasses}"` : ''}>` : ''}
      ${labelBefore}
      ${beforeOutput}`,
      `${afterOutput}
      ${labelAfter}
      ${fieldset ? '</fieldset>' : ''}
    </div>
  `]
}

/* Exports */

export { FormField }
