/**
 * Layouts - Container Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {object} ContainerArgs
 * @extends {Generic}
 * @prop {string} [tag=div]
 * @prop {string|number} [maxWidth] - Used in getImageMaxWidth()
 * @prop {string} [layoutClasses]
 * @prop {string} [classes]
 * @prop {string} [style]
 * @prop {string} [attr]
 * @prop {boolean} [nest]
 */
export interface ContainerArgs extends Generic {
  tag?: string
  maxWidth?: string | number
  layoutClasses?: string
  classes?: string
  style?: string
  attr?: string
  nest?: boolean
}

/**
 * @typedef {object} ContainerProps
 * @extends {RenderFunctionArgs}
 * @prop {ContainerArgs} args
 */
export interface ContainerProps<T = ContainerArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: ContainerArgs & T
}

/**
 * @typedef {function} ContainerPropsFilter
 * @param {ContainerProps} props
 * @return {ContainerProps}
 */
export type ContainerPropsFilter<T = ContainerArgs, R = RenderItem> = (
  props: ContainerProps<T, R>
) => ContainerProps<T, R>
