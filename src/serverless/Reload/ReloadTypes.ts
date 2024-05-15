/**
 * Serverless - Reload Types
 */

/* Imports */

import type { Config } from '../../config/configTypes'
import type { Generic, GenericStrings } from '../../global/globalTypes'

/**
 * @typedef {object} ReloadArgs
 * @prop {Request} request
 * @prop {string} functionPath
 * @prop {function} next
 * @prop {import('../../global/globalTypes').GenericStrings} env
 * @prop {import('../../config/configTypes').Config} siteConfig
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
 * @type {import('../../config/configTypes').Generic}
 * @prop {string} [page]
 * @prop {string} [filters]
 */
export interface ReloadQuery extends Generic {
  page?: string
  filters?: string
}
