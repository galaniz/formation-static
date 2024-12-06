/**
 * Objects - Field Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef FieldArgs
 * @type {Generic}
 * @prop {string} [type]
 * @prop {string} [name]
 * @prop {string} [label]
 * @prop {string} [value]
 * @prop {boolean} [required]
 * @prop {string} [width]
 * @prop {string} [widthSmall]
 * @prop {string} [widthMedium]
 * @prop {string} [widthLarge]
 * @prop {boolean} [grow]
 * @prop {string} [autoCompleteToken]
 * @prop {string} [placeholder]
 * @prop {string[]} [options]
 * @prop {number} [rows]
 * @prop {string} [emptyErrorMessage]
 * @prop {string} [invalidErrorMessage]
 * @prop {boolean} [fieldset]
 * @prop {string} [fieldsetClasses] - Back end option
 * @prop {string} [fieldClasses] - Back end option
 * @prop {string} [labelClasses] - Back end option
 * @prop {string} [classes] - Back end option
 * @prop {string} [visuallyHiddenClass] - Back end option
 * @prop {string} [radioIcon] - Back end option
 * @prop {string} [checkboxIcon] - Back end option
 * @prop {string} [selectIcon] - Back end option
 */
export interface FieldArgs extends Generic {
  type?: string
  name?: string
  label?: string
  value?: string
  required?: boolean
  width?: string
  widthSmall?: string
  widthMedium?: string
  widthLarge?: string
  grow?: boolean
  autoCompleteToken?: string
  placeholder?: string
  options?: string[]
  rows?: number
  emptyErrorMessage?: string
  invalidErrorMessage?: string
  fieldset?: boolean
  fieldsetClasses?: string
  fieldClasses?: string
  labelClasses?: string
  classes?: string
  visuallyHiddenClass?: string
  radioIcon?: string
  checkboxIcon?: string
  selectIcon?: string
}

/**
 * @typedef FieldProps
 * @type {RenderFunctionArgs}
 * @prop {FieldArgs} args
 */
export interface FieldProps<T = FieldArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: FieldArgs & T
}

/**
 * @private
 * @typedef {object} FieldOption
 * @prop {string} text
 * @prop {string} value
 * @prop {boolean} [selected]
 */
export interface FieldOption {
  text: string
  value: string
  selected?: boolean
}

/**
 * @private
 * @typedef {object} FieldCheckboxRadioArgs
 * @prop {FieldOption[]} [opts]
 * @prop {string} [name]
 * @prop {string} [classes]
 * @prop {string} [attr]
 * @prop {string} [type]
 * @prop {string} [icon]
 * @prop {string} [labelClass]
 */
export interface FieldCheckboxRadioArgs {
  opts?: FieldOption[]
  name?: string
  classes?: string
  attr?: string
  type?: string
  icon?: string
  labelClass?: string
}

/**
 * @typedef {function} FieldPropsFilter
 * @param {ContainerProps} props
 * @param {object} args
 * @param {string} args.renderType
 * @return {ContainerProps}
 */
export type FieldPropsFilter<T = FieldArgs, R = RenderItem> = (
  props: FieldProps<T, R>,
  args: {
    renderType: string
  }
) => FieldPropsFilter<T, R>
