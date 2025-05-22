/**
 * Utils - Excerpt
 */

/* Imports */

import type { ExcerptContentWordArgs, ExcerptArgs } from './excerptTypes.js'
import { isObject, isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { stripShortcodes } from '../shortcode/shortcode.js'

/**
 * Words from object or array of content.
 *
 * @private
 * @param {ExcerptContentWordArgs} args
 * @return {string[]}
 */
const getContentWords = <T>(args: ExcerptContentWordArgs<T>): string[] => {
  const {
    content,
    prop,
    limit = 25
  } = args

  let { _words = [] } = args

  const max = limit + 1
  const wordsLen = _words.length

  if (isObject(content) && wordsLen < max) {
    const addMax = max - wordsLen

    for (const [key, value] of Object.entries(content)) {
      if (key === prop && isStringStrict(value)) {
        const val = stripShortcodes(value)

        if (isStringStrict(val)) {
          let valArr = val.split(' ')

          if (valArr.length > addMax) {
            valArr = valArr.slice(0, addMax)
          }

          _words = _words.concat(valArr)
        }
      }

      if (isObject(value)) {
        _words = getContentWords({
          content: value as T,
          prop,
          limit,
          _words
        })
      }
    }
  }

  return _words
}

/**
 * Excerpt from content limited by word count.
 *
 * @param {ExcerptArgs} args
 * @return {string}
 */
const getExcerpt = <T extends object>(args: ExcerptArgs<T>): string => {
  const {
    excerpt,
    content,
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
        excerptArr = excerptArr.slice(0, limit)
        output = `${excerptArr.join(' ')}${more}`
      }
    }
  } else {
    const words = getContentWords({
      content,
      prop,
      limit
    })

    const wordsLen = words.length

    if (wordsLen > 0) {
      if (wordsLen > limit && more) {
        words.pop()
      }

      output = `${words.join(' ')}${wordsLen > limit ? more : ''}`
    }
  }

  return output
}

/* Exports */

export { getExcerpt }
