/**
 * Utils - Get Slug Types
 */

/* Imports */

import type { ConfigParent } from '../../config/configTypes'
import type { RenderItem } from '../../render/renderTypes'

/**
 * @typedef {object} SlugArgs
 * @prop {string} [id]
 * @prop {string} slug
 * @prop {number} [page]
 * @prop {string} [contentType]
 * @prop {import('../../render/renderTypes').RenderItem} [pageData]
 * @prop {boolean} [returnParents]
 */
export interface SlugArgs {
  id?: string
  slug: string
  page?: number
  contentType?: string
  pageData?: RenderItem
  returnParents?: boolean
}

/**
 * @typedef {object} SlugReturn
 * @prop {string} slug
 * @prop {import('../../global/globalTypes').ConfigParent[]} parents
 */
export interface SlugReturn {
  slug: string
  parents: ConfigParent[]
}
