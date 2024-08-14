/**
 * Utils - Link Types
 */

/* Imports */

import type { ConfigParent } from '../../config/configTypes.js'
import type { RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {object} LinkSlugArgs
 * @prop {string} [id]
 * @prop {string} slug
 * @prop {number} [page]
 * @prop {string} [contentType]
 * @prop {RenderItem} [pageData]
 * @prop {boolean} [returnParents]
 */
export interface LinkSlugArgs {
  id?: string
  slug: string
  page?: number
  contentType?: string
  pageData?: RenderItem
  returnParents?: boolean
}

/**
 * @typedef {object} LinkSlugReturn
 * @prop {string} slug
 * @prop {ConfigParent[]} parents
 */
export interface LinkSlugReturn {
  slug: string
  parents: ConfigParent[]
}

/**
 * @typedef {object} LinkShare
 * @prop {string} Facebook
 * @prop {string} X
 * @prop {string} LinkedIn
 * @prop {string} Pinterest
 * @prop {string} Reddit
 * @prop {string} Email
 */
export interface LinkShare {
  Facebook: string
  X: string
  LinkedIn: string
  Pinterest: string
  Reddit: string
  Email: string
}

/**
 * @typedef {object} LinkShareReturn
 * @prop {string} type
 * @prop {string} link
 */
export interface LinkShareReturn {
  type: string
  link: string
}
