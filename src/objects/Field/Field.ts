/**
 * Objects - Field
 */

/* Imports */

import type { FieldProps, FieldOption, FieldCheckboxRadioArgs } from './FieldTypes.js'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filters/filters.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isArrayStrict } from '../../utils/array/array.js'

/**
 * Output checkbox and radio inputs from options
 *
 * @private
 * @param {FieldCheckboxRadioArgs} args
 * @return {string[]}
 */
const _getCheckboxRadioOpts = (args: FieldCheckboxRadioArgs = {}): string => {
  const {
    opts = [],
    name = '',
    classes = '',
    attr = '',
    type = 'checkbox',
    icon = '',
    labelClass = ''
  } = args

  /* Opts and name required */

  if (opts.length === 0 || name === '') {
    return ''
  }

  /* Output */

  return opts.map((opt) => {
    const {
      text = '',
      value = '',
      selected = false
    } = opt

    const id: string = uuid()

    return `
      <div data-option-field data-type="${type}">
        <input type="${type}" name="${name}" id="${id}" class="${classes}" value="${value}"${attr}${selected ? ' checked' : ''}>
        <label for="${id}" data-option>
          <span${labelClass} data-label>
            <span data-label-text>${text}</span>
          </span>
          <span data-control data-type="${type}">${icon}</span>
        </label>
      </div>
    `
  }).join('')
}

/**
 * Output form field
 *
 * @param {FieldProps} props
 * @return {Promise<string>} HTML - div
 */
const Field = async (props: FieldProps): Promise<string> => {
  /* Props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  props = await applyFilters('fieldProps', props, { renderType: 'field' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return ''
  }

  let { args } = props

  args = isObjectStrict(args) ? args : {}

  const {
    type = 'text',
    name = '',
    label = '',
    value = '',
    required = false,
    width = '',
    widthSmall = '',
    widthMedium = '',
    widthLarge = '',
    autoCompleteToken = '',
    placeholder = '',
    options = [],
    rows = 5,
    emptyErrorMessage = '',
    invalidErrorMessage = '',
    fieldsetClasses = '',
    fieldClasses = '',
    labelClasses = '',
    classes = '',
    visuallyHiddenClass = '',
    radioIcon = '',
    checkboxIcon = '',
    selectIcon = ''
  } = args

  let { fieldset = false } = args

  /* Name and label required */

  if (!isStringStrict(name) || !isStringStrict(label)) {
    return ''
  }

  /* Id */

  const id: string = uuid()

  /* Field classes */

  const fieldClassesArr: string[] = []

  if (isStringStrict(fieldClasses)) {
    fieldClassesArr.push(fieldClasses)
  }

  /* Width */

  if (isStringStrict(width)) {
    fieldClassesArr.push(width)
  }

  if (isStringStrict(widthSmall) && widthSmall !== width) {
    fieldClassesArr.push(widthSmall)
  }

  if (isStringStrict(widthMedium) && widthMedium !== widthSmall) {
    fieldClassesArr.push(widthMedium)
  }

  if (isStringStrict(widthLarge) && widthLarge !== widthMedium) {
    fieldClassesArr.push(widthLarge)
  }

  /* Classes */

  const classesArr: string[] = []

  if (isStringStrict(classes)) {
    classesArr.push(classes)
  }

  /* Checkbox or radio */

  const checkboxRadio = type === 'checkbox' || type === 'radio'

  /* Icon */

  const icon = type === 'radio' ? radioIcon : checkboxIcon

  /* Options */

  const opts: FieldOption[] = []

  if (isArrayStrict(options)) {
    options.forEach((option) => {
      const [optText, optValue, optSelected] = option.split(' : ')

      if (optText === undefined || optValue === undefined) {
        return
      }

      opts.push({
        text: optText,
        value: optText,
        selected: optSelected !== undefined
      })
    })
  }

  /* Check if fieldset */

  let checkboxRadioOpts = false

  if (opts.length > 0 && checkboxRadio) {
    checkboxRadioOpts = true
    fieldset = true
  }

  /* Attributes */

  const attr: string[] = []

  if (required) {
    attr.push(fieldset ? 'data-aria-required="true"' : 'aria-required="true"')
  }

  if (isStringStrict(value) && !checkboxRadioOpts) {
    attr.push(`value="${value}"`)
  }

  if (isStringStrict(placeholder)) {
    attr.push(`placeholder="${placeholder}"`)
  }

  if (isStringStrict(autoCompleteToken)) {
    attr.push(`autocomplete="${autoCompleteToken}"`)
  }

  if (isStringStrict(emptyErrorMessage)) {
    attr.push(`data-empty-message="${emptyErrorMessage}"`)
  }

  if (isStringStrict(invalidErrorMessage)) {
    attr.push(`data-invalid-message="${invalidErrorMessage}"`)
  }

  if (classesArr.length > 0) {
    attr.push(`class="${classesArr.join(' ')}"`)
  }

  if (rows > 0 && type === 'textarea') {
    attr.push(`rows="${rows}"`)
  }

  let attrs = ''

  if (attr.length > 0) {
    attrs = ` ${attr.join(' ')}`
  }

  /* Label */

  let labelBefore = ''
  let labelAfter = ''

  const labelRequired = required ? ' data-required' : ''
  const labelRequiredIcon = required ? '<span data-required-icon aria-hidden="true"></span>' : ''
  const labelClass = isStringStrict(labelClasses) ? ` class="${labelClasses}"` : ''

  if (checkboxRadio) {
    if (fieldset) {
      labelBefore = `
        <legend id="${uuid()}"${labelRequired}>
          <span data-legend-text>${label}${required ? `<span${isStringStrict(visuallyHiddenClass) ? ` class="${visuallyHiddenClass}"` : ''}> required</span>` : ''}
            ${labelRequiredIcon}
          </span>
        </legend>
      `
    } else {
      labelAfter = `
        <label for="${id}" data-option>
          <span${labelClass} data-label${labelRequired}>
            <span data-label-text>
              ${label}
              ${labelRequiredIcon}
            </span>
          </span>
          <span data-control data-type="${type}">${icon}</span>
        </label>
      `
    }
  } else {
    labelBefore = `
      <label for="${id}"${labelClass} data-label${labelRequired}>
        <span data-label-text>
          ${label}
          ${labelRequiredIcon}
        </span>
      </label>
    `
  }

  /* Input */

  let input = ''

  switch (type) {
    case 'text':
    case 'email':
    case 'checkbox':
    case 'radio':
    case 'number':
    case 'password':
    case 'tel': {
      input = `<input type="${type}" name="${name}" id="${id}"${attrs}>`

      if (checkboxRadioOpts) {
        input = _getCheckboxRadioOpts({
          opts,
          name,
          classes,
          attr: attrs,
          type,
          icon,
          labelClass
        })
      }

      break
    }
    case 'textarea': {
      input = `<textarea name="${name}" id="${id}"${attrs}></textarea>`
      break
    }
    case 'select': {
      if (opts.length > 0) {
        const optsOutput = opts.map((opt) => {
          const {
            text,
            value,
            selected = false
          } = opt

          return `<option value="${value}"${selected ? ' selected' : ''}>${text}</option>`
        }).join('')

        input = `
          <div data-type="select">
            <select name="${name}" id="${id}"${attrs}>${optsOutput}</select>
            <div data-select-icon>${selectIcon}</div>
          </div>
        `
      }

      break
    }
  }

  if (input === '') {
    return ''
  }

  /* Output */

  return `
    <div class="${fieldClassesArr.join(' ')}" data-type="${type}">
      ${fieldset ? `<fieldset${isStringStrict(fieldsetClasses) ? ` class="${fieldsetClasses}"` : ''}>` : ''}
      ${labelBefore}
      ${input}
      ${labelAfter}
      ${fieldset ? '</fieldset>' : ''}
    </div>
  `
}

/* Exports */

export { Field }
