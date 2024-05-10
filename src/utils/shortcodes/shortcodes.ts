/**
 * Utils - Shortcodes
 */

/* Imports */

import type { ShortcodeAttrs, ShortcodeAttrValue, ShortcodeData, Shortcode, Shortcodes } from './shortcodesTypes'
import { isObjectStrict } from '../isObject/isObject'
import { isArrayStrict } from '../isArray/isArray'
import { isStringStrict } from '../isString/isString'
import { isFunction } from '../isFunction/isFunction'
import { isNumber } from '../isNumber/isNumber'
import { escape } from '../escape/escape'

/**
 * Store shortcode callbacks by name
 *
 * @type {import('./shortcodesTypes').Shortcodes}
 */
let shortcodes: Shortcodes = {}

/**
 * Regex for searching x="" in strings
 *
 * @private
 * @type {RegExp}
 */
const _attrReg: RegExp = /[\w-]+=".*?"/g

/**
 * Function - extract attributes and inner content from tagged strings
 *
 * @private
 * @param {string} content
 * @param {string} tagNames
 * @param {import('./shortcodesTypes').Shortcode} [props]
 * @return {import('./shortcodesTypes').ShortcodeData[]}
 */
const _getShortcodeData = (content: string, tagNames: string, props?: Partial<Shortcode>): ShortcodeData[] => {
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
    const attr = tag.match(_attrReg)

    if (isArrayStrict(attr)) {
      attr.forEach((a) => {
        const keyValue = a.split('=')

        if (isArrayStrict(keyValue) && keyValue.length === 2) {
          const key = keyValue[0]
          const value = keyValue[1]

          let val: ShortcodeAttrValue = escape(value.replace(/"/g, ''))

          if (attributeTypes !== undefined && isStringStrict(attributeTypes[key])) {
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
        }
      })
    }

    /* Content including and excluding tags */

    let replaceContent = ''
    let innerContent = ''

    const startIndex = opening.index
    const endIndex = closing.index

    if (isNumber(startIndex) && isNumber(endIndex)) {
      replaceContent = content.slice(startIndex, endIndex + closingTag.length)
      innerContent = content.slice(startIndex + tag.length, endIndex)
    }

    /* Check for children */

    let children: ShortcodeData[] = []

    const child = info.child

    if (isObjectStrict(child)) {
      children = _getShortcodeData(innerContent, child.name, child)
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
 * Function - add shortcode to shortcodes object
 *
 * @param {string} name
 * @param {import('./shortcodesTypes').Shortcode} shortcode
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
 * Function - remove shortcode from shortcodes object
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
 * Function - transform content string with shortcode callbacks
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

  const data = _getShortcodeData(content, names.join('|'))

  if (data.length === 0) {
    return content
  }

  /* Replace with shortcode content */

  let newContent = content

  for (let i = 0; i < data.length; i += 1) {
    const d = data[i]

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
 * Function - empty shortcodes object
 *
 * @return {void}
 */
const resetShortcodes = (): void => {
  shortcodes = {}
}

/**
 * Function - fill shortcodes object
 *
 * @param {import('./shortcodesTypes').Shortcodes} args
 * @return {boolean}
 */
const setShortcodes = <T extends Shortcodes>(args: T): boolean => {
  if (!isObjectStrict(args)) {
    return false
  }

  if (Object.keys(args).length === 0) {
    return false
  }

  resetShortcodes()

  Object.keys(args).forEach((a) => {
    addShortcode(a, args[a])
  })

  return true
}

/**
 * Function - remove shortcodes from string
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
