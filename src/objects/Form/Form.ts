/**
 * Objects - Form
 */

/* Imports */

import type { FormProps } from './FormTypes.js'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filter/filter.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { config } from '../../config/config.js'

/**
 * Output form wrapper
 *
 * @param {FormProps} props
 * @return {string[]} HTMLFormElement
 */
const Form = (props: FormProps): string[] => {
  /* Fallback output */

  const fallback: string[] = []

  /* Props required */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = applyFilters('formProps', props)

  /* Filtered props required */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const { args } = props
  const {
    id,
    submitLabel = 'Submit',
    formClasses,
    formAttr,
    fieldsClasses,
    fieldsAttr,
    submitFieldClasses,
    submitClasses,
    submitAttr,
    honeypotFieldClasses,
    honeypotLabelClasses,
    honeypotClasses,
    honeypotLabel = 'Website'
  } = isObjectStrict(args) ? args : {}

  /* Id required */

  if (!isStringStrict(id)) {
    return fallback
  }

  /* Honeypot */

  const honeypotId: string = uuid()
  const honeypotName = `${config.namespace}_asi`
  const honeypot = `
    <div${isStringStrict(honeypotFieldClasses) ? ` class="${honeypotFieldClasses}"` : ''}>
      <label${isStringStrict(honeypotLabelClasses) ? ` class="${honeypotLabelClasses}"` : ''} for="${honeypotId}">${honeypotLabel}</label>
      <input${isStringStrict(honeypotClasses) ? ` class="${honeypotClasses}"` : ''} type="url" name="${honeypotName}" id="${honeypotId}" autocomplete="off">
    </div>
  `

  /* Output */

  return [`
    <form${isStringStrict(formClasses) ? ` class="${formClasses}"` : ''} id="${id}"${isStringStrict(formAttr) ? ` ${formAttr}` : ''}>
      <div${isStringStrict(fieldsClasses) ? ` class="${fieldsClasses}"` : ''}${isStringStrict(fieldsAttr) ? ` ${fieldsAttr}` : ''}>`,
        `${honeypot}
        <div${isStringStrict(submitFieldClasses) ? ` class="${submitFieldClasses}"` : ''}>
          <button${isStringStrict(submitClasses) ? ` class="${submitClasses}"` : ''}${isStringStrict(submitAttr) ? ` ${submitAttr}` : ''} type="submit">
            ${submitLabel}
          </button>
        </div>
      </div>
    </form>
  `]
}

/* Exports */

export { Form }
