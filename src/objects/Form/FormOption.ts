/**
 * Objects - Form Option
 */

/* Imports */

import type { FormOptionProps } from './FormTypes.js'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filter/filter.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isArrayStrict } from '../../utils/array/array.js'

/**
 * Output form option
 *
 * @param {FormOptionProps} props
 * @return {string} HTMLOptionElement|HTMLDivElement
 */
const FormOption = (props: FormOptionProps): string => {
  /* Props required */

  if (!isObjectStrict(props)) {
    return ''
  }

  props = applyFilters('formOptionProps', props)

  /* Filtered props required */

  if (!isObjectStrict(props)) {
    return ''
  }

  const { args, parents } = props
  const {
    label,
    value,
    name,
    hint,
    selected,
    radioIcon,
    checkboxIcon,
    optionClasses,
    labelClasses,
    classes
  } = isObjectStrict(args) ? args : {}

  /* Label and value required */

  if (!isStringStrict(label) || !isStringStrict(value)) {
    return ''
  }

  /* Parent field required */

  if (!isArrayStrict(parents)) {
    return ''
  }

  const fieldParent = parents[0]

  if (!isObjectStrict(fieldParent)) {
    return ''
  }

  const {
    renderType,
    args: fieldArgs
  } = fieldParent

  if (renderType !== 'formField') {
    return ''
  }

  const {
    name: fieldName,
    type: fieldType
  } = fieldArgs

  const isRadioGroup = fieldType === 'radio-group'
  const isCheckboxGroup = fieldType === 'checkbox-group'
  const isSelect = fieldType === 'select'

  /* Field radio group, checkbox group or select required */

  if (!isRadioGroup && !isCheckboxGroup && !isSelect) {
    return ''
  }
  
  /* Select */

  if (isSelect) {
    return `<option value="${value}"${selected ? ' selected' : ''}>${label}</option>`
  }

  /* Name */

  const inputName = name ?? fieldName

  if (!isStringStrict(inputName)) {
    return ''
  }

  /* Id */

  const id = uuid()

  /* Icon */

  let optionIcon = ''

  if (isRadioGroup && isStringStrict(radioIcon)) {
    optionIcon = radioIcon
  }

  if (isCheckboxGroup && isStringStrict(checkboxIcon)) {
    optionIcon = checkboxIcon
  }

  /* Hint */

  let hintOutput = ''

  if (isStringStrict(hint)) {
    hintOutput = `<small data-form-hint>${hint}</small>`
  }

  /* Checkbox or radio */

  return `
    <div${isStringStrict(optionClasses) ? ` class="${optionClasses}"` : ''}>
      <input
        type="${isRadioGroup ? 'radio' : 'checkbox'}"
        value="${value}"
        name="${inputName}"
        id="${id}"
        ${isStringStrict(classes) ? ` class="${classes}"` : ''}
        data-form-input
        ${selected ? ' checked' : ''}
      >
      <label for="${id}"${isStringStrict(labelClasses) ? ` class="${labelClasses}"` : ''}>
        <span data-form-option>
          ${optionIcon}
          <span data-form-label>
            <span data-form-label-text>${label}</span>
            ${hintOutput}
          </span>
        </span>
      </label>
    </div>
  `
}

/* Exports */

export { FormOption }
