/**
 * Utils - Excerpt Types
 */

/**
 * @typedef {object} ExcerptArgs
 * @prop {string} [excerpt]
 * @prop {Generic|Generic[]} [content]
 * @prop {string} [prop='value']
 * @prop {number} [limit=25]
 * @prop {boolean} [limitExcerpt=false]
 * @prop {string} [more='&hellip;']
 */
export interface ExcerptArgs<C extends object = object> {
  excerpt?: string
  content?: C
  prop?: string
  limit?: number
  limitExcerpt?: boolean
  more?: string
}

/**
 * @typedef {object} ExcerptContentWordArgs
 * @prop {object} content
 * @prop {string} [prop='value']
 * @prop {number} [limit=25]
 * @prop {string} [more='&hellip;']
 */
export interface ExcerptContentWordArgs<C = object> {
  content: C
  prop?: string
  limit?: number
  _words?: string[]
}
