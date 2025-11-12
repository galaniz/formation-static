/**
 * Utils - Shortcodes Types
 */

/* Imports */

import type { RenderItem } from '../render/renderTypes.js'

/**
 * @typedef {string|number|boolean} ShortcodeAttrValue
 */
export type ShortcodeAttrValue = string | number | boolean | undefined

/**
 * @typedef {Object<string, ShortcodeAttrValue>} ShortcodeAttrs
 */
export type ShortcodeAttrs = Record<string, ShortcodeAttrValue>

/**
 * @typedef {Object<string, 'string'|'number'|'boolean'>} ShortcodeAttrTypes
 */
export type ShortcodeAttrTypes = Record<string, 'string' | 'number' | 'boolean'>

/**
 * @typedef {object} ShortcodeData
 * @prop {string} name
 * @prop {string} replaceContent
 * @prop {string} content
 * @prop {ShortcodeAtts} attr
 * @prop {ShortcodeData[]} children
 * @prop {RenderItem} [itemData]
 */
export interface ShortcodeData {
  name: string
  replaceContent: string
  content: string
  attr: ShortcodeAttrs
  children: ShortcodeData[]
  itemData?: RenderItem
}

/**
 * @typedef {function} ShortcodeCallback
 * @param {ShortcodeData} args
 * @return {string|Promise<string>}
 */
export type ShortcodeCallback = (args: ShortcodeData) => string | Promise<string>

/**
 * @typedef {object} Shortcode
 * @prop {ShortcodeCallback} callback
 * @prop {ShortcodeAttrTypes} [attrTypes]
 * @prop {string} [child]
 */
export interface Shortcode {
  callback: ShortcodeCallback
  attrTypes?: ShortcodeAttrTypes
  child?: string
}

/**
 * @typedef {Map<string, Shortcode>} Shortcodes
 */
export type Shortcodes = Map<string, Shortcode>

/**
 * @typedef {Object<string, Shortcode>} ShortcodesSet
 */
export type ShortcodesSet = Record<string, Shortcode>
