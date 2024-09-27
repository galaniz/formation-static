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
 * @typedef {string} WordPressDataStatus
 */
export type WordPressDataStatus =
  'publish' | 'draft' | 'future' | 'pending' | 'private' | 'trash' | 'auto-draft' | 'inherit'

/**
 * @typedef {object} WordPressDataRendered
 * @prop {string} rendered
 */
export interface WordPressDataRendered {
  rendered: string
}

/**
 * @typedef {object} WordPressDataRenderedProtected
 * @prop {string} rendered
 * @prop {boolean} protected
 */
export interface WordPressDataRenderedProtected {
  rendered: string
  protected: boolean
}

/**
 * @typedef {object} WordPressDataAuthor
 */
export interface WordPressDataAuthor {
  id: number
  name: string
  avatar_urls: {
    [key: string]: string
  }
}

export interface WordPressDataFeaturedMedia {
  id: number
  source_url: string
  alt_text: string
  media_details: {
    sizes: {
      [key: string]: WordPressDataMediaSize
    }
  }
}

export interface WordPressDataMediaSize {
  source_url: string
  width: number
  height: number
}

export interface WordPressDataTerm {
  id: number
  link: string
  name: string
  slug: string
  taxonomy: string
}

export interface WordPressDataAttachment {
  id: number
  source_url: string
  title: {
    rendered: string
  }
  media_type: string
  mime_type: string
}

/**
 * @typedef {object} WordPressDataParent
 * @prop {number} id
 * @prop {WordPressDataRendered} title
 * @prop {string} link
 */
export interface WordPressDataParent {
  id: number
  title: {
    rendered: string
  }
  link: string
}

/**
 * @typedef {object} WordPressDataEmbedded
 * @prop {WordPressDataAuthor[]} [author]
 * @prop {WordPressDataFeaturedMedia[]} ['wp:featuredmedia']
 * @prop {WordPressDataTerm[][]} ['wp:term']
 * @prop {WordPressDataAttachment[]} ['wp:attachment']
 * @prop {WordPressDataParent[]} ['wp:parent']
 */
export interface WordPressDataEmbedded {
  author?: WordPressDataAuthor[]
  'wp:featuredmedia'?: WordPressDataFeaturedMedia[]
  'wp:term'?: WordPressDataTerm[][]
  'wp:attachment'?: WordPressDataAttachment[]
  'wp:parent'?: WordPressDataParent[]
}

/**
 *
 */
export interface WordPressDataLink {
  href: string
  name?: string
  templated?: boolean
  count?: number
  taxonomy?: string
  embeddable?: boolean
}

/**
 *
 */
export interface WordPressDataLinks {
  self: WordPressDataLink[]
  collection: WordPressDataLink[]
  about: WordPressDataLink[]
  'version-history': WordPressDataLink[]
  'wp:attachment': WordPressDataLink[]
  'wp:term': WordPressDataLink[]
  curies: WordPressDataLink[]
}

/**
 * @typedef {object} WordPressDataFileSize
 * @prop {number} [height]
 * @prop {number} [width]
 * @prop {string} [url]
 * @prop {string} [orientation]
 */
export interface WordPressDataFileSize {
  height?: number
  width?: number
  url?: string
  orientation?: string
}

/**
 * @typedef {object} WordPressDataFile
 * @prop {string} [contentType]
 */
export interface WordPressDataFile {
  contentType?: string
  id?: number
  title?: string
  filename?: string
  url?: string
  link?: string
  alt?: string
  author?: string
  description?: string
  caption?: string
  name?: string
  status?: string
  uploadedTo?: number
  date?: string
  modified?: string
  menuOrder?: number
  mime?: string
  type?: string
  subtype?: string
  icon?: string
  dateFormatted?: string
  nonces?: {
    update: string
    delete: string
    edit: string
  }
  editLink?: string
  meta?: boolean
  authorName?: string
  authorLink?: string
  filesizeInBytes?: number
  filesizeHumanReadable?: string
  context?: string
  height?: number
  width?: number
  orientation?: string
  sizes?: Record<string, WordPressDataFileSize>
}

/**
 * @typedef {object} WordPressDataItem
 * @prop {number} [id]
 * @prop {string} [date]
 * @prop {string} [date_gmt]
 * @prop {WordPressDataRendered} [guid]
 * @prop {string} [modified]
 * @prop {string} [modified_gmt]
 * @prop {string} [slug]
 * @prop {WordPressDataStatus} [status]
 * @prop {string} [type]
 * @prop {string} [link]
 * @prop {WordPressDataRendered} [title]
 * @prop {WordPressDataRenderedProtected} [content]
 * @prop {WordPressDataRenderedProtected} [excerpt]
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
 * @prop {WordPressDataLinks} [_links]
 * @prop {WordPressDataEmbedded} [_embedded]
 */
export interface WordPressDataItem extends Generic {
  id?: number
  date?: string
  date_gmt?: string
  guid?: WordPressDataRendered
  modified?: string
  modified_gmt?: string
  slug?: string
  status?: WordPressDataStatus
  type?: string
  link?: string
  title?: WordPressDataRendered
  content?: WordPressDataRenderedProtected
  excerpt?: WordPressDataRenderedProtected
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
  _links?: WordPressDataLinks
  _embedded?: WordPressDataEmbedded
}

/**
 * @typedef {object} WordPressDataReturn
 * @prop {RenderItem[]} [items]
 */
export interface WordPressDataReturn {
  items?: RenderItem[]
}
