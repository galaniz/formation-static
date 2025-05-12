/**
 * Utils - Filter Types
 */

/* Imports */

import type { GenericFunction } from '../../global/globalTypes.js'
import type { ColumnPropsFilter } from '../../layouts/Column/ColumnTypes.js'
import type { ContainerPropsFilter } from '../../layouts/Container/ContainerTypes.js'
import type { FormPropsFilter, FormFieldPropsFilter, FormOptionPropsFilter } from '../../objects/Form/FormTypes.js'
import type { AjaxResultFilter } from '../../serverless/Ajax/AjaxTypes.js'
import type { ContactResultFilter } from '../../serverless/Contact/ContactTypes.js'
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
  RenderItemDataFilter,
  RenderContentFilter,
  RenderServerlessData,
  RenderPreviewData,
  RenderAllData,
  RenderData
} from '../../render/renderTypes.js'

/**
 * @typedef {object} DataFilterArgs
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 * @prop {string} [contentType]
 */
export interface DataFilterArgs {
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
  contentType?: string
}

/**
 * @typedef {object} AllDataFilterArgs
 * @prop {string} type
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 */
export interface AllDataFilterArgs {
  type: 'contentful' | 'wordpress' | 'local'
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
}

/**
 * @typedef {function} ContentfulDataFilter
 * @param {RenderItem[]} data
 * @param {DataFilterArgs} args
 * @return {RenderItem[]}
 */
export type ContentfulDataFilter = (data: RenderItem[], args: DataFilterArgs) => RenderItem[]

/**
 * @typedef {function} WordpressDataFilter
 * @param {RenderItem[]} data
 * @param {DataFilterArgs} args
 * @return {RenderItem[]}
 */
export type WordpressDataFilter = (data: RenderItem[], args: DataFilterArgs) => RenderItem[]

/**
 * @typedef {function} LocalDataFilter
 * @param {RenderItem} data
 * @return {RenderItem}
 */
export type LocalDataFilter = (data: RenderItem) => RenderItem

/**
 * @typedef {function} AllDataFilter
 * @param {RenderAllData} allData
 * @param {AllDataFilterArgs} args
 * @return {RenderAllData}
 */
export type AllDataFilter = (allData: RenderAllData, args: AllDataFilterArgs) => RenderAllData

/**
 * @typedef {object} CacheData
 * @extends {RenderData}
 * @prop {Object<string, RenderItem>} [data]
 */
export interface CacheData extends RenderData {
  data?: Record<string, RenderItem>
}

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
 * @param {CacheDataFilterArgs} args
 * @return {Promise<CacheData|undefined>}
 */
export type CacheDataFilter = (
  data: CacheData,
  args: CacheDataFilterArgs
) => Promise<CacheData | undefined>

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
 * @typedef {Object<string, GenericFunction>} Filters
 * @prop {ColumnPropsFilter} columnProps
 * @prop {ContainerPropsFilter} containerProps
 * @prop {FormOptionPropsFilter} formOptionProps
 * @prop {FormFieldPropsFilter} formFieldProps
 * @prop {FormPropsFilter} formProps
 * @prop {RichTextPropsFilter} richTextProps
 * @prop {RichTextOutputFilter} richTextOutput
 * @prop {RichTextContentFilter} richTextContent
 * @prop {RichTextContentItemFilter} richTextContentItem
 * @prop {RichTextContentOutputFilter} richTextContentOutput
 * @prop {RenderItemFilter} renderItem
 * @prop {RenderItemDataFilter} renderItemData
 * @prop {RenderContentFilter} renderContent
 * @prop {AjaxResultFilter} ajaxResult
 * @prop {ContactResultFilter} contactResult
 * @prop {CacheDataFilter} cacheData
 * @prop {StoreDataFilter} storeData
 * @prop {ContentfulDataFilter} contentfulData
 * @prop {WordpressDataFilter} wordpressData
 * @prop {LocalDataFilter} localData
 * @prop {AllDataFilter} allData
 * @prop {LinkSlugPartsFilter} slugParts
 * @prop {LinkSlugFilter} slug
 */
export interface Filters extends Record<string, GenericFunction> {
  columnProps: ColumnPropsFilter
  containerProps: ContainerPropsFilter
  formOptionProps: FormOptionPropsFilter
  formFieldProps: FormFieldPropsFilter
  formProps: FormPropsFilter
  richTextProps: RichTextPropsFilter
  richTextOutput: RichTextOutputFilter
  richTextContentItem: RichTextContentItemFilter
  richTextContent: RichTextContentFilter
  richTextContentOutput: RichTextContentOutputFilter
  renderItem: RenderItemFilter
  renderItemData: RenderItemDataFilter
  renderContent: RenderContentFilter
  ajaxResult: AjaxResultFilter
  contactResult: ContactResultFilter
  cacheData: CacheDataFilter
  storeData: StoreDataFilter
  contentfulData: ContentfulDataFilter
  wordpressData: WordpressDataFilter
  localData: LocalDataFilter
  allData: AllDataFilter
  slugParts: LinkSlugPartsFilter
  slug: LinkSlugFilter
}

/**
 * @typedef {Map<string, Set<GenericFunction>>} FilterMap
 * @prop {Set<ColumnPropsFilter>} columnProps
 * @prop {Set<ContainerPropsFilter>} containerProps
 * @prop {Set<FormOptionPropsFilter>} formOptionProps
 * @prop {Set<FormFieldPropsFilter>} formFieldProps
 * @prop {Set<FormPropsFilter>} formProps
 * @prop {Set<RichTextPropsFilter>} richTextProps
 * @prop {Set<RichTextOutputFilter>} richTextOutput
 * @prop {Set<RichTextContentItemFilter>} richTextContentItem
 * @prop {Set<RichTextContentFilter>} richTextContent
 * @prop {Set<RichTextContentOutputFilter>} richTextContentOutput
 * @prop {Set<RenderItemFilter>} renderItem
 * @prop {Set<RenderItemDataFilter>} renderItemData
 * @prop {Set<RenderContentFilter>} renderContent
 * @prop {Set<AjaxResultFilter>} ajaxResult
 * @prop {Set<ContactResultFilter>} contactResult
 * @prop {Set<CacheDataFilter>} cacheData
 * @prop {Set<StoreDataFilter>} storeData
 * @prop {Set<ContentfulDataFilter>} contentfulData
 * @prop {Set<WordpressDataFilter>} wordpressData
 * @prop {Set<LocalDataFilter>} localData
 * @prop {Set<AllDataFilter>} allData
 * @prop {Set<LinkSlugPartsFilter>} slugParts
 * @prop {Set<LinkSlugFilter>} slug
 */
export type FilterMap = Map<string, Set<GenericFunction>> & Map<
'columnProps' |
'containerProps' |
'formOptionProps' |
'formFieldProps' |
'formProps' |
'richTextProps' |
'richTextOutput' |
'richTextContentItem' |
'richTextContent' |
'richTextContentOutput' |
'renderItem' |
'renderItemData' |
'renderContent' |
'ajaxResult' |
'contactResult' |
'cacheData' |
'storeData' |
'contentfulData' |
'wordpressData' |
'localData' |
'allData' |
'slugParts' |
'slug',
Set<
ColumnPropsFilter |
ContainerPropsFilter |
FormOptionPropsFilter |
FormFieldPropsFilter |
FormPropsFilter |
RichTextPropsFilter |
RichTextOutputFilter |
RichTextContentItemFilter |
RichTextContentFilter |
RichTextContentOutputFilter |
RenderItemFilter |
RenderItemDataFilter |
RenderContentFilter |
AjaxResultFilter |
ContactResultFilter |
CacheDataFilter |
StoreDataFilter |
ContentfulDataFilter |
WordpressDataFilter |
LocalDataFilter |
AllDataFilter |
LinkSlugPartsFilter |
LinkSlugFilter
>
>

/**
 * @typedef {*|Promise<*>} FilterReturnType
 */
export type FilterReturnType<T, V extends false | true> = V extends true ? Promise<T> : T
