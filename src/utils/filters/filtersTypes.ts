/**
 * Utils - Filters Types
 */

/* Imports */

import type { GenericFunctions } from '../../global/globalTypes'
import type { ColumnPropsFilter } from '../../layouts/Column/ColumnTypes'
import type { ContainerPropsFilter } from '../../layouts/Container/ContainerTypes'
import type { FieldPropsFilter } from '../../objects/Field/FieldTypes'
import type { FormPropsFilter } from '../../objects/Form/FormTypes'
import type {
  RichTextPropsFilter,
  RichTextOutputFilter,
  RichTextContentItemFilter,
  RichTextContentFilter,
  RichTextContentOutputFilter
} from '../../text/RichText/RichTextTypes'
import type { ContentfulDataReturn } from '../getContentfulData/getContentfulDataTypes'
import type { FileDataReturn } from '../getFileData/getFileDataTypes'
import type { AjaxResFilter } from '../../serverless/Ajax/AjaxTypes'
import type { RenderItemFilter, RenderContentFilter } from '../../render/renderTypes'

/**
 * @typedef {
 * import('../getContentfulData/getContentfulDataTypes').ContentfulDataReturn|
 * import('../getFileData/getFileDataTypes').FileDataReturn
 * } CacheData
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
 * @type {import('../../global/globalTypes').GenericFunctions}
 * @prop {import('../../layouts/Column/ColumnTypes').ColumnPropsFilter} columnProps
 * @prop {import('../../layouts/Container/ContainerTypes').ContainerPropsFilter} containerProps
 * @prop {import('../../objects/Field/FieldTypes').FieldPropsFilter} fieldProps
 * @prop {import('../../objects/Form/FormTypes').FormPropsFilter} formProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextPropsFilter} richTextProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextOutputFilter} richTextOutput
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentFilter} richTextContent
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentItemFilter} richTextContentItem
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentOutputFilter} richTextContentOutput
 * @prop {import('../../render/RenderTypes').RenderItemFilter} renderItem
 * @prop {import('../../render/RenderTypes').RenderContentFilter} renderContent
 * @prop {import('../../render/RenderTypes').RenderContentFilter} renderContentStart
 * @prop {import('../../render/RenderTypes').RenderContentFilter} renderContentEnd
 * @prop {import('../../serverless/Ajax/AjaxTypes').AjaxResFilter} ajaxRes
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
 * @prop {import('../../layouts/Column/ColumnTypes').ColumnPropsFilter[]} columnProps
 * @prop {import('../../layouts/Container/ContainerTypes').ContainerPropsFilter[]} containerProps
 * @prop {import('../../objects/Field/FieldTypes').FieldPropsFilter[]} fieldProps
 * @prop {import('../../objects/Form/FormTypes').FormPropsFilter[]} formProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextPropsFilter[]} richTextProps
 * @prop {import('../../text/RichText/RichTextTypes').RichTextOutputFilter[]} richTextOutput
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentItemFilter[]} richTextContentItem
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentFilter[]} richTextContent
 * @prop {import('../../text/RichText/RichTextTypes').RichTextContentOutputFilter[]} richTextContentOutput
 * @prop {import('../../render/RenderTypes').RenderItemFilter[]} renderItem
 * @prop {import('../../render/RenderTypes').RenderContentFilter[]} renderContent
 * @prop {import('../../render/RenderTypes').RenderContentFilter[]} renderContentStart
 * @prop {import('../../render/RenderTypes').RenderContentFilter[]} renderContentEnd
 * @prop {import('../../serverless/Ajax/AjaxTypes').AjaxResFilter[]} ajaxRes
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
