/**
 * Utils - Filter Types
 */

/* Imports */

import type { GenericFunctions } from '../../global/globalTypes.js'
import type { ColumnPropsFilter } from '../../layouts/Column/ColumnTypes.js'
import type { ContainerPropsFilter } from '../../layouts/Container/ContainerTypes.js'
import type { FieldPropsFilter } from '../../objects/Field/FieldTypes.js'
import type { FormPropsFilter } from '../../objects/Form/FormTypes.js'
import type { AjaxResultFilter } from '../../serverless/Ajax/AjaxTypes.js'
import type { LinkSlugPartsFilter, LinkSlugFilter } from '../link/linkTypes.js'
import type {
  RichTextPropsFilter,
  RichTextOutputFilter,
  RichTextContentItemFilter,
  RichTextContentFilter,
  RichTextContentOutputFilter
} from '../../text/RichText/RichTextTypes.js'
import type {
  RenderItem,
  RenderItemFilter,
  RenderContentFilter
} from '../../render/renderTypes.js'

/**
 * @typedef {object} CacheDataFilterArgs
 * @prop {string} key
 * @prop {string} type
 * @prop {RenderItem[]} [data]
 */
export interface CacheDataFilterArgs {
  key: string
  type: string
  data?: RenderItem[]
}

/**
 * @typedef {function} CacheDataFilter
 * @param {RenderItem[]} data
 * @return {Promise<RenderItem[]|undefined>}
 */
export type CacheDataFilter = (
  data: RenderItem[],
  args: CacheDataFilterArgs
) => Promise<RenderItem[] | undefined>

/**
 * @typedef {function} StoreDataFilter
 * @param {object|undefined} data
 * @param {string} type
 * @return {Promise<object|undefined>}
 */
export type StoreDataFilter = (
  data: object | undefined,
  type: string
) => Promise<object | undefined>

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
 * @prop {AjaxResultFilter} ajaxResult
 * @prop {CacheDataFilter} cacheData
 * @prop {StoreDataFilter} storeData
 * @prop {LinkSlugPartsFilter} slugParts
 * @prop {LinkSlugFilter} slug
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
  ajaxResult: AjaxResultFilter
  cacheData: CacheDataFilter
  storeData: StoreDataFilter
  slugParts: LinkSlugPartsFilter
  slug: LinkSlugFilter
}

/**
 * @typedef FilterMap
 * @type {Map.<string, Set<Function>>}
 * @prop {Set<ColumnPropsFilter>} columnProps
 * @prop {Set<ContainerPropsFilter>} containerProps
 * @prop {Set<FieldPropsFilter>} fieldProps
 * @prop {Set<FormPropsFilter>} formProps
 * @prop {Set<RichTextPropsFilter>} richTextProps
 * @prop {Set<RichTextOutputFilter>} richTextOutput
 * @prop {Set<RichTextContentItemFilter>} richTextContentItem
 * @prop {Set<RichTextContentFilter>} richTextContent
 * @prop {Set<RichTextContentOutputFilter>} richTextContentOutput
 * @prop {Set<RenderItemFilter>} renderItem
 * @prop {Set<RenderContentFilter>} renderContent
 * @prop {Set<AjaxResultFilter>} ajaxResult
 * @prop {Set<CacheDataFilter>} cacheData
 * @prop {Set<StoreDataFilter>} storeData
 * @prop {Set<LinkSlugPartsFilter>} slugParts
 * @prop {Set<LinkSlugFilter>} slug
 */
export type FilterMap = Map<string, Set<Function>> & Map<
'columnProps' |
'containerProps' |
'fieldProps' |
'formProps' |
'richTextProps' |
'richTextOutput' |
'richTextContentItem' |
'richTextContent' |
'richTextContentOutput' |
'renderItem' |
'renderContent' |
'ajaxResult' |
'cacheData' |
'storeData' |
'slugParts' |
'slug',
Set<
ColumnPropsFilter |
ContainerPropsFilter |
FieldPropsFilter |
FormPropsFilter |
RichTextPropsFilter |
RichTextOutputFilter |
RichTextContentItemFilter |
RichTextContentFilter |
RichTextContentOutputFilter |
RenderItemFilter |
RenderContentFilter |
AjaxResultFilter |
CacheDataFilter |
StoreDataFilter |
LinkSlugPartsFilter |
LinkSlugFilter
>
>

/**
 * @typedef {*|Promise<*>} FilterReturnType
 */
export type FilterReturnType<T, V extends false | true> = V extends true ? Promise<T> : T
