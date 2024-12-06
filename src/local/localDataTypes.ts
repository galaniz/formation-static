
/**
 * Utils - Local Data Types
 */

/* Imports */

import type { RenderItem, RenderAllData } from '../render/renderTypes.js'

/**
 * @typedef {Object<string, RenderItem>} LocalData
 */
export type LocalData = Record<string, RenderItem>

/**
 * @typedef {object} LocalDataParams
 * @prop {boolean} [all]
 * @prop {string} [id]
 */
export interface LocalDataParams {
  all?: boolean
  id?: string
}

/**
 * @typedef {function} LocalDataFilter
 * @param {LocalData} data
 * @return {LocalData}
 */
export type LocalDataFilter = (data: LocalData) => LocalData

/**
 * @typedef {function} LocalAllDataFilter
 * @param {RenderAllData} data
 * @return {RenderAllData}
 */
export type LocalAllDataFilter = (args: RenderAllData) => RenderAllData

/**
 * @typedef {object} AllLocalDataArgs
 * @prop {object} [resolveProps]
 * @prop {string[]} resolveProps.image
 * @prop {string[]} resolveProps.data
 * @prop {object} [excludeProps]
 * @prop {string[]} excludeProps.data
 * @prop {object} excludeProps.archive
 * @prop {string[]} excludeProps.archive.posts
 * @prop {string[]} excludeProps.archive.terms
 * @prop {LocalDataFilter} [filterData]
 * @prop {LocalAllDataFilter} [filterAllData]
 */
export interface AllLocalDataArgs {
  resolveProps?: {
    image: string[]
    data: string[]
  }
  excludeProps?: {
    data: string[]
    archive: {
      posts: string[]
      terms: string[]
    }
  }
  filterData?: LocalDataFilter
  filterAllData?: LocalAllDataFilter
}
