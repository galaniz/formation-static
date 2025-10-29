/**
 * Utils - Image Types
 */

/* Imports */

import type { Source, GenericNumbers, ParentArgs } from '../../global/globalTypes.js'
import type { RenderFile } from '../../render/renderTypes.js'
import type { ColumnProps } from '../../layouts/Column/ColumnTypes.js'
import type { ContainerProps } from '../../layouts/Container/ContainerTypes.js'
import type sharp from 'sharp'

/**
 * @typedef {object} ImageArgs
 * @prop {RenderFile} [data]
 * @prop {string} [classes]
 * @prop {string} [attr]
 * @prop {string} [alt='inherit']
 * @prop {string|number} [width='auto']
 * @prop {string|number} [height='auto']
 * @prop {boolean} [lazy=true]
 * @prop {boolean} [picture=false]
 * @prop {number} [quality=75]
 * @prop {Source|'remote'} [source]
 * @prop {number} [maxWidth=1200]
 * @prop {number} [viewportWidth=100]
 * @prop {string} [sizes]
 * @prop {string} [format='webp']
 * @prop {Record<string, string>} [params={fm: '%format', q: '%quality', w: '%width', h: '%height'}]
 */
export interface ImageArgs {
  data?: RenderFile
  classes?: string
  attr?: string
  alt?: string
  width?: string | number
  height?: string | number
  lazy?: boolean
  picture?: boolean
  quality?: number
  source?: Source | 'remote'
  maxWidth?: number
  viewportWidth?: number
  sizes?: string
  format?: string
  params?: Record<string, string>
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
 * @typedef {ImageReturn|string} ImageReturnType
 */
export type ImageReturnType<V extends false | true> = V extends true ? ImageReturn : string

/**
 * @typedef {ParentArgs|ColumnProps|ContainerProps} ImageSizesParents
 */
export type ImageSizesParents = ParentArgs & ColumnProps & ContainerProps

/**
 * @typedef {ParentArgs|ColumnProps|ContainerProps} ImageSizesParentsArgs
 */
export type ImageSizesParentsArgs = ParentArgs & ColumnProps<string, string | number> & ContainerProps<string, string | number>

/**
 * @typedef {object} ImageSizesArgs
 * @prop {ImageSizesParents[]} parents
 * @prop {GenericNumbers} widths
 * @prop {GenericNumbers} maxWidths
 * @prop {number[]} breakpoints
 * @prop {Source} [source]
 * @prop {number} [viewportWidth=100]
 */
export interface ImageSizesArgs<T = ImageSizesParents> {
  parents: T[]
  widths: GenericNumbers
  maxWidths: GenericNumbers
  breakpoints: number[]
  source?: Source
  viewportWidth?: number
}

/**
 * @typedef {object} ImageSizesReturn
 * @prop {number} maxWidth
 * @prop {string} sizes
 */
export interface ImageSizesReturn {
  maxWidth: number
  sizes: string
}

/**
 * @typedef {object} ImageLocal
 * @prop {Sharp} instance
 * @prop {number} size
 * @prop {string} format
 * @prop {string} path
 * @prop {string} newPath
 */
export interface ImageLocal {
  instance: sharp.Sharp
  size: number
  format: string
  path: string
  newPath: string
}

/**
 * @typedef {object} ImageRemote
 * @prop {string} path
 * @prop {string} url
 * @prop {string} [format]
 */
export interface ImageRemote {
  path: string
  url: string
  format?: string
}

/**
 * @typedef {object} ImageProps
 * @prop {string} path
 * @prop {string} name
 * @prop {string} type
 * @prop {string} format
 * @prop {number} width
 * @prop {number} height
 * @prop {number} size
 */
export interface ImageProps {
  path: string
  name: string
  type: string
  format: string
  width: number
  height: number
  size: number
}
