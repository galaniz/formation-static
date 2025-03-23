/**
 * Objects - Form Types
 */

/* Imports */

import type { Generic, ParentArgs } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {object} FormArgs
 * @extends {Generic}
 * @prop {string} [id]
 * @prop {string} [formTag=form]
 * @prop {string} [formClasses]
 * @prop {string} [formAttr]
 * @prop {string} [fieldsClasses]
 * @prop {string} [fieldsAttr]
 * @prop {string} [submitFieldClasses]
 * @prop {string} [submitFieldAttr]
 * @prop {string} [submitLabel=Submit]
 * @prop {string} [submitClasses]
 * @prop {string} [submitAttr]
 * @prop {boolean} [honeypot=false]
 * @prop {string} [honeypotFieldClasses]
 * @prop {string} [honeypotFieldAttr]
 * @prop {string} [honeypotLabelClasses]
 * @prop {string} [honeypotClasses]
 * @prop {string} [honeypotLabel=Website]
 * @prop {string} [honeypotAttr]
 */
export interface FormArgs extends Generic {
  id?: string
  formTag?: string
  formClasses?: string
  formAttr?: string
  fieldsClasses?: string
  fieldsAttr?: string
  submitFieldClasses?: string
  submitFieldAttr?: string
  submitLabel?: string
  submitClasses?: string
  submitAttr?: string
  honeypot?: boolean
  honeypotFieldClasses?: string
  honeypotFieldAttr?: string
  honeypotLabelClasses?: string
  honeypotClasses?: string
  honeypotLabel?: string
  honeypotAttr?: string
}

/**
 * @typedef {object} FormProps
 * @extends {RenderFunctionArgs}
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
 * @typedef {object} FormFieldArgs
 * @extends {Generic}
 * @prop {FormFieldType} [type=text]
 * @prop {string} [name]
 * @prop {string} [label]
 * @prop {string} [hint]
 * @prop {string} [value]
 * @prop {boolean} [required=false]
 * @prop {string} [attributes]
 * @prop {string} [emptyError]
 * @prop {string} [invalidError]
 * @prop {string} [fieldsetClasses]
 * @prop {string} [fieldsetAttr]
 * @prop {string} [fieldClasses]
 * @prop {string} [fieldAttr]
 * @prop {string} [labelClasses]
 * @prop {string} [classes]
 * @prop {string} [radioIcon]
 * @prop {string} [checkboxIcon]
 * @prop {string} [selectIcon]
 * @prop {string} [requiredIcon]
 */
export interface FormFieldArgs extends Generic {
  type?: FormFieldType
  name?: string
  label?: string
  hint?: string
  value?: string
  required?: boolean
  attributes?: string
  emptyError?: string
  invalidError?: string
  fieldsetClasses?: string
  fieldsetAttr?: string
  fieldClasses?: string
  fieldAttr?: string
  labelClasses?: string
  classes?: string
  radioIcon?: string
  checkboxIcon?: string
  selectIcon?: string
  requiredIcon?: string
}

/**
 * @typedef {object} FormFieldProps
 * @extends {RenderFunctionArgs}
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
) => FormFieldProps<T, R>

/**
 * @typedef {object} FormOptionArgs
 * @extends {Generic}
 * @prop {string} [label]
 * @prop {string} [value]
 * @prop {string} [name]
 * @prop {string} [hint]
 * @prop {boolean} [selected]
 * @prop {string} [optionClasses]
 * @prop {string} [labelClasses]
 * @prop {string} [classes]
 * @prop {string} [radioIcon]
 * @prop {string} [checkboxIcon]
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
 * @typedef {object} FormOptionProps
 * @extends {RenderFunctionArgs}
 * @prop {FormOptionArgs} args
 * @prop {FormFieldArgs} [parents]
 */
export interface FormOptionProps<T = FormOptionArgs, R = RenderItem, P = ParentArgs & FormFieldProps> extends RenderFunctionArgs<T, R, P> {
  args: FormOptionArgs & T
  parents?: P[]
}

/**
 * @typedef {function} FormOptionPropsFilter
 * @param {FormOptionProps} props
 * @return {FormOptionProps}
 */
export type FormOptionPropsFilter<T = FormOptionArgs, R = RenderItem> = (
  props: FormOptionProps<T, R>
) => FormOptionProps<T, R>
