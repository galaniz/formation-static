/**
 * Layouts - Column Types
 */

/* Imports */

import type { ParentArgs } from '../../global/globalTypes.js'

/**
 * @typedef {object} ColumnProps
 * @prop {object} args
 * @prop {string} [args.tag]
 * @prop {string} [args.width] - Used in getImageMaxWidth()
 * @prop {string} [args.widthSmall] - Used in getImageMaxWidth()
 * @prop {string} [args.widthMedium] - Used in getImageMaxWidth()
 * @prop {string} [args.widthLarge] - Used in getImageMaxWidth()
 * @prop {string} [args.classes] - Back end option
 * @prop {string} [args.style] - Back end option
 * @prop {string} [args.attr] - Back end option
 * @prop {ParentArgs} [parents]
 */
export interface ColumnProps {
  args: {
    tag?: string
    width?: string
    widthSmall?: string
    widthMedium?: string
    widthLarge?: string
    classes?: string
    style?: string
    attr?: string
    [key: string]: unknown
  }
  parents?: ParentArgs[]
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
export type ColumnPropsFilter = (
  props: ColumnProps,
  args: {
    renderType: string
  }
) => Promise<ColumnProps>
