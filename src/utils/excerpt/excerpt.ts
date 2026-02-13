/**
 * Utils - Excerpt
 */

/* Imports */

import type { ExcerptContentWordArgs, ExcerptArgs } from './excerptTypes.js'
import { isObject, isObjectStrict } from '../object/object.js'
import { isStringStrict } from '../string/string.js'
import { stripShortcodes } from '../../shortcodes/shortcodes.js'

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
  const wordsCount = _words.length

  if (isObject(content) && wordsCount < max) {
    const addMax = max - wordsCount

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

      const excerptCount = excerptArr.length

      if (excerptCount > limit) {
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

    const wordsCount = words.length

    if (wordsCount > 0) {
      if (wordsCount > limit && more) {
        words.pop()
      }

      output = `${words.join(' ')}${wordsCount > limit ? more : ''}`
    }
  }

  return output
}

/* Exports */

export { getExcerpt }
