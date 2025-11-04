/**
 * Contentful - Data Types
 */

/* Imports */

import type { Generic } from '../global/globalTypes.js'
import type { RenderServerlessData, RenderPreviewData } from '../render/renderTypes.js'

/**
 * @typedef {Object<string, string|number|boolean>} ContentfulDataParams
 */
export type ContentfulDataParams = Record<string, string | number | boolean>

/**
 * @typedef {object} ContentfulDataErrorSys
 * @prop {string} type
 * @prop {string} id
 */
interface ContentfulDataErrorSys {
  type: string
  id: string
}

/**
 * @typedef {object} ContentfulDataError
 * @prop {string} message
 * @prop {ContentfulDataErrorSys} sys
 */
export interface ContentfulDataError {
  message: string
  sys: ContentfulDataErrorSys
}

/**
 * @typedef {object} ContentfulData
 * @prop {ContentfulDataItem[]} items
 * @prop {number} total
 * @prop {number} limit
 * @prop {number} skip
 */
export interface ContentfulData {
  items: ContentfulDataItem[]
  total: number
  limit: number
  skip: number
}

/**
 * @typedef {object} ContentfulDataId
 * @prop {string} [id]
 */
interface ContentfulDataId {
  id?: string
}

/**
 * @typedef {object} ContentfulDataTag
 * @prop {ContentfulDataId} [sys]
 */
export interface ContentfulDataTag {
  sys?: ContentfulDataId
}

/**
 * @typedef {object} ContentfulDataMeta
 * @prop {ContentfulDataTag[]} [tags]
 */
interface ContentfulDataMeta {
  tags?: ContentfulDataTag[]
}

/**
 * @typedef {object} ContentfulDataMark
 * @prop {string} type
 */
export interface ContentfulDataMark {
  type: string
}

/**
 * @typedef {object} ContentfulDataFileImage
 * @prop {number} [width]
 * @prop {number} [height]
 */
interface ContentfulDataFileImage {
  width?: number
  height?: number
}

/**
 * @typedef {object} ContentfulDataFileDetails
 * @prop {number} [size]
 * @prop {ContentfulDataFileImage} [image]
 */
interface ContentfulDataFileDetails {
  size?: number
  image?: ContentfulDataFileImage
}

/**
 * @typedef {object} ContentfulDataFile
 * @prop {string} [url]
 * @prop {string} [contentType]
 * @prop {string} [fileName]
 * @prop {ContentfulDataFileDetails} [details]
 */
export interface ContentfulDataFile {
  url?: string
  contentType?: string
  fileName?: string
  details?: ContentfulDataFileDetails
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
 * @typedef {object} ContentfulDataSysType
 * @prop {ContentfulDataId} [sys]
 */
interface ContentfulDataSysType {
  sys?: ContentfulDataId
}

/**
 * @typedef {object} ContentfulDataSys
 * @prop {string} [id]
 * @prop {string} [type]
 * @prop {string} [locale]
 * @prop {ContentfulDataSysType} [contentType]
 */
export interface ContentfulDataSys {
  id?: string
  type?: string
  locale?: string
  contentType?: ContentfulDataSysType
}

/**
 * @typedef {object} ContentfulDataDatum
 * @prop {string} [uri]
 * @prop {ContentfulDataItem} [target]
 */
interface ContentfulDataDatum {
  uri?: string
  target?: ContentfulDataItem
}

/**
 * @typedef {object} ContentfulDataItem
 * @prop {string} [value]
 * @prop {string} [nodeType]
 * @prop {ContentfulDataMark[]} [marks]
 * @prop {ContentfulDataDatum} [data]
 * @prop {ContentfulDataItem[]|string} [content]
 * @prop {ContentfulDataMeta} [metadata]
 * @prop {ContentfulDataSys} [sys]
 * @prop {ContentfulDataFields} [fields]
 */
export interface ContentfulDataItem {
  value?: string
  nodeType?: string
  marks?: ContentfulDataMark[]
  data?: ContentfulDataDatum
  content?: ContentfulDataItem[] | string
  metadata?: ContentfulDataMeta
  sys?: ContentfulDataSys
  fields?: ContentfulDataFields
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
