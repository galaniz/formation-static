/**
 * Objects - Form
 */

/* Imports */

import type { FormProps, FormMeta, FormScriptMeta } from './FormTypes.js'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filter/filter.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isObjectStrict } from '../../utils/object/object.js'
import { setStoreItem } from '../../store/store.js'
import { scripts } from '../../utils/scriptStyle/scriptStyle.js'
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

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = applyFilters('formProps', props, { renderType: 'form' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const { args } = props
  const {
    id,
    action = 'sendForm',
    subject,
    toEmail,
    senderEmail,
    submitLabel = 'Send',
    successTitle,
    successText,
    errorTitle,
    errorText,
    errorSummary,
    errorResult,
    successResult,
    formClasses,
    formAttr,
    fieldsClasses,
    fieldsAttr,
    submitFieldClasses,
    submitClasses,
    submitAttr,
    submitLoader,
    honeypotFieldClasses,
    honeypotLabelClasses,
    honeypotClasses,
    honeypotLabel = 'Website'
  } = isObjectStrict(args) ? args : {}

  /* Id required */

  if (!isStringStrict(id)) {
    return fallback
  }

  /* Add to form meta data */

  const meta: FormMeta = {}

  if (isStringStrict(subject)) {
    meta.subject = subject
  }

  if (isStringStrict(toEmail)) {
    meta.toEmail = toEmail
  }

  if (isStringStrict(senderEmail)) {
    meta.senderEmail = senderEmail
  }

  setStoreItem('formMeta', meta, id)

  /* Add to script data */

  const scriptMeta: FormScriptMeta = {}

  if (isStringStrict(successTitle)) {
    scriptMeta.successMessage = {
      primary: successTitle,
      secondary: isStringStrict(successText) ? successText : ''
    }
  }

  if (isStringStrict(errorTitle)) {
    scriptMeta.errorMessage = {
      primary: errorTitle,
      secondary: isStringStrict(errorText) ? errorText : ''
    }
  }

  if (!isObjectStrict(scripts.meta.forms)) {
    scripts.meta.forms = {}
  }

  scripts.meta.forms[id] = {
    url: '/ajax/',
    ...scriptMeta
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
    <form${isStringStrict(formClasses) ? ` class="${formClasses}"` : ''} id="${id}" data-form-action="${action}"${isStringStrict(formAttr) ? ` ${formAttr}` : ''} novalidate>
      <div${isStringStrict(fieldsClasses) ? ` class="${fieldsClasses}"` : ''}${isStringStrict(fieldsAttr) ? ` ${fieldsAttr}` : ''}>
        ${errorSummary}`,
        `${honeypot}
        ${errorResult}
        <div${isStringStrict(submitFieldClasses) ? ` class="${submitFieldClasses}"` : ''}>
          <button${isStringStrict(submitClasses) ? ` class="${submitClasses}"` : ''}${isStringStrict(submitAttr) ? ` ${submitAttr}` : ''} type="submit">
            ${submitLoader}
            <span>${submitLabel}</span>
          </button>
        </div>
        ${successResult}
      </div>
    </form>
  `]
}

/* Exports */

export { Form }
