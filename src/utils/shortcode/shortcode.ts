/**
 * Utils - Shortcode
 */

/* Imports */

import type {
  ShortcodeAttrs,
  ShortcodeAttrValue,
  ShortcodeData,
  Shortcode,
  Shortcodes
} from './shortcodeTypes.js'
import { isObjectStrict } from '../object/object.js'
import { isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { isFunction } from '../function/function.js'
import { isNumber } from '../number/number.js'
import { escape } from '../escape/escape.js'

/**
 * Store shortcode callbacks by name
 *
 * @type {Shortcodes}
 */
let shortcodes: Shortcodes = {}

/**
 * Regex for searching x="" in strings
 *
 * @private
 * @type {RegExp}
 */
const attrReg: RegExp = /[\w-]+=".*?"/g

/**
 * Extract attributes and inner content from tagged strings
 *
 * @private
 * @param {string} content
 * @param {string} tagNames
 * @param {Shortcode} [props]
 * @return {ShortcodeData[]}
 */
const getShortcodeData = (content: string, tagNames: string, props?: Partial<Shortcode>): ShortcodeData[] => {
  /* Content and tag names required */

  if (!isStringStrict(content) || !isStringStrict(tagNames)) {
    return []
  }

  /* Search tags in content */

  const reg = new RegExp(String.raw`\[\/?(?<name>${tagNames})[^\]]*?\]`, 'g')
  const matches = [...content.matchAll(reg)]

  if (matches.length === 0) {
    return []
  }

  /* Store data items */

  const data: ShortcodeData[] = []

  /* Recurse matches */

  matches.forEach((opening) => {
    /* Name required */

    const name = opening?.groups?.name

    if (!isStringStrict(name)) {
      return
    }

    /* Skip closing tag */

    const tag = opening[0]

    if (tag.slice(0, 2) === '[/') {
      return
    }

    /* Corresponding closing tag required */

    const closingTag = `[/${name}]`
    const closingIndex = matches.findIndex((m) => m[0] === closingTag)

    if (closingIndex === -1) {
      return
    }

    const closingArr = matches.splice(closingIndex, 1)
    const closing = closingArr[0]

    /* Shortcode info */

    const info = props === undefined ? shortcodes[name] : props

    if (info === undefined) {
      return
    }

    /* Attributes from opening tag */

    const attributes: ShortcodeAttrs = {}
    const attributeTypes = isObjectStrict(info.attributeTypes) ? info.attributeTypes : {}
    const attr = tag.match(attrReg)

    if (isArrayStrict(attr)) {
      attr.forEach((a) => {
        const [key, value] = a.split('=')

        if (key === undefined || value === undefined) {
          return
        }

        let val: ShortcodeAttrValue = escape(value.replace(/"/g, ''))

        if (isStringStrict(attributeTypes[key])) {
          const type = attributeTypes[key]

          if (type === 'number') {
            const num = parseInt(val, 10)

            val = isNaN(num) ? 0 : num
          }

          if (type === 'boolean') {
            val = val === 'true'
          }
        }

        attributes[key] = val
      })
    }

    /* Content including and excluding tags */

    let replaceContent = ''
    let innerContent = ''

    const startIndex = opening.index
    const endIndex = closing?.index

    if (isNumber(startIndex) && isNumber(endIndex)) {
      replaceContent = content.slice(startIndex, endIndex + closingTag.length)
      innerContent = content.slice(startIndex + tag.length, endIndex)
    }

    /* Check for children */

    let children: ShortcodeData[] = []

    const child = info.child

    if (isObjectStrict(child)) {
      children = getShortcodeData(innerContent, child.name, child)
    }

    /* Add data */

    data.push({
      name,
      replaceContent,
      content: innerContent,
      attributes,
      children
    })
  })

  /* Output */

  return data
}

/**
 * Add shortcode to shortcodes object
 *
 * @param {string} name
 * @param {Shortcode} shortcode
 * @return {boolean}
 */
const addShortcode = <T extends Shortcode>(name: string, shortcode: T): boolean => {
  if (!isStringStrict(name) || !isObjectStrict(shortcode)) {
    return false
  }

  shortcodes[name] = shortcode

  return true
}

/**
 * Remove shortcode from shortcodes object
 *
 * @param {string} name
 * @return {boolean}
 */
const removeShortcode = (name: string): boolean => {
  if (!isStringStrict(name)) {
    return false
  }

  if (shortcodes[name] === undefined) {
    return false
  }

  // @ts-expect-error: Type 'undefined' is not assignable to type 'Shortcode'
  shortcodes[name] = undefined

  return true
}

/**
 * Transform content string with shortcode callbacks
 *
 * @param {string} content
 * @return {Promise<string>}
 */
const doShortcodes = async (content: string): Promise<string> => {
  /* Check if any shortcodes */

  const names = Object.keys(shortcodes)

  if (names.length === 0) {
    return content
  }

  /* Get data */

  const data = getShortcodeData(content, names.join('|'))

  if (data.length === 0) {
    return content
  }

  /* Replace with shortcode content */

  let newContent = content

  for (const d of data) {
    const { name, replaceContent } = d
    const callback = shortcodes?.[name]?.callback

    if (isFunction(callback)) {
      const res = await callback(d)

      if (isStringStrict(res)) {
        newContent = newContent.replace(replaceContent, res)
      }
    }
  }

  return newContent
}

/**
 * Empty shortcodes object
 *
 * @return {void}
 */
const resetShortcodes = (): void => {
  shortcodes = {}
}

/**
 * Fill shortcodes object
 *
 * @param {Shortcodes} args
 * @return {boolean}
 */
const setShortcodes = <T extends Shortcodes>(args: T): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  const names = Object.keys(args)

  if (names.length === 0) {
    return false
  }

  resetShortcodes()

  names.forEach((n) => {
    const shortcode = args[n]

    if (shortcode === undefined) {
      return
    }

    addShortcode(n, shortcode)
  })

  return true
}

/**
 * Remove shortcodes from string
 *
 * @param {string} content
 * @return {string}
 */
const stripShortcodes = (content: string): string => {
  /* Check if any shortcodes */

  const names = Object.keys(shortcodes)

  if (names.length === 0) {
    return content
  }

  /* Replace tags with empty strings */

  return content.replace(String.raw`/\[\/?(?:${names.join('|')})[^\]]*?\]/g`, '')
}

/* Exports */

export {
  addShortcode,
  removeShortcode,
  doShortcodes,
  resetShortcodes,
  setShortcodes,
  stripShortcodes
}
