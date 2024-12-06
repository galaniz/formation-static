/**
 * Objects - Form Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef FormArgs
 * @type {Generic}
 * @prop {object} args
 * @prop {string} [id]
 * @prop {string} [action]
 * @prop {string} [subject]
 * @prop {string} [toEmail]
 * @prop {string} [senderEmail]
 * @prop {string} [submitLabel]
 * @prop {string} [successTitle]
 * @prop {string} [successText]
 * @prop {string} [successResult]
 * @prop {string} [errorTitle]
 * @prop {string} [errorText]
 * @prop {string} [errorSummary]
 * @prop {string} [errorResult]
 * @prop {string} [formClasses]
 * @prop {string} [formAttr]
 * @prop {string} [fieldsClasses]
 * @prop {string} [fieldsAttr]
 * @prop {string} [submitFieldClasses]
 * @prop {string} [submitClasses]
 * @prop {string} [submitAttr]
 * @prop {string} [submitLoader]
 * @prop {string} [honeypotFieldClasses]
 * @prop {string} [honeypotLabelClasses]
 * @prop {string} [honeypotClasses]
 */
export interface FormArgs extends Generic {
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
}

/**
 * @typedef FormProps
 * @type {RenderFunctionArgs}
 * @prop {FormArgs} args
 */
export interface FormProps<T = FormArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: FormArgs & T
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
 * @typedef {object} FormScriptMeta
 * @prop {string} [url]
 * @prop {FormMessage} [successMessage]
 * @prop {FormMessage} [errorMessage]
 */
export interface FormScriptMeta {
  url?: string
  successMessage?: FormMessage
  errorMessage?: FormMessage
}

/**
 * @typedef {function} FormPropsFilter
 * @param {FormProps} props
 * @param {object} args
 * @param {string} args.renderType
 * @return {FormProps}
 */
export type FormPropsFilter<T = FormArgs, R = RenderItem> = (
  props: FormProps<T, R>,
  args: {
    renderType: string
  }
) => FormProps<T, R>
