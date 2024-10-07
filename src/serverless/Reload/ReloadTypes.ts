/**
 * Serverless - Reload Types
 */

/* Imports */

import type { Config } from '../../config/configTypes.js'
import type { Generic, GenericStrings } from '../../global/globalTypes.js'
import type { getAllContentfulData } from '../../utils/contentful/contentfulData.js'
import type { getAllWordPressData } from '../../utils/wordpress/wordpressData.js'

/**
 * @typedef {object} ReloadArgs
 * @prop {Request} request
 * @prop {string} functionPath
 * @prop {function} next
 * @prop {GenericStrings} env
 * @prop {Config} siteConfig
 * @prop {function} getData - getAllContentfulData | getAllWordPressData
 */
export interface ReloadArgs {
  request: Request
  functionPath: string
  next: Function
  env: GenericStrings
  siteConfig: Config
  getData: typeof getAllContentfulData | typeof getAllWordPressData
}

/**
 * @typedef ReloadQuery
 * @type {Generic}
 * @prop {string} [page]
 * @prop {string} [filters]
 */
export interface ReloadQuery extends Generic {
  page?: string
  filters?: string
}
