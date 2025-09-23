/**
 * Layouts - Column Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {object} ColumnArgs
 * @extends {Generic}
 * @prop {string} [tag='div']
 * @prop {string|number} [width] - Used in getImageMaxWidth()
 * @prop {string|number} [widthSmall] - Used in getImageMaxWidth()
 * @prop {string|number} [widthMedium] - Used in getImageMaxWidth()
 * @prop {string|number} [widthLarge] - Used in getImageMaxWidth()
 * @prop {string} [classes]
 * @prop {string} [style]
 * @prop {string} [attr]
 */
export interface ColumnArgs<T = any, W = any> extends Generic { // eslint-disable-line @typescript-eslint/no-explicit-any
  tag?: string & T
  width?: (string | number) & W
  widthSmall?: (string | number) & W
  widthMedium?: (string | number) & W
  widthLarge?: (string | number) & W
  classes?: string
  style?: string
  attr?: string
}

/**
 * @typedef {object} ColumnProps
 * @extends {RenderFunctionArgs}
 * @prop {ColumnArgs} args
 */
export interface ColumnProps<A = ColumnArgs, R = RenderItem> extends RenderFunctionArgs<A, R> {
  args: ColumnArgs & A
}

/**
 * @typedef {function} ColumnPropsFilter
 * @param {ColumnProps} props
 * @return {ColumnProps}
 */
export type ColumnPropsFilter<A = ColumnArgs, R = RenderItem> = (
  props: ColumnProps<A, R>
) => ColumnProps<A, R>
