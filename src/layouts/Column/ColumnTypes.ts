/**
 * Layouts - Column Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {object} ColumnArgs
 * @extends {Generic}
 * @prop {string} [tag=div]
 * @prop {string|number} [width] - Used in getImageMaxWidth()
 * @prop {string|number} [widthSmall] - Used in getImageMaxWidth()
 * @prop {string|number} [widthMedium] - Used in getImageMaxWidth()
 * @prop {string|number} [widthLarge] - Used in getImageMaxWidth()
 * @prop {string} [classes]
 * @prop {string} [style]
 * @prop {string} [attr]
 */
export interface ColumnArgs extends Generic {
  tag?: string
  width?: string | number
  widthSmall?: string | number
  widthMedium?: string | number
  widthLarge?: string | number
  classes?: string
  style?: string
  attr?: string
}

/**
 * @typedef {object} ColumnProps
 * @extends {RenderFunctionArgs}
 * @prop {ColumnArgs} args
 */
export interface ColumnProps<T = ColumnArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: ColumnArgs & T
}

/**
 * @typedef {function} ColumnPropsFilter
 * @param {ColumnProps} props
 * @return {ColumnProps}
 */
export type ColumnPropsFilter<T = ColumnArgs, R = RenderItem> = (
  props: ColumnProps<T, R>
) => ColumnProps<T, R>
