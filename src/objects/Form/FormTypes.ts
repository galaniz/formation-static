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
 * @prop {string} [fields]
 * @prop {string} [fieldsClasses]
 * @prop {string} [fieldsAttr]
 * @prop {string} [submitFieldClasses]
 * @prop {string} [submitFieldAttr]
 * @prop {string} [submitLabel=Submit]
 * @prop {string} [submitClasses]
 * @prop {string} [submitAttr]
 * @prop {string} [honeypotName]
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
  fields?: string
  fieldsClasses?: string
  fieldsAttr?: string
  submitFieldClasses?: string
  submitFieldAttr?: string
  submitLabel?: string
  submitClasses?: string
  submitAttr?: string
  honeypotName?: string
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
export interface FormProps<A = FormArgs, R = RenderItem> extends RenderFunctionArgs<A, R> {
  args: FormArgs & A
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
export type FormPropsFilter<A = FormArgs, R = RenderItem> = (
  props: FormProps<A, R>
) => FormProps<A, R>

/**
 * @typedef {'text'|'email'|'checkbox'|'radio'|'number'|'password'|'tel'|'url'|'textarea'|'select'|'radio-group'|'checkbox-group'|'fieldset'|'hidden'|'file'} FormFieldType
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
  'hidden' |
  'file'

/**
 * @typedef {object} FormFieldArgs
 * @extends {Generic}
 * @prop {FormFieldType} [type=text]
 * @prop {string} [name]
 * @prop {string} [label]
 * @prop {string} [hint]
 * @prop {string} [value]
 * @prop {boolean} [required=false]
 * @prop {string} [attr]
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
  attr?: string
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
export interface FormFieldProps<A = FormFieldArgs, R = RenderItem> extends RenderFunctionArgs<A, R> {
  args: FormFieldArgs & A
}

/**
 * @typedef {function} FormFieldPropsFilter
 * @param {FormFieldProps} props
 * @return {FormFieldProps}
 */
export type FormFieldPropsFilter<A = FormFieldArgs, R = RenderItem> = (
  props: FormFieldProps<A, R>
) => FormFieldProps<A, R>

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
export interface FormOptionProps<A = FormOptionArgs, R = RenderItem, P = ParentArgs & FormFieldProps> extends RenderFunctionArgs<A, R, P> {
  args: FormOptionArgs & A
  parents?: P[]
}

/**
 * @typedef {function} FormOptionPropsFilter
 * @param {FormOptionProps} props
 * @return {FormOptionProps}
 */
export type FormOptionPropsFilter<A = FormOptionArgs, R = RenderItem> = (
  props: FormOptionProps<A, R>
) => FormOptionProps<A, R>
