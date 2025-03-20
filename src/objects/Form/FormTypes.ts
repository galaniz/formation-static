/**
 * Objects - Form Types
 */

/* Imports */

import type { Generic, ParentArgs } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef FormArgs
 * @type {Generic}
 * @prop {object} args
 * @prop {string} [id]
 * @prop {string} [action]
 * @prop {string} [submitLabel]
 * @prop {string} [formClasses]
 * @prop {string} [formAttr]
 * @prop {string} [fieldsClasses]
 * @prop {string} [fieldsAttr]
 * @prop {string} [submitFieldClasses]
 * @prop {string} [submitClasses]
 * @prop {string} [submitAttr]
 * @prop {string} [honeypotFieldClasses]
 * @prop {string} [honeypotLabelClasses]
 * @prop {string} [honeypotClasses]
 * @prop {string} [honeypotLabel]
 */
export interface FormArgs extends Generic {
  id?: string
  action?: string
  submitLabel?: string
  formClasses?: string
  formAttr?: string
  fieldsClasses?: string
  fieldsAttr?: string
  submitFieldClasses?: string
  submitClasses?: string
  submitAttr?: string
  honeypotFieldClasses?: string
  honeypotLabelClasses?: string
  honeypotClasses?: string
  honeypotLabel?: string
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
 * @typedef {function} FormPropsFilter
 * @param {FormProps} props
 * @return {FormProps}
 */
export type FormPropsFilter<T = FormArgs, R = RenderItem> = (
  props: FormProps<T, R>
) => FormProps<T, R>

/**
 * @typedef {'text'|'email'|'checkbox'|'radio'|'number'|'password'|'tel'|'url'|'textarea'|'select'|'radio-group'|'checkbox-group'|'fieldset'|'hidden'} FormFieldType
 */
export type FormFieldType =
  'text' |
  'email' |
  'checkbox' |
  'radio' |
  'number' |
  'password' |
  'tel' |
  'url' |
  'textarea' |
  'select' |
  'radio-group' |
  'checkbox-group' |
  'fieldset' |
  'hidden'

/**
 * @typedef FormFieldArgs
 * @type {Generic}
 * @prop {FormFieldType} [type=text]
 * @prop {string} [name]
 * @prop {string} [label]
 * @prop {string} [hint]
 * @prop {string} [value]
 * @prop {boolean} [required=false]
 * @prop {string} [attributes]
 * @prop {string} [emptyErrorMessage]
 * @prop {string} [invalidErrorMessage]
 * @prop {string} [fieldsetClasses] - Back end option
 * @prop {string} [fieldClasses] - Back end option
 * @prop {string} [labelClasses] - Back end option
 * @prop {string} [classes] - Back end option
 * @prop {string} [radioIcon] - Back end option
 * @prop {string} [checkboxIcon] - Back end option
 * @prop {string} [selectIcon] - Back end option
 * @prop {string} [requiredIcon] - Back end option
 */
export interface FormFieldArgs extends Generic {
  type?: FormFieldType
  name?: string
  label?: string
  hint?: string
  value?: string
  required?: boolean
  attributes?: string
  emptyErrorMessage?: string
  invalidErrorMessage?: string
  fieldsetClasses?: string
  fieldClasses?: string
  labelClasses?: string
  classes?: string
  radioIcon?: string
  checkboxIcon?: string
  selectIcon?: string
  requiredIcon?: string
}

/**
 * @typedef FormFieldProps
 * @type {RenderFunctionArgs}
 * @prop {FormFieldArgs} args
 */
export interface FormFieldProps<T = FormFieldArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: FormFieldArgs & T
}

/**
 * @typedef {function} FormFieldPropsFilter
 * @param {FormFieldProps} props
 * @return {FormFieldProps}
 */
export type FormFieldPropsFilter<T = FormFieldArgs, R = RenderItem> = (
  props: FormFieldProps<T, R>
) => FormFieldPropsFilter<T, R>

/**
 * @typedef FormOptionArgs
 * @type {Generic}
 * @prop {string} [label]
 * @prop {string} [value]
 * @prop {string} [name]
 * @prop {string} [hint]
 * @prop {boolean} [selected]
 * @prop {string} [optionClasses] - Back end option
 * @prop {string} [labelClasses] - Back end option
 * @prop {string} [classes] - Back end option
 * @prop {string} [radioIcon] - Back end option
 * @prop {string} [checkboxIcon] - Back end option
 */
export interface FormOptionArgs extends Generic {
  label?: string
  value?: string
  name?: string
  hint?: string
  selected?: boolean
  optionClasses?: string
  labelClasses?: string
  classes?: string
  radioIcon?: string
  checkboxIcon?: string
}

/**
 * @typedef FormOptionProps
 * @type {RenderFunctionArgs}
 * @prop {FormOptionArgs} args
 * @prop {FormFieldArgs} [parents]
 */
export interface FormOptionProps<T = FormOptionArgs, R = RenderItem, P = ParentArgs & FormFieldProps> extends RenderFunctionArgs<T, R, P> {
  args: FormOptionArgs & T
  parents?: P[]
}

/**
 * @typedef {function} FormFieldPropsFilter
 * @param {FormFieldProps} props
 * @return {FormFieldProps}
 */
export type FormOptionPropsFilter<T = FormOptionArgs, R = RenderItem> = (
  props: FormOptionProps<T, R>
) => FormOptionProps<T, R>
