/**
 * Contentful - Data Types
 */

/* Imports */

import type { Generic } from '../global/globalTypes.js'
import type { RenderServerlessData, RenderPreviewData } from '../render/renderTypes.js'

/**
 * @typedef {Object<string, (string|number|boolean)>} ContentfulDataParams
 */
export type ContentfulDataParams = Record<string, string | number | boolean>

/**
 * @typedef {object} ContentfulDataTag
 * @prop {object} [sys]
 * @prop {string} [sys.id]
 * @prop {string} [sys.name]
 */
export interface ContentfulDataTag {
  sys?: {
    id?: string
    name?: string
  }
}

/**
 * @typedef {object} ContentfulDataMark
 * @prop {string} type
 */
export interface ContentfulDataMark {
  type: string
}

/**
 * @typedef {object} ContentfulDataFile
 * @prop {string} [url]
 * @prop {string} [contentType]
 * @prop {string} [fileName]
 * @prop {object} [details]
 * @prop {number} [details.size]
 * @prop {object} [details.image]
 * @prop {number} [details.image.width]
 * @prop {number} [details.image.height]
 */
export interface ContentfulDataFile {
  url?: string
  contentType?: string
  fileName?: string
  details?: {
    size?: number
    image?: {
      width?: number
      height?: number
    }
  }
}

/**
 * @typedef {object} ContentfulDataFields
 * @extends {Generic}
 * @prop {ContentfulDataItem[]|ContentfulDataItem} [content]
 * @prop {ContentfulDataFile} [file]
 * @prop {ContentfulDataItem} [internalLink]
 * @prop {string} [description]
 * @prop {string} [title]
 */
export interface ContentfulDataFields extends Generic {
  content?: ContentfulDataItem[] | ContentfulDataItem
  internalLink?: ContentfulDataItem
  file?: ContentfulDataFile
  description?: string
  title?: string
}

/**
 * @typedef {object} ContentfulDataSys
 * @prop {string} [id]
 * @prop {string} [type]
 * @prop {object} [contentType]
 * @prop {object} [contentType.sys]
 * @prop {string} [contentType.sys.id]
 */
export interface ContentfulDataSys {
  id?: string
  type?: string
  contentType?: {
    sys?: {
      id?: string
    }
  }
}

/**
 * @typedef {object} ContentfulDataItem
 * @prop {string} [value]
 * @prop {string} [nodeType]
 * @prop {ContentfulDataMark[]} [marks]
 * @prop {object} [data]
 * @prop {string} [data.uri]
 * @prop {ContentfulDataItem} [data.target]
 * @prop {ContentfulDataItem[]|string} [content]
 * @prop {object} [metadata]
 * @prop {ContentfulDataTag[]} [metadata.tags]
 * @prop {ContentfulDataSys} [sys]
 * @prop {ContentfulDataFields} [fields]
 */
export interface ContentfulDataItem {
  value?: string
  nodeType?: string
  marks?: ContentfulDataMark[]
  data?: {
    uri?: string
    target?: ContentfulDataItem
  }
  content?: ContentfulDataItem[] | string
  metadata?: {
    tags?: ContentfulDataTag[]
  }
  sys?: ContentfulDataSys
  fields?: ContentfulDataFields
}

/**
 * @typedef {object} ContentfulData
 * @prop {ContentfulDataItem[]} items
 * @prop {number} total
 */
export interface ContentfulData {
  items: ContentfulDataItem[]
  total: number
}

/**
 * @typedef {object} AllContentfulDataArgs
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 */
export interface AllContentfulDataArgs {
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
}
