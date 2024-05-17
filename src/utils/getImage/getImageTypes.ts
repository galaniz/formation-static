/**
 * Utils - Get Image Types
 */

/* Imports */

import type { GenericNumbers, ParentArgs } from '../../global/globalTypes'
import type { RenderFile } from '../../render/renderTypes'
import type { ColumnProps } from '../../layouts/Column/ColumnTypes'
import type { ContainerProps } from '../../layouts/Container/ContainerTypes'

/**
 * @typedef {object} ImageArgs
 * @prop {import('../../render/renderTypes').RenderFile} [data]
 * @prop {string} [classes]
 * @prop {string} [attr]
 * @prop {string|number} [width]
 * @prop {string|number} [height]
 * @prop {boolean} [returnDetails]
 * @prop {boolean} [lazy]
 * @prop {boolean} [picture]
 * @prop {number} [quality]
 * @prop {string} [source]
 * @prop {number} [maxWidth]
 * @prop {number} [viewportWidth]
 */
export interface ImageArgs {
  data?: RenderFile
  classes?: string
  attr?: string
  width?: string | number
  height?: string | number
  returnDetails?: boolean
  lazy?: boolean
  picture?: boolean
  quality?: number
  source?: string
  maxWidth?: number
  viewportWidth?: number
}

/**
 * @typedef {object} ImageReturn
 * @prop {string} output
 * @prop {string} src
 * @prop {string} srcFallback
 * @prop {string[]} srcset
 * @prop {string} sizes
 * @prop {number} aspectRatio
 * @prop {number} naturalWidth
 * @prop {number} naturalHeight
 */
export interface ImageReturn {
  output: string
  src: string
  srcFallback: string
  srcset: string[]
  sizes: string
  aspectRatio: number
  naturalWidth: number
  naturalHeight: number
}

/**
 * @typedef {
 * import('../../global/globalTypes').ParentArgs|
 * import('../../layouts/Column/ColumnTypes').ColumnProps|
 * import('../../layouts/Container/ContainerTypes').ContainerProps
 * } ImageMaxWidthParents
 */
export type ImageMaxWidthParents = ParentArgs & ColumnProps & ContainerProps

/**
 * @typedef {object} ImageMaxWidthArgs
 * @prop {ImageMaxWidthParents[]} parents
 * @prop {import('../../global/globalTypes').GenericNumbers} widths
 * @prop {import('../../global/globalTypes').GenericNumbers} maxWidths
 * @prop {number[]} breakpoints
 * @prop {string} [source]
 */
export interface ImageMaxWidthArgs {
  parents: ImageMaxWidthParents[]
  widths: GenericNumbers
  maxWidths: GenericNumbers
  breakpoints: number[]
  source?: string
}
