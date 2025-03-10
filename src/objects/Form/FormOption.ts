/**
 * Objects - Form Option
 */

/* Imports */

import type { FormFieldProps, FormOptionProps } from './FormTypes.js'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filter/filter.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { isArrayStrict } from '../../utils/array/array.js'

/**
 * Output form option
 *
 * @param {FormOptionProps} props
 * @return {string}
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

  /* Label required */

  if (!isStringStrict(label)) {
    return ''
  }

  /* Parent field required */

  if (!isArrayStrict(parents)) {
    return ''
  }

  const fieldParent = parents[0] as FormFieldProps

  if (!isObjectStrict(fieldParent)) {
    return ''
  }

  const { args: fieldArgs } = fieldParent
  const { name: fieldName, type } = fieldArgs

  const isRadioGroup = type === 'radio-group'
  const isCheckboxGroup = type === 'checkbox-group'
  const isSelect = type === 'select'

  /* Field radio group, checkbox group or select required */

  if (!isRadioGroup && !isCheckboxGroup && !isSelect) {
    return ''
  }
  
  /* Select */

  if (isSelect) {
    return `<option value="${value}"${selected ? ' selected' : ''}>${label}</option>`
  }

  /* Id */

  const id = uuid()

  /* Icon */

  let controlIcon = ''

  if (isRadioGroup && isStringStrict(radioIcon)) {
    controlIcon = radioIcon
  }

  if (isCheckboxGroup && isStringStrict(checkboxIcon)) {
    controlIcon = checkboxIcon
  }

  /* Hint */

  let hintOutput = ''

  if (isStringStrict(hint)) {
    hintOutput = `<span data-form-hint>${hint}</span>`
  }

  /* Checkbox or radio */

  return `
    <div${isStringStrict(optionClasses) ? ` class="${optionClasses}"` : ''} data-form-option>
      <input
        type="${isRadioGroup ? 'radio' : 'checkbox'}"
        value="${value}"
        name="${isRadioGroup ? fieldName : name}"
        id="${id}"
        ${isStringStrict(classes) ? ` class="${classes}"` : ''}
        ${selected ? ' checked' : ''}
      >
      <label for="${id}"${isStringStrict(labelClasses) ? ` class="${labelClasses}"` : ''}>
        <span data-form-control>
          ${controlIcon}
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
