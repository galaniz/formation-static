/**
 * Utils - WordPress Data Types
 */

/* Imports */

import type { Generic, GenericStrings } from '../../global/globalTypes.js'
import type { RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {Object.<string, (string|number|boolean)>} WordPressDataParams
 */
export interface WordPressDataParams {
  [key: string]: string | number | boolean
}

/**
 * @typedef {object} WordPressDataError
 * @prop {string} code
 * @prop {string} message
 * @prop {object} data
 * @prop {number} data.status
 * @prop {GenericStrings} [data.params]
 * @prop {Generic} [data.details]
 */
export interface WordPressDataError {
  code: string
  message: string
  data: {
    status: number
    params?: GenericStrings
    details?: Generic
  }
}

/**
 * @typedef {string} WordPressStatus
 */
export type WordPressStatus =
  'publish' | 'draft' | 'future' | 'pending' | 'private' | 'trash' | 'auto-draft' | 'inherit'

/**
 * @typedef {object} WordPressRendered
 * @prop {string} rendered
 */
export interface WordPressRendered {
  rendered: string
}

/**
 * @typedef {object} WordPressRenderedProtected
 * @prop {string} rendered
 * @prop {boolean} protected
 */
export interface WordPressRenderedProtected {
  rendered: string
  protected: boolean
}

/**
 * @typedef {object} WordPressDataItem
 * @prop {number} [id]
 * @prop {Date} [date]
 * @prop {Date} [date_gmt]
 * @prop {WordPressDataRendered} [guid]
 * @prop {Date} [modified]
 * @prop {Date} [modified_gmt]
 * @prop {string} [slug]
 * @prop {WordPressStatus} [status]
 * @prop {string} [type]
 * @prop {string} [link]
 * @prop {WordPressRendered} [title]
 * @prop {WordPressRenderedProtected} [content]
 * @prop {WordPressRenderedProtected} [excerpt]
 * @prop {number} [author]
 * @prop {number} [featured_media]
 * @prop {number} [parent]
 * @prop {number} [menu_order]
 * @prop {string} [comment_status]
 * @prop {string} [ping_status]
 * @prop {boolean} [sticky]
 * @prop {string} [template]
 * @prop {string} [format]
 * @prop {object} [meta]
 * @prop {string} meta.footnotes
 * @prop {number[]} [categories]
 * @prop {number[]} [tags]
 * @prop {string[]} [class_list]
 */
export interface WordPressDataItem {
  id?: number
  date?: Date
  date_gmt?: Date
  guid?: WordPressRendered
  modified?: Date
  modified_gmt?: Date
  slug?: string
  status?: WordPressStatus
  type?: string
  link?: string
  title?: WordPressRendered
  content?: WordPressRenderedProtected
  excerpt?: WordPressRenderedProtected
  author?: number
  featured_media?: number
  parent?: number
  menu_order?: number
  comment_status?: string
  ping_status?: string
  sticky?: boolean
  template?: string
  format?: string
  meta?: {
    footnotes: string
  }
  categories?: number[]
  tags?: number[]
  class_list?: string[]
}

/**
 * @typedef {object} WordPressDataReturn
 * @prop {RenderItem[]} [items]
 */
export interface WordPressDataReturn {
  items?: RenderItem[]
}
