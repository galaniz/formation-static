/**
 * Utils - Excerpt
 */

/* Imports */

import type { ExcerptContentWordArgs, ExcerptArgs } from './excerptTypes.js'
import { isObject, isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { getObjectKeys } from '../object/objectKeys.js'
import { stripShortcodes } from '../shortcodes/shortcodes.js'

/**
 * Get words from object or array of content
 *
 * @private
 * @param {ExcerptContentWordArgs} args
 * @return {string[]}
 */
const _getContentWords = <T>(args: ExcerptContentWordArgs<T>): string[] => {
  const {
    content,
    prop,
    limit = 25
  } = args

  let {
    _words = []
  } = args

  const max = limit + 1
  const wordsLen = _words.length

  if (isObject(content) && wordsLen < max) {
    const addMax = max - wordsLen

    getObjectKeys(content).forEach((key) => {
      const value = content[key]

      if (key === prop && isStringStrict(value)) {
        const val = stripShortcodes(value)

        if (isStringStrict(val)) {
          let valArr = val.split(' ')

          const valArrLen = valArr.length

          if (valArrLen > addMax) {
            valArr = valArr.splice(0, addMax)
          }

          _words = _words.concat(valArr)
        }
      }

      if (isObject(value)) {
        _words = _getContentWords({
          content: value,
          prop,
          limit,
          _words
        })
      }
    })
  }

  return _words
}

/**
 * Get exercept from content and limit by words
 *
 * @param {ExcerptArgs} args
 * @return {string}
 */
const getExcerpt = <T extends object>(args: ExcerptArgs<T>): string => {
  const {
    excerpt = '',
    content = undefined,
    prop = 'content',
    limit = 25,
    limitExcerpt = false,
    more = '&hellip;'
  } = isObjectStrict(args) ? args : {}

  let output = ''

  if (isStringStrict(excerpt)) {
    output = excerpt

    if (limitExcerpt) {
      let excerptArr = excerpt.split(' ')

      const excerptLen = excerptArr.length

      if (excerptLen > limit) {
        excerptArr = excerptArr.splice(0, limit)

        output = `${excerptArr.join(' ')}${more}`
      }
    }
  } else {
    const words = _getContentWords({
      content,
      prop,
      limit
    })

    const wordsLen = words.length

    if (wordsLen > 0) {
      if (wordsLen > limit && more !== '') {
        words.pop()
      }

      output = `${words.join(' ')}${wordsLen > limit ? more : ''}`
    }
  }

  return output
}

/* Exports */

export { getExcerpt }
