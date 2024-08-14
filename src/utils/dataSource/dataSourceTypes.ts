/**
 * Utils - Data Source Types
 */

/**
 * @typedef {function} DataSourceCheck
 * @param {string} source
 * @return {boolean}
 */
export type DataSourceCheck = (source?: string) => boolean

/**
 * @typedef {function} DataSourceGet
 * @return {string}
 */
export type DataSourceGet = () => string

/**
 * @typedef {object} DataSource
 * @prop {DataSourceCheck} isContentful
 * @prop {DataSourceCheck} isStatic
 * @prop {DataSourceGet} get
 */
export interface DataSource {
  isContentful: DataSourceCheck
  isWordPress: DataSourceCheck
  isStatic: DataSourceCheck
  get: DataSourceGet
}
