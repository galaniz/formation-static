/**
 * Utils - Tag Types
 */

/* Imports */

import type { RenderItem } from '../../render/renderTypes'

/**
 * @typedef {function} TagGetMethod
 * @param {RenderItem} obj
 * @param {string} id
 * @return {TagGetReturn|undefined}
 */
export type TagGet = (obj: RenderItem, id: string) => TagGetReturn | undefined

/**
 * @typedef {function} TagExistsMethod
 * @param {RenderItem} obj
 * @param {string} id
 * @return {boolean}
 */
export type TagExists = (obj: RenderItem, id: string) => boolean

/**
 * @typedef {object} TagGetReturn
 * @prop {string} id
 * @prop {string} name
 */
export interface TagGetReturn {
  id: string
  name: string
}
