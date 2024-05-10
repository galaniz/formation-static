/**
 * Text - Rich Text Types
 */

/* Imports */

import type { InternalLink, ParentArgs } from '../../global/globalTypes'
import type { RenderRichText } from '../../render/renderTypes'

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
 * @typedef {object} RichTextProps
 * @prop {object} args
 * @prop {string} [args.tag]
 * @prop {import('../../render/renderTypes').RenderRichText[]|string} [args.content]
 * @prop {string} [args.classes]
 * @prop {string} [args.textStyle]
 * @prop {string} [args.headingStyle]
 * @prop {string} [args.caption]
 * @prop {string} [args.align]
 * @prop {string} [args.link]
 * @prop {import('../../global/globalTypes').InternalLink} [args.internalLink]
 * @prop {string} [args.style]
 * @prop {string} [args.attr]
 * @prop {boolean|string[]} [args.dataAttr=true]
 * @prop {import('../../global/globalTypes').ParentArgs} [parents]
 * @prop {RichTextHeading[]} [headings]
 */
export interface RichTextProps {
  args: {
    tag?: string
    content?: RenderRichText[] | string
    classes?: string
    textStyle?: string
    headingStyle?: string
    caption?: string
    align?: string
    link?: string
    internalLink?: InternalLink
    style?: string
    attr?: string
    dataAttr?: boolean | string[]
    [key: string]: unknown
  }
  parents?: ParentArgs[]
  headings?: RichTextHeading[]
}

/**
 * @typedef {object} RichTextContentProps
 * @prop {import('../../render/renderTypes').RenderRichText[]} content
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
 * @prop {import('../../render/renderTypes').RenderRichText} args
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
 * @param {object} args
 * @param {string} args.renderType
 * @return {Promise<RichTextProps>}
 */
export type RichTextPropsFilter = (props: RichTextProps, args: { renderType: string }) => Promise<RichTextProps>

/**
 * @typedef {function} RichTextOutputFilter
 * @param {string} output
 * @param {RichTextContentOutputFilterArgs} args
 * @return {Promise<string>}
 */
export type RichTextOutputFilter = (output: string, args: RichTextContentOutputFilterArgs) => Promise<string>

/**
 * @typedef {function} RichTextContentItemFilter
 * @param {import('../../render/renderTypes').RenderRichText} item
 * @param {RichTextProps} args
 * @return {Promise<import('../../render/renderTypes').RenderRichText>}
 */
export type RichTextContentItemFilter = (item: RenderRichText, args: RichTextProps) => Promise<RenderRichText>

/**
 * @typedef {function} RichTextContentFilter
 * @param {string} content
 * @param {RichTextContentFilterArgs} args
 * @return {Promise<string>}
 */
export type RichTextContentFilter = (content: string, args: RichTextContentFilterArgs) => Promise<string>

/**
 * @typedef {function} RichTextContentOutputFilter
 * @param {string} content
 * @param {RichTextContentFilterArgs} args
 */
export type RichTextContentOutputFilter = (content: string, args: RichTextContentFilterArgs) => Promise<string>
