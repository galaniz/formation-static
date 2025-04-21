/**
 * Utils - Link Types
 */

/* Imports */

import type { RenderItem } from '../../render/renderTypes.js'
import type { Parent } from '../../global/globalTypes.js'

/**
 * @typedef {object} LinkSlugArgs
 * @prop {string} [id]
 * @prop {string} slug
 * @prop {number} [page]
 * @prop {string} [contentType]
 * @prop {RenderItem} [itemData]
 */
export interface LinkSlugArgs {
  id?: string
  slug: string
  page?: number
  contentType?: string
  itemData?: RenderItem
}

/**
 * @typedef {object} LinkSlugReturn
 * @prop {string} slug
 * @prop {Parent[]} parents
 */
export interface LinkSlugReturn {
  slug: string
  parents: Parent[]
}

/**
 * @typedef {string|LinkSlugReturn} LinkSlugReturnType
 */
export type LinkSlugReturnType<T extends boolean> = T extends true ? LinkSlugReturn : string

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
  type: keyof Partial<LinkShare>
  link: string
}

/**
 * @typedef {function} LinkSlugPartsFilter
 * @param {string[]} parts
 * @param {LinkSlugArgs} args
 * @returns {string[]}
 */
export type LinkSlugPartsFilter = (parts: string[], args: LinkSlugArgs) => string[]

/**
 * @typedef {function} LinkSlugFilter
 * @param {string} slug
 * @param {LinkSlugArgs} args
 * @returns {string}
 */
export type LinkSlugFilter = (slug: string, args: LinkSlugArgs) => string
