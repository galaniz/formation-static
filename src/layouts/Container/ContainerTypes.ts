/**
 * Layouts - Container Types
 */

/* Imports */

import type { ParentArgs } from '../../global/globalTypes.js'

/**
 * @typedef {object} ContainerProps
 * @prop {object} args
 * @prop {string} [args.tag]
 * @prop {string} [args.maxWidth] - Used in getImageMaxWidth()
 * @prop {string} [args.layoutClasses] - Back end option
 * @prop {string} [args.classes] - Back end option
 * @prop {string} [args.style] - Back end option
 * @prop {string} [args.attr] - Back end option
 * @prop {boolean} [args.nest] - Back end option
 * @prop {ParentArgs} [parents]
 */
export interface ContainerProps {
  args: {
    tag?: string
    maxWidth?: string
    layoutClasses?: string
    classes?: string
    style?: string
    attr?: string
    nest?: boolean
    [key: string]: unknown
  }
  parents?: ParentArgs[]
}

/**
 * @typedef {object} ContainerReturn
 * @prop {string} start
 * @prop {string} end
 */
export interface ContainerReturn {
  start: string
  end: string
}

/**
 * @typedef {function} ContainerPropsFilter
 * @param {ContainerProps} props
 * @param {object} args
 * @param {string} args.renderType
 * @return {Promise<ContainerProps>}
 */
export type ContainerPropsFilter = (
  props: ContainerProps,
  args: {
    renderType: string
  }
) => Promise<ContainerProps>
