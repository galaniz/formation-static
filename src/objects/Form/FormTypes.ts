/**
 * Objects - Form Types
 */

/**
 * @typedef {object} FormProps
 * @prop {object} args
 * @prop {string} [args.id]
 * @prop {string} [args.action]
 * @prop {string} [args.subject]
 * @prop {string} [args.toEmail]
 * @prop {string} [args.senderEmail]
 * @prop {string} [args.submitLabel]
 * @prop {string} [args.successTitle]
 * @prop {string} [args.successText]
 * @prop {string} [args.successResult]
 * @prop {string} [args.errorTitle]
 * @prop {string} [args.errorText]
 * @prop {string} [args.errorSummary]
 * @prop {string} [args.errorResult]
 * @prop {string} [args.formClasses]
 * @prop {string} [args.formAttr]
 * @prop {string} [args.fieldsClasses]
 * @prop {string} [args.fieldsAttr]
 * @prop {string} [args.submitFieldClasses]
 * @prop {string} [args.submitClasses]
 * @prop {string} [args.submitAttr]
 * @prop {string} [args.submitLoader]
 * @prop {string} [args.honeypotFieldClasses]
 * @prop {string} [args.honeypotLabelClasses]
 * @prop {string} [args.honeypotClasses]
 */
export interface FormProps {
  args: {
    id?: string
    action?: string
    subject?: string
    toEmail?: string
    senderEmail?: string
    submitLabel?: string
    successTitle?: string
    successText?: string
    successResult?: string
    errorTitle?: string
    errorText?: string
    errorSummary?: string
    errorResult?: string
    formClasses?: string
    formAttr?: string
    fieldsClasses?: string
    fieldsAttr?: string
    submitFieldClasses?: string
    submitClasses?: string
    submitAttr?: string
    submitLoader?: string
    honeypotFieldClasses?: string
    honeypotLabelClasses?: string
    honeypotClasses?: string
    [key: string]: unknown
  }
}

/**
 * @typedef {object} FormReturn
 * @prop {string} start
 * @prop {string} end
 */
export interface FormReturn {
  start: string
  end: string
}

/**
 * @typedef {object} FormMeta
 * @prop {string} [subject]
 * @prop {string} [toEmail]
 * @prop {string} [senderEmail]
 */
export interface FormMeta {
  subject?: string
  toEmail?: string
  senderEmail?: string
}

/**
 * @typedef {object} FormMessage
 * @prop {string} primary
 * @prop {string} secondary
 */
export interface FormMessage {
  primary: string
  secondary: string
}

/**
 * @typedef {object} FormMessages
 * @prop {FormMessage} [successMessage]
 * @prop {FormMessage} [errorMessage]
 */
export interface FormMessages {
  successMessage?: FormMessage
  errorMessage?: FormMessage
}

/**
 * @typedef {function} FormPropsFilter
 * @param {FormProps} props
 * @param {object} args
 * @param {string} args.renderType
 * @return {Promise<FormProps>}
 */
export type FormPropsFilter = (props: FormProps, args: { renderType: string }) => Promise<FormProps>
