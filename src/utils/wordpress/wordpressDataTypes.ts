/**
 * Utils - WordPress Data Types
 */

/* Imports */

import type { Generic, GenericStrings } from '../../global/globalTypes.js'
import type {
  RenderServerlessData,
  RenderPreviewData,
  RenderAllData,
  RenderItem
} from '../../render/renderTypes.js'

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
 * @typedef WordPressDataRichText
 * @type {RenderItem}
 * @prop {Object.<string, string>} [attrs]
 */
export type WordPressDataRichText = RenderItem & { attrs?: Record<string, string> }

/**
 * @typedef {object} WordPressDataAuthor
 * @prop {number} id
 * @prop {string} name
 * @prop {string} url
 * @prop {string} description
 * @prop {string} link
 * @prop {string} slug
 */
export interface WordPressDataAuthor {
  id: number
  name: string
  url: string
  description: string
  link: string
  slug: string
}

/**
 * @typedef {object} WordPressDataFeaturedMedia
 * @prop {number} id
 * @prop {string} source_url
 * @prop {string} alt_text
 * @prop {WordPressDataRendered} caption
 * @prop {string} media_type
 * @prop {string} mime_type
 * @prop {object} media_details
 * @prop {number} media_details.width
 * @prop {number} media_details.height
 * @prop {number} media_details.filesize
 * @prop {string} media_details.file
 * @prop {Object.<string, WordPressDataMediaSize>} media_details.sizes
 */
export interface WordPressDataFeaturedMedia {
  id: number
  source_url: string
  alt_text: string
  caption: WordPressDataRendered
  media_type: string
  mime_type: string
  media_details: {
    width: number
    height: number
    filesize: number
    file: string
    sizes: Record<string, WordPressDataMediaSize>
  }
}

/**
 * @typedef {object} WordPressDataMediaSize
 * @prop {string} source_url
 * @prop {number} width
 * @prop {number} height
 */
export interface WordPressDataMediaSize {
  source_url: string
  width: number
  height: number
}

/**
 * @typedef {object} WordPressDataTerm
 * @prop {number} id
 * @prop {string} link
 * @prop {string} name
 * @prop {string} slug
 * @prop {string} taxonomy
 */
export interface WordPressDataTerm {
  id: number
  link: string
  name: string
  slug: string
  taxonomy: string
}

/**
 * @typedef {object} WordPressDataAttachment
 * @prop {number} id
 * @prop {string} source_url
 * @prop {WordPressDataRendered} title
 * @prop {string} media_type
 * @prop {string} mime_type
 */
export interface WordPressDataAttachment {
  id: number
  source_url: string
  title: WordPressDataRendered
  media_type: string
  mime_type: string
}

/**
 * @typedef {object} WordPressDataParent
 * @prop {number} id
 * @prop {WordPressDataRendered} title
 * @prop {WordPressDataRendered} excerpt
 * @prop {string} slug
 * @prop {string} type
 * @prop {string} link
 * @prop {number} author
 * @prop {number} featured_media
 */
export interface WordPressDataParent {
  id: number
  title: WordPressDataRendered
  excerpt: WordPressDataRendered
  slug: string
  type: string
  link: string
  author: number
  featured_media: number
}

/**
 * @typedef {object} WordPressDataEmbedded
 * @prop {WordPressDataAuthor[]} [author]
 * @prop {WordPressDataParent[]} [up]
 * @prop {WordPressDataFeaturedMedia[]} ['wp:featuredmedia']
 * @prop {WordPressDataAttachment[]} ['wp:attachment']
 * @prop {WordPressDataTerm[][]} ['wp:term']
 */
export interface WordPressDataEmbedded {
  author?: WordPressDataAuthor[]
  up?: WordPressDataParent[]
  'wp:featuredmedia'?: WordPressDataFeaturedMedia[]
  'wp:attachment'?: WordPressDataAttachment[]
  'wp:term'?: WordPressDataTerm[][]
}

/**
 * @typedef {object} WordPressDataLink
 * @prop {string} href
 * @prop {string} [name]
 * @prop {boolean} [templated]
 * @prop {number} [count]
 * @prop {string} [taxonomy]
 * @prop {boolean} [embeddable]
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
 * @typedef {object} WordPressDataLinks
 * @prop {WordPressDataLink[]} self
 * @prop {WordPressDataLink[]} collection
 * @prop {WordPressDataLink[]} about
 * @prop {WordPressDataLink[]} 'version-history'
 * @prop {WordPressDataLink[]} 'wp:attachment'
 * @prop {WordPressDataLink[]} 'wp:term'
 * @prop {WordPressDataLink[]} curies
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
 * @prop {string} [source_url]
 * @prop {string} [orientation]
 */
export interface WordPressDataFileSize {
  height?: number
  width?: number
  url?: string
  source_url?: string
  orientation?: string
}

/**
 * @typedef {object} WordPressDataFile
 * @prop {string} [contentType]
 * @prop {number} [id]
 * @prop {string} [title]
 * @prop {string} [filename]
 * @prop {string} [url]
 * @prop {string} [link]
 * @prop {string} [alt]
 * @prop {string} [author]
 * @prop {string} [description]
 * @prop {string} [caption]
 * @prop {string} [name]
 * @prop {string} [status]
 * @prop {number} [uploadedTo]
 * @prop {string} [date]
 * @prop {string} [modified]
 * @prop {number} [menuOrder]
 * @prop {string} [mime]
 * @prop {string} [type]
 * @prop {string} [subtype]
 * @prop {string} [icon]
 * @prop {string} [dateFormatted]
 * @prop {object} [nonces]
 * @prop {string} nonces.update
 * @prop {string} nonces.delete
 * @prop {string} nonces.edit
 * @prop {string} [editLink]
 * @prop {boolean} [meta]
 * @prop {string} [authorName]
 * @prop {string} [authorLink]
 * @prop {number} [filesizeInBytes]
 * @prop {string} [filesizeHumanReadable]
 * @prop {string} [context]
 * @prop {number} [height]
 * @prop {number} [width]
 * @prop {string} [orientation]
 * @prop {Object.<string, WordPressDataFileSize>} [sizes]
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
 * @typedef {object} AllWordPressDataArgs
 * @prop {RenderServerlessData} [serverlessData]
 * @prop {RenderPreviewData} [previewData]
 * @prop {function} [filterData]
 * @prop {function} [filterAllData]
 */
export interface AllWordPressDataArgs {
  serverlessData?: RenderServerlessData
  previewData?: RenderPreviewData
  filterData?: (
    data: RenderItem[],
    serverlessData?: RenderServerlessData,
    previewData?: RenderPreviewData
  ) => RenderItem[]
  filterAllData?: (
    allData: RenderAllData,
    serverlessData?: RenderServerlessData,
    previewData?: RenderPreviewData
  ) => RenderAllData
}
