
/**
 * Local - Data Types
 */

/* Imports */

import type { RenderItem } from '../render/renderTypes.js'

/**
 * @typedef {Object<string, RenderItem>} LocalData
 */
export type LocalData = Record<string, RenderItem>

/**
 * @typedef {Object<string|number, *>} LocalDataItem
 */
export type LocalDataItem = Record<string | number, unknown>

/**
 * @typedef {object} LocalDataArgs
 * @prop {string} key
 * @prop {string[]} [refProps]
 * @prop {string[]} [imageProps]
 * @prop {string[]} [unsetProps]
 */
export interface LocalDataArgs {
  key: string
  refProps?: string[]
  imageProps?: string[]
  unsetProps?: string[]
}

/**
 * @typedef {object} AllLocalDataArgs
 * @prop {string[]} [refProps]
 * @prop {string[]} [imageProps]
 * @prop {string[]} [unsetProps]
 */
export interface AllLocalDataArgs {
  refProps?: string[]
  imageProps?: string[]
  unsetProps?: string[]
}
