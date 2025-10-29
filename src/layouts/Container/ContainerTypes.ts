/**
 * Layouts - Container Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {object} ContainerArgs
 * @extends {Generic}
 * @prop {string} [tag='div']
 * @prop {string|number} [maxWidth] - Used in image utilities.
 * @prop {string} [layoutClasses]
 * @prop {string} [classes]
 * @prop {string} [style]
 * @prop {string} [attr]
 * @prop {boolean} [nest]
 */
export interface ContainerArgs<T = any, M = any> extends Generic { // eslint-disable-line @typescript-eslint/no-explicit-any
  tag?: string & T
  maxWidth?: (string | number) & M
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
export interface ContainerProps<A = ContainerArgs, R = RenderItem> extends RenderFunctionArgs<A, R> {
  args: ContainerArgs & A
}

/**
 * @typedef {function} ContainerPropsFilter
 * @param {ContainerProps} props
 * @return {ContainerProps}
 */
export type ContainerPropsFilter<A = ContainerArgs, R = RenderItem> = (
  props: ContainerProps<A, R>
) => ContainerProps<A, R>
