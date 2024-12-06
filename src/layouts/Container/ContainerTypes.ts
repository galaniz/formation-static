/**
 * Layouts - Container Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef ContainerArgs
 * @type {Generic}
 * @prop {string} [tag]
 * @prop {string} [maxWidth] - Used in getImageMaxWidth()
 * @prop {string} [layoutClasses] - Back end option
 * @prop {string} [classes] - Back end option
 * @prop {string} [style] - Back end option
 * @prop {string} [attr] - Back end option
 * @prop {boolean} [nest] - Back end option
 */
export interface ContainerArgs extends Generic {
  tag?: string
  maxWidth?: string
  layoutClasses?: string
  classes?: string
  style?: string
  attr?: string
  nest?: boolean
}

/**
 * @typedef ContainerProps
 * @type {RenderFunctionArgs}
 * @prop {ContainerArgs} args
 */
export interface ContainerProps<T = ContainerArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: ContainerArgs & T
}

/**
 * @typedef {function} ContainerPropsFilter
 * @param {ContainerProps} props
 * @param {object} args
 * @param {string} args.renderType
 * @return {ContainerProps}
 */
export type ContainerPropsFilter<T = ContainerArgs, R = RenderItem> = (
  props: ContainerProps<T, R>,
  args: {
    renderType: string
  }
) => ContainerProps<T, R>
