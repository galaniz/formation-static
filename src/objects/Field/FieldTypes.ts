/**
 * Objects - Field Types
 */

/**
 * @typedef {object} FieldProps
 * @prop {object} args
 * @prop {string} [args.type]
 * @prop {string} [args.name]
 * @prop {string} [args.label]
 * @prop {string} [args.value]
 * @prop {boolean} [args.required]
 * @prop {string} [args.width]
 * @prop {string} [args.widthSmall]
 * @prop {string} [args.widthMedium]
 * @prop {string} [args.widthLarge]
 * @prop {boolean} [args.grow]
 * @prop {string} [args.autoCompleteToken]
 * @prop {string} [args.placeholder]
 * @prop {string[]} [args.options]
 * @prop {number} [args.rows]
 * @prop {string} [args.emptyErrorMessage]
 * @prop {string} [args.invalidErrorMessage]
 * @prop {boolean} [args.fieldset]
 * @prop {string} [args.fieldsetClasses] - Back end option
 * @prop {string} [args.fieldClasses] - Back end option
 * @prop {string} [args.labelClasses] - Back end option
 * @prop {string} [args.classes] - Back end option
 * @prop {string} [args.visuallyHiddenClass] - Back end option
 * @prop {string} [args.radioIcon] - Back end option
 * @prop {string} [args.checkboxIcon] - Back end option
 * @prop {string} [args.selectIcon] - Back end option
 */
export interface FieldProps {
  args: {
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
    [key: string]: unknown
  }
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
 * @param {FieldProps} props
 * @param {object} args
 * @param {string} args.renderType
 * @return {Promise<FieldProps>}
 */
export type FieldPropsFilter = (props: FieldProps, args: { renderType: string }) => Promise<FieldProps>
