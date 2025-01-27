/**
 * Utils - Shortcode
 */

/* Imports */

import type {
  ShortcodeAttrs,
  ShortcodeAttrValue,
  ShortcodeData,
  Shortcode,
  Shortcodes,
  ShortcodesSet
} from './shortcodeTypes.js'
import { isObjectStrict } from '../object/object.js'
import { isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { isFunction } from '../function/function.js'
import { isNumber } from '../number/number.js'
import { escape } from '../escape/escape.js'

/**
 * Shortcode callbacks by name
 *
 * @type {Shortcodes}
 */
const shortcodes: Shortcodes = new Map()

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
const getShortcodeData = (
  content: string,
  tagNames: string,
  props?: Partial<Shortcode>
): ShortcodeData[] => {
  /* Content and tag names required */

  if (!isStringStrict(content) || !isStringStrict(tagNames)) {
    return []
  }

  /* Search tags in content */

  const reg = new RegExp(String.raw`\[(?:\/)?(?<name>${tagNames})(?:\s[^\]]*?)?\]`, 'g')
  const matches = [...content.matchAll(reg)]

  if (matches.length === 0) {
    return []
  }

  /* Data items */

  const data: ShortcodeData[] = []

  /* Recurse matches */

  matches.forEach((opening, i) => {
    /* Name and opening tag required */

    const name = opening.groups?.name
    const tag = opening[0]

    if (!isStringStrict(name) || tag.startsWith('[/')) {
      return
    }

    /* Shortcode info */

    const info = props != null ? props : shortcodes.get(name)

    if (!isObjectStrict(info)) {
      return
    }

    const child = info.child
    const hasChild = isStringStrict(child)

    /* Indexes */

    const startIndex = opening.index
    const startLen = tag.length

    let endIndex = startIndex + tag.length
    let endLen = 0

    /* Closing tag */

    const closingTag = `[/${name}]`
    const closingMatch = hasChild ? matches.find((m) => m[0] === closingTag) : matches[i + 1]

    if (closingMatch?.[0] === closingTag) {
      endIndex = closingMatch.index
      endLen = closingTag.length
    }

    /* Attributes from opening tag */

    const attributes: ShortcodeAttrs = {}
    const attributeTypes = isObjectStrict(info.attributeTypes) ? info.attributeTypes : {}
    const attr = tag.match(attrReg)

    if (isArrayStrict(attr)) {
      attr.forEach((a) => {
        const [key, value] = a.split('=')

        if (!isStringStrict(key) || !isStringStrict(value)) {
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

    if (isNumber(startIndex) && isNumber(endIndex)) {
      replaceContent = content.slice(startIndex, endIndex + endLen)
      innerContent = content.slice(startIndex + startLen, endIndex)
    }

    /* Handle nested shortcodes */

    let children: ShortcodeData[] = []

    if (hasChild) {
      children = getShortcodeData(innerContent, child)
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
 * Add shortcode to shortcodes map
 *
 * @param {string} name
 * @param {Shortcode} shortcode
 * @return {boolean}
 */
const addShortcode = <T extends Shortcode>(name: string, shortcode: T): boolean => {  // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
  if (!isStringStrict(name) || !isObjectStrict(shortcode)) {
    return false
  }

  shortcodes.set(name, shortcode)

  return true
}

/**
 * Remove shortcode from shortcodes map
 *
 * @param {string} name
 * @return {boolean}
 */
const removeShortcode = (name: string): boolean => {
  if (!isStringStrict(name)) {
    return false
  }

  return shortcodes.delete(name)
}

/**
 * Transform content string with shortcode callbacks
 *
 * @param {string} content
 * @return {Promise<string>}
 */
const doShortcodes = async (content: string): Promise<string> => {
  /* Check if any shortcodes */

  if (shortcodes.size === 0) {
    return content
  }

  /* Get data */

  const names = [...shortcodes.keys()].join('|')
  const data = getShortcodeData(content, names)

  if (data.length === 0) {
    return content
  }

  /* Replace with shortcode content */

  let newContent = content

  for (const d of data) {
    const { name, replaceContent } = d
    const callback = shortcodes.get(name)?.callback

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
 * Empty shortcodes map
 *
 * @return {void}
 */
const resetShortcodes = (): void => {
  shortcodes.clear()
}

/**
 * Fill shortcodes map
 *
 * @param {ShortcodesSet} args
 * @return {boolean}
 */
const setShortcodes = <T extends ShortcodesSet>(args: T): boolean => {  // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
  if (!isObjectStrict(args)) {
    return false
  }

  const names = Object.entries(args)

  if (names.length === 0) {
    return false
  }

  resetShortcodes()

  names.forEach(([name, shortcode]) => {
    addShortcode(name, shortcode)
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

  if (shortcodes.size === 0) {
    return content
  }

  /* Replace tags with empty strings */

  const names = [...shortcodes.keys()].join('|')
  const reg = new RegExp(String.raw`\[(?:\/)?(?<name>${names})(?:\s[^\]]*?)?\]`, 'g')

  return content.replace(reg, () => '')
}

/* Exports */

export {
  shortcodes,
  addShortcode,
  removeShortcode,
  doShortcodes,
  resetShortcodes,
  setShortcodes,
  stripShortcodes
}
