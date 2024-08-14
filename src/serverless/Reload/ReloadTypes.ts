/**
 * Serverless - Reload Types
 */

/* Imports */

import type { Config } from '../../config/configTypes.js'
import type { Generic, GenericStrings } from '../../global/globalTypes.js'

/**
 * @typedef {object} ReloadArgs
 * @prop {Request} request
 * @prop {string} functionPath
 * @prop {function} next
 * @prop {GenericStrings} env
 * @prop {Config} siteConfig
 */
export interface ReloadArgs {
  request: Request
  functionPath: string
  next: Function
  env: GenericStrings
  siteConfig: Config
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
