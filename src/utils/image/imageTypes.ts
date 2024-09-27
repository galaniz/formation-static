/**
 * Utils - Image Types
 */

/* Imports */

import type { GenericNumbers, ParentArgs } from '../../global/globalTypes.js'
import type { RenderFile } from '../../render/renderTypes.js'
import type { ColumnProps } from '../../layouts/Column/ColumnTypes.js'
import type { ContainerProps } from '../../layouts/Container/ContainerTypes.js'

/**
 * @typedef {object} ImageArgs
 * @prop {RenderFile} [data]
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
 * @typedef {ParentArgs|ColumnProps|ContainerProps} ImageMaxWidthParents
 */
export type ImageMaxWidthParents = ParentArgs & ColumnProps & ContainerProps

/**
 * @typedef {object} ImageMaxWidthArgs
 * @prop {ImageMaxWidthParents[]} parents
 * @prop {GenericNumbers} widths
 * @prop {GenericNumbers} maxWidths
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

/**
 * @typedef {object} ImagesSharp
 * @prop {number} size
 * @prop {string} ext
 * @prop {string} path
 * @prop {string} newPath
 */
export interface ImagesSharp {
  size: number
  ext: string
  path: string
  newPath: string
}

/**
 * @typedef {object} ImagesProps
 * @prop {string} path
 * @prop {string} name
 * @prop {string} type
 * @prop {string} format
 * @prop {number} width
 * @prop {number} height
 * @prop {number} size
 */
export interface ImagesProps {
  path: string
  name: string
  type: string
  format: string
  width: number
  height: number
  size: number
}

/**
 * @typedef {Object.<string, ImagesProps>} ImagesStore
 */
export type ImagesStore = Record<string, ImagesProps>

/**
 * @typedef {object} Images
 * @prop {string} path
 * @prop {string} url
 * @prop {string} [ext]
 */
export interface Images {
  path: string
  url: string
  ext?: string
}
