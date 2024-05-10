/**
 * Objects - Form
 */

/* Imports */

import type { FormProps, FormReturn, FormMeta, FormMessages } from './FormTypes'
import { v4 as uuid } from 'uuid'
import { applyFilters } from '../../utils/filters/filters'
import { isStringStrict } from '../../utils/isString/isString'
import { isObjectStrict } from '../../utils/isObject/isObject'
import { config } from '../../config/config'

/**
 * Function - output form wrapper
 *
 * @param {import('./FormTypes').FormProps} props
 * @return {Promise<import('./FormTypes').FormReturn>}
 */
const Form = async (props: FormProps): Promise<FormReturn> => {
  /* Fallback output */

  const fallback = {
    start: '',
    end: ''
  }

  /* Props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  props = await applyFilters('formProps', props, { renderType: 'form' })

  /* Filtered props must be object */

  if (!isObjectStrict(props)) {
    return fallback
  }

  const { args } = props

  const {
    id = '',
    action = 'sendForm',
    subject = '',
    toEmail = '',
    senderEmail = '',
    submitLabel = 'Send',
    successTitle = '',
    successText = '',
    errorTitle = '',
    errorText = '',
    errorSummary = '',
    errorResult = '',
    successResult = '',
    formClasses = '',
    formAttr = '',
    fieldsClasses = '',
    fieldsAttr = '',
    submitFieldClasses = '',
    submitClasses = '',
    submitAttr = '',
    submitLoader = '',
    honeypotFieldClasses = '',
    honeypotLabelClasses = '',
    honeypotClasses = ''
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

  if (Object.keys(meta).length > 0) {
    config.formMeta[id] = meta
  }

  /* Add to script data */

  const messages: FormMessages = {}

  if (isStringStrict(successTitle)) {
    messages.successMessage = {
      primary: successTitle,
      secondary: successText
    }
  }

  if (isStringStrict(errorTitle)) {
    messages.errorMessage = {
      primary: errorTitle,
      secondary: errorText
    }
  }

  if (Object.keys(messages).length > 0) {
    if (config.scriptMeta.forms === undefined) {
      config.scriptMeta.forms = {}
    }

    config.scriptMeta.forms[id] = messages
  }

  config.scriptMeta.sendUrl = '/ajax/'

  /* Honeypot */

  const honeypotId: string = uuid()
  const honeypotName = `${config.namespace}_asi`
  const honeypot = `
    <div${isStringStrict(honeypotFieldClasses) ? ` class="${honeypotFieldClasses}"` : ''} data-asi>
      <label${isStringStrict(honeypotLabelClasses) ? ` class="${honeypotLabelClasses}"` : ''} for="${honeypotId}">Website</label>
      <input${isStringStrict(honeypotClasses) ? ` class="${honeypotClasses}"` : ''} type="url" name="${honeypotName}" id="${honeypotId}" autocomplete="off">
    </div>
  `

  /* Output */

  const start = `
    <form${isStringStrict(formClasses) ? ` class="${formClasses}"` : ''} id="${id}" data-action="${action}"${isStringStrict(formAttr) ? ` ${formAttr}` : ''} novalidate>
      <div${isStringStrict(fieldsClasses) ? ` class="${fieldsClasses}"` : ''}${isStringStrict(fieldsAttr) ? ` ${fieldsAttr}` : ''}>
        ${errorSummary}
  `

  const end = `
        ${honeypot}
        ${errorResult}
        <div${isStringStrict(submitFieldClasses) ? ` class="${submitFieldClasses}"` : ''} data-type="submit">
          <button${isStringStrict(submitClasses) ? ` class="${submitClasses}"` : ''}${isStringStrict(submitAttr) ? ` ${submitAttr}` : ''} type="submit">
            ${submitLoader}
            <span>${submitLabel}</span>
          </button>
        </div>
        ${successResult}
      </div>
    </form>
  `

  return {
    start,
    end
  }
}

/* Exports */

export { Form }
