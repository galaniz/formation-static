/**
 * Layouts - Column Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'
import type { RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef ColumnArgs
 * @type {Generic}
 * @prop {string} [tag]
 * @prop {string} [width] - Used in getImageMaxWidth()
 * @prop {string} [widthSmall] - Used in getImageMaxWidth()
 * @prop {string} [widthMedium] - Used in getImageMaxWidth()
 * @prop {string} [widthLarge] - Used in getImageMaxWidth()
 * @prop {string} [classes] - Back end option
 * @prop {string} [style] - Back end option
 * @prop {string} [attr] - Back end option
 */
export interface ColumnArgs extends Generic {
  tag?: string
  width?: string
  widthSmall?: string
  widthMedium?: string
  widthLarge?: string
  classes?: string
  style?: string
  attr?: string
}

/**
 * @typedef ColumnProps
 * @type {RenderFunctionArgs}
 * @prop {ColumnArgs} args
 */
export interface ColumnProps<T = ColumnArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: ColumnArgs & T
}

/**
 * @typedef {object} ColumnReturn
 * @prop {string} start
 * @prop {string} end
 */
export interface ColumnReturn {
  start: string
  end: string
}

/**
 * @typedef {function} ColumnPropsFilter
 * @param {ColumnProps} props
 * @param {Object.<string, string>} args
 * @param {string} args.renderType
 * @return {Promise<ColumnProps>}
 */
export type ColumnPropsFilter<T = ColumnArgs, R = RenderItem> = (
  props: ColumnProps<T, R>,
  args: {
    renderType: string
  }
) => Promise<ColumnProps<T, R>>
