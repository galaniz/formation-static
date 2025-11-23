/**
 * Utils - Tag Types
 */

/* Imports */

import type { RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {function} TagGet
 * @param {RenderItem} item
 * @param {string} id
 * @return {TagGetReturn|undefined}
 */
export type TagGet = (item: RenderItem, id: string) => TagGetReturn | undefined

/**
 * @typedef {function} TagExists
 * @param {RenderItem} item
 * @param {string} id
 * @return {boolean}
 */
export type TagExists = (item: RenderItem, id: string) => boolean

/**
 * @typedef {object} TagGetReturn
 * @prop {string} id
 */
export interface TagGetReturn {
  id: string
}
