/**
 * Utils - Tag Types
 */

/* Imports */

import type { RenderItem } from '../../render/renderTypes.js'

/**
 * @typedef {function} TagGetMethod
 * @param {RenderItem} item
 * @param {string} id
 * @return {TagGetReturn|undefined}
 */
export type TagGet = (item: RenderItem, id: string) => TagGetReturn | undefined

/**
 * @typedef {function} TagExistsMethod
 * @param {RenderItem} item
 * @param {string} id
 * @return {boolean}
 */
export type TagExists = (item: RenderItem, id: string) => boolean

/**
 * @typedef {object} TagGetReturn
 * @prop {string} id
 * @prop {string} name
 */
export interface TagGetReturn {
  id: string
  name: string
}
