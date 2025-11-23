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
export interface ExcerptArgs<T extends object> {
  excerpt?: string
  content?: T
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
export interface ExcerptContentWordArgs<T> {
  content: T
  prop?: string
  limit?: number
  _words?: string[]
}
