/**
 * Utils - Data Source Types
 */

/* Imports */

import type { Source } from '../../global/globalTypes.js'

/**
 * @typedef {function} DataSourceCheck
 * @param {Source} source
 * @return {boolean}
 */
export type DataSourceCheck = (source?: Source) => boolean

/**
 * @typedef {function} DataSourceGet
 * @return {string}
 */
export type DataSourceGet = () => string

/**
 * @typedef {object} DataSource
 * @prop {DataSourceCheck} isContentful
 * @prop {DataSourceCheck} isWordPress
 * @prop {DataSourceCheck} isLocal
 * @prop {DataSourceGet} get
 */
export interface DataSource {
  isContentful: DataSourceCheck
  isWordPress: DataSourceCheck
  isLocal: DataSourceCheck
  get: DataSourceGet
}
