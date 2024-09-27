/**
 * Utils - Shortcode Types
 */

/* Imports */

import type { GenericStrings } from '../../global/globalTypes.js'

/**
 * @typedef {string|number|boolean} ShortcodeAttrValue
 */
export type ShortcodeAttrValue = string | number | boolean | undefined

/**
 * @typedef {Object.<string, ShortcodeAttrValue>} ShortcodeAttrs
 */
export type ShortcodeAttrs = Record<string, ShortcodeAttrValue>

/**
 * @typedef {object} ShortcodeData
 * @prop {string} name
 * @prop {string} replaceContent
 * @prop {string} content
 * @prop {ShortcodeAtts} attributes
 * @prop {ShortcodeData[]} children
 */
export interface ShortcodeData {
  name: string
  replaceContent: string
  content: string
  attributes: ShortcodeAttrs
  children: ShortcodeData[]
}

/**
 * @typedef {function} ShortcodeCallback
 * @param {ShortcodeData} args
 * @return {Promise<string>}
 */
export type ShortcodeCallback = (args: ShortcodeData) => Promise<string>

/**
 * @typedef {object} Shortcode
 * @prop {string} [child]
 * @prop {string} child.name
 * @prop {GenericStrings} [child.attributeTypes]
 * @prop {GenericStrings} [attributeTypes]
 * @prop {ShortcodeCallback} callback
 */
export interface Shortcode {
  child?: {
    name: string
    attributeTypes?: GenericStrings
  }
  attributeTypes?: GenericStrings
  callback: ShortcodeCallback
}

/**
 * @typedef {Object.<string, Shortcode>} Shortcodes
 */
export type Shortcodes = Record<string, Shortcode>
