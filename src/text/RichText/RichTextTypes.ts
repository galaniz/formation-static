/**
 * Text - Rich Text Types
 */

/* Imports */

import type { InternalLink, Generic, GenericStrings } from '../../global/globalTypes.js'
import type { RenderRichText, RenderFunctionArgs, RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {object} RichTextHeading
 * @prop {string} title
 * @prop {string} id
 * @prop {string} type
 */
export interface RichTextHeading {
  title: string
  id: string
  type: string
}

/**
 * @typedef {object} RichTextElement
 * @prop {string} opening
 * @prop {string} content
 * @prop {string} closing
 */
export interface RichTextElement {
  opening: string
  content: string
  closing: string
}

/**
 * @typedef RichTextArgs
 * @type {Generic}
 * @prop {string} [tag]
 * @prop {RenderRichText[]|string} [content]
 * @prop {string} [classes]
 * @prop {string} [textStyle]
 * @prop {string} [headingStyle]
 * @prop {RenderRichText[]|string} [caption]
 * @prop {string} [align]
 * @prop {string} [link]
 * @prop {InternalLink} [internalLink]
 * @prop {string} [style]
 * @prop {string|GenericStrings} [attr]
 * @prop {boolean|string[]} [dataAttr=true]
 */
export interface RichTextArgs extends Generic {
  tag?: string
  content?: RenderRichText[] | string
  classes?: string
  textStyle?: string
  headingStyle?: string
  caption?: RenderRichText[] | string
  align?: string
  link?: string
  internalLink?: InternalLink
  style?: string
  attr?: string | GenericStrings
  dataAttr?: boolean | string[]
}

/**
 * @typedef RichTextContent
 * @type {Generic}
 * @prop {RenderRichText[]|string} [content]
 */
export interface RichTextContent extends Generic {
  content?: RenderRichText[] | string
}

/**
 * @typedef RichTextProps
 * @type {RenderFunctionArgs}
 * @prop {RichTextArgs} args
 */
export interface RichTextProps<T = RichTextArgs, R = RenderItem> extends RenderFunctionArgs<T, R> {
  args: RichTextArgs & T
}

/**
 * @typedef {object} RichTextContentProps
 * @prop {RenderRichText[]} content
 * @prop {RichTextProps} props
 * @prop {boolean|string[]} dataAttr
 * @prop {string} [_output]
 */
export interface RichTextContentProps {
  content: RenderRichText[]
  props: RichTextProps
  dataAttr: boolean | string[]
  _output?: string
}

/**
 * @typedef {object} RichTextContentFilterArgs
 * @prop {RenderRichText} args
 * @prop {RichTextProps} props
 */
export interface RichTextContentFilterArgs {
  args: RenderRichText
  props: RichTextProps
}

/**
 * @typedef RichTextContentOutputFilterArgs
 * @type {RichTextContentFilterArgs}
 * @prop {RichTextElement} element
 */
export interface RichTextContentOutputFilterArgs extends RichTextContentFilterArgs {
  element: RichTextElement
}

/**
 * @typedef RichTextOutputFilterArgs
 * @prop {RichTextProps} props
 * @prop {RichTextElement} element
 */
export interface RichTextOutputFilterArgs {
  props: RichTextProps
  element: RichTextElement
}

/**
 * @typedef {function} RichTextPropsFilter
 * @param {RichTextProps} props
 * @return {RichTextProps}
 */
export type RichTextPropsFilter = (props: RichTextProps) => RichTextProps

/**
 * @typedef {function} RichTextOutputFilter
 * @param {string} output
 * @param {RichTextContentOutputFilterArgs} args
 * @return {string}
 */
export type RichTextOutputFilter = (output: string, args: RichTextContentOutputFilterArgs) => string

/**
 * @typedef {function} RichTextContentItemFilter
 * @param {RenderRichText} item
 * @param {RichTextProps} args
 * @return {RenderRichText}
 */
export type RichTextContentItemFilter = (item: RenderRichText, args: RichTextProps) => RenderRichText

/**
 * @typedef {function} RichTextContentFilter
 * @param {string} content
 * @param {RichTextContentFilterArgs} args
 * @return {string}
 */
export type RichTextContentFilter = (content: string, args: RichTextContentFilterArgs) => string

/**
 * @typedef {function} RichTextContentOutputFilter
 * @param {string} content
 * @param {RichTextContentFilterArgs} args
 * @return {string}
 */
export type RichTextContentOutputFilter = (content: string, args: RichTextContentOutputFilterArgs) => string
