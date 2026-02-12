/**
 * Objects - Form
 */

/* Imports */

import type { FormProps } from './FormTypes.js'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../filters/filters.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'

/**
 * Output form wrapper.
 *
 * @param {FormProps} props
 * @return {string[]} HTMLFormElement
 */
const Form = (props: FormProps): string[] => {
  /* Props required */

  if (!isObjectStrict(props)) {
    return []
  }

  props = applyFilters('formProps', props)

  const { args } = props
  const {
    id,
    formTag = 'form',
    formClasses,
    formAttr,
    fields = '',
    fieldsClasses,
    fieldsAttr,
    submitFieldClasses,
    submitFieldAttr,
    submitLabel = 'Submit',
    submitClasses,
    submitAttr,
    honeypotName,
    honeypotFieldClasses,
    honeypotFieldAttr,
    honeypotLabelClasses,
    honeypotLabel = 'Website',
    honeypotClasses,
    honeypotAttr
  } = isObjectStrict(args) ? args : {}

  /* ID, form tag and label required */

  if (!isStringStrict(id) || !isStringStrict(formTag) || !isStringStrict(submitLabel)) {
    return []
  }

  /* Form */

  const formAttrs =
    (isStringStrict(formClasses) ? ` class="${formClasses}"` : '') +
    (isStringStrict(formAttr) ? ` ${formAttr}` : '')

  /* Fields */

  const fieldsTag = formTag === 'form' ? 'div' : 'form'
  const fieldsAttrs =
    (isStringStrict(fieldsClasses) ? ` class="${fieldsClasses}"` : '') +
    (isStringStrict(fieldsAttr) ? ` ${fieldsAttr}` : '')

  /* Honeypot */

  let honeypotOutput = ''

  if (isStringStrict(honeypotName)) {
    const honeypotId: string = uuid()
    const honeypotFieldAttrs =
      (isStringStrict(honeypotFieldClasses) ? ` class="${honeypotFieldClasses}"` : '') +
      (isStringStrict(honeypotFieldAttr) ? ` ${honeypotFieldAttr}` : '')

    const honeypotAttrs =
      (isStringStrict(honeypotClasses) ? ` class="${honeypotClasses}"` : '') +
      (isStringStrict(honeypotAttr) ? ` ${honeypotAttr}` : '')

    honeypotOutput = `
      <div${honeypotFieldAttrs}>
        <label for="${honeypotId}"${isStringStrict(honeypotLabelClasses) ? ` class="${honeypotLabelClasses}"` : ''}>
          ${honeypotLabel}
        </label>
        <input type="url" name="${honeypotName}" id="${honeypotId}" autocomplete="off"${honeypotAttrs}>
      </div>
    `  
  }

  /* Submit */

  const submitFieldAttrs =
    (isStringStrict(submitFieldClasses) ? ` class="${submitFieldClasses}"` : '') +
    (isStringStrict(submitFieldAttr) ? ` ${submitFieldAttr}` : '')

  const submitAttrs =
    (isStringStrict(submitClasses) ? ` class="${submitClasses}"` : '') +
    (isStringStrict(submitAttr) ? ` ${submitAttr}` : '')

  /* Output */

  return [`
    <${formTag} id="${id}"${formAttrs}>
      <${fieldsTag}${fieldsAttrs}>`,
        `${fields}${honeypotOutput}
        <div${submitFieldAttrs}>
          <button type="submit"${submitAttrs}>
            ${submitLabel}
          </button>
        </div>
      </${fieldsTag}>
    </${formTag}>
  `]
}

/* Exports */

export { Form }
