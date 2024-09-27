/**
 * Utils - Filter Types
 */

/* Imports */

import type { GenericFunctions } from '../../global/globalTypes.js'
import type { ColumnPropsFilter } from '../../layouts/Column/ColumnTypes.js'
import type { ContainerPropsFilter } from '../../layouts/Container/ContainerTypes.js'
import type { FieldPropsFilter } from '../../objects/Field/FieldTypes.js'
import type { FormPropsFilter } from '../../objects/Form/FormTypes.js'
import type {
  RichTextPropsFilter,
  RichTextOutputFilter,
  RichTextContentItemFilter,
  RichTextContentFilter,
  RichTextContentOutputFilter
} from '../../text/RichText/RichTextTypes.js'
import type { ContentfulDataReturn } from '../contentful/contentfulDataTypes.js'
import type { FileDataReturn } from '../fileData/fileDataTypes.js'
import type { AjaxResFilter } from '../../serverless/Ajax/AjaxTypes.js'
import type { RenderItemFilter, RenderContentFilter } from '../../render/renderTypes.js'

/**
 * @typedef {ContentfulDataReturn|FileDataReturn} CacheData
 */
type CacheData = ContentfulDataReturn | FileDataReturn

/**
 * @typedef {object} CacheDataFilterArgs
 * @prop {string} key
 * @prop {string} type
 * @prop {CacheData} [data]
 */
export interface CacheDataFilterArgs {
  key: string
  type: string
  data?: CacheData
}

/**
 * @typedef {function} CacheDataFilter
 * @param {CacheData} data
 * @return {Promise<CacheData|undefined>}
 */
export type CacheDataFilter = (data: CacheData, args: CacheDataFilterArgs) => Promise<CacheData | undefined>

/**
 * @typedef {function} StoreDataFilter
 * @param {object|undefined} data
 * @param {string} type
 * @return {Promise<object|undefined>}
 */
export type StoreDataFilter = (data: object | undefined, type: string) => Promise<object | undefined>

/**
 * @typedef Filters
 * @type {GenericFunctions}
 * @prop {ColumnPropsFilter} columnProps
 * @prop {ContainerPropsFilter} containerProps
 * @prop {FieldPropsFilter} fieldProps
 * @prop {FormPropsFilter} formProps
 * @prop {RichTextPropsFilter} richTextProps
 * @prop {RichTextOutputFilter} richTextOutput
 * @prop {RichTextContentFilter} richTextContent
 * @prop {RichTextContentItemFilter} richTextContentItem
 * @prop {RichTextContentOutputFilter} richTextContentOutput
 * @prop {RenderItemFilter} renderItem
 * @prop {RenderContentFilter} renderContent
 * @prop {RenderContentFilter} renderContentStart
 * @prop {RenderContentFilter} renderContentEnd
 * @prop {AjaxResFilter} ajaxRes
 * @prop {CacheDataFilter} cacheData
 * @prop {StoreDataFilter} storeData
 */
export interface Filters extends GenericFunctions {
  columnProps: ColumnPropsFilter
  containerProps: ContainerPropsFilter
  fieldProps: FieldPropsFilter
  formProps: FormPropsFilter
  richTextProps: RichTextPropsFilter
  richTextOutput: RichTextOutputFilter
  richTextContentItem: RichTextContentItemFilter
  richTextContent: RichTextContentFilter
  richTextContentOutput: RichTextContentOutputFilter
  renderItem: RenderItemFilter
  renderContent: RenderContentFilter
  renderContentStart: RenderContentFilter
  renderContentEnd: RenderContentFilter
  ajaxRes: AjaxResFilter
  cacheData: CacheDataFilter
  storeData: StoreDataFilter
}

/**
 * @typedef FiltersFunctions
 * @type {Object.<string, function[]>}
 * @prop {ColumnPropsFilter[]} columnProps
 * @prop {ContainerPropsFilter[]} containerProps
 * @prop {FieldPropsFilter[]} fieldProps
 * @prop {FormPropsFilter[]} formProps
 * @prop {RichTextPropsFilter[]} richTextProps
 * @prop {RichTextOutputFilter[]} richTextOutput
 * @prop {RichTextContentItemFilter[]} richTextContentItem
 * @prop {RichTextContentFilter[]} richTextContent
 * @prop {RichTextContentOutputFilter[]} richTextContentOutput
 * @prop {RenderItemFilter[]} renderItem
 * @prop {RenderContentFilter[]} renderContent
 * @prop {RenderContentFilter[]} renderContentStart
 * @prop {RenderContentFilter[]} renderContentEnd
 * @prop {AjaxResFilter[]} ajaxRes
 * @prop {CacheDataFilter[]} cacheData
 * @prop {StoreDataFilter[]} storeData
 */
export interface FiltersFunctions {
  columnProps: ColumnPropsFilter[]
  containerProps: ContainerPropsFilter[]
  fieldProps: FieldPropsFilter[]
  formProps: FormPropsFilter[]
  richTextProps: RichTextPropsFilter[]
  richTextOutput: RichTextOutputFilter[]
  richTextContentItem: RichTextContentItemFilter[]
  richTextContent: RichTextContentFilter[]
  richTextContentOutput: RichTextContentOutputFilter[]
  renderItem: RenderItemFilter[]
  renderContent: RenderContentFilter[]
  renderContentStart: RenderContentFilter[]
  renderContentEnd: RenderContentFilter[]
  ajaxRes: AjaxResFilter[]
  cacheData: CacheDataFilter[]
  storeData: StoreDataFilter[]
  [key: string]: Function[]
}
