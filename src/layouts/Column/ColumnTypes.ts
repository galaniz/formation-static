/**
 * Layouts - Column Types
 */

/* Imports */

import type { ParentArgs } from '../../global/globalTypes'

/**
 * @typedef {object} ColumnProps
 * @prop {object} args
 * @prop {string} [args.tag]
 * @prop {string} [args.width]
 * @prop {string} [args.widthSmall]
 * @prop {string} [args.widthMedium]
 * @prop {string} [args.widthLarge]
 * @prop {object} [args.widthCustom]
 * @prop {string} [args.widthCustom.class]
 * @prop {string} args.widthCustom.default
 * @prop {string} args.widthCustom.small
 * @prop {string} args.widthCustom.medium
 * @prop {string} args.widthCustom.large
 * @prop {string} [args.justify]
 * @prop {string} [args.align]
 * @prop {boolean} [args.grow]
 * @prop {string} [args.classes] - Back end option
 * @prop {string} [args.style] - Back end option
 * @prop {string} [args.attr] - Back end option
 * @prop {import('../../global/globalTypes').ParentArgs} [parents]
 */
export interface ColumnProps {
  args: {
    tag?: string
    width?: string
    widthSmall?: string
    widthMedium?: string
    widthLarge?: string
    widthCustom?: {
      class?: string
      default: string
      small: string
      medium: string
      large: string
    }
    justify?: string
    align?: string
    grow?: boolean
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
 * @prop {ColumnProps} props
 * @prop {Object.<string, string>} args
 * @prop {string} args.renderType
 * @return {Promise<ColumnProps>}
 */
export type ColumnPropsFilter = (props: ColumnProps, args: { renderType: string }) => Promise<ColumnProps>
